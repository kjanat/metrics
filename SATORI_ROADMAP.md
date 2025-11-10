# Roadmap: Achieving 70% Satori Usage

## Current Limitation
The main templates wrap all content in `<foreignObject>`, which Satori cannot process. This limits Satori usage to ~5-10% of renders.

## Path to 70% Satori Usage

### Phase 1: Template Redesign (6-8 weeks)
**Goal**: Create Satori-compatible versions of main templates

#### Option A: Hybrid Templates
Create alternate template versions that use pure SVG where possible:
- `classic-pure.svg`: No foreignObject, pure SVG layout
- `repository-pure.svg`: SVG-only repository metrics
- Benefits: Gradual migration, both versions available

#### Option B: Conditional Rendering
Modify existing templates to conditionally use foreignObject:
```ejs
<% if (preferFast && !hasComplexFeatures) { %>
  <!-- Pure SVG version -->
  <g>...</g>
<% } else { %>
  <!-- foreignObject version (current) -->
  <foreignObject>...</foreignObject>
<% } %>
```

### Phase 2: Plugin Migration (4-6 weeks)
**Goal**: Convert plugins from HTML to SVG-based rendering

**Priority Order** (by usage frequency):
1. **base plugins** (header, activity, community) - 40% of renders
2. **languages plugin** - 15% of renders
3. **contributions plugin** - 10% of renders
4. **achievements plugin** - 8% of renders

**Migration Strategy**:
```javascript
// Before (HTML in foreignObject)
<div class="language-bar">
  <span style="width: 60%; background: #blue">JavaScript</span>
</div>

// After (Pure SVG)
<g class="language-bar">
  <rect x="0" y="0" width="60%" fill="#blue"/>
  <text x="10" y="15">JavaScript</text>
</g>
```

### Phase 3: Optimization (2-3 weeks)
**Goal**: Fine-tune Satori performance and fallback logic

Tasks:
- Pre-cache font files for Satori
- Optimize padding calculations
- Add intelligent caching of Satori-compatible SVGs
- Improve error messages when fallback occurs

## Expected Impact

### Current State
- Satori: ~5-10% of renders
- Puppeteer: ~90-95% of renders
- Rendering time: 3-5s average

### After Phase 1 (Hybrid Templates)
- Satori: ~30-40% of renders
- Puppeteer: ~60-70% of renders
- Rendering time: 2-3s average

### After Phase 2 (Plugin Migration)
- Satori: ~70-80% of renders
- Puppeteer: ~20-30% of renders
- Rendering time: 0.5-1.5s average

### After Phase 3 (Optimization)
- Satori: ~75-85% of renders
- Puppeteer: ~15-25% of renders
- Rendering time: 0.3-1.2s average

## Technical Challenges

### Challenge 1: Text Layout
**Problem**: CSS text layout in foreignObject vs SVG text positioning
**Solution**: Create text layout helper functions for SVG

### Challenge 2: Flexbox/Grid Layouts
**Problem**: Satori has limited flexbox support, no grid support
**Solution**: Pre-calculate positions using JavaScript layout engine

### Challenge 3: Complex CSS
**Problem**: Many CSS features don't translate to SVG
**Solution**: Subset of supported CSS, fallback detection

### Challenge 4: Icon/Emoji Rendering
**Problem**: SVG icons render differently than HTML
**Solution**: Use inline SVG icons, convert emojis to paths

## Implementation Priority

**High Priority** (Do Now):
- ✅ Satori infrastructure (already done)
- ⏳ Document foreignObject limitation
- ⏳ Create issue for template redesign

**Medium Priority** (Next 3 months):
- Create proof-of-concept pure SVG template
- Migrate 2-3 simple plugins to pure SVG
- Benchmark performance improvements

**Low Priority** (6+ months):
- Full template system overhaul
- Complete plugin migration
- Remove Puppeteer as primary renderer

## Success Metrics

Track these metrics to measure progress:
```javascript
{
  "satori_usage_percentage": 75,
  "avg_render_time_satori": 0.4,
  "avg_render_time_puppeteer": 3.2,
  "fallback_rate": 5,  // % of Satori attempts that failed
  "user_satisfaction": 95  // based on performance surveys
}
```

## Breaking Changes

To achieve 70% Satori usage while maintaining compatibility:

**Option 1: Opt-in** (Recommended)
```yaml
- uses: lowlighter/metrics@master
  with:
    template: classic-pure  # Use Satori-compatible template
    prefer_fast: true       # Default: true
```

**Option 2: Automatic Migration**
```yaml
- uses: lowlighter/metrics@master
  with:
    # Automatically uses Satori when possible
    # Falls back to Puppeteer for complex features
    config_rendering: auto  # Options: auto, fast, compatible
```

**Option 3: Deprecation Path**
1. v3.36: Introduce pure SVG templates (opt-in)
2. v3.37: Make pure SVG default for new users
3. v3.38: Deprecate foreignObject templates
4. v4.0: Remove foreignObject templates

## Conclusion

The Satori implementation is **infrastructure for the future**, not an immediate win. To realize the 70% usage rate, we need template redesign and plugin migration work.

**Estimated Timeline**: 3-6 months
**Estimated Effort**: 150-200 developer hours
**Expected ROI**: 3-5x rendering speed improvement for 70% of use cases
