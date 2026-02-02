# Operations Runbook

**Project:** Notion Blog
**Environment:** Production (scbalab.com)
**Last Updated:** 2026-02-02

---

## Table of Contents

1. [Deployment Procedures](#deployment-procedures)
2. [Monitoring & Health Checks](#monitoring--health-checks)
3. [Common Issues & Fixes](#common-issues--fixes)
4. [Rollback Procedures](#rollback-procedures)
5. [Emergency Contacts](#emergency-contacts)

---

## Deployment Procedures

### Pre-Deployment Checklist

- [ ] All changes tested locally (`npm run dev`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Environment variables verified in Vercel dashboard
- [ ] Notion databases accessible and shared with integration

### Standard Deployment (Vercel)

**Automatic Deployment** (recommended)
```bash
# Push to main branch triggers auto-deployment
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically:
1. Detects push to main
2. Runs `npm run build`
3. Deploys to production
4. Updates scbalab.com

**Manual Deployment**
```bash
# Deploy current directory to production
vercel --prod

# Or deploy specific branch
vercel --prod --branch main
```

### Post-Deployment Verification

1. **Check deployment status**
   - Visit https://vercel.com/dashboard
   - Verify deployment shows "Ready"
   - Check build logs for errors

2. **Verify site functionality**
   - Visit https://scbalab.com
   - Homepage loads
   - Recent posts appear
   - Individual post pages work
   - No console errors in browser DevTools

3. **Test ISR**
   - Make a change in Notion
   - Wait 60 seconds
   - Refresh page to see update

### Environment Variables Update

**In Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add/update variables
3. Click "Save"
4. Redeploy for changes to take effect:
   ```bash
   vercel --prod
   ```

**Required Production Env Vars:**
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `NEXT_PUBLIC_SITE_URL=https://scbalab.com`
- `NEXT_PUBLIC_SITE_NAME=SCBA.Lab`
- `TRACKER_DATABASE_ID` (optional)
- `ANTHROPIC_API_KEY` (optional, for social gen)

---

## Monitoring & Health Checks

### Automated Monitoring

**Vercel provides:**
- Deployment status notifications
- Build failure alerts
- Runtime error tracking (Vercel Analytics)

**Access:**
- Dashboard: https://vercel.com/dashboard
- Analytics: Project → Analytics tab

### Manual Health Checks

**Daily (automated by Vercel):**
- Site availability (uptime monitoring)
- SSL certificate validity
- DNS resolution

**Weekly (manual):**
- [ ] Check latest posts appear correctly
- [ ] Verify Notion integration still works
- [ ] Test a new blog post publication
- [ ] Review Vercel analytics for errors

**Monthly (manual):**
- [ ] Review API usage and costs
- [ ] Check for dependency updates
- [ ] Verify backup procedures
- [ ] Test content tracker if using

### Key Metrics

| Metric | Target | Check How |
|--------|--------|-----------|
| **Uptime** | >99.9% | Vercel dashboard |
| **Page Load** | <2s | Browser DevTools, Lighthouse |
| **Build Time** | <3min | Vercel deployment logs |
| **First Load JS** | <100KB | `npm run build` output |
| **API Calls** | <1000/day | Notion integration dashboard |

### Alerts & Notifications

**Vercel sends alerts for:**
- ❌ Build failures
- ❌ Deployment errors
- ⚠️ Performance degradation
- ✅ Successful deployments

**Configure:**
1. Vercel Dashboard → Project Settings
2. Git → Notifications
3. Enable email/Slack notifications

---

## Common Issues & Fixes

### Issue: Build Failure

**Symptoms:**
- Vercel deployment fails
- Error in build logs
- Site shows old version

**Diagnosis:**
```bash
# Reproduce locally
npm run build

# Check logs for specific error
```

**Common Causes & Fixes:**

1. **TypeScript Error**
   ```bash
   # Check types
   npm run lint

   # Fix type issues in reported files
   ```

2. **Notion API Error**
   - **Cause:** Database not shared with integration
   - **Fix:** Share database with integration in Notion
   - **Verify:** Check NOTION_DATABASE_ID is correct

3. **Environment Variable Missing**
   - **Cause:** Required env var not set in Vercel
   - **Fix:** Add to Vercel dashboard → Redeploy

4. **Dependency Issue**
   ```bash
   # Clear and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

---

### Issue: Content Not Updating

**Symptoms:**
- New Notion posts don't appear
- Changes to posts not reflecting
- Old content still showing

**Diagnosis:**
1. Check if 60 seconds (ISR period) has passed
2. Verify "Published" checkbox in Notion
3. Check database is shared with integration

**Fixes:**

1. **Wait for ISR**
   - Next.js ISR revalidates every 60 seconds
   - Wait and refresh

2. **Manual Revalidation**
   ```bash
   # Redeploy to force regeneration
   vercel --prod
   ```

3. **Check Notion Permissions**
   - Open database in Notion
   - Click "..." → Check "Connections"
   - Ensure integration has access

4. **Verify Environment**
   ```bash
   # Check NOTION_DATABASE_ID
   echo $NOTION_DATABASE_ID

   # Should match database URL
   ```

---

### Issue: Social Content Generation Fails

**Symptoms:**
- `npm run generate-social` errors
- Content not saving to tracker
- API errors

**Diagnosis:**
```bash
# Run with verbose output
npm run generate-social 2>&1 | tee social-gen-error.log
```

**Common Causes & Fixes:**

1. **Missing API Key**
   ```bash
   # Check .env.local has ANTHROPIC_API_KEY
   grep ANTHROPIC_API_KEY .env.local
   ```

2. **Model Not Found**
   - **Error:** "model: claude-X not found"
   - **Fix:** Update to `claude-3-haiku-20240307` in script

3. **Tracker Database Not Shared**
   - Share tracker database with Notion integration
   - Verify TRACKER_DATABASE_ID is correct

4. **Character Limit Exceeded**
   - **Fixed in:** Latest version splits long content
   - **Update:** Pull latest code if seeing this error

5. **Property Name Mismatch**
   - **Error:** "X Content is not a property"
   - **Fix:** Ensure property names match exactly:
     - `X Content` (capital C)
     - `LinkedIn Content`
     - `Threads Content`

---

### Issue: 404 on Post Page

**Symptoms:**
- Post shows on homepage
- Clicking post shows 404
- URL looks correct

**Diagnosis:**
1. Check Notion "Slug" property is filled
2. Verify slug matches URL
3. Check slug is unique

**Fix:**
```bash
# Regenerate static paths
npm run build
vercel --prod
```

---

### Issue: Slow Page Load

**Symptoms:**
- Pages load >3 seconds
- Poor Lighthouse scores

**Diagnosis:**
```bash
# Check bundle size
npm run build

# Look for large chunks
```

**Fixes:**

1. **Optimize Images**
   - Use Next.js `<Image>` component
   - Compress images before uploading

2. **Reduce Bundle Size**
   - Check for large dependencies
   - Use dynamic imports for heavy components

3. **Check ISR**
   - Verify pages are being statically generated
   - Look for "●" (SSG) not "λ" (server) in build output

---

## Rollback Procedures

### Quick Rollback (Vercel)

**Via Dashboard:**
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Confirm rollback

**Via CLI:**
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

### Git-Based Rollback

```bash
# Find last working commit
git log --oneline

# Revert to specific commit
git revert <commit-hash>
git push origin main

# Or hard reset (use with caution)
git reset --hard <commit-hash>
git push origin main --force
```

### Emergency Rollback Checklist

- [ ] Identify last working deployment/commit
- [ ] Execute rollback (Vercel or git)
- [ ] Verify site functionality
- [ ] Check error logs cleared
- [ ] Document incident and root cause
- [ ] Plan fix for next deployment

---

## Database Recovery

### Notion Database Backup

**Notion databases are backed up automatically by Notion.**

**Manual Export** (for safety):
1. Open database in Notion
2. Click "..." → "Export"
3. Choose "Markdown & CSV"
4. Save export file

### Restoring Database Access

**If integration loses access:**
1. Open database in Notion
2. Click "..." → "Add connections"
3. Select your integration
4. Click "Confirm"
5. Redeploy site

---

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle
npm run build

# Check for:
# - Large chunks (>100KB)
# - Duplicate dependencies
# - Unnecessary imports
```

### Caching Strategy

**Current Setup:**
- ISR: 60 second revalidation
- Static assets: Cached by Vercel CDN
- API calls: No caching (fresh from Notion)

**To Adjust ISR:**
```typescript
// In page.tsx
export const revalidate = 60; // seconds
```

### CDN & Edge

- Vercel Edge Network handles CDN
- Static pages served from edge
- No additional CDN configuration needed

---

## Security

### API Key Rotation

**Notion API Key:**
1. Create new integration at notion.so/my-integrations
2. Update `NOTION_API_KEY` in Vercel
3. Redeploy
4. Revoke old key in Notion

**Anthropic API Key:**
1. Generate new key at console.anthropic.com
2. Update `ANTHROPIC_API_KEY` in `.env.local`
3. Update in Vercel if used in production
4. Revoke old key

### Environment Variable Security

- ✅ Never commit `.env.local` to git
- ✅ Use Vercel's encrypted env vars
- ✅ Rotate keys every 90 days
- ✅ Limit API key permissions to minimum needed

---

## Maintenance Schedule

### Weekly
- [ ] Review deployment logs
- [ ] Check error rates in Vercel Analytics
- [ ] Test new post publication

### Monthly
- [ ] Review and update dependencies
- [ ] Check Notion API usage
- [ ] Review Anthropic API costs (if using)
- [ ] Test content tracker workflow

### Quarterly
- [ ] Full functionality test
- [ ] Security audit
- [ ] Performance review
- [ ] Documentation review

---

## Emergency Contacts

### Critical Services

| Service | Dashboard | Support |
|---------|-----------|---------|
| **Vercel** | https://vercel.com/dashboard | support@vercel.com |
| **Notion** | https://notion.so | team@makenotion.com |
| **Anthropic** | https://console.anthropic.com | support@anthropic.com |

### Escalation Path

1. **Build/Deploy Issues** → Check Vercel dashboard
2. **Content Issues** → Check Notion integration
3. **API Issues** → Check service status pages
4. **Critical Outage** → Rollback immediately, investigate later

---

## Runbook Maintenance

**This runbook should be reviewed and updated:**
- After major incidents
- When adding new features
- Monthly as part of maintenance
- When procedures change

**Last Review:** 2026-02-02
**Next Review:** 2026-03-02

---

**Document Owner:** SCBA.Lab Team
**Contact:** Via GitHub Issues
