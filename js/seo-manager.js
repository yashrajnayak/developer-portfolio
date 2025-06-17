// SEO Manager Module
export class SEOManager {
    // Update SEO meta tags
    updateSEOTags(config) {
        const seo = config.site.seo;
        
        // Update basic meta tags
        document.title = seo.title;
        document.querySelector('meta[name="description"]').content = seo.description;
        document.querySelector('meta[name="keywords"]').content = seo.keywords;
        document.querySelector('meta[name="author"]').content = seo.author;

        // Update Open Graph tags
        document.querySelector('meta[property="og:title"]').content = seo.title;
        document.querySelector('meta[property="og:description"]').content = seo.description;
        document.querySelector('meta[property="og:image"]').content = seo.og_image;
        document.querySelector('meta[property="og:url"]').content = seo.base_url;

        // Update Twitter Card tags
        document.querySelector('meta[property="twitter:title"]').content = seo.title;
        document.querySelector('meta[property="twitter:description"]').content = seo.description;
        document.querySelector('meta[property="twitter:image"]').content = seo.og_image;
        document.querySelector('meta[property="twitter:card"]').content = seo.twitter_card;
        document.querySelector('meta[property="twitter:url"]').content = seo.base_url;

        // Extract GitHub username from social links for JSON-LD
        const githubLink = config.social_links?.find(link => link.icon === 'github');
        const githubUrl = githubLink?.url || `https://github.com/${config.github_username || ''}`;
        const linkedinLink = config.social_links?.find(link => link.icon === 'linkedin');
        
        // Build sameAs array dynamically
        const sameAs = config.social_links?.map(link => link.url).filter(Boolean) || [];

        // Update JSON-LD
        const jsonLD = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": config.header.greeting,
            "url": seo.base_url,
            "sameAs": sameAs
        };

        // Add work info if available
        if (config.experience?.jobs?.[0]) {
            jsonLD.jobTitle = config.experience.jobs[0].role;
            jsonLD.worksFor = {
                "@type": "Organization",
                "name": config.experience.jobs[0].company
            };
        }
        
        document.querySelector('script[type="application/ld+json"]').textContent = JSON.stringify(jsonLD, null, 2);
    }
}
