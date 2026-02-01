# Content Organization Guide

## Directory Structure

```
notion-blog/
├── src/                          # Next.js application code
├── content/                      # Blog post content
│   ├── README.md
│   └── first-post/
│       ├── blog-post.md          # Full blog post with metadata
│       ├── blog-post-clean.md    # Clean version for Notion
│       └── social-media.md       # X, LinkedIn, Threads posts
├── guides/                       # Publishing workflow guides
│   ├── README.md
│   ├── notion-publishing.md      # How to publish to Notion
│   ├── x-posting.md              # How to post on X/Twitter
│   └── image-design.md           # Social media image specs
├── assets/                       # Media files
│   └── first-post/               # Images for first post
├── profile/                      # X/Twitter profile setup
│   ├── X_BIO_OPTIONS.md
│   ├── X_BIO_SUPPLY_CHAIN_FOCUSED.md
│   └── FINAL_X_PROFILE_SETUP.md
├── CLAUDE.md                     # AI assistant instructions
├── README.md                     # Project overview
└── DEPLOYMENT.md                 # Deployment guide
```

## Content Workflow

### 1. Write Content (`content/`)
Each blog post gets its own folder:
```bash
content/
└── your-post-slug/
    ├── blog-post.md           # Full post
    ├── social-media.md        # Social content
    └── assets/                # Post-specific images
```

### 2. Publish to Notion
- Follow `guides/notion-publishing.md`
- Use `blog-post-clean.md` for easy copy-paste
- ISR refreshes blog within 60 seconds

### 3. Promote on Social Media
- Use `social-media.md` for X, LinkedIn, Threads
- Follow `guides/x-posting.md` for X threads
- Create images using `guides/image-design.md`

### 4. Track Progress (Coming Soon!)
- Content Tracker in Notion
- Multi-step workflow tracking
- Auto-generate social content

## Quick Commands

```bash
# Create new post structure
mkdir -p content/new-post-slug
touch content/new-post-slug/blog-post.md
touch content/new-post-slug/social-media.md

# List all posts
ls -1 content/

# View publishing guides
cat guides/README.md
```

## File Naming Conventions

- **Post folders**: Use slug format (`my-post-title`, not `My Post Title`)
- **Markdown files**: Use kebab-case (`blog-post.md`, not `BlogPost.md`)
- **Guides**: Descriptive names (`notion-publishing.md`)
- **Assets**: Organize by post folder

## Benefits of This Organization

✅ **Scalable**: Easy to add new posts
✅ **Clear separation**: Content vs guides vs code
✅ **Reusable**: Guides work for all posts
✅ **Organized**: Each post's assets stay together
✅ **Version control friendly**: Git-friendly structure
