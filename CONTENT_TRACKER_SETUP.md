# Content Tracker Setup Guide

Complete guide to setting up and using the Content Tracker system for managing your blog content creation workflow.

## Overview

The Content Tracker system helps you:
- ✅ Track content through multiple stages (Research → Draft → Published)
- ✅ Manage deadlines and progress
- ✅ Auto-generate social media content for published posts
- ✅ Link blog posts to tracker items
- ✅ Organize with tags and priorities

## Prerequisites

- Notion account with API access
- Notion Blog database already set up
- Node.js and npm installed

---

## Step 1: Create Notion Tracker Database

### 1.1 Create New Database in Notion

1. Open Notion
2. Create a new page called "Content Tracker"
3. Type `/database` and select "Table - Inline"

### 1.2 Add Required Properties

Add these properties to your database (click `+` in the header):

| Property Name | Property Type | Options/Notes |
|--------------|---------------|---------------|
| **Title** | Title | (Default - already exists) |
| **Status** | Select | Options: Research, Outline, Draft, Edit, Review, Published, Promoted |
| **Progress** | Number | Format: Number |
| **Due Date** | Date | Include time: Optional |
| **Blog Post** | Relation | Relate to: Your Blog Posts database |
| **Tags** | Multi-select | Add tags as needed (e.g., Tutorial, Career, Technical) |
| **Priority** | Select | Options: Low, Medium, High, Urgent |
| **Tasks** | Text | Multi-line text for task breakdown |
| **X Content** | Text | Multi-line text (stores generated tweets) |
| **LinkedIn Content** | Text | Multi-line text (stores LinkedIn post) |
| **Threads Content** | Text | Multi-line text (stores Threads posts) |
| **Content Generated** | Checkbox | Auto-checked when social content is generated |
| **Social Posted** | Checkbox | Manually check when posted to social media |

### 1.3 Get Database ID

1. Open your Content Tracker database in Notion
2. Click "Share" → "Copy link"
3. The URL looks like: `https://notion.so/yourworkspace/XXXXX?v=YYYYY`
4. The database ID is the `XXXXX` part (32-character string)
5. Save this for Step 2

---

## Step 2: Configure Environment Variables

### 2.1 Update `.env.local`

Add the tracker database ID to your `.env.local` file:

```bash
# Existing variables
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_blog_database_id

# Add this new variable
TRACKER_DATABASE_ID=your_tracker_database_id_here

# Site config (if not already set)
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
NEXT_PUBLIC_SITE_NAME=Your Blog Name
```

### 2.2 Share Database with Integration

1. Open your Content Tracker database in Notion
2. Click "..." (three dots) at top right
3. Scroll down and click "Add connections"
4. Select your Notion integration (the same one you used for the blog)
5. Click "Confirm"

---

## Step 3: Install Dependencies

Install the TypeScript runner:

```bash
npm install
```

This installs `ts-node` (added to package.json) which allows running TypeScript scripts.

---

## Step 4: Create Your First Tracker Item

### Option A: Manually in Notion

1. Open your Content Tracker database
2. Click "New" to create a new item
3. Fill in:
   - **Title**: "Building a Blog with AI" (match your blog post title)
   - **Status**: Published
   - **Progress**: 100
   - **Tags**: AI Development, Next.js, Web Development
   - **Priority**: High

### Option B: Programmatically (Advanced)

Create a script to auto-create tracker items:

```typescript
import { createTrackerItem } from './src/lib/notion-tracker';

const item = await createTrackerItem({
  title: "My Blog Post Title",
  status: "Draft",
  progress: 50,
  tags: ["Tutorial", "TypeScript"],
  priority: "Medium",
  dueDate: "2026-02-15"
});
```

---

## Step 5: Generate Social Content

### 5.1 Run the Generator Script

```bash
npm run generate-social
```

### 5.2 Follow the Interactive Prompts

The script will:

1. **Find published posts** without social content
2. **Display them** in a numbered list
3. **Ask you to choose** which post to generate content for
4. **Show blog post details** (title, description, content preview)
5. **Provide a prompt** for you to use with Claude Code
6. **Wait for you** to generate content
7. **Collect the generated content** (X, LinkedIn, Threads)
8. **Save to Notion** tracker database

### 5.3 Example Workflow

```bash
$ npm run generate-social

🚀 Social Content Generator

📝 Checking for published blog posts...
✅ Found 1 published post(s)

🔍 Checking tracker database...
📊 Tracker Stats:
   Total items: 1
   Needing social content: 1

📋 Posts needing social content:

1. "Building a Blog with AI"
   Status: Published
   Progress: 100%

Which post would you like to generate social content for? (1-1, or 'q' to quit): 1

✅ Selected: "Building a Blog with AI"

📖 Fetching blog post content...

====================================================
BLOG POST SUMMARY
====================================================
Title: Building a Blog with AI
Slug: building-blog-with-ai
Description: How I built a blog in one day using AI
Tags: AI, Next.js, Tutorial
Content length: 5234 characters
====================================================

📄 Content Preview:
--------------------------------------------------
[First 500 characters of your blog post]
--------------------------------------------------

====================================================
GENERATE SOCIAL CONTENT
====================================================

📝 Now, ask Claude Code to generate social content!

Example prompt:
--------------------------------------------------
Generate social media content for this blog post:

Title: Building a Blog with AI
Description: How I built a blog in one day using AI
Tags: AI, Next.js, Tutorial

Please create:
1. X (Twitter) thread (9 tweets, 280 chars each)
2. LinkedIn post (professional tone, 1300-2000 chars)
3. Threads post (casual, engaging, 9 posts)
--------------------------------------------------

Have you generated the content? (y/n): y

📥 Paste the generated content:

X (Twitter) content:
(Paste all tweets separated by '---', then press Enter twice)

[You paste the tweets here]

LinkedIn content:
(Paste the post, then press Enter twice)

[You paste the LinkedIn post here]

Threads content:
(Paste all posts separated by '---', then press Enter twice)

[You paste the Threads posts here]

💾 Saving to Notion tracker database...

✅ Social content saved successfully!

====================================================
NEXT STEPS
====================================================
1. Open your Notion tracker database
2. Find the item: Building a Blog with AI
3. Review the generated content
4. Copy and post to social platforms
5. Mark 'Social Posted' checkbox when done
====================================================
```

