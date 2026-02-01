
## Introduction: When AI Meets Ambition

Today, I did something I've been putting off for months: I finally built my own blog. But here's the twist – I didn't spend weeks planning, designing, or coding. I built a production-ready, Notion-powered blog and deployed it to the web in just a few hours, with AI as my pair programmer.

This isn't just another "look what AI can do" story. This is about the practical reality of AI-assisted development in 2026, the technical decisions we made together, and what this means for developers navigating the modern tech landscape.

## The Vision: Why Notion as a CMS?

I've always been frustrated with traditional blogging platforms. WordPress feels bloated. Medium doesn't give you ownership. Static site generators require too much context switching between writing and coding. I wanted something that felt natural – write in Notion (where I already organize my thoughts), and have it automatically appear on my blog.

The requirements were clear:
- **Write in Notion** - familiar, beautiful editor
- **Notion-style design** - clean, minimal, focused on content
- **Blazing fast** - static generation with smart caching
- **Zero maintenance** - auto-deploy, auto-update
- **Full control** - my domain, my design, my data

## The Stack: Modern, Minimal, Powerful

We chose a deliberately simple but powerful stack:

### Next.js 14 (App Router)
The newest App Router architecture gives us server components by default, perfect for a content-heavy site. ISR (Incremental Static Regeneration) means pages rebuild every 60 seconds – fresh content without constant redeployment.

### Notion API
Notion becomes our headless CMS. No admin panel to build, no database to manage. Just a simple database with properties like Title, Slug, Date, and Published. Write in Notion, and it's live within a minute.

### React Markdown
Converting Notion's markdown output to beautifully styled HTML. With syntax highlighting for code blocks, proper typography, and responsive images.

### Vercel
Push to GitHub, and it's deployed. Automatic HTTPS, global CDN, zero configuration. The modern deployment experience.

## The Build Process: AI as a Development Partner

Here's where it gets interesting. I used Claude Code – not just as a code generator, but as an actual development partner. Let me walk you through how this worked in practice.

### Phase 1: Project Setup (15 minutes)

**Me**: "I want to build a Notion blog with Next.js. Help me set up the project structure."

**Claude Code**: Immediately created:
- Next.js 14 project with TypeScript
- Notion API integration (`@notionhq/client`)
- Environment variable setup
- Git repository initialization

What would normally take me 30-45 minutes (deciding on structure, installing packages, configuring TypeScript, setting up linting) was done in minutes. But more importantly, Claude suggested architectural decisions I would have spent hours researching.

### Phase 2: Notion Integration (30 minutes)

This is where AI shines. I described what I wanted: "Fetch posts from a Notion database and convert them to blog posts."

