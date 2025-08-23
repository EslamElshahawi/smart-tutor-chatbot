from flask import Flask, render_template, request, jsonify, session
import google.generativeai as genai
import os
import uuid

# Load environment variables
from dotenv import load_dotenv
if os.path.exists('.env'):
    load_dotenv()

app = Flask(__name__)

# Get API key from environment (works for both local .env and hosting services)
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY environment variable is required. "
        "Set it in your .env file (local) or hosting service environment variables."
    )

# Set Flask secret key
app.secret_key = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

# Configure Google Generative AI
genai.configure(api_key=GOOGLE_API_KEY)

# System prompt for the educational tutor
SYSTEM_PROMPT = """
You are a patient and friendly educational tutor for children between the ages of 6 and 12. Your primary goal is to help them learn by guiding them towards the answer, not by giving them the direct solution.

Key Rules:
1- No Direct Answers :
   Do not give the full answer unless the student is stuck after 3 hints
   break the problem into smaller steps and ask questions that lead to the answer
2- Encourage and Motivate :
   Use positive and encouraging language and Praise their effort and make the learning process feel fun
   Always praise effort: "Great try", "Nice step"
3- Context Awareness :
   Remember the Conversation and Keep track of the conversation's context
   Refer to previous questions or topics to create a continuous and personalized learning experience
4- Simple Language :
   Use Simple Language and Keep your vocabulary and sentence structure simple and easy for a child to understand
5- Handling Wrong Answers :
   If the student gives you a wrong answer , tell them gently "That is a good try but not quite"  and direct them to the right answer 
6- Adaptation by Cluster: 
   our student are clustered to 4 clusters so customize your hints and questions based on the cluster :
   cluster 0: Persistent but Ineffective Students 
       - These students try hard but struggle a lot
       - They get frustrated easily so keep tone very encouraging
       - Give 3 to 4 very simple hints with examples
       - Repeat key ideas often and ask small guiding questions
    Cluster 1: Engaged and High-Achieving Students
       - These students perform well but feel challenged
       - Give 1 or 2 challenging guiding questions before hints
       - Provide hints that make them think, not too easy
       - Use positive reinforcement like: "You are doing great even if it feels tough"
    Cluster 2: Independent Students
       - These students are highly capable and prefer solving problems alone
       - Give minimal hints and ask guiding questions
       - Keep responses short and let them lead the process
       - Encourage independence: "You are almost there, think one more step"
    Cluster 3: Proactive and Coachable Students
       - These students learn well from hints and are highly engaged
       - Give 2 to 3 hints in steps, each with a clear example
       - Ask questions after each hint to confirm understanding
       - Use enthusiastic encouragement like: "Nice! Lets try the next step together"
"""

# Store chat sessions
chat_sessions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_session', methods=['POST'])
def start_session():
    data = request.get_json()
    cluster = data.get('cluster', 0)
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    
    # Initialize chat with cluster information
    cluster_info = f"I am a cluster {cluster} student. "
    initial_message = cluster_info + "I'm ready to learn!"
    
    # Start chat session
    chat = genai.GenerativeModel('gemini-1.5-flash').start_chat(history=[
        {"role": "user", "parts": [SYSTEM_PROMPT]},
        {"role": "model", "parts": ["I understand my role. I am ready to begin."]},
        {"role": "user", "parts": [initial_message]},
    ])
    
    # Get initial response
    try:
        response = chat.send_message(initial_message)
        initial_response = response.text
    except Exception as e:
        initial_response = "Hello! I'm your tutor. What can I help you with today?"
    
    # Store chat session
    chat_sessions[session_id] = {
        'chat': chat,
        'cluster': cluster,
        'messages': [
            {"role": "user", "content": initial_message},
            {"role": "assistant", "content": initial_response}
        ]
    }
    
    return jsonify({
        'session_id': session_id,
        'message': initial_response
    })

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    session_id = data.get('session_id')
    user_message = data.get('message')
    
    if session_id not in chat_sessions:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    chat_session = chat_sessions[session_id]
    chat = chat_session['chat']
    
    try:
        response = chat.send_message(user_message)
        assistant_message = response.text
        
        # Store messages
        chat_session['messages'].append({"role": "user", "content": user_message})
        chat_session['messages'].append({"role": "assistant", "content": assistant_message})
        
        return jsonify({
            'message': assistant_message,
            'session_id': session_id
        })
        
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/get_history/<session_id>')
def get_history(session_id):
    if session_id not in chat_sessions:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    return jsonify({
        'messages': chat_sessions[session_id]['messages'],
        'cluster': chat_sessions[session_id]['cluster']
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
