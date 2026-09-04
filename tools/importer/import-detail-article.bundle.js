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

  // tools/importer/import-detail-article.js
  var import_detail_article_exports = {};
  __export(import_detail_article_exports, {
    default: () => import_detail_article_default
  });

  // tools/importer/parsers/carousel-lead.js
  function parse(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-carousel__item");
    items.forEach((item) => {
      const image = item.querySelector(".cmp-image img, img.cmp-image__image, img");
      const contentCell = [];
      const title = item.querySelector("h1, h2, h3, .cmp-title__text, .cmp-teaser__title");
      const description = item.querySelector(".cmp-teaser__description, .cmp-text p, p");
      const cta = item.querySelector("a.cmp-teaser__action-link, .cmp-teaser__action-container a, .cmp-button a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-lead", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-specs.js
  function parse2(element, { document }) {
    const cells = [];
    const title = element.querySelector(".cmp-contentfragment__title, h1, h2, h3");
    if (title) cells.push([title, ""]);
    const specs = element.querySelectorAll(".cmp-contentfragment__element, dl > div");
    specs.forEach((spec) => {
      const label = spec.querySelector(".cmp-contentfragment__element-title, dt");
      const value = spec.querySelector(".cmp-contentfragment__element-value, dd");
      if (!label && !value) return;
      if (value) value.textContent = value.textContent.trim();
      cells.push([label || "", value || ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-specs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-detail.js
  function parse3(element, { document }) {
    const cells = [];
    const tabsRoot = element.querySelector(".cmp-tabs") || element;
    const labels = tabsRoot.querySelectorAll(".cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li");
    const panels = tabsRoot.querySelectorAll(".cmp-tabs__tabpanel");
    panels.forEach((panel, idx) => {
      const labelEl = labels[idx];
      let label = "";
      if (labelEl && labelEl.textContent.trim()) {
        label = labelEl.textContent.trim();
      }
      const content = panel.querySelector(".cmp-contentfragment, article, .contentfragment") || panel;
      if (!label && !content) return;
      cells.push([label || `Tab ${idx + 1}`, content]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-detail", cells });
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

  // tools/importer/import-detail-article.js
  var parsers = {
    "carousel-lead": parse,
    "columns-specs": parse2,
    "tabs-detail": parse3
  };
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    name: "detail-article",
    description: "Single-item detail page with title banner, large lead image, and long-form body copy sections",
    urls: [
      "https://wknd.site/us/en/adventures/bali-surf-camp.html"
    ],
    blocks: [
      {
        name: "carousel-lead",
        instances: ["div.carousel.panelcontainer.cmp-carousel--mini"]
      },
      {
        name: "columns-specs",
        instances: ["div.contentfragment.cmp-contentfragment--elements"]
      },
      {
        name: "tabs-detail",
        instances: ["div.tabs.aem-GridColumn", ".cmp-tabs"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
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
        if (elements.length === 0) console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        elements.forEach((element) => pageBlocks.push({ name: blockDef.name, selector, element }));
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_detail_article_default = {
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
  return __toCommonJS(import_detail_article_exports);
})();
