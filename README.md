# Smart Tutor - Educational Chatbot

A beautiful, interactive educational chatbot that provides personalized tutoring for children based on their learning cluster. Built with Flask, Google Gemini AI, and modern web technologies.

## Features

- 🎯 **Personalized Learning**: Adapts teaching style based on 4 different student clusters
- 🎨 **Beautiful Interface**: Child-friendly, responsive design with animations
- 🧠 **Smart Tutoring**: Uses Google Gemini AI for intelligent, contextual responses
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ♿ **Accessibility**: Built with accessibility best practices
- 🔒 **Secure**: API keys stored in environment variables

## Student Clusters

1. **Cluster 0 - Persistent but Ineffective**: Students who try hard but struggle, need extra encouragement
2. **Cluster 1 - Engaged & High-Achieving**: Students who perform well but enjoy challenges
3. **Cluster 2 - Independent**: Highly capable students who prefer solving problems alone
4. **Cluster 3 - Proactive & Coachable**: Students who learn well from hints and are highly engaged

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp env_example.txt .env

# Edit .env and add your actual API key
GOOGLE_API_KEY=your_actual_google_api_key_here
SECRET_KEY=your_secret_key_here
```

**Important**: Never commit your actual API key to version control!

### 3. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 4. Run the Application

```bash
python app.py
```

The app will be available at `http://localhost:5001`

## Project Structure

```
chatbot/
├── app.py                 # Main Flask application
├── config.py             # Configuration and environment variables
├── requirements.txt      # Python dependencies
├── templates/
│   └── index.html       # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css    # Beautiful, responsive CSS
│   └── js/
│       └── script.js    # Interactive JavaScript functionality
├── env_example.txt      # Environment variables template
└── README.md            # This file
```

## How It Works

1. **Cluster Selection**: Students choose their learning style from 4 clusters
2. **Session Start**: Creates a unique chat session with the selected cluster
3. **Personalized Tutoring**: The AI adapts its teaching approach based on the cluster
4. **Interactive Chat**: Students can ask questions and receive guided responses
5. **Session Management**: Each session maintains context and learning history

## Deployment Options

### Local Development
```bash
python app.py
```

### Production Deployment

#### Option 1: Traditional Server
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Option 2: Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

#### Option 3: Cloud Platforms
- **Heroku**: Add `gunicorn` to requirements.txt
- **Google Cloud Run**: Use the Dockerfile above
- **AWS Elastic Beanstalk**: Deploy as Python application
- **Vercel**: Use their Python runtime

## Security Considerations

- ✅ API keys stored in environment variables
- ✅ Input validation and sanitization
- ✅ Session management with unique IDs
- ✅ Error handling without exposing sensitive information

## Customization

### Changing the System Prompt
Edit the `SYSTEM_PROMPT` variable in `app.py` to modify the AI's behavior.

### Styling
Modify `static/css/style.css` to change colors, fonts, and layout.

### Adding New Clusters
1. Update the system prompt in `app.py`
2. Add new cluster cards in `templates/index.html`
3. Update the JavaScript cluster handling in `static/js/script.js`

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your `.env` file exists and contains the correct API key
2. **Port Already in Use**: Change the port in `app.py` or kill the process using the port
3. **Module Not Found**: Run `pip install -r requirements.txt`

### Debug Mode
The app runs in debug mode by default. For production, set `debug=False` in `app.py`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Happy Learning! 🎓✨**