---

## Step 6: Using the Tracker

### Daily Workflow

**Morning: Plan Your Day**
1. Open Content Tracker in Notion
2. Filter by Priority: High
3. Check Due Dates
4. Update Progress on active items

**During Writing:**
1. Update Status as you progress
2. Add tasks in the Tasks field:
   ```
   - [x] Research topic
   - [x] Create outline
   - [ ] Write draft
   - [ ] Edit and revise
   - [ ] Add code examples
   ```
3. Update Progress percentage

**After Publishing:**
1. Change Status to "Published"
2. Link to Blog Post (use relation property)
3. Run `npm run generate-social`
4. Review generated content in Notion
5. Post to social media
6. Check "Social Posted" when complete
7. Change Status to "Promoted"

### Notion Views (Recommended)

Create these views in your tracker database:

**1. Active Items**
- Filter: Status is not "Published" or "Promoted"
- Sort: Due Date (ascending)

**2. Ready to Publish**
- Filter: Status is "Review" AND Progress >= 90
- Sort: Due Date (ascending)

**3. Needing Social Content**
- Filter: Status is "Published" AND Content Generated is unchecked
- Sort: Due Date (ascending)

**4. This Week**
- Filter: Due Date is this week
- Sort: Priority (High → Low)

---

## Troubleshooting

### "TRACKER_DATABASE_ID not configured"

**Solution**: Make sure you added `TRACKER_DATABASE_ID` to `.env.local`

```bash
# Check your .env.local file
cat .env.local | grep TRACKER
```

### "Error fetching tracker items"

**Solutions**:
1. Verify database is shared with your Notion integration
2. Check that database ID is correct (32-character string)
3. Make sure all required properties exist

### "No published blog posts found"

**Solution**:
1. Check that your blog post has `Published` checkbox checked in Notion
2. Wait 60 seconds for ISR to refresh
3. Verify `NOTION_DATABASE_ID` is set correctly

### Script hangs on multiline input

**Solution**:
- Press Enter **twice** after pasting content
- This signals the end of input

---

## Advanced Usage

### Custom Status Workflow

Edit the Status property in Notion to match your workflow:

```
Research → Plan → Outline → Draft → Review → Finalize → Published → Promoted
```

Update the TypeScript type in `src/types/tracker.ts`:

```typescript
export type TrackerStatus =
  | "Research"
  | "Plan"
  | "Outline"
  | "Draft"
  | "Review"
  | "Finalize"
  | "Published"
  | "Promoted";
```

### Programmatic Access

Use the tracker library in your own scripts:

```typescript
import {
  createTrackerItem,
  updateTrackerItem,
  getAllTrackerItems,
  getItemsNeedingSocialContent
} from './src/lib/notion-tracker';

// Create item
const item = await createTrackerItem({
  title: "My New Post",
  status: "Draft",
  progress: 30,
  tags: ["Tutorial"],
  priority: "Medium"
});

// Update progress
await updateTrackerItem({
  id: item.id,
  progress: 50,
  status: "Review"
});

// Get all items
const items = await getAllTrackerItems();
console.log(`Total items: ${items.length}`);
```

---

## Example Tracker Items

### Tutorial Post
```
Title: How to Build a REST API with Next.js
Status: Draft
Progress: 60%
Due Date: 2026-02-15
Tags: Tutorial, Next.js, API
Priority: High
Tasks:
- [x] Research API design patterns
- [x] Create project structure
- [ ] Write tutorial content
- [ ] Add code examples
- [ ] Test all examples
- [ ] Edit and review
```

### Career Post
```
Title: Lessons from 3 Countries in Tech
Status: Outline
Progress: 25%
Due Date: 2026-02-20
Tags: Career, International, Tech Culture
Priority: Medium
Tasks:
- [x] Brainstorm key lessons
- [x] Create outline
- [ ] Write Korea section
- [ ] Write Germany section
- [ ] Write Spain section
- [ ] Add actionable takeaways
```

---

## Next Steps

1. ✅ Set up Notion tracker database (Step 1)
2. ✅ Configure environment variables (Step 2)
3. ✅ Install dependencies (Step 3)
4. ✅ Create first tracker item (Step 4)
5. ✅ Generate social content (Step 5)
6. 🔄 Post to social media
7. 🔄 Create more tracker items for future posts
8. 🔄 Develop your content workflow

---

## Resources

- **Notion API Docs**: https://developers.notion.com
- **Your Blog**: Check `.env.local` for URL
- **GitHub Repo**: Link in README.md
- **Publishing Guides**: See `guides/` directory

---

**Questions or Issues?**

Check the main `README.md` or create an issue in the GitHub repository.
