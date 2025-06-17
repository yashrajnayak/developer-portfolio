# Development Guide

This guide is for developers who want to contribute to or extend the portfolio system.

## 🛠️ Development Setup

### Prerequisites

- Modern web browser with ES6 module support
- Text editor or IDE (VS Code recommended)
- Git for version control
- Optional: Node.js for additional tooling

### Local Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/portfolio.git
   cd portfolio
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using VS Code Live Server extension
   # Right-click index.html and select "Open with Live Server"
   ```

3. **Open in browser**
   Visit `http://localhost:8000`

## 📝 Code Style Guidelines

### JavaScript

- Use ES6+ features and modules
- Use `const` and `let` instead of `var`
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Handle errors gracefully

```javascript
/**
 * Manages portfolio configuration
 */
export class ConfigManager {
  /**
   * Loads configuration from config.json
   * @returns {Promise<Object>} Configuration object
   */
  static async loadConfig() {
    try {
      const response = await fetch('config.json')
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Config loading error:', error)
      throw error
    }
  }
}
```

### CSS

- Use semantic class names
- Follow BEM methodology where appropriate
- Use CSS custom properties for theming
- Mobile-first responsive design
- Consistent spacing using CSS variables

```css
.section {
  padding: var(--spacing-large);
}

.section__title {
  font-size: var(--font-size-heading);
  margin-bottom: var(--spacing-medium);
}

.section__content {
  line-height: var(--line-height-body);
}
```

### HTML

- Semantic HTML5 elements
- Proper ARIA labels for accessibility
- Progressive enhancement approach
- Valid HTML structure

```html
<section class="skills" aria-label="Skills">
  <h2>Skills & Technologies</h2>
  <div class="skills-grid" role="list">
    <!-- Dynamic content -->
  </div>
</section>
```

## 🏗️ Architecture Patterns

### Module Pattern

Each feature is implemented as a separate module:

```javascript
// feature-manager.js
export class FeatureManager {
  static async init(config) {
    // Initialization logic
  }
  
  static render(container, data) {
    // Rendering logic
  }
  
  static handleEvents() {
    // Event handling
  }
}
```

### Configuration-Driven Development

All content and behavior is driven by the `config.json` file:

```javascript
// Check feature flags before rendering
if (config.features.newFeature) {
  await NewFeatureManager.init(config.newFeature)
}
```

### Progressive Enhancement

Features degrade gracefully if JavaScript fails:

