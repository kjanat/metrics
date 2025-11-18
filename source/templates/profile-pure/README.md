# 👤 Profile Pure Template

A **personal branding template** designed to showcase individual identity, skills, and achievements through beautiful storytelling and visual design. Built with pure SVG for fast Satori rendering while maintaining a premium, portfolio-quality aesthetic.

## Features

- ✅ **Personal Branding Focus** - Designed for showcasing individual identity
- ✅ **Hero Section** - Large avatar, name, tagline, and bio
- ✅ **Skills Showcase** - Visual tech stack with language percentages
- ✅ **Featured Projects** - Highlight your best repositories
- ✅ **Community Impact** - Social proof and contribution stats
- ✅ **Achievement Wall** - Display unlocked GitHub achievements
- ✅ **Pure SVG Rendering** - No HTML foreignObject (fast Satori rendering)
- ✅ **Custom Themes** - Multiple color schemes (default, purple, blue, green, orange)
- ✅ **Status Indicators** - "Available for hire", "Open to collaborate", etc.

## Use Cases

- **GitHub Profiles** - Stand out with a professional profile card
- **Portfolio Pages** - Showcase your work and skills
- **Job Applications** - Visual resume for tech roles
- **Networking** - Shareable personal branding card
- **Community Building** - Highlight your open source impact

## Design Philosophy

The Profile Pure template follows these design principles:

1. **Story-Driven Layout** - Content flows naturally from hero → skills → work → impact
2. **Visual Hierarchy** - Clear sections with generous spacing
3. **Personality** - Customizable colors and themes for individual expression
4. **Professionalism** - Clean, modern design suitable for career contexts
5. **Performance** - Pure SVG for 10-100x faster rendering than HTML-based templates

## Quick Start

### Basic Profile

```yaml
- uses: lowlighter/metrics@master
  with:
    template: profile-pure
    token: ${{ secrets.GITHUB_TOKEN }}
    base: header, repositories
    plugin_languages: yes
```

### Customized Profile

```yaml
- uses: lowlighter/metrics@master
  with:
    template: profile-pure
    token: ${{ secrets.GITHUB_TOKEN }}
    base: header, repositories
    plugin_languages: yes
    plugin_achievements: yes
    config_tagline: "Full-Stack Developer & Open Source Enthusiast"
    config_bio: "Building tools that developers love. Passionate about performance, design, and user experience."
    config_status: "Available for hire"
    config_theme: "purple"
```

## Configuration Options

### Personal Branding

| Option | Description | Example |
|--------|-------------|---------|
| `config_tagline` | Short personal statement (appears under name) | `"Full-Stack Developer & Open Source Enthusiast"` |
| `config_bio` | Personal introduction (2-3 lines) | `"Building tools that developers love..."` |
| `config_status` | Availability status | `"Available for hire"`, `"Open to collaborate"` |
| `config_theme` | Color scheme | `default`, `purple`, `blue`, `green`, `orange` |

### Recommended Plugin Combinations

**Minimal Profile**
```yaml
base: header
```

**Skills-Focused Profile**
```yaml
base: header, repositories
plugin_languages: yes
plugin_languages_indepth: yes
```

**Complete Profile**
```yaml
base: header, repositories
plugin_languages: yes
plugin_achievements: yes
```

## Sections

### 1. Hero Section

**Features:**
- Large avatar (96px) with elegant border
- Name and tagline
- Quick stats (followers, following, repos)
- Personal bio (up to 3 lines)
- Status badge ("Available for hire", etc.)
- Join date and location

**Customization:**
- `config_tagline` - Override default tagline
- `config_bio` - Custom bio text
- `config_status` - Set availability status

### 2. Skills Showcase

**Features:**
- Visual language breakdown bar
- Skill tags with color indicators
- Percentage breakdowns
- Up to 12 languages displayed

**Requirements:**
- `plugin_languages: yes`

**Optional:**
- `plugin_languages_indepth: yes` - Enhanced language stats

### 3. Featured Projects

**Features:**
- Top 3 repositories by stars
- Repository cards with descriptions
- Star and fork counts
- Language badges

**Requirements:**
- `base: repositories`

### 4. Community Impact

**Features:**
- Total commits, PRs, issues
- Repository count
- Contribution breadth
- Activity level indicator

**Always Shown:** This section appears on all profiles

### 5. Achievement Wall

**Features:**
- Visual badge display (up to 8)
- Progress bar showing unlock percentage
- Achievement icons and titles

**Requirements:**
- `plugin_achievements: yes`

## Theme Options

### Available Themes

| Theme | Primary Color | Best For |
|-------|--------------|----------|
| `default` | Purple/Violet | General use, creative fields |
| `purple` | Deep Purple | Creative, design-focused |
| `blue` | Blue | Professional, corporate |
| `green` | Green | Sustainability, growth |
| `orange` | Orange | Energetic, bold |

Set theme with:
```yaml
config_theme: "purple"
```

## Examples

<!--examples-->
```yaml
- name: Basic profile showcase
  with:
    filename: profile.svg
    template: profile-pure
    base: header, repositories
    token: ${{ secrets.METRICS_TOKEN }}
```

```yaml
- name: Profile with custom tagline and bio
  with:
    filename: profile.custom.svg
    template: profile-pure
    base: header, repositories
    config_tagline: "Full-Stack Developer & Open Source Enthusiast"
    config_bio: "Building tools that developers love. Passionate about performance, design, and user experience."
    config_status: "Available for hire"
    token: ${{ secrets.METRICS_TOKEN }}
```

