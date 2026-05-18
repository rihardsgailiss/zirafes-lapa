/**
 * Fix mega menu data-copy-id on pages where mega-card anchors include aria-current.
 * Run: node scripts/batch-vincent-mega-fix.cjs
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const REPLACEMENTS = [
  [
    '<span class="site-header__mega-title">Overview</span>',
    '<span class="site-header__mega-title" data-copy-id="global.mega.overview.title">Overview</span>',
  ],
  [
    '<span class="site-header__mega-desc">Capture, edit, enhance and share in one platform</span>',
    '<span class="site-header__mega-desc" data-copy-id="global.mega.overview.desc">Capture, edit, enhance and share in one platform</span>',
  ],
  [
    '<span class="site-header__mega-title">Camera</span>',
    '<span class="site-header__mega-title" data-copy-id="global.mega.camera.title">Camera</span>',
  ],
  [
    '<span class="site-header__mega-desc">Giraffe PRO Camera is built to capture everything you need from one property capture.</span>',
    '<span class="site-header__mega-desc" data-copy-id="global.mega.camera.desc">Giraffe PRO Camera is built to capture everything you need from one property capture.</span>',
  ],
  [
    '<span class="site-header__mega-title">Content Studio</span>',
    '<span class="site-header__mega-title" data-copy-id="global.mega.studio.title">Content Studio</span>',
  ],
  [
    '<span class="site-header__mega-desc">Edit, AI enhance, manage and share.</span>',
    '<span class="site-header__mega-desc" data-copy-id="global.mega.studio.desc">Edit, AI enhance, manage and share.</span>',
  ],
  [
    '<span class="site-header__mega-title">Content</span>',
    '<span class="site-header__mega-title" data-copy-id="global.mega.outputs.title">Content</span>',
  ],
  [
    '<span class="site-header__mega-desc">HDR photos, floor plans, virtual tours, videos, websites and more.</span>',
    '<span class="site-header__mega-desc" data-copy-id="global.mega.outputs.desc">HDR photos, floor plans, virtual tours, videos, websites and more.</span>',
  ],
];

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
let n = 0;
for (const f of files) {
  const fp = path.join(ROOT, f);
  let s = fs.readFileSync(fp, "utf8");
  if (!s.includes("site-header__mega-inner")) continue;
  let orig = s;
  for (const [a, b] of REPLACEMENTS) {
    if (s.includes(a)) s = s.split(a).join(b);
  }
  if (s !== orig) {
    fs.writeFileSync(fp, s);
    console.log("mega-fix", f);
    n++;
  }
}
console.log("done", n);
