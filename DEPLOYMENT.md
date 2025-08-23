# 🚀 Smart Tutor Deployment Guide

## Quick Start (Local Development)

### 1. **Activate Virtual Environment**
```bash
source venv/bin/activate
```

### 2. **Run the Application**
```bash
python run.py
```

### 3. **Access the App**
Open your browser and go to: `http://localhost:5000`

---

## 🌐 Production Deployment Options

### Option 1: Traditional Server (Recommended for Beginners)

#### Prerequisites
- Linux/Unix server (Ubuntu 20.04+ recommended)
- Python 3.8+
- Nginx (for reverse proxy)

#### Steps
1. **Upload your code to the server**
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   pip install gunicorn
   ```

3. **Create a systemd service file:**
   ```bash
   sudo nano /etc/systemd/system/smarttutor.service
   ```

   Add this content:
   ```ini
   [Unit]
   Description=Smart Tutor Educational Chatbot
   After=network.target

   [Service]
   User=your_username
   WorkingDirectory=/path/to/your/chatbot
   Environment="PATH=/path/to/your/chatbot/venv/bin"
   ExecStart=/path/to/your/chatbot/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 app:app
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

4. **Start the service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start smarttutor
   sudo systemctl enable smarttutor
   ```

5. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/smarttutor
   ```

   Add this content:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

6. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/smarttutor /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### Option 2: Docker Deployment

#### 1. **Create Dockerfile**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run the application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

#### 2. **Build and Run**
```bash
# Build the image
docker build -t smarttutor .

# Run the container
docker run -d -p 5000:5000 --env-file .env --name smarttutor-app smarttutor

# Check logs
docker logs smarttutor-app
```

---

### Option 3: Cloud Platform Deployment

#### Heroku
1. **Install Heroku CLI**
2. **Add gunicorn to requirements.txt:**
   ```
   gunicorn==20.1.0
   ```
3. **Create Procfile:**
   ```
   web: gunicorn app:app
   ```
4. **Deploy:**
   ```bash
   heroku create your-app-name
   git push heroku main
   heroku config:set GOOGLE_API_KEY=your_api_key
   ```

#### Google Cloud Run
1. **Build and push to Google Container Registry:**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/smarttutor
   ```
2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy smarttutor --image gcr.io/PROJECT_ID/smarttutor --platform managed
   ```

#### AWS Elastic Beanstalk
1. **Create application in AWS Console**
2. **Upload your code as a ZIP file**
3. **Set environment variables in the console**

---

## 🔒 Security Checklist

- [ ] API key stored in environment variables (`.env` file)
- [ ] `.env` file added to `.gitignore`
- [ ] Debug mode disabled in production (`debug=False`)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Firewall configured to only allow necessary ports
- [ ] Regular security updates applied

---

## 📊 Monitoring and Maintenance

### Health Check Endpoint
Add this to your `app.py`:
```python
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})
```

### Logging
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

### Performance Monitoring
- Use tools like New Relic, DataDog, or AWS CloudWatch
- Monitor response times and error rates
- Set up alerts for downtime

---

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   lsof -i :5000
   kill -9 <PID>
   ```

2. **API key errors:**
   - Check `.env` file exists
   - Verify API key is correct
   - Ensure environment variables are loaded

3. **Import errors:**
   ```bash
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Permission denied:**
   ```bash
   chmod +x run.py
   sudo chown -R $USER:$USER /path/to/chatbot
   ```

---

## 📈 Scaling Considerations

- **Horizontal scaling:** Use load balancer with multiple instances
- **Database:** Consider adding Redis for session storage
- **CDN:** Use CloudFlare or AWS CloudFront for static assets
- **Caching:** Implement response caching for common queries

---

## 🎯 Next Steps

1. **Choose your deployment option** based on your needs
2. **Set up monitoring** and logging
3. **Configure SSL/HTTPS** for production
4. **Set up automated backups** if using a database
5. **Implement CI/CD** pipeline for automated deployments

---

**Need help?** Check the main README.md or create an issue in the repository!
