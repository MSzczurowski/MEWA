---
description: "Use when creating or editing MEWA ecommerce frontend pages, prototypes, HTML/CSS/JS layouts, navigation, product cards, mission/about sections, SEO-oriented content structure, and sustainable brand visuals for study project deliverables."
name: "MEWA Frontend Requirements"
applyTo: "**/*.{html,css,js,jsx,ts,tsx,md}"
---

# MEWA Frontend Requirements

- Treat these requirements as hard project constraints for MEWA frontend deliverables.
- Base all generated content on provided source materials and business context.

## Source Materials And Brand Constraints

- Use `Grafiki/MEWA-Logotyp-NoBG.png` as the primary logo in the site header (fallback: `MEWA-Logotyp-NoBG.jpg`) and keep it well scaled.
- Reflect the brand mission: upcycling Baltic ghost nets and rPET plastic into accessories.
- Emphasize circular economy and Zero Waste principles.
- Reflect local production in Poland and opposition to fast fashion.
- Highlight SDG alignment, especially SDG 14 (Life Below Water).
- Build navigation and URL structure from the provided sitemap (L1 and L2 levels).

## Visual Style Guide

- Overall style: minimalist, Scandinavian, clean lines, progressive eco aesthetic.
- Color system:
- Primary accent: `#1A8C8C` (marine turquoise).
- Background/fill: `#E5D5B0` (sand beige).
- Base: `#FFFFFF` (pure white).
- Typography: modern, bold, sans-serif that communicates stability and trust.
- Product photography direction: bright white/sand background, soft studio lighting, subtle marine motifs (net texture, waves).

## Required Views To Deliver

- Home page:
- Hero section with mission-focused headline (for example: "Z morza na plecy - poznaj sile upcyklingu").
- Short "O nas" teaser describing Baltic ghost-net problem and MEWA response.
- Featured products section showing 3 products: Junior, Urban, Kids XS.
- Full L1 navigation from sitemap.

- Category page (example: urban backpacks category):
- Product grid with names, prices in PLN, and thumbnails.
- Category headers and copy aligned with sitemap SEO phrases.

- Product detail page for MEWA Urban:
- Product image generated from provided AI prompt, or a descriptive placeholder if image generation is unavailable.
- Description must mention: Econyl from fishing nets/rPET, laptop compartment for 15 inch, PFC-free water resistance.
- Include MEWA Loop circular return information.
- Include "Dodaj do koszyka" button (no payment integration required).

- Mission/About page:
- Include origin story with seagull entangled in net.
- Explain rPET and Econyl technology.
- Show SDG symbols/graphics.

## Technical Execution Rules

- Do not use lorem ipsum; always generate meaningful marketing and technical copy from project context.
- If product images cannot be generated, use neutral gray placeholders and include exact intended visual description based on prompts.
- Output format should be working HTML/CSS/JS (single-page or multi-file) or a very detailed visual mock with interaction behavior.
- Do not implement real payment processing.
- Do not require persistent cart state across page refresh.
- Prioritize intuitive navigation, coherent IA, and visual consistency with the sustainability narrative.

## Content Quality Checks

- Ensure every major page communicates environmental impact and circularity.
- Ensure SDG 14 appears explicitly in mission-oriented sections.
- Ensure product cards and PDP copy combine emotional brand tone with concrete technical specs.
- Ensure menu labels and URL paths are consistent with the sitemap hierarchy.
