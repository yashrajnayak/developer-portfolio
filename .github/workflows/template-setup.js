#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Template Setup Script
 * This script initializes a new portfolio from the template
 * Used by GitHub Actions template-setup workflow
 */

function createDefaultConfig(fullName, githubUsername, portfolioUrl) {
  const config = {
    "features": {
      "about": true,
      "projects": true,
      "experience": true,
      "skills": true,
      "github_projects": true
    },
    "site": {
      "title": fullName,
      "description": "Developer Portfolio",
      "seo": {
        "title": `${fullName} - Developer Portfolio`,
        "description": `Developer Portfolio of ${fullName}`,
        "keywords": "developer, portfolio, github",
        "author": fullName,
        "og_image": `https://avatars.githubusercontent.com/${githubUsername}`,
        "twitter_card": "summary_large_image",
        "base_url": portfolioUrl
      }
    },
    "header": {
      "greeting": fullName,
      "tagline": "Developer and Creator."
    },
    "social_links": [
      {
        "name": "GitHub",
        "url": `https://github.com/${githubUsername}`,
        "icon": "github",
        "required": true
      }
    ],
    "github_username": githubUsername,
    "about": {
      "paragraphs": [
        "Welcome to my portfolio! I'm passionate about creating amazing digital experiences and solving complex problems through code.",
        "This portfolio showcases my journey, projects, and skills. Feel free to explore and get in touch if you'd like to collaborate!"
      ]
    },
    "projects": {
      "title": "Featured Projects",
      "items": [
        {
          "name": "Portfolio Website",
          "date": new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          "description": [
            "A modern, responsive portfolio website built with vanilla JavaScript",
            "Features dark/light mode, dynamic content loading, and GitHub integration",
            "Fully configurable through JSON with automated README generation"
          ],
          "picture": "assets/projects/Placeholder.png",
          "link": {
            "url": portfolioUrl,
            "title": "View Live Site"
          }
        }
      ]
    },
    "experience": {
      "title": "Professional Experience",
      "jobs": [
        {
          "company": "Your Company Name",
          "role": "Your Job Title",
          "date": "Start Date - Present",
          "responsibilities": [
            "Add your key responsibilities and achievements here",
            "Include specific technologies you worked with",
            "Mention any notable projects or impact metrics",
            "Update this section with your actual work experience"
          ],
          "logo": "assets/logos/Placeholder_Logo.png",
          "logo_dark": "assets/logos/Placeholder_Logo.png"
        }
      ]
    },
    "skills": {
      "title": "Skills & Technologies",
      "categories": [
        {
          "name": "Programming Languages & Technologies",
          "items": [
            "JavaScript",
            "Python",
            "Java",
            "TypeScript"
          ]
        },
        {
          "name": "Tools & Platforms",
          "items": [
            "Git",
            "GitHub",
            "VS Code",
            "Docker"
          ]
        },
        {
          "name": "Certifications",
          "items": [
            {
              "name": "Add your certification name here",
              "url": "https://example.com/your-certification-link"
            },
            "You can also add certifications without links"
          ]
        }
      ]
    },
    "github_projects": {
      "title": "Projects on GitHub"
    },
    "footer": {
      "show_social_links": true,
      "show_built_with": true,
      "built_with_text": "Built with ❤️ using vanilla JavaScript",
      "tagline": "Let's connect and build something amazing together!"
    }
  };

  return config;
}

