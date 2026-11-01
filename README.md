# G33by Designs portfolio

Static site (HTML, CSS, JavaScript) for GitHub Pages, with a Supabase contact form
and project cards synced from GitHub.

## Set up

1. **Portrait:** save your photo as `assets/img/portrait.jpg` (portrait orientation works best, at least 800 px wide).
2. **Supabase:** run `supabase/enquiries.sql` in the Supabase SQL editor. Then put your project URL and **anon** key in `assets/js/config.js`. Never use the service-role key.
3. **Project screenshots:** add desktop screenshots (about 1600 x 1000) as `assets/work/abu.jpg`, `assets/work/adeluxe.jpg` and `assets/work/aura-atelier.jpg`. Until then each row shows a neutral placeholder.
4. **GitHub repos:** on Abu, Adeluxe and Aura-atelier-demo, set the Website field to the live URL and add the topic `portfolio`.
5. **Sync:** in the portfolio repo, open Actions, run "Sync projects" once. After that it runs nightly and fills `data/projects.json`.

## Still to do before launch

- Pages linked but not built yet: `about.html`, `privacy.html`, `terms.html` (and `work.html` and `contact.html` if you want them as separate pages)
- Custom domain connected, then add canonical tags, `sitemap.xml`, `robots.txt`, structured data and an Open Graph image
- Fill the open items in the Privacy Policy (Supabase region, retention period, hosting provider)
- Add PNG icons (180 px and 512 px) alongside the SVG favicon
- Set Supabase email alerts for new enquiries
- Confirm nothing says "Made with AI" and run a final mobile pass
