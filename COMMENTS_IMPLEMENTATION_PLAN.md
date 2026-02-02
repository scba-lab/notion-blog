# Comments System Implementation Plan

> **Status**: Ready to implement
> **Estimated Time**: ~2.5 hours
> **Cost**: $0 (free tier)
> **Approach**: Google OAuth + Supabase + Flat Comments

---

## Quick Start

When ready to implement, tell Claude Code:

```
"Implement the comments system from COMMENTS_IMPLEMENTATION_PLAN.md"
```

Or:

```
"Start Phase 1 of the comment system implementation"
```

---

## Architecture Overview

**Tech Stack**:
- **NextAuth.js** - Google OAuth authentication
- **Supabase** - PostgreSQL database (free tier: 500MB)
- **Next.js API Routes** - Backend endpoints
- **React** - Frontend comment UI

**What You Get**:
- ✅ Google sign-in for comments
- ✅ Flat comment threads (simple, no nesting)
- ✅ Rate limiting (5 comments/minute per user)
- ✅ User can delete own comments
- ✅ Notion-style UI
- ✅ $0/month cost (free tier)

**Data Flow**:
1. User clicks "Sign in with Google" → OAuth flow
2. User posts comment → Saved to Supabase
3. Comments display below blog posts

---

## Implementation Phases

### Phase 1: Supabase Database Setup (15 min)

**Actions**:
1. Create free Supabase account: https://supabase.com
2. Create new project: "notion-blog-comments"
3. Run SQL schema (see below)
4. Copy credentials: URL + anon key + service role key

**SQL Schema**:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments table (FLAT - no threading)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_post_slug ON comments(post_slug);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);
```

---

### Phase 2: Install Dependencies (5 min)

```bash
cd /Users/kevin/contentcreator/notion-blog
npm install next-auth@latest @supabase/supabase-js @auth/supabase-adapter
```

---

### Phase 3: Google OAuth Setup (15 min)

**Actions**:
1. Go to https://console.cloud.google.com/apis/credentials
2. Create project: "notion-blog-comments"
3. Configure OAuth consent screen
4. Create OAuth 2.0 Client ID
5. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://scbalab.com/api/auth/callback/google`
6. Copy Client ID and Client Secret

---

### Phase 4: NextAuth Configuration (20 min)

**New Files**:
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth-provider.tsx`

**Edit Files**:
- `src/app/layout.tsx` (wrap with AuthProvider)

---

### Phase 5: Comments API Routes (30 min)

**New Files**:
- `src/lib/supabase.ts`
- `src/app/api/comments/route.ts` (GET + POST)
- `src/app/api/comments/[id]/route.ts` (DELETE)

**Features**:
- Rate limiting: 5 comments/minute per user
- RLS security enforcement
- Error handling

---

### Phase 6: Comments UI Component (40 min)

**New Files**:
- `src/components/Comments.tsx`

**Edit Files**:
- `src/app/globals.css` (Notion-style comment CSS)

**Features**:
- Google sign-in button
- Comment form with character limit (1000 chars)
- Real-time comment list
- Delete own comments
- Relative timestamps ("5m ago")

---

### Phase 7: Integrate into Post Page (5 min)

**Edit Files**:
- `src/app/posts/[slug]/page.tsx` (add `<Comments slug={slug} />`)

---

### Phase 8: Environment Setup (10 min)

**Add to `.env.local`**:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

---

### Phase 9: Local Testing (15 min)

```bash
npm run dev
# Visit http://localhost:3000/posts/[any-post]
# Test: Sign in, post comment, delete comment
```

**Test Checklist**:
- ✅ Google sign-in works
- ✅ Can post comment
- ✅ Can delete own comment
- ✅ Can't delete others' comments
- ✅ Rate limiting prevents spam

---

### Phase 10: Deployment (15 min)

**Actions**:
1. Add env vars to Vercel (change NEXTAUTH_URL to `https://scbalab.com`)
2. Update Google OAuth with production redirect URL
3. Deploy:
   ```bash
   git add .
   git commit -m "Add Google-auth comment system"
   git push origin main
   ```
4. Test on production

---

## Environment Variables Reference

```env
# Generate NEXTAUTH_SECRET:
openssl rand -base64 32

# Get Supabase credentials:
# Supabase Dashboard → Settings → API

# Get Google OAuth credentials:
# Google Cloud Console → APIs & Credentials
```

---

## Security Checklist

Before going live:
- ✅ RLS policies tested (users can only delete own comments)
- ✅ Rate limiting working (max 5 comments/minute)
- ✅ NEXTAUTH_SECRET is strong (32+ characters)
- ✅ Service role key only in API routes (never client-side)
- ✅ `.env.local` in `.gitignore`

---

## Cost Breakdown

**Implementation**: $0
**Monthly Cost**: $0 (free tier)

**Free Tier Limits**:
- Supabase: 500 MB database, 50K monthly users
- Google OAuth: Unlimited (always free)
- Vercel: 100 GB bandwidth/month

**When you'd pay**: Blog gets 100K+ monthly visitors → ~$25/month

---

## Troubleshooting

**OAuth Error "Redirect URI mismatch"**:
- Check Google Console → Authorized redirect URIs match exactly
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://scbalab.com/api/auth/callback/google`

**Comments not appearing**:
- Check Supabase RLS policies are enabled
- Verify API route returns data: `/api/comments?slug=test`

**"Rate limit exceeded"**:
- Working as intended! Wait 1 minute between bursts

---

## Future Enhancements (Optional)

**Later, if needed**:
- Add comment threading (nested replies)
- Add GitHub/Twitter auth providers
- Email notifications for replies
- Admin moderation dashboard
- Akismet spam filtering

---

## Questions?

When ready to implement, open Claude Code and say:

**"Start implementing the comments system from COMMENTS_IMPLEMENTATION_PLAN.md"**

Or start with a specific phase:

**"I've completed Supabase setup. Start Phase 2 of comments implementation"**