function cleanupTemplateFiles() {
  const filesToRemove = [
    '.github/workflows/template-setup.yml',
    '.github/workflows/template-setup.js',
    'assets/portfolio-generator-explainer.png',
    // Remove all logos except placeholder
    'assets/logos/ANSR_Logo.png',
    'assets/logos/ANSR_Logo_White.png',
    'assets/logos/GitHub_Logo.png',
    'assets/logos/GitHub_Logo_White.png',
    'assets/logos/OutSystems_Logo.png',
    'assets/logos/OutSystems_Logo_White.png',
    'assets/logos/Progate_Logo.png',
    'assets/logos/Progate_Logo_White.png',
    'assets/logos/Skillenza_Logo.png',
    'assets/logos/Skillenza_Logo_White.png',
    // Remove all project images except placeholder
    'assets/projects/GitHub_Constellation_2024.jpeg',
    'assets/projects/GitTogether_Meetups_Automation_System.png',
    'assets/projects/GitTogethers_Registration_Web_Platform.png'
  ];

  const dirsToRemove = [
    'docs'
  ];

  console.log('🧹 Cleaning up template-specific files...');
  
  let removedCount = 0;
  
  // Remove files
  filesToRemove.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed file: ${file}`);
        removedCount++;
      } catch (error) {
        console.warn(`⚠️  Failed to remove ${file}: ${error.message}`);
      }
    }
  });

  // Remove directories
  dirsToRemove.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`✅ Removed directory: ${dir}`);
        removedCount++;
      } catch (error) {
        console.warn(`⚠️  Failed to remove ${dir}: ${error.message}`);
      }
    }
  });

  console.log(`✅ Cleanup complete! Removed ${removedCount} template files/directories.`);
}

function createInitialReadme(fullName, githubUsername, portfolioUrl, repoName) {
  // Check if repository name follows the correct format
  const isCorrectRepoName = repoName === `${githubUsername}.github.io`;
  const repoNameStatus = isCorrectRepoName ? '✅' : '❌';
  const repoUrl = `https://github.com/${githubUsername}/${repoName}`;
  
  const readme = `## 🚀 Next Steps

1. ${repoNameStatus} **Update repository name to \`${githubUsername}.github.io\`** ${isCorrectRepoName ? '(Done!)' : `(Current: \`${repoName}\`)`}
2. **Update [\`config.json\`](${repoUrl}/blob/main/config.json)** with your personal information, experience, and projects and then run [this workflow](${repoUrl}/actions/workflows/update-readme.yml) to update the README
3. **Replace assets** in the [\`assets/\`](${repoUrl}/tree/main/assets/) folder with your own logos and project images
4. **Add "featured" topic** to [GitHub repositories](https://github.com/${githubUsername}?tab=repositories) you want to showcase
5. **Enable GitHub Pages** in [repository settings](https://github.com/${githubUsername}/${repoName}/settings/pages) to make your portfolio live
6. **Customize further** by adding more content

---

# ${fullName} - Developer Portfolio

<div align="left">
  
[![Portfolio](https://img.shields.io/badge/🌐_Visit_Portfolio-Live-brightgreen?style=for-the-badge)](${portfolioUrl})
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github)](https://github.com/${githubUsername})

</div>

Welcome to my developer portfolio! This website showcases my projects, skills, and professional journey.

## ✨ Features

- 🎨 **Modern Design** - Clean, responsive interface with dark/light theme support
- 🚀 **Performance Optimized** - Fast loading with vanilla JavaScript
- 📱 **Mobile First** - Fully responsive across all devices
- 🔄 **Auto-Updated** - Content dynamically generated from \`config.json\`
- 🎭 **Interactive** - Smooth animations and engaging user experience
- 🌓 **Dark/Light Mode** - Smooth transitions with persistent preferences
- 🔗 **Dynamic Social Links** - Configurable social media and professional links
- ⚙️ **Zero Code Changes** - Everything configured through JSON

## 📈 GitHub Stats

<div align="left">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=dark&hide_border=true&include_all_commits=true&count_private=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=dark&hide_border=true&include_all_commits=true&count_private=true&layout=compact)

</div>

## 🤝 Connect

Let's connect and build something amazing together!

- 🌐 **Portfolio**: [${portfolioUrl}](${portfolioUrl})
- 💻 **GitHub**: [https://github.com/${githubUsername}](https://github.com/${githubUsername})

---

*Based on [portfolio template](https://github.com/yashrajnayak/developer-portfolio) originally created by [Yashraj Nayak](https://github.com/yashrajnayak)*`;

  return readme;
}

function updateLicense(fullName) {
  const currentYear = new Date().getFullYear();
  const licenseContent = `MIT License

Copyright (c) ${currentYear} ${fullName}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

  const licensePath = path.join(process.cwd(), 'LICENSE');
  fs.writeFileSync(licensePath, licenseContent);
  console.log(`✅ LICENSE updated with ${fullName} as copyright holder`);
}

async function fetchUserName(githubUsername) {
  try {
    console.log(`🔍 Fetching user information for ${githubUsername}...`);
    const response = await fetch(`https://api.github.com/users/${githubUsername}`);
    
    if (!response.ok) {
      console.warn(`⚠️  Failed to fetch user info from GitHub API: ${response.status}`);
      return githubUsername; // Fallback to username
    }
    
    const userData = await response.json();
    const fullName = userData.name;
    
    if (fullName && fullName.trim() && fullName !== githubUsername) {
      console.log(`✅ Found full name: ${fullName}`);
      return fullName;
    } else {
      console.log(`ℹ️  No display name found, using username: ${githubUsername}`);
      return githubUsername;
    }
  } catch (error) {
    console.warn(`⚠️  Error fetching user info: ${error.message}`);
    return githubUsername; // Fallback to username
  }
}

