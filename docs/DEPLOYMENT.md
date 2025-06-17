# Deployment Guide

This guide covers different ways to deploy and host your portfolio.

## 🚀 GitHub Pages Deployment (Recommended)

GitHub Pages is the easiest way to deploy your portfolio for free.

### Setup Steps

1. **Use this template** to create a new repository
2. **Edit `config.json`** with your details
3. **Go to Settings → Pages**
4. **Select "Deploy from a branch" → "main"**
5. **Your portfolio is live** at `username.github.io/repository-name`

### Custom Domain (Optional)

1. Add a `CNAME` file to your repository root with your domain
2. In GitHub Settings → Pages, add your custom domain
3. Update DNS records with your domain provider

## 🔄 Using as Template Repository

This repository is designed as a template. When you use it:

1. **Click "Use this template"** instead of forking
2. **Create your own repository** with a custom name
3. **Customize `config.json`** with your information
4. **Replace assets** with your own logos and images
5. **Enable GitHub Pages** and you're live!

The provided `config.json` serves as a working example - simply replace the content with your own information.

## 🛠️ Local Development

For testing and development, you can run the portfolio locally using any static file server:

### Using Python

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Run server
npx http-server
```

### Using VS Code Live Server

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Using PHP

```bash
php -S localhost:8000
```

Visit `http://localhost:8000` to see your portfolio locally.

## 🌐 Alternative Hosting Options

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command to empty (no build needed)
3. Set publish directory to root (`/`)
4. Deploy automatically on every push

### Vercel

1. Import your GitHub repository to Vercel
2. No build configuration needed
3. Automatic deployments on every push

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init hosting`
3. Set public directory to root
4. Deploy: `firebase deploy`

### Surge.sh

1. Install Surge: `npm install -g surge`
2. Navigate to your project directory
3. Run: `surge`
4. Follow the prompts

## 🔧 Build Optimization (Optional)

While the portfolio works perfectly without any build process, you can optionally optimize it:

### CSS Minification

```bash
# Using cssnano
npm install -g cssnano-cli
cssnano css/main.css css/main.min.css
```

### JavaScript Minification

```bash
# Using terser
npm install -g terser
terser js/main.js -o js/main.min.js
```

### Image Optimization

```bash
# Using imagemin
npm install -g imagemin-cli imagemin-pngquant imagemin-mozjpeg
imagemin assets/logos/* --out-dir=assets/logos/optimized
```

## 📱 Mobile Testing

Test your portfolio on different devices:

### Browser Developer Tools

1. Open Developer Tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes

### Online Testing Tools

- **BrowserStack**: Cross-browser testing
- **LambdaTest**: Real device testing
- **Responsinator**: Quick responsive testing

## 🔍 SEO Optimization

### Meta Tags

The portfolio automatically generates SEO meta tags from your `config.json`:

- Title and description
- Open Graph tags for social media
- Twitter Card tags
- JSON-LD structured data

### Additional SEO Tips

1. **Use descriptive content** in your config.json
2. **Add alt text** to project images
3. **Include relevant keywords** in descriptions
4. **Add a sitemap.xml** (optional)
5. **Submit to Google Search Console**

## 🚨 Troubleshooting

### Common Deployment Issues

**404 Errors**
- Check that `index.html` is in the root directory
- Verify GitHub Pages is enabled
- Ensure branch is set correctly

**Config Not Loading**
- Validate JSON syntax in `config.json`
- Check browser console for errors
- Ensure file is accessible (no 404)

**Images Not Loading**
- Use relative paths (`assets/logos/logo.png`)
- Check file names and extensions
- Verify files are committed to repository

**GitHub API Rate Limit**
- GitHub projects may not load if rate limited
- Wait for rate limit to reset
- Consider using GitHub token (see advanced config)

### Performance Issues

**Slow Loading**
- Optimize images (reduce file size)
- Use WebP format for better compression
- Enable browser caching

**Large Repository**
- Use Git LFS for large assets
- Consider external CDN for images
- Remove unused files

## 🔄 Updates and Maintenance

### Keeping Up to Date

1. **Watch the original repository** for updates
2. **Check releases** for new features
3. **Update your fork** periodically

### Backing Up

1. **Regular commits** to your repository
2. **Export config.json** before major changes
3. **Keep local copies** of important assets

### Version Control Best Practices

1. **Use meaningful commit messages**
2. **Create branches** for major changes
3. **Test locally** before pushing
4. **Keep assets organized** in proper directories
