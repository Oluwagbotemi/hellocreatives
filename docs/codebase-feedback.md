# Codebase feedback (Nov 2026)

Saved review of the hellocreatives codebase, to pick up later. `npm run build` passes and all 13 posts are generated as static pages.

**Done (quick fixes, Nov 2026):** items 1–3, the leftovers, the `jusify`/`arroe` typos and the reading-time icon. Posts with an SVG preview image now get a generated preview (`/api/blog/<slug>/preview-image`). The footer is rendered by the pages that show it (no late pop-in) and now also appears on blog posts on the main domain.

## Worth fixing soon
1. **Link previews**
   - Post dates are written as `"08 July, 2024"`, but Open Graph wants `2024-07-08` (see `src/app/(blog)/[slug]/page.tsx`).
   - blog13's `ogImage` is an SVG, and most social apps won't show SVG previews.
2. **Huge author photo.** `public/images/author-image.jpg` is 7.8 MB but only shows at 32px. `Img_12.webp` (590 KB) is oddly large, and `Img_12.png` isn't used anywhere.
3. **Newsletter footer only shows on the `blog.` subdomain.** It's missing on `/newsletter` and Vercel previews, and it pops in late (`src/components/footer.tsx`).
4. **Subscribe only emails the address to you through EmailJS.** No subscriber list is stored. Consider Buttondown, ConvertKit, Beehiiv or Resend.
5. **Forms don't check input.**
   - No email-format check.
   - Not wrapped in `<form>`, so pressing Enter doesn't submit.
   - The 1,000-word pitch limit isn't enforced.
   - The `success` message in `join-us-modal.tsx` is never shown.

## Accessibility and SEO
6. **Clickable cards and tiles aren't real links.** Blog cards and platform tiles use `onClick`/`router.push`; switch them to `<Link>`.
7. **Missing basics:**
   - No `sitemap.ts`, `robots.ts` or custom 404 page.
   - The breadcrumb says "Single Post" instead of the post title.
   - The back button is a 20px tap target.
   - Image `alt` text is generic.
8. **Small mobile text.** Article text is 14px on phones; aim for 16–17px.

## Code tidiness
- **Leftovers to remove:**
  - the stray `import { s } from 'framer-motion/client'` (`platform-select.tsx`)
  - the circular `import BlogList from '..'` (`blog-listing.tsx`)
  - the unused Geist and Geist Mono fonts
- **Typos:**
  - `jusify-center` should be `justify-center`
  - `alt='arroe right up'`
  - the slug `fresh-prespective` (renaming it needs a redirect so old links keep working)
- **Wrong icon.** The reading-time row uses the calendar icon.
- **No shared post type.** Add one `BlogPost` type; `BlogParam` is currently copied in two files.
- **Post bodies are HTML strings with inline styles,** some of them invalid. Consider MDX, which would also let you drop `isomorphic-dompurify`.
- **Post order.** Sort posts by date instead of relying on array order plus `.reverse()`.
- **Inconsistent text.** Reading times are written three ways, and the brand name varies (Hello Creatives / HelloCreative / Hellocreative).
- **Homepage highlight** isn't recalculated when the window is resized.
- **README** is still the template, and there's no lint script.

## Suggested order
1. Quick fixes: dates and preview images, the author image, leftovers and typos, footer visibility.
2. Real links, plus a sitemap and robots file.
3. A shared `BlogPost` type, date sorting, consistent reading times.
4. Bigger choices: MDX, and a real newsletter provider.
