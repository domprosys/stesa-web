# TODO: Refactor Inline Styles into `styles.css`

Ordered by priority & ease of implementation:

1. **Canvas Container Styles**
   - Move `position`, `top`, `left`, `width`, `height`, `z-index: -1` and `background-color: #030b35` into `#canvas-container` in `css/styles.css`.
   - Remove the inline `style` attribute from `<div id="canvas-container">` in all HTML pages (`index.html`, `about.html`, `projects.html`, `contact.html`, `team.html`).

2. **UL Text Alignment**
   - Add a rule in `styles.css` (e.g. `main .content ul { text-align: left; }`).
   - Remove `style="text-align: left;"` from `<ul>` in section pages.

3. **Box Label Colors**
   - Define modifier classes in `styles.css`:
     ```css
     .box-label.society { color: #0066cc; }
     .box-label.technology { color: #cc00cc; }
     .box-label.sports { color: #009900; }
     .box-label.arts { color: #cc9900; }
     ```
   - Remove inline `style="color: ..."` from each `.box-label` in `index.html`.

4. **Team Member Photo Backgrounds**
   - Create classes in `styles.css` (e.g. `.team-member-photo.blue { background-color: #0066cc; }`, etc.) or use `nth-child`.
   - Remove inline `style="background-color: ..."` from each `.team-member-photo` in `team.html`.

5. **Index Page Inline `<style>` and Duplicate CSS Link**
   - Remove both `<style>` blocks in `index.html`.
   - Remove the duplicate `<link href="css/styles.css">`.
   - Move all custom rules (`#random-subtitle`, `body`, `.hero`, etc.) into appropriate selectors in `styles.css`.

6. **Random Subtitle Styles**
   - Copy the inline rules for `#random-subtitle` into `styles.css` under a dedicated section.

7. **Remove Unnecessary `!important`**
   - Audit `!important` usage in `styles.css` and `mobile-fix.css`.
   - Remove or refactor where specificity is sufficient, to simplify overrides.

8. **Final Testing & Cleanup**
   - Verify desktop & mobile layouts at breakpoints (1200px, 768px, 480px).
   - Remove any leftover inline styles or unused CSS selectors.

---

*Next step:* Start with **1. Canvas Container Styles**.
