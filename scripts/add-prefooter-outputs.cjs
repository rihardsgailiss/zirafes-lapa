const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const PRE = `    <section class="prefooter-cta" aria-labelledby="prefooter-cta-heading-output">
      <div class="prefooter-cta__inner wrap">
        <h2 id="prefooter-cta-heading-output" class="prefooter-cta__title t-h2" data-copy-id="global.prefooter.heading">Want to explore more?</h2>
        <div class="prefooter-cta__actions">
          <a class="btn btn--solid btn--lg" href="login.html" data-copy-id="global.prefooter.tryCta">Try demo</a>
          <a class="btn btn--outline btn--lg" href="contacts.html" data-demo-booking-open data-copy-id="global.prefooter.bookCta">Book call</a>
        </div>
      </div>
    </section>

`;

const files = [
  "output-photos.html",
  "output-floor-plans.html",
  "output-virtual-tours.html",
  "output-videos.html",
  "output-marketing.html",
  "output-property-website.html",
];

const demoScript = `    <script src="js/demo-booking.js" defer></script>
`;

for (const f of files) {
  const fp = path.join(ROOT, f);
  let s = fs.readFileSync(fp, "utf8");
  if (s.includes("prefooter-cta")) continue;
  if (!s.includes('<footer class="site-footer">')) continue;
  s = s.replace('<footer class="site-footer">', PRE + "    <footer class=\"site-footer\">");
  if (!s.includes("demo-booking.js") && s.includes("copy-variant.js")) {
    s = s.replace(
      "<script src=\"js/copy-variant.js\" defer></script>",
      "<script src=\"js/copy-variant.js\" defer></script>\n" + demoScript
    );
  }
  fs.writeFileSync(fp, s);
  console.log("prefooter", f);
}