async function main() {
  try {
    // Get repository information from environment variables (set by GitHub Actions)
    const githubUsername = process.env.GITHUB_USERNAME || process.env.REPO_OWNER;
    let repoName = process.env.REPO_NAME;
    
    if (!githubUsername) {
      console.error('❌ Missing GitHub username from environment');
      process.exit(1);
    }

    // Handle case where REPO_NAME might include owner (owner/repo format)
    if (repoName && repoName.includes('/')) {
      repoName = repoName.split('/')[1];
    }
    
    // Fallback to extracting from current directory if repo name is missing
    if (!repoName) {
      const currentDir = process.cwd();
      repoName = path.basename(currentDir);
      console.log(`⚠️  Repository name not provided, using directory name: ${repoName}`);
    }

    // Generate portfolio URL based on repository name
    let portfolioUrl;
    if (repoName === `${githubUsername}.github.io`) {
      portfolioUrl = `https://${githubUsername}.github.io`;
    } else {
      portfolioUrl = `https://${githubUsername}.github.io/${repoName}`;
    }

    console.log('🚀 Setting up portfolio template...');
    console.log(`📂 GitHub: ${githubUsername}`);
    console.log(`📂 Repository: ${repoName}`);
    console.log(`🌐 Portfolio: ${portfolioUrl}`);

    // Fetch the user's full name from GitHub API
    const fullName = await fetchUserName(githubUsername);

    // 1. Create personalized config.json
    console.log('📝 Creating personalized config.json...');
    const config = createDefaultConfig(fullName, githubUsername, portfolioUrl);
    fs.writeFileSync(path.join(process.cwd(), 'config.json'), JSON.stringify(config, null, 2));
    console.log('✅ config.json created successfully!');

    // 2. Create initial README.md
    console.log('📄 Creating initial README.md...');
    const readme = createInitialReadme(fullName, githubUsername, portfolioUrl, repoName);
    fs.writeFileSync(path.join(process.cwd(), 'README.md'), readme);
    console.log('✅ README.md created successfully!');

    // 3. Update LICENSE file
    updateLicense(fullName);

    // 4. Clean up template-specific files
    cleanupTemplateFiles();

    console.log('🎉 Portfolio setup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Update config.json with your personal details');
    console.log('2. Add "featured" topic to repositories you want to showcase');
    console.log('3. Enable GitHub Pages in repository settings');
    console.log('4. Your portfolio will be live and auto-updating!');

  } catch (error) {
    console.error('❌ Error setting up portfolio:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createDefaultConfig, cleanupTemplateFiles, createInitialReadme, updateLicense };