```yaml
- name: Profile with skills showcase
  with:
    filename: profile.skills.svg
    template: profile-pure
    base: header, repositories
    plugin_languages: yes
    plugin_languages_indepth: yes
    config_tagline: "Creative Developer & Designer"
    config_theme: "purple"
    token: ${{ secrets.METRICS_TOKEN }}
```

```yaml
- name: Complete profile with achievements
  with:
    filename: profile.complete.svg
    template: profile-pure
    base: header, repositories
    plugin_languages: yes
    plugin_achievements: yes
    config_tagline: "Software Engineer & Community Builder"
    config_bio: "Crafting elegant solutions to complex problems. Contributing to open source and helping developers grow."
    config_status: "Open to collaborate"
    config_theme: "blue"
    token: ${{ secrets.METRICS_TOKEN }}
```

```yaml
- name: Portfolio-style profile (custom theme)
  with:
    filename: profile.portfolio.svg
    template: profile-pure
    base: header, repositories
    plugin_languages: yes
    plugin_languages_indepth: yes
    config_tagline: "Design-Focused Engineer"
    config_bio: "Bridging the gap between beautiful design and powerful code"
    config_theme: "green"
    token: ${{ secrets.METRICS_TOKEN }}
```

```yaml
- name: Job seeker profile
  with:
    filename: profile.hiring.svg
    template: profile-pure
    base: header, repositories
    plugin_languages: yes
    plugin_achievements: yes
    config_tagline: "Full-Stack Engineer | React • Node • TypeScript"
    config_bio: "5+ years building scalable web applications. Seeking senior engineering roles at innovative companies."
    config_status: "Available for hire"
    config_theme: "orange"
    token: ${{ secrets.METRICS_TOKEN }}
```
<!--/examples-->

## Performance

**Render Time:** 80-150ms (acceptable for rich visual content)

**Why It's Fast:**
- Pure SVG rendering (no HTML in foreignObject)
- Satori-compatible (no Puppeteer needed)
- Manual layout calculations
- Optimized for CI/CD workflows

**Performance Tips:**
- Use `plugin_languages_analyzer_mode: graphql` for faster language analysis
- Limit sections to only what you need
- Cache results to reduce API calls

## Dimensions

- **Width:** 600px (optimized for profiles)
- **Height:** Auto (dynamic based on content)
  - Minimal: ~400px (hero + community)
  - With skills: ~640px
  - Complete: ~900px (all sections)

## Customization Tips

### For Job Seekers

```yaml
config_tagline: "Senior Software Engineer | React • Node • TypeScript"
config_bio: "X+ years building scalable applications. Seeking opportunities at innovative companies."
config_status: "Available for hire"
config_theme: "blue"
```

### For Open Source Contributors

```yaml
config_tagline: "Open Source Maintainer & Community Builder"
config_bio: "Contributing to the tools millions of developers use daily."
config_status: "Open to collaborate"
config_theme: "green"
plugin_achievements: yes
```

### For Creative Developers

```yaml
config_tagline: "Creative Developer & Designer"
config_bio: "Building beautiful, accessible experiences on the web."
config_theme: "purple"
```

## Technical Details

### Pure SVG Architecture

This template uses **only SVG elements** - no HTML in foreignObject:
- `<rect>` for backgrounds and cards
- `<text>` for all typography
- `<circle>` for avatars and badges
- `<g>` for grouping and positioning
- `<linearGradient>` for visual effects

This approach enables:
- 10-100x faster rendering with Satori
- Better compatibility across tools
- Easier debugging and customization
- Smaller file sizes

### Layout System

Uses manual y-offset calculations for precise positioning:
```js
let yOffset = 0
// Hero section
yOffset += 240
// Skills section (if enabled)
yOffset += 220 + sectionSpacing
```

## Troubleshooting

**Tagline not showing?**
- Make sure you set `config_tagline: "Your tagline here"`
- Alternatively, it will use the first sentence of your GitHub bio

**Skills section empty?**
- Enable with `plugin_languages: yes`
- Make sure you have repositories with code

**Achievements not appearing?**
- Enable with `plugin_achievements: yes`
- You may not have unlocked any achievements yet

**Theme not applying?**
- Check spelling: `config_theme: "purple"` (lowercase)
- Valid options: default, purple, blue, green, orange

## Contributing

Want to improve the Profile Pure template?

**Ideas:**
- Add more theme options
- Create new status badge styles
- Improve mobile responsiveness
- Add more customization options

**How to Contribute:**
1. Edit files in `source/templates/profile-pure/`
2. Test with Satori renderer
3. Ensure pure SVG (no foreignObject)
4. Submit a pull request

## FAQ

**Q: Can I use this for organizations?**
A: This template is optimized for individual user profiles. For organizations, use the standard Pure template.

**Q: How do I change colors?**
A: Use `config_theme` option or edit `styles.css` for complete customization.

**Q: Can I add custom sections?**
A: Yes! Create new partials in `partials/` directory using pure SVG.

**Q: Does this work with all plugins?**
A: Currently supports: base (header, repositories), languages, and achievements. More plugins coming soon.

---

**Made for developers who want to stand out** ✨

Use this template to create a beautiful, professional profile that tells your story and showcases your impact on GitHub.
