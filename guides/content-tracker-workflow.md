# Content Tracker Workflow Guide

Quick reference for using the Content Tracker system in your daily content creation workflow.

## The Content Creation Lifecycle

```
Idea → Research → Outline → Draft → Edit → Review → Publish → Promote
  ↓        ↓         ↓        ↓      ↓       ↓         ↓         ↓
  0%      20%       40%      60%    80%     90%      100%      100%
```

---

## Phase 1: Idea to Research

### When You Have a New Idea

**In Notion Tracker:**
1. Create new item with the idea title
2. Set Status: "Research"
3. Set Progress: 0-10%
4. Add relevant Tags
5. Set Priority
6. Set Due Date (if applicable)

**Tasks to Add:**
```
- [ ] Research existing content on topic
- [ ] Identify unique angle
- [ ] List key points to cover
- [ ] Find examples/case studies
- [ ] Identify target audience
```

**Example:**
```
Title: How to Optimize Database Queries in Next.js
Status: Research
Progress: 5%
Priority: Medium
Due Date: 2026-02-20
Tags: Tutorial, Next.js, Database, Performance
```

---

## Phase 2: Research to Outline

### After Research is Complete

**Update Tracker:**
- Status: "Outline"
- Progress: 20-40%

**Tasks:**
```
- [x] Research existing content
- [x] Identify unique angle
- [x] List key points
- [ ] Create detailed outline
- [ ] Plan code examples
- [ ] Determine post structure
```

**Create Outline File:**
```bash
# Create outline in content directory
mkdir -p content/your-post-slug
touch content/your-post-slug/outline.md
```

---

## Phase 3: Outline to Draft

### Start Writing

**Update Tracker:**
- Status: "Draft"
- Progress: 40-70%

**Tasks:**
```
- [x] Create detailed outline
- [ ] Write introduction
- [ ] Write main sections (3-5 sections)
- [ ] Add code examples
- [ ] Write conclusion
- [ ] Add call-to-action
```

**Writing Tips:**
- Don't edit while drafting - just write
- Use placeholder text for complex sections
- Mark areas needing code examples: `[CODE: Example here]`
- Update progress every 10%

---

## Phase 4: Draft to Review

### Editing and Polishing

**Update Tracker:**
- Status: "Edit" (while editing)
- Status: "Review" (when ready for final review)
- Progress: 70-90%

**Tasks:**
```
- [x] Complete first draft
- [ ] Edit for clarity
- [ ] Check code examples
- [ ] Add images/diagrams
- [ ] Proofread
- [ ] Check links
- [ ] Verify technical accuracy
```

**Quality Checklist:**
- [ ] Clear introduction with hook
- [ ] Logical flow between sections
- [ ] Code examples are tested and working
- [ ] Conclusion summarizes key points
- [ ] Call-to-action is clear
- [ ] No typos or grammatical errors
- [ ] All links work

---

## Phase 5: Review to Publish

### Final Steps Before Publishing

**Update Tracker:**
- Status: "Published" (after publishing)
- Progress: 100%
- Link to Blog Post (use relation property)

**Pre-Publish Checklist:**
```
- [ ] Final proofread
- [ ] Verify all code examples
- [ ] Check images render correctly
- [ ] Set correct tags in Notion
- [ ] Write compelling description
- [ ] Choose good slug
- [ ] Set publish date
```

**Publishing to Notion:**

1. Open your Blog Posts database in Notion
2. Create new page
3. Set properties:
   - Title
   - Slug (URL-friendly: `my-post-title`)
   - Date
   - Description (for SEO)
   - Tags
   - **Published: ✅ CHECK THIS**

4. Paste content from `content/your-post-slug/blog-post-clean.md`

5. Verify on your blog (wait 60 seconds for ISR)

6. Update tracker:
   - Status: "Published"
   - Progress: 100%
   - Link to blog post

---

## Phase 6: Publish to Promote

### Generate and Post Social Content

**Run the Generator:**
```bash
npm run generate-social
```

**Follow the prompts to:**
1. Select your published post
2. Generate social content with Claude Code
3. Paste generated content (X, LinkedIn, Threads)
4. Content is saved to Notion automatically

**Post to Social Media:**

**X (Twitter):**
- Use thread format (see `guides/x-posting.md`)
- Post during high-engagement times (9-11 AM EST)
- Engage with replies for first 2 hours

