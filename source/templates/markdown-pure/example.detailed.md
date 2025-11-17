# Detailed Markdown Example

Welcome to the comprehensive example of the Markdown Pure SVG template!

## Introduction

This template demonstrates advanced markdown rendering capabilities using pure SVG elements.

### Why Pure SVG?

Pure SVG rendering offers several advantages:

- **Performance**: 10-100x faster than traditional methods
- **Compatibility**: Works with Satori without browser dependencies
- **Simplicity**: No complex HTML/CSS layout calculations
- **Portability**: Pure SVG can be embedded anywhere

## Technical Features

### Supported Markdown Elements

1. Headers (H1-H6)
2. Paragraphs with wrapping
3. Code blocks with syntax highlighting
4. Inline code snippets
5. Unordered lists
6. Horizontal rules

### Code Examples

Here's a JavaScript example:

```javascript
import { Metrics } from '@lowlighter/metrics';

const metrics = new Metrics({
  template: 'markdown-pure',
  config: {
    markdown: '# Hello World'
  }
});

await metrics.render();
```

And a Python example:

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

### Configuration

The template uses inline code like `config_markdown` for configuration options.

## Performance Metrics

Traditional rendering: 3-5 seconds
Pure SVG rendering: 0.2-0.5 seconds
Speedup: 10-25x faster

---

## Conclusion

The Markdown Pure SVG template is perfect for:

- CI/CD pipelines
- Documentation badges
- README previews
- Automated reports

Try it today and experience the performance difference!
