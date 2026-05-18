/**
 * Generates js/vincent-copy-data.js from structured copy (wireframe deck).
 * Run: node scripts/build-vincent-copy-data.cjs
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "js", "vincent-copy-data.js");

const C = {
  "global.mega.overview.title": "Product overview",
  "global.mega.overview.desc": "Capture, create, and share listing marketing in one workflow.",
  "global.mega.camera.title": "Camera",
  "global.mega.camera.desc":
    "Real estate camera built to capture everything from one property scan.",
  "global.mega.studio.title": "Content Studio",
  "global.mega.studio.desc": "Edit, AI enhance, manage and share.",
  "global.mega.outputs.title": "Listing marketing assets",
  "global.mega.outputs.desc": "Photos, floor plans, virtual tours, videos, websites and more.",
  "global.header.tryDemo": "Try a free demo account",
  "global.footer.subscribe": "Receive product news & tips from Giraffe360.",
  "global.prefooter.heading": "Want to explore more?",
  "global.prefooter.tryCta": "Try a free demo account",
  "global.prefooter.bookCta": "Book a guided demo",

  "index.hero.h1": "Create complete real estate marketing content from one capture.",
  "index.hero.lede":
    "Capture a property once and get the HDR photos, floor plans, virtual tours, videos, and listing content you need to market it everywhere.",
  "index.hero.ctaPrimary": { text: "Try a free demo account", href: "login.html" },
  "index.hero.ctaSecondary": { text: "See sample outputs", href: "outputs.html" },
  "index.hero.price": "Get everything for $360 / month",
  "index.companies.heading":
    "Trusted by real estate teams around the world. Join over 10,000 real estate professionals.",
  "index.service.hdr": "HDR photos",
  "index.service.fp": "Floor plans",
  "index.service.vt": "Virtual tours",
  "index.service.vid": "Listing videos",
  "index.service.pw": "Property website",
  "index.service.mkt": "Marketing assets",
  "index.eco.camera.title": "Giraffe PRO Camera",
  "index.eco.camera.lede":
    "Capture every property with a guided camera workflow built for consistent, high-quality real estate content.",
  "index.eco.studio.title": "Content Studio",
  "index.eco.studio.lede":
    "Turn captured property assets into polished, listing-ready marketing content for every channel, with support from AI-powered tools.",

  "product.hero.h1": "One connected workflow for real estate marketing.",
  "product.hero.lede":
    "Turn one property capture into HDR photos, HDR virtual tours, floor plans, videos, property websites, and marketing assets.",
  "product.process.scan": "Scan",
  "product.process.scan.desc":
    "Use guided camera capture to collect the visual data needed for every key listing asset.",
  "product.process.edit": "Edit & enhance",
  "product.process.edit.desc":
    "Every asset is edited and polished before delivery. With AI tools available for changes that go beyond standard editing.",
  "product.process.share": "Share",
  "product.process.share.desc":
    "Publish complete property content across portals, websites, social media, and client channels.",
  "product.showcase.camera.title": "Giraffe PRO Camera",
  "product.showcase.camera.d1":
    "Designed specifically to make real estate capture simple, consistent, and connected to the rest of your content workflow.",
  "product.showcase.camera.d2":
    "Capture the property once and give yourself the foundation for professional photos, floor plans, virtual tours, videos, and listing-ready marketing content.",
  "product.showcase.studio.title": "Content Studio",
  "product.showcase.studio.d1":
    "Within hours, the property capture is automatically turned into polished, listing-ready assets.",
  "product.showcase.studio.d2":
    "Editors and AI-powered tools give you extra control when you want to enhance, adjust, remove, or create more from your property content.",
  "product.showcase.outputs.title": "Listing marketing assets",
  "product.showcase.outputs.d1":
    "Share HDR photos, HDR virtual tours, appraiser-ready floor plans, 3D floor plans with sun-pathing, cinematic videos, property websites, social media campaigns, and listing content from a single property scan.",
  "product.showcase.outputs.d2":
    "Each output is built to help launch listings faster, present properties clearly, and promote them across every key channel.",

  "product.faq.1.q": "What is Giraffe360?",
  "product.faq.1.a":
    "Giraffe360 is a connected real estate marketing workflow that helps property professionals capture a property, create listing-ready assets, and share content across the channels that matter. From one property capture, teams can create photos, floor plans, virtual tours, videos, property websites, and marketing content.",
  "product.faq.2.q": "What is included in the Giraffe360 subscription?",
  "product.faq.2.a":
    "The $360/month subscription includes access to the Giraffe360 platform, core property capture workflow, all outputs, cloud processing, unlimited hosting, ongoing software improvements, and support. It also includes the Giraffe360 camera hardware and tripod (and bag). Each month you receive an ample amount of free AI tokens; the only additional cost comes from using up additional AI enhancement tokens.",
  "product.faq.3.q": "What can I create with Giraffe360?",
  "product.faq.3.a":
    "You can create a complete property content set, including professional photos, virtual tours, industry-standard floor plans, interactive 3D floor plans, cinematic videos, property websites, and AI-assisted marketing assets. Each asset is automatically available after capture is completed, pre-edited and optimized according to your image profile.",
  "product.faq.4.q": "How does the Giraffe360 workflow work?",
  "product.faq.4.a":
    "The workflow starts with a guided property scan using a Giraffe360 camera. From there, captured data is processed into polished, listing-ready assets. You can then review, refine, enhance, and share your content across portals, websites, social media, client presentations, and other marketing channels.",
  "product.faq.5.q": "Is there ongoing support?",
  "product.faq.5.a":
    "Yes. As part of your subscription, you'll receive training and ongoing support with our Customer Success team. You'll also have access to live chat in your dashboard and a library of how-to guides. Our online reviews are a testament to the quality of our support teams!",
  "product.faq.6.q": "Who is Giraffe360 for?",
  "product.faq.6.a":
    "Giraffe360 is built for real estate professionals who need a faster, more repeatable way to create property marketing content. It is especially suited to real estate media providers, photographers, agencies, brokerages, and teams that want to deliver more than photos alone.",
  "product.faq.7.q": "How is Giraffe360 different from other real estate media platforms?",
  "product.faq.7.a":
    "Many real estate media tools focus on one output, such as a virtual tour, floor plan, or photo editing workflow. Giraffe360 connects capture, editing, asset creation, and marketing outputs in one workflow, so you can create multiple listing assets from the same property capture.",
  "product.faq.8.q": "How long does a typical property capture take?",
  "product.faq.8.a":
    "Capture time depends on property size, layout, and the outputs you want to create. A typical residential property can be captured in minutes for standard photos, while virtual tours, floor plans, and video outputs require more scan coverage and take longer. The Giraffe360 camera hardware allows for multiple workflows, based around your needs.",
  "product.faq.9.q": "How long does it take to capture and receive assets?",
  "product.faq.9.a":
    "Capture and delivery times depend on property size, layout complexity, selected outputs, scan density, upload speed, and processing demand. Photos are usually available first, while more complex assets such as floor plans, virtual tours, and videos can take longer to process. Regardless, you'll always receive the full listing media kit within hours.",
  "product.faq.10.q": "What is real capture data and what is AI-generated?",
  "product.faq.10.a":
    "Core property structure, such as spatial data, tours, floor plans, and measurements, is based on real capture data. AI tools are used to enhance, adapt, or create additional content, such as image enhancements (blue skies, golden hour, green grass, etc), object removal, virtual staging, and marketing materials. AI-generated or AI-enhanced content should be reviewed before use in listings.",
  "product.faq.11.q": "How accurate are floor plans and measurements?",
  "product.faq.11.a":
    "Giraffe360 floor plans and measurements are generated from captured property data and are designed for real estate marketing use. Accuracy depends on capture technique, property layout, and project complexity. Floor plan outputs are in accordance with local standards (ANSI, RMS, IPMS, etc).",
  "product.faq.12.q": "Is Giraffe360 designed to replace photographers?",
  "product.faq.12.a":
    "No. Giraffe360 helps remove repetitive production work, but strong results still depend on good capture technique, presentation choices, quality control, and client service. Media professionals remain responsible for how the property is captured, reviewed, packaged, and delivered.",

  "camera.hero.h1": "Giraffe PRO Camera",
  "camera.hero.lede":
    "Capture the data needed to create photos, floor plans, virtual tours, videos, and more from one guided property scan.",
  "camera.block1.title": "Capture properties with speed, consistency, and repeatable results across every listing.",
  "camera.block1.d1":
    "The Giraffe PRO Camera helps media providers capture properties efficiently, reduce on-site guesswork, and create the foundation for higher-value listing media packages. Built for real estate media workflows.",
  "camera.block2.title": "One scan. A complete media package.",
  "camera.block2.d1":
    "Capture the property once and create the data needed for photos, floor plans, virtual tours, videos, and advanced immersive outputs. Every capture connects directly to Content Studio, where property data becomes polished listing marketing assets.",
  "camera.tripod.title": "Auto-height tripod.",
  "camera.tripod.d1":
    "The motorized auto-height tripod supports repeatable camera positioning and unlocks double-scan mode for richer scans and higher-quality media outputs.",
  "camera.tripod.d2":
    "Use double-scan mode for standout spaces and advanced outputs, while keeping standard capture simple for the rest of the property.",

  "content.hero.h1": "Content Studio",
  "content.hero.lede":
    "Receive polished property assets by default, then use editors and AI tools to refine, enhance, remove, stage, and create more when needed.",
  "content.block1.title": "One workspace for every output.",
  "content.block1.d1":
    "Every Giraffe360 capture is turned into edited, listing-ready assets and delivered into one workspace, so you can manage the full content set without switching tools. Your property content arrives edited, polished, and ready to use, with every output organized in one workspace for easy review, editing, and delivery.",
  "content.ai.title": "Go beyond standard edits with AI",
  "content.share.title": "Create and share more property content",

  "outputs.hero.h1": "Listing marketing assets",
  "outputs.hero.lede":
    "Create real estate photos, floor plans, virtual tours, property videos, websites, social media assets, and listing marketing content from a single property capture.",

  "contacts.card1.title": "Book a guided demo",
  "contacts.card1.body":
    "See how Giraffe360 works in practice. Our team will walk you through the camera, Content Studio, available outputs, and how the workflow can fit your business.",
  "contacts.card1.cta": "Book a guided demo",
  "contacts.card2.title": "Contact customer support",
  "contacts.card2.body":
    "Need help with your account, camera, uploads, outputs, or Content Studio? Our support team is here to help you get back on track.",
  "contacts.card2.cta": "Contact customer support",

  "newsroom.intro":
    "Follow what we're building, launching, and learning at Giraffe360.",
  "newsroom.filter.beta": "Beta",

  "login.title": "Try a free demo account",
  "login.lede":
    "Get access to Content Studio and explore all tools, editors, AI features, and property outputs available inside the Giraffe360 workflow.",

  "order.bundle.label": "Giraffe PRO Camera + Content Studio",
  "order.promise1": "60-day money back guarantee",
  "order.promise2": "Free shipping & returns",
  "order.price.monthly": "$360 / month",
  "order.price.annual": "$3960 / year",

  "about.lede1":
    "Giraffe360 helps property professionals capture, create, and share complete listing content through one connected workflow.",

  "ind.photo.hero.h1": "Deliver complete listing media packages from one property capture.",
  "ind.photo.hero.lede":
    "Giraffe360 helps real estate photographers and media providers create photos, floor plans, virtual tours, videos, property websites, and marketing assets from a single property visit.",
  "ind.agent.hero.h1": "Create the content every listing needs to stand out.",
  "ind.agent.hero.lede":
    "Giraffe360 helps real estate agents launch listings with professional photos, floor plans, virtual tours, videos, property websites, and marketing assets created from one connected workflow.",
  "ind.broker.hero.h1": "Scale listing content across your team.",
  "ind.broker.hero.lede":
    "Giraffe360 helps brokerages create consistent and branded property photos, floor plans, virtual tours, videos, property websites, and marketing assets through one connected workflow.",

  "out.photos.title": "Real estate photos",
  "out.photos.lede":
    "HDR real estate photos are created from the same Giraffe360 capture used for floor plans, virtual tours, videos, and marketing assets, helping every listing stay visually consistent. Photos are edited and polished according to your preferred profile, with AI tools available for object removal, sky replacement, image clean-up, and other refinements when needed.",
  "out.floor.title": "Floor plans",
  "out.floor.lede":
    "Clear, listing-ready floor plans from the same property capture used for your photos, virtual tours, videos, and marketing assets. Created from real scan data, prepared according to your local measurement standards such as ANSI, RMS, and IPMS. Outputs include clear 2D layouts, interactive 3D floor plans, sun pathing options, and virtually staged floor plans that help buyers understand layout, flow, scale, and room purpose.",
  "out.vt.title": "Virtual tours",
  "out.vt.lede":
    "HDR virtual tours that look polished, feel interactive, and are easy to share across every listing channel. Each tour is created from the same property capture as the rest of your listing media, helping properties look polished and consistent across websites, listing pages, emails, social media, and direct client communication.",
  "out.vid.title": "Real estate videos",
  "out.vid.lede":
    "Receive property videos from the same capture used for your photos, floor plans, virtual tours, and marketing assets, with formats designed for listing pages, social media, and premium property presentation. Capture multiple videos at the same time, including virtual drone videos, short-form social videos, and polished property tour videos. Video outputs help show the property's key spaces, atmosphere, and flow without requiring a separate video shoot.",
  "out.mkt.title": "Real estate marketing campaigns",
  "out.mkt.lede":
    "Turn your property capture into ready-to-use marketing assets for social media, email, print, client updates, and off-portal listing promotion. One property capture can be repurposed into multiple marketing materials for different channels, helping you promote listings beyond the portal without starting from scratch.",
  "out.site.title": "Property website",
  "out.site.lede":
    "Create a dedicated property website from the same capture used for your photos, floor plans, virtual tours, videos, and marketing assets. Bring photos, floor plans, virtual tours, videos, property details, contact information, and lead capture together in one dedicated listing page. Each website is hosted at no extra cost, includes a visitor enquiry form, and is easy to share.",
};

const body = `(function () {
  window.GIRAFFE360_VINCENT_COPY = ${JSON.stringify(C, null, 2)};
})();

`;

fs.writeFileSync(OUT, body, "utf8");
console.log("Wrote", OUT, "keys", Object.keys(C).length);
