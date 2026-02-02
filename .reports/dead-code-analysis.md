# Dead Code Analysis Report

**Project:** notion-blog
**Date:** 2026-02-01
**Analysis Tools:** knip, depcheck, ts-prune
**Test Suite:** ❌ No tests found

---

## Executive Summary

Analyzed the codebase for dead code, unused dependencies, and unused exports. Found several categories of unused code:

- **3 unused dependencies** (can be safely removed with testing)
- **1 missing dependency** (needs to be installed)
- **4 unused exports in notion-tracker.ts** (features implemented but not used)
- **2 unused exports in notion.ts** (tag filtering features not implemented in UI)
- **2 unused TypeScript types** (social content generation types)

**⚠️ CRITICAL:** No test suite found. All changes will be made without automated test verification. Manual testing required.

---

## Category 1: SAFE - Unused Dependencies

These dependencies can be safely removed as they are not used anywhere in the codebase.

### 1.1 dotenv (Production Dependency)
- **Package:** `dotenv`
- **Found in:** `package.json` line 14
- **Reason:** Next.js 14 automatically loads `.env.local` files - explicit dotenv not needed
- **Risk:** LOW - Next.js handles environment variables natively
- **Recommendation:** ✅ Remove from dependencies

### 1.2 ts-node (Dev Dependency)
- **Package:** `ts-node`
- **Found in:** `package.json` line 27
- **Used by:** `generate-social` script in package.json
- **Impact:** Script `npm run generate-social` will break
- **Recommendation:** ⚠️ Keep if generate-social script is actively used, remove if not

### 1.3 typescript (Dev Dependency)
- **Package:** `typescript`
- **Status:** Not directly imported but used by Next.js build system
- **Recommendation:** ❌ DO NOT REMOVE - Required by Next.js for TypeScript compilation

### 1.4 @types/react-dom (Dev Dependency)
- **Package:** `@types/react-dom`
- **Status:** Not detected as used by depcheck
- **Recommendation:** ❌ DO NOT REMOVE - Required for TypeScript type checking in React DOM

---

## Category 2: CAUTION - Missing Dependencies

These packages are used but not listed in package.json.

### 2.1 highlight.js (MISSING)
- **Status:** 🚨 Used but not installed
- **Used in:** `src/app/posts/[slug]/page.tsx:8`
- **Import:** `import "highlight.js/styles/github.css"`
- **Impact:** Code syntax highlighting won't work
- **Recommendation:** ✅ Add to dependencies: `npm install highlight.js`

---

## Category 3: CAUTION - Unused Exports (Features Implemented But Not Used)

These are complete features that were implemented but aren't currently used by any UI components.

### 3.1 Content Tracker System (notion-tracker.ts)

**Background:** A complete content tracking system for managing blog post workflow from research to publication with social media content generation.

#### Unused Functions:
1. **updateTrackerItem** (line 150)
   - Used internally by `updateSocialContent` and `linkToBlogPost`
   - Not dead code - part of internal API

2. **getTrackerItem** (line 251)
   - Retrieves single tracker item by ID
   - Not used by generate-social.ts script

3. **getTrackerItemsByStatus** (line 296)
   - Filters tracker items by status (Research, Draft, Published, etc.)
   - Not used anywhere

4. **linkToBlogPost** (line 382)
   - Links tracker item to blog post via Notion relation
   - Not used anywhere

**Used Functions:**
- ✅ `getAllTrackerItems` - used by generate-social.ts
- ✅ `getItemsNeedingSocialContent` - used by generate-social.ts
- ✅ `updateSocialContent` - used by generate-social.ts
- ✅ `createTrackerItem` - exported and available

**Recommendation:**
- ⚠️ **DO NOT DELETE** - These are part of a feature system (content tracker)
- The tracker system is documented in:
  - `CONTENT_TRACKER_SETUP.md`
  - `guides/content-tracker-workflow.md`
  - `IMPLEMENTATION_COMPLETE.md`
- The script `generate-social.ts` uses this system
- Removing these would break the feature if it's expanded in the future

### 3.2 Tag Filtering System (notion.ts)

#### Unused Functions:
1. **getPostsByTag** (line 170)
   - Fetches posts filtered by a specific tag
   - Complete implementation with proper filtering and sorting
   - No UI component uses this yet

2. **getAllTags** (line 206)
   - Retrieves all unique tags from published posts
   - Would be used for tag cloud or filter UI

**Recommendation:**
- ⚠️ **CONSIDER REMOVAL** - Tag filtering UI not implemented
- Safe to remove if tag-based navigation is not planned
- If planning tag pages (e.g., `/tags/[tag]`), keep these functions

