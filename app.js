// SPA Router and Content Manager
class SPARouter {
    constructor() {
        this.routes = {
            '/': { 
                title: 'Adys - Bitcoin Developer',
                content: this.getHomeContent(),
                active: 'home'
            },
            '/about': { 
                title: 'About - Adys',
                content: this.getAboutContent(),
                active: 'about'
            },
            '/talks': { 
                title: 'Talks - Adys',
                content: this.getTalksContent(),
                active: 'talks'
            },
            '/tools': { 
                title: 'Tools - Adys',
                content: this.getToolsContent(),
                active: 'tools'
            },
        };
        this.init();
    }

    init() {
        // Handle initial load
        console.log('SPA initializing with pathname:', window.location.pathname);
        this.navigate(window.location.pathname, false);
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            const href = link?.getAttribute('href');
            // Only intercept SPA routes (/, /about, /talks, /tools)
            // Let all other links navigate normally (blog, miniscript, etc.)
            if (link && !link.hasAttribute('target') &&
                (href === '/' || href === '/about' || href === '/talks' || href === '/tools')) {
                e.preventDefault();
                this.navigate(href);
            }
        });
    }

    async navigate(path, pushState = true) {
        // Remove trailing slash for consistency (except for root)
        if (path !== '/' && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        let route = this.routes[path];
        if (!route) {
            // Fallback to home for unknown routes
            path = '/';
            route = this.routes['/'];
        }

        // Update browser history
        if (pushState) {
            window.history.pushState({}, '', path);
        }

        // Update page title
        document.title = route.title;

        // Update main content
        const mainElement = document.querySelector('main');
        if (mainElement) {
            // Check if content is a function (async) or string
            if (typeof route.content === 'function') {
                mainElement.innerHTML = '<div class="loading">Loading...</div>';
                const content = await route.content();
                mainElement.innerHTML = content;
            } else {
                mainElement.innerHTML = route.content;
            }
        }

        // Update active nav item
        this.updateActiveNav(route.active);

        // Trigger content-specific initialization
        this.initializePageContent(path);
    }

    updateActiveNav(activeItem) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeMap = {
            'home': '/',
            'about': '/about',
            'blog': '/blog/',
            'talks': '/talks',
            'tools': '/tools'
        };
        
        const activeHref = activeMap[activeItem];
        if (activeHref) {
            const activeLink = document.querySelector(`.nav-menu a[href="${activeHref}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    initializePageContent(path) {
        // Initialize miniscript compiler if on miniscript page
        if (path === '/miniscript' && window.MiniscriptCompiler) {
            new MiniscriptCompiler();
        }
    }

    getHomeContent() {
        return `
            <section class="hero-fullscreen">
                <img src="images/hero.jpg" alt="" />
            </section>
        `;
    }

    getAboutContent() {
        return `
            <section class="about-content">
                <div class="container">
                    <h1>ABOUT ME</h1>
                    
                    <div class="about-text">
                        <p>Bitcoin developer, wallet expert, and blockchain consultant with 20+ years of software development experience and active in the crypto space since 2017. I specialize in wallet architecture, custody models, exchange auditing, and fund recovery.</p>
                        
                        <p>As part of the eToro crypto wallet team, I contributed to building the company's first crypto wallet and custodian gateway. I have also integrated enterprise-grade solutions from Fireblocks, BitGo, and Chainalysis, and conducted security and compliance audits for exchanges. From day one of the FTX & Alameda collapse, I served as a crypto adviser and remained hands-on throughout the long recovery process of tracing and securing funds.</p>
                        
                        <p>Currently an early-stage Bitcoin Core contributor through the Chaincode BOSS program (2025), with a growing focus on Miniscript and wallet development.</p>
                        
                        <p>In addition to consulting, I serve as an Ambassador at the Bitcoin Embassy Tel Aviv, contribute actively to the Bitcoin open-source community, and act as a court-recognized expert witness in blockchain and cryptocurrency cases. I also regularly speak at international conferences (BTC Amsterdam, BTC Prague, Dev++ Riga) on wallets, self-custody tradeoffs, and protocol development.</p>
                    </div>
                </div>
            </section>
        `;
    }

    getBlogContent() {
        return `
            <section class="tools-content">
                <div class="container">
                    <h1>Blog</h1>

                    <div class="tools-list">
                        <article class="blog-post-item">
                            <a href="/blog/miniscript-studio-intro">
                                <div class="blog-post-image">
                                    <img src="/images/miniscript-studio-intro.png" alt="Miniscript Studio" />
                                </div>
                                <div class="blog-post-content">
                                    <h2>Miniscript Studio: Explore and Build Bitcoin Scripts with Ease</h2>
                                    <time class="blog-post-date">January 2025</time>
                                    <p class="blog-post-excerpt">Bitcoin Script is powerful — it enables multisig, timelocks, vaults, hashlocks, and more. But writing raw Script is notoriously complex. That's why Miniscript exists: a structured language that makes Bitcoin scripts safer, analyzable, and composable.</p>
                                </div>
                            </a>
                        </article>
                    </div>
                </div>
            </section>
        `;
    }

    getTalksContent() {
        return `
            <section class="coming-soon">
                <div class="container">
                    <h1>Soon</h1>
                </div>
            </section>
        `;
    }

    getToolsContent() {
        return `
            <section class="tools-content">
                <div class="container">
                    <h1>Tools</h1>
                    
                    <div class="tools-list">
                        <a href="/miniscript" class="tool-item">
                            <div class="tool-icon">🔨</div>
                            <div class="tool-details">
                                <h3>Miniscript Studio</h3>
                                <p>Compile and analyze Bitcoin Miniscript policies</p>
                            </div>
                            <div class="tool-arrow">→</div>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

    async getMiniscriptStudioIntroContent() {
        try {
            // Ensure marked is loaded
            if (typeof marked === 'undefined') {
                throw new Error('Marked library not loaded');
            }

            const response = await fetch('/blog/posts/miniscript-studio-intro.md');
            if (!response.ok) {
                console.error('Failed to fetch markdown:', response.status, response.statusText);
                throw new Error(`Failed to load markdown file: ${response.status}`);
            }

            const markdown = await response.text();
            const html = marked.parse(markdown);

            return `
                <section class="blog-post">
                    <div class="container">
                        <article class="markdown-content">
                            ${html}
                        </article>
                    </div>
                </section>
            `;
        } catch (error) {
            console.error('Error loading blog post:', error);
            return `
                <section class="coming-soon">
                    <div class="container">
                        <h1>Soon</h1>
                    </div>
                </section>
            `;
        }
    }

}

// Initialize SPA when DOM and libraries are ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for marked to be available
    const initRouter = () => {
        if (typeof marked !== 'undefined') {
            window.spaRouter = new SPARouter();
        } else {
            // Retry after a short delay
            setTimeout(initRouter, 100);
        }
    };
    initRouter();
});