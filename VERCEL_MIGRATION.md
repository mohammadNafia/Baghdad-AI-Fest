# Vercel Migration Guide

## ✅ Migration Complete

This project has been successfully migrated from Azure Static Web Apps to Vercel.

## 🎯 What Changed

### 1. **Removed Azure-Specific Files**
- ❌ Deleted `.github/workflows/azure-static-web-apps-calm-coast-0cd7dff00.yml`
- ✅ Project is now platform-agnostic

### 2. **Updated Dependencies**
- **Node.js**: Upgraded from 18.20.8 → 22.20.0 (LTS)
- **Vite**: Upgraded from 6.0.5 → 7.2.4 (latest)
- **@vitejs/plugin-react**: Upgraded from 4.3.4 → 5.1.1
- **vitest**: Upgraded from 3.1.9 → 4.0.15
- **@types/node**: Upgraded from ^18 → ^22.0.0
- **Added**: `@vercel/node` for serverless functions

### 3. **Created Vercel Serverless Functions**

#### `/api/forms.ts`
Handles form submissions and retrieval:
- `POST /api/forms` - Submit attendee, speaker, or partner forms
- `GET /api/forms?type=attendees|speakers|partners` - Retrieve form data

**Features:**
- Capacity checking for attendees (250 max)
- Duplicate email detection
- Proper error handling
- CORS support

#### `/api/admin.ts`
Admin dashboard endpoints:
- `GET /api/admin/submissions` - Get all submissions with activity log
- `GET /api/admin/analytics` - Get analytics data

**Features:**
- Aggregates data from all tables
- Calculates statistics (most common occupation, top categories)
- Activity log generation
- CORS support

### 4. **Vercel Configuration**

Created `vercel.json` with:
- Build configuration for Vite
- API route rewrites
- CORS headers
- Node.js 22.x runtime for serverless functions

## 🚀 Deployment Steps

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Set Environment Variables in Vercel**

In your Vercel project settings, add:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Note**: Vercel serverless functions can also use:
- `SUPABASE_URL` (without VITE_ prefix)
- `SUPABASE_ANON_KEY` (without VITE_ prefix)

### 3. **Deploy to Vercel**

**Option A: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option B: Via GitHub Integration**
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel will auto-detect Vite configuration
4. Add environment variables
5. Deploy

### 4. **Verify Deployment**

After deployment:
- Frontend: `https://your-project.vercel.app`
- API Forms: `https://your-project.vercel.app/api/forms`
- API Admin: `https://your-project.vercel.app/api/admin/submissions`

## 📁 Project Structure

```
.
├── api/                    # Vercel Serverless Functions
│   ├── forms.ts           # Form submission endpoints
│   └── admin.ts           # Admin dashboard endpoints
├── src/
│   ├── api/               # Frontend API clients (can use Supabase directly or call /api routes)
│   ├── services/           # Business logic layer
│   └── ...
├── vercel.json            # Vercel configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## 🔄 API Usage

### Option 1: Use Serverless Functions (Recommended for Production)

```typescript
// Submit attendee form
const response = await fetch('/api/forms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'attendee',
    data: formData
  })
});

// Get all attendees
const response = await fetch('/api/forms?type=attendees');
```

### Option 2: Continue Using Supabase Directly

The frontend can still use Supabase directly via `@supabase/supabase-js`. The serverless functions are available for:
- Server-side operations
- Admin operations that need aggregation
- Operations requiring additional security

## ✨ Benefits of Vercel Migration

1. **Modern Node.js Support**: Node 22.x with full Vite 7 compatibility
2. **Better Developer Experience**: Faster builds, better error messages
3. **Serverless Functions**: Scalable backend without managing servers
4. **Global CDN**: Automatic edge deployment for fast performance
5. **Zero Configuration**: Vercel auto-detects Vite projects
6. **Environment Variables**: Easy management via dashboard
7. **Preview Deployments**: Automatic previews for every PR

## 🔧 Configuration Details

### Node.js Runtime
- **Frontend Build**: Uses Node 22.x (from `.nvmrc`)
- **Serverless Functions**: Uses Node 22.x (configured in `vercel.json`)

### Build Process
1. Vercel runs `npm install`
2. Vercel runs `npm run build` (Vite build)
3. Output directory: `dist/`
4. Serverless functions in `/api` are automatically deployed

### CORS
CORS headers are configured in `vercel.json` to allow:
- All origins (`*`)
- All standard HTTP methods
- Content-Type and Authorization headers

## 📝 Notes

- **Supabase Integration**: The serverless functions use the same Supabase instance as the frontend
- **Backward Compatibility**: Frontend code can continue using Supabase directly
- **Environment Variables**: Both `VITE_*` and non-prefixed versions work in serverless functions
- **Type Safety**: All API functions are written in TypeScript with proper types

## 🐛 Troubleshooting

### Build Fails
- Ensure Node 22.x is available (Vercel auto-detects from `.nvmrc`)
- Check that all dependencies are compatible with Node 22

### API Functions Not Working
- Verify environment variables are set in Vercel dashboard
- Check function logs in Vercel dashboard
- Ensure Supabase credentials are correct

### CORS Issues
- CORS headers are configured in `vercel.json`
- If issues persist, check browser console for specific errors

## 🎉 Next Steps

1. **Test Locally**: Run `npm run dev` and test API endpoints
2. **Deploy**: Push to GitHub and deploy via Vercel
3. **Monitor**: Check Vercel dashboard for function logs and analytics
4. **Optimize**: Consider adding caching, rate limiting, or authentication as needed

---

**Migration Date**: January 2025
**Vercel Runtime**: Node.js 22.x
**Framework**: Vite 7 + React 18
