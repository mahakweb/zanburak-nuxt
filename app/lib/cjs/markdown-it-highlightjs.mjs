// node_modules/markdown-it-highlightjs/src/index.ts
import hljs from "highlight.js";

// node_modules/markdown-it-highlightjs/src/core.ts
function registerLangs(hljs2, register) {
  for (const [lang, fn] of Object.entries(register)) {
    hljs2.registerLanguage(lang, fn);
  }
}
function registerLangAliases(hljs2, register) {
  for (const [lang, aliases] of Object.entries(register)) {
    hljs2.registerAliases(aliases, { languageName: lang });
  }
}
function highlight(md, hljs2, ignoreIllegals, code, lang) {
  try {
    return hljs2.highlight(code, { language: lang !== "" ? lang : "plaintext", ignoreIllegals }).value;
  } catch (e) {
    return md.utils.escapeHtml(code);
  }
}
function highlightAuto(md, hljs2, ignoreIllegals, code, lang) {
  if (lang !== "") {
    return highlight(md, hljs2, ignoreIllegals, code, lang);
  }
  try {
    return hljs2.highlightAuto(code).value;
  } catch (e) {
    return md.utils.escapeHtml(code);
  }
}
function wrapCodeRenderer(renderer) {
  return function wrappedRenderer(...args) {
    return renderer(...args).replace(/<code class="/g, '<code class="hljs ').replace(/<code>/g, '<code class="hljs">');
  };
}
function inlineCodeLanguageRule(state) {
  for (const parentToken of state.tokens) {
    if (parentToken.type !== "inline") {
      continue;
    }
    if (parentToken.children == null) {
      continue;
    }
    for (const [i, token] of parentToken.children.entries()) {
      if (token.type !== "code_inline") {
        continue;
      }
      const next = parentToken.children[i + 1];
      if (next == null) {
        continue;
      }
      const match = /^{:?\.([^}]+)}/.exec(next.content);
      if (match == null) {
        continue;
      }
      const lang = match[1];
      next.content = next.content.slice(match[0].length);
      let className = token.attrGet("class") ?? "";
      className += `${state.md.options.langPrefix ?? "language-"}${lang}`;
      token.attrSet("class", className);
      token.meta = { ...token.meta, highlightLanguage: lang };
    }
  }
}
function inlineCodeRenderer(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  if (options.highlight == null) {
    throw new Error("`options.highlight` was null, this is not supposed to happen");
  }
  const highlighted = options.highlight(token.content, token.meta?.highlightLanguage ?? "", "");
  return `<code${slf.renderAttrs(token)}>${highlighted}</code>`;
}
function core(md, opts) {
  const optsWithDefaults = { ...core.defaults, ...opts };
  if (optsWithDefaults.hljs == null) {
    throw new Error("Please pass a highlight.js instance for the required `hljs` option.");
  }
  if (optsWithDefaults.register != null) {
    registerLangs(optsWithDefaults.hljs, optsWithDefaults.register);
  }
  if (optsWithDefaults.registerAliases != null) {
    registerLangAliases(optsWithDefaults.hljs, optsWithDefaults.registerAliases);
  }
  md.options.highlight = (optsWithDefaults.auto ? highlightAuto : highlight).bind(null, md, optsWithDefaults.hljs, optsWithDefaults.ignoreIllegals);
  if (md.renderer.rules.fence != null) {
    md.renderer.rules.fence = wrapCodeRenderer(md.renderer.rules.fence);
  }
  if (optsWithDefaults.code && md.renderer.rules.code_block != null) {
    md.renderer.rules.code_block = wrapCodeRenderer(md.renderer.rules.code_block);
  }
  if (optsWithDefaults.inline) {
    md.core.ruler.before("linkify", "inline_code_language", inlineCodeLanguageRule);
    md.renderer.rules.code_inline = wrapCodeRenderer(inlineCodeRenderer);
  }
}
core.defaults = {
  auto: false,
  code: false,
  inline: false,
  ignoreIllegals: false
};

// node_modules/markdown-it-highlightjs/src/index.ts
function highlightjs(md, opts) {
  opts = { ...highlightjs.defaults, ...opts };
  if (opts.hljs == null) {
    opts.hljs = hljs;
  }
  return core(md, opts);
}
highlightjs.defaults = {
  auto: true,
  code: true,
  inline: false,
  ignoreIllegals: true
};
export {
  highlightjs as default
};
