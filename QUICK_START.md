# Quick Start Guide

Get your Content Tracker up and running in 15 minutes!

## Prerequisites

✅ Notion account
✅ Notion blog already set up (if not, see main `README.md`)
✅ Node.js installed

---

## Step 1: Create Tracker Database (5 min)

### 1. In Notion, create new page: "Content Tracker"

### 2. Type `/table` → select "Table - Inline"

### 3. Add these properties:

Click `+` in the table header to add each property:

| Property Name | Type | Options |
|--------------|------|---------|
| Title | Title | (already exists) |
| Status | Select | Research, Outline, Draft, Edit, Review, Published, Promoted |
| Progress | Number | - |
| Due Date | Date | - |
| Blog Post | Relation | → Your Blog Posts database |
| Tags | Multi-select | - |
| Priority | Select | Low, Medium, High, Urgent |
| Tasks | Text | - |
| X Content | Text | - |
| LinkedIn Content | Text | - |
| Threads Content | Text | - |
| Content Generated | Checkbox | - |
| Social Posted | Checkbox | - |

### 4. Share with integration

- Click `...` (top right) → "Add connections"
- Select your Notion integration
- Click "Confirm"

### 5. Get Database ID

- Click "Share" → "Copy link"
- URL: `https://notion.so/XXXXX?v=YYYYY`
- Save the `XXXXX` part (32 characters)

---

## Step 2: Configure Environment (2 min)

Add to your `.env.local`:

```bash
# Add this line (keep existing ones)
TRACKER_DATABASE_ID=paste_your_database_id_here
```

---

## Step 3: Install Dependencies (2 min)

```bash
cd /Users/kevin/contentcreator/notion-blog
npm install
```

This installs `ts-node` for running TypeScript scripts.

---

## Step 4: Create First Tracker Item (3 min)

### In your Notion Content Tracker:

1. Click "New"
2. Fill in:
   - **Title**: "Building a Blog with AI" (match your published post)
   - **Status**: Published
   - **Progress**: 100
   - **Tags**: AI Development, Next.js
   - **Priority**: High

3. Save

---

## Step 5: Generate Social Content (3 min)

### Run the generator:

```bash
npm run generate-social
```

### Follow the prompts:

1. Script shows published posts
2. Choose your post (enter `1`)
3. Script displays blog content
4. **Ask Claude Code to generate social content**
5. Paste generated content when prompted
6. Content saves to Notion automatically!

### Example prompt for Claude:

```
Generate social media content for this blog post:

Title: Building a Blog with AI
Description: How I built a blog in one day
Tags: AI, Next.js, Tutorial

Create:
1. X thread (9 tweets, 280 chars each)
2. LinkedIn post (professional, 1300-2000 chars)
3. Threads post (casual, 9 posts)
```

---

## Step 6: Post to Social Media

### In Notion:

1. Open your tracker item
2. Find the generated content fields:
   - X Content
   - LinkedIn Content
   - Threads Content

### Copy and Post:

- **X**: Copy tweets, post as thread (see `guides/x-posting.md`)
- **LinkedIn**: Copy post, paste to LinkedIn
- **Threads**: Copy posts, create thread

### Mark as Posted:

- Check "Social Posted" in Notion
- Change Status to "Promoted"

---

## You're Done! 🎉

### What You Can Do Now:

✅ **Track new content ideas**
```
Create item → Status: Research → Add tasks → Set due date
```

✅ **Manage active writing**
```
Update progress → Check off tasks → Change status as you work
```

✅ **Auto-generate social content**
```
Publish blog → Run npm run generate-social → Post to platforms
```

---

## Next Steps

### Learn the Full Workflow
Read: `guides/content-tracker-workflow.md`

### Create Notion Views
- **Active Items**: Filter Status ≠ Published/Promoted
- **This Week**: Filter Due Date = this week
- **Needs Social**: Filter Status = Published AND Content Generated = ☐

### Set Up Your Content Pipeline
1. Create tracker items for 3-5 post ideas
2. Set realistic due dates
3. Update progress daily
4. Use tags to categorize content

---

## Common Commands

```bash
# Generate social content
npm run generate-social

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Troubleshooting

### "TRACKER_DATABASE_ID not configured"
→ Check `.env.local` file has the database ID

### "Error fetching tracker items"
→ Make sure database is shared with your Notion integration

### "No published blog posts found"
→ Check blog post has "Published" checkbox ✓ in Notion

### Script hangs on input
→ Press Enter **twice** after pasting content

---

## Get Help

- **Setup Issues**: See `CONTENT_TRACKER_SETUP.md`
- **Workflow Questions**: See `guides/content-tracker-workflow.md`
- **Publishing**: See `guides/notion-publishing.md`
- **Social Media**: See `guides/x-posting.md`

---

**Ready to create amazing content? Start tracking your first post!** 🚀
