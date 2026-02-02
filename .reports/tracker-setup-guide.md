# 🚀 Content Tracker Setup - Step by Step

Follow these exact steps to get your content tracker working in **10 minutes**.

---

## ✅ Step 1: Create Tracker Database in Notion (3 minutes)

### 1.1 Open Notion
1. Go to [notion.so](https://notion.so)
2. Navigate to the workspace where your blog database lives

### 1.2 Create New Page
1. Click **"+ New page"** in the sidebar (or press `Cmd+N` / `Ctrl+N`)
2. Name it: **"Content Tracker"**
3. Press `Enter`

### 1.3 Create Database
1. In the new page, type: `/table`
2. Select: **"Table - Inline"**
3. A table will appear with a default "Name" column

### 1.4 Rename Title Column
1. Click on the **"Name"** header
2. Rename it to: **"Title"**
3. Click outside to save

---

## ✅ Step 2: Add Required Properties (4 minutes)

Click the **"+"** button in the table header to add each property:

### Property 1: Status
- **Name:** `Status`
- **Type:** Select
- **Options to add:**
  - Research (color: gray)
  - Outline (color: blue)
  - Draft (color: yellow)
  - Edit (color: orange)
  - Review (color: purple)
  - Published (color: green)
  - Promoted (color: pink)

### Property 2: Progress
- **Name:** `Progress`
- **Type:** Number
- **Format:** Number (0-100)

### Property 3: Due Date
- **Name:** `Due Date`
- **Type:** Date
- **Include time:** Optional (your choice)

### Property 4: Blog Post
- **Name:** `Blog Post`
- **Type:** Relation
- **Relate to:** Select your existing blog database
- Click "Add a relation"

### Property 5: Tags
- **Name:** `Tags`
- **Type:** Multi-select
- Add tags as you go (e.g., Tutorial, Career, Technical)

### Property 6: Priority
- **Name:** `Priority`
- **Type:** Select
- **Options:**
  - Low (gray)
  - Medium (blue)
  - High (orange)
  - Urgent (red)

### Property 7: Tasks
- **Name:** `Tasks`
- **Type:** Text
- Toggle on "Long text" when creating

### Property 8: X Content
- **Name:** `X Content`
- **Type:** Text
- Toggle on "Long text"

### Property 9: LinkedIn Content
- **Name:** `LinkedIn Content`
- **Type:** Text
- Toggle on "Long text"

### Property 10: Threads Content
- **Name:** `Threads Content`
- **Type:** Text
- Toggle on "Long text"

### Property 11: Content Generated
- **Name:** `Content Generated`
- **Type:** Checkbox

### Property 12: Social Posted
- **Name:** `Social Posted`
- **Type:** Checkbox

---

## ✅ Step 3: Share with Integration (1 minute)

### 3.1 Connect Integration
1. Click the **"..."** (three dots) at the top right of the page
2. Scroll down to **"Connections"**
3. Click **"Add connections"**
4. Select your Notion integration (same one used for your blog)
5. Click **"Confirm"**

---

## ✅ Step 4: Get Database ID (1 minute)

### 4.1 Copy Database Link
1. Click **"Share"** at the top right
2. Click **"Copy link"**
3. The URL looks like this:
   ```
   https://www.notion.so/yourworkspace/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX?v=YYYYYYYY
   ```

### 4.2 Extract Database ID
The database ID is the **32-character string** between the last `/` and the `?`

**Example:**
```
URL: https://www.notion.so/workspace/a1b2c3d4e5f6789012345678901234ab?v=12345
Database ID: a1b2c3d4e5f6789012345678901234ab
```

Copy this ID - you'll need it in the next step!

---

## ✅ Step 5: Add to Environment Variables (1 minute)

### 5.1 Open .env.local
```bash
# In your terminal, navigate to the project
cd /Users/kevin/contentcreator/notion-blog

# Open .env.local in your editor
open .env.local
# or: nano .env.local
# or: code .env.local
```

### 5.2 Add Tracker Database ID
Add this line at the end of your `.env.local` file:

```bash
TRACKER_DATABASE_ID=paste_your_32_character_id_here
```

**Example of complete .env.local:**
```bash
NOTION_API_KEY=secret_abc123def456...
NOTION_DATABASE_ID=2f95e78da0ce80c2b28dc4c1ad52c812
TRACKER_DATABASE_ID=a1b2c3d4e5f6789012345678901234ab
NEXT_PUBLIC_SITE_URL=https://scbalab.com
NEXT_PUBLIC_SITE_NAME=SCBA.Lab
```

Save the file!

---

## ✅ Step 6: Create Your First Tracker Item (2 minutes)

### 6.1 Add Row to Tracker
Go back to your Notion Content Tracker database and click **"New"**

### 6.2 Fill in Details
For your existing blog post "Building Blog with AI One Day":

- **Title:** `Building Blog with AI One Day`
- **Status:** Published
- **Progress:** 100
- **Due Date:** (leave blank or set past date)
- **Blog Post:** (search and link to your actual blog post if you want)
- **Tags:** AI Development, Next.js, Tutorial
- **Priority:** High
- **Tasks:** (leave blank for now)
- **X Content:** (leave blank - will be auto-generated)
- **LinkedIn Content:** (leave blank - will be auto-generated)
- **Threads Content:** (leave blank - will be auto-generated)
- **Content Generated:** ❌ Unchecked
- **Social Posted:** ❌ Unchecked

---

## ✅ Step 7: Test the System! (2 minutes)

### 7.1 Run the Generator
Open your terminal and run:

```bash
cd /Users/kevin/contentcreator/notion-blog
npm run generate-social
```

### 7.2 Expected Output
You should see:

```
🚀 Social Content Generator
==================================================

📝 Checking for published blog posts...
✅ Found 1 published post(s)

🔍 Checking tracker database...
📊 Tracker Stats:
   Total items: 1
   Needing social content: 1

📋 Posts needing social content:

1. "Building Blog with AI One Day"
   Status: Published
   Progress: 100%

Which post would you like to generate social content for? (1-1, or 'q' to quit):
```

**If you see this, it's working!** 🎉

### 7.3 If You Get Errors

**Error: "TRACKER_DATABASE_ID not configured"**
- Double-check you added the ID to `.env.local`
- Make sure there are no spaces around the `=`
- Restart your terminal

**Error: "Error fetching tracker items"**
- Verify you shared the database with your Notion integration (Step 3)
- Check the database ID is correct (32 characters)

---

## ✅ Step 8: Generate Your First Social Content (5 minutes)

### 8.1 Follow the Prompts
1. The script will ask you to select a post (type `1`)
2. It will show you the blog post details
3. It will provide a prompt for Claude Code

### 8.2 Generate Content with Claude Code
Copy the prompt from the terminal and ask me (Claude Code) to:

```
Generate social media content for this blog post:

Title: [Your post title]
Description: [Your description]
Tags: [Your tags]

Please create:
1. X (Twitter) thread (9 tweets, 280 chars each)
2. LinkedIn post (professional tone, 1300-2000 chars)
3. Threads post (casual, engaging, 9 posts)
```

I'll generate all three formats for you!

### 8.3 Paste Generated Content
The script will ask you to paste:
1. X (Twitter) content - paste and press Enter twice
2. LinkedIn content - paste and press Enter twice
3. Threads content - paste and press Enter twice

### 8.4 Verify in Notion
1. Go to your Content Tracker in Notion
2. Find the item you just worked on
3. You should see all three content fields filled!
4. "Content Generated" checkbox should be checked ✅

---

## 🎉 Success Checklist

- [x] ✅ Script module errors fixed
- [ ] ✅ Notion tracker database created
- [ ] ✅ 13 properties added
- [ ] ✅ Integration connected
- [ ] ✅ Database ID copied
- [ ] ✅ TRACKER_DATABASE_ID in .env.local
- [ ] ✅ First tracker item created
- [ ] ✅ `npm run generate-social` runs without errors
- [ ] ✅ Social content generated
- [ ] ✅ Content saved to Notion

---

## 📊 Your Next Steps After Setup

### Daily Workflow:
1. **When you start a new post:**
   - Create tracker item with Status: "Research" or "Draft"
   - Set due date and priority
   - Add task breakdown

2. **As you write:**
   - Update Progress (0-100%)
   - Update Status as you move through stages

3. **When you publish:**
   - Change Status to "Published"
   - Run `npm run generate-social`
   - Review generated content in Notion
   - Copy and post to social media
   - Check "Social Posted" when done
   - Change Status to "Promoted"

### Recommended Notion Views:
- **Active Work:** Filter Status ≠ Published/Promoted
- **This Week:** Filter Due Date = This week
- **Ready for Social:** Filter Status = Published AND Content Generated = false

---

## 🆘 Need Help?

If you get stuck at any step:
1. Check `CONTENT_TRACKER_SETUP.md` for detailed troubleshooting
2. Verify all properties are named exactly as shown (case-sensitive)
3. Make sure integration has access to the database
4. Restart your terminal after editing .env.local

---

**Ready to start? Let's do Step 1!** 🚀
