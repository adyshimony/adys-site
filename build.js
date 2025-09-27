#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Template for blog posts
function createBlogPostHTML(title, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="/styles.css">
    <script>
        // Set theme immediately to prevent flash
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="nav-container">
                <div class="logo">
                    <a href="/">ADYS</a>
                </div>
                <div class="hamburger" onclick="toggleMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/blog" class="active">Blog</a></li>
                    <li><a href="/talks">Talks</a></li>
                    <li><a href="/tools">Tools</a></li>
                </ul>
                <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">🌙</button>
            </div>
        </nav>
    </header>

    <main>
        <section class="blog-post">
            <div class="container">
                <article class="markdown-content" style="max-width: 1200px;">
                    ${content}
                </article>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 Adys.</p>
            <a href="https://github.com/adyshimony">Github</a>
        </div>
    </footer>

    <script>
        // Theme management
        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            updateThemeIcon(savedTheme);
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        }

        function updateThemeIcon(theme) {
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }

        // Mobile menu toggle
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('active');
        }

        // Initialize theme when DOM is ready
        document.addEventListener('DOMContentLoaded', initTheme);
    </script>
</body>
</html>`;
}

// Extract metadata from markdown file
function extractMetadata(markdown) {
    // Extract title from first h1 (either markdown # or HTML <h1>)
    let titleMatch = markdown.match(/^#\s+(.+)$/m);
    if (!titleMatch) {
        titleMatch = markdown.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    }
    const title = titleMatch ? titleMatch[1].replace(/🔨\s*/, '').trim() : 'Blog Post';

    // Extract excerpt from first paragraph after titles
    const excerptMatch = markdown.match(/\n\n([^#<\n].{50,200}[.!?])/);
    const excerpt = excerptMatch ? excerptMatch[1].trim() : 'Read more...';

    // For now, use current date - in future could extract from frontmatter
    const date = 'January 2025';

    return { title, excerpt, date };
}

// Create blog index page
function createBlogIndex() {
    const postsDir = path.join(__dirname, 'blog', 'posts');
    let blogItems = '';

    // Generate blog items from markdown files
    if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir);

        files.forEach(file => {
            if (file.endsWith('.md')) {
                const markdown = fs.readFileSync(path.join(postsDir, file), 'utf8');
                const postName = file.replace('.md', '');
                const metadata = extractMetadata(markdown);

                blogItems += `
                    <article class="blog-post-item">
                        <a href="/blog/${postName}">
                            <div class="blog-post-image">
                                <img src="/images/${postName}.png" alt="${metadata.title}" />
                            </div>
                            <div class="blog-post-content">
                                <h2>${metadata.title}</h2>
                                <time class="blog-post-date">${metadata.date}</time>
                                <p class="blog-post-excerpt">${metadata.excerpt}</p>
                            </div>
                        </a>
                    </article>`;
            }
        });
    }

    const blogIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Adys</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="/styles.css">
    <script>
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="nav-container">
                <div class="logo">
                    <a href="/">ADYS</a>
                </div>
                <div class="hamburger" onclick="toggleMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/blog" class="active">Blog</a></li>
                    <li><a href="/talks">Talks</a></li>
                    <li><a href="/tools">Tools</a></li>
                </ul>
                <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">🌙</button>
            </div>
        </nav>
    </header>

    <main>
        <section class="tools-content">
            <div class="container">
                <h1>Blog</h1>

                <div class="tools-list">${blogItems}
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 Adys.</p>
            <a href="https://github.com/adyshimony">Github</a>
        </div>
    </footer>

    <script>
        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            updateThemeIcon(savedTheme);
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        }

        function updateThemeIcon(theme) {
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }

        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('active');
        }

        document.addEventListener('DOMContentLoaded', initTheme);
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, 'blog', 'index.html'), blogIndexHTML);
    console.log('✓ Built: blog/index.html');
}

// Process markdown files
function buildBlogPosts() {
    const postsDir = path.join(__dirname, 'blog', 'posts');
    const files = fs.readdirSync(postsDir);

    files.forEach(file => {
        if (file.endsWith('.md')) {
            const markdown = fs.readFileSync(path.join(postsDir, file), 'utf8');
            const html = marked.parse(markdown);

            // Extract title from first line of markdown
            const titleMatch = markdown.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] + ' - Adys' : 'Blog Post - Adys';

            // Create output directory
            const postName = file.replace('.md', '');
            const outputDir = path.join(__dirname, 'blog', postName);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Write HTML file
            const htmlContent = createBlogPostHTML(title, html);
            fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent);

            console.log(`✓ Built: blog/${postName}/index.html`);
        }
    });
}

// Main build function
function build() {
    console.log('Building static HTML files...\n');

    try {
        createBlogIndex();
        buildBlogPosts();
        console.log('\n✅ Build complete!');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run build
build();