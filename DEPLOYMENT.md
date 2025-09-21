# Deployment Guide - SehatSathi

This guide provides step-by-step instructions for deploying SehatSathi to production environments.

## 🚀 Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Backend Deployment on Railway

1. **Prepare Backend for Production**
   \`\`\`python
   # In backend/main.py, update CORS origins
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:3000",  # Development
           "https://your-app.vercel.app",  # Production frontend
           "https://sehatsathi.vercel.app"  # Your actual domain
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   # Update SECRET_KEY for production
   SECRET_KEY = os.getenv("SECRET_KEY", "your-production-secret-key-here")
   \`\`\`

2. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

3. **Deploy Backend**
   \`\`\`bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to backend directory
   cd backend
   
   # Initialize Railway project
   railway init
   
   # Deploy
   railway up
   \`\`\`

4. **Set Environment Variables on Railway**
   \`\`\`bash
   railway variables set SECRET_KEY=your-super-secret-production-key
   railway variables set DATABASE_URL=sqlite:///./sehat_sathi.db
   \`\`\`

#### Frontend Deployment on Vercel

1. **Update API Configuration**
   \`\`\`javascript
   // In lib/utils.js
   export const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-railway-app.railway.app'  // Your Railway backend URL
     : 'http://localhost:8000'
   \`\`\`

2. **Deploy to Vercel**
   \`\`\`bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   
   # Follow prompts to configure deployment
   \`\`\`

3. **Set Environment Variables on Vercel**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-railway-app.railway.app`

### Option 2: DigitalOcean Droplet (Full Stack)

#### Server Setup

1. **Create Droplet**
   - Ubuntu 22.04 LTS
   - Minimum 2GB RAM
   - Enable monitoring and backups

2. **Initial Server Configuration**
   \`\`\`bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install required packages
   sudo apt install python3 python3-pip nodejs npm nginx certbot python3-certbot-nginx -y
   
   # Install PM2 for process management
   sudo npm install -g pm2
   \`\`\`

#### Backend Deployment

1. **Clone Repository**
   \`\`\`bash
   cd /var/www
   sudo git clone https://github.com/yourusername/sehatsathi.git
   sudo chown -R $USER:$USER sehatsathi
   cd sehatsathi
   \`\`\`

2. **Setup Python Environment**
   \`\`\`bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   \`\`\`

3. **Create Production Configuration**
   \`\`\`python
   # Create backend/config.py
   import os
   
   SECRET_KEY = os.getenv("SECRET_KEY", "your-production-secret-key")
   DATABASE_PATH = "/var/www/sehatsathi/backend/sehat_sathi.db"
   ALLOWED_ORIGINS = [
       "https://yourdomain.com",
       "https://www.yourdomain.com"
   ]
   \`\`\`

4. **Start Backend with PM2**
   \`\`\`bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'sehatsathi-backend',
       script: 'venv/bin/python',
       args: 'main.py',
       cwd: '/var/www/sehatsathi/backend',
       env: {
         SECRET_KEY: 'your-production-secret-key'
       }
     }]
   }
   EOF
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   \`\`\`

#### Frontend Deployment

1. **Build Frontend**
   \`\`\`bash
   cd /var/www/sehatsathi
   npm install
   npm run build
   \`\`\`

2. **Configure Nginx**
   \`\`\`nginx
   # Create /etc/nginx/sites-available/sehatsathi
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       # Frontend
       location / {
           root /var/www/sehatsathi/.next/static;
           try_files $uri $uri/ @nextjs;
       }
       
       location @nextjs {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   \`\`\`

3. **Enable Site and SSL**
   \`\`\`bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/sehatsathi /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   \`\`\`

4. **Start Frontend with PM2**
   \`\`\`bash
   # Add to ecosystem.config.js
   {
     name: 'sehatsathi-frontend',
     script: 'npm',
     args: 'start',
     cwd: '/var/www/sehatsathi',
     env: {
       NODE_ENV: 'production',
       PORT: 3000
     }
   }
   
   pm2 restart ecosystem.config.js
   \`\`\`

## 🔒 Security Considerations

### Production Security Checklist

1. **Environment Variables**
   \`\`\`bash
   # Never commit these to version control
   SECRET_KEY=your-super-secret-production-key-min-32-chars
   DATABASE_URL=your-production-database-url
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   \`\`\`

2. **Database Security**
   \`\`\`python
   # Use PostgreSQL for production
   # Install: pip install psycopg2-binary
   
   # Update database connection
   DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/sehatsathi")
   \`\`\`

3. **HTTPS Configuration**
   - Always use HTTPS in production
   - Configure SSL certificates
   - Update CORS origins to use HTTPS

4. **Firewall Configuration**
   \`\`\`bash
   # Configure UFW firewall
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   \`\`\`

## 📊 Monitoring and Maintenance

### Health Checks

1. **Backend Health Check**
   \`\`\`python
   # Add to main.py
   @app.get("/health")
   async def health_check():
       return {
           "status": "healthy",
           "timestamp": datetime.datetime.utcnow(),
           "version": "1.0.0"
       }
   \`\`\`

2. **Frontend Health Check**
   \`\`\`javascript
   // Add to app/api/health/route.js
   export async function GET() {
     return Response.json({
       status: 'healthy',
       timestamp: new Date().toISOString()
     })
   }
   \`\`\`

### Backup Strategy

1. **Database Backup**
   \`\`\`bash
   # Create backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   cp /var/www/sehatsathi/backend/sehat_sathi.db /backups/sehat_sathi_$DATE.db
   
   # Add to crontab for daily backups
   0 2 * * * /path/to/backup-script.sh
   \`\`\`

2. **Application Backup**
   \`\`\`bash
   # Backup entire application
   tar -czf sehatsathi_backup_$(date +%Y%m%d).tar.gz /var/www/sehatsathi
   \`\`\`

### Log Management

1. **PM2 Logs**
   \`\`\`bash
   # View logs
   pm2 logs sehatsathi-backend
   pm2 logs sehatsathi-frontend
   
   # Log rotation
   pm2 install pm2-logrotate
   \`\`\`

2. **Nginx Logs**
   \`\`\`bash
   # Access logs
   tail -f /var/log/nginx/access.log
   
   # Error logs
   tail -f /var/log/nginx/error.log
   \`\`\`

## 🔄 CI/CD Pipeline

### GitHub Actions Deployment

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS origins in backend configuration
   - Ensure frontend URL is included in allowed origins

2. **Database Connection Issues**
   - Verify database file permissions
   - Check SQLite file path in production

3. **Authentication Problems**
   - Verify JWT secret key consistency
   - Check token expiration settings

4. **Performance Issues**
   - Monitor server resources
   - Implement database indexing
   - Use caching strategies

### Support

For deployment issues:
- Check application logs: `pm2 logs`
- Monitor system resources: `htop`
- Check nginx status: `sudo systemctl status nginx`
- Verify SSL certificates: `sudo certbot certificates`
\`\`\`

```json file="" isHidden
