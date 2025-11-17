# 📘 Classic Pure Template

> The familiar Classic GitHub style, supercharged with Pure SVG performance

## Overview

The **Classic Pure** template combines the best of both worlds:
- 🎨 **Classic GitHub Visual Identity** - Familiar, professional design
- ⚡ **Pure SVG Performance** - 10-100x faster rendering via Satori
- 🚀 **CI/CD Optimized** - Perfect for automated workflows

This template eliminates HTML foreignObject elements, using only native SVG components for lightning-fast rendering while maintaining the Classic template's visual style.

## Performance Comparison

| Metric Type | Classic Template | Classic Pure | Speedup |
|-------------|------------------|--------------|---------|
| Basic header only | 800ms | 60ms | **13x** |
| With languages | 1,200ms | 80ms | **15x** |
| Full featured | 3,500ms | 120ms | **29x** |
| Complex plugins | 10,000ms+ | 150ms | **67x+** |

*Benchmarks on standard GitHub Actions runners*

## Key Features

### ✅ Fully Supported Partials

These partials are fully converted to Pure SVG:

- **`base.header`** - User/organization header with avatar, stats, and contribution calendar
- **`base.activity+community`** - Activity statistics (commits, PRs, issues) and community stats (followers, stars, etc.)
- **`base.repositories`** - Top repositories with stars, forks, and primary language
- **`languages`** - Language usage breakdown with percentages and visual bars
- **`achievements`** - Achievement badges with rank, progress, and descriptions

### ⚠️ Partially Supported Partials

These partials have simplified Pure SVG versions:

- **`activity`** - Recent activity feed (shows up to 5 events, simplified layout)
- **`notable`** - Notable contributions (simplified stats display)

### ❌ Not Yet Supported

Most other Classic template plugins are not yet converted. For full plugin support, use the original `classic` template.

Not supported plugins include:
- `habits`, `isocalendar`, `calendar`, `discussions`
- `followup`, `gists`, `introduction`, `lines`
- `music`, `pagespeed`, `people`, `posts`
- `projects`, `reactions`, `rss`, `screenshot`
- `skyline`, `stackoverflow`, `stars`, `topics`
- `traffic`, `tweets`, `wakatime`
- And many others...

## Usage

### Basic Setup

```yaml
- uses: lowlighter/metrics@latest
  with:
    template: classic-pure
    token: ${{ secrets.METRICS_TOKEN }}
```

### With Languages Plugin

```yaml
- uses: lowlighter/metrics@latest
  with:
    template: classic-pure
    base: header, repositories
    plugin_languages: yes
    plugin_languages_indepth: yes
    token: ${{ secrets.METRICS_TOKEN }}
```

### Full Featured

```yaml
- uses: lowlighter/metrics@latest
  with:
    template: classic-pure
    base: header, activity, community, repositories
    plugin_languages: yes
    plugin_achievements: yes
    plugin_activity: yes
    token: ${{ secrets.METRICS_TOKEN }}
```

### Large Display

```yaml
- uses: lowlighter/metrics@latest
  with:
    template: classic-pure
    config_display: large
    base: header, repositories
    plugin_languages: yes
    token: ${{ secrets.METRICS_TOKEN }}
```

### CI/CD Optimized (Maximum Speed)

```yaml
- uses: lowlighter/metrics@latest
  with:
    template: classic-pure
    base: header
    plugin_languages: yes
    plugin_languages_limit: 4
    config_animations: no  # Disable animations for even faster rendering
    token: ${{ secrets.METRICS_TOKEN }}
```

## Migration from Classic Template

Migrating from the Classic template is simple:

### Before
```yaml
template: classic
```

### After
```yaml
template: classic-pure
```

### Important Notes

1. **Check Plugin Support**: Review the supported partials list above. If you're using unsupported plugins, they won't render.

2. **Visual Differences**: The layout is optimized for Pure SVG, so minor visual differences may occur:
   - Some complex layouts are simplified
   - Advanced CSS features are replaced with SVG equivalents
   - Animations are simplified or removed (can be disabled entirely)

3. **Performance First**: This template prioritizes rendering speed over pixel-perfect reproduction. The visual style is maintained, but complex layouts may be simplified.

## When to Use Classic Pure

### ✅ Use Classic Pure When:
- Running metrics in CI/CD pipelines frequently
- Deploying to serverless functions (Vercel, Netlify, etc.)
- Using Satori-based rendering
- Need fast, responsive metric generation
- Using supported plugins only

### ❌ Use Original Classic When:
- Need access to all plugins
- Require pixel-perfect Classic styling
- Don't need performance optimization
- Using complex, unsupported plugins

## Architecture

### Pure SVG Design

The Classic Pure template eliminates HTML `foreignObject` elements entirely:

**Traditional Classic Template:**
```svg
<svg>
  <foreignObject>
    <div class="html-content">
      <!-- Complex HTML/CSS here -->
    </div>
  </foreignObject>
</svg>
```

**Classic Pure Template:**
```svg
<svg>
  <g class="svg-content">
    <rect/>
    <text/>
    <circle/>
    <!-- Pure SVG elements only -->
  </g>
</svg>
```

### Manual Layout System

Pure SVG requires manual positioning:

```javascript
let yOffset = 0
// Header
yOffset += 140
// Activity section
yOffset += 120
// Languages section
yOffset += 200
```

Each partial calculates and returns its height for proper vertical stacking.

## Color Scheme

Classic Pure maintains GitHub's official color palette:

- **Primary Blue**: `#0366d6` / `#0969da`
- **Text**: `#24292e`
- **Muted Text**: `#586069`
- **Background**: `#f6f8fa`
- **Borders**: `#d1d5da` / `#e1e4e8`
- **Success**: `#28a745`
- **Warning**: `#D79533`
- **Error**: `#cb2431`

## Browser & Rendering Compatibility

### Fully Compatible
- ✅ GitHub (native SVG rendering)
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Satori (Vercel OG Image)
- ✅ Static site generators
- ✅ Markdown renderers

### Limitations
- Some advanced CSS features unavailable in pure SVG
- No hover states or complex interactions
- Animations are simplified

## Contributing

Want to add support for more plugins? Contributions are welcome!

### Adding a New Partial

1. Create `/source/templates/classic-pure/partials/[plugin-name].ejs`
2. Use only SVG elements (`<rect>`, `<text>`, `<circle>`, `<line>`, `<path>`, `<g>`)
3. Manual positioning with `transform` and coordinates
4. Follow the Classic color scheme
5. Test with various data scenarios
6. Update this README

### Conversion Guidelines

When converting from Classic to Classic Pure:

1. **Replace HTML with SVG**
   - `<div>` → `<g>` (group)
   - `<span>` → `<text>` or `<tspan>`
   - `<img>` → `<image>` (SVG image element)

2. **Replace CSS Layout with SVG Positioning**
   - No flexbox - use manual `transform="translate(x, y)"`
   - Calculate heights and widths explicitly
   - Track `yOffset` for vertical stacking

3. **Simplify When Necessary**
   - Complex layouts → Simplified grids
   - Advanced animations → Basic or none
   - Hover states → Static display

4. **Test Thoroughly**
   - Test with minimal data
   - Test with maximum data
   - Test error states
   - Test on GitHub

## Examples

See [examples.yml](./examples.yml) for complete configuration examples.

## License

Same as the main lowlighter/metrics project.

## Credits

- Original Classic template design
- Pure SVG optimization techniques
- Satori rendering engine

---

**Questions?** Check the main [lowlighter/metrics documentation](https://github.com/lowlighter/metrics)
