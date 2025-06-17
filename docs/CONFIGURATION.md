# Configuration Guide

This guide provides detailed instructions on how to configure your portfolio through the `config.json` file.

## 🎛️ Feature Flags

Control which sections appear on your portfolio:

```json
{
  "features": {
    "about": true,          // Show/hide About section
    "projects": true,       // Show/hide Projects section  
    "experience": true,     // Show/hide Experience section
    "skills": true,         // Show/hide Skills section
    "github_projects": true // Show/hide GitHub Projects section
  }
}
```

## 🔗 Dynamic Social Links

Add any social platform with built-in icon support:

```json
{
  "social_links": [
    {
      "name": "GitHub",           // Required: Display name
      "url": "https://github.com/username",  // Required: Full URL
      "icon": "github",           // Required: Icon identifier
      "required": true            // Optional: Always show this link
    },
    {
      "name": "LinkedIn", 
      "url": "https://linkedin.com/in/username",
      "icon": "linkedin"
    },
    {
      "name": "Twitter",
      "url": "https://twitter.com/username", 
      "icon": "twitter"
    }
  ]
}
```

**Available Icons**: `github`, `linkedin`, `twitter`, `instagram`, `youtube`, `website`, `email`, `medium`, `discord`, `code`

## 📝 About Section

Simple and flexible:

```json
{
  "about": {
    "paragraphs": [
      "First paragraph about you...",
      "Second paragraph...",
      "Add as many as you want!"
    ]
  }
}
```

## 🚀 Projects Section

Completely dynamic - add 1 project or 100:

```json
{
  "projects": {
    "title": "My Amazing Projects",
    "items": [
      {
        "name": "Project Name",
        "date": "June 2024",                    // Optional
        "description": [                        // Can be array or string
          "First description point",
          "Second description point"
        ],
        "picture": "assets/projects/image.jpg", // Optional
        "link": {                               // Optional: Link to project
          "url": "https://your-project-url.com",
          "title": "View Live Demo"             // Custom link text
        }
      }
    ]
  }
}
```

**Link Options:**
- `url`: The URL to link to (required if link object is provided)
- `title`: Custom text for the link (optional, defaults to "View Project")

Examples of link titles: "View Live Demo", "View Repository", "Read Case Study", "Try It Out"

## 💼 Experience Section

Add any number of jobs:

```json
{
  "experience": {
    "title": "Work Experience",
    "jobs": [
      {
        "company": "Company Name",
        "role": "Your Role",
        "date": "Jan 2024 - Present",           // Optional
        "responsibilities": [                   // Can be array or string
          "What you did here",
          "Another responsibility",
          "Include specific technologies and impact metrics"
        ],
        "logo": "assets/logos/company.png",     // Optional: Light mode logo
        "logo_dark": "assets/logos/company_dark.png"  // Optional: Dark mode logo
      }
    ]
  }
}
```

## 🛠️ Skills Section

Organize skills into categories:

```json
{
  "skills": {
    "title": "Skills & Technologies", 
    "categories": [
      {
        "name": "Technical Skills",
        "items": [
          "JavaScript",
          "React", 
          "Python"
        ]
      },
      {
        "name": "Certifications",
        "items": [
          {
            "name": "AWS Certified Developer",
            "url": "https://credly.com/your-badge-link"  // Creates clickable link
          },
          {
            "name": "Google Cloud Professional",
            "url": "https://cloud.google.com/certification"
          },
          "CompTIA Security+ (No link needed)"  // Mix of linked and non-linked items
        ]
      }
    ]
  }
}
```

## 🐙 GitHub Projects

Automatically shows repositories with the "featured" topic:

```json
{
  "github_username": "your-github-username",
  "github_projects": {
    "title": "Featured Projects"
  }
}
```

**To feature a repository:**
1. Go to your repository on GitHub
2. Click the gear icon next to "About"
3. Add "featured" to the Topics section

## ⚙️ SEO & Site Settings

```json
{
  "site": {
    "title": "Your Name",
    "description": "Your Portfolio Description",
    "seo": {
      "title": "Your Name - Portfolio",
      "description": "Brief description",
      "keywords": "your, keywords, here",
      "author": "Your Name",
      "og_image": "https://your-image-url.com/image.jpg",
      "twitter_card": "summary_large_image",
      "base_url": "https://your-website.com"
    }
  }
}
```

## 🎨 Header Configuration

```json
{
  "header": {
    "greeting": "Your Name",
    "tagline": "Your Professional Tagline"
  }
}
```

## 🦶 Footer Configuration

Customize your footer content and links:

```json
{
  "footer": {
    "show_social_links": true,           // Show social links in footer
    "show_built_with": true,             // Show "Built with" text
    "built_with_text": "Built with ❤️ using vanilla JavaScript",
    "tagline": "Let's connect and build something amazing together!"
  }
}
```

**Note**: A "Source Code" link pointing to your repository is automatically added to the footer when `github_username` is configured and `show_social_links` is true. The link assumes your repository is named `{username}.github.io` following GitHub Pages convention.

## 🎨 Logo & Image Guidelines

### Company Logos
- Use `logo` for light mode version
- Use `logo_dark` for dark mode version (optional)
- If only one logo provided, it works for both themes
- Recommended format: PNG with transparent background

### Project Images
- Use `picture` field in projects
- Images are lazy-loaded for performance
- Optional field - projects work without images
- Recommended size: 800x400px or similar aspect ratio

### Profile Picture
- Automatically fetched from GitHub using your username
- No configuration needed!

## 🔧 Tips for Easy Updates

1. **Start Simple**: Begin with minimal content and add more later
2. **Optional Fields**: Most fields are optional - only add what you have
3. **Flexible Arrays**: Lists can have 1 item or 100 items
4. **GitHub Integration**: Add "featured" topic to repos you want to showcase
5. **No Code Changes**: Everything is configured through JSON only
6. **JSON Validation**: Use a JSON validator if the site shows errors

## 🚨 Common Issues & Solutions

1. **Invalid JSON**: Use a JSON validator online to check your config.json
2. **Missing Images**: Use relative paths like `assets/logos/company.png`
3. **Social Icons**: Make sure the icon name matches available icons
4. **GitHub Projects**: Ensure `github_username` is set correctly
5. **Broken Layout**: Check that all required fields are present
6. **Empty Sections**: Sections with no content will show placeholder text
7. **Logo Display**: If only one logo is provided, it will be used for both light and dark themes

## 🔧 Content Validation

The portfolio automatically validates your content:
- Empty arrays in `about.paragraphs`, `projects.items`, `experience.jobs`, or `skills.categories` will show helpful placeholder content
- Missing `github_username` will skip GitHub projects section
- Invalid icon names will show warnings in the browser console
- All fields except the core structure are optional
