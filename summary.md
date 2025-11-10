# GitHub Actions Performance Investigation Summary

## Overview
This document summarizes an investigation into the performance characteristics of the kjanat/metrics GitHub Action - a metrics infographics generator with 40+ plugins.

---

## Initial Problem: Why is this GitHub Action so slow?

### What is kjanat/metrics?
- **Type**: Reusable GitHub Action that generates fancy SVG/PNG/JSON visualizations of GitHub stats
- **Features**: 40+ plugins (languages, achievements, activity, Spotify, Chess, Steam, WakaTime, etc.)
- **Architecture**: Runs in Docker with Node.js, Puppeteer (headless Chrome), Ruby, Deno, Python
- **Published to**: `ghcr.io/kjanat/metrics` (pre-built Docker images)

---

## Performance Bottlenecks Identified

### 1. **CI Workflow Structure** (.github/workflows/ci.yml)
Sequential job dependencies create a waterfall effect:
```
build-test (10 mins)
  ↓
format (5 mins)
  ↓
update-indexes (10 mins)
  ↓
docker-master (15 mins)
  ↓
action-master-test (5 mins)
  ↓
publish-examples (5+ HOURS) ← THE KILLER
  ↓
docker-release (10 mins)
```

**Total CI time: 6-10+ hours**

### 2. **The Examples Workflow** (.github/workflows/examples.yml)
- **150+ individual example generation steps**
- Each step has `delay: 120` (2-minute wait between examples)
- Each step runs the full Docker action to generate example images

**Math:**
- 150 examples × 2 minutes delay = **300 minutes (5 hours) minimum**
- Plus actual execution time (5-10 mins per example)
- **Total: 6-10+ hours just for examples**

**Why the delays?** To avoid GitHub API rate limiting across all the external services called.

### 3. **Docker Image Build/Pull Overhead**
The Dockerfile installs:
- Chrome + dependencies (~200MB download)
- Ruby + gems (licensed gem)
- Deno runtime
- Python 3
- Node.js dependencies
- `npm ci && npm run build` on every build

**Impact:**
- 3-5 minutes if building from scratch
- ~30 seconds if pulling pre-built image from ghcr.io/kjanat/metrics

**Good news:** The action uses pre-built images by default (`use_prebuilt_image: yes`), so end users don't rebuild.

### 4. **Plugin Execution Time**

#### Languages Plugin with Indepth Mode (EXTREMELY SLOW)
For EACH repository:
1. Clone the entire git repository to temp directory
2. Run git log to find user's commits
3. For each commit, run `git log --patch` to get diffs
4. Parse every single line of every diff
5. Run linguist-js (file type detection) on changed files
6. Calculate line counts and byte sizes
7. Import and verify GPG signatures
8. Clean up temp directories

**One repository: 30-60+ seconds**
**50 repositories: 25-50 minutes** for this ONE plugin alone

#### Other Expensive Plugins:
- **Stargazers Worldmap**: Geocodes every stargazer's location via Google Maps API (10+ mins)
- **Pagespeed**: Runs full Lighthouse audits (30+ seconds per URL)
- **Skyline**: Generates 3D models from GitHub activity
- **Screenshot**: Launches headless Chrome, waits for page load

### 5. **Puppeteer/Chrome Overhead**

**Why use Puppeteer for SVG generation?**

The rendering pipeline:
1. **Generate Raw SVG** using EJS templates (text-based)
2. **Load SVG in headless Chrome** via Puppeteer
3. **Wait for animations** (2.4 seconds)
4. **Measure actual rendered dimensions** using `getBoundingClientRect()`
5. **Resize SVG** to fit content
6. **Optionally convert to PNG/JPEG** via screenshot
7. **Serialize back to string**

**Why they need Chrome:**
- SVG layout calculations require a browser rendering engine
- Different fonts, text wrapping, dynamic content = unpredictable heights
- No pure Node.js library can accurately compute final SVG dimensions
- Text rendering is browser-specific (fonts, kerning, line height)
- CSS layout (flexbox, positioning) requires a layout engine
- Foreign objects (`<foreignObject>` with HTML inside SVG)

**Cost per render:**
- Starting Puppeteer: ~1-2 seconds
- Loading page: ~500ms per render
- Waiting for animations: 2.4 seconds
- Screenshot (if PNG): ~500ms-1s

**For 150 examples:** 3-5 seconds each = 7-12 minutes JUST for Puppeteer operations

