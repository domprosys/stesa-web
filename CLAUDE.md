# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

STESA (Society for Emergent Technology, Sports & Arts) is a static website showcasing an organization that explores the intersection of technology, society, sports, and arts. The website features:

- **Multi-page structure**: Home, About, Projects, Team, Contact pages with section-specific pages (Society, Technology, Sports, Arts)
- **Interactive 3D animations**: Three.js particle system with dynamic connections and mouse interaction
- **Bilingual support**: English/Romanian translation system with localStorage persistence
- **Responsive design**: Mobile-first approach with hamburger navigation
- **Modular CSS architecture**: Separated stylesheets for different components

## Development Commands

This is a static website with no build process. Development is done by:
- Opening files directly in browser or using a local server
- For local development: `python -m http.server 8000` or `npx serve`
- No package manager, build tools, or testing framework is configured

## Architecture & Key Components

### JavaScript Architecture
- **Three.js particle system** (`main.js`): Complex 3D background animation with 150 particles, dynamic connections, mouse interaction, and wave effects
- **Language system** (`language.js`): Comprehensive translation system with 200+ translation keys, localStorage persistence, and dynamic content updates
- **Animation management**: Multiple unused animation files exist (`*-animation.js`) but are not currently loaded
- **Background systems**: Two competing systems exist (Three.js in main.js and Canvas 2D in particles-background.js)

### CSS Organization
- **Modular structure**: `styles.css` imports `hero.css`, `boxes.css`, `navbar.css`
- **Override system**: `mobile-fix.css` contains 500+ lines of aggressive mobile overrides with `!important` declarations
- **Component isolation**: Each page type has its own inline styles for specific layouts

### HTML Structure Patterns
- **Navbar duplication**: Same 40-line navbar structure repeated across all 5 HTML pages
- **Language attributes**: All translatable elements use `data-translate` attributes
- **Animation containers**: Each page has `#canvas-container` for Three.js background

## Technical Constraints & Patterns

### Performance Considerations
- **Heavy dependency**: Three.js (134KB) loaded on every page for box interactions only
- **No minification**: All assets served uncompressed
- **Extensive DOM queries**: Language switching performs full page traversal

### Code Organization Issues
- **CSS conflicts**: Multiple stylesheets override each other extensively
- **Unused code**: Several animation JavaScript files are included but never executed
- **Duplication**: Navbar, meta tags, and common patterns repeated across all pages

### Language System
- **Default language**: Romanian (`ro`) is the default, English (`en`) is secondary
- **Translation scope**: Covers all UI text, navigation, content descriptions, and page-specific content
- **Storage**: Language preference persisted in localStorage as `stesa-language`

## Development Notes

When working with this codebase:
- The particle animation system in `main.js` is performance-intensive and may need optimization
- Language switching affects all `[data-translate]` elements and navbar links
- Mobile responsiveness relies heavily on `mobile-fix.css` overrides
- Box interactions trigger particle system hover effects through Three.js raycasting
- All pages share the same navbar structure - changes need to be replicated across all HTML files