**LinkedIn:**
- Professional tone
- Post Tuesday-Thursday, 9-11 AM
- Add relevant hashtags
- Engage with comments

**Threads:**
- Casual, conversational tone
- Evening posts (6-9 PM) perform well
- Use authentic voice

**After Posting:**
- Check "Social Posted" in tracker
- Change Status to "Promoted"

---

## Daily Workflow Examples

### Morning Routine (10 minutes)

```
1. Open Content Tracker in Notion
2. Check "This Week" view
3. Identify top 3 priorities for today
4. Update status/progress on active items
5. Plan writing blocks in calendar
```

### During Writing Session

```
1. Open specific tracker item
2. Check off completed tasks
3. Update progress every 30 minutes
4. Add notes in Tasks field for next session
5. Update status if phase changes
```

### Weekly Review (30 minutes)

```
1. Review all tracker items
2. Update overdue items:
   - Adjust due dates
   - Re-prioritize
   - Archive if no longer relevant
3. Plan next week's content
4. Create tracker items for new ideas
5. Check "Promoted" items - analyze performance
```

---

## Notion Views for Different Contexts

### View 1: Active Writing
**Filter:**
- Status is "Draft" OR "Edit"
- Sorted by: Due Date (ascending)

**Use when:** Daily writing sessions

### View 2: Ready to Publish
**Filter:**
- Status is "Review"
- Progress >= 90%

**Use when:** Planning publishing schedule

### View 3: Promotion Queue
**Filter:**
- Status is "Published"
- Content Generated is unchecked

**Use when:** Generating social content

### View 4: Performance Tracking
**Filter:**
- Status is "Promoted"
- Sorted by: Created Date (newest first)

**Use when:** Reviewing published content

---

## Automation Ideas

### Auto-Create Tracker Items

When you publish a blog post, automatically create a tracker item:

```typescript
// In your publish workflow
import { createTrackerItem } from '@/lib/notion-tracker';
import { getAllPosts } from '@/lib/notion';

const newPost = await publishPost(...);

await createTrackerItem({
  title: newPost.title,
  status: "Published",
  progress: 100,
  blogPostId: newPost.id,
  tags: newPost.tags,
  priority: "High"
});
```

### Scheduled Social Content Generation

Set up a cron job or scheduled task:

```bash
# Run every day at 9 AM
0 9 * * * cd /path/to/notion-blog && npm run generate-social
```

---

## Tips for Consistency

### Set Realistic Deadlines
- Research: 1-2 days
- Outline: 1 day
- Draft: 2-3 days
- Edit/Review: 1-2 days
- **Total: ~1 week per post**

### Track Your Time
Add a "Time Spent" number property to track hours:
- Helps improve estimates
- Identifies bottlenecks
- Shows what content takes longest

### Use Templates
Create templates for common post types:
- Tutorial posts
- Career insights
- Technical deep-dives
- Quick tips

### Build a Content Calendar
Use Notion calendar view:
1. Add Calendar view to tracker
2. Set calendar source: Due Date
3. Visualize your content pipeline
4. Avoid publishing everything at once

---

## Metrics to Track

**Content Creation:**
- Average time per post
- Draft → Published time
- Posts per month
- Content type distribution

**Social Performance:**
- Engagement per platform
- Best posting times
- Most effective content types
- Click-through rates

**Add to Tracker:**
Create these optional properties:
- Views (number)
- Engagement Score (number)
- Best Platform (select: X, LinkedIn, Threads)
- Lessons Learned (text)

---

## Troubleshooting Common Issues

### "I have too many drafts!"
**Solution:**
- Set a rule: Max 3 active drafts
- Finish or archive before starting new
- Use Priority ruthlessly

### "I never finish posts"
**Solution:**
- Break into smaller milestones
- Set shorter deadlines (3-day drafts)
- Use Tasks field to track daily progress
- Publish "good enough" - iterate later

### "Social content generation takes too long"
**Solution:**
- Use the automation script!
- Generate while writing (outline → tweets)
- Keep a swipe file of good posts
- Batch generate for multiple posts

---

## Next Steps

1. **Set up your tracker** (see `CONTENT_TRACKER_SETUP.md`)
2. **Create your first item** for current work-in-progress
3. **Experiment with views** to find what works for you
4. **Refine your workflow** based on what you learn
5. **Track metrics** to improve over time

---

**Remember:** The tracker is a tool to help you, not a bureaucratic burden. Adapt it to fit your style!
