# Content Directory

This directory contains all blog post content organized by post.

## Structure

```
content/
├── README.md (this file)
├── first-post/
│   ├── blog-post.md              # Full blog post with metadata
│   ├── blog-post-clean.md        # Clean content for copy-paste to Notion
│   └── social-media.md           # X, LinkedIn, Threads content
└── [future-posts]/
    └── ...
```

## Creating New Post Content

When creating a new post:

1. Create a new folder: `content/your-post-slug/`
2. Add these files:
   - `blog-post.md` - Full blog content with frontmatter
   - `social-media.md` - Social media promotional content
   - `assets/` - Any images specific to this post

## Publishing Workflow

1. Write blog post → `blog-post.md`
2. Publish to Notion (see `/guides/notion-publishing.md`)
3. Post social content (see `/guides/x-posting.md`)
4. Track in Content Tracker (coming soon!)
