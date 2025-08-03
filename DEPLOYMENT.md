# 🚀 Deployment Guide

This guide will help you deploy your Finance Tracker application to Vercel (frontend) and Render (backend).

## 📋 Prerequisites

- GitHub repository with your code
- MySQL database (already deployed)
- Vercel account (free)
- Render account (free)

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Connect to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository

### 1.2 Configure Backend Service
- **Name**: `finance-tracker-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### 1.3 Set Environment Variables
Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=your-mysql-database
DB_PORT=3306
REDIS_URL=your-redis-url (optional)
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### 1.4 Deploy
Click "Create Web Service" and wait for deployment.

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

### 2.2 Configure Frontend
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2.3 Set Environment Variables
Add this environment variable in Vercel dashboard:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### 2.4 Deploy
Click "Deploy" and wait for deployment.

## 🔧 Step 3: Update URLs

### 3.1 Update Backend CORS
After getting your Vercel frontend URL, update the `CORS_ORIGIN` environment variable in Render:

```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### 3.2 Update Frontend API URL
After getting your Render backend URL, update the `VITE_API_BASE_URL` environment variable in Vercel:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

## 🔄 Step 4: Redeploy

### 4.1 Redeploy Backend
1. Go to your Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Update the `CORS_ORIGIN` variable
5. Click "Save Changes" (auto-redeploys)

### 4.2 Redeploy Frontend
1. Go to your Vercel dashboard
2. Click on your frontend project
3. Go to "Settings" → "Environment Variables"
4. Update the `VITE_API_BASE_URL` variable
5. Go to "Deployments" and redeploy

## ✅ Step 5: Test Your Application

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Visit your Render URL + `/api/auth/login`
3. **Test API Documentation**: Visit your Render URL + `/api-docs`
4. **Test Database**: Try registering a new user
5. **Test Analytics**: Check if charts load properly

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` in backend matches your frontend URL exactly
   - Check for trailing slashes

2. **Database Connection Errors**
   - Verify all database environment variables are correct
   - Ensure your MySQL database allows external connections

3. **Build Errors**
   - Check if all dependencies are in `package.json`
   - Ensure Node.js version compatibility

4. **Environment Variables**
   - Double-check all variable names and values
   - Ensure no extra spaces or quotes

## 📚 API Documentation

Your API includes comprehensive Swagger/OpenAPI documentation:

- **Documentation URL**: `https://your-backend-url.onrender.com/api-docs`
- **Features**:
  - Interactive API explorer
  - Request/response examples
  - Authentication testing
  - Schema definitions
  - Error code documentation

### API Endpoints Covered:
- **Authentication**: `/api/auth/*` (login, register)
- **Transactions**: `/api/transactions/*` (CRUD operations)
- **Analytics**: `/api/analytics/*` (dashboard, trends, breakdowns)
- **Users**: `/api/users/*` (admin only)

### Testing APIs:
1. Visit the Swagger UI at `/api-docs`
2. Click "Authorize" to add your JWT token
3. Test endpoints directly from the browser
4. View request/response schemas

## 🔒 Security Notes

1. **JWT Secret**: Use a strong, random string
2. **Database**: Use strong passwords
3. **CORS**: Only allow your specific frontend domain
4. **Environment Variables**: Never commit secrets to Git
5. **API Documentation**: Available at `/api-docs` (no authentication required for viewing)

## 📞 Support

If you encounter issues:
1. Check Render logs in the dashboard
2. Check Vercel logs in the dashboard
3. Verify all environment variables are set correctly
4. Test API endpoints directly using tools like Postman

---

**Your application should now be live! 🎉** 