### 3.3 Unused TypeScript Types (tracker.ts)

1. **SocialContent** (line 61)
   - Type: `{ x: string; linkedIn: string; threads: string; }`
   - Purpose: Type for social content object
   - Not used - inline types used instead

2. **GenerateSocialContentParams** (line 67)
   - Parameters for social content generation
   - Not used anywhere

**Recommendation:**
- ✅ Safe to remove if not planning to use these types
- Low impact - just type definitions

---

## Category 4: DANGER - Special Files

These files are reported as unused but are actually required by Next.js.

### 4.1 Next.js Special Routes
- ❌ **DO NOT DELETE** `src/app/not-found.tsx` - Custom 404 page (Next.js convention)
- ❌ **DO NOT DELETE** `src/app/robots.ts` - Generates robots.txt (Next.js convention)
- ❌ **DO NOT DELETE** `src/app/sitemap.ts` - Generates sitemap.xml (Next.js convention)

These files export `default` which is detected as "unused" by ts-prune because they're loaded by Next.js automatically, not imported by other code.

---

## Recommendations Summary

### Immediate Actions (SAFE):

1. **Install missing dependency:**
   ```bash
   npm install highlight.js
   ```

2. **Remove unused dependency (if applicable):**
   ```bash
   npm uninstall dotenv
   ```
   Note: Only after verifying no manual dotenv usage exists

### Consider (MEDIUM PRIORITY):

1. **Evaluate tag filtering features:**
   - Keep `getPostsByTag` and `getAllTags` if planning tag-based navigation
   - Remove if no tag UI is planned in next 3-6 months

2. **Evaluate ts-node:**
   - If `generate-social` script is actively used, keep it
   - If script is deprecated, remove both ts-node and the script

3. **Clean up unused types:**
   - Remove `SocialContent` and `GenerateSocialContentParams` from `src/types/tracker.ts`
   - Low impact, reduces noise

### DO NOT REMOVE (HIGH RISK):

1. **Content Tracker System:**
   - Keep all exports in `notion-tracker.ts`
   - Complete feature system with documentation
   - May be used in future UI expansion

2. **Next.js Special Files:**
   - `not-found.tsx`
   - `robots.ts`
   - `sitemap.ts`

3. **Build Dependencies:**
   - `typescript`
   - `@types/react-dom`

---

## Testing Strategy

**⚠️ CRITICAL: No automated tests found in this project**

### Before Making Any Changes:

1. **Manual Testing Checklist:**
   - [ ] Homepage loads (`npm run dev` → http://localhost:3000)
   - [ ] Posts page loads (`/posts`)
   - [ ] Individual post pages load (`/posts/[slug]`)
   - [ ] Code syntax highlighting works (check code blocks in posts)
   - [ ] Environment variables load correctly
   - [ ] Build succeeds (`npm run build`)
   - [ ] Production build runs (`npm start`)

2. **After Each Deletion:**
   - [ ] Re-run all manual tests above
   - [ ] Check browser console for errors
   - [ ] Verify no TypeScript compilation errors
   - [ ] Test generate-social script if modified

### Rollback Plan:
```bash
# If something breaks after deletion
git restore package.json package-lock.json
npm install
```

---

## Detailed Analysis Output

### Tool: knip
Found issues in 5 files:
- package.json: unused deps (dotenv, ts-node)
- src/app/posts/[slug]/page.tsx: unlisted dep (highlight.js)
- src/lib/notion.ts: unused exports (getPostsByTag, getAllTags)
- src/lib/notion-tracker.ts: unused exports (4 functions)
- src/types/tracker.ts: unused types (2 types)

### Tool: depcheck
- Unused dependencies: dotenv
- Unused devDependencies: @types/react-dom, ts-node, typescript
- Missing dependencies: highlight.js

### Tool: ts-prune
Found 20 exports total, 12 marked as unused (but many are false positives like Next.js special routes)

---

## Conclusion

The codebase has moderate dead code, primarily in two areas:

1. **Feature Code:** Content tracker and tag filtering systems are implemented but not fully utilized in the UI
2. **Dependencies:** Some cleanup possible (dotenv, possibly ts-node)
3. **Critical Issue:** Missing `highlight.js` dependency needs immediate installation

**Next Steps:**
1. Install `highlight.js` (critical)
2. Remove `dotenv` (safe)
3. Decide on tag filtering features (business decision)
4. Consider implementing tests before further cleanup

---

**Generated by:** Claude Code Refactor Clean Agent
**Tools Used:** knip@5.82.1, depcheck@1.4.7, ts-prune@0.10.3
