# Vercel Deployment Guide

GitHub Repository created: https://github.com/scba-lab/notion-blog

## Deploy on Vercel

### 1. Visit Vercel
https://vercel.com

### 2. Import Project
1. Click "Add New Project" or "Import Project"
2. Connect GitHub (if first time, link your GitHub account)
3. Select repository: `scba-lab/notion-blog`
4. Click "Import"

### 3. Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (default)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

### 4. Environment Variables

Add the following in the "Environment Variables" section:

```
NOTION_API_KEY=your_notion_api_key_here
```

```
NOTION_DATABASE_ID=your_database_id_here
```

```
NEXT_PUBLIC_SITE_NAME=Sunghun's Blog
```

**Important**: Add each variable individually.

Environment: Check **Production**, **Preview**, and **Development**

### 5. Deploy
Click the "Deploy" button!

---

## After Deployment

✅ **Deployment Complete!**

**Production URL**: https://notion-blog-cosqyu0km-sunghun-juns-projects.vercel.app

**Auto-Deployment**:
- Automatic deployment on every push to `main` branch
- Preview deployments: Automatically created for Pull Requests

**Add Environment Variables on Vercel** (if needed):
- Vercel Dashboard → Settings → Environment Variables
- Add `NEXT_PUBLIC_SITE_URL` (production URL)

---

## Custom Domain (Optional)

Vercel Dashboard → Project → Settings → Domains
Add your custom domain here

---

## Environment Variables Template

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_SITE_NAME=Your Blog Name
```

**Note**: Replace the placeholder values with your actual Notion credentials.

---

## Continuous Deployment

Every time you push to GitHub:
```bash
git add .
git commit -m "Update content"
git push origin main
```

Vercel will automatically build and deploy your changes!
