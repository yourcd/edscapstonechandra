/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-locale-landing.js
  var import_locale_landing_exports = {};
  __export(import_locale_landing_exports, {
    default: () => import_locale_landing_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-carousel__item");
    items.forEach((item) => {
      const image = item.querySelector(".cmp-teaser__image img, img.cmp-image__image, img");
      const contentCell = [];
      const title = item.querySelector("h1, h2, h3, .cmp-teaser__title");
      const description = item.querySelector(".cmp-teaser__description, p");
      const cta = item.querySelector("a.cmp-teaser__action-link, .cmp-teaser__action-container a, a");
      if (title) contentCell.push(title);
      if (description) contentCell.push(description);
      if (cta) contentCell.push(cta);
      if (!image && contentCell.length === 0) return;
      cells.push([image || "", contentCell.length ? contentCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document }) {
    const textCell = [];
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const title = element.querySelector("h1, h2, h3, .cmp-teaser__title");
    const description = element.querySelector(".cmp-teaser__description");
    const cta = element.querySelector("a.cmp-teaser__action-link, .cmp-teaser__action-container a");
    if (pretitle) textCell.push(pretitle);
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (cta) textCell.push(cta);
    const image = element.querySelector(".cmp-teaser__image img, img.cmp-image__image, img");
    if (textCell.length === 0 && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell.length ? textCell : "", image || ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse3(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll("li.cmp-image-list__item, .cmp-image-list__item");
    items.forEach((item) => {
      const image = item.querySelector(".cmp-image-list__item-image img, img.cmp-image__image, img");
      const contentCell = [];
      const titleLink = item.querySelector("a.cmp-image-list__item-title-link");
      const titleText = item.querySelector(".cmp-image-list__item-title");
      if (titleLink && titleText) {
        const heading = document.createElement("h3");
        const link = document.createElement("a");
        link.href = titleLink.getAttribute("href") || "";
        link.textContent = titleText.textContent.trim();
        heading.append(link);
        contentCell.push(heading);
      } else if (titleText) {
        const heading = document.createElement("h3");
        heading.textContent = titleText.textContent.trim();
        contentCell.push(heading);
      }
      const description = item.querySelector(".cmp-image-list__item-description, p");
      if (description) contentCell.push(description);
      if (!image && contentCell.length === 0) return;
      cells.push([image || "", contentCell.length ? contentCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-teaser.js
  function parse4(element, { document }) {
    const cells = [];
    const image = element.querySelector(".cmp-teaser__image img, img.cmp-image__image, img");
    const contentCell = [];
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const title = element.querySelector("h1, h2, h3, .cmp-teaser__title");
    const description = element.querySelector(".cmp-teaser__description");
    const cta = element.querySelector("a.cmp-teaser__action-link, .cmp-teaser__action-container a");
    if (pretitle) contentCell.push(pretitle);
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    if (!image && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (image) cells.push([image]);
    cells.push([contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "footer.cmp-experiencefragment--footer",
        "#destination_publishing_iframe_wkndsite_0",
        "#toggleNav",
        "#mobileNav",
        "iframe",
        "noscript",
        "link",
        "meta"
      ]);
    }
  }

  // tools/importer/import-locale-landing.js
  var parsers = {
    "carousel-hero": parse,
    "columns-featured": parse2,
    "cards-articles": parse3,
    "hero-teaser": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "locale-landing",
    description: "Locale home/landing page with full-width hero, intro copy, and teaser card grid linking into the site",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      {
        name: "section-rc3",
        instances: [
          "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.cmp-layout-container--fixed.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.teaser.cmp-teaser--featured.aem-GridColumn.aem-GridColumn--default--12"
        ],
        section: "highlight"
      },
      {
        name: "carousel-hero",
        instances: [
          "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.carousel.panelcontainer.cmp-carousel--hero.aem-GridColumn.aem-GridColumn--default--12"
        ]
      },
      {
        name: "columns-featured",
        instances: [
          "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.cmp-layout-container--fixed.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.teaser.cmp-teaser--featured.aem-GridColumn.aem-GridColumn--default--12"
        ]
      },
      {
        name: "cards-articles",
        instances: [
          "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.cmp-layout-container--fixed.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.image-list.list.aem-GridColumn.aem-GridColumn--default--12",
          "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.cmp-layout-container--fixed.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.image-list.list.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(2)"
        ]
      },
      {
        name: "hero-teaser",
        instances: [
          "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > main.container.responsivegrid.cmp-layout-container--fixed.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.teaser.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_locale_landing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_locale_landing_exports);
})();