### 6. **GitHub API Rate Limiting**
The action checks quota before running:
- REST API: 5,000 requests/hour
- GraphQL: 5,000 points/hour
- Search: 30 requests/minute

Some plugins burn through quota fast:
- Languages indepth: 10-50 requests per repo
- Habits: Fetches all commits (can hit search limits)

When quota is low, the action **exits early**.

---

## Alternative Rendering Approach: resvg/usvg

### What is resvg/usvg?
- **Rust-based SVG rendering library**
- **usvg**: Parses/simplifies SVG (resolves CSS, attributes, converts units to pixels)
- **resvg**: Renders the simplified tree using tiny-skia backend
- **Features**: Pure Rust, ~3MB binary, pixel-perfect, WASM support

### Could it replace Puppeteer?

**Pros:**
✅ Calculate accurate SVG dimensions (resolves viewBox, transforms, text metrics)
✅ Render to PNG/JPEG faster than Puppeteer
✅ Much smaller footprint (~3MB vs ~200MB Chrome)
✅ No browser needed

**Cons:**
❌ **Text rendering differences**: Uses fontdb/rustybuzz, not browser fonts
❌ **Foreign objects**: No support for HTML inside SVG
❌ **Dynamic JavaScript execution**: Can't run user scripts like Puppeteer
❌ **CSS animations**: Only renders static SVG (animations at t=0)
❌ **Language/ecosystem mismatch**: Metrics is JavaScript, resvg is Rust

### Conclusion:
**Puppeteer is the right choice for this project** due to:
- Complex EJS templates generating HTML/CSS embedded in SVG
- foreignObject elements with rendered HTML
- User JavaScript execution (`extras.js`)
- Font rendering matching GitHub's browser fonts
- Animation handling (waiting for CSS animations to settle)

resvg would be perfect for simpler, pure-SVG use cases (charts, diagrams, icons).

---

## Performance for End Users

When YOU use `kjanat/metrics@master` in your workflow:

**Fast path (typical):**
- Pre-built image from ghcr.io: ~30s
- Minimal plugins: **2-5 minutes total**

**Slow path:**
```yaml
- uses: kjanat/metrics@master
  with:
    plugin_languages: yes
    plugin_languages_indepth: yes  # ← Adds 20-60 mins
    plugin_habits: yes             # ← Adds 5-15 mins
    plugin_stargazers: yes
    plugin_stargazers_worldmap: yes # ← Adds 10+ mins
```

**Real execution breakdown:**
1. Docker setup: 30s - 5 mins
2. GitHub API data fetching: 1-3 mins
3. Plugin execution: **5-60+ mins** (depends on plugins)
4. Puppeteer rendering: 30s - 2 mins
5. Commit/push: 10-30s

---

## Repository Changes Made

### Replaced "lowlighter" with "kjanat" throughout repository
- **Commit**: `1751a92` - "Replace lowlighter with kjanat throughout repository"
- **Files modified**: 273
- **Changes**: 1,032 replacements

**Key updates:**
- Action metadata (action.yml): Author, Docker registry paths
- Package metadata (package.json): Author, repository URLs
- Workflows (.github/workflows/*.yml): All action references, Docker image paths
- Source code: URL references, API endpoints
- Documentation & examples: All markdown files

**Docker images:**
- `ghcr.io/lowlighter/metrics` → `ghcr.io/kjanat/metrics`

**Action references:**
- `uses: lowlighter/metrics@master` → `uses: kjanat/metrics@master`

---

## Key Takeaways

1. **The CI workflow is slow by design** - generating 150+ examples with artificial delays to avoid rate limiting
2. **Pre-built Docker images** make the action fast for end users
3. **Indepth plugins** are the main performance killer for individual runs
4. **Puppeteer is necessary** for accurate SVG dimension calculation and rendering
5. **The architecture is well-suited** for comprehensive metrics generation, prioritizing completeness over speed

---

## Recommendations for Users

**For fast runs:**
- Avoid `plugin_languages_indepth: yes`
- Avoid `plugin_stargazers_worldmap: yes`
- Use minimal plugin set
- Expected time: 3-15 minutes

**For comprehensive metrics:**
- Enable indepth analysis and worldmap features
- Be patient - expect 30-60+ minutes
- Run on a schedule (not on every commit)

---

*Investigation completed: 2025-11-10*
