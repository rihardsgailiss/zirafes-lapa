/**
 * One-off batch: add data-copy-id chrome + Vincent scripts after locale-picker.js
 * Run: node scripts/batch-vincent-chrome.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const MEGA_OLD = `                    <a class="site-header__mega-card" href="product.html">
                      <span class="site-header__mega-title">Overview</span>
                      <span class="site-header__mega-desc">Capture, edit, enhance and share in one platform</span>
                    </a>
                    <a class="site-header__mega-card" href="camera.html">
                      <span class="site-header__mega-title">Camera</span>
                      <span class="site-header__mega-desc">Giraffe PRO Camera is built to capture everything you need from one property capture.</span>
                    </a>
                    <a class="site-header__mega-card" href="content-studio.html">
                      <span class="site-header__mega-title">Content Studio</span>
                      <span class="site-header__mega-desc">Edit, AI enhance, manage and share.</span>
                    </a>
                    <a class="site-header__mega-card" href="outputs.html">
                      <span class="site-header__mega-title">Content</span>
                      <span class="site-header__mega-desc">HDR photos, floor plans, virtual tours, videos, websites and more.</span>
                    </a>`;

const MEGA_NEW = `                    <a class="site-header__mega-card" href="product.html">
                      <span class="site-header__mega-title" data-copy-id="global.mega.overview.title">Overview</span>
                      <span class="site-header__mega-desc" data-copy-id="global.mega.overview.desc">Capture, edit, enhance and share in one platform</span>
                    </a>
                    <a class="site-header__mega-card" href="camera.html">
                      <span class="site-header__mega-title" data-copy-id="global.mega.camera.title">Camera</span>
                      <span class="site-header__mega-desc" data-copy-id="global.mega.camera.desc">Giraffe PRO Camera is built to capture everything you need from one property capture.</span>
                    </a>
                    <a class="site-header__mega-card" href="content-studio.html">
                      <span class="site-header__mega-title" data-copy-id="global.mega.studio.title">Content Studio</span>
                      <span class="site-header__mega-desc" data-copy-id="global.mega.studio.desc">Edit, AI enhance, manage and share.</span>
                    </a>
                    <a class="site-header__mega-card" href="outputs.html">
                      <span class="site-header__mega-title" data-copy-id="global.mega.outputs.title">Content</span>
                      <span class="site-header__mega-desc" data-copy-id="global.mega.outputs.desc">HDR photos, floor plans, virtual tours, videos, websites and more.</span>
                    </a>`;

const TRY_DRAWER_OLD = `<a class="btn btn--outline btn--sm site-header__drawer-only site-header__drawer-only--try" href="login.html">Try demo</a>`;
const TRY_DRAWER_NEW = `<a class="btn btn--outline btn--sm site-header__drawer-only site-header__drawer-only--try" href="login.html" data-copy-id="global.header.tryDemo">Try demo</a>`;

const TRY_TOOLBAR_OLD = `<a class="btn btn--outline btn--sm site-header__toolbar-try" href="login.html">Try demo</a>`;
const TRY_TOOLBAR_NEW = `<a class="btn btn--outline btn--sm site-header__toolbar-try" href="login.html" data-copy-id="global.header.tryDemo">Try demo</a>`;

const FOOTER_SUB_OLD = `<p class="t-h2">Receive product news &amp; tips from Giraffe360.</p>`;
const FOOTER_SUB_NEW = `<p class="t-h2" data-copy-id="global.footer.subscribe">Receive product news &amp; tips from Giraffe360.</p>`;

const PREFOOTER_BLOCK_OLD = `<h2 id="prefooter-cta-heading" class="prefooter-cta__title t-h2">Want to explore more?</h2>
        <div class="prefooter-cta__actions">
          <a class="btn btn--solid btn--lg" href="login.html">Try demo</a>
          <a class="btn btn--outline btn--lg" href="contacts.html" data-demo-booking-open>Book call</a>
        </div>`;

const PREFOOTER_BLOCK_NEW = `<h2 id="prefooter-cta-heading" class="prefooter-cta__title t-h2" data-copy-id="global.prefooter.heading">Want to explore more?</h2>
        <div class="prefooter-cta__actions">
          <a class="btn btn--solid btn--lg" href="login.html" data-copy-id="global.prefooter.tryCta">Try demo</a>
          <a class="btn btn--outline btn--lg" href="contacts.html" data-demo-booking-open data-copy-id="global.prefooter.bookCta">Book call</a>
        </div>`;

const SCRIPT_SNIPPET = `    <script src="js/vincent-copy-data.js" defer></script>
    <script src="js/copy-variant.js" defer></script>
`;

function patchFile(filePath) {
  let s = fs.readFileSync(filePath, "utf8");
  if (!s.includes("locale-picker.js")) return false;
  let changed = false;

  if (s.includes(MEGA_OLD)) {
    s = s.split(MEGA_OLD).join(MEGA_NEW);
    changed = true;
  }
  if (s.includes(TRY_DRAWER_OLD)) {
    s = s.split(TRY_DRAWER_OLD).join(TRY_DRAWER_NEW);
    changed = true;
  }
  if (s.includes(TRY_TOOLBAR_OLD)) {
    s = s.split(TRY_TOOLBAR_OLD).join(TRY_TOOLBAR_NEW);
    changed = true;
  }
  if (s.includes(FOOTER_SUB_OLD)) {
    s = s.split(FOOTER_SUB_OLD).join(FOOTER_SUB_NEW);
    changed = true;
  }
  if (s.includes(PREFOOTER_BLOCK_OLD)) {
    s = s.split(PREFOOTER_BLOCK_OLD).join(PREFOOTER_BLOCK_NEW);
    changed = true;
  }

  const marker = '<script src="js/locale-picker.js" defer></script>';
  if (!s.includes("vincent-copy-data.js") && s.includes(marker)) {
    s = s.replace(marker, marker + "\n" + SCRIPT_SNIPPET);
    changed = true;
  }

  if (changed) fs.writeFileSync(filePath, s);
  return changed;
}

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
let n = 0;
for (const f of files) {
  if (patchFile(path.join(ROOT, f))) {
    console.log("patched", f);
    n++;
  }
}
console.log("done", n, "files");
