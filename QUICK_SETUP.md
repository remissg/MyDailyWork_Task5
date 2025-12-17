# 🚀 Quick Setup - Production Deployment

## ✅ Current Status
- **Backend**: Deployed on Render ✅
- **Frontend**: Deployed on Vercel ✅ (needs env var update)

## 📋 Next Step: Configure Vercel

### 1. Add Environment Variable
Go to: https://vercel.com/dashboard

1. Select project: **pmspro**
2. Settings → Environment Variables
3. Add:
   - Name: `VITE_API_URL`
   - Value: `https://pms-backend-xdju.onrender.com/api`
   - Environment: Select **all** (Production, Preview, Development)
4. Click **Save**

### 2. Redeploy
- Go to **Deployments** tab
- Click **"..."** on latest → **"Redeploy"**

### 3. Test
- Visit: https://pmspro.vercel.app/
- Try login/register
- Open DevTools (F12) → Network tab
- Verify requests go to: `https://pms-backend-xdju.onrender.com`

## 🏠 Local Development

Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

Then run:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🔗 URLs
- Frontend: https://pmspro.vercel.app/
- Backend: https://pms-backend-xdju.onrender.com
- Backend API: https://pms-backend-xdju.onrender.com/api

---
See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
