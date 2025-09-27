# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website for Adys, a Bitcoin developer, built as a Single Page Application (SPA) with a custom router. The site features:

- Static HTML/CSS/JavaScript architecture with no build process
- Personal portfolio showcasing Bitcoin development expertise
- Blog system with Markdown rendering
- Links to external tools (Miniscript Studio is hosted separately)

## Key Architecture Components

### SPA Router System
- **Main SPA**: `app.js` contains `SPARouter` class managing client-side routing for `/`, `/about`, `/blog`, `/talks`, `/tools`
- The main site HTML files (index.html, about/index.html, etc.) use the same base structure but load different content via the SPA router
- Special handling: `/miniscript` links navigate to external tool (not intercepted by SPA router)

### Content Management
- **Blog Posts**: Stored as Markdown in `/blog/posts/` and rendered dynamically using marked.js
- **Static Assets**: Images in `/images/`, styles in `styles.css`
- **Theme System**: CSS custom properties with dark/light theme support

## Development Commands

### Deployment
```bash
# Deploy entire site to Vercel (production)
./deploysiteonly.sh

# Deploy with external tool updates (copies files from another project)
./deploy.sh
```

### Development Server
This is a static site with no build process. For local development:
```bash
# Serve locally (any static server)
python -m http.server 8000
# or
npx serve .
```

## File Structure Patterns

### Main Site Pages
Each page section has its own directory with an `index.html`:
- `/about/index.html` - About page
- `/blog/index.html` - Blog listing
- `/talks/index.html` - Talks page
- `/tools/index.html` - Tools listing

## Content Guidelines

### Blog Posts
- Written in Markdown and stored in `/blog/posts/`
- Rendered client-side using marked.js library
- Automatically linked from blog index via SPA router

### Styling
- CSS custom properties for theming (see styles.css:1-30)
- Dark theme default, light theme via `[data-theme="light"]`
- Responsive design with mobile hamburger menu

## Deployment Configuration

### Vercel Setup
- `vercel.json` configures clean URLs and caching headers
- No server-side rendering - pure static hosting
- Caching rules for `/images/` and external tools

### External Dependencies
- `marked.min.js` - Markdown parsing
- No package.json or npm dependencies

## Important Notes

- **No Build Process**: This is intentionally a simple static site
- **External Tools**: Some tools referenced are developed and deployed separately
- **Client-Side Only**: All routing, markdown rendering, and logic happens in the browser
- **Theme Persistence**: Uses localStorage to remember user's light/dark preference
- **Bitcoin Focus**: Content and portfolio focused on Bitcoin development

## Critical Implementation Details

### SPA Routing Requirements
- **Absolute Paths Required**: Always use absolute paths (`/styles.css`, `/app.js`) in HTML files, NOT relative paths (`styles.css`). This ensures assets load correctly from deep routes like `/blog/post-name/`
- **Trailing Slash Normalization**: Router strips trailing slashes for consistency (except root `/`)
- **Direct URL Access**: For local development, use `npx serve . -s -l 8001` (NOT Python's simple server) to enable direct URL access
- **Navigation Active State**: Blog link uses `/blog/` with trailing slash in nav menu and activeMap

### Page Layout Standards
- **Full Height Pages**: Use `min-height: calc(100vh - 120px)` with `box-sizing: border-box` for pages that should fill viewport
- **Consistent Styling**: Blog and Tools pages share `tools-content` class for consistent layout (left-aligned titles, max-width: 800px lists)
- **Card Items**: Both tools and blog items use same bordered card style (1px border, 8px radius, hover background change)

### Blog System
- **Markdown Files**: Located in `/blog/posts/*.md`, rendered client-side with marked.js
- **Blog Post Routes**: Each post needs route in app.js (e.g., `/blog/miniscript-studio-intro`)
- **Image Thumbnails**: Blog posts use thumbnail images with `object-fit: contain` to prevent cropping
- **Static Fallbacks**: Remove any static HTML files in blog subdirectories to avoid conflicts with SPA routing

### CSS Architecture
- **Markdown Content**: `.markdown-content` class provides complete typography styling for rendered markdown
- **Theme Variables**: All colors use CSS custom properties for dark/light theme support
- **Mobile Responsiveness**: Blog items switch from horizontal (desktop) to vertical (mobile) layout

### Common Pitfalls to Avoid
- Don't create static HTML files in blog subdirectories - they override SPA routing
- Don't use relative paths in index.html - breaks deep route asset loading
- Don't forget trailing slash in blog nav link - breaks active highlighting
- Don't use `object-fit: cover` for blog images - crops content
- Don't use `margin-top: auto` on footer if you want pages to fill height