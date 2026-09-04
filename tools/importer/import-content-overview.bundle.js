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

  // tools/importer/import-content-overview.js
  var import_content_overview_exports = {};
  __export(import_content_overview_exports, {
    default: () => import_content_overview_default
  });

  // tools/importer/parsers/cards-team.js
  function parse(element, { document }) {
    const image = element.querySelector(".cmp-image img, img.cmp-image__image, img");
    const titles = Array.from(element.querySelectorAll(".cmp-title .cmp-title__text, .cmp-title__text"));
    const name = titles[0] || null;
    const role = element.querySelector(".cmp-title--black .cmp-title__text") || titles[1] || null;
    const socialAnchors = Array.from(element.querySelectorAll("a.cmp-button, .cmp-buildingblock--btn-list a[href]")).map((a) => {
      var _a;
      const href = a.getAttribute("href");
      if (!href) return null;
      const label = (((_a = a.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) || a.textContent || href).trim();
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = label;
      return link;
    }).filter(Boolean);
    if (!image && !name && !role && socialAnchors.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (name) textCell.push(name);
    if (role) textCell.push(role);
    if (socialAnchors.length) {
      const socialRow = document.createElement("p");
      socialAnchors.forEach((link, i) => {
        if (i > 0) socialRow.append(" ");
        socialRow.append(link);
      });
      textCell.push(socialRow);
    }
    const cells = [];
    cells.push([image || "", textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-team", cells });
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

  // tools/importer/import-content-overview.js
  var parsers = {
    "cards-team": parse
  };
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    name: "content-overview",
    description: "Overview/landing page combining a hero header with mixed content blocks and card sections",
    urls: [
      "https://wknd.site/us/en/about-us.html"
    ],
    blocks: [
      {
        name: "cards-team",
        instances: [".cmp-experience-fragment--contributor"]
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
  var import_content_overview_default = {
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
  return __toCommonJS(import_content_overview_exports);
})();
