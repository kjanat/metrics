# Markdown-Pure Template Features

## Markdown Syntax Support

### ✅ Currently Supported

#### Headers
All six header levels with progressive sizing:
```markdown
# H1 - 28px, weight 700
## H2 - 24px, weight 700
### H3 - 20px, weight 600
#### H4 - 18px, weight 600
##### H5 - 16px, weight 600
###### H6 - 14px, weight 600
```

#### Code Blocks
Fenced code blocks with language labels:
````markdown
```javascript
console.log('Hello World');
```

```python
print("Hello World")
```
````

Rendered with:
- Gradient background (f6f8fa → f0f2f5)
- Language badge (blue, top-left)
- Monospace font (SFMono-Regular, Consolas)
- Border stroke (#d1d5da)
- Rounded corners (6px)

#### Inline Code
Backtick-wrapped code spans:
```markdown
Use the `config_markdown` option.
```

Rendered with:
- Light gray background (#f6f8fa)
- Red text color (#c9222d)
- Subtle border (#d1d5da)
- Rounded corners (3px)
- Monospace font

#### Lists (Unordered)
Bullet lists with - or *:
```markdown
- First item
- Second item
- Third item
```

Rendered with:
- SVG circle bullets (3px radius, #24292e)
- 20px indent from bullet
- Automatic word wrapping
- 22px line spacing

#### Paragraphs
Regular text with automatic wrapping:
```markdown
This is a paragraph that will automatically wrap
to fit the available width.
```

Features:
- Word-based wrapping (no mid-word breaks)
- ~760px max width (regular), ~920px (large)
- 22px line height
- Character width estimation (7.7px at 14px font)

#### Horizontal Rules
Section dividers:
```markdown
---
```

Rendered with:
- Full-width line
- Light gray (#d1d5da)
- 1px stroke
- 25px vertical spacing

### 🚧 Planned Features

#### Bold and Italic
```markdown
**bold text**
*italic text*
***bold italic***
```

Implementation: SVG font-weight and font-style attributes

#### Links
```markdown
[Link text](https://example.com)
```

Implementation: SVG `<a>` elements with href attributes

#### Images
```markdown
![Alt text](image-url.png)
```

Implementation: SVG `<image>` elements

#### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

Implementation: SVG rect grid with text positioning

#### Blockquotes
```markdown
> This is a quote
> Multiple lines
```

Implementation: Left border rect with gray background

#### Task Lists
```markdown
- [ ] Todo item
- [x] Done item
```

Implementation: SVG checkboxes (rect + path for checkmark)

#### Ordered Lists
```markdown
1. First item
2. Second item
3. Third item
```

Implementation: SVG text numbers instead of bullets

#### Strikethrough
```markdown
~~deleted text~~
```

Implementation: SVG line element overlay

## SVG Element Usage

### Pure SVG Only
This template uses exclusively SVG elements:

- `<rect>` - Backgrounds, borders, boxes
- `<text>` - All text content
- `<g>` - Grouping and positioning
- `<circle>` - List bullets
- `<line>` - Horizontal rules
- `<linearGradient>` - Code block backgrounds

### No HTML Elements
The following are **not used**:
- ❌ `<div>`, `<span>`, `<p>`
- ❌ `<h1>` - `<h6>`
- ❌ `<table>`, `<tr>`, `<td>`
- ❌ `<ul>`, `<ol>`, `<li>`
- ❌ `<code>`, `<pre>`
- ❌ `<foreignObject>`

## Rendering Pipeline

### 1. Markdown Parsing
```javascript
parseMarkdown(content) {
  // Split into lines
  // Detect section types
  // Build section array
  return sections
}
```

Section types:
- `header` - # markdown headers
- `code` - ``` code blocks
- `list` - - or * lists
- `paragraph` - regular text
- `hr` - --- horizontal rules

### 2. Section Rendering
Each section type has custom SVG rendering:

**Headers**:
```xml
<g class="markdown-header h1">
  <text x="0" y="28" font-size="28" font-weight="700">
    Header Text
  </text>
</g>
```

**Code Blocks**:
```xml
<g class="markdown-code">
  <rect fill="url(#code-bg)" stroke="#d1d5da"/>
  <text font-family="monospace">
    Code line 1
  </text>
</g>
```

**Lists**:
```xml
<g class="markdown-list">
  <circle cx="5" cy="9" r="3"/>
  <text x="20" y="14">List item</text>
</g>
```

### 3. Layout Calculation
- Y-offset tracking (vertical positioning)
- Word wrapping (width-based)
- Height estimation (for final SVG size)
- Spacing between elements

### 4. SVG Output
Pure SVG structure:
```xml
<svg class="pure markdown-pure">
  <g class="markdown-container" transform="translate(20, 20)">
    <!-- Rendered sections -->
  </g>
</svg>
```

## Styling System

### CSS Classes
- `.markdown-pure` - Root SVG
- `.markdown-header.h1` - h6 - Headers
- `.markdown-paragraph` - Paragraphs
- `.markdown-code` - Code blocks
- `.markdown-list` - Lists
- `.markdown-hr` - Horizontal rules

### Color Palette
GitHub-inspired colors:
- Text: #24292e (dark gray)
- Secondary: #586069 (medium gray)
- Border: #d1d5da (light gray)
- Background: #f6f8fa (very light gray)
- Code: #c9222d (red)
- Link: #0969da (blue)

### Dark Mode
Automatic with `.dark` class:
- Background: #0d1117
- Text: #c9d1d9
- Border: #30363d
- Code background: #161b22

### Responsive Sizing
Large display (`.large` class):
- Width: 960px (vs 800px)
- Font sizes: +1-4px
- Better for detailed documentation

## Performance Characteristics

### Parsing Speed
- Simple regex-based parsing
- Linear O(n) complexity
- No AST construction
- Minimal memory overhead

### Rendering Speed
- Direct SVG coordinate calculation
- No layout engine needed
- No browser required
- Satori-native rendering

### Output Size
Typical SVG sizes:
- Simple (5 sections): ~3-5 KB
- Medium (15 sections): ~10-15 KB
- Complex (30 sections): ~25-35 KB

Compression: gzip reduces by 60-70%

## Limitations

### Current Limitations
1. **No nested lists** - Only single-level lists
2. **No list numbering** - Only bullet lists
3. **No inline formatting** - No bold/italic in paragraphs
4. **No link rendering** - Links shown as plain text
5. **No image support** - No embedded images
6. **No tables** - Complex layout not implemented
7. **Simple word wrap** - Character-based estimation only
8. **No emoji rendering** - Unicode emoji as-is

### Satori Limitations
1. **No CSS animations** - Only static SVG
2. **No hover effects** - Not interactive
3. **Limited fonts** - System fonts only
4. **No shadows** - Simple styling only

### Design Limitations
1. **Fixed width** - 800px or 960px only
2. **Top-to-bottom** - Linear layout only
3. **No columns** - Single column layout
4. **No wrapping around** - No text flow

## Best Practices

### ✅ Do
- Use clear, simple markdown
- Keep code blocks under 50 lines
- Use headers to organize content
- Prefer lists for multiple items
- Test with actual content

### ❌ Don't
- Use deeply nested structures
- Create very long paragraphs (>500 chars)
- Rely on complex formatting
- Expect pixel-perfect rendering
- Use advanced markdown features

## Integration Examples

### With Plugin Data
```javascript
config_markdown: `
# ${user.name}

${user.bio}

## Stats
- Repos: ${user.repositories.totalCount}
- Followers: ${user.followers.totalCount}
`
```

### With External Content
```yaml
markdown: https://raw.githubusercontent.com/user/repo/main/CHANGELOG.md
```

### With Template Variables
```markdown
# <%= NAME %>

Joined <%= REGISTRATION %>

## Activity
- Commits: <%= COMMITS %>
- Repositories: <%= REPOSITORIES %>
```

## Testing Checklist

- [ ] Simple header rendering
- [ ] Multiple header levels
- [ ] Code block with language
- [ ] Code block without language
- [ ] Multi-line code blocks
- [ ] Inline code in paragraphs
- [ ] Bullet lists (3+ items)
- [ ] Long list items (wrapping)
- [ ] Horizontal rules
- [ ] Mixed content (all types)
- [ ] Large display mode
- [ ] Dark mode (if supported)
- [ ] Word wrapping
- [ ] Special characters
- [ ] Unicode content
- [ ] Empty sections
- [ ] Very long content

---

**Last Updated**: 2025-11-17
**Template Version**: 1.0.0
**Metrics Compatibility**: Latest
