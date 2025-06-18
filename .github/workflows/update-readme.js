#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate README.md content from config.json
 * This script can be run locally or in GitHub Actions
 */

function generateReadme(config) {
  const readme = `# ${config.header.greeting} - Developer Portfolio

<div align="left">
  
[![Portfolio](https://img.shields.io/badge/🌐_Visit_Portfolio-Live-brightgreen?style=for-the-badge)](${config.site.seo.base_url})
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github)](${config.social_links.find(link => link.name === 'GitHub')?.url})
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](${config.social_links.find(link => link.name === 'LinkedIn')?.url})

</div>

The live portfolio includes detailed professional experience, technical skills and certifications, featured projects and achievements.

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

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${config.github_username}&theme=dark&hide_border=true&include_all_commits=true&count_private=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${config.github_username}&theme=dark&hide_border=true&include_all_commits=true&count_private=true&layout=compact)

</div>

## 🤝 Connect

${config.footer.tagline}

- 🌐 **Portfolio**: [${config.site.seo.base_url}](${config.site.seo.base_url})
- 💻 **GitHub**: [${config.social_links.find(link => link.name === 'GitHub')?.url}](${config.social_links.find(link => link.name === 'GitHub')?.url})
- 🔗 **LinkedIn**: [${config.social_links.find(link => link.name === 'LinkedIn')?.url}](${config.social_links.find(link => link.name === 'LinkedIn')?.url})

---

*Based on [portfolio template](https://github.com/yashrajnayak/developer-portfolio) originally created by [Yashraj Nayak](https://github.com/yashrajnayak)*`;

  return readme;
}

function main() {
  try {
    // Read config.json
    const configPath = path.join(process.cwd(), 'config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ config.json not found in current directory');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Generate README content
    const readmeContent = generateReadme(config);
    
    // Write README.md
    const readmePath = path.join(process.cwd(), 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    
    console.log('✅ README.md updated successfully!');
    console.log('📝 Generated from config.json');
    
  } catch (error) {
    console.error('❌ Error generating README:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateReadme };
