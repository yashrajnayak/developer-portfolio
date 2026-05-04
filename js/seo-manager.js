// SEO Manager Module
export class SEOManager {
    setContent(selector, value) {
        const element = document.querySelector(selector);
        if (element && value !== undefined) {
            element.content = value;
        }
    }

    setHref(selector, value) {
        const element = document.querySelector(selector);
        if (element && value) {
            element.href = value;
        }
    }

    updateSEOTags(config) {
        const seo = config.site?.seo || {};
        const title = seo.title || config.site?.title || config.header?.greeting || 'Developer Portfolio';
        const description = seo.description || config.site?.description || 'Developer portfolio';
        const baseUrl = (seo.base_url || '').replace(/\/$/, '');
        const image = seo.og_image || (config.github_username ? `https://avatars.githubusercontent.com/${config.github_username}?s=512` : '');
        const imageAlt = seo.og_image_alt || `Profile photo of ${config.header?.greeting || 'portfolio owner'}`;
        const sameAs = config.social_links?.map(link => link.url).filter(Boolean) || [];

        document.title = title;

        this.setContent('meta[name="description"]', description);
        this.setContent('meta[name="keywords"]', seo.keywords || '');
        this.setContent('meta[name="author"]', seo.author || config.header?.greeting || '');
        this.setContent('meta[name="robots"]', seo.robots || 'index, follow');

        this.setContent('meta[property="og:title"]', title);
        this.setContent('meta[property="og:description"]', description);
        this.setContent('meta[property="og:image"]', image);
        this.setContent('meta[property="og:image:alt"]', imageAlt);
        this.setContent('meta[property="og:url"]', baseUrl);

        this.setContent('meta[property="twitter:title"]', title);
        this.setContent('meta[property="twitter:description"]', description);
        this.setContent('meta[property="twitter:image"]', image);
        this.setContent('meta[property="twitter:image:alt"]', imageAlt);
        this.setContent('meta[property="twitter:card"]', seo.twitter_card || 'summary_large_image');
        this.setContent('meta[property="twitter:url"]', baseUrl);

        this.setHref('link[rel="canonical"]', baseUrl ? `${baseUrl}/` : '');

        const jsonLD = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": config.header?.greeting || '',
            "url": baseUrl,
            "image": image,
            "sameAs": sameAs,
            "knowsAbout": this.getKnowsAbout(config)
        };

        if (config.experience?.jobs?.[0]) {
            jsonLD.jobTitle = config.experience.jobs[0].role;
            jsonLD.worksFor = {
                "@type": "Organization",
                "name": config.experience.jobs[0].company
            };
        }

        const schema = document.querySelector('script[type="application/ld+json"]');
        if (schema) {
            schema.textContent = JSON.stringify(jsonLD, null, 2);
        }
    }

    getKnowsAbout(config) {
        const skills = config.skills?.categories
            ?.flatMap(category => category.items || [])
            .map(item => typeof item === 'object' ? item.name : item)
            .filter(Boolean) || [];

        return [...new Set(skills)].slice(0, 12);
    }
}
