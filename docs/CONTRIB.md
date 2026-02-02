# Contributing Guide

**Project:** Notion Blog
**Version:** 1.0.0
**Last Updated:** 2026-02-02

---

## Development Workflow

### Prerequisites

- Node.js 20+
- npm 11+
- Notion account with API access
- (Optional) Anthropic API key for auto-generated social content

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd notion-blog
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials (see Environment Setup below)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start Next.js development server on http://localhost:3000 |
| **build** | `npm run build` | Build production bundle with static generation |
| **start** | `npm start` | Start production server (requires build first) |
| **lint** | `npm run lint` | Run ESLint to check code quality |
| **generate-social** | `npm run generate-social` | Auto-generate social media content using Claude AI |

### Script Usage Examples

**Development**
```bash
# Hot-reload development
npm run dev

# Build for production
npm run build

# Test production build locally
npm run build && npm start
```

**Content Generation**
```bash
# Generate social content for published posts
npm run generate-social

# Interactive: select post, generates X/LinkedIn/Threads content
# Saves directly to Notion tracker database
```

**Code Quality**
```bash
# Lint and fix issues
npm run lint
```

---

## Environment Setup

### Required Variables

Create `.env.local` from `.env.example` and configure:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NOTION_API_KEY` | ✅ Yes | Notion integration API key | `secret_abc123...` |
| `NOTION_DATABASE_ID` | ✅ Yes | Blog posts database ID (32 chars) | `2f95e78da0ce80c2...` |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | Production site URL | `https://scbalab.com` |
| `NEXT_PUBLIC_SITE_NAME` | ✅ Yes | Site name for metadata | `SCBA.Lab` |
| `TRACKER_DATABASE_ID` | ❌ Optional | Content tracker database ID | `2fb5e78da0ce80f5...` |
| `ANTHROPIC_API_KEY` | ❌ Optional | Claude API key for auto-generation | `sk-ant-api03-...` |

### Getting API Keys

**Notion API Key:**
1. Visit https://www.notion.so/my-integrations
2. Click "New integration"
3. Copy the Internal Integration Token

**Notion Database ID:**
1. Open database in Notion
2. Click "..." → "Copy link"
3. Extract 32-char ID from URL: `notion.so/[DATABASE_ID]?v=...`

**Anthropic API Key:**
1. Visit https://console.anthropic.com
2. Create account (includes $5 free credits)
3. Generate API key in Settings

### Environment Variable Notes

- **Public vars** (`NEXT_PUBLIC_*`): Exposed to browser, safe for client-side
- **Private vars**: Server-only, never exposed to client
- **Never commit** `.env.local` to git (already in `.gitignore`)

---

## Testing Procedures

### Manual Testing Checklist

**Since this project has no automated tests, follow this checklist:**

#### Blog Functionality
- [ ] Homepage loads and shows published posts
- [ ] Individual post pages render correctly
- [ ] Post content displays with proper formatting
- [ ] Code blocks have syntax highlighting
- [ ] Navigation links work
- [ ] 404 page shows for invalid slugs

#### Notion Integration
- [ ] New posts appear within 60 seconds (ISR)
- [ ] Unpublished posts don't appear
- [ ] Post metadata (title, date, tags) displays correctly
- [ ] Notion content formatting preserved

#### Content Tracker (if enabled)
- [ ] `npm run generate-social` runs without errors
- [ ] Social content generates for published posts
- [ ] Content saves to Notion tracker database
- [ ] Long content splits correctly (>2000 chars)

#### Build & Deployment
- [ ] `npm run build` completes without errors
- [ ] All routes generate successfully
- [ ] Production build runs with `npm start`
- [ ] No console errors in browser

### Testing New Features

1. **Create a test blog post in Notion**
   - Set Published: false
   - Verify it doesn't appear on site
   - Set Published: true
   - Wait 60 seconds, verify it appears

2. **Test content rendering**
   - Use all Notion block types (headings, lists, code, quotes)
   - Verify each renders correctly

3. **Test social content generation** (if using tracker)
   - Create tracker item for test post
   - Run `npm run generate-social`
   - Verify content quality and formatting

### Performance Testing

```bash
# Build and analyze bundle size
npm run build

# Check output for:
# - Route sizes (should be <100KB first load)
# - Static vs SSG routes
# - No build errors
```

---

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Follow existing patterns
- **Imports**: Use path aliases (`@/lib/notion` not `../lib/notion`)
- **Components**: Server components by default (use `'use client'` only when needed)

### File Structure

```
notion-blog/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── lib/              # Shared utilities and API clients
│   ├── types/            # TypeScript type definitions
│   └── scripts/          # CLI scripts (social generator)
├── public/               # Static assets
├── content/              # Blog post content and guides
└── guides/               # Publishing workflow guides
```

### Adding New Features

1. **Check existing code** for similar patterns
2. **Read relevant guides** in `guides/` directory
3. **Test locally** before committing
4. **Update documentation** if adding new env vars or scripts

### Common Tasks

**Add a new Notion property:**
1. Add to Notion database
2. Update TypeScript types in `src/types/`
3. Update transform functions in `src/lib/notion.ts`
4. Test with a real post

**Modify social content generation:**
1. Edit prompt in `src/scripts/generate-social.ts`
2. Test with `npm run generate-social`
3. Verify output quality in Notion

**Change styling:**
1. Edit `src/app/globals.css` for global styles
2. Use existing CSS variables for consistency
3. Test both light and dark mode (if applicable)

---

## Deployment

See `docs/RUNBOOK.md` for deployment procedures.

Quick reference:
```bash
# Vercel (recommended)
vercel --prod

# Or push to main branch (auto-deploys if configured)
git push origin main
```

---

## Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Notion content not updating:**
- Wait 60 seconds (ISR revalidation period)
- Check Published checkbox in Notion
- Verify database is shared with integration
- Restart dev server

**Environment variables not loading:**
- Restart dev server after changing `.env.local`
- Check variable names match `.env.example`
- Verify no extra spaces around `=`

**Social generation fails:**
- Check `ANTHROPIC_API_KEY` is valid
- Verify tracker database exists and is shared
- Check property names match exactly (case-sensitive)

---

## Getting Help

1. **Check existing docs:**
   - `README.md` - Project overview
   - `CONTENT_TRACKER_SETUP.md` - Tracker setup
   - `DEPLOYMENT.md` - Deployment guide
   - `guides/` - Publishing workflows

2. **Review error messages:**
   - Notion API errors usually indicate permission or schema issues
   - Build errors point to the specific file and line

3. **Common resources:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Notion API Docs](https://developers.notion.com)
   - [Anthropic API Docs](https://docs.anthropic.com)

---

## Contributing Checklist

Before submitting changes:

- [ ] Code follows existing style and patterns
- [ ] Environment variables documented if added
- [ ] Manual testing completed (see Testing Procedures)
- [ ] Build passes locally (`npm run build`)
- [ ] No new ESLint errors (`npm run lint`)
- [ ] Documentation updated if needed

---

**Last Updated:** 2026-02-02
**Maintainer:** SCBA.Lab Team