Claude Code:
1. Created type-safe Notion API helpers
2. Built data transformation functions (Notion's API response → clean Post objects)
3. Implemented markdown conversion using `notion-to-md`
4. Added proper TypeScript types for every step

The fascinating part? When we hit a TypeScript error during deployment (a type mismatch in the filter function), Claude immediately diagnosed the issue and fixed it. No Stack Overflow search. No trial and error. Just: "This is the problem, here's the fix, and here's why."

### Phase 3: The UI Challenge (45 minutes)

I wanted the blog to *feel* like Notion. Not just look similar – actually feel like reading in Notion.

**The Challenge**: Notion uses system fonts (San Francisco on Mac, Segoe UI on Windows). Most blogs use custom web fonts that slow down loading and don't match what users see in Notion.

**The Solution**: Claude suggested using the exact font stack Notion uses:
```css
--font-body: ui-sans-serif, -apple-system, BlinkMacSystemFont,
             "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic",
             Helvetica, Arial, sans-serif;
```

This creates instant familiarity. When you switch from writing in Notion to reading on my blog, it feels like the same environment.

We also matched Notion's content styling:
- Headings with proper hierarchy
- Lists with correct spacing
- Code blocks with syntax highlighting
- Quotes with left-border styling
- Inline code with pink highlights (just like Notion!)

### Phase 4: Deployment Reality Check (20 minutes)

The first deployment failed. TypeScript compilation error on Vercel.

**Old way**: Panic, Google the error, read through Stack Overflow, try different solutions.

**AI-assisted way**:
- Pasted the error
- Claude identified the exact line
- Explained the type inference issue
- Fixed it
- Committed and pushed

Build succeeded on the second try.

## Technical Deep Dive: How It Actually Works

Let me break down the architecture for fellow developers:

### Data Flow

1. **Notion Database** → Properties define metadata (Title, Slug, Date, Published)
2. **Notion Page Content** → The actual blog post content
3. **API Fetch** → `@notionhq/client` queries the database
4. **Markdown Conversion** → `notion-to-md` transforms Notion blocks
5. **React Rendering** → `react-markdown` with custom components
6. **ISR Cache** → Next.js regenerates every 60 seconds

### The Smart Parts

**ISR (Incremental Static Regeneration)**:
```typescript
export const revalidate = 60;
```

This single line means:
- Pages are statically generated at build time (fast)
- Every 60 seconds, Next.js checks for updates
- New content appears within a minute
- No manual redeployment needed

**Type-Safe Notion Integration**:
```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  published: boolean;
}
```

Every Notion property is properly typed. If Notion's API changes or returns unexpected data, TypeScript catches it at build time.

**Custom Markdown Components**:
```typescript
const markdownComponents = {
  h2: ({ children }: any) => <h2 className="notion-h2">{children}</h2>,
  code: ({ inline, children }: any) =>
    inline
      ? <code className="notion-inline-code">{children}</code>
      : <code>{children}</code>,
  // ... more custom components
};
```

This gives us Notion-style rendering with complete control over HTML output.

## The Challenges: What Didn't Go Smoothly

Not everything was smooth sailing. Here are the real problems we encountered:

### TypeScript Type Gymnastics

The Notion API returns a union type: `PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse`. Our type guard function needed to handle all possible types:

```typescript
function isFullPage(response: any): response is PageObjectResponse {
  return "properties" in response && response.object === "page";
}
```

The initial implementation failed at build time on Vercel. Local development worked fine, but production TypeScript compilation was stricter. This is exactly the kind of issue that would have cost me an hour of debugging without AI assistance. Claude identified the problem instantly and explained why the stricter production build caught it.

### Markdown Conversion Edge Cases

Notion's block structure doesn't map 1:1 to markdown. Numbered lists, nested blocks, and callouts required special handling. We initially used a simple regex-based markdown parser that broke on complex content.

The solution? Switching to `react-markdown` with custom components. This handles edge cases gracefully and gives us fine-grained control over rendering.

### Font Rendering Consistency

Getting the Notion "feel" was harder than expected. The font stack needed to:
- Match Notion's exact fonts on each platform
- Load instantly (no web font delay)
- Handle multilingual content (Korean, English, Spanish)
- Degrade gracefully on unsupported platforms

The final font stack took several iterations:
```css
font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont,
             "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic",
             Helvetica, Arial, sans-serif;
```

This loads the best available font immediately, with no flash of unstyled text.

### ISR Cache Invalidation

ISR is powerful but has nuances. Initially, I didn't understand that:
- Changes take up to 60 seconds to appear
- The first request after 60 seconds triggers regeneration
- Subsequent requests see cached content while regeneration happens in background

This caused confusion during testing. I'd update Notion, refresh immediately, and see old content. Understanding the ISR lifecycle was crucial.

## What This Means for Developers in 2026

Building this blog taught me something crucial about modern development:

### 1. AI Doesn't Replace Developers – It Amplifies Judgment

I still made every architectural decision. Should we use ISR or SSR? System fonts or web fonts? React Markdown or custom parser?

But AI compressed the research → decision → implementation cycle from hours to minutes. Instead of reading 10 blog posts about ISR, I asked Claude, got a clear explanation, and made an informed decision.

### 2. The New Bottleneck is Communication, Not Coding

The limiting factor wasn't writing code – it was clearly communicating what I wanted. The better I described the goal, the better the result. This is a skill we need to develop.

### 3. Complexity Budget Has Increased

Before AI assistance, I would have built the simplest possible blog. Just markdown files and basic styling. Too much complexity = too much time.

Now? We built:
- Full Notion API integration
- TypeScript throughout
- Custom markdown rendering
- Notion-matching design system
- Auto-deployment pipeline

The complexity budget increased because implementation time decreased.

## The Career Perspective: Why This Matters Beyond Code

Building this blog is more than a technical project – it's a reflection of how I approach my career in tech across multiple countries and industries.

### From Korea to Germany to Spain: Lessons in Adaptability

My journey through different tech ecosystems taught me that tools change, frameworks evolve, but the fundamentals remain. In Korea, the focus was on speed and execution. In Germany, on precision and documentation. In Spain, on work-life integration and sustainable development.

This blog embodies all three:
- **Speed** (Korean influence): Built and deployed in hours, not weeks
- **Precision** (German influence): TypeScript throughout, proper error handling, documented code
- **Sustainability** (Spanish influence): Zero maintenance, write naturally in Notion, automated everything

### Supply Chain Thinking Applied to Content

My background in supply chain operations shaped how I approached this project:

**Minimize Touch Points**: In supply chain, every transfer point adds cost and risk. In content creation, every tool switch (Notion → Editor → CMS → Preview → Deploy) adds friction. This blog eliminates 80% of those touch points.

**Just-in-Time Content**: Like JIT manufacturing, ISR ensures content is fresh without over-production. Pages regenerate when needed, not on every deploy.

**Reduce Inventory**: No database of posts, no media library, no admin panel. Notion is the single source of truth. Simpler inventory, fewer failure points.

### Building in Public: The Modern Career Strategy

This blog represents a shift in how I think about career development. Traditional career advice says:
- Build in private
- Only show finished work
- Maintain professional mystique

Modern career reality:
- Learn in public
- Share the process, not just results
- Build trust through transparency

This post itself is an example. I'm sharing:
- The exact tools I used
- The problems I faced
- The AI assistance I received
- The GitHub repository
- The live deployment

This level of transparency would have seemed risky five years ago. Now, it's how you demonstrate real capability. Anyone can claim they "know Next.js." Shipping a live project and explaining the decisions shows actual understanding.

## Lessons for Content Creators and Developers

### For Content Creators:

**Own Your Platform**: Medium can change their algorithm. Substack can change their terms. Your Notion database? That's yours forever. This setup gives you the reach of a modern blog with the convenience of Notion.

**Write Where You Think**: If you organize notes in Notion, research in Notion, plan in Notion – why context-switch to WordPress? Write in the same tool where your ideas live.

### For Developers:

**Don't Overthink the Stack**: I almost went with a complex CMS, a design system library, and a custom component library. The simple stack (Next.js + Notion + React Markdown) was the right choice. AI makes simple stacks powerful.

**Iterate Quickly**: The first version took a few hours. But it's *deployed* and *working*. I can iterate from here based on real usage, not imagined requirements.

**Learn from AI Suggestions**: When Claude suggested using ISR instead of pure SSG, I asked why. The explanation taught me something new about Next.js caching strategies.

## The Results: What We Shipped

**Live Site**: [notion-blog-cosqyu0km-sunghun-juns-projects.vercel.app](https://notion-blog-cosqyu0km-sunghun-juns-projects.vercel.app)

**GitHub**: [github.com/scba-lab/notion-blog](https://github.com/scba-lab/notion-blog)

**Features**:
- ✅ Notion-powered content management
- ✅ Notion-style design and typography
- ✅ Full markdown support (code, quotes, lists, headings)
- ✅ Tag system for categorization
- ✅ Auto-deployment (push to GitHub → live in 2 minutes)
- ✅ 60-second ISR for fresh content
- ✅ Mobile responsive
- ✅ Syntax highlighting for code blocks
- ✅ SEO-friendly with proper metadata

**Performance**:
- Lighthouse score: 100 (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1 second
- Time to Interactive: < 2 seconds

## What's Next: The Roadmap

Now that the foundation is solid, here's what I'm planning:

**Phase 2: Enhanced Features**
- Search functionality
- Table of contents for long posts
- Reading time estimates
- Related posts suggestions

**Phase 3: Analytics & Optimization**
- Privacy-friendly analytics
- Image optimization
- Advanced caching strategies

**Phase 4: Content Strategy**
- Technical deep-dives on AI-assisted development
- Career insights from navigating tech in Korea, Germany, and Spain
- Supply chain and operations learnings
- Building in public updates

## Final Thoughts: The Future is Collaborative

Today proved something important: the future of development isn't "AI vs. Developers" – it's developers leveraging AI to build faster, learn quicker, and ship better products.

I built a production blog in one afternoon. But more importantly, I learned:
- How ISR works in Next.js 14
- Proper TypeScript type guards
- Notion API patterns
- Markdown rendering optimization
- Vercel deployment strategies

The code is the artifact. The knowledge is the value.

If you're a developer hesitating to try AI-assisted coding, start with a real project. Not a tutorial. Not a todo app. Something you actually want to ship. You'll be amazed at what's possible.

And if you're a content creator who can code (or wants to learn), this stack is for you. Write in Notion. Deploy to Vercel. Own your platform.

---

## Try It Yourself

The entire project is open source:

**GitHub**: [github.com/scba-lab/notion-blog](https://github.com/scba-lab/notion-blog)

**Setup Time**: 30 minutes
**Cost**: $0 (Notion free tier + Vercel free tier)
**Complexity**: Medium (Next.js knowledge helpful)

Clone it, customize it, make it yours.

---

**About the Author**: I'm a developer navigating the intersection of AI, web development, and international tech careers. Currently exploring how AI tools change the way we build and ship products. Follow my journey as I build in public and share what I learn.

**Tech Stack**: Next.js 14, TypeScript, Notion API, React Markdown, Vercel
**Build Time**: ~3 hours
**Built With**: Claude Code (AI pair programmer)
**Status**: Production, live, and accepting new posts daily

---

*Want to build something similar? Drop me a message or check out the GitHub repo. I'm always happy to chat about AI-assisted development, international tech careers, or the best coffee shops in Madrid.*
