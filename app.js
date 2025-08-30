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
            '/blog': { 
                title: 'Blog - Adys',
                content: this.getBlogContent(),
                active: 'blog'
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
        this.navigate(window.location.pathname, false);
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            // Don't intercept miniscript links - let them navigate normally
            if (link && !link.hasAttribute('target') && !link.getAttribute('href').startsWith('/miniscript')) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
    }

    navigate(path, pushState = true) {
        const route = this.routes[path];
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
            mainElement.innerHTML = route.content;
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
            'blog': '/blog',
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
            <section class="coming-soon">
                <div class="container">
                    <h1>Soon</h1>
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
                                <h3>Miniscript Compiler</h3>
                                <p>Compile and analyze Bitcoin Miniscript policies</p>
                            </div>
                            <div class="tool-arrow">→</div>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

}

// Initialize SPA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.spaRouter = new SPARouter();
});