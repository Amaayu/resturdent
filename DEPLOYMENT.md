# Deployment Guide

## Production Deployment Checklist

### 1. Environment Configuration

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-app
JWT_SECRET=generate-a-strong-random-secret-key-here
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### 2. Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable HTTPS for both frontend and backend
- [ ] Update CORS settings to allow only your frontend domain
- [ ] Review and update rate limiting settings
- [ ] Enable MongoDB authentication
- [ ] Set secure cookie settings (already configured for production)
- [ ] Review and sanitize all user inputs
- [ ] Add input validation middleware
- [ ] Set up proper error logging (consider Sentry)

### 3. Database Setup (MongoDB Atlas)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add database user with password
4. Whitelist IP addresses (or allow from anywhere for cloud deployments)
5. Get connection string and update MONGODB_URI
6. Run seed script to populate data:
   ```bash
   npm run seed
   ```

### 4. Backend Deployment Options

#### Option A: Heroku

1. Install Heroku CLI
2. Login and create app:
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=your-frontend-url
   ```

4. Create Procfile in server directory:
   ```
   web: node src/server.js
   ```

5. Deploy:
   ```bash
   git subtree push --prefix server heroku main
   ```

#### Option B: Railway

1. Sign up at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Set root directory to `server`
5. Add environment variables in Railway dashboard
6. Deploy automatically on push

#### Option C: DigitalOcean App Platform

1. Sign up at https://www.digitalocean.com
2. Create new app
3. Connect GitHub repository
4. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `node src/server.js`
   - Source Directory: `server`
5. Add environment variables
6. Deploy

#### Option D: AWS EC2

1. Launch EC2 instance (Ubuntu recommended)
2. SSH into instance
3. Install Node.js and MongoDB
4. Clone repository
5. Install dependencies
6. Set up PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name restaurant-api
   pm2 startup
   pm2 save
   ```
7. Configure Nginx as reverse proxy
8. Set up SSL with Let's Encrypt

### 5. Frontend Deployment Options

#### Option A: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Build the app:
   ```bash
   cd client
   npm run build
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard
5. Configure build settings:
   - Framework: Vite
   - Root Directory: client
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Option B: Netlify

1. Build the app:
   ```bash
   cd client
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

4. Or connect GitHub repository in Netlify dashboard
5. Configure build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

#### Option C: AWS S3 + CloudFront

1. Build the app:
   ```bash
   cd client
   npm run build
   ```

2. Create S3 bucket
3. Enable static website hosting
4. Upload dist folder contents
5. Create CloudFront distribution
6. Configure custom domain and SSL

### 6. Build Optimization

#### Backend
- Enable compression middleware
- Implement caching strategies
- Optimize database queries with indexes
- Use connection pooling for MongoDB
- Implement API response caching

#### Frontend
- Code splitting is already enabled with Vite
- Optimize images (use CDN or image optimization service)
- Enable gzip compression on server
- Implement lazy loading for routes
- Use production build: `npm run build`

### 7. Monitoring and Logging

#### Backend Monitoring
- Set up error tracking (Sentry, Rollbar)
- Implement logging (Winston, Morgan)
- Monitor API performance (New Relic, DataDog)
- Set up uptime monitoring (UptimeRobot, Pingdom)

#### Database Monitoring
- Enable MongoDB Atlas monitoring
- Set up alerts for high CPU/memory usage
- Monitor slow queries
- Regular backups

### 8. CI/CD Pipeline

#### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
          appdir: "server"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./client
```

### 9. Domain Configuration

1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Configure DNS records:
   - Frontend: Point A record to hosting provider
   - Backend: Point A record or CNAME to API server
3. Set up SSL certificates (Let's Encrypt, CloudFlare)
4. Update CORS and environment variables with new domains

### 10. Post-Deployment Testing

- [ ] Test user registration and login
- [ ] Test restaurant browsing and search
- [ ] Test cart functionality
- [ ] Test order placement
- [ ] Test admin dashboard
- [ ] Test real-time updates (Socket.io)
- [ ] Test on mobile devices
- [ ] Test payment flow (COD)
- [ ] Check all static pages
- [ ] Verify email notifications (if implemented)
- [ ] Load testing with tools like Apache Bench or k6

### 11. Backup Strategy

1. Enable automated MongoDB backups
2. Set up regular database snapshots
3. Store backups in separate location
4. Test restore procedures
5. Document backup and restore process

### 12. Scaling Considerations

#### Horizontal Scaling
- Use load balancer (AWS ELB, Nginx)
- Deploy multiple backend instances
- Use Redis for session management
- Implement database replication

#### Vertical Scaling
- Upgrade server resources as needed
- Optimize database queries
- Implement caching layer (Redis)
- Use CDN for static assets

### 13. Maintenance

- Regular dependency updates
- Security patches
- Database optimization
- Performance monitoring
- User feedback collection
- Feature updates based on analytics

## Quick Deploy Commands

### Build Frontend
```bash
cd client
npm run build
```

### Test Production Build Locally
```bash
# Backend
cd server
NODE_ENV=production node src/server.js

# Frontend (after build)
cd client
npm run preview
```

### Environment Variables Template

Create a `.env.production` file for reference:

```env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret-key
NODE_ENV=production
CLIENT_URL=https://your-domain.com

# Frontend
VITE_API_URL=https://api.your-domain.com/api
```

## Support

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test API endpoints
4. Check CORS configuration
5. Verify database connection
6. Review security settings

## Recommended Stack

- **Frontend:** Vercel
- **Backend:** Railway or Heroku
- **Database:** MongoDB Atlas
- **CDN:** CloudFlare
- **Monitoring:** Sentry + UptimeRobot
- **Analytics:** Google Analytics or Plausible

This setup provides:
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Auto-scaling
- ✅ SSL included
- ✅ Good performance
- ✅ Reliable uptime

Good luck with your deployment! 🚀