```html
<!-- Works without JavaScript -->
<section class="projects">
  <h2>Projects</h2>
  <noscript>
    <p>Please enable JavaScript for dynamic content.</p>
  </noscript>
  <div class="projects-grid">
    <!-- JavaScript enhances this -->
  </div>
</section>
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] All sections render correctly
- [ ] Theme switching works
- [ ] Responsive design on all screen sizes
- [ ] Social links open correctly
- [ ] GitHub projects load (if configured)
- [ ] Loading states work properly
- [ ] Error handling displays appropriate messages

### Cross-Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility Testing

- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast ratios
- [ ] Focus indicators
- [ ] ARIA labels and roles

Tools:
- Browser DevTools Accessibility tab
- axe-core browser extension
- WAVE Web Accessibility Evaluator

## 🔧 Adding New Features

### 1. Create a New Section

1. **Add feature flag to config schema**
   ```json
   {
     "features": {
       "newSection": true
     },
     "newSection": {
       "title": "New Section",
       "items": []
     }
   }
   ```

2. **Create CSS module**
   ```css
   /* css/new-section.css */
   .new-section {
     padding: var(--spacing-large) 0;
   }
   
   .new-section__grid {
     display: grid;
     gap: var(--spacing-medium);
   }
   ```

3. **Create JavaScript module**
   ```javascript
   // js/new-section-manager.js
   export class NewSectionManager {
     static async init(config) {
       if (!config.features.newSection) return
       
       const sectionData = config.newSection
       this.render(sectionData)
     }
     
     static render(data) {
       // Rendering logic
     }
   }
   ```

4. **Update main files**
   ```css
   /* css/main.css */
   @import 'new-section.css';
   ```
   
   ```javascript
   // js/main.js
   import { NewSectionManager } from './new-section-manager.js'
   
   // In initialization
   await NewSectionManager.init(config)
   ```

### 2. Add New Social Platform

1. **Add icon template to HTML**
   ```html
   <template id="newplatform-icon">
     <svg><!-- SVG content --></svg>
   </template>
   ```

2. **Update header manager**
   ```javascript
   // js/header-manager.js
   const iconMap = {
     // existing icons...
     newplatform: 'newplatform-icon'
   }
   ```

### 3. Extend Theme System

1. **Add new CSS custom properties**
   ```css
   /* css/theme.css */
   :root {
     --new-color: #ffffff;
   }
   
   [data-theme="dark"] {
     --new-color: #000000;
   }
   ```

2. **Use in component styles**
   ```css
   .component {
     background-color: var(--new-color);
   }
   ```

## 🚀 Performance Optimization

### CSS Performance

- Use CSS containment where appropriate
- Minimize repaints and reflows
- Use `transform` and `opacity` for animations
- Lazy load non-critical CSS

### JavaScript Performance

- Use requestAnimationFrame for animations
- Debounce scroll and resize events
- Lazy load images
- Minimize DOM queries

### Image Optimization

- Use appropriate formats (WebP, AVIF)
- Provide multiple sizes for responsive images
- Compress images before adding to repository
- Use lazy loading for below-the-fold images

## 🔍 Debugging

### Common Issues

1. **Configuration not loading**
   ```javascript
   // Check browser console for errors
   console.error('Config loading failed')
   
   // Validate JSON syntax
   try {
     JSON.parse(configString)
   } catch (error) {
     console.error('Invalid JSON:', error)
   }
   ```

2. **Module initialization fails**
   ```javascript
   // Add error boundaries
   try {
     await ModuleManager.init(config)
   } catch (error) {
     console.error('Module failed:', error)
     // Provide fallback
   }
   ```

3. **Styles not applying**
   - Check CSS import order
   - Verify CSS custom properties
   - Check for typos in class names
   - Inspect element in browser DevTools

### Debug Mode

Add debug logging:

```javascript
// js/main.js
const DEBUG = localStorage.getItem('portfolio-debug') === 'true'

if (DEBUG) {
  console.log('Debug mode enabled')
}

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data)
  }
}
```

Enable in browser console:
```javascript
localStorage.setItem('portfolio-debug', 'true')
location.reload()
```

## 📦 Building for Production

### Minification (Optional)

```bash
# CSS minification
npx cssnano css/main.css css/main.min.css

# JavaScript minification
npx terser js/main.js -o js/main.min.js --module
```

### Asset Optimization

```bash
# Image compression
npx imagemin assets/**/*.{jpg,png} --out-dir=assets/optimized

# SVG optimization
npx svgo assets/**/*.svg
```

### Pre-deployment Checklist

- [ ] All assets optimized
- [ ] Configuration validated
- [ ] Cross-browser testing complete
- [ ] Accessibility testing passed
- [ ] Performance metrics acceptable
- [ ] Error handling tested
- [ ] Mobile experience verified

## 🤝 Contributing Guidelines

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add new social platform support"
   ```
6. **Push and create pull request**

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Changes are well-tested
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Performance impact considered
- [ ] Accessibility maintained

## 📚 Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - VS Code extension
- [JSON Validator](https://jsonlint.com/) - Validate configuration
- [Can I Use](https://caniuse.com/) - Browser compatibility

### Accessibility
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluator

### Performance
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [WebPageTest](https://www.webpagetest.org/) - Performance testing
- [Core Web Vitals](https://web.dev/vitals/) - Performance metrics
