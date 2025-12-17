# PMS Pro - Deployment Guide

## Overview
Your PMS application is deployed with:
- **Backend**: Render → https://pms-backend-xdju.onrender.com
- **Frontend**: Vercel → https://pmspro.vercel.app/

## Problem Fixed
✅ Replaced all hardcoded `http://localhost:5000` URLs with environment-aware constants
✅ Created centralized configuration for API URLs
✅ Configured frontend to connect to Render backend

## Current Deployment Status

### ✅ Backend (Render)
Your backend is already deployed at: **https://pms-backend-xdju.onrender.com**

Environment variables configured on Render:
```
PORT=5000
MONGO_URI=mongodb+srv://maitijoydip888_db_user:***@cluster0.gvarcoa.mongodb.net/pms_db
JWT_SECRET=***
JWT_EXPIRES_IN=5d
EMAIL_USER=maitijoydip888@gmail.com
EMAIL_PASS=***
CLIENT_URL=https://pmspro.vercel.app
```

### 🔄 Frontend (Vercel) - Needs Update
Your frontend is deployed at: **https://pmspro.vercel.app/**

**ACTION REQUIRED**: Configure environment variable on Vercel

## Step-by-Step: Connect Frontend to Backend


### Step 1: Configure Vercel Environment Variable

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Select your project**: `pmspro`

3. **Go to Settings** → **Environment Variables**

4. **Add the following environment variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://pms-backend-xdju.onrender.com/api`
   - **Environment**: Select all (Production, Preview, Development)

5. **Click "Save"**

### Step 2: Redeploy Your Frontend

After adding the environment variable, you need to trigger a new deployment:

**Option A: Redeploy from Vercel Dashboard**
1. Go to the **Deployments** tab
2. Click the "..." menu on the latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"** and click **"Redeploy"**

**Option B: Push a new commit** (triggers automatic deployment)
```bash
git add .
git commit -m "Configure production backend URL"
git push
```

### Step 3: Verify the Deployment

1. Wait for the deployment to complete (usually 1-2 minutes)
2. Visit **https://pmspro.vercel.app/**
3. Try to log in or register
4. Open browser DevTools (F12) → Network tab
5. Verify that API requests are going to `https://pms-backend-xdju.onrender.com/api`

## Local Development Setup

For local development, you need to create a `.env.local` file in the `client` folder:

1. **Navigate to the client folder**:
   ```bash
   cd client
   ```

2. **Create `.env.local`** (this file is gitignored):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
```

This way:
- **Local development** → Uses `http://localhost:5000/api` (your local backend)
- **Production** → Uses `https://pms-backend-xdju.onrender.com/api` (Render backend)

## Important Notes

### Backend CORS Configuration
Your backend is already configured to accept requests from your frontend:
```javascript
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
```

Make sure `CLIENT_URL=https://pmspro.vercel.app` is set in your Render environment variables (already done ✅).

### Render Free Tier Notice
⚠️ **Important**: If you're using Render's free tier, the backend server will spin down after 15 minutes of inactivity. The first request after inactivity may take 30-60 seconds to wake up the server.

To mitigate this, you can:
1. Upgrade to Render's paid tier ($7/month)
2. Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 5 minutes
3. Accept the cold start delay for free hosting



## Changes Made

### 1. Created `client/src/config/constants.js`
Centralized configuration for API and server URLs:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');
```

### 2. Updated Files
Replaced hardcoded `http://localhost:5000` with `SERVER_BASE_URL` in:
- `client/src/components/Layout/Header.jsx`
- `client/src/pages/Settings.jsx`
- `client/src/pages/Projects.jsx`
- `client/src/pages/ProjectDetails.jsx`
- `client/src/components/Modals/TaskDetailsModal.jsx`

### 3. Created `server/vercel.json`
Configuration for deploying Node.js backend to Vercel as serverless functions.

## Testing Locally

Before deploying, test locally with environment variables:

1. **Start backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start frontend** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

3. Create `client/.env.local`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Test login/register and verify that avatar images load correctly

## Troubleshooting

### Issue: Images not loading in production
- Verify `VITE_API_URL` is set correctly in Vercel frontend environment variables
- Check browser console for the actual URL being requested
- Ensure the backend URL is accessible (not localhost)

### Issue: CORS errors in production
- Verify `CLIENT_URL` environment variable in backend Vercel settings
- Should be set to `https://pmspro.vercel.app` (no trailing slash)

### Issue: API requests failing
- Check that `VITE_API_URL` includes `/api` at the end
- Verify the backend deployment is successful and running
- Check Vercel function logs for errors

## Environment Variables Summary

### Backend (Render) ✅ Already Configured
```
PORT=5000
MONGO_URI=mongodb+srv://maitijoydip888_db_user:***@cluster0.gvarcoa.mongodb.net/pms_db
JWT_SECRET=***
JWT_EXPIRES_IN=5d
EMAIL_USER=maitijoydip888@gmail.com
EMAIL_PASS=***
CLIENT_URL=https://pmspro.vercel.app
```

### Frontend (Vercel) 🔄 Needs Configuration
```
VITE_API_URL=https://pms-backend-xdju.onrender.com/api
```

### Frontend Local Development
Create `client/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

## Quick Action Checklist

- [x] Backend deployed to Render
- [x] Backend environment variables configured
- [ ] **Add `VITE_API_URL` to Vercel** → [Go to Vercel Settings](https://vercel.com/dashboard)
- [ ] **Redeploy frontend on Vercel**
- [ ] **Test production login/register** at https://pmspro.vercel.app/

## Testing Production Deployment

After completing the Vercel configuration:

1. **Visit**: https://pmspro.vercel.app/
2. **Open DevTools** (F12) → Network tab
3. **Try to login or register**
4. **Check Network tab**: API requests should show `https://pms-backend-xdju.onrender.com/api/auth/login`
5. **If successful**: You should see a 200 response and be logged in!

## Troubleshooting

### Issue: Still getting ERR_CONNECTION_REFUSED
- ✅ Verify environment variable is added in Vercel
- ✅ Make sure you redeployed after adding the variable
- ✅ Check Vercel build logs for any errors
- ✅ Clear browser cache and try again

### Issue: CORS errors
- ✅ Verify `CLIENT_URL=https://pmspro.vercel.app` in Render backend
- ✅ Make sure there's no trailing slash in CLIENT_URL
- ✅ Restart your Render backend service

### Issue: 502 Bad Gateway from Render
- ✅ Check Render logs for backend errors
- ✅ Verify MongoDB connection string is correct
- ✅ If on free tier, wait for the server to wake up (30-60 seconds)

### Issue: Images/avatars not loading
- ✅ Check the image URL in DevTools Network tab
- ✅ Should be `https://pms-backend-xdju.onrender.com/uploads/...`
- ✅ If showing `localhost:5000`, the environment variable wasn't applied



---

**Note**: Socket.IO connections will automatically use the API URL (without `/api`) for WebSocket connections, so no additional configuration is needed for real-time features.
