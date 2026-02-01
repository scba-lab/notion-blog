# Notion Blog with Next.js

A Next.js 14 blog powered by Notion as a headless CMS.

## 🚀 Live Demo

**Production Site**: https://notion-blog-cosqyu0km-sunghun-juns-projects.vercel.app

**GitHub Repository**: https://github.com/scba-lab/notion-blog

## ✨ Features

### Blog Features
- 🎨 Notion-style UI with system fonts
- 📝 Auto-convert Notion pages to blog posts
- 🔄 ISR (Incremental Static Regeneration) - Auto-refresh every 60s
- 💅 Full Markdown support (headings, lists, code blocks, quotes)
- 🏷️ Tag system
- 📱 Responsive design
- 🚀 Auto-deployment with Vercel

### Content Tracker (NEW!)
- 📊 Track content through Research → Draft → Published → Promoted
- ✅ Multi-step task breakdown for each post
- 📅 Due dates and progress tracking
- 🤖 Auto-generate social media content (X, LinkedIn, Threads)
- 🔗 Link tracker items to blog posts
- 🏷️ Tags and priority management

## 🚀 Getting Started

### 1. Create Notion Integration

1. Visit https://www.notion.so/my-integrations
2. Click "New integration"
3. Enter integration name
4. Copy the API Key

### 2. Create Notion Database

1. Create a new page in Notion
2. Type `/database` to create a database
3. Add the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Title | Title | ✅ | Post title |
| Slug | Text | ✅ | URL path (e.g., first-post) |
| Date | Date | ✅ | Publication date |
| Published | Checkbox | ✅ | Visibility toggle |
| Description | Text | | Post summary (1-2 sentences) |
| Tags | Multi-select | | Category tags |

4. Click `...` in the top right → "Add connections" → Select your integration
5. Copy Database ID from URL:
   ```
   https://notion.so/[Database-ID]?v=...
   ```

### 3. Environment Variables

Create `.env.local` file:

```env
NOTION_API_KEY=your_integration_key_here
NOTION_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Your Blog Name
```

### 4. Install and Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### 5. Create Your First Post

Create a new page in your Notion database:

**Properties**:
- Title: `My First Post`
- Slug: `first-post`
- Date: Today's date
- Published: ✅ Check
- Description: `My first blog post using Notion!`
- Tags: Add desired tags

**Content** (in the page body below properties):
- Type `/h2` for section headings
- Type `/bullet` for bullet lists
- Type `/code` for code blocks
- Type `/quote` for quotes
- Or just start typing regular text

Save and it will appear on your blog within 1 minute!

## 📦 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/scba-lab/notion-blog.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project" → Connect GitHub
3. Select your repository
4. Add Environment Variables:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `NEXT_PUBLIC_SITE_NAME`
5. Click Deploy!

See `DEPLOYMENT.md` for detailed deployment guide.

## 🛠 Customization

### Styling

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --color-accent: #c45a3b;  /* Accent color */
  --color-ink: #1a1a1a;     /* Text color */
  --color-paper: #faf8f5;   /* Background color */
}
```

### Metadata

Update site information in `src/app/layout.tsx`

### Navigation

Modify the `site-nav` section in `src/app/layout.tsx`

## 📁 Project Structure

```
notion-blog/
├── src/
│   ├── app/                 # Next.js app
│   ├── lib/
│   │   ├── notion.ts        # Blog API functions
│   │   └── notion-tracker.ts # Tracker API functions
│   ├── types/
│   │   └── tracker.ts       # TypeScript types
│   └── scripts/
│       └── generate-social.ts # Social content generator
├── content/                 # Blog post content
│   └── first-post/
│       ├── blog-post.md
│       └── social-media.md
├── guides/                  # Publishing workflow guides
│   ├── notion-publishing.md
│   ├── x-posting.md
│   └── content-tracker-workflow.md
├── .env.local               # Environment variables
└── package.json
```

## 🔄 Auto-Update

- Uses ISR (Incremental Static Regeneration)
- Content auto-refreshes every 60 seconds
- Updates from Notion appear within 1 minute

## 📊 Content Tracker System

Manage your entire content creation workflow in Notion!

### Quick Start

1. **Set up tracker database** (5 minutes)
   - See `CONTENT_TRACKER_SETUP.md` for detailed instructions
   - Add `TRACKER_DATABASE_ID` to `.env.local`

2. **Create tracker items** in Notion
   - Track content from idea → published
   - Manage deadlines and progress

3. **Generate social content** (when post is published)
   ```bash
   npm run generate-social
   ```
   - Auto-generates X threads, LinkedIn posts, Threads content
   - Saves to Notion for easy copy-paste

### Documentation

- **Setup**: `CONTENT_TRACKER_SETUP.md` - Complete setup guide
- **Workflow**: `guides/content-tracker-workflow.md` - Daily workflow
- **Content Organization**: `CONTENT_ORGANIZATION.md` - File structure

### Features

- ✅ Multi-stage workflow tracking (Research → Promoted)
- ✅ Progress tracking (0-100%)
- ✅ Due dates and priorities
- ✅ Link to blog posts
- ✅ Auto-generate social content with Claude Code
- ✅ Platform-specific content (X, LinkedIn, Threads)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## 📝 License

MIT

---

Built with [Next.js](https://nextjs.org/) and [Notion API](https://developers.notion.com/)
