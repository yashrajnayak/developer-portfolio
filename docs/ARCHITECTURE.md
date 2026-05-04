# Architecture Documentation

This document explains the modular architecture of the portfolio system.

## 🏗️ Modular Architecture Overview

The portfolio uses a modular architecture for better maintainability and organization. This approach separates concerns into discrete modules that can be developed, tested, and maintained independently.

## 📁 Directory Structure

```
├── index.html              # Main HTML file
├── config.json             # Your portfolio configuration
├── css/                    # Modular CSS files
│   ├── bundle.css         # Generated production stylesheet
│   ├── main.css           # Main stylesheet that imports all modules
│   ├── base.css           # CSS reset, variables, base styles
│   ├── components.css     # Shared component styles
│   ├── loading.css        # Loading screen styles
│   ├── theme.css          # Theme switcher and dark mode
│   ├── scroll-to-top.css  # Scroll-to-top control
│   ├── print.css          # Print/PDF styles
│   ├── header.css         # Header and social links
│   ├── about.css          # About section styles
│   ├── skills.css         # Skills section styles
│   ├── experience.css     # Experience section styles
│   ├── projects.css       # Projects and GitHub projects
│   ├── animations.css     # Keyframe animations
│   └── responsive.css     # Mobile and tablet responsive styles
├── js/                     # Modular JavaScript files
│   ├── bundle.js          # Generated production script
│   ├── main.js            # Main application entry point
│   ├── config-manager.js  # Configuration loading
│   ├── seo-manager.js     # SEO meta tags management
│   ├── theme-manager.js   # Dark/light theme switching
│   ├── loading-manager.js # Loading screen management
│   ├── section-manager.js # Content sections rendering
│   ├── header-manager.js  # Header and social links
│   └── github-projects-manager.js # GitHub API integration
├── scripts/
│   ├── build-assets.mjs    # Generates bundles and SEO assets
│   ├── check-local-paths.mjs # Blocks local machine paths
│   └── validate-config.mjs # Validates config and asset references
├── robots.txt              # Generated crawler hints
├── sitemap.xml             # Generated sitemap
├── site.webmanifest        # Generated web app metadata
├── assets/
│   ├── logos/              # Company logos (light and dark variants)
│   └── projects/           # Project screenshots
└── docs/                   # Documentation
    ├── CONFIGURATION.md    # Configuration guide
    ├── DEPLOYMENT.md       # Deployment guide
    └── ARCHITECTURE.md     # This file
```

## 🎯 Benefits of Modular Design

### 1. Separation of Concerns
Each module has a specific responsibility:
- CSS modules handle specific visual components
- JS modules manage specific functionality
- Clear boundaries between different features

### 2. Maintainability
- Easier to find and fix issues in specific features
- Changes to one module don't affect others
- Cleaner, more organized codebase

### 3. Reusability
- Modules can be easily reused in other projects
- Individual components can be extracted
- Consistent patterns across modules

### 4. Scalability
- Easy to add new features without affecting existing code
- Modules can be developed independently
- Better organization as project grows

### 5. Team Collaboration
- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear ownership of different features

### 6. Performance
- Modular source files stay readable during development
- Generated `css/bundle.css` and `js/bundle.js` reduce production requests
- SEO assets are generated from config so GitHub Pages deployments stay static and fast

## 📋 CSS Module Architecture

### Core Modules

#### `base.css`
- CSS reset and normalize
- Custom properties (CSS variables)
- Base typography and layout
- Global utility classes

#### `components.css`
- Shared component styles
- Card layouts
- Button styles
- List styles
- Utility classes

#### `theme.css`
- Theme switcher component
- Dark/light mode transitions
- CSS custom property overrides
- Theme-specific styles

#### `scroll-to-top.css`
- Floating scroll-to-top control
- Visibility and hover states
- Mobile sizing

#### `print.css`
- Print/PDF layout
- Hidden interactive controls
- Expanded detail sections for exports

### Feature Modules

#### `header.css`
- Header section layout
- Profile image styles
- Social links grid
- Navigation styles

#### `about.css`
- About section layout
- Paragraph spacing
- Content formatting

#### `skills.css`
- Skills grid layout
- Category styling
- Skill item styles
- Interactive elements

#### `experience.css`
- Job timeline layout
- Company logo handling
- Responsibility lists
- Date formatting

#### `projects.css`
- Project grid layout
- GitHub projects integration
- Image handling
- Description formatting

### Utility Modules

#### `loading.css`
- Loading screen animations
- Spinner styles
- Loading state indicators

#### `animations.css`
- Keyframe animations
- Transition definitions
- Hover effects
- Entrance animations

#### `responsive.css`
- Mobile-first responsive design
- Tablet breakpoints
- Desktop optimizations
- Print styles

## 🔧 JavaScript Module Architecture

### Core Modules

#### `main.js`
- Application entry point
- Module coordination
- Error handling
- Initialization sequence

#### `config-manager.js`
```javascript
class ConfigManager {
  async loadConfig()
  showConfigError(message)
  getSectionTitle(sectionKey)
  hasContent(sectionKey)
}
```

### Service Modules

#### `seo-manager.js`
- Meta tag management
- JSON-LD structured data
- Open Graph tags
- Twitter Card tags

#### `theme-manager.js`
- Theme switching logic
- Preference persistence
- Accessible toggle state
- Theme transition animations

#### `loading-manager.js`
- Loading screen control
- Smooth transitions

### Feature Modules

#### `section-manager.js`
- Dynamic content rendering
- Section visibility control
- Content validation
- Native `<details>`/`<summary>` rendering for projects and experience

#### `header-manager.js`
- Header content rendering
- Social links generation
- Profile image handling
- Icon management

#### `footer-manager.js`
- Footer tagline rendering
- Footer social links
- Source code link generation
- Built-with text controls

#### `github-projects-manager.js`
- GitHub API integration
- Featured-topic, most-starred, and custom-feed repository modes
- Error handling
- Rate limit management

## 🔄 Module Dependencies

```
main.js (Entry Point)
├── config-manager.js
├── seo-manager.js
├── theme-manager.js
├── loading-manager.js
├── section-manager.js (depends on config-manager.js)
├── header-manager.js
├── footer-manager.js
└── github-projects-manager.js
```

### Dependency Management

1. **Main.js** initializes all modules in the correct order
2. **Config Manager** is loaded first as other modules depend on it
3. **Feature modules** are independent of each other
4. **Service modules** provide utilities to feature modules

## 🚀 Module Loading Strategy

The browser loads `js/bundle.js` and `css/bundle.css` in production. The bundle is generated from the modular source files so development stays readable while GitHub Pages gets a smaller request footprint.

### 1. Build Flow
```bash
npm run build
```

This regenerates:
- `css/bundle.css`
- `js/bundle.js`
- `site.webmanifest`
- `robots.txt`
- `sitemap.xml`

### 2. Error Handling
```javascript
try {
  await module.init()
} catch (error) {
  console.error(`Module failed to load: ${error}`)
  // Graceful degradation
}
```

## 🔧 Adding New Modules

### CSS Module

1. Create new CSS file in `/css/` directory
2. Add specific styles for your feature
3. Import in `main.css`
4. Add it to `scripts/build-assets.mjs`
5. Run `npm run build`

### JavaScript Module

1. Create new JS file in `/js/` directory
2. Export class or functions
3. Import in `main.js`
4. Initialize in correct order
5. Add it to `scripts/build-assets.mjs`
6. Run `npm run build`

### Example: Adding a Contact Module

#### `css/contact.css`
```css
.contact-section {
  /* Contact-specific styles */
}
```

#### `js/contact-manager.js`
```javascript
export class ContactManager {
  static async init(config) {
    // Contact module logic
  }
}
```

#### Update `main.js`
```javascript
import { ContactManager } from './contact-manager.js'

// In initialization
await ContactManager.init(config)
```

## 🧪 Testing Strategy

### Module Testing
- Each module can be tested independently
- Mock dependencies for unit testing
- Integration tests for module interactions

### CSS Testing
- Visual regression testing
- Cross-browser compatibility
- Responsive design testing

### JavaScript Testing
- Unit tests for each module
- API integration tests
- Error handling tests

## 🔄 Backward Compatibility

### Template Support
- Existing `config.json` fields continue to work
- Project links support both the original `link` object and a newer `links` array
- GitHub projects default to the original `featured` topic behavior
- Generated bundles are committed so GitHub Pages works without a separate build service

## 🚀 Future Enhancements

### Potential Improvements
- Dynamic module loading
- Module-specific configuration
- Plugin architecture
- Enhanced error handling
- Performance monitoring

### Extensibility
- Easy to add new sections
- Custom theme modules
- Third-party integrations
- Advanced animation modules
