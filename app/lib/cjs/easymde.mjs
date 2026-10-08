var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/easymde/dist/easymde.min.js
var require_easymde_min = __commonJS({
  "node_modules/easymde/dist/easymde.min.js"(exports, module) {
    !(function(e) {
      if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
      else if ("function" == typeof define && define.amd) define([], e);
      else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).EasyMDE = e();
      }
    })((function() {
      return (function e(t, n, i) {
        function r(a2, l) {
          if (!n[a2]) {
            if (!t[a2]) {
              var s = "function" == typeof __require && __require;
              if (!l && s) return s(a2, true);
              if (o) return o(a2, true);
              var u = new Error("Cannot find module '" + a2 + "'");
              throw u.code = "MODULE_NOT_FOUND", u;
            }
            var c = n[a2] = { exports: {} };
            t[a2][0].call(c.exports, (function(e2) {
              return r(t[a2][1][e2] || e2);
            }), c, c.exports, e, t, n, i);
          }
          return n[a2].exports;
        }
        for (var o = "function" == typeof __require && __require, a = 0; a < i.length; a++) r(i[a]);
        return r;
      })({ 1: [function(e, t, n) {
      }, {}], 2: [function(e, t, n) {
        "use strict";
        var i = e("typo-js");
        function r(e2) {
          "function" == typeof (e2 = e2 || {}).codeMirrorInstance && "function" == typeof e2.codeMirrorInstance.defineMode ? (String.prototype.includes || (String.prototype.includes = function() {
            return -1 !== String.prototype.indexOf.apply(this, arguments);
          }), e2.codeMirrorInstance.defineMode("spell-checker", (function(t2) {
            if (!r.aff_loading) {
              r.aff_loading = true;
              var n2 = new XMLHttpRequest();
              n2.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff", true), n2.onload = function() {
                4 === n2.readyState && 200 === n2.status && (r.aff_data = n2.responseText, r.num_loaded++, 2 == r.num_loaded && (r.typo = new i("en_US", r.aff_data, r.dic_data, { platform: "any" })));
              }, n2.send(null);
            }
            if (!r.dic_loading) {
              r.dic_loading = true;
              var o = new XMLHttpRequest();
              o.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic", true), o.onload = function() {
                4 === o.readyState && 200 === o.status && (r.dic_data = o.responseText, r.num_loaded++, 2 == r.num_loaded && (r.typo = new i("en_US", r.aff_data, r.dic_data, { platform: "any" })));
              }, o.send(null);
            }
            var a = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ ', l = { token: function(e3) {
              var t3 = e3.peek(), n3 = "";
              if (a.includes(t3)) return e3.next(), null;
              for (; null != (t3 = e3.peek()) && !a.includes(t3); ) n3 += t3, e3.next();
              return r.typo && !r.typo.check(n3) ? "spell-error" : null;
            } }, s = e2.codeMirrorInstance.getMode(t2, t2.backdrop || "text/plain");
            return e2.codeMirrorInstance.overlayMode(s, l, true);
          }))) : console.log("CodeMirror Spell Checker: You must provide an instance of CodeMirror via the option `codeMirrorInstance`");
        }
        r.num_loaded = 0, r.aff_loading = false, r.dic_loading = false, r.aff_data = "", r.dic_data = "", r.typo, t.exports = r;
      }, { "typo-js": 16 }], 3: [function(e, t, n) {
        (function(e2) {
          "use strict";
          function t2(t3, n2) {
            clearTimeout(n2.timeout), e2.off(window, "mouseup", n2.hurry), e2.off(window, "keyup", n2.hurry);
          }
          e2.defineOption("autoRefresh", false, (function(n2, i) {
            n2.state.autoRefresh && (t2(0, n2.state.autoRefresh), n2.state.autoRefresh = null), i && 0 == n2.display.wrapper.offsetHeight && (function(n3, i2) {
              function r() {
                n3.display.wrapper.offsetHeight ? (t2(0, i2), n3.display.lastWrapHeight != n3.display.wrapper.clientHeight && n3.refresh()) : i2.timeout = setTimeout(r, i2.delay);
              }
              i2.timeout = setTimeout(r, i2.delay), i2.hurry = function() {
                clearTimeout(i2.timeout), i2.timeout = setTimeout(r, 50);
              }, e2.on(window, "mouseup", i2.hurry), e2.on(window, "keyup", i2.hurry);
            })(n2, n2.state.autoRefresh = { delay: i.delay || 250 });
          }));
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 4: [function(e, t, n) {
        (function(e2) {
          "use strict";
          e2.defineOption("fullScreen", false, (function(t2, n2, i) {
            i == e2.Init && (i = false), !i != !n2 && (n2 ? (function(e3) {
              var t3 = e3.getWrapperElement();
              e3.state.fullScreenRestore = { scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset, width: t3.style.width, height: t3.style.height }, t3.style.width = "", t3.style.height = "auto", t3.className += " CodeMirror-fullscreen", document.documentElement.style.overflow = "hidden", e3.refresh();
            })(t2) : (function(e3) {
              var t3 = e3.getWrapperElement();
              t3.className = t3.className.replace(/\s*CodeMirror-fullscreen\b/, ""), document.documentElement.style.overflow = "";
              var n3 = e3.state.fullScreenRestore;
              t3.style.width = n3.width, t3.style.height = n3.height, window.scrollTo(n3.scrollLeft, n3.scrollTop), e3.refresh();
            })(t2));
          }));
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 5: [function(e, t, n) {
        (function(e2) {
          function t2(e3) {
            e3.state.placeholder && (e3.state.placeholder.parentNode.removeChild(e3.state.placeholder), e3.state.placeholder = null);
          }
          function n2(e3) {
            t2(e3);
            var n3 = e3.state.placeholder = document.createElement("pre");
            n3.style.cssText = "height: 0; overflow: visible", n3.style.direction = e3.getOption("direction"), n3.className = "CodeMirror-placeholder CodeMirror-line-like";
            var i2 = e3.getOption("placeholder");
            "string" == typeof i2 && (i2 = document.createTextNode(i2)), n3.appendChild(i2), e3.display.lineSpace.insertBefore(n3, e3.display.lineSpace.firstChild);
          }
          function i(e3) {
            o(e3) && n2(e3);
          }
          function r(e3) {
            var i2 = e3.getWrapperElement(), r2 = o(e3);
            i2.className = i2.className.replace(" CodeMirror-empty", "") + (r2 ? " CodeMirror-empty" : ""), r2 ? n2(e3) : t2(e3);
          }
          function o(e3) {
            return 1 === e3.lineCount() && "" === e3.getLine(0);
          }
          e2.defineOption("placeholder", "", (function(o2, a, l) {
            var s = l && l != e2.Init;
            if (a && !s) o2.on("blur", i), o2.on("change", r), o2.on("swapDoc", r), e2.on(o2.getInputField(), "compositionupdate", o2.state.placeholderCompose = function() {
              !(function(e3) {
                setTimeout((function() {
                  var i2 = false;
                  if (1 == e3.lineCount()) {
                    var r2 = e3.getInputField();
                    i2 = "TEXTAREA" == r2.nodeName ? !e3.getLine(0).length : !/[^\u200b]/.test(r2.querySelector(".CodeMirror-line").textContent);
                  }
                  i2 ? n2(e3) : t2(e3);
                }), 20);
              })(o2);
            }), r(o2);
            else if (!a && s) {
              o2.off("blur", i), o2.off("change", r), o2.off("swapDoc", r), e2.off(o2.getInputField(), "compositionupdate", o2.state.placeholderCompose), t2(o2);
              var u = o2.getWrapperElement();
              u.className = u.className.replace(" CodeMirror-empty", "");
            }
            a && !o2.hasFocus() && i(o2);
          }));
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 6: [function(e, t, n) {
        (function(e2) {
          "use strict";
          var t2 = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/, n2 = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/, i = /[*+-]\s/;
          function r(e3, n3) {
            var i2 = n3.line, r2 = 0, o = 0, a = t2.exec(e3.getLine(i2)), l = a[1];
            do {
              var s = i2 + (r2 += 1), u = e3.getLine(s), c = t2.exec(u);
              if (c) {
                var d = c[1], h = parseInt(a[3], 10) + r2 - o, f = parseInt(c[3], 10), p = f;
                if (l !== d || isNaN(f)) {
                  if (l.length > d.length) return;
                  if (l.length < d.length && 1 === r2) return;
                  o += 1;
                } else h === f && (p = f + 1), h > f && (p = h + 1), e3.replaceRange(u.replace(t2, d + p + c[4] + c[5]), { line: s, ch: 0 }, { line: s, ch: u.length });
              }
            } while (c);
          }
          e2.commands.newlineAndIndentContinueMarkdownList = function(o) {
            if (o.getOption("disableInput")) return e2.Pass;
            for (var a = o.listSelections(), l = [], s = 0; s < a.length; s++) {
              var u = a[s].head, c = o.getStateAfter(u.line), d = e2.innerMode(o.getMode(), c);
              if ("markdown" !== d.mode.name && "markdown" !== d.mode.helperType) return void o.execCommand("newlineAndIndent");
              var h = false !== (c = d.state).list, f = 0 !== c.quote, p = o.getLine(u.line), m = t2.exec(p), g = /^\s*$/.test(p.slice(0, u.ch));
              if (!a[s].empty() || !h && !f || !m || g) return void o.execCommand("newlineAndIndent");
              if (n2.test(p)) {
                var v = f && />\s*$/.test(p), x = !/>\s*$/.test(p);
                (v || x) && o.replaceRange("", { line: u.line, ch: 0 }, { line: u.line, ch: u.ch + 1 }), l[s] = "\n";
              } else {
                var y = m[1], b = m[5], D = !(i.test(m[2]) || m[2].indexOf(">") >= 0), C = D ? parseInt(m[3], 10) + 1 + m[4] : m[2].replace("x", " ");
                l[s] = "\n" + y + C + b, D && r(o, u);
              }
            }
            o.replaceSelections(l);
          };
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 7: [function(e, t, n) {
        (function(e2) {
          "use strict";
          e2.overlayMode = function(t2, n2, i) {
            return { startState: function() {
              return { base: e2.startState(t2), overlay: e2.startState(n2), basePos: 0, baseCur: null, overlayPos: 0, overlayCur: null, streamSeen: null };
            }, copyState: function(i2) {
              return { base: e2.copyState(t2, i2.base), overlay: e2.copyState(n2, i2.overlay), basePos: i2.basePos, baseCur: null, overlayPos: i2.overlayPos, overlayCur: null };
            }, token: function(e3, r) {
              return (e3 != r.streamSeen || Math.min(r.basePos, r.overlayPos) < e3.start) && (r.streamSeen = e3, r.basePos = r.overlayPos = e3.start), e3.start == r.basePos && (r.baseCur = t2.token(e3, r.base), r.basePos = e3.pos), e3.start == r.overlayPos && (e3.pos = e3.start, r.overlayCur = n2.token(e3, r.overlay), r.overlayPos = e3.pos), e3.pos = Math.min(r.basePos, r.overlayPos), null == r.overlayCur ? r.baseCur : null != r.baseCur && r.overlay.combineTokens || i && null == r.overlay.combineTokens ? r.baseCur + " " + r.overlayCur : r.overlayCur;
            }, indent: t2.indent && function(e3, n3, i2) {
              return t2.indent(e3.base, n3, i2);
            }, electricChars: t2.electricChars, innerMode: function(e3) {
              return { state: e3.base, mode: t2 };
            }, blankLine: function(e3) {
              var r, o;
              return t2.blankLine && (r = t2.blankLine(e3.base)), n2.blankLine && (o = n2.blankLine(e3.overlay)), null == o ? r : i && null != r ? r + " " + o : o;
            } };
          };
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 8: [function(e, t, n) {
        (function(e2) {
          "use strict";
          var t2, n2, i = e2.Pos;
          function r(e3, t3) {
            for (var n3 = (function(e4) {
              var t4 = e4.flags;
              return null != t4 ? t4 : (e4.ignoreCase ? "i" : "") + (e4.global ? "g" : "") + (e4.multiline ? "m" : "");
            })(e3), i2 = n3, r2 = 0; r2 < t3.length; r2++) -1 == i2.indexOf(t3.charAt(r2)) && (i2 += t3.charAt(r2));
            return n3 == i2 ? e3 : new RegExp(e3.source, i2);
          }
          function o(e3) {
            return /\\s|\\n|\n|\\W|\\D|\[\^/.test(e3.source);
          }
          function a(e3, t3, n3) {
            t3 = r(t3, "g");
            for (var o2 = n3.line, a2 = n3.ch, l2 = e3.lastLine(); o2 <= l2; o2++, a2 = 0) {
              t3.lastIndex = a2;
              var s2 = e3.getLine(o2), u2 = t3.exec(s2);
              if (u2) return { from: i(o2, u2.index), to: i(o2, u2.index + u2[0].length), match: u2 };
            }
          }
          function l(e3, t3, n3) {
            if (!o(t3)) return a(e3, t3, n3);
            t3 = r(t3, "gm");
            for (var l2, s2 = 1, u2 = n3.line, c2 = e3.lastLine(); u2 <= c2; ) {
              for (var d2 = 0; d2 < s2 && !(u2 > c2); d2++) {
                var h2 = e3.getLine(u2++);
                l2 = null == l2 ? h2 : l2 + "\n" + h2;
              }
              s2 *= 2, t3.lastIndex = n3.ch;
              var f2 = t3.exec(l2);
              if (f2) {
                var p2 = l2.slice(0, f2.index).split("\n"), m = f2[0].split("\n"), g = n3.line + p2.length - 1, v = p2[p2.length - 1].length;
                return { from: i(g, v), to: i(g + m.length - 1, 1 == m.length ? v + m[0].length : m[m.length - 1].length), match: f2 };
              }
            }
          }
          function s(e3, t3, n3) {
            for (var i2, r2 = 0; r2 <= e3.length; ) {
              t3.lastIndex = r2;
              var o2 = t3.exec(e3);
              if (!o2) break;
              var a2 = o2.index + o2[0].length;
              if (a2 > e3.length - n3) break;
              (!i2 || a2 > i2.index + i2[0].length) && (i2 = o2), r2 = o2.index + 1;
            }
            return i2;
          }
          function u(e3, t3, n3) {
            t3 = r(t3, "g");
            for (var o2 = n3.line, a2 = n3.ch, l2 = e3.firstLine(); o2 >= l2; o2--, a2 = -1) {
              var u2 = e3.getLine(o2), c2 = s(u2, t3, a2 < 0 ? 0 : u2.length - a2);
              if (c2) return { from: i(o2, c2.index), to: i(o2, c2.index + c2[0].length), match: c2 };
            }
          }
          function c(e3, t3, n3) {
            if (!o(t3)) return u(e3, t3, n3);
            t3 = r(t3, "gm");
            for (var a2, l2 = 1, c2 = e3.getLine(n3.line).length - n3.ch, d2 = n3.line, h2 = e3.firstLine(); d2 >= h2; ) {
              for (var f2 = 0; f2 < l2 && d2 >= h2; f2++) {
                var p2 = e3.getLine(d2--);
                a2 = null == a2 ? p2 : p2 + "\n" + a2;
              }
              l2 *= 2;
              var m = s(a2, t3, c2);
              if (m) {
                var g = a2.slice(0, m.index).split("\n"), v = m[0].split("\n"), x = d2 + g.length, y = g[g.length - 1].length;
                return { from: i(x, y), to: i(x + v.length - 1, 1 == v.length ? y + v[0].length : v[v.length - 1].length), match: m };
              }
            }
          }
          function d(e3, t3, n3, i2) {
            if (e3.length == t3.length) return n3;
            for (var r2 = 0, o2 = n3 + Math.max(0, e3.length - t3.length); ; ) {
              if (r2 == o2) return r2;
              var a2 = r2 + o2 >> 1, l2 = i2(e3.slice(0, a2)).length;
              if (l2 == n3) return a2;
              l2 > n3 ? o2 = a2 : r2 = a2 + 1;
            }
          }
          function h(e3, r2, o2, a2) {
            if (!r2.length) return null;
            var l2 = a2 ? t2 : n2, s2 = l2(r2).split(/\r|\n\r?/);
            e: for (var u2 = o2.line, c2 = o2.ch, h2 = e3.lastLine() + 1 - s2.length; u2 <= h2; u2++, c2 = 0) {
              var f2 = e3.getLine(u2).slice(c2), p2 = l2(f2);
              if (1 == s2.length) {
                var m = p2.indexOf(s2[0]);
                if (-1 == m) continue e;
                return o2 = d(f2, p2, m, l2) + c2, { from: i(u2, d(f2, p2, m, l2) + c2), to: i(u2, d(f2, p2, m + s2[0].length, l2) + c2) };
              }
              var g = p2.length - s2[0].length;
              if (p2.slice(g) == s2[0]) {
                for (var v = 1; v < s2.length - 1; v++) if (l2(e3.getLine(u2 + v)) != s2[v]) continue e;
                var x = e3.getLine(u2 + s2.length - 1), y = l2(x), b = s2[s2.length - 1];
                if (y.slice(0, b.length) == b) return { from: i(u2, d(f2, p2, g, l2) + c2), to: i(u2 + s2.length - 1, d(x, y, b.length, l2)) };
              }
            }
          }
          function f(e3, r2, o2, a2) {
            if (!r2.length) return null;
            var l2 = a2 ? t2 : n2, s2 = l2(r2).split(/\r|\n\r?/);
            e: for (var u2 = o2.line, c2 = o2.ch, h2 = e3.firstLine() - 1 + s2.length; u2 >= h2; u2--, c2 = -1) {
              var f2 = e3.getLine(u2);
              c2 > -1 && (f2 = f2.slice(0, c2));
              var p2 = l2(f2);
              if (1 == s2.length) {
                var m = p2.lastIndexOf(s2[0]);
                if (-1 == m) continue e;
                return { from: i(u2, d(f2, p2, m, l2)), to: i(u2, d(f2, p2, m + s2[0].length, l2)) };
              }
              var g = s2[s2.length - 1];
              if (p2.slice(0, g.length) == g) {
                var v = 1;
                for (o2 = u2 - s2.length + 1; v < s2.length - 1; v++) if (l2(e3.getLine(o2 + v)) != s2[v]) continue e;
                var x = e3.getLine(u2 + 1 - s2.length), y = l2(x);
                if (y.slice(y.length - s2[0].length) == s2[0]) return { from: i(u2 + 1 - s2.length, d(x, y, x.length - s2[0].length, l2)), to: i(u2, d(f2, p2, g.length, l2)) };
              }
            }
          }
          function p(e3, t3, n3, o2) {
            var s2;
            this.atOccurrence = false, this.afterEmptyMatch = false, this.doc = e3, n3 = n3 ? e3.clipPos(n3) : i(0, 0), this.pos = { from: n3, to: n3 }, "object" == typeof o2 ? s2 = o2.caseFold : (s2 = o2, o2 = null), "string" == typeof t3 ? (null == s2 && (s2 = false), this.matches = function(n4, i2) {
              return (n4 ? f : h)(e3, t3, i2, s2);
            }) : (t3 = r(t3, "gm"), o2 && false === o2.multiline ? this.matches = function(n4, i2) {
              return (n4 ? u : a)(e3, t3, i2);
            } : this.matches = function(n4, i2) {
              return (n4 ? c : l)(e3, t3, i2);
            });
          }
          String.prototype.normalize ? (t2 = function(e3) {
            return e3.normalize("NFD").toLowerCase();
          }, n2 = function(e3) {
            return e3.normalize("NFD");
          }) : (t2 = function(e3) {
            return e3.toLowerCase();
          }, n2 = function(e3) {
            return e3;
          }), p.prototype = { findNext: function() {
            return this.find(false);
          }, findPrevious: function() {
            return this.find(true);
          }, find: function(t3) {
            var n3 = this.doc.clipPos(t3 ? this.pos.from : this.pos.to);
            if (this.afterEmptyMatch && this.atOccurrence && (n3 = i(n3.line, n3.ch), t3 ? (n3.ch--, n3.ch < 0 && (n3.line--, n3.ch = (this.doc.getLine(n3.line) || "").length)) : (n3.ch++, n3.ch > (this.doc.getLine(n3.line) || "").length && (n3.ch = 0, n3.line++)), 0 != e2.cmpPos(n3, this.doc.clipPos(n3)))) return this.atOccurrence = false;
            var r2 = this.matches(t3, n3);
            if (this.afterEmptyMatch = r2 && 0 == e2.cmpPos(r2.from, r2.to), r2) return this.pos = r2, this.atOccurrence = true, this.pos.match || true;
            var o2 = i(t3 ? this.doc.firstLine() : this.doc.lastLine() + 1, 0);
            return this.pos = { from: o2, to: o2 }, this.atOccurrence = false;
          }, from: function() {
            if (this.atOccurrence) return this.pos.from;
          }, to: function() {
            if (this.atOccurrence) return this.pos.to;
          }, replace: function(t3, n3) {
            if (this.atOccurrence) {
              var r2 = e2.splitLines(t3);
              this.doc.replaceRange(r2, this.pos.from, this.pos.to, n3), this.pos.to = i(this.pos.from.line + r2.length - 1, r2[r2.length - 1].length + (1 == r2.length ? this.pos.from.ch : 0));
            }
          } }, e2.defineExtension("getSearchCursor", (function(e3, t3, n3) {
            return new p(this.doc, e3, t3, n3);
          })), e2.defineDocExtension("getSearchCursor", (function(e3, t3, n3) {
            return new p(this, e3, t3, n3);
          })), e2.defineExtension("selectMatches", (function(t3, n3) {
            for (var i2 = [], r2 = this.getSearchCursor(t3, this.getCursor("from"), n3); r2.findNext() && !(e2.cmpPos(r2.to(), this.getCursor("to")) > 0); ) i2.push({ anchor: r2.from(), head: r2.to() });
            i2.length && this.setSelections(i2, 0);
          }));
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 9: [function(e, t, n) {
        (function(e2) {
          "use strict";
          function t2(e3) {
            e3.state.markedSelection && e3.operation((function() {
              !(function(e4) {
                if (!e4.somethingSelected()) return a(e4);
                if (e4.listSelections().length > 1) return l(e4);
                var t3 = e4.getCursor("start"), n3 = e4.getCursor("end"), i2 = e4.state.markedSelection;
                if (!i2.length) return o(e4, t3, n3);
                var s = i2[0].find(), u = i2[i2.length - 1].find();
                if (!s || !u || n3.line - t3.line <= 8 || r(t3, u.to) >= 0 || r(n3, s.from) <= 0) return l(e4);
                for (; r(t3, s.from) > 0; ) i2.shift().clear(), s = i2[0].find();
                for (r(t3, s.from) < 0 && (s.to.line - t3.line < 8 ? (i2.shift().clear(), o(e4, t3, s.to, 0)) : o(e4, t3, s.from, 0)); r(n3, u.to) < 0; ) i2.pop().clear(), u = i2[i2.length - 1].find();
                r(n3, u.to) > 0 && (n3.line - u.from.line < 8 ? (i2.pop().clear(), o(e4, u.from, n3)) : o(e4, u.to, n3));
              })(e3);
            }));
          }
          function n2(e3) {
            e3.state.markedSelection && e3.state.markedSelection.length && e3.operation((function() {
              a(e3);
            }));
          }
          e2.defineOption("styleSelectedText", false, (function(i2, r2, o2) {
            var s = o2 && o2 != e2.Init;
            r2 && !s ? (i2.state.markedSelection = [], i2.state.markedSelectionStyle = "string" == typeof r2 ? r2 : "CodeMirror-selectedtext", l(i2), i2.on("cursorActivity", t2), i2.on("change", n2)) : !r2 && s && (i2.off("cursorActivity", t2), i2.off("change", n2), a(i2), i2.state.markedSelection = i2.state.markedSelectionStyle = null);
          }));
          var i = e2.Pos, r = e2.cmpPos;
          function o(e3, t3, n3, o2) {
            if (0 != r(t3, n3)) for (var a2 = e3.state.markedSelection, l2 = e3.state.markedSelectionStyle, s = t3.line; ; ) {
              var u = s == t3.line ? t3 : i(s, 0), c = s + 8, d = c >= n3.line, h = d ? n3 : i(c, 0), f = e3.markText(u, h, { className: l2 });
              if (null == o2 ? a2.push(f) : a2.splice(o2++, 0, f), d) break;
              s = c;
            }
          }
          function a(e3) {
            for (var t3 = e3.state.markedSelection, n3 = 0; n3 < t3.length; ++n3) t3[n3].clear();
            t3.length = 0;
          }
          function l(e3) {
            a(e3);
            for (var t3 = e3.listSelections(), n3 = 0; n3 < t3.length; n3++) o(e3, t3[n3].from(), t3[n3].to());
          }
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 10: [function(e, t, n) {
        !(function(e2, i) {
          "object" == typeof n && void 0 !== t ? t.exports = i() : (e2 = e2 || self).CodeMirror = i();
        })(this, (function() {
          "use strict";
          var e2 = navigator.userAgent, t2 = navigator.platform, n2 = /gecko\/\d/i.test(e2), i = /MSIE \d/.test(e2), r = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e2), o = /Edge\/(\d+)/.exec(e2), a = i || r || o, l = a && (i ? document.documentMode || 6 : +(o || r)[1]), s = !o && /WebKit\//.test(e2), u = s && /Qt\/\d+\.\d+/.test(e2), c = !o && /Chrome\/(\d+)/.exec(e2), d = c && +c[1], h = /Opera\//.test(e2), f = /Apple Computer/.test(navigator.vendor), p = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e2), m = /PhantomJS/.test(e2), g = f && (/Mobile\/\w+/.test(e2) || navigator.maxTouchPoints > 2), v = /Android/.test(e2), x = g || v || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e2), y = g || /Mac/.test(t2), b = /\bCrOS\b/.test(e2), D = /win/i.test(t2), C = h && e2.match(/Version\/(\d*\.\d*)/);
          C && (C = Number(C[1])), C && C >= 15 && (h = false, s = true);
          var w = y && (u || h && (null == C || C < 12.11)), k = n2 || a && l >= 9;
          function S(e3) {
            return new RegExp("(^|\\s)" + e3 + "(?:$|\\s)\\s*");
          }
          var F, A = function(e3, t3) {
            var n3 = e3.className, i2 = S(t3).exec(n3);
            if (i2) {
              var r2 = n3.slice(i2.index + i2[0].length);
              e3.className = n3.slice(0, i2.index) + (r2 ? i2[1] + r2 : "");
            }
          };
          function E(e3) {
            for (var t3 = e3.childNodes.length; t3 > 0; --t3) e3.removeChild(e3.firstChild);
            return e3;
          }
          function L(e3, t3) {
            return E(e3).appendChild(t3);
          }
          function T(e3, t3, n3, i2) {
            var r2 = document.createElement(e3);
            if (n3 && (r2.className = n3), i2 && (r2.style.cssText = i2), "string" == typeof t3) r2.appendChild(document.createTextNode(t3));
            else if (t3) for (var o2 = 0; o2 < t3.length; ++o2) r2.appendChild(t3[o2]);
            return r2;
          }
          function M(e3, t3, n3, i2) {
            var r2 = T(e3, t3, n3, i2);
            return r2.setAttribute("role", "presentation"), r2;
          }
          function B(e3, t3) {
            if (3 == t3.nodeType && (t3 = t3.parentNode), e3.contains) return e3.contains(t3);
            do {
              if (11 == t3.nodeType && (t3 = t3.host), t3 == e3) return true;
            } while (t3 = t3.parentNode);
          }
          function N(e3) {
            var t3;
            try {
              t3 = e3.activeElement;
            } catch (n3) {
              t3 = e3.body || null;
            }
            for (; t3 && t3.shadowRoot && t3.shadowRoot.activeElement; ) t3 = t3.shadowRoot.activeElement;
            return t3;
          }
          function O(e3, t3) {
            var n3 = e3.className;
            S(t3).test(n3) || (e3.className += (n3 ? " " : "") + t3);
          }
          function I(e3, t3) {
            for (var n3 = e3.split(" "), i2 = 0; i2 < n3.length; i2++) n3[i2] && !S(n3[i2]).test(t3) && (t3 += " " + n3[i2]);
            return t3;
          }
          F = document.createRange ? function(e3, t3, n3, i2) {
            var r2 = document.createRange();
            return r2.setEnd(i2 || e3, n3), r2.setStart(e3, t3), r2;
          } : function(e3, t3, n3) {
            var i2 = document.body.createTextRange();
            try {
              i2.moveToElementText(e3.parentNode);
            } catch (e4) {
              return i2;
            }
            return i2.collapse(true), i2.moveEnd("character", n3), i2.moveStart("character", t3), i2;
          };
          var z = function(e3) {
            e3.select();
          };
          function H(e3) {
            return e3.display.wrapper.ownerDocument;
          }
          function R(e3) {
            return H(e3).defaultView;
          }
          function P(e3) {
            var t3 = Array.prototype.slice.call(arguments, 1);
            return function() {
              return e3.apply(null, t3);
            };
          }
          function _(e3, t3, n3) {
            for (var i2 in t3 || (t3 = {}), e3) !e3.hasOwnProperty(i2) || false === n3 && t3.hasOwnProperty(i2) || (t3[i2] = e3[i2]);
            return t3;
          }
          function W(e3, t3, n3, i2, r2) {
            null == t3 && -1 == (t3 = e3.search(/[^\s\u00a0]/)) && (t3 = e3.length);
            for (var o2 = i2 || 0, a2 = r2 || 0; ; ) {
              var l2 = e3.indexOf("	", o2);
              if (l2 < 0 || l2 >= t3) return a2 + (t3 - o2);
              a2 += l2 - o2, a2 += n3 - a2 % n3, o2 = l2 + 1;
            }
          }
          g ? z = function(e3) {
            e3.selectionStart = 0, e3.selectionEnd = e3.value.length;
          } : a && (z = function(e3) {
            try {
              e3.select();
            } catch (e4) {
            }
          });
          var j = function() {
            this.id = null, this.f = null, this.time = 0, this.handler = P(this.onTimeout, this);
          };
          function q(e3, t3) {
            for (var n3 = 0; n3 < e3.length; ++n3) if (e3[n3] == t3) return n3;
            return -1;
          }
          j.prototype.onTimeout = function(e3) {
            e3.id = 0, e3.time <= +/* @__PURE__ */ new Date() ? e3.f() : setTimeout(e3.handler, e3.time - +/* @__PURE__ */ new Date());
          }, j.prototype.set = function(e3, t3) {
            this.f = t3;
            var n3 = +/* @__PURE__ */ new Date() + e3;
            (!this.id || n3 < this.time) && (clearTimeout(this.id), this.id = setTimeout(this.handler, e3), this.time = n3);
          };
          var U = { toString: function() {
            return "CodeMirror.Pass";
          } }, $ = { scroll: false }, G = { origin: "*mouse" }, V = { origin: "+move" };
          function X(e3, t3, n3) {
            for (var i2 = 0, r2 = 0; ; ) {
              var o2 = e3.indexOf("	", i2);
              -1 == o2 && (o2 = e3.length);
              var a2 = o2 - i2;
              if (o2 == e3.length || r2 + a2 >= t3) return i2 + Math.min(a2, t3 - r2);
              if (r2 += o2 - i2, i2 = o2 + 1, (r2 += n3 - r2 % n3) >= t3) return i2;
            }
          }
          var K = [""];
          function Z(e3) {
            for (; K.length <= e3; ) K.push(Y(K) + " ");
            return K[e3];
          }
          function Y(e3) {
            return e3[e3.length - 1];
          }
          function Q(e3, t3) {
            for (var n3 = [], i2 = 0; i2 < e3.length; i2++) n3[i2] = t3(e3[i2], i2);
            return n3;
          }
          function J() {
          }
          function ee(e3, t3) {
            var n3;
            return Object.create ? n3 = Object.create(e3) : (J.prototype = e3, n3 = new J()), t3 && _(t3, n3), n3;
          }
          var te = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
          function ne(e3) {
            return /\w/.test(e3) || e3 > "\x80" && (e3.toUpperCase() != e3.toLowerCase() || te.test(e3));
          }
          function ie(e3, t3) {
            return t3 ? !!(t3.source.indexOf("\\w") > -1 && ne(e3)) || t3.test(e3) : ne(e3);
          }
          function re(e3) {
            for (var t3 in e3) if (e3.hasOwnProperty(t3) && e3[t3]) return false;
            return true;
          }
          var oe = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
          function ae(e3) {
            return e3.charCodeAt(0) >= 768 && oe.test(e3);
          }
          function le(e3, t3, n3) {
            for (; (n3 < 0 ? t3 > 0 : t3 < e3.length) && ae(e3.charAt(t3)); ) t3 += n3;
            return t3;
          }
          function se(e3, t3, n3) {
            for (var i2 = t3 > n3 ? -1 : 1; ; ) {
              if (t3 == n3) return t3;
              var r2 = (t3 + n3) / 2, o2 = i2 < 0 ? Math.ceil(r2) : Math.floor(r2);
              if (o2 == t3) return e3(o2) ? t3 : n3;
              e3(o2) ? n3 = o2 : t3 = o2 + i2;
            }
          }
          var ue = null;
          function ce(e3, t3, n3) {
            var i2;
            ue = null;
            for (var r2 = 0; r2 < e3.length; ++r2) {
              var o2 = e3[r2];
              if (o2.from < t3 && o2.to > t3) return r2;
              o2.to == t3 && (o2.from != o2.to && "before" == n3 ? i2 = r2 : ue = r2), o2.from == t3 && (o2.from != o2.to && "before" != n3 ? i2 = r2 : ue = r2);
            }
            return null != i2 ? i2 : ue;
          }
          var de = /* @__PURE__ */ (function() {
            var e3 = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, t3 = /[stwN]/, n3 = /[LRr]/, i2 = /[Lb1n]/, r2 = /[1n]/;
            function o2(e4, t4, n4) {
              this.level = e4, this.from = t4, this.to = n4;
            }
            return function(a2, l2) {
              var s2 = "ltr" == l2 ? "L" : "R";
              if (0 == a2.length || "ltr" == l2 && !e3.test(a2)) return false;
              for (var u2, c2 = a2.length, d2 = [], h2 = 0; h2 < c2; ++h2) d2.push((u2 = a2.charCodeAt(h2)) <= 247 ? "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(u2) : 1424 <= u2 && u2 <= 1524 ? "R" : 1536 <= u2 && u2 <= 1785 ? "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111".charAt(u2 - 1536) : 1774 <= u2 && u2 <= 2220 ? "r" : 8192 <= u2 && u2 <= 8203 ? "w" : 8204 == u2 ? "b" : "L");
              for (var f2 = 0, p2 = s2; f2 < c2; ++f2) {
                var m2 = d2[f2];
                "m" == m2 ? d2[f2] = p2 : p2 = m2;
              }
              for (var g2 = 0, v2 = s2; g2 < c2; ++g2) {
                var x2 = d2[g2];
                "1" == x2 && "r" == v2 ? d2[g2] = "n" : n3.test(x2) && (v2 = x2, "r" == x2 && (d2[g2] = "R"));
              }
              for (var y2 = 1, b2 = d2[0]; y2 < c2 - 1; ++y2) {
                var D2 = d2[y2];
                "+" == D2 && "1" == b2 && "1" == d2[y2 + 1] ? d2[y2] = "1" : "," != D2 || b2 != d2[y2 + 1] || "1" != b2 && "n" != b2 || (d2[y2] = b2), b2 = D2;
              }
              for (var C2 = 0; C2 < c2; ++C2) {
                var w2 = d2[C2];
                if ("," == w2) d2[C2] = "N";
                else if ("%" == w2) {
                  var k2 = void 0;
                  for (k2 = C2 + 1; k2 < c2 && "%" == d2[k2]; ++k2) ;
                  for (var S2 = C2 && "!" == d2[C2 - 1] || k2 < c2 && "1" == d2[k2] ? "1" : "N", F2 = C2; F2 < k2; ++F2) d2[F2] = S2;
                  C2 = k2 - 1;
                }
              }
              for (var A2 = 0, E2 = s2; A2 < c2; ++A2) {
                var L2 = d2[A2];
                "L" == E2 && "1" == L2 ? d2[A2] = "L" : n3.test(L2) && (E2 = L2);
              }
              for (var T2 = 0; T2 < c2; ++T2) if (t3.test(d2[T2])) {
                var M2 = void 0;
                for (M2 = T2 + 1; M2 < c2 && t3.test(d2[M2]); ++M2) ;
                for (var B2 = "L" == (T2 ? d2[T2 - 1] : s2), N2 = B2 == ("L" == (M2 < c2 ? d2[M2] : s2)) ? B2 ? "L" : "R" : s2, O2 = T2; O2 < M2; ++O2) d2[O2] = N2;
                T2 = M2 - 1;
              }
              for (var I2, z2 = [], H2 = 0; H2 < c2; ) if (i2.test(d2[H2])) {
                var R2 = H2;
                for (++H2; H2 < c2 && i2.test(d2[H2]); ++H2) ;
                z2.push(new o2(0, R2, H2));
              } else {
                var P2 = H2, _2 = z2.length, W2 = "rtl" == l2 ? 1 : 0;
                for (++H2; H2 < c2 && "L" != d2[H2]; ++H2) ;
                for (var j2 = P2; j2 < H2; ) if (r2.test(d2[j2])) {
                  P2 < j2 && (z2.splice(_2, 0, new o2(1, P2, j2)), _2 += W2);
                  var q2 = j2;
                  for (++j2; j2 < H2 && r2.test(d2[j2]); ++j2) ;
                  z2.splice(_2, 0, new o2(2, q2, j2)), _2 += W2, P2 = j2;
                } else ++j2;
                P2 < H2 && z2.splice(_2, 0, new o2(1, P2, H2));
              }
              return "ltr" == l2 && (1 == z2[0].level && (I2 = a2.match(/^\s+/)) && (z2[0].from = I2[0].length, z2.unshift(new o2(0, 0, I2[0].length))), 1 == Y(z2).level && (I2 = a2.match(/\s+$/)) && (Y(z2).to -= I2[0].length, z2.push(new o2(0, c2 - I2[0].length, c2)))), "rtl" == l2 ? z2.reverse() : z2;
            };
          })();
          function he(e3, t3) {
            var n3 = e3.order;
            return null == n3 && (n3 = e3.order = de(e3.text, t3)), n3;
          }
          var fe = [], pe = function(e3, t3, n3) {
            if (e3.addEventListener) e3.addEventListener(t3, n3, false);
            else if (e3.attachEvent) e3.attachEvent("on" + t3, n3);
            else {
              var i2 = e3._handlers || (e3._handlers = {});
              i2[t3] = (i2[t3] || fe).concat(n3);
            }
          };
          function me(e3, t3) {
            return e3._handlers && e3._handlers[t3] || fe;
          }
          function ge(e3, t3, n3) {
            if (e3.removeEventListener) e3.removeEventListener(t3, n3, false);
            else if (e3.detachEvent) e3.detachEvent("on" + t3, n3);
            else {
              var i2 = e3._handlers, r2 = i2 && i2[t3];
              if (r2) {
                var o2 = q(r2, n3);
                o2 > -1 && (i2[t3] = r2.slice(0, o2).concat(r2.slice(o2 + 1)));
              }
            }
          }
          function ve(e3, t3) {
            var n3 = me(e3, t3);
            if (n3.length) for (var i2 = Array.prototype.slice.call(arguments, 2), r2 = 0; r2 < n3.length; ++r2) n3[r2].apply(null, i2);
          }
          function xe(e3, t3, n3) {
            return "string" == typeof t3 && (t3 = { type: t3, preventDefault: function() {
              this.defaultPrevented = true;
            } }), ve(e3, n3 || t3.type, e3, t3), ke(t3) || t3.codemirrorIgnore;
          }
          function ye(e3) {
            var t3 = e3._handlers && e3._handlers.cursorActivity;
            if (t3) for (var n3 = e3.curOp.cursorActivityHandlers || (e3.curOp.cursorActivityHandlers = []), i2 = 0; i2 < t3.length; ++i2) -1 == q(n3, t3[i2]) && n3.push(t3[i2]);
          }
          function be(e3, t3) {
            return me(e3, t3).length > 0;
          }
          function De(e3) {
            e3.prototype.on = function(e4, t3) {
              pe(this, e4, t3);
            }, e3.prototype.off = function(e4, t3) {
              ge(this, e4, t3);
            };
          }
          function Ce(e3) {
            e3.preventDefault ? e3.preventDefault() : e3.returnValue = false;
          }
          function we(e3) {
            e3.stopPropagation ? e3.stopPropagation() : e3.cancelBubble = true;
          }
          function ke(e3) {
            return null != e3.defaultPrevented ? e3.defaultPrevented : 0 == e3.returnValue;
          }
          function Se(e3) {
            Ce(e3), we(e3);
          }
          function Fe(e3) {
            return e3.target || e3.srcElement;
          }
          function Ae(e3) {
            var t3 = e3.which;
            return null == t3 && (1 & e3.button ? t3 = 1 : 2 & e3.button ? t3 = 3 : 4 & e3.button && (t3 = 2)), y && e3.ctrlKey && 1 == t3 && (t3 = 3), t3;
          }
          var Ee, Le, Te = (function() {
            if (a && l < 9) return false;
            var e3 = T("div");
            return "draggable" in e3 || "dragDrop" in e3;
          })();
          function Me(e3) {
            if (null == Ee) {
              var t3 = T("span", "\u200B");
              L(e3, T("span", [t3, document.createTextNode("x")])), 0 != e3.firstChild.offsetHeight && (Ee = t3.offsetWidth <= 1 && t3.offsetHeight > 2 && !(a && l < 8));
            }
            var n3 = Ee ? T("span", "\u200B") : T("span", "\xA0", null, "display: inline-block; width: 1px; margin-right: -1px");
            return n3.setAttribute("cm-text", ""), n3;
          }
          function Be(e3) {
            if (null != Le) return Le;
            var t3 = L(e3, document.createTextNode("A\u062EA")), n3 = F(t3, 0, 1).getBoundingClientRect(), i2 = F(t3, 1, 2).getBoundingClientRect();
            return E(e3), !(!n3 || n3.left == n3.right) && (Le = i2.right - n3.right < 3);
          }
          var Ne, Oe = 3 != "\n\nb".split(/\n/).length ? function(e3) {
            for (var t3 = 0, n3 = [], i2 = e3.length; t3 <= i2; ) {
              var r2 = e3.indexOf("\n", t3);
              -1 == r2 && (r2 = e3.length);
              var o2 = e3.slice(t3, "\r" == e3.charAt(r2 - 1) ? r2 - 1 : r2), a2 = o2.indexOf("\r");
              -1 != a2 ? (n3.push(o2.slice(0, a2)), t3 += a2 + 1) : (n3.push(o2), t3 = r2 + 1);
            }
            return n3;
          } : function(e3) {
            return e3.split(/\r\n?|\n/);
          }, Ie = window.getSelection ? function(e3) {
            try {
              return e3.selectionStart != e3.selectionEnd;
            } catch (e4) {
              return false;
            }
          } : function(e3) {
            var t3;
            try {
              t3 = e3.ownerDocument.selection.createRange();
            } catch (e4) {
            }
            return !(!t3 || t3.parentElement() != e3) && 0 != t3.compareEndPoints("StartToEnd", t3);
          }, ze = "oncopy" in (Ne = T("div")) || (Ne.setAttribute("oncopy", "return;"), "function" == typeof Ne.oncopy), He = null;
          var Re = {}, Pe = {};
          function _e(e3, t3) {
            arguments.length > 2 && (t3.dependencies = Array.prototype.slice.call(arguments, 2)), Re[e3] = t3;
          }
          function We(e3) {
            if ("string" == typeof e3 && Pe.hasOwnProperty(e3)) e3 = Pe[e3];
            else if (e3 && "string" == typeof e3.name && Pe.hasOwnProperty(e3.name)) {
              var t3 = Pe[e3.name];
              "string" == typeof t3 && (t3 = { name: t3 }), (e3 = ee(t3, e3)).name = t3.name;
            } else {
              if ("string" == typeof e3 && /^[\w\-]+\/[\w\-]+\+xml$/.test(e3)) return We("application/xml");
              if ("string" == typeof e3 && /^[\w\-]+\/[\w\-]+\+json$/.test(e3)) return We("application/json");
            }
            return "string" == typeof e3 ? { name: e3 } : e3 || { name: "null" };
          }
          function je(e3, t3) {
            t3 = We(t3);
            var n3 = Re[t3.name];
            if (!n3) return je(e3, "text/plain");
            var i2 = n3(e3, t3);
            if (qe.hasOwnProperty(t3.name)) {
              var r2 = qe[t3.name];
              for (var o2 in r2) r2.hasOwnProperty(o2) && (i2.hasOwnProperty(o2) && (i2["_" + o2] = i2[o2]), i2[o2] = r2[o2]);
            }
            if (i2.name = t3.name, t3.helperType && (i2.helperType = t3.helperType), t3.modeProps) for (var a2 in t3.modeProps) i2[a2] = t3.modeProps[a2];
            return i2;
          }
          var qe = {};
          function Ue(e3, t3) {
            _(t3, qe.hasOwnProperty(e3) ? qe[e3] : qe[e3] = {});
          }
          function $e(e3, t3) {
            if (true === t3) return t3;
            if (e3.copyState) return e3.copyState(t3);
            var n3 = {};
            for (var i2 in t3) {
              var r2 = t3[i2];
              r2 instanceof Array && (r2 = r2.concat([])), n3[i2] = r2;
            }
            return n3;
          }
          function Ge(e3, t3) {
            for (var n3; e3.innerMode && (n3 = e3.innerMode(t3)) && n3.mode != e3; ) t3 = n3.state, e3 = n3.mode;
            return n3 || { mode: e3, state: t3 };
          }
          function Ve(e3, t3, n3) {
            return !e3.startState || e3.startState(t3, n3);
          }
          var Xe = function(e3, t3, n3) {
            this.pos = this.start = 0, this.string = e3, this.tabSize = t3 || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0, this.lineOracle = n3;
          };
          function Ke(e3, t3) {
            if ((t3 -= e3.first) < 0 || t3 >= e3.size) throw new Error("There is no line " + (t3 + e3.first) + " in the document.");
            for (var n3 = e3; !n3.lines; ) for (var i2 = 0; ; ++i2) {
              var r2 = n3.children[i2], o2 = r2.chunkSize();
              if (t3 < o2) {
                n3 = r2;
                break;
              }
              t3 -= o2;
            }
            return n3.lines[t3];
          }
          function Ze(e3, t3, n3) {
            var i2 = [], r2 = t3.line;
            return e3.iter(t3.line, n3.line + 1, (function(e4) {
              var o2 = e4.text;
              r2 == n3.line && (o2 = o2.slice(0, n3.ch)), r2 == t3.line && (o2 = o2.slice(t3.ch)), i2.push(o2), ++r2;
            })), i2;
          }
          function Ye(e3, t3, n3) {
            var i2 = [];
            return e3.iter(t3, n3, (function(e4) {
              i2.push(e4.text);
            })), i2;
          }
          function Qe(e3, t3) {
            var n3 = t3 - e3.height;
            if (n3) for (var i2 = e3; i2; i2 = i2.parent) i2.height += n3;
          }
          function Je(e3) {
            if (null == e3.parent) return null;
            for (var t3 = e3.parent, n3 = q(t3.lines, e3), i2 = t3.parent; i2; t3 = i2, i2 = i2.parent) for (var r2 = 0; i2.children[r2] != t3; ++r2) n3 += i2.children[r2].chunkSize();
            return n3 + t3.first;
          }
          function et(e3, t3) {
            var n3 = e3.first;
            e: do {
              for (var i2 = 0; i2 < e3.children.length; ++i2) {
                var r2 = e3.children[i2], o2 = r2.height;
                if (t3 < o2) {
                  e3 = r2;
                  continue e;
                }
                t3 -= o2, n3 += r2.chunkSize();
              }
              return n3;
            } while (!e3.lines);
            for (var a2 = 0; a2 < e3.lines.length; ++a2) {
              var l2 = e3.lines[a2].height;
              if (t3 < l2) break;
              t3 -= l2;
            }
            return n3 + a2;
          }
          function tt(e3, t3) {
            return t3 >= e3.first && t3 < e3.first + e3.size;
          }
          function nt(e3, t3) {
            return String(e3.lineNumberFormatter(t3 + e3.firstLineNumber));
          }
          function it(e3, t3, n3) {
            if (void 0 === n3 && (n3 = null), !(this instanceof it)) return new it(e3, t3, n3);
            this.line = e3, this.ch = t3, this.sticky = n3;
          }
          function rt(e3, t3) {
            return e3.line - t3.line || e3.ch - t3.ch;
          }
          function ot(e3, t3) {
            return e3.sticky == t3.sticky && 0 == rt(e3, t3);
          }
          function at(e3) {
            return it(e3.line, e3.ch);
          }
          function lt(e3, t3) {
            return rt(e3, t3) < 0 ? t3 : e3;
          }
          function st(e3, t3) {
            return rt(e3, t3) < 0 ? e3 : t3;
          }
          function ut(e3, t3) {
            return Math.max(e3.first, Math.min(t3, e3.first + e3.size - 1));
          }
          function ct(e3, t3) {
            if (t3.line < e3.first) return it(e3.first, 0);
            var n3 = e3.first + e3.size - 1;
            return t3.line > n3 ? it(n3, Ke(e3, n3).text.length) : (function(e4, t4) {
              var n4 = e4.ch;
              return null == n4 || n4 > t4 ? it(e4.line, t4) : n4 < 0 ? it(e4.line, 0) : e4;
            })(t3, Ke(e3, t3.line).text.length);
          }
          function dt(e3, t3) {
            for (var n3 = [], i2 = 0; i2 < t3.length; i2++) n3[i2] = ct(e3, t3[i2]);
            return n3;
          }
          Xe.prototype.eol = function() {
            return this.pos >= this.string.length;
          }, Xe.prototype.sol = function() {
            return this.pos == this.lineStart;
          }, Xe.prototype.peek = function() {
            return this.string.charAt(this.pos) || void 0;
          }, Xe.prototype.next = function() {
            if (this.pos < this.string.length) return this.string.charAt(this.pos++);
          }, Xe.prototype.eat = function(e3) {
            var t3 = this.string.charAt(this.pos);
            if ("string" == typeof e3 ? t3 == e3 : t3 && (e3.test ? e3.test(t3) : e3(t3))) return ++this.pos, t3;
          }, Xe.prototype.eatWhile = function(e3) {
            for (var t3 = this.pos; this.eat(e3); ) ;
            return this.pos > t3;
          }, Xe.prototype.eatSpace = function() {
            for (var e3 = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos;
            return this.pos > e3;
          }, Xe.prototype.skipToEnd = function() {
            this.pos = this.string.length;
          }, Xe.prototype.skipTo = function(e3) {
            var t3 = this.string.indexOf(e3, this.pos);
            if (t3 > -1) return this.pos = t3, true;
          }, Xe.prototype.backUp = function(e3) {
            this.pos -= e3;
          }, Xe.prototype.column = function() {
            return this.lastColumnPos < this.start && (this.lastColumnValue = W(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? W(this.string, this.lineStart, this.tabSize) : 0);
          }, Xe.prototype.indentation = function() {
            return W(this.string, null, this.tabSize) - (this.lineStart ? W(this.string, this.lineStart, this.tabSize) : 0);
          }, Xe.prototype.match = function(e3, t3, n3) {
            if ("string" != typeof e3) {
              var i2 = this.string.slice(this.pos).match(e3);
              return i2 && i2.index > 0 ? null : (i2 && false !== t3 && (this.pos += i2[0].length), i2);
            }
            var r2 = function(e4) {
              return n3 ? e4.toLowerCase() : e4;
            };
            if (r2(this.string.substr(this.pos, e3.length)) == r2(e3)) return false !== t3 && (this.pos += e3.length), true;
          }, Xe.prototype.current = function() {
            return this.string.slice(this.start, this.pos);
          }, Xe.prototype.hideFirstChars = function(e3, t3) {
            this.lineStart += e3;
            try {
              return t3();
            } finally {
              this.lineStart -= e3;
            }
          }, Xe.prototype.lookAhead = function(e3) {
            var t3 = this.lineOracle;
            return t3 && t3.lookAhead(e3);
          }, Xe.prototype.baseToken = function() {
            var e3 = this.lineOracle;
            return e3 && e3.baseToken(this.pos);
          };
          var ht = function(e3, t3) {
            this.state = e3, this.lookAhead = t3;
          }, ft = function(e3, t3, n3, i2) {
            this.state = t3, this.doc = e3, this.line = n3, this.maxLookAhead = i2 || 0, this.baseTokens = null, this.baseTokenPos = 1;
          };
          function pt(e3, t3, n3, i2) {
            var r2 = [e3.state.modeGen], o2 = {};
            wt(e3, t3.text, e3.doc.mode, n3, (function(e4, t4) {
              return r2.push(e4, t4);
            }), o2, i2);
            for (var a2 = n3.state, l2 = function(i3) {
              n3.baseTokens = r2;
              var l3 = e3.state.overlays[i3], s3 = 1, u2 = 0;
              n3.state = true, wt(e3, t3.text, l3.mode, n3, (function(e4, t4) {
                for (var n4 = s3; u2 < e4; ) {
                  var i4 = r2[s3];
                  i4 > e4 && r2.splice(s3, 1, e4, r2[s3 + 1], i4), s3 += 2, u2 = Math.min(e4, i4);
                }
                if (t4) if (l3.opaque) r2.splice(n4, s3 - n4, e4, "overlay " + t4), s3 = n4 + 2;
                else for (; n4 < s3; n4 += 2) {
                  var o3 = r2[n4 + 1];
                  r2[n4 + 1] = (o3 ? o3 + " " : "") + "overlay " + t4;
                }
              }), o2), n3.state = a2, n3.baseTokens = null, n3.baseTokenPos = 1;
            }, s2 = 0; s2 < e3.state.overlays.length; ++s2) l2(s2);
            return { styles: r2, classes: o2.bgClass || o2.textClass ? o2 : null };
          }
          function mt(e3, t3, n3) {
            if (!t3.styles || t3.styles[0] != e3.state.modeGen) {
              var i2 = gt(e3, Je(t3)), r2 = t3.text.length > e3.options.maxHighlightLength && $e(e3.doc.mode, i2.state), o2 = pt(e3, t3, i2);
              r2 && (i2.state = r2), t3.stateAfter = i2.save(!r2), t3.styles = o2.styles, o2.classes ? t3.styleClasses = o2.classes : t3.styleClasses && (t3.styleClasses = null), n3 === e3.doc.highlightFrontier && (e3.doc.modeFrontier = Math.max(e3.doc.modeFrontier, ++e3.doc.highlightFrontier));
            }
            return t3.styles;
          }
          function gt(e3, t3, n3) {
            var i2 = e3.doc, r2 = e3.display;
            if (!i2.mode.startState) return new ft(i2, true, t3);
            var o2 = (function(e4, t4, n4) {
              for (var i3, r3, o3 = e4.doc, a3 = n4 ? -1 : t4 - (e4.doc.mode.innerMode ? 1e3 : 100), l3 = t4; l3 > a3; --l3) {
                if (l3 <= o3.first) return o3.first;
                var s2 = Ke(o3, l3 - 1), u2 = s2.stateAfter;
                if (u2 && (!n4 || l3 + (u2 instanceof ht ? u2.lookAhead : 0) <= o3.modeFrontier)) return l3;
                var c2 = W(s2.text, null, e4.options.tabSize);
                (null == r3 || i3 > c2) && (r3 = l3 - 1, i3 = c2);
              }
              return r3;
            })(e3, t3, n3), a2 = o2 > i2.first && Ke(i2, o2 - 1).stateAfter, l2 = a2 ? ft.fromSaved(i2, a2, o2) : new ft(i2, Ve(i2.mode), o2);
            return i2.iter(o2, t3, (function(n4) {
              vt(e3, n4.text, l2);
              var i3 = l2.line;
              n4.stateAfter = i3 == t3 - 1 || i3 % 5 == 0 || i3 >= r2.viewFrom && i3 < r2.viewTo ? l2.save() : null, l2.nextLine();
            })), n3 && (i2.modeFrontier = l2.line), l2;
          }
          function vt(e3, t3, n3, i2) {
            var r2 = e3.doc.mode, o2 = new Xe(t3, e3.options.tabSize, n3);
            for (o2.start = o2.pos = i2 || 0, "" == t3 && xt(r2, n3.state); !o2.eol(); ) yt(r2, o2, n3.state), o2.start = o2.pos;
          }
          function xt(e3, t3) {
            if (e3.blankLine) return e3.blankLine(t3);
            if (e3.innerMode) {
              var n3 = Ge(e3, t3);
              return n3.mode.blankLine ? n3.mode.blankLine(n3.state) : void 0;
            }
          }
          function yt(e3, t3, n3, i2) {
            for (var r2 = 0; r2 < 10; r2++) {
              i2 && (i2[0] = Ge(e3, n3).mode);
              var o2 = e3.token(t3, n3);
              if (t3.pos > t3.start) return o2;
            }
            throw new Error("Mode " + e3.name + " failed to advance stream.");
          }
          ft.prototype.lookAhead = function(e3) {
            var t3 = this.doc.getLine(this.line + e3);
            return null != t3 && e3 > this.maxLookAhead && (this.maxLookAhead = e3), t3;
          }, ft.prototype.baseToken = function(e3) {
            if (!this.baseTokens) return null;
            for (; this.baseTokens[this.baseTokenPos] <= e3; ) this.baseTokenPos += 2;
            var t3 = this.baseTokens[this.baseTokenPos + 1];
            return { type: t3 && t3.replace(/( |^)overlay .*/, ""), size: this.baseTokens[this.baseTokenPos] - e3 };
          }, ft.prototype.nextLine = function() {
            this.line++, this.maxLookAhead > 0 && this.maxLookAhead--;
          }, ft.fromSaved = function(e3, t3, n3) {
            return t3 instanceof ht ? new ft(e3, $e(e3.mode, t3.state), n3, t3.lookAhead) : new ft(e3, $e(e3.mode, t3), n3);
          }, ft.prototype.save = function(e3) {
            var t3 = false !== e3 ? $e(this.doc.mode, this.state) : this.state;
            return this.maxLookAhead > 0 ? new ht(t3, this.maxLookAhead) : t3;
          };
          var bt = function(e3, t3, n3) {
            this.start = e3.start, this.end = e3.pos, this.string = e3.current(), this.type = t3 || null, this.state = n3;
          };
          function Dt(e3, t3, n3, i2) {
            var r2, o2, a2 = e3.doc, l2 = a2.mode, s2 = Ke(a2, (t3 = ct(a2, t3)).line), u2 = gt(e3, t3.line, n3), c2 = new Xe(s2.text, e3.options.tabSize, u2);
            for (i2 && (o2 = []); (i2 || c2.pos < t3.ch) && !c2.eol(); ) c2.start = c2.pos, r2 = yt(l2, c2, u2.state), i2 && o2.push(new bt(c2, r2, $e(a2.mode, u2.state)));
            return i2 ? o2 : new bt(c2, r2, u2.state);
          }
          function Ct(e3, t3) {
            if (e3) for (; ; ) {
              var n3 = e3.match(/(?:^|\s+)line-(background-)?(\S+)/);
              if (!n3) break;
              e3 = e3.slice(0, n3.index) + e3.slice(n3.index + n3[0].length);
              var i2 = n3[1] ? "bgClass" : "textClass";
              null == t3[i2] ? t3[i2] = n3[2] : new RegExp("(?:^|\\s)" + n3[2] + "(?:$|\\s)").test(t3[i2]) || (t3[i2] += " " + n3[2]);
            }
            return e3;
          }
          function wt(e3, t3, n3, i2, r2, o2, a2) {
            var l2 = n3.flattenSpans;
            null == l2 && (l2 = e3.options.flattenSpans);
            var s2, u2 = 0, c2 = null, d2 = new Xe(t3, e3.options.tabSize, i2), h2 = e3.options.addModeClass && [null];
            for ("" == t3 && Ct(xt(n3, i2.state), o2); !d2.eol(); ) {
              if (d2.pos > e3.options.maxHighlightLength ? (l2 = false, a2 && vt(e3, t3, i2, d2.pos), d2.pos = t3.length, s2 = null) : s2 = Ct(yt(n3, d2, i2.state, h2), o2), h2) {
                var f2 = h2[0].name;
                f2 && (s2 = "m-" + (s2 ? f2 + " " + s2 : f2));
              }
              if (!l2 || c2 != s2) {
                for (; u2 < d2.start; ) r2(u2 = Math.min(d2.start, u2 + 5e3), c2);
                c2 = s2;
              }
              d2.start = d2.pos;
            }
            for (; u2 < d2.pos; ) {
              var p2 = Math.min(d2.pos, u2 + 5e3);
              r2(p2, c2), u2 = p2;
            }
          }
          var kt = false, St = false;
          function Ft(e3, t3, n3) {
            this.marker = e3, this.from = t3, this.to = n3;
          }
          function At(e3, t3) {
            if (e3) for (var n3 = 0; n3 < e3.length; ++n3) {
              var i2 = e3[n3];
              if (i2.marker == t3) return i2;
            }
          }
          function Et(e3, t3) {
            for (var n3, i2 = 0; i2 < e3.length; ++i2) e3[i2] != t3 && (n3 || (n3 = [])).push(e3[i2]);
            return n3;
          }
          function Lt(e3, t3) {
            if (t3.full) return null;
            var n3 = tt(e3, t3.from.line) && Ke(e3, t3.from.line).markedSpans, i2 = tt(e3, t3.to.line) && Ke(e3, t3.to.line).markedSpans;
            if (!n3 && !i2) return null;
            var r2 = t3.from.ch, o2 = t3.to.ch, a2 = 0 == rt(t3.from, t3.to), l2 = (function(e4, t4, n4) {
              var i3;
              if (e4) for (var r3 = 0; r3 < e4.length; ++r3) {
                var o3 = e4[r3], a3 = o3.marker;
                if (null == o3.from || (a3.inclusiveLeft ? o3.from <= t4 : o3.from < t4) || o3.from == t4 && "bookmark" == a3.type && (!n4 || !o3.marker.insertLeft)) {
                  var l3 = null == o3.to || (a3.inclusiveRight ? o3.to >= t4 : o3.to > t4);
                  (i3 || (i3 = [])).push(new Ft(a3, o3.from, l3 ? null : o3.to));
                }
              }
              return i3;
            })(n3, r2, a2), s2 = (function(e4, t4, n4) {
              var i3;
              if (e4) for (var r3 = 0; r3 < e4.length; ++r3) {
                var o3 = e4[r3], a3 = o3.marker;
                if (null == o3.to || (a3.inclusiveRight ? o3.to >= t4 : o3.to > t4) || o3.from == t4 && "bookmark" == a3.type && (!n4 || o3.marker.insertLeft)) {
                  var l3 = null == o3.from || (a3.inclusiveLeft ? o3.from <= t4 : o3.from < t4);
                  (i3 || (i3 = [])).push(new Ft(a3, l3 ? null : o3.from - t4, null == o3.to ? null : o3.to - t4));
                }
              }
              return i3;
            })(i2, o2, a2), u2 = 1 == t3.text.length, c2 = Y(t3.text).length + (u2 ? r2 : 0);
            if (l2) for (var d2 = 0; d2 < l2.length; ++d2) {
              var h2 = l2[d2];
              if (null == h2.to) {
                var f2 = At(s2, h2.marker);
                f2 ? u2 && (h2.to = null == f2.to ? null : f2.to + c2) : h2.to = r2;
              }
            }
            if (s2) for (var p2 = 0; p2 < s2.length; ++p2) {
              var m2 = s2[p2];
              if (null != m2.to && (m2.to += c2), null == m2.from) At(l2, m2.marker) || (m2.from = c2, u2 && (l2 || (l2 = [])).push(m2));
              else m2.from += c2, u2 && (l2 || (l2 = [])).push(m2);
            }
            l2 && (l2 = Tt(l2)), s2 && s2 != l2 && (s2 = Tt(s2));
            var g2 = [l2];
            if (!u2) {
              var v2, x2 = t3.text.length - 2;
              if (x2 > 0 && l2) for (var y2 = 0; y2 < l2.length; ++y2) null == l2[y2].to && (v2 || (v2 = [])).push(new Ft(l2[y2].marker, null, null));
              for (var b2 = 0; b2 < x2; ++b2) g2.push(v2);
              g2.push(s2);
            }
            return g2;
          }
          function Tt(e3) {
            for (var t3 = 0; t3 < e3.length; ++t3) {
              var n3 = e3[t3];
              null != n3.from && n3.from == n3.to && false !== n3.marker.clearWhenEmpty && e3.splice(t3--, 1);
            }
            return e3.length ? e3 : null;
          }
          function Mt(e3) {
            var t3 = e3.markedSpans;
            if (t3) {
              for (var n3 = 0; n3 < t3.length; ++n3) t3[n3].marker.detachLine(e3);
              e3.markedSpans = null;
            }
          }
          function Bt(e3, t3) {
            if (t3) {
              for (var n3 = 0; n3 < t3.length; ++n3) t3[n3].marker.attachLine(e3);
              e3.markedSpans = t3;
            }
          }
          function Nt(e3) {
            return e3.inclusiveLeft ? -1 : 0;
          }
          function Ot(e3) {
            return e3.inclusiveRight ? 1 : 0;
          }
          function It(e3, t3) {
            var n3 = e3.lines.length - t3.lines.length;
            if (0 != n3) return n3;
            var i2 = e3.find(), r2 = t3.find(), o2 = rt(i2.from, r2.from) || Nt(e3) - Nt(t3);
            if (o2) return -o2;
            var a2 = rt(i2.to, r2.to) || Ot(e3) - Ot(t3);
            return a2 || t3.id - e3.id;
          }
          function zt(e3, t3) {
            var n3, i2 = St && e3.markedSpans;
            if (i2) for (var r2 = void 0, o2 = 0; o2 < i2.length; ++o2) (r2 = i2[o2]).marker.collapsed && null == (t3 ? r2.from : r2.to) && (!n3 || It(n3, r2.marker) < 0) && (n3 = r2.marker);
            return n3;
          }
          function Ht(e3) {
            return zt(e3, true);
          }
          function Rt(e3) {
            return zt(e3, false);
          }
          function Pt(e3, t3) {
            var n3, i2 = St && e3.markedSpans;
            if (i2) for (var r2 = 0; r2 < i2.length; ++r2) {
              var o2 = i2[r2];
              o2.marker.collapsed && (null == o2.from || o2.from < t3) && (null == o2.to || o2.to > t3) && (!n3 || It(n3, o2.marker) < 0) && (n3 = o2.marker);
            }
            return n3;
          }
          function _t(e3, t3, n3, i2, r2) {
            var o2 = Ke(e3, t3), a2 = St && o2.markedSpans;
            if (a2) for (var l2 = 0; l2 < a2.length; ++l2) {
              var s2 = a2[l2];
              if (s2.marker.collapsed) {
                var u2 = s2.marker.find(0), c2 = rt(u2.from, n3) || Nt(s2.marker) - Nt(r2), d2 = rt(u2.to, i2) || Ot(s2.marker) - Ot(r2);
                if (!(c2 >= 0 && d2 <= 0 || c2 <= 0 && d2 >= 0) && (c2 <= 0 && (s2.marker.inclusiveRight && r2.inclusiveLeft ? rt(u2.to, n3) >= 0 : rt(u2.to, n3) > 0) || c2 >= 0 && (s2.marker.inclusiveRight && r2.inclusiveLeft ? rt(u2.from, i2) <= 0 : rt(u2.from, i2) < 0))) return true;
              }
            }
          }
          function Wt(e3) {
            for (var t3; t3 = Ht(e3); ) e3 = t3.find(-1, true).line;
            return e3;
          }
          function jt(e3, t3) {
            var n3 = Ke(e3, t3), i2 = Wt(n3);
            return n3 == i2 ? t3 : Je(i2);
          }
          function qt(e3, t3) {
            if (t3 > e3.lastLine()) return t3;
            var n3, i2 = Ke(e3, t3);
            if (!Ut(e3, i2)) return t3;
            for (; n3 = Rt(i2); ) i2 = n3.find(1, true).line;
            return Je(i2) + 1;
          }
          function Ut(e3, t3) {
            var n3 = St && t3.markedSpans;
            if (n3) {
              for (var i2 = void 0, r2 = 0; r2 < n3.length; ++r2) if ((i2 = n3[r2]).marker.collapsed) {
                if (null == i2.from) return true;
                if (!i2.marker.widgetNode && 0 == i2.from && i2.marker.inclusiveLeft && $t(e3, t3, i2)) return true;
              }
            }
          }
          function $t(e3, t3, n3) {
            if (null == n3.to) {
              var i2 = n3.marker.find(1, true);
              return $t(e3, i2.line, At(i2.line.markedSpans, n3.marker));
            }
            if (n3.marker.inclusiveRight && n3.to == t3.text.length) return true;
            for (var r2 = void 0, o2 = 0; o2 < t3.markedSpans.length; ++o2) if ((r2 = t3.markedSpans[o2]).marker.collapsed && !r2.marker.widgetNode && r2.from == n3.to && (null == r2.to || r2.to != n3.from) && (r2.marker.inclusiveLeft || n3.marker.inclusiveRight) && $t(e3, t3, r2)) return true;
          }
          function Gt(e3) {
            for (var t3 = 0, n3 = (e3 = Wt(e3)).parent, i2 = 0; i2 < n3.lines.length; ++i2) {
              var r2 = n3.lines[i2];
              if (r2 == e3) break;
              t3 += r2.height;
            }
            for (var o2 = n3.parent; o2; o2 = (n3 = o2).parent) for (var a2 = 0; a2 < o2.children.length; ++a2) {
              var l2 = o2.children[a2];
              if (l2 == n3) break;
              t3 += l2.height;
            }
            return t3;
          }
          function Vt(e3) {
            if (0 == e3.height) return 0;
            for (var t3, n3 = e3.text.length, i2 = e3; t3 = Ht(i2); ) {
              var r2 = t3.find(0, true);
              i2 = r2.from.line, n3 += r2.from.ch - r2.to.ch;
            }
            for (i2 = e3; t3 = Rt(i2); ) {
              var o2 = t3.find(0, true);
              n3 -= i2.text.length - o2.from.ch, n3 += (i2 = o2.to.line).text.length - o2.to.ch;
            }
            return n3;
          }
          function Xt(e3) {
            var t3 = e3.display, n3 = e3.doc;
            t3.maxLine = Ke(n3, n3.first), t3.maxLineLength = Vt(t3.maxLine), t3.maxLineChanged = true, n3.iter((function(e4) {
              var n4 = Vt(e4);
              n4 > t3.maxLineLength && (t3.maxLineLength = n4, t3.maxLine = e4);
            }));
          }
          var Kt = function(e3, t3, n3) {
            this.text = e3, Bt(this, t3), this.height = n3 ? n3(this) : 1;
          };
          function Zt(e3) {
            e3.parent = null, Mt(e3);
          }
          Kt.prototype.lineNo = function() {
            return Je(this);
          }, De(Kt);
          var Yt = {}, Qt = {};
          function Jt(e3, t3) {
            if (!e3 || /^\s*$/.test(e3)) return null;
            var n3 = t3.addModeClass ? Qt : Yt;
            return n3[e3] || (n3[e3] = e3.replace(/\S+/g, "cm-$&"));
          }
          function en(e3, t3) {
            var n3 = M("span", null, null, s ? "padding-right: .1px" : null), i2 = { pre: M("pre", [n3], "CodeMirror-line"), content: n3, col: 0, pos: 0, cm: e3, trailingSpace: false, splitSpaces: e3.getOption("lineWrapping") };
            t3.measure = {};
            for (var r2 = 0; r2 <= (t3.rest ? t3.rest.length : 0); r2++) {
              var o2 = r2 ? t3.rest[r2 - 1] : t3.line, a2 = void 0;
              i2.pos = 0, i2.addToken = nn, Be(e3.display.measure) && (a2 = he(o2, e3.doc.direction)) && (i2.addToken = rn(i2.addToken, a2)), i2.map = [], an(o2, i2, mt(e3, o2, t3 != e3.display.externalMeasured && Je(o2))), o2.styleClasses && (o2.styleClasses.bgClass && (i2.bgClass = I(o2.styleClasses.bgClass, i2.bgClass || "")), o2.styleClasses.textClass && (i2.textClass = I(o2.styleClasses.textClass, i2.textClass || ""))), 0 == i2.map.length && i2.map.push(0, 0, i2.content.appendChild(Me(e3.display.measure))), 0 == r2 ? (t3.measure.map = i2.map, t3.measure.cache = {}) : ((t3.measure.maps || (t3.measure.maps = [])).push(i2.map), (t3.measure.caches || (t3.measure.caches = [])).push({}));
            }
            if (s) {
              var l2 = i2.content.lastChild;
              (/\bcm-tab\b/.test(l2.className) || l2.querySelector && l2.querySelector(".cm-tab")) && (i2.content.className = "cm-tab-wrap-hack");
            }
            return ve(e3, "renderLine", e3, t3.line, i2.pre), i2.pre.className && (i2.textClass = I(i2.pre.className, i2.textClass || "")), i2;
          }
          function tn(e3) {
            var t3 = T("span", "\u2022", "cm-invalidchar");
            return t3.title = "\\u" + e3.charCodeAt(0).toString(16), t3.setAttribute("aria-label", t3.title), t3;
          }
          function nn(e3, t3, n3, i2, r2, o2, s2) {
            if (t3) {
              var u2, c2 = e3.splitSpaces ? (function(e4, t4) {
                if (e4.length > 1 && !/  /.test(e4)) return e4;
                for (var n4 = t4, i3 = "", r3 = 0; r3 < e4.length; r3++) {
                  var o3 = e4.charAt(r3);
                  " " != o3 || !n4 || r3 != e4.length - 1 && 32 != e4.charCodeAt(r3 + 1) || (o3 = "\xA0"), i3 += o3, n4 = " " == o3;
                }
                return i3;
              })(t3, e3.trailingSpace) : t3, d2 = e3.cm.state.specialChars, h2 = false;
              if (d2.test(t3)) {
                u2 = document.createDocumentFragment();
                for (var f2 = 0; ; ) {
                  d2.lastIndex = f2;
                  var p2 = d2.exec(t3), m2 = p2 ? p2.index - f2 : t3.length - f2;
                  if (m2) {
                    var g2 = document.createTextNode(c2.slice(f2, f2 + m2));
                    a && l < 9 ? u2.appendChild(T("span", [g2])) : u2.appendChild(g2), e3.map.push(e3.pos, e3.pos + m2, g2), e3.col += m2, e3.pos += m2;
                  }
                  if (!p2) break;
                  f2 += m2 + 1;
                  var v2 = void 0;
                  if ("	" == p2[0]) {
                    var x2 = e3.cm.options.tabSize, y2 = x2 - e3.col % x2;
                    (v2 = u2.appendChild(T("span", Z(y2), "cm-tab"))).setAttribute("role", "presentation"), v2.setAttribute("cm-text", "	"), e3.col += y2;
                  } else "\r" == p2[0] || "\n" == p2[0] ? ((v2 = u2.appendChild(T("span", "\r" == p2[0] ? "\u240D" : "\u2424", "cm-invalidchar"))).setAttribute("cm-text", p2[0]), e3.col += 1) : ((v2 = e3.cm.options.specialCharPlaceholder(p2[0])).setAttribute("cm-text", p2[0]), a && l < 9 ? u2.appendChild(T("span", [v2])) : u2.appendChild(v2), e3.col += 1);
                  e3.map.push(e3.pos, e3.pos + 1, v2), e3.pos++;
                }
              } else e3.col += t3.length, u2 = document.createTextNode(c2), e3.map.push(e3.pos, e3.pos + t3.length, u2), a && l < 9 && (h2 = true), e3.pos += t3.length;
              if (e3.trailingSpace = 32 == c2.charCodeAt(t3.length - 1), n3 || i2 || r2 || h2 || o2 || s2) {
                var b2 = n3 || "";
                i2 && (b2 += i2), r2 && (b2 += r2);
                var D2 = T("span", [u2], b2, o2);
                if (s2) for (var C2 in s2) s2.hasOwnProperty(C2) && "style" != C2 && "class" != C2 && D2.setAttribute(C2, s2[C2]);
                return e3.content.appendChild(D2);
              }
              e3.content.appendChild(u2);
            }
          }
          function rn(e3, t3) {
            return function(n3, i2, r2, o2, a2, l2, s2) {
              r2 = r2 ? r2 + " cm-force-border" : "cm-force-border";
              for (var u2 = n3.pos, c2 = u2 + i2.length; ; ) {
                for (var d2 = void 0, h2 = 0; h2 < t3.length && !((d2 = t3[h2]).to > u2 && d2.from <= u2); h2++) ;
                if (d2.to >= c2) return e3(n3, i2, r2, o2, a2, l2, s2);
                e3(n3, i2.slice(0, d2.to - u2), r2, o2, null, l2, s2), o2 = null, i2 = i2.slice(d2.to - u2), u2 = d2.to;
              }
            };
          }
          function on(e3, t3, n3, i2) {
            var r2 = !i2 && n3.widgetNode;
            r2 && e3.map.push(e3.pos, e3.pos + t3, r2), !i2 && e3.cm.display.input.needsContentAttribute && (r2 || (r2 = e3.content.appendChild(document.createElement("span"))), r2.setAttribute("cm-marker", n3.id)), r2 && (e3.cm.display.input.setUneditable(r2), e3.content.appendChild(r2)), e3.pos += t3, e3.trailingSpace = false;
          }
          function an(e3, t3, n3) {
            var i2 = e3.markedSpans, r2 = e3.text, o2 = 0;
            if (i2) for (var a2, l2, s2, u2, c2, d2, h2, f2 = r2.length, p2 = 0, m2 = 1, g2 = "", v2 = 0; ; ) {
              if (v2 == p2) {
                s2 = u2 = c2 = l2 = "", h2 = null, d2 = null, v2 = 1 / 0;
                for (var x2 = [], y2 = void 0, b2 = 0; b2 < i2.length; ++b2) {
                  var D2 = i2[b2], C2 = D2.marker;
                  if ("bookmark" == C2.type && D2.from == p2 && C2.widgetNode) x2.push(C2);
                  else if (D2.from <= p2 && (null == D2.to || D2.to > p2 || C2.collapsed && D2.to == p2 && D2.from == p2)) {
                    if (null != D2.to && D2.to != p2 && v2 > D2.to && (v2 = D2.to, u2 = ""), C2.className && (s2 += " " + C2.className), C2.css && (l2 = (l2 ? l2 + ";" : "") + C2.css), C2.startStyle && D2.from == p2 && (c2 += " " + C2.startStyle), C2.endStyle && D2.to == v2 && (y2 || (y2 = [])).push(C2.endStyle, D2.to), C2.title && ((h2 || (h2 = {})).title = C2.title), C2.attributes) for (var w2 in C2.attributes) (h2 || (h2 = {}))[w2] = C2.attributes[w2];
                    C2.collapsed && (!d2 || It(d2.marker, C2) < 0) && (d2 = D2);
                  } else D2.from > p2 && v2 > D2.from && (v2 = D2.from);
                }
                if (y2) for (var k2 = 0; k2 < y2.length; k2 += 2) y2[k2 + 1] == v2 && (u2 += " " + y2[k2]);
                if (!d2 || d2.from == p2) for (var S2 = 0; S2 < x2.length; ++S2) on(t3, 0, x2[S2]);
                if (d2 && (d2.from || 0) == p2) {
                  if (on(t3, (null == d2.to ? f2 + 1 : d2.to) - p2, d2.marker, null == d2.from), null == d2.to) return;
                  d2.to == p2 && (d2 = false);
                }
              }
              if (p2 >= f2) break;
              for (var F2 = Math.min(f2, v2); ; ) {
                if (g2) {
                  var A2 = p2 + g2.length;
                  if (!d2) {
                    var E2 = A2 > F2 ? g2.slice(0, F2 - p2) : g2;
                    t3.addToken(t3, E2, a2 ? a2 + s2 : s2, c2, p2 + E2.length == v2 ? u2 : "", l2, h2);
                  }
                  if (A2 >= F2) {
                    g2 = g2.slice(F2 - p2), p2 = F2;
                    break;
                  }
                  p2 = A2, c2 = "";
                }
                g2 = r2.slice(o2, o2 = n3[m2++]), a2 = Jt(n3[m2++], t3.cm.options);
              }
            }
            else for (var L2 = 1; L2 < n3.length; L2 += 2) t3.addToken(t3, r2.slice(o2, o2 = n3[L2]), Jt(n3[L2 + 1], t3.cm.options));
          }
          function ln(e3, t3, n3) {
            this.line = t3, this.rest = (function(e4) {
              for (var t4, n4; t4 = Rt(e4); ) e4 = t4.find(1, true).line, (n4 || (n4 = [])).push(e4);
              return n4;
            })(t3), this.size = this.rest ? Je(Y(this.rest)) - n3 + 1 : 1, this.node = this.text = null, this.hidden = Ut(e3, t3);
          }
          function sn(e3, t3, n3) {
            for (var i2, r2 = [], o2 = t3; o2 < n3; o2 = i2) {
              var a2 = new ln(e3.doc, Ke(e3.doc, o2), o2);
              i2 = o2 + a2.size, r2.push(a2);
            }
            return r2;
          }
          var un = null;
          var cn = null;
          function dn(e3, t3) {
            var n3 = me(e3, t3);
            if (n3.length) {
              var i2, r2 = Array.prototype.slice.call(arguments, 2);
              un ? i2 = un.delayedCallbacks : cn ? i2 = cn : (i2 = cn = [], setTimeout(hn, 0));
              for (var o2 = function(e4) {
                i2.push((function() {
                  return n3[e4].apply(null, r2);
                }));
              }, a2 = 0; a2 < n3.length; ++a2) o2(a2);
            }
          }
          function hn() {
            var e3 = cn;
            cn = null;
            for (var t3 = 0; t3 < e3.length; ++t3) e3[t3]();
          }
          function fn(e3, t3, n3, i2) {
            for (var r2 = 0; r2 < t3.changes.length; r2++) {
              var o2 = t3.changes[r2];
              "text" == o2 ? gn(e3, t3) : "gutter" == o2 ? xn(e3, t3, n3, i2) : "class" == o2 ? vn(e3, t3) : "widget" == o2 && yn(e3, t3, i2);
            }
            t3.changes = null;
          }
          function pn(e3) {
            return e3.node == e3.text && (e3.node = T("div", null, null, "position: relative"), e3.text.parentNode && e3.text.parentNode.replaceChild(e3.node, e3.text), e3.node.appendChild(e3.text), a && l < 8 && (e3.node.style.zIndex = 2)), e3.node;
          }
          function mn(e3, t3) {
            var n3 = e3.display.externalMeasured;
            return n3 && n3.line == t3.line ? (e3.display.externalMeasured = null, t3.measure = n3.measure, n3.built) : en(e3, t3);
          }
          function gn(e3, t3) {
            var n3 = t3.text.className, i2 = mn(e3, t3);
            t3.text == t3.node && (t3.node = i2.pre), t3.text.parentNode.replaceChild(i2.pre, t3.text), t3.text = i2.pre, i2.bgClass != t3.bgClass || i2.textClass != t3.textClass ? (t3.bgClass = i2.bgClass, t3.textClass = i2.textClass, vn(e3, t3)) : n3 && (t3.text.className = n3);
          }
          function vn(e3, t3) {
            !(function(e4, t4) {
              var n4 = t4.bgClass ? t4.bgClass + " " + (t4.line.bgClass || "") : t4.line.bgClass;
              if (n4 && (n4 += " CodeMirror-linebackground"), t4.background) n4 ? t4.background.className = n4 : (t4.background.parentNode.removeChild(t4.background), t4.background = null);
              else if (n4) {
                var i2 = pn(t4);
                t4.background = i2.insertBefore(T("div", null, n4), i2.firstChild), e4.display.input.setUneditable(t4.background);
              }
            })(e3, t3), t3.line.wrapClass ? pn(t3).className = t3.line.wrapClass : t3.node != t3.text && (t3.node.className = "");
            var n3 = t3.textClass ? t3.textClass + " " + (t3.line.textClass || "") : t3.line.textClass;
            t3.text.className = n3 || "";
          }
          function xn(e3, t3, n3, i2) {
            if (t3.gutter && (t3.node.removeChild(t3.gutter), t3.gutter = null), t3.gutterBackground && (t3.node.removeChild(t3.gutterBackground), t3.gutterBackground = null), t3.line.gutterClass) {
              var r2 = pn(t3);
              t3.gutterBackground = T("div", null, "CodeMirror-gutter-background " + t3.line.gutterClass, "left: " + (e3.options.fixedGutter ? i2.fixedPos : -i2.gutterTotalWidth) + "px; width: " + i2.gutterTotalWidth + "px"), e3.display.input.setUneditable(t3.gutterBackground), r2.insertBefore(t3.gutterBackground, t3.text);
            }
            var o2 = t3.line.gutterMarkers;
            if (e3.options.lineNumbers || o2) {
              var a2 = pn(t3), l2 = t3.gutter = T("div", null, "CodeMirror-gutter-wrapper", "left: " + (e3.options.fixedGutter ? i2.fixedPos : -i2.gutterTotalWidth) + "px");
              if (l2.setAttribute("aria-hidden", "true"), e3.display.input.setUneditable(l2), a2.insertBefore(l2, t3.text), t3.line.gutterClass && (l2.className += " " + t3.line.gutterClass), !e3.options.lineNumbers || o2 && o2["CodeMirror-linenumbers"] || (t3.lineNumber = l2.appendChild(T("div", nt(e3.options, n3), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + i2.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e3.display.lineNumInnerWidth + "px"))), o2) for (var s2 = 0; s2 < e3.display.gutterSpecs.length; ++s2) {
                var u2 = e3.display.gutterSpecs[s2].className, c2 = o2.hasOwnProperty(u2) && o2[u2];
                c2 && l2.appendChild(T("div", [c2], "CodeMirror-gutter-elt", "left: " + i2.gutterLeft[u2] + "px; width: " + i2.gutterWidth[u2] + "px"));
              }
            }
          }
          function yn(e3, t3, n3) {
            t3.alignable && (t3.alignable = null);
            for (var i2 = S("CodeMirror-linewidget"), r2 = t3.node.firstChild, o2 = void 0; r2; r2 = o2) o2 = r2.nextSibling, i2.test(r2.className) && t3.node.removeChild(r2);
            Dn(e3, t3, n3);
          }
          function bn(e3, t3, n3, i2) {
            var r2 = mn(e3, t3);
            return t3.text = t3.node = r2.pre, r2.bgClass && (t3.bgClass = r2.bgClass), r2.textClass && (t3.textClass = r2.textClass), vn(e3, t3), xn(e3, t3, n3, i2), Dn(e3, t3, i2), t3.node;
          }
          function Dn(e3, t3, n3) {
            if (Cn(e3, t3.line, t3, n3, true), t3.rest) for (var i2 = 0; i2 < t3.rest.length; i2++) Cn(e3, t3.rest[i2], t3, n3, false);
          }
          function Cn(e3, t3, n3, i2, r2) {
            if (t3.widgets) for (var o2 = pn(n3), a2 = 0, l2 = t3.widgets; a2 < l2.length; ++a2) {
              var s2 = l2[a2], u2 = T("div", [s2.node], "CodeMirror-linewidget" + (s2.className ? " " + s2.className : ""));
              s2.handleMouseEvents || u2.setAttribute("cm-ignore-events", "true"), wn(s2, u2, n3, i2), e3.display.input.setUneditable(u2), r2 && s2.above ? o2.insertBefore(u2, n3.gutter || n3.text) : o2.appendChild(u2), dn(s2, "redraw");
            }
          }
          function wn(e3, t3, n3, i2) {
            if (e3.noHScroll) {
              (n3.alignable || (n3.alignable = [])).push(t3);
              var r2 = i2.wrapperWidth;
              t3.style.left = i2.fixedPos + "px", e3.coverGutter || (r2 -= i2.gutterTotalWidth, t3.style.paddingLeft = i2.gutterTotalWidth + "px"), t3.style.width = r2 + "px";
            }
            e3.coverGutter && (t3.style.zIndex = 5, t3.style.position = "relative", e3.noHScroll || (t3.style.marginLeft = -i2.gutterTotalWidth + "px"));
          }
          function kn(e3) {
            if (null != e3.height) return e3.height;
            var t3 = e3.doc.cm;
            if (!t3) return 0;
            if (!B(document.body, e3.node)) {
              var n3 = "position: relative;";
              e3.coverGutter && (n3 += "margin-left: -" + t3.display.gutters.offsetWidth + "px;"), e3.noHScroll && (n3 += "width: " + t3.display.wrapper.clientWidth + "px;"), L(t3.display.measure, T("div", [e3.node], null, n3));
            }
            return e3.height = e3.node.parentNode.offsetHeight;
          }
          function Sn(e3, t3) {
            for (var n3 = Fe(t3); n3 != e3.wrapper; n3 = n3.parentNode) if (!n3 || 1 == n3.nodeType && "true" == n3.getAttribute("cm-ignore-events") || n3.parentNode == e3.sizer && n3 != e3.mover) return true;
          }
          function Fn(e3) {
            return e3.lineSpace.offsetTop;
          }
          function An(e3) {
            return e3.mover.offsetHeight - e3.lineSpace.offsetHeight;
          }
          function En(e3) {
            if (e3.cachedPaddingH) return e3.cachedPaddingH;
            var t3 = L(e3.measure, T("pre", "x", "CodeMirror-line-like")), n3 = window.getComputedStyle ? window.getComputedStyle(t3) : t3.currentStyle, i2 = { left: parseInt(n3.paddingLeft), right: parseInt(n3.paddingRight) };
            return isNaN(i2.left) || isNaN(i2.right) || (e3.cachedPaddingH = i2), i2;
          }
          function Ln(e3) {
            return 50 - e3.display.nativeBarWidth;
          }
          function Tn(e3) {
            return e3.display.scroller.clientWidth - Ln(e3) - e3.display.barWidth;
          }
          function Mn(e3) {
            return e3.display.scroller.clientHeight - Ln(e3) - e3.display.barHeight;
          }
          function Bn(e3, t3, n3) {
            if (e3.line == t3) return { map: e3.measure.map, cache: e3.measure.cache };
            if (e3.rest) {
              for (var i2 = 0; i2 < e3.rest.length; i2++) if (e3.rest[i2] == t3) return { map: e3.measure.maps[i2], cache: e3.measure.caches[i2] };
              for (var r2 = 0; r2 < e3.rest.length; r2++) if (Je(e3.rest[r2]) > n3) return { map: e3.measure.maps[r2], cache: e3.measure.caches[r2], before: true };
            }
          }
          function Nn(e3, t3, n3, i2) {
            return zn(e3, In(e3, t3), n3, i2);
          }
          function On(e3, t3) {
            if (t3 >= e3.display.viewFrom && t3 < e3.display.viewTo) return e3.display.view[fi(e3, t3)];
            var n3 = e3.display.externalMeasured;
            return n3 && t3 >= n3.lineN && t3 < n3.lineN + n3.size ? n3 : void 0;
          }
          function In(e3, t3) {
            var n3 = Je(t3), i2 = On(e3, n3);
            i2 && !i2.text ? i2 = null : i2 && i2.changes && (fn(e3, i2, n3, si(e3)), e3.curOp.forceUpdate = true), i2 || (i2 = (function(e4, t4) {
              var n4 = Je(t4 = Wt(t4)), i3 = e4.display.externalMeasured = new ln(e4.doc, t4, n4);
              i3.lineN = n4;
              var r3 = i3.built = en(e4, i3);
              return i3.text = r3.pre, L(e4.display.lineMeasure, r3.pre), i3;
            })(e3, t3));
            var r2 = Bn(i2, t3, n3);
            return { line: t3, view: i2, rect: null, map: r2.map, cache: r2.cache, before: r2.before, hasHeights: false };
          }
          function zn(e3, t3, n3, i2, r2) {
            t3.before && (n3 = -1);
            var o2, s2 = n3 + (i2 || "");
            return t3.cache.hasOwnProperty(s2) ? o2 = t3.cache[s2] : (t3.rect || (t3.rect = t3.view.text.getBoundingClientRect()), t3.hasHeights || (!(function(e4, t4, n4) {
              var i3 = e4.options.lineWrapping, r3 = i3 && Tn(e4);
              if (!t4.measure.heights || i3 && t4.measure.width != r3) {
                var o3 = t4.measure.heights = [];
                if (i3) {
                  t4.measure.width = r3;
                  for (var a2 = t4.text.firstChild.getClientRects(), l2 = 0; l2 < a2.length - 1; l2++) {
                    var s3 = a2[l2], u2 = a2[l2 + 1];
                    Math.abs(s3.bottom - u2.bottom) > 2 && o3.push((s3.bottom + u2.top) / 2 - n4.top);
                  }
                }
                o3.push(n4.bottom - n4.top);
              }
            })(e3, t3.view, t3.rect), t3.hasHeights = true), o2 = (function(e4, t4, n4, i3) {
              var r3, o3 = Pn(t4.map, n4, i3), s3 = o3.node, u2 = o3.start, c2 = o3.end, d2 = o3.collapse;
              if (3 == s3.nodeType) {
                for (var h2 = 0; h2 < 4; h2++) {
                  for (; u2 && ae(t4.line.text.charAt(o3.coverStart + u2)); ) --u2;
                  for (; o3.coverStart + c2 < o3.coverEnd && ae(t4.line.text.charAt(o3.coverStart + c2)); ) ++c2;
                  if ((r3 = a && l < 9 && 0 == u2 && c2 == o3.coverEnd - o3.coverStart ? s3.parentNode.getBoundingClientRect() : _n(F(s3, u2, c2).getClientRects(), i3)).left || r3.right || 0 == u2) break;
                  c2 = u2, u2 -= 1, d2 = "right";
                }
                a && l < 11 && (r3 = (function(e5, t5) {
                  if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !(function(e6) {
                    if (null != He) return He;
                    var t6 = L(e6, T("span", "x")), n6 = t6.getBoundingClientRect(), i5 = F(t6, 0, 1).getBoundingClientRect();
                    return He = Math.abs(n6.left - i5.left) > 1;
                  })(e5)) return t5;
                  var n5 = screen.logicalXDPI / screen.deviceXDPI, i4 = screen.logicalYDPI / screen.deviceYDPI;
                  return { left: t5.left * n5, right: t5.right * n5, top: t5.top * i4, bottom: t5.bottom * i4 };
                })(e4.display.measure, r3));
              } else {
                var f2;
                u2 > 0 && (d2 = i3 = "right"), r3 = e4.options.lineWrapping && (f2 = s3.getClientRects()).length > 1 ? f2["right" == i3 ? f2.length - 1 : 0] : s3.getBoundingClientRect();
              }
              if (a && l < 9 && !u2 && (!r3 || !r3.left && !r3.right)) {
                var p2 = s3.parentNode.getClientRects()[0];
                r3 = p2 ? { left: p2.left, right: p2.left + li(e4.display), top: p2.top, bottom: p2.bottom } : Rn;
              }
              for (var m2 = r3.top - t4.rect.top, g2 = r3.bottom - t4.rect.top, v2 = (m2 + g2) / 2, x2 = t4.view.measure.heights, y2 = 0; y2 < x2.length - 1 && !(v2 < x2[y2]); y2++) ;
              var b2 = y2 ? x2[y2 - 1] : 0, D2 = x2[y2], C2 = { left: ("right" == d2 ? r3.right : r3.left) - t4.rect.left, right: ("left" == d2 ? r3.left : r3.right) - t4.rect.left, top: b2, bottom: D2 };
              r3.left || r3.right || (C2.bogus = true);
              e4.options.singleCursorHeightPerLine || (C2.rtop = m2, C2.rbottom = g2);
              return C2;
            })(e3, t3, n3, i2), o2.bogus || (t3.cache[s2] = o2)), { left: o2.left, right: o2.right, top: r2 ? o2.rtop : o2.top, bottom: r2 ? o2.rbottom : o2.bottom };
          }
          var Hn, Rn = { left: 0, right: 0, top: 0, bottom: 0 };
          function Pn(e3, t3, n3) {
            for (var i2, r2, o2, a2, l2, s2, u2 = 0; u2 < e3.length; u2 += 3) if (l2 = e3[u2], s2 = e3[u2 + 1], t3 < l2 ? (r2 = 0, o2 = 1, a2 = "left") : t3 < s2 ? o2 = (r2 = t3 - l2) + 1 : (u2 == e3.length - 3 || t3 == s2 && e3[u2 + 3] > t3) && (r2 = (o2 = s2 - l2) - 1, t3 >= s2 && (a2 = "right")), null != r2) {
              if (i2 = e3[u2 + 2], l2 == s2 && n3 == (i2.insertLeft ? "left" : "right") && (a2 = n3), "left" == n3 && 0 == r2) for (; u2 && e3[u2 - 2] == e3[u2 - 3] && e3[u2 - 1].insertLeft; ) i2 = e3[2 + (u2 -= 3)], a2 = "left";
              if ("right" == n3 && r2 == s2 - l2) for (; u2 < e3.length - 3 && e3[u2 + 3] == e3[u2 + 4] && !e3[u2 + 5].insertLeft; ) i2 = e3[(u2 += 3) + 2], a2 = "right";
              break;
            }
            return { node: i2, start: r2, end: o2, collapse: a2, coverStart: l2, coverEnd: s2 };
          }
          function _n(e3, t3) {
            var n3 = Rn;
            if ("left" == t3) for (var i2 = 0; i2 < e3.length && (n3 = e3[i2]).left == n3.right; i2++) ;
            else for (var r2 = e3.length - 1; r2 >= 0 && (n3 = e3[r2]).left == n3.right; r2--) ;
            return n3;
          }
          function Wn(e3) {
            if (e3.measure && (e3.measure.cache = {}, e3.measure.heights = null, e3.rest)) for (var t3 = 0; t3 < e3.rest.length; t3++) e3.measure.caches[t3] = {};
          }
          function jn(e3) {
            e3.display.externalMeasure = null, E(e3.display.lineMeasure);
            for (var t3 = 0; t3 < e3.display.view.length; t3++) Wn(e3.display.view[t3]);
          }
          function qn(e3) {
            jn(e3), e3.display.cachedCharWidth = e3.display.cachedTextHeight = e3.display.cachedPaddingH = null, e3.options.lineWrapping || (e3.display.maxLineChanged = true), e3.display.lineNumChars = null;
          }
          function Un(e3) {
            return c && v ? -(e3.body.getBoundingClientRect().left - parseInt(getComputedStyle(e3.body).marginLeft)) : e3.defaultView.pageXOffset || (e3.documentElement || e3.body).scrollLeft;
          }
          function $n(e3) {
            return c && v ? -(e3.body.getBoundingClientRect().top - parseInt(getComputedStyle(e3.body).marginTop)) : e3.defaultView.pageYOffset || (e3.documentElement || e3.body).scrollTop;
          }
          function Gn(e3) {
            var t3 = Wt(e3).widgets, n3 = 0;
            if (t3) for (var i2 = 0; i2 < t3.length; ++i2) t3[i2].above && (n3 += kn(t3[i2]));
            return n3;
          }
          function Vn(e3, t3, n3, i2, r2) {
            if (!r2) {
              var o2 = Gn(t3);
              n3.top += o2, n3.bottom += o2;
            }
            if ("line" == i2) return n3;
            i2 || (i2 = "local");
            var a2 = Gt(t3);
            if ("local" == i2 ? a2 += Fn(e3.display) : a2 -= e3.display.viewOffset, "page" == i2 || "window" == i2) {
              var l2 = e3.display.lineSpace.getBoundingClientRect();
              a2 += l2.top + ("window" == i2 ? 0 : $n(H(e3)));
              var s2 = l2.left + ("window" == i2 ? 0 : Un(H(e3)));
              n3.left += s2, n3.right += s2;
            }
            return n3.top += a2, n3.bottom += a2, n3;
          }
          function Xn(e3, t3, n3) {
            if ("div" == n3) return t3;
            var i2 = t3.left, r2 = t3.top;
            if ("page" == n3) i2 -= Un(H(e3)), r2 -= $n(H(e3));
            else if ("local" == n3 || !n3) {
              var o2 = e3.display.sizer.getBoundingClientRect();
              i2 += o2.left, r2 += o2.top;
            }
            var a2 = e3.display.lineSpace.getBoundingClientRect();
            return { left: i2 - a2.left, top: r2 - a2.top };
          }
          function Kn(e3, t3, n3, i2, r2) {
            return i2 || (i2 = Ke(e3.doc, t3.line)), Vn(e3, i2, Nn(e3, i2, t3.ch, r2), n3);
          }
          function Zn(e3, t3, n3, i2, r2, o2) {
            function a2(t4, a3) {
              var l3 = zn(e3, r2, t4, a3 ? "right" : "left", o2);
              return a3 ? l3.left = l3.right : l3.right = l3.left, Vn(e3, i2, l3, n3);
            }
            i2 = i2 || Ke(e3.doc, t3.line), r2 || (r2 = In(e3, i2));
            var l2 = he(i2, e3.doc.direction), s2 = t3.ch, u2 = t3.sticky;
            if (s2 >= i2.text.length ? (s2 = i2.text.length, u2 = "before") : s2 <= 0 && (s2 = 0, u2 = "after"), !l2) return a2("before" == u2 ? s2 - 1 : s2, "before" == u2);
            function c2(e4, t4, n4) {
              return a2(n4 ? e4 - 1 : e4, 1 == l2[t4].level != n4);
            }
            var d2 = ce(l2, s2, u2), h2 = ue, f2 = c2(s2, d2, "before" == u2);
            return null != h2 && (f2.other = c2(s2, h2, "before" != u2)), f2;
          }
          function Yn(e3, t3) {
            var n3 = 0;
            t3 = ct(e3.doc, t3), e3.options.lineWrapping || (n3 = li(e3.display) * t3.ch);
            var i2 = Ke(e3.doc, t3.line), r2 = Gt(i2) + Fn(e3.display);
            return { left: n3, right: n3, top: r2, bottom: r2 + i2.height };
          }
          function Qn(e3, t3, n3, i2, r2) {
            var o2 = it(e3, t3, n3);
            return o2.xRel = r2, i2 && (o2.outside = i2), o2;
          }
          function Jn(e3, t3, n3) {
            var i2 = e3.doc;
            if ((n3 += e3.display.viewOffset) < 0) return Qn(i2.first, 0, null, -1, -1);
            var r2 = et(i2, n3), o2 = i2.first + i2.size - 1;
            if (r2 > o2) return Qn(i2.first + i2.size - 1, Ke(i2, o2).text.length, null, 1, 1);
            t3 < 0 && (t3 = 0);
            for (var a2 = Ke(i2, r2); ; ) {
              var l2 = ii(e3, a2, r2, t3, n3), s2 = Pt(a2, l2.ch + (l2.xRel > 0 || l2.outside > 0 ? 1 : 0));
              if (!s2) return l2;
              var u2 = s2.find(1);
              if (u2.line == r2) return u2;
              a2 = Ke(i2, r2 = u2.line);
            }
          }
          function ei(e3, t3, n3, i2) {
            i2 -= Gn(t3);
            var r2 = t3.text.length, o2 = se((function(t4) {
              return zn(e3, n3, t4 - 1).bottom <= i2;
            }), r2, 0);
            return { begin: o2, end: r2 = se((function(t4) {
              return zn(e3, n3, t4).top > i2;
            }), o2, r2) };
          }
          function ti(e3, t3, n3, i2) {
            return n3 || (n3 = In(e3, t3)), ei(e3, t3, n3, Vn(e3, t3, zn(e3, n3, i2), "line").top);
          }
          function ni(e3, t3, n3, i2) {
            return !(e3.bottom <= n3) && (e3.top > n3 || (i2 ? e3.left : e3.right) > t3);
          }
          function ii(e3, t3, n3, i2, r2) {
            r2 -= Gt(t3);
            var o2 = In(e3, t3), a2 = Gn(t3), l2 = 0, s2 = t3.text.length, u2 = true, c2 = he(t3, e3.doc.direction);
            if (c2) {
              var d2 = (e3.options.lineWrapping ? oi : ri)(e3, t3, n3, o2, c2, i2, r2);
              l2 = (u2 = 1 != d2.level) ? d2.from : d2.to - 1, s2 = u2 ? d2.to : d2.from - 1;
            }
            var h2, f2, p2 = null, m2 = null, g2 = se((function(t4) {
              var n4 = zn(e3, o2, t4);
              return n4.top += a2, n4.bottom += a2, !!ni(n4, i2, r2, false) && (n4.top <= r2 && n4.left <= i2 && (p2 = t4, m2 = n4), true);
            }), l2, s2), v2 = false;
            if (m2) {
              var x2 = i2 - m2.left < m2.right - i2, y2 = x2 == u2;
              g2 = p2 + (y2 ? 0 : 1), f2 = y2 ? "after" : "before", h2 = x2 ? m2.left : m2.right;
            } else {
              u2 || g2 != s2 && g2 != l2 || g2++, f2 = 0 == g2 ? "after" : g2 == t3.text.length ? "before" : zn(e3, o2, g2 - (u2 ? 1 : 0)).bottom + a2 <= r2 == u2 ? "after" : "before";
              var b2 = Zn(e3, it(n3, g2, f2), "line", t3, o2);
              h2 = b2.left, v2 = r2 < b2.top ? -1 : r2 >= b2.bottom ? 1 : 0;
            }
            return Qn(n3, g2 = le(t3.text, g2, 1), f2, v2, i2 - h2);
          }
          function ri(e3, t3, n3, i2, r2, o2, a2) {
            var l2 = se((function(l3) {
              var s3 = r2[l3], u3 = 1 != s3.level;
              return ni(Zn(e3, it(n3, u3 ? s3.to : s3.from, u3 ? "before" : "after"), "line", t3, i2), o2, a2, true);
            }), 0, r2.length - 1), s2 = r2[l2];
            if (l2 > 0) {
              var u2 = 1 != s2.level, c2 = Zn(e3, it(n3, u2 ? s2.from : s2.to, u2 ? "after" : "before"), "line", t3, i2);
              ni(c2, o2, a2, true) && c2.top > a2 && (s2 = r2[l2 - 1]);
            }
            return s2;
          }
          function oi(e3, t3, n3, i2, r2, o2, a2) {
            var l2 = ei(e3, t3, i2, a2), s2 = l2.begin, u2 = l2.end;
            /\s/.test(t3.text.charAt(u2 - 1)) && u2--;
            for (var c2 = null, d2 = null, h2 = 0; h2 < r2.length; h2++) {
              var f2 = r2[h2];
              if (!(f2.from >= u2 || f2.to <= s2)) {
                var p2 = zn(e3, i2, 1 != f2.level ? Math.min(u2, f2.to) - 1 : Math.max(s2, f2.from)).right, m2 = p2 < o2 ? o2 - p2 + 1e9 : p2 - o2;
                (!c2 || d2 > m2) && (c2 = f2, d2 = m2);
              }
            }
            return c2 || (c2 = r2[r2.length - 1]), c2.from < s2 && (c2 = { from: s2, to: c2.to, level: c2.level }), c2.to > u2 && (c2 = { from: c2.from, to: u2, level: c2.level }), c2;
          }
          function ai(e3) {
            if (null != e3.cachedTextHeight) return e3.cachedTextHeight;
            if (null == Hn) {
              Hn = T("pre", null, "CodeMirror-line-like");
              for (var t3 = 0; t3 < 49; ++t3) Hn.appendChild(document.createTextNode("x")), Hn.appendChild(T("br"));
              Hn.appendChild(document.createTextNode("x"));
            }
            L(e3.measure, Hn);
            var n3 = Hn.offsetHeight / 50;
            return n3 > 3 && (e3.cachedTextHeight = n3), E(e3.measure), n3 || 1;
          }
          function li(e3) {
            if (null != e3.cachedCharWidth) return e3.cachedCharWidth;
            var t3 = T("span", "xxxxxxxxxx"), n3 = T("pre", [t3], "CodeMirror-line-like");
            L(e3.measure, n3);
            var i2 = t3.getBoundingClientRect(), r2 = (i2.right - i2.left) / 10;
            return r2 > 2 && (e3.cachedCharWidth = r2), r2 || 10;
          }
          function si(e3) {
            for (var t3 = e3.display, n3 = {}, i2 = {}, r2 = t3.gutters.clientLeft, o2 = t3.gutters.firstChild, a2 = 0; o2; o2 = o2.nextSibling, ++a2) {
              var l2 = e3.display.gutterSpecs[a2].className;
              n3[l2] = o2.offsetLeft + o2.clientLeft + r2, i2[l2] = o2.clientWidth;
            }
            return { fixedPos: ui(t3), gutterTotalWidth: t3.gutters.offsetWidth, gutterLeft: n3, gutterWidth: i2, wrapperWidth: t3.wrapper.clientWidth };
          }
          function ui(e3) {
            return e3.scroller.getBoundingClientRect().left - e3.sizer.getBoundingClientRect().left;
          }
          function ci(e3) {
            var t3 = ai(e3.display), n3 = e3.options.lineWrapping, i2 = n3 && Math.max(5, e3.display.scroller.clientWidth / li(e3.display) - 3);
            return function(r2) {
              if (Ut(e3.doc, r2)) return 0;
              var o2 = 0;
              if (r2.widgets) for (var a2 = 0; a2 < r2.widgets.length; a2++) r2.widgets[a2].height && (o2 += r2.widgets[a2].height);
              return n3 ? o2 + (Math.ceil(r2.text.length / i2) || 1) * t3 : o2 + t3;
            };
          }
          function di(e3) {
            var t3 = e3.doc, n3 = ci(e3);
            t3.iter((function(e4) {
              var t4 = n3(e4);
              t4 != e4.height && Qe(e4, t4);
            }));
          }
          function hi(e3, t3, n3, i2) {
            var r2 = e3.display;
            if (!n3 && "true" == Fe(t3).getAttribute("cm-not-content")) return null;
            var o2, a2, l2 = r2.lineSpace.getBoundingClientRect();
            try {
              o2 = t3.clientX - l2.left, a2 = t3.clientY - l2.top;
            } catch (e4) {
              return null;
            }
            var s2, u2 = Jn(e3, o2, a2);
            if (i2 && u2.xRel > 0 && (s2 = Ke(e3.doc, u2.line).text).length == u2.ch) {
              var c2 = W(s2, s2.length, e3.options.tabSize) - s2.length;
              u2 = it(u2.line, Math.max(0, Math.round((o2 - En(e3.display).left) / li(e3.display)) - c2));
            }
            return u2;
          }
          function fi(e3, t3) {
            if (t3 >= e3.display.viewTo) return null;
            if ((t3 -= e3.display.viewFrom) < 0) return null;
            for (var n3 = e3.display.view, i2 = 0; i2 < n3.length; i2++) if ((t3 -= n3[i2].size) < 0) return i2;
          }
          function pi(e3, t3, n3, i2) {
            null == t3 && (t3 = e3.doc.first), null == n3 && (n3 = e3.doc.first + e3.doc.size), i2 || (i2 = 0);
            var r2 = e3.display;
            if (i2 && n3 < r2.viewTo && (null == r2.updateLineNumbers || r2.updateLineNumbers > t3) && (r2.updateLineNumbers = t3), e3.curOp.viewChanged = true, t3 >= r2.viewTo) St && jt(e3.doc, t3) < r2.viewTo && gi(e3);
            else if (n3 <= r2.viewFrom) St && qt(e3.doc, n3 + i2) > r2.viewFrom ? gi(e3) : (r2.viewFrom += i2, r2.viewTo += i2);
            else if (t3 <= r2.viewFrom && n3 >= r2.viewTo) gi(e3);
            else if (t3 <= r2.viewFrom) {
              var o2 = vi(e3, n3, n3 + i2, 1);
              o2 ? (r2.view = r2.view.slice(o2.index), r2.viewFrom = o2.lineN, r2.viewTo += i2) : gi(e3);
            } else if (n3 >= r2.viewTo) {
              var a2 = vi(e3, t3, t3, -1);
              a2 ? (r2.view = r2.view.slice(0, a2.index), r2.viewTo = a2.lineN) : gi(e3);
            } else {
              var l2 = vi(e3, t3, t3, -1), s2 = vi(e3, n3, n3 + i2, 1);
              l2 && s2 ? (r2.view = r2.view.slice(0, l2.index).concat(sn(e3, l2.lineN, s2.lineN)).concat(r2.view.slice(s2.index)), r2.viewTo += i2) : gi(e3);
            }
            var u2 = r2.externalMeasured;
            u2 && (n3 < u2.lineN ? u2.lineN += i2 : t3 < u2.lineN + u2.size && (r2.externalMeasured = null));
          }
          function mi(e3, t3, n3) {
            e3.curOp.viewChanged = true;
            var i2 = e3.display, r2 = e3.display.externalMeasured;
            if (r2 && t3 >= r2.lineN && t3 < r2.lineN + r2.size && (i2.externalMeasured = null), !(t3 < i2.viewFrom || t3 >= i2.viewTo)) {
              var o2 = i2.view[fi(e3, t3)];
              if (null != o2.node) {
                var a2 = o2.changes || (o2.changes = []);
                -1 == q(a2, n3) && a2.push(n3);
              }
            }
          }
          function gi(e3) {
            e3.display.viewFrom = e3.display.viewTo = e3.doc.first, e3.display.view = [], e3.display.viewOffset = 0;
          }
          function vi(e3, t3, n3, i2) {
            var r2, o2 = fi(e3, t3), a2 = e3.display.view;
            if (!St || n3 == e3.doc.first + e3.doc.size) return { index: o2, lineN: n3 };
            for (var l2 = e3.display.viewFrom, s2 = 0; s2 < o2; s2++) l2 += a2[s2].size;
            if (l2 != t3) {
              if (i2 > 0) {
                if (o2 == a2.length - 1) return null;
                r2 = l2 + a2[o2].size - t3, o2++;
              } else r2 = l2 - t3;
              t3 += r2, n3 += r2;
            }
            for (; jt(e3.doc, n3) != n3; ) {
              if (o2 == (i2 < 0 ? 0 : a2.length - 1)) return null;
              n3 += i2 * a2[o2 - (i2 < 0 ? 1 : 0)].size, o2 += i2;
            }
            return { index: o2, lineN: n3 };
          }
          function xi(e3) {
            for (var t3 = e3.display.view, n3 = 0, i2 = 0; i2 < t3.length; i2++) {
              var r2 = t3[i2];
              r2.hidden || r2.node && !r2.changes || ++n3;
            }
            return n3;
          }
          function yi(e3) {
            e3.display.input.showSelection(e3.display.input.prepareSelection());
          }
          function bi(e3, t3) {
            void 0 === t3 && (t3 = true);
            var n3 = e3.doc, i2 = {}, r2 = i2.cursors = document.createDocumentFragment(), o2 = i2.selection = document.createDocumentFragment(), a2 = e3.options.$customCursor;
            a2 && (t3 = true);
            for (var l2 = 0; l2 < n3.sel.ranges.length; l2++) if (t3 || l2 != n3.sel.primIndex) {
              var s2 = n3.sel.ranges[l2];
              if (!(s2.from().line >= e3.display.viewTo || s2.to().line < e3.display.viewFrom)) {
                var u2 = s2.empty();
                if (a2) {
                  var c2 = a2(e3, s2);
                  c2 && Di(e3, c2, r2);
                } else (u2 || e3.options.showCursorWhenSelecting) && Di(e3, s2.head, r2);
                u2 || wi(e3, s2, o2);
              }
            }
            return i2;
          }
          function Di(e3, t3, n3) {
            var i2 = Zn(e3, t3, "div", null, null, !e3.options.singleCursorHeightPerLine), r2 = n3.appendChild(T("div", "\xA0", "CodeMirror-cursor"));
            if (r2.style.left = i2.left + "px", r2.style.top = i2.top + "px", r2.style.height = Math.max(0, i2.bottom - i2.top) * e3.options.cursorHeight + "px", /\bcm-fat-cursor\b/.test(e3.getWrapperElement().className)) {
              var o2 = Kn(e3, t3, "div", null, null), a2 = o2.right - o2.left;
              r2.style.width = (a2 > 0 ? a2 : e3.defaultCharWidth()) + "px";
            }
            if (i2.other) {
              var l2 = n3.appendChild(T("div", "\xA0", "CodeMirror-cursor CodeMirror-secondarycursor"));
              l2.style.display = "", l2.style.left = i2.other.left + "px", l2.style.top = i2.other.top + "px", l2.style.height = 0.85 * (i2.other.bottom - i2.other.top) + "px";
            }
          }
          function Ci(e3, t3) {
            return e3.top - t3.top || e3.left - t3.left;
          }
          function wi(e3, t3, n3) {
            var i2 = e3.display, r2 = e3.doc, o2 = document.createDocumentFragment(), a2 = En(e3.display), l2 = a2.left, s2 = Math.max(i2.sizerWidth, Tn(e3) - i2.sizer.offsetLeft) - a2.right, u2 = "ltr" == r2.direction;
            function c2(e4, t4, n4, i3) {
              t4 < 0 && (t4 = 0), t4 = Math.round(t4), i3 = Math.round(i3), o2.appendChild(T("div", null, "CodeMirror-selected", "position: absolute; left: " + e4 + "px;\n                             top: " + t4 + "px; width: " + (null == n4 ? s2 - e4 : n4) + "px;\n                             height: " + (i3 - t4) + "px"));
            }
            function d2(t4, n4, i3) {
              var o3, a3, d3 = Ke(r2, t4), h3 = d3.text.length;
              function f3(n5, i4) {
                return Kn(e3, it(t4, n5), "div", d3, i4);
              }
              function p3(t5, n5, i4) {
                var r3 = ti(e3, d3, null, t5), o4 = "ltr" == n5 == ("after" == i4) ? "left" : "right";
                return f3("after" == i4 ? r3.begin : r3.end - (/\s/.test(d3.text.charAt(r3.end - 1)) ? 2 : 1), o4)[o4];
              }
              var m3 = he(d3, r2.direction);
              return (function(e4, t5, n5, i4) {
                if (!e4) return i4(t5, n5, "ltr", 0);
                for (var r3 = false, o4 = 0; o4 < e4.length; ++o4) {
                  var a4 = e4[o4];
                  (a4.from < n5 && a4.to > t5 || t5 == n5 && a4.to == t5) && (i4(Math.max(a4.from, t5), Math.min(a4.to, n5), 1 == a4.level ? "rtl" : "ltr", o4), r3 = true);
                }
                r3 || i4(t5, n5, "ltr");
              })(m3, n4 || 0, null == i3 ? h3 : i3, (function(e4, t5, r3, d4) {
                var g3 = "ltr" == r3, v3 = f3(e4, g3 ? "left" : "right"), x3 = f3(t5 - 1, g3 ? "right" : "left"), y2 = null == n4 && 0 == e4, b2 = null == i3 && t5 == h3, D2 = 0 == d4, C2 = !m3 || d4 == m3.length - 1;
                if (x3.top - v3.top <= 3) {
                  var w2 = (u2 ? b2 : y2) && C2, k2 = (u2 ? y2 : b2) && D2 ? l2 : (g3 ? v3 : x3).left, S2 = w2 ? s2 : (g3 ? x3 : v3).right;
                  c2(k2, v3.top, S2 - k2, v3.bottom);
                } else {
                  var F2, A2, E2, L2;
                  g3 ? (F2 = u2 && y2 && D2 ? l2 : v3.left, A2 = u2 ? s2 : p3(e4, r3, "before"), E2 = u2 ? l2 : p3(t5, r3, "after"), L2 = u2 && b2 && C2 ? s2 : x3.right) : (F2 = u2 ? p3(e4, r3, "before") : l2, A2 = !u2 && y2 && D2 ? s2 : v3.right, E2 = !u2 && b2 && C2 ? l2 : x3.left, L2 = u2 ? p3(t5, r3, "after") : s2), c2(F2, v3.top, A2 - F2, v3.bottom), v3.bottom < x3.top && c2(l2, v3.bottom, null, x3.top), c2(E2, x3.top, L2 - E2, x3.bottom);
                }
                (!o3 || Ci(v3, o3) < 0) && (o3 = v3), Ci(x3, o3) < 0 && (o3 = x3), (!a3 || Ci(v3, a3) < 0) && (a3 = v3), Ci(x3, a3) < 0 && (a3 = x3);
              })), { start: o3, end: a3 };
            }
            var h2 = t3.from(), f2 = t3.to();
            if (h2.line == f2.line) d2(h2.line, h2.ch, f2.ch);
            else {
              var p2 = Ke(r2, h2.line), m2 = Ke(r2, f2.line), g2 = Wt(p2) == Wt(m2), v2 = d2(h2.line, h2.ch, g2 ? p2.text.length + 1 : null).end, x2 = d2(f2.line, g2 ? 0 : null, f2.ch).start;
              g2 && (v2.top < x2.top - 2 ? (c2(v2.right, v2.top, null, v2.bottom), c2(l2, x2.top, x2.left, x2.bottom)) : c2(v2.right, v2.top, x2.left - v2.right, v2.bottom)), v2.bottom < x2.top && c2(l2, v2.bottom, null, x2.top);
            }
            n3.appendChild(o2);
          }
          function ki(e3) {
            if (e3.state.focused) {
              var t3 = e3.display;
              clearInterval(t3.blinker);
              var n3 = true;
              t3.cursorDiv.style.visibility = "", e3.options.cursorBlinkRate > 0 ? t3.blinker = setInterval((function() {
                e3.hasFocus() || Ei(e3), t3.cursorDiv.style.visibility = (n3 = !n3) ? "" : "hidden";
              }), e3.options.cursorBlinkRate) : e3.options.cursorBlinkRate < 0 && (t3.cursorDiv.style.visibility = "hidden");
            }
          }
          function Si(e3) {
            e3.hasFocus() || (e3.display.input.focus(), e3.state.focused || Ai(e3));
          }
          function Fi(e3) {
            e3.state.delayingBlurEvent = true, setTimeout((function() {
              e3.state.delayingBlurEvent && (e3.state.delayingBlurEvent = false, e3.state.focused && Ei(e3));
            }), 100);
          }
          function Ai(e3, t3) {
            e3.state.delayingBlurEvent && !e3.state.draggingText && (e3.state.delayingBlurEvent = false), "nocursor" != e3.options.readOnly && (e3.state.focused || (ve(e3, "focus", e3, t3), e3.state.focused = true, O(e3.display.wrapper, "CodeMirror-focused"), e3.curOp || e3.display.selForContextMenu == e3.doc.sel || (e3.display.input.reset(), s && setTimeout((function() {
              return e3.display.input.reset(true);
            }), 20)), e3.display.input.receivedFocus()), ki(e3));
          }
          function Ei(e3, t3) {
            e3.state.delayingBlurEvent || (e3.state.focused && (ve(e3, "blur", e3, t3), e3.state.focused = false, A(e3.display.wrapper, "CodeMirror-focused")), clearInterval(e3.display.blinker), setTimeout((function() {
              e3.state.focused || (e3.display.shift = false);
            }), 150));
          }
          function Li(e3) {
            for (var t3 = e3.display, n3 = t3.lineDiv.offsetTop, i2 = Math.max(0, t3.scroller.getBoundingClientRect().top), r2 = t3.lineDiv.getBoundingClientRect().top, o2 = 0, s2 = 0; s2 < t3.view.length; s2++) {
              var u2 = t3.view[s2], c2 = e3.options.lineWrapping, d2 = void 0, h2 = 0;
              if (!u2.hidden) {
                if (r2 += u2.line.height, a && l < 8) {
                  var f2 = u2.node.offsetTop + u2.node.offsetHeight;
                  d2 = f2 - n3, n3 = f2;
                } else {
                  var p2 = u2.node.getBoundingClientRect();
                  d2 = p2.bottom - p2.top, !c2 && u2.text.firstChild && (h2 = u2.text.firstChild.getBoundingClientRect().right - p2.left - 1);
                }
                var m2 = u2.line.height - d2;
                if ((m2 > 5e-3 || m2 < -5e-3) && (r2 < i2 && (o2 -= m2), Qe(u2.line, d2), Ti(u2.line), u2.rest)) for (var g2 = 0; g2 < u2.rest.length; g2++) Ti(u2.rest[g2]);
                if (h2 > e3.display.sizerWidth) {
                  var v2 = Math.ceil(h2 / li(e3.display));
                  v2 > e3.display.maxLineLength && (e3.display.maxLineLength = v2, e3.display.maxLine = u2.line, e3.display.maxLineChanged = true);
                }
              }
            }
            Math.abs(o2) > 2 && (t3.scroller.scrollTop += o2);
          }
          function Ti(e3) {
            if (e3.widgets) for (var t3 = 0; t3 < e3.widgets.length; ++t3) {
              var n3 = e3.widgets[t3], i2 = n3.node.parentNode;
              i2 && (n3.height = i2.offsetHeight);
            }
          }
          function Mi(e3, t3, n3) {
            var i2 = n3 && null != n3.top ? Math.max(0, n3.top) : e3.scroller.scrollTop;
            i2 = Math.floor(i2 - Fn(e3));
            var r2 = n3 && null != n3.bottom ? n3.bottom : i2 + e3.wrapper.clientHeight, o2 = et(t3, i2), a2 = et(t3, r2);
            if (n3 && n3.ensure) {
              var l2 = n3.ensure.from.line, s2 = n3.ensure.to.line;
              l2 < o2 ? (o2 = l2, a2 = et(t3, Gt(Ke(t3, l2)) + e3.wrapper.clientHeight)) : Math.min(s2, t3.lastLine()) >= a2 && (o2 = et(t3, Gt(Ke(t3, s2)) - e3.wrapper.clientHeight), a2 = s2);
            }
            return { from: o2, to: Math.max(a2, o2 + 1) };
          }
          function Bi(e3, t3) {
            var n3 = e3.display, i2 = ai(e3.display);
            t3.top < 0 && (t3.top = 0);
            var r2 = e3.curOp && null != e3.curOp.scrollTop ? e3.curOp.scrollTop : n3.scroller.scrollTop, o2 = Mn(e3), a2 = {};
            t3.bottom - t3.top > o2 && (t3.bottom = t3.top + o2);
            var l2 = e3.doc.height + An(n3), s2 = t3.top < i2, u2 = t3.bottom > l2 - i2;
            if (t3.top < r2) a2.scrollTop = s2 ? 0 : t3.top;
            else if (t3.bottom > r2 + o2) {
              var c2 = Math.min(t3.top, (u2 ? l2 : t3.bottom) - o2);
              c2 != r2 && (a2.scrollTop = c2);
            }
            var d2 = e3.options.fixedGutter ? 0 : n3.gutters.offsetWidth, h2 = e3.curOp && null != e3.curOp.scrollLeft ? e3.curOp.scrollLeft : n3.scroller.scrollLeft - d2, f2 = Tn(e3) - n3.gutters.offsetWidth, p2 = t3.right - t3.left > f2;
            return p2 && (t3.right = t3.left + f2), t3.left < 10 ? a2.scrollLeft = 0 : t3.left < h2 ? a2.scrollLeft = Math.max(0, t3.left + d2 - (p2 ? 0 : 10)) : t3.right > f2 + h2 - 3 && (a2.scrollLeft = t3.right + (p2 ? 0 : 10) - f2), a2;
          }
          function Ni(e3, t3) {
            null != t3 && (zi(e3), e3.curOp.scrollTop = (null == e3.curOp.scrollTop ? e3.doc.scrollTop : e3.curOp.scrollTop) + t3);
          }
          function Oi(e3) {
            zi(e3);
            var t3 = e3.getCursor();
            e3.curOp.scrollToPos = { from: t3, to: t3, margin: e3.options.cursorScrollMargin };
          }
          function Ii(e3, t3, n3) {
            null == t3 && null == n3 || zi(e3), null != t3 && (e3.curOp.scrollLeft = t3), null != n3 && (e3.curOp.scrollTop = n3);
          }
          function zi(e3) {
            var t3 = e3.curOp.scrollToPos;
            t3 && (e3.curOp.scrollToPos = null, Hi(e3, Yn(e3, t3.from), Yn(e3, t3.to), t3.margin));
          }
          function Hi(e3, t3, n3, i2) {
            var r2 = Bi(e3, { left: Math.min(t3.left, n3.left), top: Math.min(t3.top, n3.top) - i2, right: Math.max(t3.right, n3.right), bottom: Math.max(t3.bottom, n3.bottom) + i2 });
            Ii(e3, r2.scrollLeft, r2.scrollTop);
          }
          function Ri(e3, t3) {
            Math.abs(e3.doc.scrollTop - t3) < 2 || (n2 || hr(e3, { top: t3 }), Pi(e3, t3, true), n2 && hr(e3), ar(e3, 100));
          }
          function Pi(e3, t3, n3) {
            t3 = Math.max(0, Math.min(e3.display.scroller.scrollHeight - e3.display.scroller.clientHeight, t3)), (e3.display.scroller.scrollTop != t3 || n3) && (e3.doc.scrollTop = t3, e3.display.scrollbars.setScrollTop(t3), e3.display.scroller.scrollTop != t3 && (e3.display.scroller.scrollTop = t3));
          }
          function _i(e3, t3, n3, i2) {
            t3 = Math.max(0, Math.min(t3, e3.display.scroller.scrollWidth - e3.display.scroller.clientWidth)), (n3 ? t3 == e3.doc.scrollLeft : Math.abs(e3.doc.scrollLeft - t3) < 2) && !i2 || (e3.doc.scrollLeft = t3, mr(e3), e3.display.scroller.scrollLeft != t3 && (e3.display.scroller.scrollLeft = t3), e3.display.scrollbars.setScrollLeft(t3));
          }
          function Wi(e3) {
            var t3 = e3.display, n3 = t3.gutters.offsetWidth, i2 = Math.round(e3.doc.height + An(e3.display));
            return { clientHeight: t3.scroller.clientHeight, viewHeight: t3.wrapper.clientHeight, scrollWidth: t3.scroller.scrollWidth, clientWidth: t3.scroller.clientWidth, viewWidth: t3.wrapper.clientWidth, barLeft: e3.options.fixedGutter ? n3 : 0, docHeight: i2, scrollHeight: i2 + Ln(e3) + t3.barHeight, nativeBarWidth: t3.nativeBarWidth, gutterWidth: n3 };
          }
          var ji = function(e3, t3, n3) {
            this.cm = n3;
            var i2 = this.vert = T("div", [T("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"), r2 = this.horiz = T("div", [T("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
            i2.tabIndex = r2.tabIndex = -1, e3(i2), e3(r2), pe(i2, "scroll", (function() {
              i2.clientHeight && t3(i2.scrollTop, "vertical");
            })), pe(r2, "scroll", (function() {
              r2.clientWidth && t3(r2.scrollLeft, "horizontal");
            })), this.checkedZeroWidth = false, a && l < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px");
          };
          ji.prototype.update = function(e3) {
            var t3 = e3.scrollWidth > e3.clientWidth + 1, n3 = e3.scrollHeight > e3.clientHeight + 1, i2 = e3.nativeBarWidth;
            if (n3) {
              this.vert.style.display = "block", this.vert.style.bottom = t3 ? i2 + "px" : "0";
              var r2 = e3.viewHeight - (t3 ? i2 : 0);
              this.vert.firstChild.style.height = Math.max(0, e3.scrollHeight - e3.clientHeight + r2) + "px";
            } else this.vert.scrollTop = 0, this.vert.style.display = "", this.vert.firstChild.style.height = "0";
            if (t3) {
              this.horiz.style.display = "block", this.horiz.style.right = n3 ? i2 + "px" : "0", this.horiz.style.left = e3.barLeft + "px";
              var o2 = e3.viewWidth - e3.barLeft - (n3 ? i2 : 0);
              this.horiz.firstChild.style.width = Math.max(0, e3.scrollWidth - e3.clientWidth + o2) + "px";
            } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
            return !this.checkedZeroWidth && e3.clientHeight > 0 && (0 == i2 && this.zeroWidthHack(), this.checkedZeroWidth = true), { right: n3 ? i2 : 0, bottom: t3 ? i2 : 0 };
          }, ji.prototype.setScrollLeft = function(e3) {
            this.horiz.scrollLeft != e3 && (this.horiz.scrollLeft = e3), this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
          }, ji.prototype.setScrollTop = function(e3) {
            this.vert.scrollTop != e3 && (this.vert.scrollTop = e3), this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
          }, ji.prototype.zeroWidthHack = function() {
            var e3 = y && !p ? "12px" : "18px";
            this.horiz.style.height = this.vert.style.width = e3, this.horiz.style.visibility = this.vert.style.visibility = "hidden", this.disableHoriz = new j(), this.disableVert = new j();
          }, ji.prototype.enableZeroWidthBar = function(e3, t3, n3) {
            e3.style.visibility = "", t3.set(1e3, (function i2() {
              var r2 = e3.getBoundingClientRect();
              ("vert" == n3 ? document.elementFromPoint(r2.right - 1, (r2.top + r2.bottom) / 2) : document.elementFromPoint((r2.right + r2.left) / 2, r2.bottom - 1)) != e3 ? e3.style.visibility = "hidden" : t3.set(1e3, i2);
            }));
          }, ji.prototype.clear = function() {
            var e3 = this.horiz.parentNode;
            e3.removeChild(this.horiz), e3.removeChild(this.vert);
          };
          var qi = function() {
          };
          function Ui(e3, t3) {
            t3 || (t3 = Wi(e3));
            var n3 = e3.display.barWidth, i2 = e3.display.barHeight;
            $i(e3, t3);
            for (var r2 = 0; r2 < 4 && n3 != e3.display.barWidth || i2 != e3.display.barHeight; r2++) n3 != e3.display.barWidth && e3.options.lineWrapping && Li(e3), $i(e3, Wi(e3)), n3 = e3.display.barWidth, i2 = e3.display.barHeight;
          }
          function $i(e3, t3) {
            var n3 = e3.display, i2 = n3.scrollbars.update(t3);
            n3.sizer.style.paddingRight = (n3.barWidth = i2.right) + "px", n3.sizer.style.paddingBottom = (n3.barHeight = i2.bottom) + "px", n3.heightForcer.style.borderBottom = i2.bottom + "px solid transparent", i2.right && i2.bottom ? (n3.scrollbarFiller.style.display = "block", n3.scrollbarFiller.style.height = i2.bottom + "px", n3.scrollbarFiller.style.width = i2.right + "px") : n3.scrollbarFiller.style.display = "", i2.bottom && e3.options.coverGutterNextToScrollbar && e3.options.fixedGutter ? (n3.gutterFiller.style.display = "block", n3.gutterFiller.style.height = i2.bottom + "px", n3.gutterFiller.style.width = t3.gutterWidth + "px") : n3.gutterFiller.style.display = "";
          }
          qi.prototype.update = function() {
            return { bottom: 0, right: 0 };
          }, qi.prototype.setScrollLeft = function() {
          }, qi.prototype.setScrollTop = function() {
          }, qi.prototype.clear = function() {
          };
          var Gi = { native: ji, null: qi };
          function Vi(e3) {
            e3.display.scrollbars && (e3.display.scrollbars.clear(), e3.display.scrollbars.addClass && A(e3.display.wrapper, e3.display.scrollbars.addClass)), e3.display.scrollbars = new Gi[e3.options.scrollbarStyle]((function(t3) {
              e3.display.wrapper.insertBefore(t3, e3.display.scrollbarFiller), pe(t3, "mousedown", (function() {
                e3.state.focused && setTimeout((function() {
                  return e3.display.input.focus();
                }), 0);
              })), t3.setAttribute("cm-not-content", "true");
            }), (function(t3, n3) {
              "horizontal" == n3 ? _i(e3, t3) : Ri(e3, t3);
            }), e3), e3.display.scrollbars.addClass && O(e3.display.wrapper, e3.display.scrollbars.addClass);
          }
          var Xi = 0;
          function Ki(e3) {
            var t3;
            e3.curOp = { cm: e3, viewChanged: false, startHeight: e3.doc.height, forceUpdate: false, updateInput: 0, typing: false, changeObjs: null, cursorActivityHandlers: null, cursorActivityCalled: 0, selectionChanged: false, updateMaxLine: false, scrollLeft: null, scrollTop: null, scrollToPos: null, focus: false, id: ++Xi, markArrays: null }, t3 = e3.curOp, un ? un.ops.push(t3) : t3.ownsGroup = un = { ops: [t3], delayedCallbacks: [] };
          }
          function Zi(e3) {
            var t3 = e3.curOp;
            t3 && (function(e4, t4) {
              var n3 = e4.ownsGroup;
              if (n3) try {
                !(function(e5) {
                  var t5 = e5.delayedCallbacks, n4 = 0;
                  do {
                    for (; n4 < t5.length; n4++) t5[n4].call(null);
                    for (var i2 = 0; i2 < e5.ops.length; i2++) {
                      var r2 = e5.ops[i2];
                      if (r2.cursorActivityHandlers) for (; r2.cursorActivityCalled < r2.cursorActivityHandlers.length; ) r2.cursorActivityHandlers[r2.cursorActivityCalled++].call(null, r2.cm);
                    }
                  } while (n4 < t5.length);
                })(n3);
              } finally {
                un = null, t4(n3);
              }
            })(t3, (function(e4) {
              for (var t4 = 0; t4 < e4.ops.length; t4++) e4.ops[t4].cm.curOp = null;
              !(function(e5) {
                for (var t5 = e5.ops, n3 = 0; n3 < t5.length; n3++) Yi(t5[n3]);
                for (var i2 = 0; i2 < t5.length; i2++) Qi(t5[i2]);
                for (var r2 = 0; r2 < t5.length; r2++) Ji(t5[r2]);
                for (var o2 = 0; o2 < t5.length; o2++) er(t5[o2]);
                for (var a2 = 0; a2 < t5.length; a2++) tr(t5[a2]);
              })(e4);
            }));
          }
          function Yi(e3) {
            var t3 = e3.cm, n3 = t3.display;
            !(function(e4) {
              var t4 = e4.display;
              !t4.scrollbarsClipped && t4.scroller.offsetWidth && (t4.nativeBarWidth = t4.scroller.offsetWidth - t4.scroller.clientWidth, t4.heightForcer.style.height = Ln(e4) + "px", t4.sizer.style.marginBottom = -t4.nativeBarWidth + "px", t4.sizer.style.borderRightWidth = Ln(e4) + "px", t4.scrollbarsClipped = true);
            })(t3), e3.updateMaxLine && Xt(t3), e3.mustUpdate = e3.viewChanged || e3.forceUpdate || null != e3.scrollTop || e3.scrollToPos && (e3.scrollToPos.from.line < n3.viewFrom || e3.scrollToPos.to.line >= n3.viewTo) || n3.maxLineChanged && t3.options.lineWrapping, e3.update = e3.mustUpdate && new sr(t3, e3.mustUpdate && { top: e3.scrollTop, ensure: e3.scrollToPos }, e3.forceUpdate);
          }
          function Qi(e3) {
            e3.updatedDisplay = e3.mustUpdate && cr(e3.cm, e3.update);
          }
          function Ji(e3) {
            var t3 = e3.cm, n3 = t3.display;
            e3.updatedDisplay && Li(t3), e3.barMeasure = Wi(t3), n3.maxLineChanged && !t3.options.lineWrapping && (e3.adjustWidthTo = Nn(t3, n3.maxLine, n3.maxLine.text.length).left + 3, t3.display.sizerWidth = e3.adjustWidthTo, e3.barMeasure.scrollWidth = Math.max(n3.scroller.clientWidth, n3.sizer.offsetLeft + e3.adjustWidthTo + Ln(t3) + t3.display.barWidth), e3.maxScrollLeft = Math.max(0, n3.sizer.offsetLeft + e3.adjustWidthTo - Tn(t3))), (e3.updatedDisplay || e3.selectionChanged) && (e3.preparedSelection = n3.input.prepareSelection());
          }
          function er(e3) {
            var t3 = e3.cm;
            null != e3.adjustWidthTo && (t3.display.sizer.style.minWidth = e3.adjustWidthTo + "px", e3.maxScrollLeft < t3.doc.scrollLeft && _i(t3, Math.min(t3.display.scroller.scrollLeft, e3.maxScrollLeft), true), t3.display.maxLineChanged = false);
            var n3 = e3.focus && e3.focus == N(H(t3));
            e3.preparedSelection && t3.display.input.showSelection(e3.preparedSelection, n3), (e3.updatedDisplay || e3.startHeight != t3.doc.height) && Ui(t3, e3.barMeasure), e3.updatedDisplay && pr(t3, e3.barMeasure), e3.selectionChanged && ki(t3), t3.state.focused && e3.updateInput && t3.display.input.reset(e3.typing), n3 && Si(e3.cm);
          }
          function tr(e3) {
            var t3 = e3.cm, n3 = t3.display, i2 = t3.doc;
            if (e3.updatedDisplay && dr(t3, e3.update), null == n3.wheelStartX || null == e3.scrollTop && null == e3.scrollLeft && !e3.scrollToPos || (n3.wheelStartX = n3.wheelStartY = null), null != e3.scrollTop && Pi(t3, e3.scrollTop, e3.forceScroll), null != e3.scrollLeft && _i(t3, e3.scrollLeft, true, true), e3.scrollToPos) {
              var r2 = (function(e4, t4, n4, i3) {
                var r3;
                null == i3 && (i3 = 0), e4.options.lineWrapping || t4 != n4 || (n4 = "before" == t4.sticky ? it(t4.line, t4.ch + 1, "before") : t4, t4 = t4.ch ? it(t4.line, "before" == t4.sticky ? t4.ch - 1 : t4.ch, "after") : t4);
                for (var o3 = 0; o3 < 5; o3++) {
                  var a3 = false, l3 = Zn(e4, t4), s3 = n4 && n4 != t4 ? Zn(e4, n4) : l3, u2 = Bi(e4, r3 = { left: Math.min(l3.left, s3.left), top: Math.min(l3.top, s3.top) - i3, right: Math.max(l3.left, s3.left), bottom: Math.max(l3.bottom, s3.bottom) + i3 }), c2 = e4.doc.scrollTop, d2 = e4.doc.scrollLeft;
                  if (null != u2.scrollTop && (Ri(e4, u2.scrollTop), Math.abs(e4.doc.scrollTop - c2) > 1 && (a3 = true)), null != u2.scrollLeft && (_i(e4, u2.scrollLeft), Math.abs(e4.doc.scrollLeft - d2) > 1 && (a3 = true)), !a3) break;
                }
                return r3;
              })(t3, ct(i2, e3.scrollToPos.from), ct(i2, e3.scrollToPos.to), e3.scrollToPos.margin);
              !(function(e4, t4) {
                if (!xe(e4, "scrollCursorIntoView")) {
                  var n4 = e4.display, i3 = n4.sizer.getBoundingClientRect(), r3 = null, o3 = n4.wrapper.ownerDocument;
                  if (t4.top + i3.top < 0 ? r3 = true : t4.bottom + i3.top > (o3.defaultView.innerHeight || o3.documentElement.clientHeight) && (r3 = false), null != r3 && !m) {
                    var a3 = T("div", "\u200B", null, "position: absolute;\n                         top: " + (t4.top - n4.viewOffset - Fn(e4.display)) + "px;\n                         height: " + (t4.bottom - t4.top + Ln(e4) + n4.barHeight) + "px;\n                         left: " + t4.left + "px; width: " + Math.max(2, t4.right - t4.left) + "px;");
                    e4.display.lineSpace.appendChild(a3), a3.scrollIntoView(r3), e4.display.lineSpace.removeChild(a3);
                  }
                }
              })(t3, r2);
            }
            var o2 = e3.maybeHiddenMarkers, a2 = e3.maybeUnhiddenMarkers;
            if (o2) for (var l2 = 0; l2 < o2.length; ++l2) o2[l2].lines.length || ve(o2[l2], "hide");
            if (a2) for (var s2 = 0; s2 < a2.length; ++s2) a2[s2].lines.length && ve(a2[s2], "unhide");
            n3.wrapper.offsetHeight && (i2.scrollTop = t3.display.scroller.scrollTop), e3.changeObjs && ve(t3, "changes", t3, e3.changeObjs), e3.update && e3.update.finish();
          }
          function nr(e3, t3) {
            if (e3.curOp) return t3();
            Ki(e3);
            try {
              return t3();
            } finally {
              Zi(e3);
            }
          }
          function ir(e3, t3) {
            return function() {
              if (e3.curOp) return t3.apply(e3, arguments);
              Ki(e3);
              try {
                return t3.apply(e3, arguments);
              } finally {
                Zi(e3);
              }
            };
          }
          function rr(e3) {
            return function() {
              if (this.curOp) return e3.apply(this, arguments);
              Ki(this);
              try {
                return e3.apply(this, arguments);
              } finally {
                Zi(this);
              }
            };
          }
          function or(e3) {
            return function() {
              var t3 = this.cm;
              if (!t3 || t3.curOp) return e3.apply(this, arguments);
              Ki(t3);
              try {
                return e3.apply(this, arguments);
              } finally {
                Zi(t3);
              }
            };
          }
          function ar(e3, t3) {
            e3.doc.highlightFrontier < e3.display.viewTo && e3.state.highlight.set(t3, P(lr, e3));
          }
          function lr(e3) {
            var t3 = e3.doc;
            if (!(t3.highlightFrontier >= e3.display.viewTo)) {
              var n3 = +/* @__PURE__ */ new Date() + e3.options.workTime, i2 = gt(e3, t3.highlightFrontier), r2 = [];
              t3.iter(i2.line, Math.min(t3.first + t3.size, e3.display.viewTo + 500), (function(o2) {
                if (i2.line >= e3.display.viewFrom) {
                  var a2 = o2.styles, l2 = o2.text.length > e3.options.maxHighlightLength ? $e(t3.mode, i2.state) : null, s2 = pt(e3, o2, i2, true);
                  l2 && (i2.state = l2), o2.styles = s2.styles;
                  var u2 = o2.styleClasses, c2 = s2.classes;
                  c2 ? o2.styleClasses = c2 : u2 && (o2.styleClasses = null);
                  for (var d2 = !a2 || a2.length != o2.styles.length || u2 != c2 && (!u2 || !c2 || u2.bgClass != c2.bgClass || u2.textClass != c2.textClass), h2 = 0; !d2 && h2 < a2.length; ++h2) d2 = a2[h2] != o2.styles[h2];
                  d2 && r2.push(i2.line), o2.stateAfter = i2.save(), i2.nextLine();
                } else o2.text.length <= e3.options.maxHighlightLength && vt(e3, o2.text, i2), o2.stateAfter = i2.line % 5 == 0 ? i2.save() : null, i2.nextLine();
                if (+/* @__PURE__ */ new Date() > n3) return ar(e3, e3.options.workDelay), true;
              })), t3.highlightFrontier = i2.line, t3.modeFrontier = Math.max(t3.modeFrontier, i2.line), r2.length && nr(e3, (function() {
                for (var t4 = 0; t4 < r2.length; t4++) mi(e3, r2[t4], "text");
              }));
            }
          }
          var sr = function(e3, t3, n3) {
            var i2 = e3.display;
            this.viewport = t3, this.visible = Mi(i2, e3.doc, t3), this.editorIsHidden = !i2.wrapper.offsetWidth, this.wrapperHeight = i2.wrapper.clientHeight, this.wrapperWidth = i2.wrapper.clientWidth, this.oldDisplayWidth = Tn(e3), this.force = n3, this.dims = si(e3), this.events = [];
          };
          function ur(e3) {
            if (e3.hasFocus()) return null;
            var t3 = N(H(e3));
            if (!t3 || !B(e3.display.lineDiv, t3)) return null;
            var n3 = { activeElt: t3 };
            if (window.getSelection) {
              var i2 = R(e3).getSelection();
              i2.anchorNode && i2.extend && B(e3.display.lineDiv, i2.anchorNode) && (n3.anchorNode = i2.anchorNode, n3.anchorOffset = i2.anchorOffset, n3.focusNode = i2.focusNode, n3.focusOffset = i2.focusOffset);
            }
            return n3;
          }
          function cr(e3, t3) {
            var n3 = e3.display, i2 = e3.doc;
            if (t3.editorIsHidden) return gi(e3), false;
            if (!t3.force && t3.visible.from >= n3.viewFrom && t3.visible.to <= n3.viewTo && (null == n3.updateLineNumbers || n3.updateLineNumbers >= n3.viewTo) && n3.renderedView == n3.view && 0 == xi(e3)) return false;
            gr(e3) && (gi(e3), t3.dims = si(e3));
            var r2 = i2.first + i2.size, o2 = Math.max(t3.visible.from - e3.options.viewportMargin, i2.first), a2 = Math.min(r2, t3.visible.to + e3.options.viewportMargin);
            n3.viewFrom < o2 && o2 - n3.viewFrom < 20 && (o2 = Math.max(i2.first, n3.viewFrom)), n3.viewTo > a2 && n3.viewTo - a2 < 20 && (a2 = Math.min(r2, n3.viewTo)), St && (o2 = jt(e3.doc, o2), a2 = qt(e3.doc, a2));
            var l2 = o2 != n3.viewFrom || a2 != n3.viewTo || n3.lastWrapHeight != t3.wrapperHeight || n3.lastWrapWidth != t3.wrapperWidth;
            !(function(e4, t4, n4) {
              var i3 = e4.display;
              0 == i3.view.length || t4 >= i3.viewTo || n4 <= i3.viewFrom ? (i3.view = sn(e4, t4, n4), i3.viewFrom = t4) : (i3.viewFrom > t4 ? i3.view = sn(e4, t4, i3.viewFrom).concat(i3.view) : i3.viewFrom < t4 && (i3.view = i3.view.slice(fi(e4, t4))), i3.viewFrom = t4, i3.viewTo < n4 ? i3.view = i3.view.concat(sn(e4, i3.viewTo, n4)) : i3.viewTo > n4 && (i3.view = i3.view.slice(0, fi(e4, n4)))), i3.viewTo = n4;
            })(e3, o2, a2), n3.viewOffset = Gt(Ke(e3.doc, n3.viewFrom)), e3.display.mover.style.top = n3.viewOffset + "px";
            var u2 = xi(e3);
            if (!l2 && 0 == u2 && !t3.force && n3.renderedView == n3.view && (null == n3.updateLineNumbers || n3.updateLineNumbers >= n3.viewTo)) return false;
            var c2 = ur(e3);
            return u2 > 4 && (n3.lineDiv.style.display = "none"), (function(e4, t4, n4) {
              var i3 = e4.display, r3 = e4.options.lineNumbers, o3 = i3.lineDiv, a3 = o3.firstChild;
              function l3(t5) {
                var n5 = t5.nextSibling;
                return s && y && e4.display.currentWheelTarget == t5 ? t5.style.display = "none" : t5.parentNode.removeChild(t5), n5;
              }
              for (var u3 = i3.view, c3 = i3.viewFrom, d2 = 0; d2 < u3.length; d2++) {
                var h2 = u3[d2];
                if (h2.hidden) ;
                else if (h2.node && h2.node.parentNode == o3) {
                  for (; a3 != h2.node; ) a3 = l3(a3);
                  var f2 = r3 && null != t4 && t4 <= c3 && h2.lineNumber;
                  h2.changes && (q(h2.changes, "gutter") > -1 && (f2 = false), fn(e4, h2, c3, n4)), f2 && (E(h2.lineNumber), h2.lineNumber.appendChild(document.createTextNode(nt(e4.options, c3)))), a3 = h2.node.nextSibling;
                } else {
                  var p2 = bn(e4, h2, c3, n4);
                  o3.insertBefore(p2, a3);
                }
                c3 += h2.size;
              }
              for (; a3; ) a3 = l3(a3);
            })(e3, n3.updateLineNumbers, t3.dims), u2 > 4 && (n3.lineDiv.style.display = ""), n3.renderedView = n3.view, (function(e4) {
              if (e4 && e4.activeElt && e4.activeElt != N(e4.activeElt.ownerDocument) && (e4.activeElt.focus(), !/^(INPUT|TEXTAREA)$/.test(e4.activeElt.nodeName) && e4.anchorNode && B(document.body, e4.anchorNode) && B(document.body, e4.focusNode))) {
                var t4 = e4.activeElt.ownerDocument, n4 = t4.defaultView.getSelection(), i3 = t4.createRange();
                i3.setEnd(e4.anchorNode, e4.anchorOffset), i3.collapse(false), n4.removeAllRanges(), n4.addRange(i3), n4.extend(e4.focusNode, e4.focusOffset);
              }
            })(c2), E(n3.cursorDiv), E(n3.selectionDiv), n3.gutters.style.height = n3.sizer.style.minHeight = 0, l2 && (n3.lastWrapHeight = t3.wrapperHeight, n3.lastWrapWidth = t3.wrapperWidth, ar(e3, 400)), n3.updateLineNumbers = null, true;
          }
          function dr(e3, t3) {
            for (var n3 = t3.viewport, i2 = true; ; i2 = false) {
              if (i2 && e3.options.lineWrapping && t3.oldDisplayWidth != Tn(e3)) i2 && (t3.visible = Mi(e3.display, e3.doc, n3));
              else if (n3 && null != n3.top && (n3 = { top: Math.min(e3.doc.height + An(e3.display) - Mn(e3), n3.top) }), t3.visible = Mi(e3.display, e3.doc, n3), t3.visible.from >= e3.display.viewFrom && t3.visible.to <= e3.display.viewTo) break;
              if (!cr(e3, t3)) break;
              Li(e3);
              var r2 = Wi(e3);
              yi(e3), Ui(e3, r2), pr(e3, r2), t3.force = false;
            }
            t3.signal(e3, "update", e3), e3.display.viewFrom == e3.display.reportedViewFrom && e3.display.viewTo == e3.display.reportedViewTo || (t3.signal(e3, "viewportChange", e3, e3.display.viewFrom, e3.display.viewTo), e3.display.reportedViewFrom = e3.display.viewFrom, e3.display.reportedViewTo = e3.display.viewTo);
          }
          function hr(e3, t3) {
            var n3 = new sr(e3, t3);
            if (cr(e3, n3)) {
              Li(e3), dr(e3, n3);
              var i2 = Wi(e3);
              yi(e3), Ui(e3, i2), pr(e3, i2), n3.finish();
            }
          }
          function fr(e3) {
            var t3 = e3.gutters.offsetWidth;
            e3.sizer.style.marginLeft = t3 + "px", dn(e3, "gutterChanged", e3);
          }
          function pr(e3, t3) {
            e3.display.sizer.style.minHeight = t3.docHeight + "px", e3.display.heightForcer.style.top = t3.docHeight + "px", e3.display.gutters.style.height = t3.docHeight + e3.display.barHeight + Ln(e3) + "px";
          }
          function mr(e3) {
            var t3 = e3.display, n3 = t3.view;
            if (t3.alignWidgets || t3.gutters.firstChild && e3.options.fixedGutter) {
              for (var i2 = ui(t3) - t3.scroller.scrollLeft + e3.doc.scrollLeft, r2 = t3.gutters.offsetWidth, o2 = i2 + "px", a2 = 0; a2 < n3.length; a2++) if (!n3[a2].hidden) {
                e3.options.fixedGutter && (n3[a2].gutter && (n3[a2].gutter.style.left = o2), n3[a2].gutterBackground && (n3[a2].gutterBackground.style.left = o2));
                var l2 = n3[a2].alignable;
                if (l2) for (var s2 = 0; s2 < l2.length; s2++) l2[s2].style.left = o2;
              }
              e3.options.fixedGutter && (t3.gutters.style.left = i2 + r2 + "px");
            }
          }
          function gr(e3) {
            if (!e3.options.lineNumbers) return false;
            var t3 = e3.doc, n3 = nt(e3.options, t3.first + t3.size - 1), i2 = e3.display;
            if (n3.length != i2.lineNumChars) {
              var r2 = i2.measure.appendChild(T("div", [T("div", n3)], "CodeMirror-linenumber CodeMirror-gutter-elt")), o2 = r2.firstChild.offsetWidth, a2 = r2.offsetWidth - o2;
              return i2.lineGutter.style.width = "", i2.lineNumInnerWidth = Math.max(o2, i2.lineGutter.offsetWidth - a2) + 1, i2.lineNumWidth = i2.lineNumInnerWidth + a2, i2.lineNumChars = i2.lineNumInnerWidth ? n3.length : -1, i2.lineGutter.style.width = i2.lineNumWidth + "px", fr(e3.display), true;
            }
            return false;
          }
          function vr(e3, t3) {
            for (var n3 = [], i2 = false, r2 = 0; r2 < e3.length; r2++) {
              var o2 = e3[r2], a2 = null;
              if ("string" != typeof o2 && (a2 = o2.style, o2 = o2.className), "CodeMirror-linenumbers" == o2) {
                if (!t3) continue;
                i2 = true;
              }
              n3.push({ className: o2, style: a2 });
            }
            return t3 && !i2 && n3.push({ className: "CodeMirror-linenumbers", style: null }), n3;
          }
          function xr(e3) {
            var t3 = e3.gutters, n3 = e3.gutterSpecs;
            E(t3), e3.lineGutter = null;
            for (var i2 = 0; i2 < n3.length; ++i2) {
              var r2 = n3[i2], o2 = r2.className, a2 = r2.style, l2 = t3.appendChild(T("div", null, "CodeMirror-gutter " + o2));
              a2 && (l2.style.cssText = a2), "CodeMirror-linenumbers" == o2 && (e3.lineGutter = l2, l2.style.width = (e3.lineNumWidth || 1) + "px");
            }
            t3.style.display = n3.length ? "" : "none", fr(e3);
          }
          function yr(e3) {
            xr(e3.display), pi(e3), mr(e3);
          }
          function br(e3, t3, i2, r2) {
            var o2 = this;
            this.input = i2, o2.scrollbarFiller = T("div", null, "CodeMirror-scrollbar-filler"), o2.scrollbarFiller.setAttribute("cm-not-content", "true"), o2.gutterFiller = T("div", null, "CodeMirror-gutter-filler"), o2.gutterFiller.setAttribute("cm-not-content", "true"), o2.lineDiv = M("div", null, "CodeMirror-code"), o2.selectionDiv = T("div", null, null, "position: relative; z-index: 1"), o2.cursorDiv = T("div", null, "CodeMirror-cursors"), o2.measure = T("div", null, "CodeMirror-measure"), o2.lineMeasure = T("div", null, "CodeMirror-measure"), o2.lineSpace = M("div", [o2.measure, o2.lineMeasure, o2.selectionDiv, o2.cursorDiv, o2.lineDiv], null, "position: relative; outline: none");
            var u2 = M("div", [o2.lineSpace], "CodeMirror-lines");
            o2.mover = T("div", [u2], null, "position: relative"), o2.sizer = T("div", [o2.mover], "CodeMirror-sizer"), o2.sizerWidth = null, o2.heightForcer = T("div", null, null, "position: absolute; height: 50px; width: 1px;"), o2.gutters = T("div", null, "CodeMirror-gutters"), o2.lineGutter = null, o2.scroller = T("div", [o2.sizer, o2.heightForcer, o2.gutters], "CodeMirror-scroll"), o2.scroller.setAttribute("tabIndex", "-1"), o2.wrapper = T("div", [o2.scrollbarFiller, o2.gutterFiller, o2.scroller], "CodeMirror"), c && d >= 105 && (o2.wrapper.style.clipPath = "inset(0px)"), o2.wrapper.setAttribute("translate", "no"), a && l < 8 && (o2.gutters.style.zIndex = -1, o2.scroller.style.paddingRight = 0), s || n2 && x || (o2.scroller.draggable = true), e3 && (e3.appendChild ? e3.appendChild(o2.wrapper) : e3(o2.wrapper)), o2.viewFrom = o2.viewTo = t3.first, o2.reportedViewFrom = o2.reportedViewTo = t3.first, o2.view = [], o2.renderedView = null, o2.externalMeasured = null, o2.viewOffset = 0, o2.lastWrapHeight = o2.lastWrapWidth = 0, o2.updateLineNumbers = null, o2.nativeBarWidth = o2.barHeight = o2.barWidth = 0, o2.scrollbarsClipped = false, o2.lineNumWidth = o2.lineNumInnerWidth = o2.lineNumChars = null, o2.alignWidgets = false, o2.cachedCharWidth = o2.cachedTextHeight = o2.cachedPaddingH = null, o2.maxLine = null, o2.maxLineLength = 0, o2.maxLineChanged = false, o2.wheelDX = o2.wheelDY = o2.wheelStartX = o2.wheelStartY = null, o2.shift = false, o2.selForContextMenu = null, o2.activeTouch = null, o2.gutterSpecs = vr(r2.gutters, r2.lineNumbers), xr(o2), i2.init(o2);
          }
          sr.prototype.signal = function(e3, t3) {
            be(e3, t3) && this.events.push(arguments);
          }, sr.prototype.finish = function() {
            for (var e3 = 0; e3 < this.events.length; e3++) ve.apply(null, this.events[e3]);
          };
          var Dr = 0, Cr = null;
          function wr(e3) {
            var t3 = e3.wheelDeltaX, n3 = e3.wheelDeltaY;
            return null == t3 && e3.detail && e3.axis == e3.HORIZONTAL_AXIS && (t3 = e3.detail), null == n3 && e3.detail && e3.axis == e3.VERTICAL_AXIS ? n3 = e3.detail : null == n3 && (n3 = e3.wheelDelta), { x: t3, y: n3 };
          }
          function kr(e3) {
            var t3 = wr(e3);
            return t3.x *= Cr, t3.y *= Cr, t3;
          }
          function Sr(e3, t3) {
            c && 102 == d && (null == e3.display.chromeScrollHack ? e3.display.sizer.style.pointerEvents = "none" : clearTimeout(e3.display.chromeScrollHack), e3.display.chromeScrollHack = setTimeout((function() {
              e3.display.chromeScrollHack = null, e3.display.sizer.style.pointerEvents = "";
            }), 100));
            var i2 = wr(t3), r2 = i2.x, o2 = i2.y, a2 = Cr;
            0 === t3.deltaMode && (r2 = t3.deltaX, o2 = t3.deltaY, a2 = 1);
            var l2 = e3.display, u2 = l2.scroller, f2 = u2.scrollWidth > u2.clientWidth, p2 = u2.scrollHeight > u2.clientHeight;
            if (r2 && f2 || o2 && p2) {
              if (o2 && y && s) {
                e: for (var m2 = t3.target, g2 = l2.view; m2 != u2; m2 = m2.parentNode) for (var v2 = 0; v2 < g2.length; v2++) if (g2[v2].node == m2) {
                  e3.display.currentWheelTarget = m2;
                  break e;
                }
              }
              if (r2 && !n2 && !h && null != a2) return o2 && p2 && Ri(e3, Math.max(0, u2.scrollTop + o2 * a2)), _i(e3, Math.max(0, u2.scrollLeft + r2 * a2)), (!o2 || o2 && p2) && Ce(t3), void (l2.wheelStartX = null);
              if (o2 && null != a2) {
                var x2 = o2 * a2, b2 = e3.doc.scrollTop, D2 = b2 + l2.wrapper.clientHeight;
                x2 < 0 ? b2 = Math.max(0, b2 + x2 - 50) : D2 = Math.min(e3.doc.height, D2 + x2 + 50), hr(e3, { top: b2, bottom: D2 });
              }
              Dr < 20 && 0 !== t3.deltaMode && (null == l2.wheelStartX ? (l2.wheelStartX = u2.scrollLeft, l2.wheelStartY = u2.scrollTop, l2.wheelDX = r2, l2.wheelDY = o2, setTimeout((function() {
                if (null != l2.wheelStartX) {
                  var e4 = u2.scrollLeft - l2.wheelStartX, t4 = u2.scrollTop - l2.wheelStartY, n3 = t4 && l2.wheelDY && t4 / l2.wheelDY || e4 && l2.wheelDX && e4 / l2.wheelDX;
                  l2.wheelStartX = l2.wheelStartY = null, n3 && (Cr = (Cr * Dr + n3) / (Dr + 1), ++Dr);
                }
              }), 200)) : (l2.wheelDX += r2, l2.wheelDY += o2));
            }
          }
          a ? Cr = -0.53 : n2 ? Cr = 15 : c ? Cr = -0.7 : f && (Cr = -1 / 3);
          var Fr = function(e3, t3) {
            this.ranges = e3, this.primIndex = t3;
          };
          Fr.prototype.primary = function() {
            return this.ranges[this.primIndex];
          }, Fr.prototype.equals = function(e3) {
            if (e3 == this) return true;
            if (e3.primIndex != this.primIndex || e3.ranges.length != this.ranges.length) return false;
            for (var t3 = 0; t3 < this.ranges.length; t3++) {
              var n3 = this.ranges[t3], i2 = e3.ranges[t3];
              if (!ot(n3.anchor, i2.anchor) || !ot(n3.head, i2.head)) return false;
            }
            return true;
          }, Fr.prototype.deepCopy = function() {
            for (var e3 = [], t3 = 0; t3 < this.ranges.length; t3++) e3[t3] = new Ar(at(this.ranges[t3].anchor), at(this.ranges[t3].head));
            return new Fr(e3, this.primIndex);
          }, Fr.prototype.somethingSelected = function() {
            for (var e3 = 0; e3 < this.ranges.length; e3++) if (!this.ranges[e3].empty()) return true;
            return false;
          }, Fr.prototype.contains = function(e3, t3) {
            t3 || (t3 = e3);
            for (var n3 = 0; n3 < this.ranges.length; n3++) {
              var i2 = this.ranges[n3];
              if (rt(t3, i2.from()) >= 0 && rt(e3, i2.to()) <= 0) return n3;
            }
            return -1;
          };
          var Ar = function(e3, t3) {
            this.anchor = e3, this.head = t3;
          };
          function Er(e3, t3, n3) {
            var i2 = e3 && e3.options.selectionsMayTouch, r2 = t3[n3];
            t3.sort((function(e4, t4) {
              return rt(e4.from(), t4.from());
            })), n3 = q(t3, r2);
            for (var o2 = 1; o2 < t3.length; o2++) {
              var a2 = t3[o2], l2 = t3[o2 - 1], s2 = rt(l2.to(), a2.from());
              if (i2 && !a2.empty() ? s2 > 0 : s2 >= 0) {
                var u2 = st(l2.from(), a2.from()), c2 = lt(l2.to(), a2.to()), d2 = l2.empty() ? a2.from() == a2.head : l2.from() == l2.head;
                o2 <= n3 && --n3, t3.splice(--o2, 2, new Ar(d2 ? c2 : u2, d2 ? u2 : c2));
              }
            }
            return new Fr(t3, n3);
          }
          function Lr(e3, t3) {
            return new Fr([new Ar(e3, t3 || e3)], 0);
          }
          function Tr(e3) {
            return e3.text ? it(e3.from.line + e3.text.length - 1, Y(e3.text).length + (1 == e3.text.length ? e3.from.ch : 0)) : e3.to;
          }
          function Mr(e3, t3) {
            if (rt(e3, t3.from) < 0) return e3;
            if (rt(e3, t3.to) <= 0) return Tr(t3);
            var n3 = e3.line + t3.text.length - (t3.to.line - t3.from.line) - 1, i2 = e3.ch;
            return e3.line == t3.to.line && (i2 += Tr(t3).ch - t3.to.ch), it(n3, i2);
          }
          function Br(e3, t3) {
            for (var n3 = [], i2 = 0; i2 < e3.sel.ranges.length; i2++) {
              var r2 = e3.sel.ranges[i2];
              n3.push(new Ar(Mr(r2.anchor, t3), Mr(r2.head, t3)));
            }
            return Er(e3.cm, n3, e3.sel.primIndex);
          }
          function Nr(e3, t3, n3) {
            return e3.line == t3.line ? it(n3.line, e3.ch - t3.ch + n3.ch) : it(n3.line + (e3.line - t3.line), e3.ch);
          }
          function Or(e3) {
            e3.doc.mode = je(e3.options, e3.doc.modeOption), Ir(e3);
          }
          function Ir(e3) {
            e3.doc.iter((function(e4) {
              e4.stateAfter && (e4.stateAfter = null), e4.styles && (e4.styles = null);
            })), e3.doc.modeFrontier = e3.doc.highlightFrontier = e3.doc.first, ar(e3, 100), e3.state.modeGen++, e3.curOp && pi(e3);
          }
          function zr(e3, t3) {
            return 0 == t3.from.ch && 0 == t3.to.ch && "" == Y(t3.text) && (!e3.cm || e3.cm.options.wholeLineUpdateBefore);
          }
          function Hr(e3, t3, n3, i2) {
            function r2(e4) {
              return n3 ? n3[e4] : null;
            }
            function o2(e4, n4, r3) {
              !(function(e5, t4, n5, i3) {
                e5.text = t4, e5.stateAfter && (e5.stateAfter = null), e5.styles && (e5.styles = null), null != e5.order && (e5.order = null), Mt(e5), Bt(e5, n5);
                var r4 = i3 ? i3(e5) : 1;
                r4 != e5.height && Qe(e5, r4);
              })(e4, n4, r3, i2), dn(e4, "change", e4, t3);
            }
            function a2(e4, t4) {
              for (var n4 = [], o3 = e4; o3 < t4; ++o3) n4.push(new Kt(u2[o3], r2(o3), i2));
              return n4;
            }
            var l2 = t3.from, s2 = t3.to, u2 = t3.text, c2 = Ke(e3, l2.line), d2 = Ke(e3, s2.line), h2 = Y(u2), f2 = r2(u2.length - 1), p2 = s2.line - l2.line;
            if (t3.full) e3.insert(0, a2(0, u2.length)), e3.remove(u2.length, e3.size - u2.length);
            else if (zr(e3, t3)) {
              var m2 = a2(0, u2.length - 1);
              o2(d2, d2.text, f2), p2 && e3.remove(l2.line, p2), m2.length && e3.insert(l2.line, m2);
            } else if (c2 == d2) if (1 == u2.length) o2(c2, c2.text.slice(0, l2.ch) + h2 + c2.text.slice(s2.ch), f2);
            else {
              var g2 = a2(1, u2.length - 1);
              g2.push(new Kt(h2 + c2.text.slice(s2.ch), f2, i2)), o2(c2, c2.text.slice(0, l2.ch) + u2[0], r2(0)), e3.insert(l2.line + 1, g2);
            }
            else if (1 == u2.length) o2(c2, c2.text.slice(0, l2.ch) + u2[0] + d2.text.slice(s2.ch), r2(0)), e3.remove(l2.line + 1, p2);
            else {
              o2(c2, c2.text.slice(0, l2.ch) + u2[0], r2(0)), o2(d2, h2 + d2.text.slice(s2.ch), f2);
              var v2 = a2(1, u2.length - 1);
              p2 > 1 && e3.remove(l2.line + 1, p2 - 1), e3.insert(l2.line + 1, v2);
            }
            dn(e3, "change", e3, t3);
          }
          function Rr(e3, t3, n3) {
            !(function e4(i2, r2, o2) {
              if (i2.linked) for (var a2 = 0; a2 < i2.linked.length; ++a2) {
                var l2 = i2.linked[a2];
                if (l2.doc != r2) {
                  var s2 = o2 && l2.sharedHist;
                  n3 && !s2 || (t3(l2.doc, s2), e4(l2.doc, i2, s2));
                }
              }
            })(e3, null, true);
          }
          function Pr(e3, t3) {
            if (t3.cm) throw new Error("This document is already in use.");
            e3.doc = t3, t3.cm = e3, di(e3), Or(e3), _r(e3), e3.options.direction = t3.direction, e3.options.lineWrapping || Xt(e3), e3.options.mode = t3.modeOption, pi(e3);
          }
          function _r(e3) {
            ("rtl" == e3.doc.direction ? O : A)(e3.display.lineDiv, "CodeMirror-rtl");
          }
          function Wr(e3) {
            this.done = [], this.undone = [], this.undoDepth = e3 ? e3.undoDepth : 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = e3 ? e3.maxGeneration : 1;
          }
          function jr(e3, t3) {
            var n3 = { from: at(t3.from), to: Tr(t3), text: Ze(e3, t3.from, t3.to) };
            return Vr(e3, n3, t3.from.line, t3.to.line + 1), Rr(e3, (function(e4) {
              return Vr(e4, n3, t3.from.line, t3.to.line + 1);
            }), true), n3;
          }
          function qr(e3) {
            for (; e3.length; ) {
              if (!Y(e3).ranges) break;
              e3.pop();
            }
          }
          function Ur(e3, t3, n3, i2) {
            var r2 = e3.history;
            r2.undone.length = 0;
            var o2, a2, l2 = +/* @__PURE__ */ new Date();
            if ((r2.lastOp == i2 || r2.lastOrigin == t3.origin && t3.origin && ("+" == t3.origin.charAt(0) && r2.lastModTime > l2 - (e3.cm ? e3.cm.options.historyEventDelay : 500) || "*" == t3.origin.charAt(0))) && (o2 = (function(e4, t4) {
              return t4 ? (qr(e4.done), Y(e4.done)) : e4.done.length && !Y(e4.done).ranges ? Y(e4.done) : e4.done.length > 1 && !e4.done[e4.done.length - 2].ranges ? (e4.done.pop(), Y(e4.done)) : void 0;
            })(r2, r2.lastOp == i2))) a2 = Y(o2.changes), 0 == rt(t3.from, t3.to) && 0 == rt(t3.from, a2.to) ? a2.to = Tr(t3) : o2.changes.push(jr(e3, t3));
            else {
              var s2 = Y(r2.done);
              for (s2 && s2.ranges || Gr(e3.sel, r2.done), o2 = { changes: [jr(e3, t3)], generation: r2.generation }, r2.done.push(o2); r2.done.length > r2.undoDepth; ) r2.done.shift(), r2.done[0].ranges || r2.done.shift();
            }
            r2.done.push(n3), r2.generation = ++r2.maxGeneration, r2.lastModTime = r2.lastSelTime = l2, r2.lastOp = r2.lastSelOp = i2, r2.lastOrigin = r2.lastSelOrigin = t3.origin, a2 || ve(e3, "historyAdded");
          }
          function $r(e3, t3, n3, i2) {
            var r2 = e3.history, o2 = i2 && i2.origin;
            n3 == r2.lastSelOp || o2 && r2.lastSelOrigin == o2 && (r2.lastModTime == r2.lastSelTime && r2.lastOrigin == o2 || (function(e4, t4, n4, i3) {
              var r3 = t4.charAt(0);
              return "*" == r3 || "+" == r3 && n4.ranges.length == i3.ranges.length && n4.somethingSelected() == i3.somethingSelected() && /* @__PURE__ */ new Date() - e4.history.lastSelTime <= (e4.cm ? e4.cm.options.historyEventDelay : 500);
            })(e3, o2, Y(r2.done), t3)) ? r2.done[r2.done.length - 1] = t3 : Gr(t3, r2.done), r2.lastSelTime = +/* @__PURE__ */ new Date(), r2.lastSelOrigin = o2, r2.lastSelOp = n3, i2 && false !== i2.clearRedo && qr(r2.undone);
          }
          function Gr(e3, t3) {
            var n3 = Y(t3);
            n3 && n3.ranges && n3.equals(e3) || t3.push(e3);
          }
          function Vr(e3, t3, n3, i2) {
            var r2 = t3["spans_" + e3.id], o2 = 0;
            e3.iter(Math.max(e3.first, n3), Math.min(e3.first + e3.size, i2), (function(n4) {
              n4.markedSpans && ((r2 || (r2 = t3["spans_" + e3.id] = {}))[o2] = n4.markedSpans), ++o2;
            }));
          }
          function Xr(e3) {
            if (!e3) return null;
            for (var t3, n3 = 0; n3 < e3.length; ++n3) e3[n3].marker.explicitlyCleared ? t3 || (t3 = e3.slice(0, n3)) : t3 && t3.push(e3[n3]);
            return t3 ? t3.length ? t3 : null : e3;
          }
          function Kr(e3, t3) {
            var n3 = (function(e4, t4) {
              var n4 = t4["spans_" + e4.id];
              if (!n4) return null;
              for (var i3 = [], r3 = 0; r3 < t4.text.length; ++r3) i3.push(Xr(n4[r3]));
              return i3;
            })(e3, t3), i2 = Lt(e3, t3);
            if (!n3) return i2;
            if (!i2) return n3;
            for (var r2 = 0; r2 < n3.length; ++r2) {
              var o2 = n3[r2], a2 = i2[r2];
              if (o2 && a2) e: for (var l2 = 0; l2 < a2.length; ++l2) {
                for (var s2 = a2[l2], u2 = 0; u2 < o2.length; ++u2) if (o2[u2].marker == s2.marker) continue e;
                o2.push(s2);
              }
              else a2 && (n3[r2] = a2);
            }
            return n3;
          }
          function Zr(e3, t3, n3) {
            for (var i2 = [], r2 = 0; r2 < e3.length; ++r2) {
              var o2 = e3[r2];
              if (o2.ranges) i2.push(n3 ? Fr.prototype.deepCopy.call(o2) : o2);
              else {
                var a2 = o2.changes, l2 = [];
                i2.push({ changes: l2 });
                for (var s2 = 0; s2 < a2.length; ++s2) {
                  var u2 = a2[s2], c2 = void 0;
                  if (l2.push({ from: u2.from, to: u2.to, text: u2.text }), t3) for (var d2 in u2) (c2 = d2.match(/^spans_(\d+)$/)) && q(t3, Number(c2[1])) > -1 && (Y(l2)[d2] = u2[d2], delete u2[d2]);
                }
              }
            }
            return i2;
          }
          function Yr(e3, t3, n3, i2) {
            if (i2) {
              var r2 = e3.anchor;
              if (n3) {
                var o2 = rt(t3, r2) < 0;
                o2 != rt(n3, r2) < 0 ? (r2 = t3, t3 = n3) : o2 != rt(t3, n3) < 0 && (t3 = n3);
              }
              return new Ar(r2, t3);
            }
            return new Ar(n3 || t3, t3);
          }
          function Qr(e3, t3, n3, i2, r2) {
            null == r2 && (r2 = e3.cm && (e3.cm.display.shift || e3.extend)), io(e3, new Fr([Yr(e3.sel.primary(), t3, n3, r2)], 0), i2);
          }
          function Jr(e3, t3, n3) {
            for (var i2 = [], r2 = e3.cm && (e3.cm.display.shift || e3.extend), o2 = 0; o2 < e3.sel.ranges.length; o2++) i2[o2] = Yr(e3.sel.ranges[o2], t3[o2], null, r2);
            io(e3, Er(e3.cm, i2, e3.sel.primIndex), n3);
          }
          function eo(e3, t3, n3, i2) {
            var r2 = e3.sel.ranges.slice(0);
            r2[t3] = n3, io(e3, Er(e3.cm, r2, e3.sel.primIndex), i2);
          }
          function to(e3, t3, n3, i2) {
            io(e3, Lr(t3, n3), i2);
          }
          function no(e3, t3, n3) {
            var i2 = e3.history.done, r2 = Y(i2);
            r2 && r2.ranges ? (i2[i2.length - 1] = t3, ro(e3, t3, n3)) : io(e3, t3, n3);
          }
          function io(e3, t3, n3) {
            ro(e3, t3, n3), $r(e3, e3.sel, e3.cm ? e3.cm.curOp.id : NaN, n3);
          }
          function ro(e3, t3, n3) {
            (be(e3, "beforeSelectionChange") || e3.cm && be(e3.cm, "beforeSelectionChange")) && (t3 = (function(e4, t4, n4) {
              var i3 = { ranges: t4.ranges, update: function(t5) {
                this.ranges = [];
                for (var n5 = 0; n5 < t5.length; n5++) this.ranges[n5] = new Ar(ct(e4, t5[n5].anchor), ct(e4, t5[n5].head));
              }, origin: n4 && n4.origin };
              return ve(e4, "beforeSelectionChange", e4, i3), e4.cm && ve(e4.cm, "beforeSelectionChange", e4.cm, i3), i3.ranges != t4.ranges ? Er(e4.cm, i3.ranges, i3.ranges.length - 1) : t4;
            })(e3, t3, n3));
            var i2 = n3 && n3.bias || (rt(t3.primary().head, e3.sel.primary().head) < 0 ? -1 : 1);
            oo(e3, lo(e3, t3, i2, true)), n3 && false === n3.scroll || !e3.cm || "nocursor" == e3.cm.getOption("readOnly") || Oi(e3.cm);
          }
          function oo(e3, t3) {
            t3.equals(e3.sel) || (e3.sel = t3, e3.cm && (e3.cm.curOp.updateInput = 1, e3.cm.curOp.selectionChanged = true, ye(e3.cm)), dn(e3, "cursorActivity", e3));
          }
          function ao(e3) {
            oo(e3, lo(e3, e3.sel, null, false));
          }
          function lo(e3, t3, n3, i2) {
            for (var r2, o2 = 0; o2 < t3.ranges.length; o2++) {
              var a2 = t3.ranges[o2], l2 = t3.ranges.length == e3.sel.ranges.length && e3.sel.ranges[o2], s2 = uo(e3, a2.anchor, l2 && l2.anchor, n3, i2), u2 = a2.head == a2.anchor ? s2 : uo(e3, a2.head, l2 && l2.head, n3, i2);
              (r2 || s2 != a2.anchor || u2 != a2.head) && (r2 || (r2 = t3.ranges.slice(0, o2)), r2[o2] = new Ar(s2, u2));
            }
            return r2 ? Er(e3.cm, r2, t3.primIndex) : t3;
          }
          function so(e3, t3, n3, i2, r2) {
            var o2 = Ke(e3, t3.line);
            if (o2.markedSpans) for (var a2 = 0; a2 < o2.markedSpans.length; ++a2) {
              var l2 = o2.markedSpans[a2], s2 = l2.marker, u2 = "selectLeft" in s2 ? !s2.selectLeft : s2.inclusiveLeft, c2 = "selectRight" in s2 ? !s2.selectRight : s2.inclusiveRight;
              if ((null == l2.from || (u2 ? l2.from <= t3.ch : l2.from < t3.ch)) && (null == l2.to || (c2 ? l2.to >= t3.ch : l2.to > t3.ch))) {
                if (r2 && (ve(s2, "beforeCursorEnter"), s2.explicitlyCleared)) {
                  if (o2.markedSpans) {
                    --a2;
                    continue;
                  }
                  break;
                }
                if (!s2.atomic) continue;
                if (n3) {
                  var d2 = s2.find(i2 < 0 ? 1 : -1), h2 = void 0;
                  if ((i2 < 0 ? c2 : u2) && (d2 = co(e3, d2, -i2, d2 && d2.line == t3.line ? o2 : null)), d2 && d2.line == t3.line && (h2 = rt(d2, n3)) && (i2 < 0 ? h2 < 0 : h2 > 0)) return so(e3, d2, t3, i2, r2);
                }
                var f2 = s2.find(i2 < 0 ? -1 : 1);
                return (i2 < 0 ? u2 : c2) && (f2 = co(e3, f2, i2, f2.line == t3.line ? o2 : null)), f2 ? so(e3, f2, t3, i2, r2) : null;
              }
            }
            return t3;
          }
          function uo(e3, t3, n3, i2, r2) {
            var o2 = i2 || 1, a2 = so(e3, t3, n3, o2, r2) || !r2 && so(e3, t3, n3, o2, true) || so(e3, t3, n3, -o2, r2) || !r2 && so(e3, t3, n3, -o2, true);
            return a2 || (e3.cantEdit = true, it(e3.first, 0));
          }
          function co(e3, t3, n3, i2) {
            return n3 < 0 && 0 == t3.ch ? t3.line > e3.first ? ct(e3, it(t3.line - 1)) : null : n3 > 0 && t3.ch == (i2 || Ke(e3, t3.line)).text.length ? t3.line < e3.first + e3.size - 1 ? it(t3.line + 1, 0) : null : new it(t3.line, t3.ch + n3);
          }
          function ho(e3) {
            e3.setSelection(it(e3.firstLine(), 0), it(e3.lastLine()), $);
          }
          function fo(e3, t3, n3) {
            var i2 = { canceled: false, from: t3.from, to: t3.to, text: t3.text, origin: t3.origin, cancel: function() {
              return i2.canceled = true;
            } };
            return n3 && (i2.update = function(t4, n4, r2, o2) {
              t4 && (i2.from = ct(e3, t4)), n4 && (i2.to = ct(e3, n4)), r2 && (i2.text = r2), void 0 !== o2 && (i2.origin = o2);
            }), ve(e3, "beforeChange", e3, i2), e3.cm && ve(e3.cm, "beforeChange", e3.cm, i2), i2.canceled ? (e3.cm && (e3.cm.curOp.updateInput = 2), null) : { from: i2.from, to: i2.to, text: i2.text, origin: i2.origin };
          }
          function po(e3, t3, n3) {
            if (e3.cm) {
              if (!e3.cm.curOp) return ir(e3.cm, po)(e3, t3, n3);
              if (e3.cm.state.suppressEdits) return;
            }
            if (!(be(e3, "beforeChange") || e3.cm && be(e3.cm, "beforeChange")) || (t3 = fo(e3, t3, true))) {
              var i2 = kt && !n3 && (function(e4, t4, n4) {
                var i3 = null;
                if (e4.iter(t4.line, n4.line + 1, (function(e5) {
                  if (e5.markedSpans) for (var t5 = 0; t5 < e5.markedSpans.length; ++t5) {
                    var n5 = e5.markedSpans[t5].marker;
                    !n5.readOnly || i3 && -1 != q(i3, n5) || (i3 || (i3 = [])).push(n5);
                  }
                })), !i3) return null;
                for (var r3 = [{ from: t4, to: n4 }], o2 = 0; o2 < i3.length; ++o2) for (var a2 = i3[o2], l2 = a2.find(0), s2 = 0; s2 < r3.length; ++s2) {
                  var u2 = r3[s2];
                  if (!(rt(u2.to, l2.from) < 0 || rt(u2.from, l2.to) > 0)) {
                    var c2 = [s2, 1], d2 = rt(u2.from, l2.from), h2 = rt(u2.to, l2.to);
                    (d2 < 0 || !a2.inclusiveLeft && !d2) && c2.push({ from: u2.from, to: l2.from }), (h2 > 0 || !a2.inclusiveRight && !h2) && c2.push({ from: l2.to, to: u2.to }), r3.splice.apply(r3, c2), s2 += c2.length - 3;
                  }
                }
                return r3;
              })(e3, t3.from, t3.to);
              if (i2) for (var r2 = i2.length - 1; r2 >= 0; --r2) mo(e3, { from: i2[r2].from, to: i2[r2].to, text: r2 ? [""] : t3.text, origin: t3.origin });
              else mo(e3, t3);
            }
          }
          function mo(e3, t3) {
            if (1 != t3.text.length || "" != t3.text[0] || 0 != rt(t3.from, t3.to)) {
              var n3 = Br(e3, t3);
              Ur(e3, t3, n3, e3.cm ? e3.cm.curOp.id : NaN), xo(e3, t3, n3, Lt(e3, t3));
              var i2 = [];
              Rr(e3, (function(e4, n4) {
                n4 || -1 != q(i2, e4.history) || (Co(e4.history, t3), i2.push(e4.history)), xo(e4, t3, null, Lt(e4, t3));
              }));
            }
          }
          function go(e3, t3, n3) {
            var i2 = e3.cm && e3.cm.state.suppressEdits;
            if (!i2 || n3) {
              for (var r2, o2 = e3.history, a2 = e3.sel, l2 = "undo" == t3 ? o2.done : o2.undone, s2 = "undo" == t3 ? o2.undone : o2.done, u2 = 0; u2 < l2.length && (r2 = l2[u2], n3 ? !r2.ranges || r2.equals(e3.sel) : r2.ranges); u2++) ;
              if (u2 != l2.length) {
                for (o2.lastOrigin = o2.lastSelOrigin = null; ; ) {
                  if (!(r2 = l2.pop()).ranges) {
                    if (i2) return void l2.push(r2);
                    break;
                  }
                  if (Gr(r2, s2), n3 && !r2.equals(e3.sel)) return void io(e3, r2, { clearRedo: false });
                  a2 = r2;
                }
                var c2 = [];
                Gr(a2, s2), s2.push({ changes: c2, generation: o2.generation }), o2.generation = r2.generation || ++o2.maxGeneration;
                for (var d2 = be(e3, "beforeChange") || e3.cm && be(e3.cm, "beforeChange"), h2 = function(n4) {
                  var i3 = r2.changes[n4];
                  if (i3.origin = t3, d2 && !fo(e3, i3, false)) return l2.length = 0, {};
                  c2.push(jr(e3, i3));
                  var o3 = n4 ? Br(e3, i3) : Y(l2);
                  xo(e3, i3, o3, Kr(e3, i3)), !n4 && e3.cm && e3.cm.scrollIntoView({ from: i3.from, to: Tr(i3) });
                  var a3 = [];
                  Rr(e3, (function(e4, t4) {
                    t4 || -1 != q(a3, e4.history) || (Co(e4.history, i3), a3.push(e4.history)), xo(e4, i3, null, Kr(e4, i3));
                  }));
                }, f2 = r2.changes.length - 1; f2 >= 0; --f2) {
                  var p2 = h2(f2);
                  if (p2) return p2.v;
                }
              }
            }
          }
          function vo(e3, t3) {
            if (0 != t3 && (e3.first += t3, e3.sel = new Fr(Q(e3.sel.ranges, (function(e4) {
              return new Ar(it(e4.anchor.line + t3, e4.anchor.ch), it(e4.head.line + t3, e4.head.ch));
            })), e3.sel.primIndex), e3.cm)) {
              pi(e3.cm, e3.first, e3.first - t3, t3);
              for (var n3 = e3.cm.display, i2 = n3.viewFrom; i2 < n3.viewTo; i2++) mi(e3.cm, i2, "gutter");
            }
          }
          function xo(e3, t3, n3, i2) {
            if (e3.cm && !e3.cm.curOp) return ir(e3.cm, xo)(e3, t3, n3, i2);
            if (t3.to.line < e3.first) vo(e3, t3.text.length - 1 - (t3.to.line - t3.from.line));
            else if (!(t3.from.line > e3.lastLine())) {
              if (t3.from.line < e3.first) {
                var r2 = t3.text.length - 1 - (e3.first - t3.from.line);
                vo(e3, r2), t3 = { from: it(e3.first, 0), to: it(t3.to.line + r2, t3.to.ch), text: [Y(t3.text)], origin: t3.origin };
              }
              var o2 = e3.lastLine();
              t3.to.line > o2 && (t3 = { from: t3.from, to: it(o2, Ke(e3, o2).text.length), text: [t3.text[0]], origin: t3.origin }), t3.removed = Ze(e3, t3.from, t3.to), n3 || (n3 = Br(e3, t3)), e3.cm ? (function(e4, t4, n4) {
                var i3 = e4.doc, r3 = e4.display, o3 = t4.from, a2 = t4.to, l2 = false, s2 = o3.line;
                e4.options.lineWrapping || (s2 = Je(Wt(Ke(i3, o3.line))), i3.iter(s2, a2.line + 1, (function(e5) {
                  if (e5 == r3.maxLine) return l2 = true, true;
                })));
                i3.sel.contains(t4.from, t4.to) > -1 && ye(e4);
                Hr(i3, t4, n4, ci(e4)), e4.options.lineWrapping || (i3.iter(s2, o3.line + t4.text.length, (function(e5) {
                  var t5 = Vt(e5);
                  t5 > r3.maxLineLength && (r3.maxLine = e5, r3.maxLineLength = t5, r3.maxLineChanged = true, l2 = false);
                })), l2 && (e4.curOp.updateMaxLine = true));
                (function(e5, t5) {
                  if (e5.modeFrontier = Math.min(e5.modeFrontier, t5), !(e5.highlightFrontier < t5 - 10)) {
                    for (var n5 = e5.first, i4 = t5 - 1; i4 > n5; i4--) {
                      var r4 = Ke(e5, i4).stateAfter;
                      if (r4 && (!(r4 instanceof ht) || i4 + r4.lookAhead < t5)) {
                        n5 = i4 + 1;
                        break;
                      }
                    }
                    e5.highlightFrontier = Math.min(e5.highlightFrontier, n5);
                  }
                })(i3, o3.line), ar(e4, 400);
                var u2 = t4.text.length - (a2.line - o3.line) - 1;
                t4.full ? pi(e4) : o3.line != a2.line || 1 != t4.text.length || zr(e4.doc, t4) ? pi(e4, o3.line, a2.line + 1, u2) : mi(e4, o3.line, "text");
                var c2 = be(e4, "changes"), d2 = be(e4, "change");
                if (d2 || c2) {
                  var h2 = { from: o3, to: a2, text: t4.text, removed: t4.removed, origin: t4.origin };
                  d2 && dn(e4, "change", e4, h2), c2 && (e4.curOp.changeObjs || (e4.curOp.changeObjs = [])).push(h2);
                }
                e4.display.selForContextMenu = null;
              })(e3.cm, t3, i2) : Hr(e3, t3, i2), ro(e3, n3, $), e3.cantEdit && uo(e3, it(e3.firstLine(), 0)) && (e3.cantEdit = false);
            }
          }
          function yo(e3, t3, n3, i2, r2) {
            var o2;
            i2 || (i2 = n3), rt(i2, n3) < 0 && (n3 = (o2 = [i2, n3])[0], i2 = o2[1]), "string" == typeof t3 && (t3 = e3.splitLines(t3)), po(e3, { from: n3, to: i2, text: t3, origin: r2 });
          }
          function bo(e3, t3, n3, i2) {
            n3 < e3.line ? e3.line += i2 : t3 < e3.line && (e3.line = t3, e3.ch = 0);
          }
          function Do(e3, t3, n3, i2) {
            for (var r2 = 0; r2 < e3.length; ++r2) {
              var o2 = e3[r2], a2 = true;
              if (o2.ranges) {
                o2.copied || ((o2 = e3[r2] = o2.deepCopy()).copied = true);
                for (var l2 = 0; l2 < o2.ranges.length; l2++) bo(o2.ranges[l2].anchor, t3, n3, i2), bo(o2.ranges[l2].head, t3, n3, i2);
              } else {
                for (var s2 = 0; s2 < o2.changes.length; ++s2) {
                  var u2 = o2.changes[s2];
                  if (n3 < u2.from.line) u2.from = it(u2.from.line + i2, u2.from.ch), u2.to = it(u2.to.line + i2, u2.to.ch);
                  else if (t3 <= u2.to.line) {
                    a2 = false;
                    break;
                  }
                }
                a2 || (e3.splice(0, r2 + 1), r2 = 0);
              }
            }
          }
          function Co(e3, t3) {
            var n3 = t3.from.line, i2 = t3.to.line, r2 = t3.text.length - (i2 - n3) - 1;
            Do(e3.done, n3, i2, r2), Do(e3.undone, n3, i2, r2);
          }
          function wo(e3, t3, n3, i2) {
            var r2 = t3, o2 = t3;
            return "number" == typeof t3 ? o2 = Ke(e3, ut(e3, t3)) : r2 = Je(t3), null == r2 ? null : (i2(o2, r2) && e3.cm && mi(e3.cm, r2, n3), o2);
          }
          function ko(e3) {
            this.lines = e3, this.parent = null;
            for (var t3 = 0, n3 = 0; n3 < e3.length; ++n3) e3[n3].parent = this, t3 += e3[n3].height;
            this.height = t3;
          }
          function So(e3) {
            this.children = e3;
            for (var t3 = 0, n3 = 0, i2 = 0; i2 < e3.length; ++i2) {
              var r2 = e3[i2];
              t3 += r2.chunkSize(), n3 += r2.height, r2.parent = this;
            }
            this.size = t3, this.height = n3, this.parent = null;
          }
          Ar.prototype.from = function() {
            return st(this.anchor, this.head);
          }, Ar.prototype.to = function() {
            return lt(this.anchor, this.head);
          }, Ar.prototype.empty = function() {
            return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
          }, ko.prototype = { chunkSize: function() {
            return this.lines.length;
          }, removeInner: function(e3, t3) {
            for (var n3 = e3, i2 = e3 + t3; n3 < i2; ++n3) {
              var r2 = this.lines[n3];
              this.height -= r2.height, Zt(r2), dn(r2, "delete");
            }
            this.lines.splice(e3, t3);
          }, collapse: function(e3) {
            e3.push.apply(e3, this.lines);
          }, insertInner: function(e3, t3, n3) {
            this.height += n3, this.lines = this.lines.slice(0, e3).concat(t3).concat(this.lines.slice(e3));
            for (var i2 = 0; i2 < t3.length; ++i2) t3[i2].parent = this;
          }, iterN: function(e3, t3, n3) {
            for (var i2 = e3 + t3; e3 < i2; ++e3) if (n3(this.lines[e3])) return true;
          } }, So.prototype = { chunkSize: function() {
            return this.size;
          }, removeInner: function(e3, t3) {
            this.size -= t3;
            for (var n3 = 0; n3 < this.children.length; ++n3) {
              var i2 = this.children[n3], r2 = i2.chunkSize();
              if (e3 < r2) {
                var o2 = Math.min(t3, r2 - e3), a2 = i2.height;
                if (i2.removeInner(e3, o2), this.height -= a2 - i2.height, r2 == o2 && (this.children.splice(n3--, 1), i2.parent = null), 0 == (t3 -= o2)) break;
                e3 = 0;
              } else e3 -= r2;
            }
            if (this.size - t3 < 25 && (this.children.length > 1 || !(this.children[0] instanceof ko))) {
              var l2 = [];
              this.collapse(l2), this.children = [new ko(l2)], this.children[0].parent = this;
            }
          }, collapse: function(e3) {
            for (var t3 = 0; t3 < this.children.length; ++t3) this.children[t3].collapse(e3);
          }, insertInner: function(e3, t3, n3) {
            this.size += t3.length, this.height += n3;
            for (var i2 = 0; i2 < this.children.length; ++i2) {
              var r2 = this.children[i2], o2 = r2.chunkSize();
              if (e3 <= o2) {
                if (r2.insertInner(e3, t3, n3), r2.lines && r2.lines.length > 50) {
                  for (var a2 = r2.lines.length % 25 + 25, l2 = a2; l2 < r2.lines.length; ) {
                    var s2 = new ko(r2.lines.slice(l2, l2 += 25));
                    r2.height -= s2.height, this.children.splice(++i2, 0, s2), s2.parent = this;
                  }
                  r2.lines = r2.lines.slice(0, a2), this.maybeSpill();
                }
                break;
              }
              e3 -= o2;
            }
          }, maybeSpill: function() {
            if (!(this.children.length <= 10)) {
              var e3 = this;
              do {
                var t3 = new So(e3.children.splice(e3.children.length - 5, 5));
                if (e3.parent) {
                  e3.size -= t3.size, e3.height -= t3.height;
                  var n3 = q(e3.parent.children, e3);
                  e3.parent.children.splice(n3 + 1, 0, t3);
                } else {
                  var i2 = new So(e3.children);
                  i2.parent = e3, e3.children = [i2, t3], e3 = i2;
                }
                t3.parent = e3.parent;
              } while (e3.children.length > 10);
              e3.parent.maybeSpill();
            }
          }, iterN: function(e3, t3, n3) {
            for (var i2 = 0; i2 < this.children.length; ++i2) {
              var r2 = this.children[i2], o2 = r2.chunkSize();
              if (e3 < o2) {
                var a2 = Math.min(t3, o2 - e3);
                if (r2.iterN(e3, a2, n3)) return true;
                if (0 == (t3 -= a2)) break;
                e3 = 0;
              } else e3 -= o2;
            }
          } };
          var Fo = function(e3, t3, n3) {
            if (n3) for (var i2 in n3) n3.hasOwnProperty(i2) && (this[i2] = n3[i2]);
            this.doc = e3, this.node = t3;
          };
          function Ao(e3, t3, n3) {
            Gt(t3) < (e3.curOp && e3.curOp.scrollTop || e3.doc.scrollTop) && Ni(e3, n3);
          }
          Fo.prototype.clear = function() {
            var e3 = this.doc.cm, t3 = this.line.widgets, n3 = this.line, i2 = Je(n3);
            if (null != i2 && t3) {
              for (var r2 = 0; r2 < t3.length; ++r2) t3[r2] == this && t3.splice(r2--, 1);
              t3.length || (n3.widgets = null);
              var o2 = kn(this);
              Qe(n3, Math.max(0, n3.height - o2)), e3 && (nr(e3, (function() {
                Ao(e3, n3, -o2), mi(e3, i2, "widget");
              })), dn(e3, "lineWidgetCleared", e3, this, i2));
            }
          }, Fo.prototype.changed = function() {
            var e3 = this, t3 = this.height, n3 = this.doc.cm, i2 = this.line;
            this.height = null;
            var r2 = kn(this) - t3;
            r2 && (Ut(this.doc, i2) || Qe(i2, i2.height + r2), n3 && nr(n3, (function() {
              n3.curOp.forceUpdate = true, Ao(n3, i2, r2), dn(n3, "lineWidgetChanged", n3, e3, Je(i2));
            })));
          }, De(Fo);
          var Eo = 0, Lo = function(e3, t3) {
            this.lines = [], this.type = t3, this.doc = e3, this.id = ++Eo;
          };
          function To(e3, t3, n3, i2, r2) {
            if (i2 && i2.shared) return (function(e4, t4, n4, i3, r3) {
              (i3 = _(i3)).shared = false;
              var o3 = [To(e4, t4, n4, i3, r3)], a3 = o3[0], l3 = i3.widgetNode;
              return Rr(e4, (function(e5) {
                l3 && (i3.widgetNode = l3.cloneNode(true)), o3.push(To(e5, ct(e5, t4), ct(e5, n4), i3, r3));
                for (var s3 = 0; s3 < e5.linked.length; ++s3) if (e5.linked[s3].isParent) return;
                a3 = Y(o3);
              })), new Mo(o3, a3);
            })(e3, t3, n3, i2, r2);
            if (e3.cm && !e3.cm.curOp) return ir(e3.cm, To)(e3, t3, n3, i2, r2);
            var o2 = new Lo(e3, r2), a2 = rt(t3, n3);
            if (i2 && _(i2, o2, false), a2 > 0 || 0 == a2 && false !== o2.clearWhenEmpty) return o2;
            if (o2.replacedWith && (o2.collapsed = true, o2.widgetNode = M("span", [o2.replacedWith], "CodeMirror-widget"), i2.handleMouseEvents || o2.widgetNode.setAttribute("cm-ignore-events", "true"), i2.insertLeft && (o2.widgetNode.insertLeft = true)), o2.collapsed) {
              if (_t(e3, t3.line, t3, n3, o2) || t3.line != n3.line && _t(e3, n3.line, t3, n3, o2)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
              St = true;
            }
            o2.addToHistory && Ur(e3, { from: t3, to: n3, origin: "markText" }, e3.sel, NaN);
            var l2, s2 = t3.line, u2 = e3.cm;
            if (e3.iter(s2, n3.line + 1, (function(i3) {
              u2 && o2.collapsed && !u2.options.lineWrapping && Wt(i3) == u2.display.maxLine && (l2 = true), o2.collapsed && s2 != t3.line && Qe(i3, 0), (function(e4, t4, n4) {
                var i4 = n4 && window.WeakSet && (n4.markedSpans || (n4.markedSpans = /* @__PURE__ */ new WeakSet()));
                i4 && e4.markedSpans && i4.has(e4.markedSpans) ? e4.markedSpans.push(t4) : (e4.markedSpans = e4.markedSpans ? e4.markedSpans.concat([t4]) : [t4], i4 && i4.add(e4.markedSpans)), t4.marker.attachLine(e4);
              })(i3, new Ft(o2, s2 == t3.line ? t3.ch : null, s2 == n3.line ? n3.ch : null), e3.cm && e3.cm.curOp), ++s2;
            })), o2.collapsed && e3.iter(t3.line, n3.line + 1, (function(t4) {
              Ut(e3, t4) && Qe(t4, 0);
            })), o2.clearOnEnter && pe(o2, "beforeCursorEnter", (function() {
              return o2.clear();
            })), o2.readOnly && (kt = true, (e3.history.done.length || e3.history.undone.length) && e3.clearHistory()), o2.collapsed && (o2.id = ++Eo, o2.atomic = true), u2) {
              if (l2 && (u2.curOp.updateMaxLine = true), o2.collapsed) pi(u2, t3.line, n3.line + 1);
              else if (o2.className || o2.startStyle || o2.endStyle || o2.css || o2.attributes || o2.title) for (var c2 = t3.line; c2 <= n3.line; c2++) mi(u2, c2, "text");
              o2.atomic && ao(u2.doc), dn(u2, "markerAdded", u2, o2);
            }
            return o2;
          }
          Lo.prototype.clear = function() {
            if (!this.explicitlyCleared) {
              var e3 = this.doc.cm, t3 = e3 && !e3.curOp;
              if (t3 && Ki(e3), be(this, "clear")) {
                var n3 = this.find();
                n3 && dn(this, "clear", n3.from, n3.to);
              }
              for (var i2 = null, r2 = null, o2 = 0; o2 < this.lines.length; ++o2) {
                var a2 = this.lines[o2], l2 = At(a2.markedSpans, this);
                e3 && !this.collapsed ? mi(e3, Je(a2), "text") : e3 && (null != l2.to && (r2 = Je(a2)), null != l2.from && (i2 = Je(a2))), a2.markedSpans = Et(a2.markedSpans, l2), null == l2.from && this.collapsed && !Ut(this.doc, a2) && e3 && Qe(a2, ai(e3.display));
              }
              if (e3 && this.collapsed && !e3.options.lineWrapping) for (var s2 = 0; s2 < this.lines.length; ++s2) {
                var u2 = Wt(this.lines[s2]), c2 = Vt(u2);
                c2 > e3.display.maxLineLength && (e3.display.maxLine = u2, e3.display.maxLineLength = c2, e3.display.maxLineChanged = true);
              }
              null != i2 && e3 && this.collapsed && pi(e3, i2, r2 + 1), this.lines.length = 0, this.explicitlyCleared = true, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = false, e3 && ao(e3.doc)), e3 && dn(e3, "markerCleared", e3, this, i2, r2), t3 && Zi(e3), this.parent && this.parent.clear();
            }
          }, Lo.prototype.find = function(e3, t3) {
            var n3, i2;
            null == e3 && "bookmark" == this.type && (e3 = 1);
            for (var r2 = 0; r2 < this.lines.length; ++r2) {
              var o2 = this.lines[r2], a2 = At(o2.markedSpans, this);
              if (null != a2.from && (n3 = it(t3 ? o2 : Je(o2), a2.from), -1 == e3)) return n3;
              if (null != a2.to && (i2 = it(t3 ? o2 : Je(o2), a2.to), 1 == e3)) return i2;
            }
            return n3 && { from: n3, to: i2 };
          }, Lo.prototype.changed = function() {
            var e3 = this, t3 = this.find(-1, true), n3 = this, i2 = this.doc.cm;
            t3 && i2 && nr(i2, (function() {
              var r2 = t3.line, o2 = Je(t3.line), a2 = On(i2, o2);
              if (a2 && (Wn(a2), i2.curOp.selectionChanged = i2.curOp.forceUpdate = true), i2.curOp.updateMaxLine = true, !Ut(n3.doc, r2) && null != n3.height) {
                var l2 = n3.height;
                n3.height = null;
                var s2 = kn(n3) - l2;
                s2 && Qe(r2, r2.height + s2);
              }
              dn(i2, "markerChanged", i2, e3);
            }));
          }, Lo.prototype.attachLine = function(e3) {
            if (!this.lines.length && this.doc.cm) {
              var t3 = this.doc.cm.curOp;
              t3.maybeHiddenMarkers && -1 != q(t3.maybeHiddenMarkers, this) || (t3.maybeUnhiddenMarkers || (t3.maybeUnhiddenMarkers = [])).push(this);
            }
            this.lines.push(e3);
          }, Lo.prototype.detachLine = function(e3) {
            if (this.lines.splice(q(this.lines, e3), 1), !this.lines.length && this.doc.cm) {
              var t3 = this.doc.cm.curOp;
              (t3.maybeHiddenMarkers || (t3.maybeHiddenMarkers = [])).push(this);
            }
          }, De(Lo);
          var Mo = function(e3, t3) {
            this.markers = e3, this.primary = t3;
            for (var n3 = 0; n3 < e3.length; ++n3) e3[n3].parent = this;
          };
          function Bo(e3) {
            return e3.findMarks(it(e3.first, 0), e3.clipPos(it(e3.lastLine())), (function(e4) {
              return e4.parent;
            }));
          }
          function No(e3) {
            for (var t3 = function(t4) {
              var n4 = e3[t4], i2 = [n4.primary.doc];
              Rr(n4.primary.doc, (function(e4) {
                return i2.push(e4);
              }));
              for (var r2 = 0; r2 < n4.markers.length; r2++) {
                var o2 = n4.markers[r2];
                -1 == q(i2, o2.doc) && (o2.parent = null, n4.markers.splice(r2--, 1));
              }
            }, n3 = 0; n3 < e3.length; n3++) t3(n3);
          }
          Mo.prototype.clear = function() {
            if (!this.explicitlyCleared) {
              this.explicitlyCleared = true;
              for (var e3 = 0; e3 < this.markers.length; ++e3) this.markers[e3].clear();
              dn(this, "clear");
            }
          }, Mo.prototype.find = function(e3, t3) {
            return this.primary.find(e3, t3);
          }, De(Mo);
          var Oo = 0, Io = function(e3, t3, n3, i2, r2) {
            if (!(this instanceof Io)) return new Io(e3, t3, n3, i2, r2);
            null == n3 && (n3 = 0), So.call(this, [new ko([new Kt("", null)])]), this.first = n3, this.scrollTop = this.scrollLeft = 0, this.cantEdit = false, this.cleanGeneration = 1, this.modeFrontier = this.highlightFrontier = n3;
            var o2 = it(n3, 0);
            this.sel = Lr(o2), this.history = new Wr(null), this.id = ++Oo, this.modeOption = t3, this.lineSep = i2, this.direction = "rtl" == r2 ? "rtl" : "ltr", this.extend = false, "string" == typeof e3 && (e3 = this.splitLines(e3)), Hr(this, { from: o2, to: o2, text: e3 }), io(this, Lr(o2), $);
          };
          Io.prototype = ee(So.prototype, { constructor: Io, iter: function(e3, t3, n3) {
            n3 ? this.iterN(e3 - this.first, t3 - e3, n3) : this.iterN(this.first, this.first + this.size, e3);
          }, insert: function(e3, t3) {
            for (var n3 = 0, i2 = 0; i2 < t3.length; ++i2) n3 += t3[i2].height;
            this.insertInner(e3 - this.first, t3, n3);
          }, remove: function(e3, t3) {
            this.removeInner(e3 - this.first, t3);
          }, getValue: function(e3) {
            var t3 = Ye(this, this.first, this.first + this.size);
            return false === e3 ? t3 : t3.join(e3 || this.lineSeparator());
          }, setValue: or((function(e3) {
            var t3 = it(this.first, 0), n3 = this.first + this.size - 1;
            po(this, { from: t3, to: it(n3, Ke(this, n3).text.length), text: this.splitLines(e3), origin: "setValue", full: true }, true), this.cm && Ii(this.cm, 0, 0), io(this, Lr(t3), $);
          })), replaceRange: function(e3, t3, n3, i2) {
            yo(this, e3, t3 = ct(this, t3), n3 = n3 ? ct(this, n3) : t3, i2);
          }, getRange: function(e3, t3, n3) {
            var i2 = Ze(this, ct(this, e3), ct(this, t3));
            return false === n3 ? i2 : "" === n3 ? i2.join("") : i2.join(n3 || this.lineSeparator());
          }, getLine: function(e3) {
            var t3 = this.getLineHandle(e3);
            return t3 && t3.text;
          }, getLineHandle: function(e3) {
            if (tt(this, e3)) return Ke(this, e3);
          }, getLineNumber: function(e3) {
            return Je(e3);
          }, getLineHandleVisualStart: function(e3) {
            return "number" == typeof e3 && (e3 = Ke(this, e3)), Wt(e3);
          }, lineCount: function() {
            return this.size;
          }, firstLine: function() {
            return this.first;
          }, lastLine: function() {
            return this.first + this.size - 1;
          }, clipPos: function(e3) {
            return ct(this, e3);
          }, getCursor: function(e3) {
            var t3 = this.sel.primary();
            return null == e3 || "head" == e3 ? t3.head : "anchor" == e3 ? t3.anchor : "end" == e3 || "to" == e3 || false === e3 ? t3.to() : t3.from();
          }, listSelections: function() {
            return this.sel.ranges;
          }, somethingSelected: function() {
            return this.sel.somethingSelected();
          }, setCursor: or((function(e3, t3, n3) {
            to(this, ct(this, "number" == typeof e3 ? it(e3, t3 || 0) : e3), null, n3);
          })), setSelection: or((function(e3, t3, n3) {
            to(this, ct(this, e3), ct(this, t3 || e3), n3);
          })), extendSelection: or((function(e3, t3, n3) {
            Qr(this, ct(this, e3), t3 && ct(this, t3), n3);
          })), extendSelections: or((function(e3, t3) {
            Jr(this, dt(this, e3), t3);
          })), extendSelectionsBy: or((function(e3, t3) {
            Jr(this, dt(this, Q(this.sel.ranges, e3)), t3);
          })), setSelections: or((function(e3, t3, n3) {
            if (e3.length) {
              for (var i2 = [], r2 = 0; r2 < e3.length; r2++) i2[r2] = new Ar(ct(this, e3[r2].anchor), ct(this, e3[r2].head || e3[r2].anchor));
              null == t3 && (t3 = Math.min(e3.length - 1, this.sel.primIndex)), io(this, Er(this.cm, i2, t3), n3);
            }
          })), addSelection: or((function(e3, t3, n3) {
            var i2 = this.sel.ranges.slice(0);
            i2.push(new Ar(ct(this, e3), ct(this, t3 || e3))), io(this, Er(this.cm, i2, i2.length - 1), n3);
          })), getSelection: function(e3) {
            for (var t3, n3 = this.sel.ranges, i2 = 0; i2 < n3.length; i2++) {
              var r2 = Ze(this, n3[i2].from(), n3[i2].to());
              t3 = t3 ? t3.concat(r2) : r2;
            }
            return false === e3 ? t3 : t3.join(e3 || this.lineSeparator());
          }, getSelections: function(e3) {
            for (var t3 = [], n3 = this.sel.ranges, i2 = 0; i2 < n3.length; i2++) {
              var r2 = Ze(this, n3[i2].from(), n3[i2].to());
              false !== e3 && (r2 = r2.join(e3 || this.lineSeparator())), t3[i2] = r2;
            }
            return t3;
          }, replaceSelection: function(e3, t3, n3) {
            for (var i2 = [], r2 = 0; r2 < this.sel.ranges.length; r2++) i2[r2] = e3;
            this.replaceSelections(i2, t3, n3 || "+input");
          }, replaceSelections: or((function(e3, t3, n3) {
            for (var i2 = [], r2 = this.sel, o2 = 0; o2 < r2.ranges.length; o2++) {
              var a2 = r2.ranges[o2];
              i2[o2] = { from: a2.from(), to: a2.to(), text: this.splitLines(e3[o2]), origin: n3 };
            }
            for (var l2 = t3 && "end" != t3 && (function(e4, t4, n4) {
              for (var i3 = [], r3 = it(e4.first, 0), o3 = r3, a3 = 0; a3 < t4.length; a3++) {
                var l3 = t4[a3], s3 = Nr(l3.from, r3, o3), u2 = Nr(Tr(l3), r3, o3);
                if (r3 = l3.to, o3 = u2, "around" == n4) {
                  var c2 = e4.sel.ranges[a3], d2 = rt(c2.head, c2.anchor) < 0;
                  i3[a3] = new Ar(d2 ? u2 : s3, d2 ? s3 : u2);
                } else i3[a3] = new Ar(s3, s3);
              }
              return new Fr(i3, e4.sel.primIndex);
            })(this, i2, t3), s2 = i2.length - 1; s2 >= 0; s2--) po(this, i2[s2]);
            l2 ? no(this, l2) : this.cm && Oi(this.cm);
          })), undo: or((function() {
            go(this, "undo");
          })), redo: or((function() {
            go(this, "redo");
          })), undoSelection: or((function() {
            go(this, "undo", true);
          })), redoSelection: or((function() {
            go(this, "redo", true);
          })), setExtending: function(e3) {
            this.extend = e3;
          }, getExtending: function() {
            return this.extend;
          }, historySize: function() {
            for (var e3 = this.history, t3 = 0, n3 = 0, i2 = 0; i2 < e3.done.length; i2++) e3.done[i2].ranges || ++t3;
            for (var r2 = 0; r2 < e3.undone.length; r2++) e3.undone[r2].ranges || ++n3;
            return { undo: t3, redo: n3 };
          }, clearHistory: function() {
            var e3 = this;
            this.history = new Wr(this.history), Rr(this, (function(t3) {
              return t3.history = e3.history;
            }), true);
          }, markClean: function() {
            this.cleanGeneration = this.changeGeneration(true);
          }, changeGeneration: function(e3) {
            return e3 && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation;
          }, isClean: function(e3) {
            return this.history.generation == (e3 || this.cleanGeneration);
          }, getHistory: function() {
            return { done: Zr(this.history.done), undone: Zr(this.history.undone) };
          }, setHistory: function(e3) {
            var t3 = this.history = new Wr(this.history);
            t3.done = Zr(e3.done.slice(0), null, true), t3.undone = Zr(e3.undone.slice(0), null, true);
          }, setGutterMarker: or((function(e3, t3, n3) {
            return wo(this, e3, "gutter", (function(e4) {
              var i2 = e4.gutterMarkers || (e4.gutterMarkers = {});
              return i2[t3] = n3, !n3 && re(i2) && (e4.gutterMarkers = null), true;
            }));
          })), clearGutter: or((function(e3) {
            var t3 = this;
            this.iter((function(n3) {
              n3.gutterMarkers && n3.gutterMarkers[e3] && wo(t3, n3, "gutter", (function() {
                return n3.gutterMarkers[e3] = null, re(n3.gutterMarkers) && (n3.gutterMarkers = null), true;
              }));
            }));
          })), lineInfo: function(e3) {
            var t3;
            if ("number" == typeof e3) {
              if (!tt(this, e3)) return null;
              if (t3 = e3, !(e3 = Ke(this, e3))) return null;
            } else if (null == (t3 = Je(e3))) return null;
            return { line: t3, handle: e3, text: e3.text, gutterMarkers: e3.gutterMarkers, textClass: e3.textClass, bgClass: e3.bgClass, wrapClass: e3.wrapClass, widgets: e3.widgets };
          }, addLineClass: or((function(e3, t3, n3) {
            return wo(this, e3, "gutter" == t3 ? "gutter" : "class", (function(e4) {
              var i2 = "text" == t3 ? "textClass" : "background" == t3 ? "bgClass" : "gutter" == t3 ? "gutterClass" : "wrapClass";
              if (e4[i2]) {
                if (S(n3).test(e4[i2])) return false;
                e4[i2] += " " + n3;
              } else e4[i2] = n3;
              return true;
            }));
          })), removeLineClass: or((function(e3, t3, n3) {
            return wo(this, e3, "gutter" == t3 ? "gutter" : "class", (function(e4) {
              var i2 = "text" == t3 ? "textClass" : "background" == t3 ? "bgClass" : "gutter" == t3 ? "gutterClass" : "wrapClass", r2 = e4[i2];
              if (!r2) return false;
              if (null == n3) e4[i2] = null;
              else {
                var o2 = r2.match(S(n3));
                if (!o2) return false;
                var a2 = o2.index + o2[0].length;
                e4[i2] = r2.slice(0, o2.index) + (o2.index && a2 != r2.length ? " " : "") + r2.slice(a2) || null;
              }
              return true;
            }));
          })), addLineWidget: or((function(e3, t3, n3) {
            return (function(e4, t4, n4, i2) {
              var r2 = new Fo(e4, n4, i2), o2 = e4.cm;
              return o2 && r2.noHScroll && (o2.display.alignWidgets = true), wo(e4, t4, "widget", (function(t5) {
                var n5 = t5.widgets || (t5.widgets = []);
                if (null == r2.insertAt ? n5.push(r2) : n5.splice(Math.min(n5.length, Math.max(0, r2.insertAt)), 0, r2), r2.line = t5, o2 && !Ut(e4, t5)) {
                  var i3 = Gt(t5) < e4.scrollTop;
                  Qe(t5, t5.height + kn(r2)), i3 && Ni(o2, r2.height), o2.curOp.forceUpdate = true;
                }
                return true;
              })), o2 && dn(o2, "lineWidgetAdded", o2, r2, "number" == typeof t4 ? t4 : Je(t4)), r2;
            })(this, e3, t3, n3);
          })), removeLineWidget: function(e3) {
            e3.clear();
          }, markText: function(e3, t3, n3) {
            return To(this, ct(this, e3), ct(this, t3), n3, n3 && n3.type || "range");
          }, setBookmark: function(e3, t3) {
            var n3 = { replacedWith: t3 && (null == t3.nodeType ? t3.widget : t3), insertLeft: t3 && t3.insertLeft, clearWhenEmpty: false, shared: t3 && t3.shared, handleMouseEvents: t3 && t3.handleMouseEvents };
            return To(this, e3 = ct(this, e3), e3, n3, "bookmark");
          }, findMarksAt: function(e3) {
            var t3 = [], n3 = Ke(this, (e3 = ct(this, e3)).line).markedSpans;
            if (n3) for (var i2 = 0; i2 < n3.length; ++i2) {
              var r2 = n3[i2];
              (null == r2.from || r2.from <= e3.ch) && (null == r2.to || r2.to >= e3.ch) && t3.push(r2.marker.parent || r2.marker);
            }
            return t3;
          }, findMarks: function(e3, t3, n3) {
            e3 = ct(this, e3), t3 = ct(this, t3);
            var i2 = [], r2 = e3.line;
            return this.iter(e3.line, t3.line + 1, (function(o2) {
              var a2 = o2.markedSpans;
              if (a2) for (var l2 = 0; l2 < a2.length; l2++) {
                var s2 = a2[l2];
                null != s2.to && r2 == e3.line && e3.ch >= s2.to || null == s2.from && r2 != e3.line || null != s2.from && r2 == t3.line && s2.from >= t3.ch || n3 && !n3(s2.marker) || i2.push(s2.marker.parent || s2.marker);
              }
              ++r2;
            })), i2;
          }, getAllMarks: function() {
            var e3 = [];
            return this.iter((function(t3) {
              var n3 = t3.markedSpans;
              if (n3) for (var i2 = 0; i2 < n3.length; ++i2) null != n3[i2].from && e3.push(n3[i2].marker);
            })), e3;
          }, posFromIndex: function(e3) {
            var t3, n3 = this.first, i2 = this.lineSeparator().length;
            return this.iter((function(r2) {
              var o2 = r2.text.length + i2;
              if (o2 > e3) return t3 = e3, true;
              e3 -= o2, ++n3;
            })), ct(this, it(n3, t3));
          }, indexFromPos: function(e3) {
            var t3 = (e3 = ct(this, e3)).ch;
            if (e3.line < this.first || e3.ch < 0) return 0;
            var n3 = this.lineSeparator().length;
            return this.iter(this.first, e3.line, (function(e4) {
              t3 += e4.text.length + n3;
            })), t3;
          }, copy: function(e3) {
            var t3 = new Io(Ye(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            return t3.scrollTop = this.scrollTop, t3.scrollLeft = this.scrollLeft, t3.sel = this.sel, t3.extend = false, e3 && (t3.history.undoDepth = this.history.undoDepth, t3.setHistory(this.getHistory())), t3;
          }, linkedDoc: function(e3) {
            e3 || (e3 = {});
            var t3 = this.first, n3 = this.first + this.size;
            null != e3.from && e3.from > t3 && (t3 = e3.from), null != e3.to && e3.to < n3 && (n3 = e3.to);
            var i2 = new Io(Ye(this, t3, n3), e3.mode || this.modeOption, t3, this.lineSep, this.direction);
            return e3.sharedHist && (i2.history = this.history), (this.linked || (this.linked = [])).push({ doc: i2, sharedHist: e3.sharedHist }), i2.linked = [{ doc: this, isParent: true, sharedHist: e3.sharedHist }], (function(e4, t4) {
              for (var n4 = 0; n4 < t4.length; n4++) {
                var i3 = t4[n4], r2 = i3.find(), o2 = e4.clipPos(r2.from), a2 = e4.clipPos(r2.to);
                if (rt(o2, a2)) {
                  var l2 = To(e4, o2, a2, i3.primary, i3.primary.type);
                  i3.markers.push(l2), l2.parent = i3;
                }
              }
            })(i2, Bo(this)), i2;
          }, unlinkDoc: function(e3) {
            if (e3 instanceof Ma && (e3 = e3.doc), this.linked) for (var t3 = 0; t3 < this.linked.length; ++t3) {
              if (this.linked[t3].doc == e3) {
                this.linked.splice(t3, 1), e3.unlinkDoc(this), No(Bo(this));
                break;
              }
            }
            if (e3.history == this.history) {
              var n3 = [e3.id];
              Rr(e3, (function(e4) {
                return n3.push(e4.id);
              }), true), e3.history = new Wr(null), e3.history.done = Zr(this.history.done, n3), e3.history.undone = Zr(this.history.undone, n3);
            }
          }, iterLinkedDocs: function(e3) {
            Rr(this, e3);
          }, getMode: function() {
            return this.mode;
          }, getEditor: function() {
            return this.cm;
          }, splitLines: function(e3) {
            return this.lineSep ? e3.split(this.lineSep) : Oe(e3);
          }, lineSeparator: function() {
            return this.lineSep || "\n";
          }, setDirection: or((function(e3) {
            var t3;
            ("rtl" != e3 && (e3 = "ltr"), e3 != this.direction) && (this.direction = e3, this.iter((function(e4) {
              return e4.order = null;
            })), this.cm && nr(t3 = this.cm, (function() {
              _r(t3), pi(t3);
            })));
          })) }), Io.prototype.eachLine = Io.prototype.iter;
          var zo = 0;
          function Ho(e3) {
            var t3 = this;
            if (Ro(t3), !xe(t3, e3) && !Sn(t3.display, e3)) {
              Ce(e3), a && (zo = +/* @__PURE__ */ new Date());
              var n3 = hi(t3, e3, true), i2 = e3.dataTransfer.files;
              if (n3 && !t3.isReadOnly()) if (i2 && i2.length && window.FileReader && window.File) for (var r2 = i2.length, o2 = Array(r2), l2 = 0, s2 = function() {
                ++l2 == r2 && ir(t3, (function() {
                  var e4 = { from: n3 = ct(t3.doc, n3), to: n3, text: t3.doc.splitLines(o2.filter((function(e5) {
                    return null != e5;
                  })).join(t3.doc.lineSeparator())), origin: "paste" };
                  po(t3.doc, e4), no(t3.doc, Lr(ct(t3.doc, n3), ct(t3.doc, Tr(e4))));
                }))();
              }, u2 = function(e4, n4) {
                if (t3.options.allowDropFileTypes && -1 == q(t3.options.allowDropFileTypes, e4.type)) s2();
                else {
                  var i3 = new FileReader();
                  i3.onerror = function() {
                    return s2();
                  }, i3.onload = function() {
                    var e5 = i3.result;
                    /[\x00-\x08\x0e-\x1f]{2}/.test(e5) || (o2[n4] = e5), s2();
                  }, i3.readAsText(e4);
                }
              }, c2 = 0; c2 < i2.length; c2++) u2(i2[c2], c2);
              else {
                if (t3.state.draggingText && t3.doc.sel.contains(n3) > -1) return t3.state.draggingText(e3), void setTimeout((function() {
                  return t3.display.input.focus();
                }), 20);
                try {
                  var d2 = e3.dataTransfer.getData("Text");
                  if (d2) {
                    var h2;
                    if (t3.state.draggingText && !t3.state.draggingText.copy && (h2 = t3.listSelections()), ro(t3.doc, Lr(n3, n3)), h2) for (var f2 = 0; f2 < h2.length; ++f2) yo(t3.doc, "", h2[f2].anchor, h2[f2].head, "drag");
                    t3.replaceSelection(d2, "around", "paste"), t3.display.input.focus();
                  }
                } catch (e4) {
                }
              }
            }
          }
          function Ro(e3) {
            e3.display.dragCursor && (e3.display.lineSpace.removeChild(e3.display.dragCursor), e3.display.dragCursor = null);
          }
          function Po(e3) {
            if (document.getElementsByClassName) {
              for (var t3 = document.getElementsByClassName("CodeMirror"), n3 = [], i2 = 0; i2 < t3.length; i2++) {
                var r2 = t3[i2].CodeMirror;
                r2 && n3.push(r2);
              }
              n3.length && n3[0].operation((function() {
                for (var t4 = 0; t4 < n3.length; t4++) e3(n3[t4]);
              }));
            }
          }
          var _o = false;
          function Wo() {
            var e3;
            _o || (pe(window, "resize", (function() {
              null == e3 && (e3 = setTimeout((function() {
                e3 = null, Po(jo);
              }), 100));
            })), pe(window, "blur", (function() {
              return Po(Ei);
            })), _o = true);
          }
          function jo(e3) {
            var t3 = e3.display;
            t3.cachedCharWidth = t3.cachedTextHeight = t3.cachedPaddingH = null, t3.scrollbarsClipped = false, e3.setSize();
          }
          for (var qo = { 3: "Pause", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert", 46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 106: "*", 107: "=", 109: "-", 110: ".", 111: "/", 145: "ScrollLock", 173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 224: "Mod", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete", 63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert" }, Uo = 0; Uo < 10; Uo++) qo[Uo + 48] = qo[Uo + 96] = String(Uo);
          for (var $o = 65; $o <= 90; $o++) qo[$o] = String.fromCharCode($o);
          for (var Go = 1; Go <= 12; Go++) qo[Go + 111] = qo[Go + 63235] = "F" + Go;
          var Vo = {};
          function Xo(e3) {
            var t3, n3, i2, r2, o2 = e3.split(/-(?!$)/);
            e3 = o2[o2.length - 1];
            for (var a2 = 0; a2 < o2.length - 1; a2++) {
              var l2 = o2[a2];
              if (/^(cmd|meta|m)$/i.test(l2)) r2 = true;
              else if (/^a(lt)?$/i.test(l2)) t3 = true;
              else if (/^(c|ctrl|control)$/i.test(l2)) n3 = true;
              else {
                if (!/^s(hift)?$/i.test(l2)) throw new Error("Unrecognized modifier name: " + l2);
                i2 = true;
              }
            }
            return t3 && (e3 = "Alt-" + e3), n3 && (e3 = "Ctrl-" + e3), r2 && (e3 = "Cmd-" + e3), i2 && (e3 = "Shift-" + e3), e3;
          }
          function Ko(e3) {
            var t3 = {};
            for (var n3 in e3) if (e3.hasOwnProperty(n3)) {
              var i2 = e3[n3];
              if (/^(name|fallthrough|(de|at)tach)$/.test(n3)) continue;
              if ("..." == i2) {
                delete e3[n3];
                continue;
              }
              for (var r2 = Q(n3.split(" "), Xo), o2 = 0; o2 < r2.length; o2++) {
                var a2 = void 0, l2 = void 0;
                o2 == r2.length - 1 ? (l2 = r2.join(" "), a2 = i2) : (l2 = r2.slice(0, o2 + 1).join(" "), a2 = "...");
                var s2 = t3[l2];
                if (s2) {
                  if (s2 != a2) throw new Error("Inconsistent bindings for " + l2);
                } else t3[l2] = a2;
              }
              delete e3[n3];
            }
            for (var u2 in t3) e3[u2] = t3[u2];
            return e3;
          }
          function Zo(e3, t3, n3, i2) {
            var r2 = (t3 = ea(t3)).call ? t3.call(e3, i2) : t3[e3];
            if (false === r2) return "nothing";
            if ("..." === r2) return "multi";
            if (null != r2 && n3(r2)) return "handled";
            if (t3.fallthrough) {
              if ("[object Array]" != Object.prototype.toString.call(t3.fallthrough)) return Zo(e3, t3.fallthrough, n3, i2);
              for (var o2 = 0; o2 < t3.fallthrough.length; o2++) {
                var a2 = Zo(e3, t3.fallthrough[o2], n3, i2);
                if (a2) return a2;
              }
            }
          }
          function Yo(e3) {
            var t3 = "string" == typeof e3 ? e3 : qo[e3.keyCode];
            return "Ctrl" == t3 || "Alt" == t3 || "Shift" == t3 || "Mod" == t3;
          }
          function Qo(e3, t3, n3) {
            var i2 = e3;
            return t3.altKey && "Alt" != i2 && (e3 = "Alt-" + e3), (w ? t3.metaKey : t3.ctrlKey) && "Ctrl" != i2 && (e3 = "Ctrl-" + e3), (w ? t3.ctrlKey : t3.metaKey) && "Mod" != i2 && (e3 = "Cmd-" + e3), !n3 && t3.shiftKey && "Shift" != i2 && (e3 = "Shift-" + e3), e3;
          }
          function Jo(e3, t3) {
            if (h && 34 == e3.keyCode && e3.char) return false;
            var n3 = qo[e3.keyCode];
            return null != n3 && !e3.altGraphKey && (3 == e3.keyCode && e3.code && (n3 = e3.code), Qo(n3, e3, t3));
          }
          function ea(e3) {
            return "string" == typeof e3 ? Vo[e3] : e3;
          }
          function ta(e3, t3) {
            for (var n3 = e3.doc.sel.ranges, i2 = [], r2 = 0; r2 < n3.length; r2++) {
              for (var o2 = t3(n3[r2]); i2.length && rt(o2.from, Y(i2).to) <= 0; ) {
                var a2 = i2.pop();
                if (rt(a2.from, o2.from) < 0) {
                  o2.from = a2.from;
                  break;
                }
              }
              i2.push(o2);
            }
            nr(e3, (function() {
              for (var t4 = i2.length - 1; t4 >= 0; t4--) yo(e3.doc, "", i2[t4].from, i2[t4].to, "+delete");
              Oi(e3);
            }));
          }
          function na(e3, t3, n3) {
            var i2 = le(e3.text, t3 + n3, n3);
            return i2 < 0 || i2 > e3.text.length ? null : i2;
          }
          function ia(e3, t3, n3) {
            var i2 = na(e3, t3.ch, n3);
            return null == i2 ? null : new it(t3.line, i2, n3 < 0 ? "after" : "before");
          }
          function ra(e3, t3, n3, i2, r2) {
            if (e3) {
              "rtl" == t3.doc.direction && (r2 = -r2);
              var o2 = he(n3, t3.doc.direction);
              if (o2) {
                var a2, l2 = r2 < 0 ? Y(o2) : o2[0], s2 = r2 < 0 == (1 == l2.level) ? "after" : "before";
                if (l2.level > 0 || "rtl" == t3.doc.direction) {
                  var u2 = In(t3, n3);
                  a2 = r2 < 0 ? n3.text.length - 1 : 0;
                  var c2 = zn(t3, u2, a2).top;
                  a2 = se((function(e4) {
                    return zn(t3, u2, e4).top == c2;
                  }), r2 < 0 == (1 == l2.level) ? l2.from : l2.to - 1, a2), "before" == s2 && (a2 = na(n3, a2, 1));
                } else a2 = r2 < 0 ? l2.to : l2.from;
                return new it(i2, a2, s2);
              }
            }
            return new it(i2, r2 < 0 ? n3.text.length : 0, r2 < 0 ? "before" : "after");
          }
          Vo.basic = { Left: "goCharLeft", Right: "goCharRight", Up: "goLineUp", Down: "goLineDown", End: "goLineEnd", Home: "goLineStartSmart", PageUp: "goPageUp", PageDown: "goPageDown", Delete: "delCharAfter", Backspace: "delCharBefore", "Shift-Backspace": "delCharBefore", Tab: "defaultTab", "Shift-Tab": "indentAuto", Enter: "newlineAndIndent", Insert: "toggleOverwrite", Esc: "singleSelection" }, Vo.pcDefault = { "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo", "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown", "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd", "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find", "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll", "Ctrl-[": "indentLess", "Ctrl-]": "indentMore", "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection", fallthrough: "basic" }, Vo.emacsy = { "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd", "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars", "Ctrl-O": "openLine" }, Vo.macDefault = { "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo", "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft", "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore", "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find", "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll", "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight", "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd", fallthrough: ["basic", "emacsy"] }, Vo.default = y ? Vo.macDefault : Vo.pcDefault;
          var oa = { selectAll: ho, singleSelection: function(e3) {
            return e3.setSelection(e3.getCursor("anchor"), e3.getCursor("head"), $);
          }, killLine: function(e3) {
            return ta(e3, (function(t3) {
              if (t3.empty()) {
                var n3 = Ke(e3.doc, t3.head.line).text.length;
                return t3.head.ch == n3 && t3.head.line < e3.lastLine() ? { from: t3.head, to: it(t3.head.line + 1, 0) } : { from: t3.head, to: it(t3.head.line, n3) };
              }
              return { from: t3.from(), to: t3.to() };
            }));
          }, deleteLine: function(e3) {
            return ta(e3, (function(t3) {
              return { from: it(t3.from().line, 0), to: ct(e3.doc, it(t3.to().line + 1, 0)) };
            }));
          }, delLineLeft: function(e3) {
            return ta(e3, (function(e4) {
              return { from: it(e4.from().line, 0), to: e4.from() };
            }));
          }, delWrappedLineLeft: function(e3) {
            return ta(e3, (function(t3) {
              var n3 = e3.charCoords(t3.head, "div").top + 5;
              return { from: e3.coordsChar({ left: 0, top: n3 }, "div"), to: t3.from() };
            }));
          }, delWrappedLineRight: function(e3) {
            return ta(e3, (function(t3) {
              var n3 = e3.charCoords(t3.head, "div").top + 5, i2 = e3.coordsChar({ left: e3.display.lineDiv.offsetWidth + 100, top: n3 }, "div");
              return { from: t3.from(), to: i2 };
            }));
          }, undo: function(e3) {
            return e3.undo();
          }, redo: function(e3) {
            return e3.redo();
          }, undoSelection: function(e3) {
            return e3.undoSelection();
          }, redoSelection: function(e3) {
            return e3.redoSelection();
          }, goDocStart: function(e3) {
            return e3.extendSelection(it(e3.firstLine(), 0));
          }, goDocEnd: function(e3) {
            return e3.extendSelection(it(e3.lastLine()));
          }, goLineStart: function(e3) {
            return e3.extendSelectionsBy((function(t3) {
              return aa(e3, t3.head.line);
            }), { origin: "+move", bias: 1 });
          }, goLineStartSmart: function(e3) {
            return e3.extendSelectionsBy((function(t3) {
              return la(e3, t3.head);
            }), { origin: "+move", bias: 1 });
          }, goLineEnd: function(e3) {
            return e3.extendSelectionsBy((function(t3) {
              return (function(e4, t4) {
                var n3 = Ke(e4.doc, t4), i2 = (function(e5) {
                  for (var t5; t5 = Rt(e5); ) e5 = t5.find(1, true).line;
                  return e5;
                })(n3);
                i2 != n3 && (t4 = Je(i2));
                return ra(true, e4, n3, t4, -1);
              })(e3, t3.head.line);
            }), { origin: "+move", bias: -1 });
          }, goLineRight: function(e3) {
            return e3.extendSelectionsBy((function(t3) {
              var n3 = e3.cursorCoords(t3.head, "div").top + 5;
              return e3.coordsChar({ left: e3.display.lineDiv.offsetWidth + 100, top: n3 }, "div");
            }), V);
          }, goLineLeft: function(e3) {
            return e3.extendSelectionsBy((function(t3) {
              var n3 = e3.cursorCoords(t3.head, "div").top + 5;
              return e3.coordsChar({ left: 0, top: n3 }, "div");
            }), V);
          }, goLineLeftSmart: function(e3) {
            return e3.extendSelectionsBy((function(t3) {
              var n3 = e3.cursorCoords(t3.head, "div").top + 5, i2 = e3.coordsChar({ left: 0, top: n3 }, "div");
              return i2.ch < e3.getLine(i2.line).search(/\S/) ? la(e3, t3.head) : i2;
            }), V);
          }, goLineUp: function(e3) {
            return e3.moveV(-1, "line");
          }, goLineDown: function(e3) {
            return e3.moveV(1, "line");
          }, goPageUp: function(e3) {
            return e3.moveV(-1, "page");
          }, goPageDown: function(e3) {
            return e3.moveV(1, "page");
          }, goCharLeft: function(e3) {
            return e3.moveH(-1, "char");
          }, goCharRight: function(e3) {
            return e3.moveH(1, "char");
          }, goColumnLeft: function(e3) {
            return e3.moveH(-1, "column");
          }, goColumnRight: function(e3) {
            return e3.moveH(1, "column");
          }, goWordLeft: function(e3) {
            return e3.moveH(-1, "word");
          }, goGroupRight: function(e3) {
            return e3.moveH(1, "group");
          }, goGroupLeft: function(e3) {
            return e3.moveH(-1, "group");
          }, goWordRight: function(e3) {
            return e3.moveH(1, "word");
          }, delCharBefore: function(e3) {
            return e3.deleteH(-1, "codepoint");
          }, delCharAfter: function(e3) {
            return e3.deleteH(1, "char");
          }, delWordBefore: function(e3) {
            return e3.deleteH(-1, "word");
          }, delWordAfter: function(e3) {
            return e3.deleteH(1, "word");
          }, delGroupBefore: function(e3) {
            return e3.deleteH(-1, "group");
          }, delGroupAfter: function(e3) {
            return e3.deleteH(1, "group");
          }, indentAuto: function(e3) {
            return e3.indentSelection("smart");
          }, indentMore: function(e3) {
            return e3.indentSelection("add");
          }, indentLess: function(e3) {
            return e3.indentSelection("subtract");
          }, insertTab: function(e3) {
            return e3.replaceSelection("	");
          }, insertSoftTab: function(e3) {
            for (var t3 = [], n3 = e3.listSelections(), i2 = e3.options.tabSize, r2 = 0; r2 < n3.length; r2++) {
              var o2 = n3[r2].from(), a2 = W(e3.getLine(o2.line), o2.ch, i2);
              t3.push(Z(i2 - a2 % i2));
            }
            e3.replaceSelections(t3);
          }, defaultTab: function(e3) {
            e3.somethingSelected() ? e3.indentSelection("add") : e3.execCommand("insertTab");
          }, transposeChars: function(e3) {
            return nr(e3, (function() {
              for (var t3 = e3.listSelections(), n3 = [], i2 = 0; i2 < t3.length; i2++) if (t3[i2].empty()) {
                var r2 = t3[i2].head, o2 = Ke(e3.doc, r2.line).text;
                if (o2) {
                  if (r2.ch == o2.length && (r2 = new it(r2.line, r2.ch - 1)), r2.ch > 0) r2 = new it(r2.line, r2.ch + 1), e3.replaceRange(o2.charAt(r2.ch - 1) + o2.charAt(r2.ch - 2), it(r2.line, r2.ch - 2), r2, "+transpose");
                  else if (r2.line > e3.doc.first) {
                    var a2 = Ke(e3.doc, r2.line - 1).text;
                    a2 && (r2 = new it(r2.line, 1), e3.replaceRange(o2.charAt(0) + e3.doc.lineSeparator() + a2.charAt(a2.length - 1), it(r2.line - 1, a2.length - 1), r2, "+transpose"));
                  }
                }
                n3.push(new Ar(r2, r2));
              }
              e3.setSelections(n3);
            }));
          }, newlineAndIndent: function(e3) {
            return nr(e3, (function() {
              for (var t3 = e3.listSelections(), n3 = t3.length - 1; n3 >= 0; n3--) e3.replaceRange(e3.doc.lineSeparator(), t3[n3].anchor, t3[n3].head, "+input");
              t3 = e3.listSelections();
              for (var i2 = 0; i2 < t3.length; i2++) e3.indentLine(t3[i2].from().line, null, true);
              Oi(e3);
            }));
          }, openLine: function(e3) {
            return e3.replaceSelection("\n", "start");
          }, toggleOverwrite: function(e3) {
            return e3.toggleOverwrite();
          } };
          function aa(e3, t3) {
            var n3 = Ke(e3.doc, t3), i2 = Wt(n3);
            return i2 != n3 && (t3 = Je(i2)), ra(true, e3, i2, t3, 1);
          }
          function la(e3, t3) {
            var n3 = aa(e3, t3.line), i2 = Ke(e3.doc, n3.line), r2 = he(i2, e3.doc.direction);
            if (!r2 || 0 == r2[0].level) {
              var o2 = Math.max(n3.ch, i2.text.search(/\S/)), a2 = t3.line == n3.line && t3.ch <= o2 && t3.ch;
              return it(n3.line, a2 ? 0 : o2, n3.sticky);
            }
            return n3;
          }
          function sa(e3, t3, n3) {
            if ("string" == typeof t3 && !(t3 = oa[t3])) return false;
            e3.display.input.ensurePolled();
            var i2 = e3.display.shift, r2 = false;
            try {
              e3.isReadOnly() && (e3.state.suppressEdits = true), n3 && (e3.display.shift = false), r2 = t3(e3) != U;
            } finally {
              e3.display.shift = i2, e3.state.suppressEdits = false;
            }
            return r2;
          }
          var ua = new j();
          function ca(e3, t3, n3, i2) {
            var r2 = e3.state.keySeq;
            if (r2) {
              if (Yo(t3)) return "handled";
              if (/\'$/.test(t3) ? e3.state.keySeq = null : ua.set(50, (function() {
                e3.state.keySeq == r2 && (e3.state.keySeq = null, e3.display.input.reset());
              })), da(e3, r2 + " " + t3, n3, i2)) return true;
            }
            return da(e3, t3, n3, i2);
          }
          function da(e3, t3, n3, i2) {
            var r2 = (function(e4, t4, n4) {
              for (var i3 = 0; i3 < e4.state.keyMaps.length; i3++) {
                var r3 = Zo(t4, e4.state.keyMaps[i3], n4, e4);
                if (r3) return r3;
              }
              return e4.options.extraKeys && Zo(t4, e4.options.extraKeys, n4, e4) || Zo(t4, e4.options.keyMap, n4, e4);
            })(e3, t3, i2);
            return "multi" == r2 && (e3.state.keySeq = t3), "handled" == r2 && dn(e3, "keyHandled", e3, t3, n3), "handled" != r2 && "multi" != r2 || (Ce(n3), ki(e3)), !!r2;
          }
          function ha(e3, t3) {
            var n3 = Jo(t3, true);
            return !!n3 && (t3.shiftKey && !e3.state.keySeq ? ca(e3, "Shift-" + n3, t3, (function(t4) {
              return sa(e3, t4, true);
            })) || ca(e3, n3, t3, (function(t4) {
              if ("string" == typeof t4 ? /^go[A-Z]/.test(t4) : t4.motion) return sa(e3, t4);
            })) : ca(e3, n3, t3, (function(t4) {
              return sa(e3, t4);
            })));
          }
          var fa = null;
          function pa(e3) {
            var t3 = this;
            if (!(e3.target && e3.target != t3.display.input.getField() || (t3.curOp.focus = N(H(t3)), xe(t3, e3)))) {
              a && l < 11 && 27 == e3.keyCode && (e3.returnValue = false);
              var i2 = e3.keyCode;
              t3.display.shift = 16 == i2 || e3.shiftKey;
              var r2 = ha(t3, e3);
              h && (fa = r2 ? i2 : null, r2 || 88 != i2 || ze || !(y ? e3.metaKey : e3.ctrlKey) || t3.replaceSelection("", null, "cut")), n2 && !y && !r2 && 46 == i2 && e3.shiftKey && !e3.ctrlKey && document.execCommand && document.execCommand("cut"), 18 != i2 || /\bCodeMirror-crosshair\b/.test(t3.display.lineDiv.className) || (function(e4) {
                var t4 = e4.display.lineDiv;
                function n3(e5) {
                  18 != e5.keyCode && e5.altKey || (A(t4, "CodeMirror-crosshair"), ge(document, "keyup", n3), ge(document, "mouseover", n3));
                }
                O(t4, "CodeMirror-crosshair"), pe(document, "keyup", n3), pe(document, "mouseover", n3);
              })(t3);
            }
          }
          function ma(e3) {
            16 == e3.keyCode && (this.doc.sel.shift = false), xe(this, e3);
          }
          function ga(e3) {
            var t3 = this;
            if (!(e3.target && e3.target != t3.display.input.getField() || Sn(t3.display, e3) || xe(t3, e3) || e3.ctrlKey && !e3.altKey || y && e3.metaKey)) {
              var n3 = e3.keyCode, i2 = e3.charCode;
              if (h && n3 == fa) return fa = null, void Ce(e3);
              if (!h || e3.which && !(e3.which < 10) || !ha(t3, e3)) {
                var r2 = String.fromCharCode(null == i2 ? n3 : i2);
                "\b" != r2 && ((function(e4, t4, n4) {
                  return ca(e4, "'" + n4 + "'", t4, (function(t5) {
                    return sa(e4, t5, true);
                  }));
                })(t3, e3, r2) || t3.display.input.onKeyPress(e3));
              }
            }
          }
          var va, xa, ya = function(e3, t3, n3) {
            this.time = e3, this.pos = t3, this.button = n3;
          };
          function ba(e3) {
            var t3 = this, n3 = t3.display;
            if (!(xe(t3, e3) || n3.activeTouch && n3.input.supportsTouch())) {
              if (n3.input.ensurePolled(), n3.shift = e3.shiftKey, Sn(n3, e3)) s || (n3.scroller.draggable = false, setTimeout((function() {
                return n3.scroller.draggable = true;
              }), 100));
              else if (!wa(t3, e3)) {
                var i2 = hi(t3, e3), r2 = Ae(e3), o2 = i2 ? (function(e4, t4) {
                  var n4 = +/* @__PURE__ */ new Date();
                  return xa && xa.compare(n4, e4, t4) ? (va = xa = null, "triple") : va && va.compare(n4, e4, t4) ? (xa = new ya(n4, e4, t4), va = null, "double") : (va = new ya(n4, e4, t4), xa = null, "single");
                })(i2, r2) : "single";
                R(t3).focus(), 1 == r2 && t3.state.selectingText && t3.state.selectingText(e3), i2 && (function(e4, t4, n4, i3, r3) {
                  var o3 = "Click";
                  "double" == i3 ? o3 = "Double" + o3 : "triple" == i3 && (o3 = "Triple" + o3);
                  return ca(e4, Qo(o3 = (1 == t4 ? "Left" : 2 == t4 ? "Middle" : "Right") + o3, r3), r3, (function(t5) {
                    if ("string" == typeof t5 && (t5 = oa[t5]), !t5) return false;
                    var i4 = false;
                    try {
                      e4.isReadOnly() && (e4.state.suppressEdits = true), i4 = t5(e4, n4) != U;
                    } finally {
                      e4.state.suppressEdits = false;
                    }
                    return i4;
                  }));
                })(t3, r2, i2, o2, e3) || (1 == r2 ? i2 ? (function(e4, t4, n4, i3) {
                  a ? setTimeout(P(Si, e4), 0) : e4.curOp.focus = N(H(e4));
                  var r3, o3 = (function(e5, t5, n5) {
                    var i4 = e5.getOption("configureMouse"), r4 = i4 ? i4(e5, t5, n5) : {};
                    if (null == r4.unit) {
                      var o4 = b ? n5.shiftKey && n5.metaKey : n5.altKey;
                      r4.unit = o4 ? "rectangle" : "single" == t5 ? "char" : "double" == t5 ? "word" : "line";
                    }
                    (null == r4.extend || e5.doc.extend) && (r4.extend = e5.doc.extend || n5.shiftKey);
                    null == r4.addNew && (r4.addNew = y ? n5.metaKey : n5.ctrlKey);
                    null == r4.moveOnDrag && (r4.moveOnDrag = !(y ? n5.altKey : n5.ctrlKey));
                    return r4;
                  })(e4, n4, i3), u2 = e4.doc.sel;
                  e4.options.dragDrop && Te && !e4.isReadOnly() && "single" == n4 && (r3 = u2.contains(t4)) > -1 && (rt((r3 = u2.ranges[r3]).from(), t4) < 0 || t4.xRel > 0) && (rt(r3.to(), t4) > 0 || t4.xRel < 0) ? (function(e5, t5, n5, i4) {
                    var r4 = e5.display, o4 = false, u3 = ir(e5, (function(t6) {
                      s && (r4.scroller.draggable = false), e5.state.draggingText = false, e5.state.delayingBlurEvent && (e5.hasFocus() ? e5.state.delayingBlurEvent = false : Fi(e5)), ge(r4.wrapper.ownerDocument, "mouseup", u3), ge(r4.wrapper.ownerDocument, "mousemove", c2), ge(r4.scroller, "dragstart", d2), ge(r4.scroller, "drop", u3), o4 || (Ce(t6), i4.addNew || Qr(e5.doc, n5, null, null, i4.extend), s && !f || a && 9 == l ? setTimeout((function() {
                        r4.wrapper.ownerDocument.body.focus({ preventScroll: true }), r4.input.focus();
                      }), 20) : r4.input.focus());
                    })), c2 = function(e6) {
                      o4 = o4 || Math.abs(t5.clientX - e6.clientX) + Math.abs(t5.clientY - e6.clientY) >= 10;
                    }, d2 = function() {
                      return o4 = true;
                    };
                    s && (r4.scroller.draggable = true);
                    e5.state.draggingText = u3, u3.copy = !i4.moveOnDrag, pe(r4.wrapper.ownerDocument, "mouseup", u3), pe(r4.wrapper.ownerDocument, "mousemove", c2), pe(r4.scroller, "dragstart", d2), pe(r4.scroller, "drop", u3), e5.state.delayingBlurEvent = true, setTimeout((function() {
                      return r4.input.focus();
                    }), 20), r4.scroller.dragDrop && r4.scroller.dragDrop();
                  })(e4, i3, t4, o3) : (function(e5, t5, n5, i4) {
                    a && Fi(e5);
                    var r4 = e5.display, o4 = e5.doc;
                    Ce(t5);
                    var l2, s2, u3 = o4.sel, c2 = u3.ranges;
                    i4.addNew && !i4.extend ? (s2 = o4.sel.contains(n5), l2 = s2 > -1 ? c2[s2] : new Ar(n5, n5)) : (l2 = o4.sel.primary(), s2 = o4.sel.primIndex);
                    if ("rectangle" == i4.unit) i4.addNew || (l2 = new Ar(n5, n5)), n5 = hi(e5, t5, true, true), s2 = -1;
                    else {
                      var d2 = Da(e5, n5, i4.unit);
                      l2 = i4.extend ? Yr(l2, d2.anchor, d2.head, i4.extend) : d2;
                    }
                    i4.addNew ? -1 == s2 ? (s2 = c2.length, io(o4, Er(e5, c2.concat([l2]), s2), { scroll: false, origin: "*mouse" })) : c2.length > 1 && c2[s2].empty() && "char" == i4.unit && !i4.extend ? (io(o4, Er(e5, c2.slice(0, s2).concat(c2.slice(s2 + 1)), 0), { scroll: false, origin: "*mouse" }), u3 = o4.sel) : eo(o4, s2, l2, G) : (s2 = 0, io(o4, new Fr([l2], 0), G), u3 = o4.sel);
                    var h2 = n5;
                    function f2(t6) {
                      if (0 != rt(h2, t6)) if (h2 = t6, "rectangle" == i4.unit) {
                        for (var r5 = [], a2 = e5.options.tabSize, c3 = W(Ke(o4, n5.line).text, n5.ch, a2), d3 = W(Ke(o4, t6.line).text, t6.ch, a2), f3 = Math.min(c3, d3), p3 = Math.max(c3, d3), m3 = Math.min(n5.line, t6.line), g3 = Math.min(e5.lastLine(), Math.max(n5.line, t6.line)); m3 <= g3; m3++) {
                          var v3 = Ke(o4, m3).text, x3 = X(v3, f3, a2);
                          f3 == p3 ? r5.push(new Ar(it(m3, x3), it(m3, x3))) : v3.length > x3 && r5.push(new Ar(it(m3, x3), it(m3, X(v3, p3, a2))));
                        }
                        r5.length || r5.push(new Ar(n5, n5)), io(o4, Er(e5, u3.ranges.slice(0, s2).concat(r5), s2), { origin: "*mouse", scroll: false }), e5.scrollIntoView(t6);
                      } else {
                        var y3, b2 = l2, D2 = Da(e5, t6, i4.unit), C2 = b2.anchor;
                        rt(D2.anchor, C2) > 0 ? (y3 = D2.head, C2 = st(b2.from(), D2.anchor)) : (y3 = D2.anchor, C2 = lt(b2.to(), D2.head));
                        var w2 = u3.ranges.slice(0);
                        w2[s2] = (function(e6, t7) {
                          var n6 = t7.anchor, i5 = t7.head, r6 = Ke(e6.doc, n6.line);
                          if (0 == rt(n6, i5) && n6.sticky == i5.sticky) return t7;
                          var o5 = he(r6);
                          if (!o5) return t7;
                          var a3 = ce(o5, n6.ch, n6.sticky), l3 = o5[a3];
                          if (l3.from != n6.ch && l3.to != n6.ch) return t7;
                          var s3, u4 = a3 + (l3.from == n6.ch == (1 != l3.level) ? 0 : 1);
                          if (0 == u4 || u4 == o5.length) return t7;
                          if (i5.line != n6.line) s3 = (i5.line - n6.line) * ("ltr" == e6.doc.direction ? 1 : -1) > 0;
                          else {
                            var c4 = ce(o5, i5.ch, i5.sticky), d4 = c4 - a3 || (i5.ch - n6.ch) * (1 == l3.level ? -1 : 1);
                            s3 = c4 == u4 - 1 || c4 == u4 ? d4 < 0 : d4 > 0;
                          }
                          var h3 = o5[u4 + (s3 ? -1 : 0)], f4 = s3 == (1 == h3.level), p4 = f4 ? h3.from : h3.to, m4 = f4 ? "after" : "before";
                          return n6.ch == p4 && n6.sticky == m4 ? t7 : new Ar(new it(n6.line, p4, m4), i5);
                        })(e5, new Ar(ct(o4, C2), y3)), io(o4, Er(e5, w2, s2), G);
                      }
                    }
                    var p2 = r4.wrapper.getBoundingClientRect(), m2 = 0;
                    function g2(t6) {
                      var n6 = ++m2, a2 = hi(e5, t6, true, "rectangle" == i4.unit);
                      if (a2) if (0 != rt(a2, h2)) {
                        e5.curOp.focus = N(H(e5)), f2(a2);
                        var l3 = Mi(r4, o4);
                        (a2.line >= l3.to || a2.line < l3.from) && setTimeout(ir(e5, (function() {
                          m2 == n6 && g2(t6);
                        })), 150);
                      } else {
                        var s3 = t6.clientY < p2.top ? -20 : t6.clientY > p2.bottom ? 20 : 0;
                        s3 && setTimeout(ir(e5, (function() {
                          m2 == n6 && (r4.scroller.scrollTop += s3, g2(t6));
                        })), 50);
                      }
                    }
                    function v2(t6) {
                      e5.state.selectingText = false, m2 = 1 / 0, t6 && (Ce(t6), r4.input.focus()), ge(r4.wrapper.ownerDocument, "mousemove", x2), ge(r4.wrapper.ownerDocument, "mouseup", y2), o4.history.lastSelOrigin = null;
                    }
                    var x2 = ir(e5, (function(e6) {
                      0 !== e6.buttons && Ae(e6) ? g2(e6) : v2(e6);
                    })), y2 = ir(e5, v2);
                    e5.state.selectingText = y2, pe(r4.wrapper.ownerDocument, "mousemove", x2), pe(r4.wrapper.ownerDocument, "mouseup", y2);
                  })(e4, i3, t4, o3);
                })(t3, i2, o2, e3) : Fe(e3) == n3.scroller && Ce(e3) : 2 == r2 ? (i2 && Qr(t3.doc, i2), setTimeout((function() {
                  return n3.input.focus();
                }), 20)) : 3 == r2 && (k ? t3.display.input.onContextMenu(e3) : Fi(t3)));
              }
            }
          }
          function Da(e3, t3, n3) {
            if ("char" == n3) return new Ar(t3, t3);
            if ("word" == n3) return e3.findWordAt(t3);
            if ("line" == n3) return new Ar(it(t3.line, 0), ct(e3.doc, it(t3.line + 1, 0)));
            var i2 = n3(e3, t3);
            return new Ar(i2.from, i2.to);
          }
          function Ca(e3, t3, n3, i2) {
            var r2, o2;
            if (t3.touches) r2 = t3.touches[0].clientX, o2 = t3.touches[0].clientY;
            else try {
              r2 = t3.clientX, o2 = t3.clientY;
            } catch (e4) {
              return false;
            }
            if (r2 >= Math.floor(e3.display.gutters.getBoundingClientRect().right)) return false;
            i2 && Ce(t3);
            var a2 = e3.display, l2 = a2.lineDiv.getBoundingClientRect();
            if (o2 > l2.bottom || !be(e3, n3)) return ke(t3);
            o2 -= l2.top - a2.viewOffset;
            for (var s2 = 0; s2 < e3.display.gutterSpecs.length; ++s2) {
              var u2 = a2.gutters.childNodes[s2];
              if (u2 && u2.getBoundingClientRect().right >= r2) return ve(e3, n3, e3, et(e3.doc, o2), e3.display.gutterSpecs[s2].className, t3), ke(t3);
            }
          }
          function wa(e3, t3) {
            return Ca(e3, t3, "gutterClick", true);
          }
          function ka(e3, t3) {
            Sn(e3.display, t3) || (function(e4, t4) {
              if (!be(e4, "gutterContextMenu")) return false;
              return Ca(e4, t4, "gutterContextMenu", false);
            })(e3, t3) || xe(e3, t3, "contextmenu") || k || e3.display.input.onContextMenu(t3);
          }
          function Sa(e3) {
            e3.display.wrapper.className = e3.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e3.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), qn(e3);
          }
          ya.prototype.compare = function(e3, t3, n3) {
            return this.time + 400 > e3 && 0 == rt(t3, this.pos) && n3 == this.button;
          };
          var Fa = { toString: function() {
            return "CodeMirror.Init";
          } }, Aa = {}, Ea = {};
          function La(e3, t3, n3) {
            if (!t3 != !(n3 && n3 != Fa)) {
              var i2 = e3.display.dragFunctions, r2 = t3 ? pe : ge;
              r2(e3.display.scroller, "dragstart", i2.start), r2(e3.display.scroller, "dragenter", i2.enter), r2(e3.display.scroller, "dragover", i2.over), r2(e3.display.scroller, "dragleave", i2.leave), r2(e3.display.scroller, "drop", i2.drop);
            }
          }
          function Ta(e3) {
            e3.options.lineWrapping ? (O(e3.display.wrapper, "CodeMirror-wrap"), e3.display.sizer.style.minWidth = "", e3.display.sizerWidth = null) : (A(e3.display.wrapper, "CodeMirror-wrap"), Xt(e3)), di(e3), pi(e3), qn(e3), setTimeout((function() {
              return Ui(e3);
            }), 100);
          }
          function Ma(e3, t3) {
            var n3 = this;
            if (!(this instanceof Ma)) return new Ma(e3, t3);
            this.options = t3 = t3 ? _(t3) : {}, _(Aa, t3, false);
            var i2 = t3.value;
            "string" == typeof i2 ? i2 = new Io(i2, t3.mode, null, t3.lineSeparator, t3.direction) : t3.mode && (i2.modeOption = t3.mode), this.doc = i2;
            var r2 = new Ma.inputStyles[t3.inputStyle](this), o2 = this.display = new br(e3, i2, r2, t3);
            for (var u2 in o2.wrapper.CodeMirror = this, Sa(this), t3.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), Vi(this), this.state = { keyMaps: [], overlays: [], modeGen: 0, overwrite: false, delayingBlurEvent: false, focused: false, suppressEdits: false, pasteIncoming: -1, cutIncoming: -1, selectingText: false, draggingText: false, highlight: new j(), keySeq: null, specialChars: null }, t3.autofocus && !x && o2.input.focus(), a && l < 11 && setTimeout((function() {
              return n3.display.input.reset(true);
            }), 20), (function(e4) {
              var t4 = e4.display;
              pe(t4.scroller, "mousedown", ir(e4, ba)), pe(t4.scroller, "dblclick", a && l < 11 ? ir(e4, (function(t5) {
                if (!xe(e4, t5)) {
                  var n5 = hi(e4, t5);
                  if (n5 && !wa(e4, t5) && !Sn(e4.display, t5)) {
                    Ce(t5);
                    var i4 = e4.findWordAt(n5);
                    Qr(e4.doc, i4.anchor, i4.head);
                  }
                }
              })) : function(t5) {
                return xe(e4, t5) || Ce(t5);
              });
              pe(t4.scroller, "contextmenu", (function(t5) {
                return ka(e4, t5);
              })), pe(t4.input.getField(), "contextmenu", (function(n5) {
                t4.scroller.contains(n5.target) || ka(e4, n5);
              }));
              var n4, i3 = { end: 0 };
              function r3() {
                t4.activeTouch && (n4 = setTimeout((function() {
                  return t4.activeTouch = null;
                }), 1e3), (i3 = t4.activeTouch).end = +/* @__PURE__ */ new Date());
              }
              function o3(e5) {
                if (1 != e5.touches.length) return false;
                var t5 = e5.touches[0];
                return t5.radiusX <= 1 && t5.radiusY <= 1;
              }
              function s2(e5, t5) {
                if (null == t5.left) return true;
                var n5 = t5.left - e5.left, i4 = t5.top - e5.top;
                return n5 * n5 + i4 * i4 > 400;
              }
              pe(t4.scroller, "touchstart", (function(r4) {
                if (!xe(e4, r4) && !o3(r4) && !wa(e4, r4)) {
                  t4.input.ensurePolled(), clearTimeout(n4);
                  var a2 = +/* @__PURE__ */ new Date();
                  t4.activeTouch = { start: a2, moved: false, prev: a2 - i3.end <= 300 ? i3 : null }, 1 == r4.touches.length && (t4.activeTouch.left = r4.touches[0].pageX, t4.activeTouch.top = r4.touches[0].pageY);
                }
              })), pe(t4.scroller, "touchmove", (function() {
                t4.activeTouch && (t4.activeTouch.moved = true);
              })), pe(t4.scroller, "touchend", (function(n5) {
                var i4 = t4.activeTouch;
                if (i4 && !Sn(t4, n5) && null != i4.left && !i4.moved && /* @__PURE__ */ new Date() - i4.start < 300) {
                  var o4, a2 = e4.coordsChar(t4.activeTouch, "page");
                  o4 = !i4.prev || s2(i4, i4.prev) ? new Ar(a2, a2) : !i4.prev.prev || s2(i4, i4.prev.prev) ? e4.findWordAt(a2) : new Ar(it(a2.line, 0), ct(e4.doc, it(a2.line + 1, 0))), e4.setSelection(o4.anchor, o4.head), e4.focus(), Ce(n5);
                }
                r3();
              })), pe(t4.scroller, "touchcancel", r3), pe(t4.scroller, "scroll", (function() {
                t4.scroller.clientHeight && (Ri(e4, t4.scroller.scrollTop), _i(e4, t4.scroller.scrollLeft, true), ve(e4, "scroll", e4));
              })), pe(t4.scroller, "mousewheel", (function(t5) {
                return Sr(e4, t5);
              })), pe(t4.scroller, "DOMMouseScroll", (function(t5) {
                return Sr(e4, t5);
              })), pe(t4.wrapper, "scroll", (function() {
                return t4.wrapper.scrollTop = t4.wrapper.scrollLeft = 0;
              })), t4.dragFunctions = { enter: function(t5) {
                xe(e4, t5) || Se(t5);
              }, over: function(t5) {
                xe(e4, t5) || (!(function(e5, t6) {
                  var n5 = hi(e5, t6);
                  if (n5) {
                    var i4 = document.createDocumentFragment();
                    Di(e5, n5, i4), e5.display.dragCursor || (e5.display.dragCursor = T("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), e5.display.lineSpace.insertBefore(e5.display.dragCursor, e5.display.cursorDiv)), L(e5.display.dragCursor, i4);
                  }
                })(e4, t5), Se(t5));
              }, start: function(t5) {
                return (function(e5, t6) {
                  if (a && (!e5.state.draggingText || +/* @__PURE__ */ new Date() - zo < 100)) Se(t6);
                  else if (!xe(e5, t6) && !Sn(e5.display, t6) && (t6.dataTransfer.setData("Text", e5.getSelection()), t6.dataTransfer.effectAllowed = "copyMove", t6.dataTransfer.setDragImage && !f)) {
                    var n5 = T("img", null, null, "position: fixed; left: 0; top: 0;");
                    n5.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", h && (n5.width = n5.height = 1, e5.display.wrapper.appendChild(n5), n5._top = n5.offsetTop), t6.dataTransfer.setDragImage(n5, 0, 0), h && n5.parentNode.removeChild(n5);
                  }
                })(e4, t5);
              }, drop: ir(e4, Ho), leave: function(t5) {
                xe(e4, t5) || Ro(e4);
              } };
              var u3 = t4.input.getField();
              pe(u3, "keyup", (function(t5) {
                return ma.call(e4, t5);
              })), pe(u3, "keydown", ir(e4, pa)), pe(u3, "keypress", ir(e4, ga)), pe(u3, "focus", (function(t5) {
                return Ai(e4, t5);
              })), pe(u3, "blur", (function(t5) {
                return Ei(e4, t5);
              }));
            })(this), Wo(), Ki(this), this.curOp.forceUpdate = true, Pr(this, i2), t3.autofocus && !x || this.hasFocus() ? setTimeout((function() {
              n3.hasFocus() && !n3.state.focused && Ai(n3);
            }), 20) : Ei(this), Ea) Ea.hasOwnProperty(u2) && Ea[u2](this, t3[u2], Fa);
            gr(this), t3.finishInit && t3.finishInit(this);
            for (var c2 = 0; c2 < Ba.length; ++c2) Ba[c2](this);
            Zi(this), s && t3.lineWrapping && "optimizelegibility" == getComputedStyle(o2.lineDiv).textRendering && (o2.lineDiv.style.textRendering = "auto");
          }
          Ma.defaults = Aa, Ma.optionHandlers = Ea;
          var Ba = [];
          function Na(e3, t3, n3, i2) {
            var r2, o2 = e3.doc;
            null == n3 && (n3 = "add"), "smart" == n3 && (o2.mode.indent ? r2 = gt(e3, t3).state : n3 = "prev");
            var a2 = e3.options.tabSize, l2 = Ke(o2, t3), s2 = W(l2.text, null, a2);
            l2.stateAfter && (l2.stateAfter = null);
            var u2, c2 = l2.text.match(/^\s*/)[0];
            if (i2 || /\S/.test(l2.text)) {
              if ("smart" == n3 && ((u2 = o2.mode.indent(r2, l2.text.slice(c2.length), l2.text)) == U || u2 > 150)) {
                if (!i2) return;
                n3 = "prev";
              }
            } else u2 = 0, n3 = "not";
            "prev" == n3 ? u2 = t3 > o2.first ? W(Ke(o2, t3 - 1).text, null, a2) : 0 : "add" == n3 ? u2 = s2 + e3.options.indentUnit : "subtract" == n3 ? u2 = s2 - e3.options.indentUnit : "number" == typeof n3 && (u2 = s2 + n3), u2 = Math.max(0, u2);
            var d2 = "", h2 = 0;
            if (e3.options.indentWithTabs) for (var f2 = Math.floor(u2 / a2); f2; --f2) h2 += a2, d2 += "	";
            if (h2 < u2 && (d2 += Z(u2 - h2)), d2 != c2) return yo(o2, d2, it(t3, 0), it(t3, c2.length), "+input"), l2.stateAfter = null, true;
            for (var p2 = 0; p2 < o2.sel.ranges.length; p2++) {
              var m2 = o2.sel.ranges[p2];
              if (m2.head.line == t3 && m2.head.ch < c2.length) {
                var g2 = it(t3, c2.length);
                eo(o2, p2, new Ar(g2, g2));
                break;
              }
            }
          }
          Ma.defineInitHook = function(e3) {
            return Ba.push(e3);
          };
          var Oa = null;
          function Ia(e3) {
            Oa = e3;
          }
          function za(e3, t3, n3, i2, r2) {
            var o2 = e3.doc;
            e3.display.shift = false, i2 || (i2 = o2.sel);
            var a2 = +/* @__PURE__ */ new Date() - 200, l2 = "paste" == r2 || e3.state.pasteIncoming > a2, s2 = Oe(t3), u2 = null;
            if (l2 && i2.ranges.length > 1) if (Oa && Oa.text.join("\n") == t3) {
              if (i2.ranges.length % Oa.text.length == 0) {
                u2 = [];
                for (var c2 = 0; c2 < Oa.text.length; c2++) u2.push(o2.splitLines(Oa.text[c2]));
              }
            } else s2.length == i2.ranges.length && e3.options.pasteLinesPerSelection && (u2 = Q(s2, (function(e4) {
              return [e4];
            })));
            for (var d2 = e3.curOp.updateInput, h2 = i2.ranges.length - 1; h2 >= 0; h2--) {
              var f2 = i2.ranges[h2], p2 = f2.from(), m2 = f2.to();
              f2.empty() && (n3 && n3 > 0 ? p2 = it(p2.line, p2.ch - n3) : e3.state.overwrite && !l2 ? m2 = it(m2.line, Math.min(Ke(o2, m2.line).text.length, m2.ch + Y(s2).length)) : l2 && Oa && Oa.lineWise && Oa.text.join("\n") == s2.join("\n") && (p2 = m2 = it(p2.line, 0)));
              var g2 = { from: p2, to: m2, text: u2 ? u2[h2 % u2.length] : s2, origin: r2 || (l2 ? "paste" : e3.state.cutIncoming > a2 ? "cut" : "+input") };
              po(e3.doc, g2), dn(e3, "inputRead", e3, g2);
            }
            t3 && !l2 && Ra(e3, t3), Oi(e3), e3.curOp.updateInput < 2 && (e3.curOp.updateInput = d2), e3.curOp.typing = true, e3.state.pasteIncoming = e3.state.cutIncoming = -1;
          }
          function Ha(e3, t3) {
            var n3 = e3.clipboardData && e3.clipboardData.getData("Text");
            if (n3) return e3.preventDefault(), t3.isReadOnly() || t3.options.disableInput || !t3.hasFocus() || nr(t3, (function() {
              return za(t3, n3, 0, null, "paste");
            })), true;
          }
          function Ra(e3, t3) {
            if (e3.options.electricChars && e3.options.smartIndent) for (var n3 = e3.doc.sel, i2 = n3.ranges.length - 1; i2 >= 0; i2--) {
              var r2 = n3.ranges[i2];
              if (!(r2.head.ch > 100 || i2 && n3.ranges[i2 - 1].head.line == r2.head.line)) {
                var o2 = e3.getModeAt(r2.head), a2 = false;
                if (o2.electricChars) {
                  for (var l2 = 0; l2 < o2.electricChars.length; l2++) if (t3.indexOf(o2.electricChars.charAt(l2)) > -1) {
                    a2 = Na(e3, r2.head.line, "smart");
                    break;
                  }
                } else o2.electricInput && o2.electricInput.test(Ke(e3.doc, r2.head.line).text.slice(0, r2.head.ch)) && (a2 = Na(e3, r2.head.line, "smart"));
                a2 && dn(e3, "electricInput", e3, r2.head.line);
              }
            }
          }
          function Pa(e3) {
            for (var t3 = [], n3 = [], i2 = 0; i2 < e3.doc.sel.ranges.length; i2++) {
              var r2 = e3.doc.sel.ranges[i2].head.line, o2 = { anchor: it(r2, 0), head: it(r2 + 1, 0) };
              n3.push(o2), t3.push(e3.getRange(o2.anchor, o2.head));
            }
            return { text: t3, ranges: n3 };
          }
          function _a(e3, t3, n3, i2) {
            e3.setAttribute("autocorrect", n3 ? "on" : "off"), e3.setAttribute("autocapitalize", i2 ? "on" : "off"), e3.setAttribute("spellcheck", !!t3);
          }
          function Wa() {
            var e3 = T("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none"), t3 = T("div", [e3], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
            return s ? e3.style.width = "1000px" : e3.setAttribute("wrap", "off"), g && (e3.style.border = "1px solid black"), t3;
          }
          function ja(e3, t3, n3, i2, r2) {
            var o2 = t3, a2 = n3, l2 = Ke(e3, t3.line), s2 = r2 && "rtl" == e3.direction ? -n3 : n3;
            function u2(o3) {
              var a3, u3;
              if ("codepoint" == i2) {
                var c3 = l2.text.charCodeAt(t3.ch + (n3 > 0 ? 0 : -1));
                if (isNaN(c3)) a3 = null;
                else {
                  var d3 = n3 > 0 ? c3 >= 55296 && c3 < 56320 : c3 >= 56320 && c3 < 57343;
                  a3 = new it(t3.line, Math.max(0, Math.min(l2.text.length, t3.ch + n3 * (d3 ? 2 : 1))), -n3);
                }
              } else a3 = r2 ? (function(e4, t4, n4, i3) {
                var r3 = he(t4, e4.doc.direction);
                if (!r3) return ia(t4, n4, i3);
                n4.ch >= t4.text.length ? (n4.ch = t4.text.length, n4.sticky = "before") : n4.ch <= 0 && (n4.ch = 0, n4.sticky = "after");
                var o4 = ce(r3, n4.ch, n4.sticky), a4 = r3[o4];
                if ("ltr" == e4.doc.direction && a4.level % 2 == 0 && (i3 > 0 ? a4.to > n4.ch : a4.from < n4.ch)) return ia(t4, n4, i3);
                var l3, s3 = function(e5, n5) {
                  return na(t4, e5 instanceof it ? e5.ch : e5, n5);
                }, u4 = function(n5) {
                  return e4.options.lineWrapping ? (l3 = l3 || In(e4, t4), ti(e4, t4, l3, n5)) : { begin: 0, end: t4.text.length };
                }, c4 = u4("before" == n4.sticky ? s3(n4, -1) : n4.ch);
                if ("rtl" == e4.doc.direction || 1 == a4.level) {
                  var d4 = 1 == a4.level == i3 < 0, h3 = s3(n4, d4 ? 1 : -1);
                  if (null != h3 && (d4 ? h3 <= a4.to && h3 <= c4.end : h3 >= a4.from && h3 >= c4.begin)) {
                    var f3 = d4 ? "before" : "after";
                    return new it(n4.line, h3, f3);
                  }
                }
                var p3 = function(e5, t5, i4) {
                  for (var o5 = function(e6, t6) {
                    return t6 ? new it(n4.line, s3(e6, 1), "before") : new it(n4.line, e6, "after");
                  }; e5 >= 0 && e5 < r3.length; e5 += t5) {
                    var a5 = r3[e5], l4 = t5 > 0 == (1 != a5.level), u5 = l4 ? i4.begin : s3(i4.end, -1);
                    if (a5.from <= u5 && u5 < a5.to) return o5(u5, l4);
                    if (u5 = l4 ? a5.from : s3(a5.to, -1), i4.begin <= u5 && u5 < i4.end) return o5(u5, l4);
                  }
                }, m3 = p3(o4 + i3, i3, c4);
                if (m3) return m3;
                var g3 = i3 > 0 ? c4.end : s3(c4.begin, -1);
                return null == g3 || i3 > 0 && g3 == t4.text.length || !(m3 = p3(i3 > 0 ? 0 : r3.length - 1, i3, u4(g3))) ? null : m3;
              })(e3.cm, l2, t3, n3) : ia(l2, t3, n3);
              if (null == a3) {
                if (o3 || (u3 = t3.line + s2) < e3.first || u3 >= e3.first + e3.size || (t3 = new it(u3, t3.ch, t3.sticky), !(l2 = Ke(e3, u3)))) return false;
                t3 = ra(r2, e3.cm, l2, t3.line, s2);
              } else t3 = a3;
              return true;
            }
            if ("char" == i2 || "codepoint" == i2) u2();
            else if ("column" == i2) u2(true);
            else if ("word" == i2 || "group" == i2) for (var c2 = null, d2 = "group" == i2, h2 = e3.cm && e3.cm.getHelper(t3, "wordChars"), f2 = true; !(n3 < 0) || u2(!f2); f2 = false) {
              var p2 = l2.text.charAt(t3.ch) || "\n", m2 = ie(p2, h2) ? "w" : d2 && "\n" == p2 ? "n" : !d2 || /\s/.test(p2) ? null : "p";
              if (!d2 || f2 || m2 || (m2 = "s"), c2 && c2 != m2) {
                n3 < 0 && (n3 = 1, u2(), t3.sticky = "after");
                break;
              }
              if (m2 && (c2 = m2), n3 > 0 && !u2(!f2)) break;
            }
            var g2 = uo(e3, t3, o2, a2, true);
            return ot(o2, g2) && (g2.hitSide = true), g2;
          }
          function qa(e3, t3, n3, i2) {
            var r2, o2, a2 = e3.doc, l2 = t3.left;
            if ("page" == i2) {
              var s2 = Math.min(e3.display.wrapper.clientHeight, R(e3).innerHeight || a2(e3).documentElement.clientHeight), u2 = Math.max(s2 - 0.5 * ai(e3.display), 3);
              r2 = (n3 > 0 ? t3.bottom : t3.top) + n3 * u2;
            } else "line" == i2 && (r2 = n3 > 0 ? t3.bottom + 3 : t3.top - 3);
            for (; (o2 = Jn(e3, l2, r2)).outside; ) {
              if (n3 < 0 ? r2 <= 0 : r2 >= a2.height) {
                o2.hitSide = true;
                break;
              }
              r2 += 5 * n3;
            }
            return o2;
          }
          var Ua = function(e3) {
            this.cm = e3, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new j(), this.composing = null, this.gracePeriod = false, this.readDOMTimeout = null;
          };
          function $a(e3, t3) {
            var n3 = On(e3, t3.line);
            if (!n3 || n3.hidden) return null;
            var i2 = Ke(e3.doc, t3.line), r2 = Bn(n3, i2, t3.line), o2 = he(i2, e3.doc.direction), a2 = "left";
            o2 && (a2 = ce(o2, t3.ch) % 2 ? "right" : "left");
            var l2 = Pn(r2.map, t3.ch, a2);
            return l2.offset = "right" == l2.collapse ? l2.end : l2.start, l2;
          }
          function Ga(e3, t3) {
            return t3 && (e3.bad = true), e3;
          }
          function Va(e3, t3, n3) {
            var i2;
            if (t3 == e3.display.lineDiv) {
              if (!(i2 = e3.display.lineDiv.childNodes[n3])) return Ga(e3.clipPos(it(e3.display.viewTo - 1)), true);
              t3 = null, n3 = 0;
            } else for (i2 = t3; ; i2 = i2.parentNode) {
              if (!i2 || i2 == e3.display.lineDiv) return null;
              if (i2.parentNode && i2.parentNode == e3.display.lineDiv) break;
            }
            for (var r2 = 0; r2 < e3.display.view.length; r2++) {
              var o2 = e3.display.view[r2];
              if (o2.node == i2) return Xa(o2, t3, n3);
            }
          }
          function Xa(e3, t3, n3) {
            var i2 = e3.text.firstChild, r2 = false;
            if (!t3 || !B(i2, t3)) return Ga(it(Je(e3.line), 0), true);
            if (t3 == i2 && (r2 = true, t3 = i2.childNodes[n3], n3 = 0, !t3)) {
              var o2 = e3.rest ? Y(e3.rest) : e3.line;
              return Ga(it(Je(o2), o2.text.length), r2);
            }
            var a2 = 3 == t3.nodeType ? t3 : null, l2 = t3;
            for (a2 || 1 != t3.childNodes.length || 3 != t3.firstChild.nodeType || (a2 = t3.firstChild, n3 && (n3 = a2.nodeValue.length)); l2.parentNode != i2; ) l2 = l2.parentNode;
            var s2 = e3.measure, u2 = s2.maps;
            function c2(t4, n4, i3) {
              for (var r3 = -1; r3 < (u2 ? u2.length : 0); r3++) for (var o3 = r3 < 0 ? s2.map : u2[r3], a3 = 0; a3 < o3.length; a3 += 3) {
                var l3 = o3[a3 + 2];
                if (l3 == t4 || l3 == n4) {
                  var c3 = Je(r3 < 0 ? e3.line : e3.rest[r3]), d3 = o3[a3] + i3;
                  return (i3 < 0 || l3 != t4) && (d3 = o3[a3 + (i3 ? 1 : 0)]), it(c3, d3);
                }
              }
            }
            var d2 = c2(a2, l2, n3);
            if (d2) return Ga(d2, r2);
            for (var h2 = l2.nextSibling, f2 = a2 ? a2.nodeValue.length - n3 : 0; h2; h2 = h2.nextSibling) {
              if (d2 = c2(h2, h2.firstChild, 0)) return Ga(it(d2.line, d2.ch - f2), r2);
              f2 += h2.textContent.length;
            }
            for (var p2 = l2.previousSibling, m2 = n3; p2; p2 = p2.previousSibling) {
              if (d2 = c2(p2, p2.firstChild, -1)) return Ga(it(d2.line, d2.ch + m2), r2);
              m2 += p2.textContent.length;
            }
          }
          Ua.prototype.init = function(e3) {
            var t3 = this, n3 = this, i2 = n3.cm, r2 = n3.div = e3.lineDiv;
            function o2(e4) {
              for (var t4 = e4.target; t4; t4 = t4.parentNode) {
                if (t4 == r2) return true;
                if (/\bCodeMirror-(?:line)?widget\b/.test(t4.className)) break;
              }
              return false;
            }
            function a2(e4) {
              if (o2(e4) && !xe(i2, e4)) {
                if (i2.somethingSelected()) Ia({ lineWise: false, text: i2.getSelections() }), "cut" == e4.type && i2.replaceSelection("", null, "cut");
                else {
                  if (!i2.options.lineWiseCopyCut) return;
                  var t4 = Pa(i2);
                  Ia({ lineWise: true, text: t4.text }), "cut" == e4.type && i2.operation((function() {
                    i2.setSelections(t4.ranges, 0, $), i2.replaceSelection("", null, "cut");
                  }));
                }
                if (e4.clipboardData) {
                  e4.clipboardData.clearData();
                  var a3 = Oa.text.join("\n");
                  if (e4.clipboardData.setData("Text", a3), e4.clipboardData.getData("Text") == a3) return void e4.preventDefault();
                }
                var l2 = Wa(), s2 = l2.firstChild;
                _a(s2), i2.display.lineSpace.insertBefore(l2, i2.display.lineSpace.firstChild), s2.value = Oa.text.join("\n");
                var u2 = N(r2.ownerDocument);
                z(s2), setTimeout((function() {
                  i2.display.lineSpace.removeChild(l2), u2.focus(), u2 == r2 && n3.showPrimarySelection();
                }), 50);
              }
            }
            r2.contentEditable = true, _a(r2, i2.options.spellcheck, i2.options.autocorrect, i2.options.autocapitalize), pe(r2, "paste", (function(e4) {
              !o2(e4) || xe(i2, e4) || Ha(e4, i2) || l <= 11 && setTimeout(ir(i2, (function() {
                return t3.updateFromDOM();
              })), 20);
            })), pe(r2, "compositionstart", (function(e4) {
              t3.composing = { data: e4.data, done: false };
            })), pe(r2, "compositionupdate", (function(e4) {
              t3.composing || (t3.composing = { data: e4.data, done: false });
            })), pe(r2, "compositionend", (function(e4) {
              t3.composing && (e4.data != t3.composing.data && t3.readFromDOMSoon(), t3.composing.done = true);
            })), pe(r2, "touchstart", (function() {
              return n3.forceCompositionEnd();
            })), pe(r2, "input", (function() {
              t3.composing || t3.readFromDOMSoon();
            })), pe(r2, "copy", a2), pe(r2, "cut", a2);
          }, Ua.prototype.screenReaderLabelChanged = function(e3) {
            e3 ? this.div.setAttribute("aria-label", e3) : this.div.removeAttribute("aria-label");
          }, Ua.prototype.prepareSelection = function() {
            var e3 = bi(this.cm, false);
            return e3.focus = N(this.div.ownerDocument) == this.div, e3;
          }, Ua.prototype.showSelection = function(e3, t3) {
            e3 && this.cm.display.view.length && ((e3.focus || t3) && this.showPrimarySelection(), this.showMultipleSelections(e3));
          }, Ua.prototype.getSelection = function() {
            return this.cm.display.wrapper.ownerDocument.getSelection();
          }, Ua.prototype.showPrimarySelection = function() {
            var e3 = this.getSelection(), t3 = this.cm, i2 = t3.doc.sel.primary(), r2 = i2.from(), o2 = i2.to();
            if (t3.display.viewTo == t3.display.viewFrom || r2.line >= t3.display.viewTo || o2.line < t3.display.viewFrom) e3.removeAllRanges();
            else {
              var a2 = Va(t3, e3.anchorNode, e3.anchorOffset), l2 = Va(t3, e3.focusNode, e3.focusOffset);
              if (!a2 || a2.bad || !l2 || l2.bad || 0 != rt(st(a2, l2), r2) || 0 != rt(lt(a2, l2), o2)) {
                var s2 = t3.display.view, u2 = r2.line >= t3.display.viewFrom && $a(t3, r2) || { node: s2[0].measure.map[2], offset: 0 }, c2 = o2.line < t3.display.viewTo && $a(t3, o2);
                if (!c2) {
                  var d2 = s2[s2.length - 1].measure, h2 = d2.maps ? d2.maps[d2.maps.length - 1] : d2.map;
                  c2 = { node: h2[h2.length - 1], offset: h2[h2.length - 2] - h2[h2.length - 3] };
                }
                if (u2 && c2) {
                  var f2, p2 = e3.rangeCount && e3.getRangeAt(0);
                  try {
                    f2 = F(u2.node, u2.offset, c2.offset, c2.node);
                  } catch (e4) {
                  }
                  f2 && (!n2 && t3.state.focused ? (e3.collapse(u2.node, u2.offset), f2.collapsed || (e3.removeAllRanges(), e3.addRange(f2))) : (e3.removeAllRanges(), e3.addRange(f2)), p2 && null == e3.anchorNode ? e3.addRange(p2) : n2 && this.startGracePeriod()), this.rememberSelection();
                } else e3.removeAllRanges();
              }
            }
          }, Ua.prototype.startGracePeriod = function() {
            var e3 = this;
            clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout((function() {
              e3.gracePeriod = false, e3.selectionChanged() && e3.cm.operation((function() {
                return e3.cm.curOp.selectionChanged = true;
              }));
            }), 20);
          }, Ua.prototype.showMultipleSelections = function(e3) {
            L(this.cm.display.cursorDiv, e3.cursors), L(this.cm.display.selectionDiv, e3.selection);
          }, Ua.prototype.rememberSelection = function() {
            var e3 = this.getSelection();
            this.lastAnchorNode = e3.anchorNode, this.lastAnchorOffset = e3.anchorOffset, this.lastFocusNode = e3.focusNode, this.lastFocusOffset = e3.focusOffset;
          }, Ua.prototype.selectionInEditor = function() {
            var e3 = this.getSelection();
            if (!e3.rangeCount) return false;
            var t3 = e3.getRangeAt(0).commonAncestorContainer;
            return B(this.div, t3);
          }, Ua.prototype.focus = function() {
            "nocursor" != this.cm.options.readOnly && (this.selectionInEditor() && N(this.div.ownerDocument) == this.div || this.showSelection(this.prepareSelection(), true), this.div.focus());
          }, Ua.prototype.blur = function() {
            this.div.blur();
          }, Ua.prototype.getField = function() {
            return this.div;
          }, Ua.prototype.supportsTouch = function() {
            return true;
          }, Ua.prototype.receivedFocus = function() {
            var e3 = this, t3 = this;
            this.selectionInEditor() ? setTimeout((function() {
              return e3.pollSelection();
            }), 20) : nr(this.cm, (function() {
              return t3.cm.curOp.selectionChanged = true;
            })), this.polling.set(this.cm.options.pollInterval, (function e4() {
              t3.cm.state.focused && (t3.pollSelection(), t3.polling.set(t3.cm.options.pollInterval, e4));
            }));
          }, Ua.prototype.selectionChanged = function() {
            var e3 = this.getSelection();
            return e3.anchorNode != this.lastAnchorNode || e3.anchorOffset != this.lastAnchorOffset || e3.focusNode != this.lastFocusNode || e3.focusOffset != this.lastFocusOffset;
          }, Ua.prototype.pollSelection = function() {
            if (null == this.readDOMTimeout && !this.gracePeriod && this.selectionChanged()) {
              var e3 = this.getSelection(), t3 = this.cm;
              if (v && c && this.cm.display.gutterSpecs.length && (function(e4) {
                for (var t4 = e4; t4; t4 = t4.parentNode) if (/CodeMirror-gutter-wrapper/.test(t4.className)) return true;
                return false;
              })(e3.anchorNode)) return this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs }), this.blur(), void this.focus();
              if (!this.composing) {
                this.rememberSelection();
                var n3 = Va(t3, e3.anchorNode, e3.anchorOffset), i2 = Va(t3, e3.focusNode, e3.focusOffset);
                n3 && i2 && nr(t3, (function() {
                  io(t3.doc, Lr(n3, i2), $), (n3.bad || i2.bad) && (t3.curOp.selectionChanged = true);
                }));
              }
            }
          }, Ua.prototype.pollContent = function() {
            null != this.readDOMTimeout && (clearTimeout(this.readDOMTimeout), this.readDOMTimeout = null);
            var e3, t3, n3, i2 = this.cm, r2 = i2.display, o2 = i2.doc.sel.primary(), a2 = o2.from(), l2 = o2.to();
            if (0 == a2.ch && a2.line > i2.firstLine() && (a2 = it(a2.line - 1, Ke(i2.doc, a2.line - 1).length)), l2.ch == Ke(i2.doc, l2.line).text.length && l2.line < i2.lastLine() && (l2 = it(l2.line + 1, 0)), a2.line < r2.viewFrom || l2.line > r2.viewTo - 1) return false;
            a2.line == r2.viewFrom || 0 == (e3 = fi(i2, a2.line)) ? (t3 = Je(r2.view[0].line), n3 = r2.view[0].node) : (t3 = Je(r2.view[e3].line), n3 = r2.view[e3 - 1].node.nextSibling);
            var s2, u2, c2 = fi(i2, l2.line);
            if (c2 == r2.view.length - 1 ? (s2 = r2.viewTo - 1, u2 = r2.lineDiv.lastChild) : (s2 = Je(r2.view[c2 + 1].line) - 1, u2 = r2.view[c2 + 1].node.previousSibling), !n3) return false;
            for (var d2 = i2.doc.splitLines((function(e4, t4, n4, i3, r3) {
              var o3 = "", a3 = false, l3 = e4.doc.lineSeparator(), s3 = false;
              function u3(e5) {
                return function(t5) {
                  return t5.id == e5;
                };
              }
              function c3() {
                a3 && (o3 += l3, s3 && (o3 += l3), a3 = s3 = false);
              }
              function d3(e5) {
                e5 && (c3(), o3 += e5);
              }
              function h3(t5) {
                if (1 == t5.nodeType) {
                  var n5 = t5.getAttribute("cm-text");
                  if (n5) return void d3(n5);
                  var o4, f3 = t5.getAttribute("cm-marker");
                  if (f3) {
                    var p3 = e4.findMarks(it(i3, 0), it(r3 + 1, 0), u3(+f3));
                    return void (p3.length && (o4 = p3[0].find(0)) && d3(Ze(e4.doc, o4.from, o4.to).join(l3)));
                  }
                  if ("false" == t5.getAttribute("contenteditable")) return;
                  var m3 = /^(pre|div|p|li|table|br)$/i.test(t5.nodeName);
                  if (!/^br$/i.test(t5.nodeName) && 0 == t5.textContent.length) return;
                  m3 && c3();
                  for (var g3 = 0; g3 < t5.childNodes.length; g3++) h3(t5.childNodes[g3]);
                  /^(pre|p)$/i.test(t5.nodeName) && (s3 = true), m3 && (a3 = true);
                } else 3 == t5.nodeType && d3(t5.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
              }
              for (; h3(t4), t4 != n4; ) t4 = t4.nextSibling, s3 = false;
              return o3;
            })(i2, n3, u2, t3, s2)), h2 = Ze(i2.doc, it(t3, 0), it(s2, Ke(i2.doc, s2).text.length)); d2.length > 1 && h2.length > 1; ) if (Y(d2) == Y(h2)) d2.pop(), h2.pop(), s2--;
            else {
              if (d2[0] != h2[0]) break;
              d2.shift(), h2.shift(), t3++;
            }
            for (var f2 = 0, p2 = 0, m2 = d2[0], g2 = h2[0], v2 = Math.min(m2.length, g2.length); f2 < v2 && m2.charCodeAt(f2) == g2.charCodeAt(f2); ) ++f2;
            for (var x2 = Y(d2), y2 = Y(h2), b2 = Math.min(x2.length - (1 == d2.length ? f2 : 0), y2.length - (1 == h2.length ? f2 : 0)); p2 < b2 && x2.charCodeAt(x2.length - p2 - 1) == y2.charCodeAt(y2.length - p2 - 1); ) ++p2;
            if (1 == d2.length && 1 == h2.length && t3 == a2.line) for (; f2 && f2 > a2.ch && x2.charCodeAt(x2.length - p2 - 1) == y2.charCodeAt(y2.length - p2 - 1); ) f2--, p2++;
            d2[d2.length - 1] = x2.slice(0, x2.length - p2).replace(/^\u200b+/, ""), d2[0] = d2[0].slice(f2).replace(/\u200b+$/, "");
            var D2 = it(t3, f2), C2 = it(s2, h2.length ? Y(h2).length - p2 : 0);
            return d2.length > 1 || d2[0] || rt(D2, C2) ? (yo(i2.doc, d2, D2, C2, "+input"), true) : void 0;
          }, Ua.prototype.ensurePolled = function() {
            this.forceCompositionEnd();
          }, Ua.prototype.reset = function() {
            this.forceCompositionEnd();
          }, Ua.prototype.forceCompositionEnd = function() {
            this.composing && (clearTimeout(this.readDOMTimeout), this.composing = null, this.updateFromDOM(), this.div.blur(), this.div.focus());
          }, Ua.prototype.readFromDOMSoon = function() {
            var e3 = this;
            null == this.readDOMTimeout && (this.readDOMTimeout = setTimeout((function() {
              if (e3.readDOMTimeout = null, e3.composing) {
                if (!e3.composing.done) return;
                e3.composing = null;
              }
              e3.updateFromDOM();
            }), 80));
          }, Ua.prototype.updateFromDOM = function() {
            var e3 = this;
            !this.cm.isReadOnly() && this.pollContent() || nr(this.cm, (function() {
              return pi(e3.cm);
            }));
          }, Ua.prototype.setUneditable = function(e3) {
            e3.contentEditable = "false";
          }, Ua.prototype.onKeyPress = function(e3) {
            0 == e3.charCode || this.composing || (e3.preventDefault(), this.cm.isReadOnly() || ir(this.cm, za)(this.cm, String.fromCharCode(null == e3.charCode ? e3.keyCode : e3.charCode), 0));
          }, Ua.prototype.readOnlyChanged = function(e3) {
            this.div.contentEditable = String("nocursor" != e3);
          }, Ua.prototype.onContextMenu = function() {
          }, Ua.prototype.resetPosition = function() {
          }, Ua.prototype.needsContentAttribute = true;
          var Ka = function(e3) {
            this.cm = e3, this.prevInput = "", this.pollingFast = false, this.polling = new j(), this.hasSelection = false, this.composing = null, this.resetting = false;
          };
          Ka.prototype.init = function(e3) {
            var t3 = this, n3 = this, i2 = this.cm;
            this.createField(e3);
            var r2 = this.textarea;
            function o2(e4) {
              if (!xe(i2, e4)) {
                if (i2.somethingSelected()) Ia({ lineWise: false, text: i2.getSelections() });
                else {
                  if (!i2.options.lineWiseCopyCut) return;
                  var t4 = Pa(i2);
                  Ia({ lineWise: true, text: t4.text }), "cut" == e4.type ? i2.setSelections(t4.ranges, null, $) : (n3.prevInput = "", r2.value = t4.text.join("\n"), z(r2));
                }
                "cut" == e4.type && (i2.state.cutIncoming = +/* @__PURE__ */ new Date());
              }
            }
            e3.wrapper.insertBefore(this.wrapper, e3.wrapper.firstChild), g && (r2.style.width = "0px"), pe(r2, "input", (function() {
              a && l >= 9 && t3.hasSelection && (t3.hasSelection = null), n3.poll();
            })), pe(r2, "paste", (function(e4) {
              xe(i2, e4) || Ha(e4, i2) || (i2.state.pasteIncoming = +/* @__PURE__ */ new Date(), n3.fastPoll());
            })), pe(r2, "cut", o2), pe(r2, "copy", o2), pe(e3.scroller, "paste", (function(t4) {
              if (!Sn(e3, t4) && !xe(i2, t4)) {
                if (!r2.dispatchEvent) return i2.state.pasteIncoming = +/* @__PURE__ */ new Date(), void n3.focus();
                var o3 = new Event("paste");
                o3.clipboardData = t4.clipboardData, r2.dispatchEvent(o3);
              }
            })), pe(e3.lineSpace, "selectstart", (function(t4) {
              Sn(e3, t4) || Ce(t4);
            })), pe(r2, "compositionstart", (function() {
              var e4 = i2.getCursor("from");
              n3.composing && n3.composing.range.clear(), n3.composing = { start: e4, range: i2.markText(e4, i2.getCursor("to"), { className: "CodeMirror-composing" }) };
            })), pe(r2, "compositionend", (function() {
              n3.composing && (n3.poll(), n3.composing.range.clear(), n3.composing = null);
            }));
          }, Ka.prototype.createField = function(e3) {
            this.wrapper = Wa(), this.textarea = this.wrapper.firstChild;
            var t3 = this.cm.options;
            _a(this.textarea, t3.spellcheck, t3.autocorrect, t3.autocapitalize);
          }, Ka.prototype.screenReaderLabelChanged = function(e3) {
            e3 ? this.textarea.setAttribute("aria-label", e3) : this.textarea.removeAttribute("aria-label");
          }, Ka.prototype.prepareSelection = function() {
            var e3 = this.cm, t3 = e3.display, n3 = e3.doc, i2 = bi(e3);
            if (e3.options.moveInputWithCursor) {
              var r2 = Zn(e3, n3.sel.primary().head, "div"), o2 = t3.wrapper.getBoundingClientRect(), a2 = t3.lineDiv.getBoundingClientRect();
              i2.teTop = Math.max(0, Math.min(t3.wrapper.clientHeight - 10, r2.top + a2.top - o2.top)), i2.teLeft = Math.max(0, Math.min(t3.wrapper.clientWidth - 10, r2.left + a2.left - o2.left));
            }
            return i2;
          }, Ka.prototype.showSelection = function(e3) {
            var t3 = this.cm.display;
            L(t3.cursorDiv, e3.cursors), L(t3.selectionDiv, e3.selection), null != e3.teTop && (this.wrapper.style.top = e3.teTop + "px", this.wrapper.style.left = e3.teLeft + "px");
          }, Ka.prototype.reset = function(e3) {
            if (!(this.contextMenuPending || this.composing && e3)) {
              var t3 = this.cm;
              if (this.resetting = true, t3.somethingSelected()) {
                this.prevInput = "";
                var n3 = t3.getSelection();
                this.textarea.value = n3, t3.state.focused && z(this.textarea), a && l >= 9 && (this.hasSelection = n3);
              } else e3 || (this.prevInput = this.textarea.value = "", a && l >= 9 && (this.hasSelection = null));
              this.resetting = false;
            }
          }, Ka.prototype.getField = function() {
            return this.textarea;
          }, Ka.prototype.supportsTouch = function() {
            return false;
          }, Ka.prototype.focus = function() {
            if ("nocursor" != this.cm.options.readOnly && (!x || N(this.textarea.ownerDocument) != this.textarea)) try {
              this.textarea.focus();
            } catch (e3) {
            }
          }, Ka.prototype.blur = function() {
            this.textarea.blur();
          }, Ka.prototype.resetPosition = function() {
            this.wrapper.style.top = this.wrapper.style.left = 0;
          }, Ka.prototype.receivedFocus = function() {
            this.slowPoll();
          }, Ka.prototype.slowPoll = function() {
            var e3 = this;
            this.pollingFast || this.polling.set(this.cm.options.pollInterval, (function() {
              e3.poll(), e3.cm.state.focused && e3.slowPoll();
            }));
          }, Ka.prototype.fastPoll = function() {
            var e3 = false, t3 = this;
            t3.pollingFast = true, t3.polling.set(20, (function n3() {
              t3.poll() || e3 ? (t3.pollingFast = false, t3.slowPoll()) : (e3 = true, t3.polling.set(60, n3));
            }));
          }, Ka.prototype.poll = function() {
            var e3 = this, t3 = this.cm, n3 = this.textarea, i2 = this.prevInput;
            if (this.contextMenuPending || this.resetting || !t3.state.focused || Ie(n3) && !i2 && !this.composing || t3.isReadOnly() || t3.options.disableInput || t3.state.keySeq) return false;
            var r2 = n3.value;
            if (r2 == i2 && !t3.somethingSelected()) return false;
            if (a && l >= 9 && this.hasSelection === r2 || y && /[\uf700-\uf7ff]/.test(r2)) return t3.display.input.reset(), false;
            if (t3.doc.sel == t3.display.selForContextMenu) {
              var o2 = r2.charCodeAt(0);
              if (8203 != o2 || i2 || (i2 = "\u200B"), 8666 == o2) return this.reset(), this.cm.execCommand("undo");
            }
            for (var s2 = 0, u2 = Math.min(i2.length, r2.length); s2 < u2 && i2.charCodeAt(s2) == r2.charCodeAt(s2); ) ++s2;
            return nr(t3, (function() {
              za(t3, r2.slice(s2), i2.length - s2, null, e3.composing ? "*compose" : null), r2.length > 1e3 || r2.indexOf("\n") > -1 ? n3.value = e3.prevInput = "" : e3.prevInput = r2, e3.composing && (e3.composing.range.clear(), e3.composing.range = t3.markText(e3.composing.start, t3.getCursor("to"), { className: "CodeMirror-composing" }));
            })), true;
          }, Ka.prototype.ensurePolled = function() {
            this.pollingFast && this.poll() && (this.pollingFast = false);
          }, Ka.prototype.onKeyPress = function() {
            a && l >= 9 && (this.hasSelection = null), this.fastPoll();
          }, Ka.prototype.onContextMenu = function(e3) {
            var t3 = this, n3 = t3.cm, i2 = n3.display, r2 = t3.textarea;
            t3.contextMenuPending && t3.contextMenuPending();
            var o2 = hi(n3, e3), u2 = i2.scroller.scrollTop;
            if (o2 && !h) {
              n3.options.resetSelectionOnContextMenu && -1 == n3.doc.sel.contains(o2) && ir(n3, io)(n3.doc, Lr(o2), $);
              var c2, d2 = r2.style.cssText, f2 = t3.wrapper.style.cssText, p2 = t3.wrapper.offsetParent.getBoundingClientRect();
              if (t3.wrapper.style.cssText = "position: static", r2.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e3.clientY - p2.top - 5) + "px; left: " + (e3.clientX - p2.left - 5) + "px;\n      z-index: 1000; background: " + (a ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", s && (c2 = r2.ownerDocument.defaultView.scrollY), i2.input.focus(), s && r2.ownerDocument.defaultView.scrollTo(null, c2), i2.input.reset(), n3.somethingSelected() || (r2.value = t3.prevInput = " "), t3.contextMenuPending = v2, i2.selForContextMenu = n3.doc.sel, clearTimeout(i2.detectingSelectAll), a && l >= 9 && g2(), k) {
                Se(e3);
                var m2 = function() {
                  ge(window, "mouseup", m2), setTimeout(v2, 20);
                };
                pe(window, "mouseup", m2);
              } else setTimeout(v2, 50);
            }
            function g2() {
              if (null != r2.selectionStart) {
                var e4 = n3.somethingSelected(), o3 = "\u200B" + (e4 ? r2.value : "");
                r2.value = "\u21DA", r2.value = o3, t3.prevInput = e4 ? "" : "\u200B", r2.selectionStart = 1, r2.selectionEnd = o3.length, i2.selForContextMenu = n3.doc.sel;
              }
            }
            function v2() {
              if (t3.contextMenuPending == v2 && (t3.contextMenuPending = false, t3.wrapper.style.cssText = f2, r2.style.cssText = d2, a && l < 9 && i2.scrollbars.setScrollTop(i2.scroller.scrollTop = u2), null != r2.selectionStart)) {
                (!a || a && l < 9) && g2();
                var e4 = 0, o3 = function() {
                  i2.selForContextMenu == n3.doc.sel && 0 == r2.selectionStart && r2.selectionEnd > 0 && "\u200B" == t3.prevInput ? ir(n3, ho)(n3) : e4++ < 10 ? i2.detectingSelectAll = setTimeout(o3, 500) : (i2.selForContextMenu = null, i2.input.reset());
                };
                i2.detectingSelectAll = setTimeout(o3, 200);
              }
            }
          }, Ka.prototype.readOnlyChanged = function(e3) {
            e3 || this.reset(), this.textarea.disabled = "nocursor" == e3, this.textarea.readOnly = !!e3;
          }, Ka.prototype.setUneditable = function() {
          }, Ka.prototype.needsContentAttribute = false, (function(e3) {
            var t3 = e3.optionHandlers;
            function n3(n4, i2, r2, o2) {
              e3.defaults[n4] = i2, r2 && (t3[n4] = o2 ? function(e4, t4, n5) {
                n5 != Fa && r2(e4, t4, n5);
              } : r2);
            }
            e3.defineOption = n3, e3.Init = Fa, n3("value", "", (function(e4, t4) {
              return e4.setValue(t4);
            }), true), n3("mode", null, (function(e4, t4) {
              e4.doc.modeOption = t4, Or(e4);
            }), true), n3("indentUnit", 2, Or, true), n3("indentWithTabs", false), n3("smartIndent", true), n3("tabSize", 4, (function(e4) {
              Ir(e4), qn(e4), pi(e4);
            }), true), n3("lineSeparator", null, (function(e4, t4) {
              if (e4.doc.lineSep = t4, t4) {
                var n4 = [], i2 = e4.doc.first;
                e4.doc.iter((function(e5) {
                  for (var r3 = 0; ; ) {
                    var o2 = e5.text.indexOf(t4, r3);
                    if (-1 == o2) break;
                    r3 = o2 + t4.length, n4.push(it(i2, o2));
                  }
                  i2++;
                }));
                for (var r2 = n4.length - 1; r2 >= 0; r2--) yo(e4.doc, t4, n4[r2], it(n4[r2].line, n4[r2].ch + t4.length));
              }
            })), n3("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc]/g, (function(e4, t4, n4) {
              e4.state.specialChars = new RegExp(t4.source + (t4.test("	") ? "" : "|	"), "g"), n4 != Fa && e4.refresh();
            })), n3("specialCharPlaceholder", tn, (function(e4) {
              return e4.refresh();
            }), true), n3("electricChars", true), n3("inputStyle", x ? "contenteditable" : "textarea", (function() {
              throw new Error("inputStyle can not (yet) be changed in a running editor");
            }), true), n3("spellcheck", false, (function(e4, t4) {
              return e4.getInputField().spellcheck = t4;
            }), true), n3("autocorrect", false, (function(e4, t4) {
              return e4.getInputField().autocorrect = t4;
            }), true), n3("autocapitalize", false, (function(e4, t4) {
              return e4.getInputField().autocapitalize = t4;
            }), true), n3("rtlMoveVisually", !D), n3("wholeLineUpdateBefore", true), n3("theme", "default", (function(e4) {
              Sa(e4), yr(e4);
            }), true), n3("keyMap", "default", (function(e4, t4, n4) {
              var i2 = ea(t4), r2 = n4 != Fa && ea(n4);
              r2 && r2.detach && r2.detach(e4, i2), i2.attach && i2.attach(e4, r2 || null);
            })), n3("extraKeys", null), n3("configureMouse", null), n3("lineWrapping", false, Ta, true), n3("gutters", [], (function(e4, t4) {
              e4.display.gutterSpecs = vr(t4, e4.options.lineNumbers), yr(e4);
            }), true), n3("fixedGutter", true, (function(e4, t4) {
              e4.display.gutters.style.left = t4 ? ui(e4.display) + "px" : "0", e4.refresh();
            }), true), n3("coverGutterNextToScrollbar", false, (function(e4) {
              return Ui(e4);
            }), true), n3("scrollbarStyle", "native", (function(e4) {
              Vi(e4), Ui(e4), e4.display.scrollbars.setScrollTop(e4.doc.scrollTop), e4.display.scrollbars.setScrollLeft(e4.doc.scrollLeft);
            }), true), n3("lineNumbers", false, (function(e4, t4) {
              e4.display.gutterSpecs = vr(e4.options.gutters, t4), yr(e4);
            }), true), n3("firstLineNumber", 1, yr, true), n3("lineNumberFormatter", (function(e4) {
              return e4;
            }), yr, true), n3("showCursorWhenSelecting", false, yi, true), n3("resetSelectionOnContextMenu", true), n3("lineWiseCopyCut", true), n3("pasteLinesPerSelection", true), n3("selectionsMayTouch", false), n3("readOnly", false, (function(e4, t4) {
              "nocursor" == t4 && (Ei(e4), e4.display.input.blur()), e4.display.input.readOnlyChanged(t4);
            })), n3("screenReaderLabel", null, (function(e4, t4) {
              t4 = "" === t4 ? null : t4, e4.display.input.screenReaderLabelChanged(t4);
            })), n3("disableInput", false, (function(e4, t4) {
              t4 || e4.display.input.reset();
            }), true), n3("dragDrop", true, La), n3("allowDropFileTypes", null), n3("cursorBlinkRate", 530), n3("cursorScrollMargin", 0), n3("cursorHeight", 1, yi, true), n3("singleCursorHeightPerLine", true, yi, true), n3("workTime", 100), n3("workDelay", 100), n3("flattenSpans", true, Ir, true), n3("addModeClass", false, Ir, true), n3("pollInterval", 100), n3("undoDepth", 200, (function(e4, t4) {
              return e4.doc.history.undoDepth = t4;
            })), n3("historyEventDelay", 1250), n3("viewportMargin", 10, (function(e4) {
              return e4.refresh();
            }), true), n3("maxHighlightLength", 1e4, Ir, true), n3("moveInputWithCursor", true, (function(e4, t4) {
              t4 || e4.display.input.resetPosition();
            })), n3("tabindex", null, (function(e4, t4) {
              return e4.display.input.getField().tabIndex = t4 || "";
            })), n3("autofocus", null), n3("direction", "ltr", (function(e4, t4) {
              return e4.doc.setDirection(t4);
            }), true), n3("phrases", null);
          })(Ma), (function(e3) {
            var t3 = e3.optionHandlers, n3 = e3.helpers = {};
            e3.prototype = { constructor: e3, focus: function() {
              R(this).focus(), this.display.input.focus();
            }, setOption: function(e4, n4) {
              var i2 = this.options, r2 = i2[e4];
              i2[e4] == n4 && "mode" != e4 || (i2[e4] = n4, t3.hasOwnProperty(e4) && ir(this, t3[e4])(this, n4, r2), ve(this, "optionChange", this, e4));
            }, getOption: function(e4) {
              return this.options[e4];
            }, getDoc: function() {
              return this.doc;
            }, addKeyMap: function(e4, t4) {
              this.state.keyMaps[t4 ? "push" : "unshift"](ea(e4));
            }, removeKeyMap: function(e4) {
              for (var t4 = this.state.keyMaps, n4 = 0; n4 < t4.length; ++n4) if (t4[n4] == e4 || t4[n4].name == e4) return t4.splice(n4, 1), true;
            }, addOverlay: rr((function(t4, n4) {
              var i2 = t4.token ? t4 : e3.getMode(this.options, t4);
              if (i2.startState) throw new Error("Overlays may not be stateful.");
              !(function(e4, t5, n5) {
                for (var i3 = 0, r2 = n5(t5); i3 < e4.length && n5(e4[i3]) <= r2; ) i3++;
                e4.splice(i3, 0, t5);
              })(this.state.overlays, { mode: i2, modeSpec: t4, opaque: n4 && n4.opaque, priority: n4 && n4.priority || 0 }, (function(e4) {
                return e4.priority;
              })), this.state.modeGen++, pi(this);
            })), removeOverlay: rr((function(e4) {
              for (var t4 = this.state.overlays, n4 = 0; n4 < t4.length; ++n4) {
                var i2 = t4[n4].modeSpec;
                if (i2 == e4 || "string" == typeof e4 && i2.name == e4) return t4.splice(n4, 1), this.state.modeGen++, void pi(this);
              }
            })), indentLine: rr((function(e4, t4, n4) {
              "string" != typeof t4 && "number" != typeof t4 && (t4 = null == t4 ? this.options.smartIndent ? "smart" : "prev" : t4 ? "add" : "subtract"), tt(this.doc, e4) && Na(this, e4, t4, n4);
            })), indentSelection: rr((function(e4) {
              for (var t4 = this.doc.sel.ranges, n4 = -1, i2 = 0; i2 < t4.length; i2++) {
                var r2 = t4[i2];
                if (r2.empty()) r2.head.line > n4 && (Na(this, r2.head.line, e4, true), n4 = r2.head.line, i2 == this.doc.sel.primIndex && Oi(this));
                else {
                  var o2 = r2.from(), a2 = r2.to(), l2 = Math.max(n4, o2.line);
                  n4 = Math.min(this.lastLine(), a2.line - (a2.ch ? 0 : 1)) + 1;
                  for (var s2 = l2; s2 < n4; ++s2) Na(this, s2, e4);
                  var u2 = this.doc.sel.ranges;
                  0 == o2.ch && t4.length == u2.length && u2[i2].from().ch > 0 && eo(this.doc, i2, new Ar(o2, u2[i2].to()), $);
                }
              }
            })), getTokenAt: function(e4, t4) {
              return Dt(this, e4, t4);
            }, getLineTokens: function(e4, t4) {
              return Dt(this, it(e4), t4, true);
            }, getTokenTypeAt: function(e4) {
              e4 = ct(this.doc, e4);
              var t4, n4 = mt(this, Ke(this.doc, e4.line)), i2 = 0, r2 = (n4.length - 1) / 2, o2 = e4.ch;
              if (0 == o2) t4 = n4[2];
              else for (; ; ) {
                var a2 = i2 + r2 >> 1;
                if ((a2 ? n4[2 * a2 - 1] : 0) >= o2) r2 = a2;
                else {
                  if (!(n4[2 * a2 + 1] < o2)) {
                    t4 = n4[2 * a2 + 2];
                    break;
                  }
                  i2 = a2 + 1;
                }
              }
              var l2 = t4 ? t4.indexOf("overlay ") : -1;
              return l2 < 0 ? t4 : 0 == l2 ? null : t4.slice(0, l2 - 1);
            }, getModeAt: function(t4) {
              var n4 = this.doc.mode;
              return n4.innerMode ? e3.innerMode(n4, this.getTokenAt(t4).state).mode : n4;
            }, getHelper: function(e4, t4) {
              return this.getHelpers(e4, t4)[0];
            }, getHelpers: function(e4, t4) {
              var i2 = [];
              if (!n3.hasOwnProperty(t4)) return i2;
              var r2 = n3[t4], o2 = this.getModeAt(e4);
              if ("string" == typeof o2[t4]) r2[o2[t4]] && i2.push(r2[o2[t4]]);
              else if (o2[t4]) for (var a2 = 0; a2 < o2[t4].length; a2++) {
                var l2 = r2[o2[t4][a2]];
                l2 && i2.push(l2);
              }
              else o2.helperType && r2[o2.helperType] ? i2.push(r2[o2.helperType]) : r2[o2.name] && i2.push(r2[o2.name]);
              for (var s2 = 0; s2 < r2._global.length; s2++) {
                var u2 = r2._global[s2];
                u2.pred(o2, this) && -1 == q(i2, u2.val) && i2.push(u2.val);
              }
              return i2;
            }, getStateAfter: function(e4, t4) {
              var n4 = this.doc;
              return gt(this, (e4 = ut(n4, null == e4 ? n4.first + n4.size - 1 : e4)) + 1, t4).state;
            }, cursorCoords: function(e4, t4) {
              var n4 = this.doc.sel.primary();
              return Zn(this, null == e4 ? n4.head : "object" == typeof e4 ? ct(this.doc, e4) : e4 ? n4.from() : n4.to(), t4 || "page");
            }, charCoords: function(e4, t4) {
              return Kn(this, ct(this.doc, e4), t4 || "page");
            }, coordsChar: function(e4, t4) {
              return Jn(this, (e4 = Xn(this, e4, t4 || "page")).left, e4.top);
            }, lineAtHeight: function(e4, t4) {
              return e4 = Xn(this, { top: e4, left: 0 }, t4 || "page").top, et(this.doc, e4 + this.display.viewOffset);
            }, heightAtLine: function(e4, t4, n4) {
              var i2, r2 = false;
              if ("number" == typeof e4) {
                var o2 = this.doc.first + this.doc.size - 1;
                e4 < this.doc.first ? e4 = this.doc.first : e4 > o2 && (e4 = o2, r2 = true), i2 = Ke(this.doc, e4);
              } else i2 = e4;
              return Vn(this, i2, { top: 0, left: 0 }, t4 || "page", n4 || r2).top + (r2 ? this.doc.height - Gt(i2) : 0);
            }, defaultTextHeight: function() {
              return ai(this.display);
            }, defaultCharWidth: function() {
              return li(this.display);
            }, getViewport: function() {
              return { from: this.display.viewFrom, to: this.display.viewTo };
            }, addWidget: function(e4, t4, n4, i2, r2) {
              var o2, a2, l2, s2 = this.display, u2 = (e4 = Zn(this, ct(this.doc, e4))).bottom, c2 = e4.left;
              if (t4.style.position = "absolute", t4.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(t4), s2.sizer.appendChild(t4), "over" == i2) u2 = e4.top;
              else if ("above" == i2 || "near" == i2) {
                var d2 = Math.max(s2.wrapper.clientHeight, this.doc.height), h2 = Math.max(s2.sizer.clientWidth, s2.lineSpace.clientWidth);
                ("above" == i2 || e4.bottom + t4.offsetHeight > d2) && e4.top > t4.offsetHeight ? u2 = e4.top - t4.offsetHeight : e4.bottom + t4.offsetHeight <= d2 && (u2 = e4.bottom), c2 + t4.offsetWidth > h2 && (c2 = h2 - t4.offsetWidth);
              }
              t4.style.top = u2 + "px", t4.style.left = t4.style.right = "", "right" == r2 ? (c2 = s2.sizer.clientWidth - t4.offsetWidth, t4.style.right = "0px") : ("left" == r2 ? c2 = 0 : "middle" == r2 && (c2 = (s2.sizer.clientWidth - t4.offsetWidth) / 2), t4.style.left = c2 + "px"), n4 && (o2 = this, a2 = { left: c2, top: u2, right: c2 + t4.offsetWidth, bottom: u2 + t4.offsetHeight }, null != (l2 = Bi(o2, a2)).scrollTop && Ri(o2, l2.scrollTop), null != l2.scrollLeft && _i(o2, l2.scrollLeft));
            }, triggerOnKeyDown: rr(pa), triggerOnKeyPress: rr(ga), triggerOnKeyUp: ma, triggerOnMouseDown: rr(ba), execCommand: function(e4) {
              if (oa.hasOwnProperty(e4)) return oa[e4].call(null, this);
            }, triggerElectric: rr((function(e4) {
              Ra(this, e4);
            })), findPosH: function(e4, t4, n4, i2) {
              var r2 = 1;
              t4 < 0 && (r2 = -1, t4 = -t4);
              for (var o2 = ct(this.doc, e4), a2 = 0; a2 < t4 && !(o2 = ja(this.doc, o2, r2, n4, i2)).hitSide; ++a2) ;
              return o2;
            }, moveH: rr((function(e4, t4) {
              var n4 = this;
              this.extendSelectionsBy((function(i2) {
                return n4.display.shift || n4.doc.extend || i2.empty() ? ja(n4.doc, i2.head, e4, t4, n4.options.rtlMoveVisually) : e4 < 0 ? i2.from() : i2.to();
              }), V);
            })), deleteH: rr((function(e4, t4) {
              var n4 = this.doc.sel, i2 = this.doc;
              n4.somethingSelected() ? i2.replaceSelection("", null, "+delete") : ta(this, (function(n5) {
                var r2 = ja(i2, n5.head, e4, t4, false);
                return e4 < 0 ? { from: r2, to: n5.head } : { from: n5.head, to: r2 };
              }));
            })), findPosV: function(e4, t4, n4, i2) {
              var r2 = 1, o2 = i2;
              t4 < 0 && (r2 = -1, t4 = -t4);
              for (var a2 = ct(this.doc, e4), l2 = 0; l2 < t4; ++l2) {
                var s2 = Zn(this, a2, "div");
                if (null == o2 ? o2 = s2.left : s2.left = o2, (a2 = qa(this, s2, r2, n4)).hitSide) break;
              }
              return a2;
            }, moveV: rr((function(e4, t4) {
              var n4 = this, i2 = this.doc, r2 = [], o2 = !this.display.shift && !i2.extend && i2.sel.somethingSelected();
              if (i2.extendSelectionsBy((function(a3) {
                if (o2) return e4 < 0 ? a3.from() : a3.to();
                var l2 = Zn(n4, a3.head, "div");
                null != a3.goalColumn && (l2.left = a3.goalColumn), r2.push(l2.left);
                var s2 = qa(n4, l2, e4, t4);
                return "page" == t4 && a3 == i2.sel.primary() && Ni(n4, Kn(n4, s2, "div").top - l2.top), s2;
              }), V), r2.length) for (var a2 = 0; a2 < i2.sel.ranges.length; a2++) i2.sel.ranges[a2].goalColumn = r2[a2];
            })), findWordAt: function(e4) {
              var t4 = Ke(this.doc, e4.line).text, n4 = e4.ch, i2 = e4.ch;
              if (t4) {
                var r2 = this.getHelper(e4, "wordChars");
                "before" != e4.sticky && i2 != t4.length || !n4 ? ++i2 : --n4;
                for (var o2 = t4.charAt(n4), a2 = ie(o2, r2) ? function(e5) {
                  return ie(e5, r2);
                } : /\s/.test(o2) ? function(e5) {
                  return /\s/.test(e5);
                } : function(e5) {
                  return !/\s/.test(e5) && !ie(e5);
                }; n4 > 0 && a2(t4.charAt(n4 - 1)); ) --n4;
                for (; i2 < t4.length && a2(t4.charAt(i2)); ) ++i2;
              }
              return new Ar(it(e4.line, n4), it(e4.line, i2));
            }, toggleOverwrite: function(e4) {
              null != e4 && e4 == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? O(this.display.cursorDiv, "CodeMirror-overwrite") : A(this.display.cursorDiv, "CodeMirror-overwrite"), ve(this, "overwriteToggle", this, this.state.overwrite));
            }, hasFocus: function() {
              return this.display.input.getField() == N(H(this));
            }, isReadOnly: function() {
              return !(!this.options.readOnly && !this.doc.cantEdit);
            }, scrollTo: rr((function(e4, t4) {
              Ii(this, e4, t4);
            })), getScrollInfo: function() {
              var e4 = this.display.scroller;
              return { left: e4.scrollLeft, top: e4.scrollTop, height: e4.scrollHeight - Ln(this) - this.display.barHeight, width: e4.scrollWidth - Ln(this) - this.display.barWidth, clientHeight: Mn(this), clientWidth: Tn(this) };
            }, scrollIntoView: rr((function(e4, t4) {
              null == e4 ? (e4 = { from: this.doc.sel.primary().head, to: null }, null == t4 && (t4 = this.options.cursorScrollMargin)) : "number" == typeof e4 ? e4 = { from: it(e4, 0), to: null } : null == e4.from && (e4 = { from: e4, to: null }), e4.to || (e4.to = e4.from), e4.margin = t4 || 0, null != e4.from.line ? (function(e5, t5) {
                zi(e5), e5.curOp.scrollToPos = t5;
              })(this, e4) : Hi(this, e4.from, e4.to, e4.margin);
            })), setSize: rr((function(e4, t4) {
              var n4 = this, i2 = function(e5) {
                return "number" == typeof e5 || /^\d+$/.test(String(e5)) ? e5 + "px" : e5;
              };
              null != e4 && (this.display.wrapper.style.width = i2(e4)), null != t4 && (this.display.wrapper.style.height = i2(t4)), this.options.lineWrapping && jn(this);
              var r2 = this.display.viewFrom;
              this.doc.iter(r2, this.display.viewTo, (function(e5) {
                if (e5.widgets) {
                  for (var t5 = 0; t5 < e5.widgets.length; t5++) if (e5.widgets[t5].noHScroll) {
                    mi(n4, r2, "widget");
                    break;
                  }
                }
                ++r2;
              })), this.curOp.forceUpdate = true, ve(this, "refresh", this);
            })), operation: function(e4) {
              return nr(this, e4);
            }, startOperation: function() {
              return Ki(this);
            }, endOperation: function() {
              return Zi(this);
            }, refresh: rr((function() {
              var e4 = this.display.cachedTextHeight;
              pi(this), this.curOp.forceUpdate = true, qn(this), Ii(this, this.doc.scrollLeft, this.doc.scrollTop), fr(this.display), (null == e4 || Math.abs(e4 - ai(this.display)) > 0.5 || this.options.lineWrapping) && di(this), ve(this, "refresh", this);
            })), swapDoc: rr((function(e4) {
              var t4 = this.doc;
              return t4.cm = null, this.state.selectingText && this.state.selectingText(), Pr(this, e4), qn(this), this.display.input.reset(), Ii(this, e4.scrollLeft, e4.scrollTop), this.curOp.forceScroll = true, dn(this, "swapDoc", this, t4), t4;
            })), phrase: function(e4) {
              var t4 = this.options.phrases;
              return t4 && Object.prototype.hasOwnProperty.call(t4, e4) ? t4[e4] : e4;
            }, getInputField: function() {
              return this.display.input.getField();
            }, getWrapperElement: function() {
              return this.display.wrapper;
            }, getScrollerElement: function() {
              return this.display.scroller;
            }, getGutterElement: function() {
              return this.display.gutters;
            } }, De(e3), e3.registerHelper = function(t4, i2, r2) {
              n3.hasOwnProperty(t4) || (n3[t4] = e3[t4] = { _global: [] }), n3[t4][i2] = r2;
            }, e3.registerGlobalHelper = function(t4, i2, r2, o2) {
              e3.registerHelper(t4, i2, o2), n3[t4]._global.push({ pred: r2, val: o2 });
            };
          })(Ma);
          var Za = "iter insert remove copy getEditor constructor".split(" ");
          for (var Ya in Io.prototype) Io.prototype.hasOwnProperty(Ya) && q(Za, Ya) < 0 && (Ma.prototype[Ya] = /* @__PURE__ */ (function(e3) {
            return function() {
              return e3.apply(this.doc, arguments);
            };
          })(Io.prototype[Ya]));
          return De(Io), Ma.inputStyles = { textarea: Ka, contenteditable: Ua }, Ma.defineMode = function(e3) {
            Ma.defaults.mode || "null" == e3 || (Ma.defaults.mode = e3), _e.apply(this, arguments);
          }, Ma.defineMIME = function(e3, t3) {
            Pe[e3] = t3;
          }, Ma.defineMode("null", (function() {
            return { token: function(e3) {
              return e3.skipToEnd();
            } };
          })), Ma.defineMIME("text/plain", "null"), Ma.defineExtension = function(e3, t3) {
            Ma.prototype[e3] = t3;
          }, Ma.defineDocExtension = function(e3, t3) {
            Io.prototype[e3] = t3;
          }, Ma.fromTextArea = function(e3, t3) {
            if ((t3 = t3 ? _(t3) : {}).value = e3.value, !t3.tabindex && e3.tabIndex && (t3.tabindex = e3.tabIndex), !t3.placeholder && e3.placeholder && (t3.placeholder = e3.placeholder), null == t3.autofocus) {
              var n3 = N(e3.ownerDocument);
              t3.autofocus = n3 == e3 || null != e3.getAttribute("autofocus") && n3 == document.body;
            }
            function i2() {
              e3.value = l2.getValue();
            }
            var r2;
            if (e3.form && (pe(e3.form, "submit", i2), !t3.leaveSubmitMethodAlone)) {
              var o2 = e3.form;
              r2 = o2.submit;
              try {
                var a2 = o2.submit = function() {
                  i2(), o2.submit = r2, o2.submit(), o2.submit = a2;
                };
              } catch (e4) {
              }
            }
            t3.finishInit = function(n4) {
              n4.save = i2, n4.getTextArea = function() {
                return e3;
              }, n4.toTextArea = function() {
                n4.toTextArea = isNaN, i2(), e3.parentNode.removeChild(n4.getWrapperElement()), e3.style.display = "", e3.form && (ge(e3.form, "submit", i2), t3.leaveSubmitMethodAlone || "function" != typeof e3.form.submit || (e3.form.submit = r2));
              };
            }, e3.style.display = "none";
            var l2 = Ma((function(t4) {
              return e3.parentNode.insertBefore(t4, e3.nextSibling);
            }), t3);
            return l2;
          }, (function(e3) {
            e3.off = ge, e3.on = pe, e3.wheelEventPixels = kr, e3.Doc = Io, e3.splitLines = Oe, e3.countColumn = W, e3.findColumn = X, e3.isWordChar = ne, e3.Pass = U, e3.signal = ve, e3.Line = Kt, e3.changeEnd = Tr, e3.scrollbarModel = Gi, e3.Pos = it, e3.cmpPos = rt, e3.modes = Re, e3.mimeModes = Pe, e3.resolveMode = We, e3.getMode = je, e3.modeExtensions = qe, e3.extendMode = Ue, e3.copyState = $e, e3.startState = Ve, e3.innerMode = Ge, e3.commands = oa, e3.keyMap = Vo, e3.keyName = Jo, e3.isModifierKey = Yo, e3.lookupKey = Zo, e3.normalizeKeyMap = Ko, e3.StringStream = Xe, e3.SharedTextMarker = Mo, e3.TextMarker = Lo, e3.LineWidget = Fo, e3.e_preventDefault = Ce, e3.e_stopPropagation = we, e3.e_stop = Se, e3.addClass = O, e3.contains = B, e3.rmClass = A, e3.keyNames = qo;
          })(Ma), Ma.version = "5.65.15", Ma;
        }));
      }, {}], 11: [function(e, t, n) {
        var i;
        i = function(e2) {
          "use strict";
          var t2 = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i;
          e2.defineMode("gfm", (function(n2, i2) {
            var r = 0, o = { startState: function() {
              return { code: false, codeBlock: false, ateSpace: false };
            }, copyState: function(e3) {
              return { code: e3.code, codeBlock: e3.codeBlock, ateSpace: e3.ateSpace };
            }, token: function(e3, n3) {
              if (n3.combineTokens = null, n3.codeBlock) return e3.match(/^```+/) ? (n3.codeBlock = false, null) : (e3.skipToEnd(), null);
              if (e3.sol() && (n3.code = false), e3.sol() && e3.match(/^```+/)) return e3.skipToEnd(), n3.codeBlock = true, null;
              if ("`" === e3.peek()) {
                e3.next();
                var o2 = e3.pos;
                e3.eatWhile("`");
                var a2 = 1 + e3.pos - o2;
                return n3.code ? a2 === r && (n3.code = false) : (r = a2, n3.code = true), null;
              }
              if (n3.code) return e3.next(), null;
              if (e3.eatSpace()) return n3.ateSpace = true, null;
              if ((e3.sol() || n3.ateSpace) && (n3.ateSpace = false, false !== i2.gitHubSpice)) {
                if (e3.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?=.{0,6}\d)(?:[a-f0-9]{7,40}\b)/)) return n3.combineTokens = true, "link";
                if (e3.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+)?#[0-9]+\b/)) return n3.combineTokens = true, "link";
              }
              return e3.match(t2) && "](" != e3.string.slice(e3.start - 2, e3.start) && (0 == e3.start || /\W/.test(e3.string.charAt(e3.start - 1))) ? (n3.combineTokens = true, "link") : (e3.next(), null);
            }, blankLine: function(e3) {
              return e3.code = false, null;
            } }, a = { taskLists: true, strikethrough: true, emoji: true };
            for (var l in i2) a[l] = i2[l];
            return a.name = "markdown", e2.overlayMode(e2.getMode(n2, a), o);
          }), "markdown"), e2.defineMIME("text/x-gfm", "gfm");
        }, "object" == typeof n && "object" == typeof t ? i(e("../../lib/codemirror"), e("../markdown/markdown"), e("../../addon/mode/overlay")) : i(CodeMirror);
      }, { "../../addon/mode/overlay": 7, "../../lib/codemirror": 10, "../markdown/markdown": 12 }], 12: [function(e, t, n) {
        var i;
        i = function(e2) {
          "use strict";
          e2.defineMode("markdown", (function(t2, n2) {
            var i2 = e2.getMode(t2, "text/html"), r = "null" == i2.name;
            void 0 === n2.highlightFormatting && (n2.highlightFormatting = false), void 0 === n2.maxBlockquoteDepth && (n2.maxBlockquoteDepth = 0), void 0 === n2.taskLists && (n2.taskLists = false), void 0 === n2.strikethrough && (n2.strikethrough = false), void 0 === n2.emoji && (n2.emoji = false), void 0 === n2.fencedCodeBlockHighlighting && (n2.fencedCodeBlockHighlighting = true), void 0 === n2.fencedCodeBlockDefaultMode && (n2.fencedCodeBlockDefaultMode = "text/plain"), void 0 === n2.xml && (n2.xml = true), void 0 === n2.tokenTypeOverrides && (n2.tokenTypeOverrides = {});
            var o = { header: "header", code: "comment", quote: "quote", list1: "variable-2", list2: "variable-3", list3: "keyword", hr: "hr", image: "image", imageAltText: "image-alt-text", imageMarker: "image-marker", formatting: "formatting", linkInline: "link", linkEmail: "link", linkText: "link", linkHref: "string", em: "em", strong: "strong", strikethrough: "strikethrough", emoji: "builtin" };
            for (var a in o) o.hasOwnProperty(a) && n2.tokenTypeOverrides[a] && (o[a] = n2.tokenTypeOverrides[a]);
            var l = /^([*\-_])(?:\s*\1){2,}\s*$/, s = /^(?:[*\-+]|^[0-9]+([.)]))\s+/, u = /^\[(x| )\](?=\s)/i, c = n2.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/, d = /^ {0,3}(?:\={1,}|-{2,})\s*$/, h = /^[^#!\[\]*_\\<>` "'(~:]+/, f = /^(~~~+|```+)[ \t]*([\w\/+#-]*)[^\n`]*$/, p = /^\s*\[[^\]]+?\]:.*$/, m = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/;
            function g(e3, t3, n3) {
              return t3.f = t3.inline = n3, n3(e3, t3);
            }
            function v(e3, t3, n3) {
              return t3.f = t3.block = n3, n3(e3, t3);
            }
            function x(t3) {
              if (t3.linkTitle = false, t3.linkHref = false, t3.linkText = false, t3.em = false, t3.strong = false, t3.strikethrough = false, t3.quote = 0, t3.indentedCode = false, t3.f == b) {
                var n3 = r;
                if (!n3) {
                  var o2 = e2.innerMode(i2, t3.htmlState);
                  n3 = "xml" == o2.mode.name && null === o2.state.tagStart && !o2.state.context && o2.state.tokenize.isInText;
                }
                n3 && (t3.f = k, t3.block = y, t3.htmlState = null);
              }
              return t3.trailingSpace = 0, t3.trailingSpaceNewLine = false, t3.prevLine = t3.thisLine, t3.thisLine = { stream: null }, null;
            }
            function y(i3, r2) {
              var a2, h2 = i3.column() === r2.indentation, m2 = !(a2 = r2.prevLine.stream) || !/\S/.test(a2.string), v2 = r2.indentedCode, x2 = r2.prevLine.hr, y2 = false !== r2.list, b2 = (r2.listStack[r2.listStack.length - 1] || 0) + 3;
              r2.indentedCode = false;
              var w2 = r2.indentation;
              if (null === r2.indentationDiff && (r2.indentationDiff = r2.indentation, y2)) {
                for (r2.list = null; w2 < r2.listStack[r2.listStack.length - 1]; ) r2.listStack.pop(), r2.listStack.length ? r2.indentation = r2.listStack[r2.listStack.length - 1] : r2.list = false;
                false !== r2.list && (r2.indentationDiff = w2 - r2.listStack[r2.listStack.length - 1]);
              }
              var k2 = !(m2 || x2 || r2.prevLine.header || y2 && v2 || r2.prevLine.fencedCodeEnd), S2 = (false === r2.list || x2 || m2) && r2.indentation <= b2 && i3.match(l), F2 = null;
              if (r2.indentationDiff >= 4 && (v2 || r2.prevLine.fencedCodeEnd || r2.prevLine.header || m2)) return i3.skipToEnd(), r2.indentedCode = true, o.code;
              if (i3.eatSpace()) return null;
              if (h2 && r2.indentation <= b2 && (F2 = i3.match(c)) && F2[1].length <= 6) return r2.quote = 0, r2.header = F2[1].length, r2.thisLine.header = true, n2.highlightFormatting && (r2.formatting = "header"), r2.f = r2.inline, C(r2);
              if (r2.indentation <= b2 && i3.eat(">")) return r2.quote = h2 ? 1 : r2.quote + 1, n2.highlightFormatting && (r2.formatting = "quote"), i3.eatSpace(), C(r2);
              if (!S2 && !r2.setext && h2 && r2.indentation <= b2 && (F2 = i3.match(s))) {
                var A2 = F2[1] ? "ol" : "ul";
                return r2.indentation = w2 + i3.current().length, r2.list = true, r2.quote = 0, r2.listStack.push(r2.indentation), r2.em = false, r2.strong = false, r2.code = false, r2.strikethrough = false, n2.taskLists && i3.match(u, false) && (r2.taskList = true), r2.f = r2.inline, n2.highlightFormatting && (r2.formatting = ["list", "list-" + A2]), C(r2);
              }
              return h2 && r2.indentation <= b2 && (F2 = i3.match(f, true)) ? (r2.quote = 0, r2.fencedEndRE = new RegExp(F2[1] + "+ *$"), r2.localMode = n2.fencedCodeBlockHighlighting && (function(n3) {
                if (e2.findModeByName) {
                  var i4 = e2.findModeByName(n3);
                  i4 && (n3 = i4.mime || i4.mimes[0]);
                }
                var r3 = e2.getMode(t2, n3);
                return "null" == r3.name ? null : r3;
              })(F2[2] || n2.fencedCodeBlockDefaultMode), r2.localMode && (r2.localState = e2.startState(r2.localMode)), r2.f = r2.block = D, n2.highlightFormatting && (r2.formatting = "code-block"), r2.code = -1, C(r2)) : r2.setext || !(k2 && y2 || r2.quote || false !== r2.list || r2.code || S2 || p.test(i3.string)) && (F2 = i3.lookAhead(1)) && (F2 = F2.match(d)) ? (r2.setext ? (r2.header = r2.setext, r2.setext = 0, i3.skipToEnd(), n2.highlightFormatting && (r2.formatting = "header")) : (r2.header = "=" == F2[0].charAt(0) ? 1 : 2, r2.setext = r2.header), r2.thisLine.header = true, r2.f = r2.inline, C(r2)) : S2 ? (i3.skipToEnd(), r2.hr = true, r2.thisLine.hr = true, o.hr) : "[" === i3.peek() ? g(i3, r2, E) : g(i3, r2, r2.inline);
            }
            function b(t3, n3) {
              var o2 = i2.token(t3, n3.htmlState);
              if (!r) {
                var a2 = e2.innerMode(i2, n3.htmlState);
                ("xml" == a2.mode.name && null === a2.state.tagStart && !a2.state.context && a2.state.tokenize.isInText || n3.md_inside && t3.current().indexOf(">") > -1) && (n3.f = k, n3.block = y, n3.htmlState = null);
              }
              return o2;
            }
            function D(e3, t3) {
              var i3, r2 = t3.listStack[t3.listStack.length - 1] || 0, a2 = t3.indentation < r2, l2 = r2 + 3;
              return t3.fencedEndRE && t3.indentation <= l2 && (a2 || e3.match(t3.fencedEndRE)) ? (n2.highlightFormatting && (t3.formatting = "code-block"), a2 || (i3 = C(t3)), t3.localMode = t3.localState = null, t3.block = y, t3.f = k, t3.fencedEndRE = null, t3.code = 0, t3.thisLine.fencedCodeEnd = true, a2 ? v(e3, t3, t3.block) : i3) : t3.localMode ? t3.localMode.token(e3, t3.localState) : (e3.skipToEnd(), o.code);
            }
            function C(e3) {
              var t3 = [];
              if (e3.formatting) {
                t3.push(o.formatting), "string" == typeof e3.formatting && (e3.formatting = [e3.formatting]);
                for (var i3 = 0; i3 < e3.formatting.length; i3++) t3.push(o.formatting + "-" + e3.formatting[i3]), "header" === e3.formatting[i3] && t3.push(o.formatting + "-" + e3.formatting[i3] + "-" + e3.header), "quote" === e3.formatting[i3] && (!n2.maxBlockquoteDepth || n2.maxBlockquoteDepth >= e3.quote ? t3.push(o.formatting + "-" + e3.formatting[i3] + "-" + e3.quote) : t3.push("error"));
              }
              if (e3.taskOpen) return t3.push("meta"), t3.length ? t3.join(" ") : null;
              if (e3.taskClosed) return t3.push("property"), t3.length ? t3.join(" ") : null;
              if (e3.linkHref ? t3.push(o.linkHref, "url") : (e3.strong && t3.push(o.strong), e3.em && t3.push(o.em), e3.strikethrough && t3.push(o.strikethrough), e3.emoji && t3.push(o.emoji), e3.linkText && t3.push(o.linkText), e3.code && t3.push(o.code), e3.image && t3.push(o.image), e3.imageAltText && t3.push(o.imageAltText, "link"), e3.imageMarker && t3.push(o.imageMarker)), e3.header && t3.push(o.header, o.header + "-" + e3.header), e3.quote && (t3.push(o.quote), !n2.maxBlockquoteDepth || n2.maxBlockquoteDepth >= e3.quote ? t3.push(o.quote + "-" + e3.quote) : t3.push(o.quote + "-" + n2.maxBlockquoteDepth)), false !== e3.list) {
                var r2 = (e3.listStack.length - 1) % 3;
                r2 ? 1 === r2 ? t3.push(o.list2) : t3.push(o.list3) : t3.push(o.list1);
              }
              return e3.trailingSpaceNewLine ? t3.push("trailing-space-new-line") : e3.trailingSpace && t3.push("trailing-space-" + (e3.trailingSpace % 2 ? "a" : "b")), t3.length ? t3.join(" ") : null;
            }
            function w(e3, t3) {
              if (e3.match(h, true)) return C(t3);
            }
            function k(t3, r2) {
              var a2 = r2.text(t3, r2);
              if (void 0 !== a2) return a2;
              if (r2.list) return r2.list = null, C(r2);
              if (r2.taskList) return " " === t3.match(u, true)[1] ? r2.taskOpen = true : r2.taskClosed = true, n2.highlightFormatting && (r2.formatting = "task"), r2.taskList = false, C(r2);
              if (r2.taskOpen = false, r2.taskClosed = false, r2.header && t3.match(/^#+$/, true)) return n2.highlightFormatting && (r2.formatting = "header"), C(r2);
              var l2 = t3.next();
              if (r2.linkTitle) {
                r2.linkTitle = false;
                var s2 = l2;
                "(" === l2 && (s2 = ")");
                var c2 = "^\\s*(?:[^" + (s2 = (s2 + "").replace(/([.?*+^\[\]\\(){}|-])/g, "\\$1")) + "\\\\]+|\\\\\\\\|\\\\.)" + s2;
                if (t3.match(new RegExp(c2), true)) return o.linkHref;
              }
              if ("`" === l2) {
                var d2 = r2.formatting;
                n2.highlightFormatting && (r2.formatting = "code"), t3.eatWhile("`");
                var h2 = t3.current().length;
                if (0 != r2.code || r2.quote && 1 != h2) {
                  if (h2 == r2.code) {
                    var f2 = C(r2);
                    return r2.code = 0, f2;
                  }
                  return r2.formatting = d2, C(r2);
                }
                return r2.code = h2, C(r2);
              }
              if (r2.code) return C(r2);
              if ("\\" === l2 && (t3.next(), n2.highlightFormatting)) {
                var p2 = C(r2), g2 = o.formatting + "-escape";
                return p2 ? p2 + " " + g2 : g2;
              }
              if ("!" === l2 && t3.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) return r2.imageMarker = true, r2.image = true, n2.highlightFormatting && (r2.formatting = "image"), C(r2);
              if ("[" === l2 && r2.imageMarker && t3.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/, false)) return r2.imageMarker = false, r2.imageAltText = true, n2.highlightFormatting && (r2.formatting = "image"), C(r2);
              if ("]" === l2 && r2.imageAltText) {
                n2.highlightFormatting && (r2.formatting = "image");
                var p2 = C(r2);
                return r2.imageAltText = false, r2.image = false, r2.inline = r2.f = F, p2;
              }
              if ("[" === l2 && !r2.image) return r2.linkText && t3.match(/^.*?\]/) || (r2.linkText = true, n2.highlightFormatting && (r2.formatting = "link")), C(r2);
              if ("]" === l2 && r2.linkText) {
                n2.highlightFormatting && (r2.formatting = "link");
                var p2 = C(r2);
                return r2.linkText = false, r2.inline = r2.f = t3.match(/\(.*?\)| ?\[.*?\]/, false) ? F : k, p2;
              }
              if ("<" === l2 && t3.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, false)) return r2.f = r2.inline = S, n2.highlightFormatting && (r2.formatting = "link"), (p2 = C(r2)) ? p2 += " " : p2 = "", p2 + o.linkInline;
              if ("<" === l2 && t3.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, false)) return r2.f = r2.inline = S, n2.highlightFormatting && (r2.formatting = "link"), (p2 = C(r2)) ? p2 += " " : p2 = "", p2 + o.linkEmail;
              if (n2.xml && "<" === l2 && t3.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i, false)) {
                var x2 = t3.string.indexOf(">", t3.pos);
                if (-1 != x2) {
                  var y2 = t3.string.substring(t3.start, x2);
                  /markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(y2) && (r2.md_inside = true);
                }
                return t3.backUp(1), r2.htmlState = e2.startState(i2), v(t3, r2, b);
              }
              if (n2.xml && "<" === l2 && t3.match(/^\/\w*?>/)) return r2.md_inside = false, "tag";
              if ("*" === l2 || "_" === l2) {
                for (var D2 = 1, w2 = 1 == t3.pos ? " " : t3.string.charAt(t3.pos - 2); D2 < 3 && t3.eat(l2); ) D2++;
                var A2 = t3.peek() || " ", E2 = !/\s/.test(A2) && (!m.test(A2) || /\s/.test(w2) || m.test(w2)), L2 = !/\s/.test(w2) && (!m.test(w2) || /\s/.test(A2) || m.test(A2)), T2 = null, M2 = null;
                if (D2 % 2 && (r2.em || !E2 || "*" !== l2 && L2 && !m.test(w2) ? r2.em != l2 || !L2 || "*" !== l2 && E2 && !m.test(A2) || (T2 = false) : T2 = true), D2 > 1 && (r2.strong || !E2 || "*" !== l2 && L2 && !m.test(w2) ? r2.strong != l2 || !L2 || "*" !== l2 && E2 && !m.test(A2) || (M2 = false) : M2 = true), null != M2 || null != T2) return n2.highlightFormatting && (r2.formatting = null == T2 ? "strong" : null == M2 ? "em" : "strong em"), true === T2 && (r2.em = l2), true === M2 && (r2.strong = l2), f2 = C(r2), false === T2 && (r2.em = false), false === M2 && (r2.strong = false), f2;
              } else if (" " === l2 && (t3.eat("*") || t3.eat("_"))) {
                if (" " === t3.peek()) return C(r2);
                t3.backUp(1);
              }
              if (n2.strikethrough) {
                if ("~" === l2 && t3.eatWhile(l2)) {
                  if (r2.strikethrough) return n2.highlightFormatting && (r2.formatting = "strikethrough"), f2 = C(r2), r2.strikethrough = false, f2;
                  if (t3.match(/^[^\s]/, false)) return r2.strikethrough = true, n2.highlightFormatting && (r2.formatting = "strikethrough"), C(r2);
                } else if (" " === l2 && t3.match("~~", true)) {
                  if (" " === t3.peek()) return C(r2);
                  t3.backUp(2);
                }
              }
              if (n2.emoji && ":" === l2 && t3.match(/^(?:[a-z_\d+][a-z_\d+-]*|\-[a-z_\d+][a-z_\d+-]*):/)) {
                r2.emoji = true, n2.highlightFormatting && (r2.formatting = "emoji");
                var B = C(r2);
                return r2.emoji = false, B;
              }
              return " " === l2 && (t3.match(/^ +$/, false) ? r2.trailingSpace++ : r2.trailingSpace && (r2.trailingSpaceNewLine = true)), C(r2);
            }
            function S(e3, t3) {
              if (">" === e3.next()) {
                t3.f = t3.inline = k, n2.highlightFormatting && (t3.formatting = "link");
                var i3 = C(t3);
                return i3 ? i3 += " " : i3 = "", i3 + o.linkInline;
              }
              return e3.match(/^[^>]+/, true), o.linkInline;
            }
            function F(e3, t3) {
              if (e3.eatSpace()) return null;
              var i3, r2 = e3.next();
              return "(" === r2 || "[" === r2 ? (t3.f = t3.inline = (i3 = "(" === r2 ? ")" : "]", function(e4, t4) {
                if (e4.next() === i3) {
                  t4.f = t4.inline = k, n2.highlightFormatting && (t4.formatting = "link-string");
                  var r3 = C(t4);
                  return t4.linkHref = false, r3;
                }
                return e4.match(A[i3]), t4.linkHref = true, C(t4);
              }), n2.highlightFormatting && (t3.formatting = "link-string"), t3.linkHref = true, C(t3)) : "error";
            }
            var A = { ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/, "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/ };
            function E(e3, t3) {
              return e3.match(/^([^\]\\]|\\.)*\]:/, false) ? (t3.f = L, e3.next(), n2.highlightFormatting && (t3.formatting = "link"), t3.linkText = true, C(t3)) : g(e3, t3, k);
            }
            function L(e3, t3) {
              if (e3.match("]:", true)) {
                t3.f = t3.inline = T, n2.highlightFormatting && (t3.formatting = "link");
                var i3 = C(t3);
                return t3.linkText = false, i3;
              }
              return e3.match(/^([^\]\\]|\\.)+/, true), o.linkText;
            }
            function T(e3, t3) {
              return e3.eatSpace() ? null : (e3.match(/^[^\s]+/, true), void 0 === e3.peek() ? t3.linkTitle = true : e3.match(/^(?:\s+(?:"(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+'|\((?:[^)\\]|\\.)+\)))?/, true), t3.f = t3.inline = k, o.linkHref + " url");
            }
            var M = { startState: function() {
              return { f: y, prevLine: { stream: null }, thisLine: { stream: null }, block: y, htmlState: null, indentation: 0, inline: k, text: w, formatting: false, linkText: false, linkHref: false, linkTitle: false, code: 0, em: false, strong: false, header: 0, setext: 0, hr: false, taskList: false, list: false, listStack: [], quote: 0, trailingSpace: 0, trailingSpaceNewLine: false, strikethrough: false, emoji: false, fencedEndRE: null };
            }, copyState: function(t3) {
              return { f: t3.f, prevLine: t3.prevLine, thisLine: t3.thisLine, block: t3.block, htmlState: t3.htmlState && e2.copyState(i2, t3.htmlState), indentation: t3.indentation, localMode: t3.localMode, localState: t3.localMode ? e2.copyState(t3.localMode, t3.localState) : null, inline: t3.inline, text: t3.text, formatting: false, linkText: t3.linkText, linkTitle: t3.linkTitle, linkHref: t3.linkHref, code: t3.code, em: t3.em, strong: t3.strong, strikethrough: t3.strikethrough, emoji: t3.emoji, header: t3.header, setext: t3.setext, hr: t3.hr, taskList: t3.taskList, list: t3.list, listStack: t3.listStack.slice(0), quote: t3.quote, indentedCode: t3.indentedCode, trailingSpace: t3.trailingSpace, trailingSpaceNewLine: t3.trailingSpaceNewLine, md_inside: t3.md_inside, fencedEndRE: t3.fencedEndRE };
            }, token: function(e3, t3) {
              if (t3.formatting = false, e3 != t3.thisLine.stream) {
                if (t3.header = 0, t3.hr = false, e3.match(/^\s*$/, true)) return x(t3), null;
                if (t3.prevLine = t3.thisLine, t3.thisLine = { stream: e3 }, t3.taskList = false, t3.trailingSpace = 0, t3.trailingSpaceNewLine = false, !t3.localState && (t3.f = t3.block, t3.f != b)) {
                  var n3 = e3.match(/^\s*/, true)[0].replace(/\t/g, "    ").length;
                  if (t3.indentation = n3, t3.indentationDiff = null, n3 > 0) return null;
                }
              }
              return t3.f(e3, t3);
            }, innerMode: function(e3) {
              return e3.block == b ? { state: e3.htmlState, mode: i2 } : e3.localState ? { state: e3.localState, mode: e3.localMode } : { state: e3, mode: M };
            }, indent: function(t3, n3, r2) {
              return t3.block == b && i2.indent ? i2.indent(t3.htmlState, n3, r2) : t3.localState && t3.localMode.indent ? t3.localMode.indent(t3.localState, n3, r2) : e2.Pass;
            }, blankLine: x, getType: C, blockCommentStart: "<!--", blockCommentEnd: "-->", closeBrackets: "()[]{}''\"\"``", fold: "markdown" };
            return M;
          }), "xml"), e2.defineMIME("text/markdown", "markdown"), e2.defineMIME("text/x-markdown", "markdown");
        }, "object" == typeof n && "object" == typeof t ? i(e("../../lib/codemirror"), e("../xml/xml"), e("../meta")) : i(CodeMirror);
      }, { "../../lib/codemirror": 10, "../meta": 13, "../xml/xml": 14 }], 13: [function(e, t, n) {
        (function(e2) {
          "use strict";
          e2.modeInfo = [{ name: "APL", mime: "text/apl", mode: "apl", ext: ["dyalog", "apl"] }, { name: "PGP", mimes: ["application/pgp", "application/pgp-encrypted", "application/pgp-keys", "application/pgp-signature"], mode: "asciiarmor", ext: ["asc", "pgp", "sig"] }, { name: "ASN.1", mime: "text/x-ttcn-asn", mode: "asn.1", ext: ["asn", "asn1"] }, { name: "Asterisk", mime: "text/x-asterisk", mode: "asterisk", file: /^extensions\.conf$/i }, { name: "Brainfuck", mime: "text/x-brainfuck", mode: "brainfuck", ext: ["b", "bf"] }, { name: "C", mime: "text/x-csrc", mode: "clike", ext: ["c", "h", "ino"] }, { name: "C++", mime: "text/x-c++src", mode: "clike", ext: ["cpp", "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"], alias: ["cpp"] }, { name: "Cobol", mime: "text/x-cobol", mode: "cobol", ext: ["cob", "cpy", "cbl"] }, { name: "C#", mime: "text/x-csharp", mode: "clike", ext: ["cs"], alias: ["csharp", "cs"] }, { name: "Clojure", mime: "text/x-clojure", mode: "clojure", ext: ["clj", "cljc", "cljx"] }, { name: "ClojureScript", mime: "text/x-clojurescript", mode: "clojure", ext: ["cljs"] }, { name: "Closure Stylesheets (GSS)", mime: "text/x-gss", mode: "css", ext: ["gss"] }, { name: "CMake", mime: "text/x-cmake", mode: "cmake", ext: ["cmake", "cmake.in"], file: /^CMakeLists\.txt$/ }, { name: "CoffeeScript", mimes: ["application/vnd.coffeescript", "text/coffeescript", "text/x-coffeescript"], mode: "coffeescript", ext: ["coffee"], alias: ["coffee", "coffee-script"] }, { name: "Common Lisp", mime: "text/x-common-lisp", mode: "commonlisp", ext: ["cl", "lisp", "el"], alias: ["lisp"] }, { name: "Cypher", mime: "application/x-cypher-query", mode: "cypher", ext: ["cyp", "cypher"] }, { name: "Cython", mime: "text/x-cython", mode: "python", ext: ["pyx", "pxd", "pxi"] }, { name: "Crystal", mime: "text/x-crystal", mode: "crystal", ext: ["cr"] }, { name: "CSS", mime: "text/css", mode: "css", ext: ["css"] }, { name: "CQL", mime: "text/x-cassandra", mode: "sql", ext: ["cql"] }, { name: "D", mime: "text/x-d", mode: "d", ext: ["d"] }, { name: "Dart", mimes: ["application/dart", "text/x-dart"], mode: "dart", ext: ["dart"] }, { name: "diff", mime: "text/x-diff", mode: "diff", ext: ["diff", "patch"] }, { name: "Django", mime: "text/x-django", mode: "django" }, { name: "Dockerfile", mime: "text/x-dockerfile", mode: "dockerfile", file: /^Dockerfile$/ }, { name: "DTD", mime: "application/xml-dtd", mode: "dtd", ext: ["dtd"] }, { name: "Dylan", mime: "text/x-dylan", mode: "dylan", ext: ["dylan", "dyl", "intr"] }, { name: "EBNF", mime: "text/x-ebnf", mode: "ebnf" }, { name: "ECL", mime: "text/x-ecl", mode: "ecl", ext: ["ecl"] }, { name: "edn", mime: "application/edn", mode: "clojure", ext: ["edn"] }, { name: "Eiffel", mime: "text/x-eiffel", mode: "eiffel", ext: ["e"] }, { name: "Elm", mime: "text/x-elm", mode: "elm", ext: ["elm"] }, { name: "Embedded JavaScript", mime: "application/x-ejs", mode: "htmlembedded", ext: ["ejs"] }, { name: "Embedded Ruby", mime: "application/x-erb", mode: "htmlembedded", ext: ["erb"] }, { name: "Erlang", mime: "text/x-erlang", mode: "erlang", ext: ["erl"] }, { name: "Esper", mime: "text/x-esper", mode: "sql" }, { name: "Factor", mime: "text/x-factor", mode: "factor", ext: ["factor"] }, { name: "FCL", mime: "text/x-fcl", mode: "fcl" }, { name: "Forth", mime: "text/x-forth", mode: "forth", ext: ["forth", "fth", "4th"] }, { name: "Fortran", mime: "text/x-fortran", mode: "fortran", ext: ["f", "for", "f77", "f90", "f95"] }, { name: "F#", mime: "text/x-fsharp", mode: "mllike", ext: ["fs"], alias: ["fsharp"] }, { name: "Gas", mime: "text/x-gas", mode: "gas", ext: ["s"] }, { name: "Gherkin", mime: "text/x-feature", mode: "gherkin", ext: ["feature"] }, { name: "GitHub Flavored Markdown", mime: "text/x-gfm", mode: "gfm", file: /^(readme|contributing|history)\.md$/i }, { name: "Go", mime: "text/x-go", mode: "go", ext: ["go"] }, { name: "Groovy", mime: "text/x-groovy", mode: "groovy", ext: ["groovy", "gradle"], file: /^Jenkinsfile$/ }, { name: "HAML", mime: "text/x-haml", mode: "haml", ext: ["haml"] }, { name: "Haskell", mime: "text/x-haskell", mode: "haskell", ext: ["hs"] }, { name: "Haskell (Literate)", mime: "text/x-literate-haskell", mode: "haskell-literate", ext: ["lhs"] }, { name: "Haxe", mime: "text/x-haxe", mode: "haxe", ext: ["hx"] }, { name: "HXML", mime: "text/x-hxml", mode: "haxe", ext: ["hxml"] }, { name: "ASP.NET", mime: "application/x-aspx", mode: "htmlembedded", ext: ["aspx"], alias: ["asp", "aspx"] }, { name: "HTML", mime: "text/html", mode: "htmlmixed", ext: ["html", "htm", "handlebars", "hbs"], alias: ["xhtml"] }, { name: "HTTP", mime: "message/http", mode: "http" }, { name: "IDL", mime: "text/x-idl", mode: "idl", ext: ["pro"] }, { name: "Pug", mime: "text/x-pug", mode: "pug", ext: ["jade", "pug"], alias: ["jade"] }, { name: "Java", mime: "text/x-java", mode: "clike", ext: ["java"] }, { name: "Java Server Pages", mime: "application/x-jsp", mode: "htmlembedded", ext: ["jsp"], alias: ["jsp"] }, { name: "JavaScript", mimes: ["text/javascript", "text/ecmascript", "application/javascript", "application/x-javascript", "application/ecmascript"], mode: "javascript", ext: ["js"], alias: ["ecmascript", "js", "node"] }, { name: "JSON", mimes: ["application/json", "application/x-json"], mode: "javascript", ext: ["json", "map"], alias: ["json5"] }, { name: "JSON-LD", mime: "application/ld+json", mode: "javascript", ext: ["jsonld"], alias: ["jsonld"] }, { name: "JSX", mime: "text/jsx", mode: "jsx", ext: ["jsx"] }, { name: "Jinja2", mime: "text/jinja2", mode: "jinja2", ext: ["j2", "jinja", "jinja2"] }, { name: "Julia", mime: "text/x-julia", mode: "julia", ext: ["jl"], alias: ["jl"] }, { name: "Kotlin", mime: "text/x-kotlin", mode: "clike", ext: ["kt"] }, { name: "LESS", mime: "text/x-less", mode: "css", ext: ["less"] }, { name: "LiveScript", mime: "text/x-livescript", mode: "livescript", ext: ["ls"], alias: ["ls"] }, { name: "Lua", mime: "text/x-lua", mode: "lua", ext: ["lua"] }, { name: "Markdown", mime: "text/x-markdown", mode: "markdown", ext: ["markdown", "md", "mkd"] }, { name: "mIRC", mime: "text/mirc", mode: "mirc" }, { name: "MariaDB SQL", mime: "text/x-mariadb", mode: "sql" }, { name: "Mathematica", mime: "text/x-mathematica", mode: "mathematica", ext: ["m", "nb", "wl", "wls"] }, { name: "Modelica", mime: "text/x-modelica", mode: "modelica", ext: ["mo"] }, { name: "MUMPS", mime: "text/x-mumps", mode: "mumps", ext: ["mps"] }, { name: "MS SQL", mime: "text/x-mssql", mode: "sql" }, { name: "mbox", mime: "application/mbox", mode: "mbox", ext: ["mbox"] }, { name: "MySQL", mime: "text/x-mysql", mode: "sql" }, { name: "Nginx", mime: "text/x-nginx-conf", mode: "nginx", file: /nginx.*\.conf$/i }, { name: "NSIS", mime: "text/x-nsis", mode: "nsis", ext: ["nsh", "nsi"] }, { name: "NTriples", mimes: ["application/n-triples", "application/n-quads", "text/n-triples"], mode: "ntriples", ext: ["nt", "nq"] }, { name: "Objective-C", mime: "text/x-objectivec", mode: "clike", ext: ["m"], alias: ["objective-c", "objc"] }, { name: "Objective-C++", mime: "text/x-objectivec++", mode: "clike", ext: ["mm"], alias: ["objective-c++", "objc++"] }, { name: "OCaml", mime: "text/x-ocaml", mode: "mllike", ext: ["ml", "mli", "mll", "mly"] }, { name: "Octave", mime: "text/x-octave", mode: "octave", ext: ["m"] }, { name: "Oz", mime: "text/x-oz", mode: "oz", ext: ["oz"] }, { name: "Pascal", mime: "text/x-pascal", mode: "pascal", ext: ["p", "pas"] }, { name: "PEG.js", mime: "null", mode: "pegjs", ext: ["jsonld"] }, { name: "Perl", mime: "text/x-perl", mode: "perl", ext: ["pl", "pm"] }, { name: "PHP", mimes: ["text/x-php", "application/x-httpd-php", "application/x-httpd-php-open"], mode: "php", ext: ["php", "php3", "php4", "php5", "php7", "phtml"] }, { name: "Pig", mime: "text/x-pig", mode: "pig", ext: ["pig"] }, { name: "Plain Text", mime: "text/plain", mode: "null", ext: ["txt", "text", "conf", "def", "list", "log"] }, { name: "PLSQL", mime: "text/x-plsql", mode: "sql", ext: ["pls"] }, { name: "PostgreSQL", mime: "text/x-pgsql", mode: "sql" }, { name: "PowerShell", mime: "application/x-powershell", mode: "powershell", ext: ["ps1", "psd1", "psm1"] }, { name: "Properties files", mime: "text/x-properties", mode: "properties", ext: ["properties", "ini", "in"], alias: ["ini", "properties"] }, { name: "ProtoBuf", mime: "text/x-protobuf", mode: "protobuf", ext: ["proto"] }, { name: "Python", mime: "text/x-python", mode: "python", ext: ["BUILD", "bzl", "py", "pyw"], file: /^(BUCK|BUILD)$/ }, { name: "Puppet", mime: "text/x-puppet", mode: "puppet", ext: ["pp"] }, { name: "Q", mime: "text/x-q", mode: "q", ext: ["q"] }, { name: "R", mime: "text/x-rsrc", mode: "r", ext: ["r", "R"], alias: ["rscript"] }, { name: "reStructuredText", mime: "text/x-rst", mode: "rst", ext: ["rst"], alias: ["rst"] }, { name: "RPM Changes", mime: "text/x-rpm-changes", mode: "rpm" }, { name: "RPM Spec", mime: "text/x-rpm-spec", mode: "rpm", ext: ["spec"] }, { name: "Ruby", mime: "text/x-ruby", mode: "ruby", ext: ["rb"], alias: ["jruby", "macruby", "rake", "rb", "rbx"] }, { name: "Rust", mime: "text/x-rustsrc", mode: "rust", ext: ["rs"] }, { name: "SAS", mime: "text/x-sas", mode: "sas", ext: ["sas"] }, { name: "Sass", mime: "text/x-sass", mode: "sass", ext: ["sass"] }, { name: "Scala", mime: "text/x-scala", mode: "clike", ext: ["scala"] }, { name: "Scheme", mime: "text/x-scheme", mode: "scheme", ext: ["scm", "ss"] }, { name: "SCSS", mime: "text/x-scss", mode: "css", ext: ["scss"] }, { name: "Shell", mimes: ["text/x-sh", "application/x-sh"], mode: "shell", ext: ["sh", "ksh", "bash"], alias: ["bash", "sh", "zsh"], file: /^PKGBUILD$/ }, { name: "Sieve", mime: "application/sieve", mode: "sieve", ext: ["siv", "sieve"] }, { name: "Slim", mimes: ["text/x-slim", "application/x-slim"], mode: "slim", ext: ["slim"] }, { name: "Smalltalk", mime: "text/x-stsrc", mode: "smalltalk", ext: ["st"] }, { name: "Smarty", mime: "text/x-smarty", mode: "smarty", ext: ["tpl"] }, { name: "Solr", mime: "text/x-solr", mode: "solr" }, { name: "SML", mime: "text/x-sml", mode: "mllike", ext: ["sml", "sig", "fun", "smackspec"] }, { name: "Soy", mime: "text/x-soy", mode: "soy", ext: ["soy"], alias: ["closure template"] }, { name: "SPARQL", mime: "application/sparql-query", mode: "sparql", ext: ["rq", "sparql"], alias: ["sparul"] }, { name: "Spreadsheet", mime: "text/x-spreadsheet", mode: "spreadsheet", alias: ["excel", "formula"] }, { name: "SQL", mime: "text/x-sql", mode: "sql", ext: ["sql"] }, { name: "SQLite", mime: "text/x-sqlite", mode: "sql" }, { name: "Squirrel", mime: "text/x-squirrel", mode: "clike", ext: ["nut"] }, { name: "Stylus", mime: "text/x-styl", mode: "stylus", ext: ["styl"] }, { name: "Swift", mime: "text/x-swift", mode: "swift", ext: ["swift"] }, { name: "sTeX", mime: "text/x-stex", mode: "stex" }, { name: "LaTeX", mime: "text/x-latex", mode: "stex", ext: ["text", "ltx", "tex"], alias: ["tex"] }, { name: "SystemVerilog", mime: "text/x-systemverilog", mode: "verilog", ext: ["v", "sv", "svh"] }, { name: "Tcl", mime: "text/x-tcl", mode: "tcl", ext: ["tcl"] }, { name: "Textile", mime: "text/x-textile", mode: "textile", ext: ["textile"] }, { name: "TiddlyWiki", mime: "text/x-tiddlywiki", mode: "tiddlywiki" }, { name: "Tiki wiki", mime: "text/tiki", mode: "tiki" }, { name: "TOML", mime: "text/x-toml", mode: "toml", ext: ["toml"] }, { name: "Tornado", mime: "text/x-tornado", mode: "tornado" }, { name: "troff", mime: "text/troff", mode: "troff", ext: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { name: "TTCN", mime: "text/x-ttcn", mode: "ttcn", ext: ["ttcn", "ttcn3", "ttcnpp"] }, { name: "TTCN_CFG", mime: "text/x-ttcn-cfg", mode: "ttcn-cfg", ext: ["cfg"] }, { name: "Turtle", mime: "text/turtle", mode: "turtle", ext: ["ttl"] }, { name: "TypeScript", mime: "application/typescript", mode: "javascript", ext: ["ts"], alias: ["ts"] }, { name: "TypeScript-JSX", mime: "text/typescript-jsx", mode: "jsx", ext: ["tsx"], alias: ["tsx"] }, { name: "Twig", mime: "text/x-twig", mode: "twig" }, { name: "Web IDL", mime: "text/x-webidl", mode: "webidl", ext: ["webidl"] }, { name: "VB.NET", mime: "text/x-vb", mode: "vb", ext: ["vb"] }, { name: "VBScript", mime: "text/vbscript", mode: "vbscript", ext: ["vbs"] }, { name: "Velocity", mime: "text/velocity", mode: "velocity", ext: ["vtl"] }, { name: "Verilog", mime: "text/x-verilog", mode: "verilog", ext: ["v"] }, { name: "VHDL", mime: "text/x-vhdl", mode: "vhdl", ext: ["vhd", "vhdl"] }, { name: "Vue.js Component", mimes: ["script/x-vue", "text/x-vue"], mode: "vue", ext: ["vue"] }, { name: "XML", mimes: ["application/xml", "text/xml"], mode: "xml", ext: ["xml", "xsl", "xsd", "svg"], alias: ["rss", "wsdl", "xsd"] }, { name: "XQuery", mime: "application/xquery", mode: "xquery", ext: ["xy", "xquery"] }, { name: "Yacas", mime: "text/x-yacas", mode: "yacas", ext: ["ys"] }, { name: "YAML", mimes: ["text/x-yaml", "text/yaml"], mode: "yaml", ext: ["yaml", "yml"], alias: ["yml"] }, { name: "Z80", mime: "text/x-z80", mode: "z80", ext: ["z80"] }, { name: "mscgen", mime: "text/x-mscgen", mode: "mscgen", ext: ["mscgen", "mscin", "msc"] }, { name: "xu", mime: "text/x-xu", mode: "mscgen", ext: ["xu"] }, { name: "msgenny", mime: "text/x-msgenny", mode: "mscgen", ext: ["msgenny"] }, { name: "WebAssembly", mime: "text/webassembly", mode: "wast", ext: ["wat", "wast"] }];
          for (var t2 = 0; t2 < e2.modeInfo.length; t2++) {
            var n2 = e2.modeInfo[t2];
            n2.mimes && (n2.mime = n2.mimes[0]);
          }
          e2.findModeByMIME = function(t3) {
            t3 = t3.toLowerCase();
            for (var n3 = 0; n3 < e2.modeInfo.length; n3++) {
              var i = e2.modeInfo[n3];
              if (i.mime == t3) return i;
              if (i.mimes) {
                for (var r = 0; r < i.mimes.length; r++) if (i.mimes[r] == t3) return i;
              }
            }
            return /\+xml$/.test(t3) ? e2.findModeByMIME("application/xml") : /\+json$/.test(t3) ? e2.findModeByMIME("application/json") : void 0;
          }, e2.findModeByExtension = function(t3) {
            t3 = t3.toLowerCase();
            for (var n3 = 0; n3 < e2.modeInfo.length; n3++) {
              var i = e2.modeInfo[n3];
              if (i.ext) {
                for (var r = 0; r < i.ext.length; r++) if (i.ext[r] == t3) return i;
              }
            }
          }, e2.findModeByFileName = function(t3) {
            for (var n3 = 0; n3 < e2.modeInfo.length; n3++) {
              var i = e2.modeInfo[n3];
              if (i.file && i.file.test(t3)) return i;
            }
            var r = t3.lastIndexOf("."), o = r > -1 && t3.substring(r + 1, t3.length);
            if (o) return e2.findModeByExtension(o);
          }, e2.findModeByName = function(t3) {
            t3 = t3.toLowerCase();
            for (var n3 = 0; n3 < e2.modeInfo.length; n3++) {
              var i = e2.modeInfo[n3];
              if (i.name.toLowerCase() == t3) return i;
              if (i.alias) {
                for (var r = 0; r < i.alias.length; r++) if (i.alias[r].toLowerCase() == t3) return i;
              }
            }
          };
        })("object" == typeof n && "object" == typeof t ? e("../lib/codemirror") : CodeMirror);
      }, { "../lib/codemirror": 10 }], 14: [function(e, t, n) {
        (function(e2) {
          "use strict";
          var t2 = { autoSelfClosers: { area: true, base: true, br: true, col: true, command: true, embed: true, frame: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true, menuitem: true }, implicitlyClosed: { dd: true, li: true, optgroup: true, option: true, p: true, rp: true, rt: true, tbody: true, td: true, tfoot: true, th: true, tr: true }, contextGrabbers: { dd: { dd: true, dt: true }, dt: { dd: true, dt: true }, li: { li: true }, option: { option: true, optgroup: true }, optgroup: { optgroup: true }, p: { address: true, article: true, aside: true, blockquote: true, dir: true, div: true, dl: true, fieldset: true, footer: true, form: true, h1: true, h2: true, h3: true, h4: true, h5: true, h6: true, header: true, hgroup: true, hr: true, menu: true, nav: true, ol: true, p: true, pre: true, section: true, table: true, ul: true }, rp: { rp: true, rt: true }, rt: { rp: true, rt: true }, tbody: { tbody: true, tfoot: true }, td: { td: true, th: true }, tfoot: { tbody: true }, th: { td: true, th: true }, thead: { tbody: true, tfoot: true }, tr: { tr: true } }, doNotIndent: { pre: true }, allowUnquoted: true, allowMissing: true, caseFold: true }, n2 = { autoSelfClosers: {}, implicitlyClosed: {}, contextGrabbers: {}, doNotIndent: {}, allowUnquoted: false, allowMissing: false, allowMissingTagName: false, caseFold: false };
          e2.defineMode("xml", (function(i, r) {
            var o, a, l = i.indentUnit, s = {}, u = r.htmlMode ? t2 : n2;
            for (var c in u) s[c] = u[c];
            for (var c in r) s[c] = r[c];
            function d(e3, t3) {
              function n3(n4) {
                return t3.tokenize = n4, n4(e3, t3);
              }
              var i2 = e3.next();
              return "<" == i2 ? e3.eat("!") ? e3.eat("[") ? e3.match("CDATA[") ? n3(f("atom", "]]>")) : null : e3.match("--") ? n3(f("comment", "-->")) : e3.match("DOCTYPE", true, true) ? (e3.eatWhile(/[\w\._\-]/), n3(p(1))) : null : e3.eat("?") ? (e3.eatWhile(/[\w\._\-]/), t3.tokenize = f("meta", "?>"), "meta") : (o = e3.eat("/") ? "closeTag" : "openTag", t3.tokenize = h, "tag bracket") : "&" == i2 ? (e3.eat("#") ? e3.eat("x") ? e3.eatWhile(/[a-fA-F\d]/) && e3.eat(";") : e3.eatWhile(/[\d]/) && e3.eat(";") : e3.eatWhile(/[\w\.\-:]/) && e3.eat(";")) ? "atom" : "error" : (e3.eatWhile(/[^&<]/), null);
            }
            function h(e3, t3) {
              var n3, i2, r2 = e3.next();
              if (">" == r2 || "/" == r2 && e3.eat(">")) return t3.tokenize = d, o = ">" == r2 ? "endTag" : "selfcloseTag", "tag bracket";
              if ("=" == r2) return o = "equals", null;
              if ("<" == r2) {
                t3.tokenize = d, t3.state = y, t3.tagName = t3.tagStart = null;
                var a2 = t3.tokenize(e3, t3);
                return a2 ? a2 + " tag error" : "tag error";
              }
              return /[\'\"]/.test(r2) ? (t3.tokenize = (n3 = r2, i2 = function(e4, t4) {
                for (; !e4.eol(); ) if (e4.next() == n3) {
                  t4.tokenize = h;
                  break;
                }
                return "string";
              }, i2.isInAttribute = true, i2), t3.stringStartCol = e3.column(), t3.tokenize(e3, t3)) : (e3.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word");
            }
            function f(e3, t3) {
              return function(n3, i2) {
                for (; !n3.eol(); ) {
                  if (n3.match(t3)) {
                    i2.tokenize = d;
                    break;
                  }
                  n3.next();
                }
                return e3;
              };
            }
            function p(e3) {
              return function(t3, n3) {
                for (var i2; null != (i2 = t3.next()); ) {
                  if ("<" == i2) return n3.tokenize = p(e3 + 1), n3.tokenize(t3, n3);
                  if (">" == i2) {
                    if (1 == e3) {
                      n3.tokenize = d;
                      break;
                    }
                    return n3.tokenize = p(e3 - 1), n3.tokenize(t3, n3);
                  }
                }
                return "meta";
              };
            }
            function m(e3) {
              return e3 && e3.toLowerCase();
            }
            function g(e3, t3, n3) {
              this.prev = e3.context, this.tagName = t3 || "", this.indent = e3.indented, this.startOfLine = n3, (s.doNotIndent.hasOwnProperty(t3) || e3.context && e3.context.noIndent) && (this.noIndent = true);
            }
            function v(e3) {
              e3.context && (e3.context = e3.context.prev);
            }
            function x(e3, t3) {
              for (var n3; ; ) {
                if (!e3.context) return;
                if (n3 = e3.context.tagName, !s.contextGrabbers.hasOwnProperty(m(n3)) || !s.contextGrabbers[m(n3)].hasOwnProperty(m(t3))) return;
                v(e3);
              }
            }
            function y(e3, t3, n3) {
              return "openTag" == e3 ? (n3.tagStart = t3.column(), b) : "closeTag" == e3 ? D : y;
            }
            function b(e3, t3, n3) {
              return "word" == e3 ? (n3.tagName = t3.current(), a = "tag", k) : s.allowMissingTagName && "endTag" == e3 ? (a = "tag bracket", k(e3, 0, n3)) : (a = "error", b);
            }
            function D(e3, t3, n3) {
              if ("word" == e3) {
                var i2 = t3.current();
                return n3.context && n3.context.tagName != i2 && s.implicitlyClosed.hasOwnProperty(m(n3.context.tagName)) && v(n3), n3.context && n3.context.tagName == i2 || false === s.matchClosing ? (a = "tag", C) : (a = "tag error", w);
              }
              return s.allowMissingTagName && "endTag" == e3 ? (a = "tag bracket", C(e3, 0, n3)) : (a = "error", w);
            }
            function C(e3, t3, n3) {
              return "endTag" != e3 ? (a = "error", C) : (v(n3), y);
            }
            function w(e3, t3, n3) {
              return a = "error", C(e3, 0, n3);
            }
            function k(e3, t3, n3) {
              if ("word" == e3) return a = "attribute", S;
              if ("endTag" == e3 || "selfcloseTag" == e3) {
                var i2 = n3.tagName, r2 = n3.tagStart;
                return n3.tagName = n3.tagStart = null, "selfcloseTag" == e3 || s.autoSelfClosers.hasOwnProperty(m(i2)) ? x(n3, i2) : (x(n3, i2), n3.context = new g(n3, i2, r2 == n3.indented)), y;
              }
              return a = "error", k;
            }
            function S(e3, t3, n3) {
              return "equals" == e3 ? F : (s.allowMissing || (a = "error"), k(e3, 0, n3));
            }
            function F(e3, t3, n3) {
              return "string" == e3 ? A : "word" == e3 && s.allowUnquoted ? (a = "string", k) : (a = "error", k(e3, 0, n3));
            }
            function A(e3, t3, n3) {
              return "string" == e3 ? A : k(e3, 0, n3);
            }
            return d.isInText = true, { startState: function(e3) {
              var t3 = { tokenize: d, state: y, indented: e3 || 0, tagName: null, tagStart: null, context: null };
              return null != e3 && (t3.baseIndent = e3), t3;
            }, token: function(e3, t3) {
              if (!t3.tagName && e3.sol() && (t3.indented = e3.indentation()), e3.eatSpace()) return null;
              o = null;
              var n3 = t3.tokenize(e3, t3);
              return (n3 || o) && "comment" != n3 && (a = null, t3.state = t3.state(o || n3, e3, t3), a && (n3 = "error" == a ? n3 + " error" : a)), n3;
            }, indent: function(t3, n3, i2) {
              var r2 = t3.context;
              if (t3.tokenize.isInAttribute) return t3.tagStart == t3.indented ? t3.stringStartCol + 1 : t3.indented + l;
              if (r2 && r2.noIndent) return e2.Pass;
              if (t3.tokenize != h && t3.tokenize != d) return i2 ? i2.match(/^(\s*)/)[0].length : 0;
              if (t3.tagName) return false !== s.multilineTagIndentPastTag ? t3.tagStart + t3.tagName.length + 2 : t3.tagStart + l * (s.multilineTagIndentFactor || 1);
              if (s.alignCDATA && /<!\[CDATA\[/.test(n3)) return 0;
              var o2 = n3 && /^<(\/)?([\w_:\.-]*)/.exec(n3);
              if (o2 && o2[1]) for (; r2; ) {
                if (r2.tagName == o2[2]) {
                  r2 = r2.prev;
                  break;
                }
                if (!s.implicitlyClosed.hasOwnProperty(m(r2.tagName))) break;
                r2 = r2.prev;
              }
              else if (o2) for (; r2; ) {
                var a2 = s.contextGrabbers[m(r2.tagName)];
                if (!a2 || !a2.hasOwnProperty(m(o2[2]))) break;
                r2 = r2.prev;
              }
              for (; r2 && r2.prev && !r2.startOfLine; ) r2 = r2.prev;
              return r2 ? r2.indent + l : t3.baseIndent || 0;
            }, electricInput: /<\/[\s\w:]+>$/, blockCommentStart: "<!--", blockCommentEnd: "-->", configuration: s.htmlMode ? "html" : "xml", helperType: s.htmlMode ? "html" : "xml", skipAttribute: function(e3) {
              e3.state == F && (e3.state = k);
            }, xmlCurrentTag: function(e3) {
              return e3.tagName ? { name: e3.tagName, close: "closeTag" == e3.type } : null;
            }, xmlCurrentContext: function(e3) {
              for (var t3 = [], n3 = e3.context; n3; n3 = n3.prev) t3.push(n3.tagName);
              return t3.reverse();
            } };
          })), e2.defineMIME("text/xml", "xml"), e2.defineMIME("application/xml", "xml"), e2.mimeModes.hasOwnProperty("text/html") || e2.defineMIME("text/html", { name: "xml", htmlMode: true });
        })("object" == typeof n && "object" == typeof t ? e("../../lib/codemirror") : CodeMirror);
      }, { "../../lib/codemirror": 10 }], 15: [function(e, t, n) {
        !(function(e2, i) {
          "object" == typeof n && void 0 !== t ? i(n) : i((e2 = "undefined" != typeof globalThis ? globalThis : e2 || self).marked = {});
        })(this, (function(e2) {
          "use strict";
          function t2(e3, t3) {
            for (var n3 = 0; n3 < t3.length; n3++) {
              var i2 = t3[n3];
              i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(e3, i2.key, i2);
            }
          }
          function n2(e3, t3) {
            (null == t3 || t3 > e3.length) && (t3 = e3.length);
            for (var n3 = 0, i2 = new Array(t3); n3 < t3; n3++) i2[n3] = e3[n3];
            return i2;
          }
          function i(e3, t3) {
            var i2 = "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
            if (i2) return (i2 = i2.call(e3)).next.bind(i2);
            if (Array.isArray(e3) || (i2 = (function(e4, t4) {
              if (e4) {
                if ("string" == typeof e4) return n2(e4, t4);
                var i3 = Object.prototype.toString.call(e4).slice(8, -1);
                return "Object" === i3 && e4.constructor && (i3 = e4.constructor.name), "Map" === i3 || "Set" === i3 ? Array.from(e4) : "Arguments" === i3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i3) ? n2(e4, t4) : void 0;
              }
            })(e3)) || t3 && e3 && "number" == typeof e3.length) {
              i2 && (e3 = i2);
              var r2 = 0;
              return function() {
                return r2 >= e3.length ? { done: true } : { done: false, value: e3[r2++] };
              };
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }
          function r() {
            return { async: false, baseUrl: null, breaks: false, extensions: null, gfm: true, headerIds: true, headerPrefix: "", highlight: null, langPrefix: "language-", mangle: true, pedantic: false, renderer: null, sanitize: false, sanitizer: null, silent: false, smartLists: false, smartypants: false, tokenizer: null, walkTokens: null, xhtml: false };
          }
          e2.defaults = { async: false, baseUrl: null, breaks: false, extensions: null, gfm: true, headerIds: true, headerPrefix: "", highlight: null, langPrefix: "language-", mangle: true, pedantic: false, renderer: null, sanitize: false, sanitizer: null, silent: false, smartLists: false, smartypants: false, tokenizer: null, walkTokens: null, xhtml: false };
          var o = /[&<>"']/, a = /[&<>"']/g, l = /[<>"']|&(?!#?\w+;)/, s = /[<>"']|&(?!#?\w+;)/g, u = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, c = function(e3) {
            return u[e3];
          };
          function d(e3, t3) {
            if (t3) {
              if (o.test(e3)) return e3.replace(a, c);
            } else if (l.test(e3)) return e3.replace(s, c);
            return e3;
          }
          var h = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
          function f(e3) {
            return e3.replace(h, (function(e4, t3) {
              return "colon" === (t3 = t3.toLowerCase()) ? ":" : "#" === t3.charAt(0) ? "x" === t3.charAt(1) ? String.fromCharCode(parseInt(t3.substring(2), 16)) : String.fromCharCode(+t3.substring(1)) : "";
            }));
          }
          var p = /(^|[^\[])\^/g;
          function m(e3, t3) {
            e3 = "string" == typeof e3 ? e3 : e3.source, t3 = t3 || "";
            var n3 = { replace: function(t4, i2) {
              return i2 = (i2 = i2.source || i2).replace(p, "$1"), e3 = e3.replace(t4, i2), n3;
            }, getRegex: function() {
              return new RegExp(e3, t3);
            } };
            return n3;
          }
          var g = /[^\w:]/g, v = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
          function x(e3, t3, n3) {
            if (e3) {
              var i2;
              try {
                i2 = decodeURIComponent(f(n3)).replace(g, "").toLowerCase();
              } catch (e4) {
                return null;
              }
              if (0 === i2.indexOf("javascript:") || 0 === i2.indexOf("vbscript:") || 0 === i2.indexOf("data:")) return null;
            }
            t3 && !v.test(n3) && (n3 = (function(e4, t4) {
              y[" " + e4] || (b.test(e4) ? y[" " + e4] = e4 + "/" : y[" " + e4] = F(e4, "/", true));
              var n4 = -1 === (e4 = y[" " + e4]).indexOf(":");
              return "//" === t4.substring(0, 2) ? n4 ? t4 : e4.replace(D, "$1") + t4 : "/" === t4.charAt(0) ? n4 ? t4 : e4.replace(C, "$1") + t4 : e4 + t4;
            })(t3, n3));
            try {
              n3 = encodeURI(n3).replace(/%25/g, "%");
            } catch (e4) {
              return null;
            }
            return n3;
          }
          var y = {}, b = /^[^:]+:\/*[^/]*$/, D = /^([^:]+:)[\s\S]*$/, C = /^([^:]+:\/*[^/]*)[\s\S]*$/;
          var w = { exec: function() {
          } };
          function k(e3) {
            for (var t3, n3, i2 = 1; i2 < arguments.length; i2++) for (n3 in t3 = arguments[i2]) Object.prototype.hasOwnProperty.call(t3, n3) && (e3[n3] = t3[n3]);
            return e3;
          }
          function S(e3, t3) {
            var n3 = e3.replace(/\|/g, (function(e4, t4, n4) {
              for (var i3 = false, r2 = t4; --r2 >= 0 && "\\" === n4[r2]; ) i3 = !i3;
              return i3 ? "|" : " |";
            })).split(/ \|/), i2 = 0;
            if (n3[0].trim() || n3.shift(), n3.length > 0 && !n3[n3.length - 1].trim() && n3.pop(), n3.length > t3) n3.splice(t3);
            else for (; n3.length < t3; ) n3.push("");
            for (; i2 < n3.length; i2++) n3[i2] = n3[i2].trim().replace(/\\\|/g, "|");
            return n3;
          }
          function F(e3, t3, n3) {
            var i2 = e3.length;
            if (0 === i2) return "";
            for (var r2 = 0; r2 < i2; ) {
              var o2 = e3.charAt(i2 - r2 - 1);
              if (o2 !== t3 || n3) {
                if (o2 === t3 || !n3) break;
                r2++;
              } else r2++;
            }
            return e3.slice(0, i2 - r2);
          }
          function A(e3) {
            e3 && e3.sanitize && !e3.silent && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
          }
          function E(e3, t3) {
            if (t3 < 1) return "";
            for (var n3 = ""; t3 > 1; ) 1 & t3 && (n3 += e3), t3 >>= 1, e3 += e3;
            return n3 + e3;
          }
          function L(e3, t3, n3, i2) {
            var r2 = t3.href, o2 = t3.title ? d(t3.title) : null, a2 = e3[1].replace(/\\([\[\]])/g, "$1");
            if ("!" !== e3[0].charAt(0)) {
              i2.state.inLink = true;
              var l2 = { type: "link", raw: n3, href: r2, title: o2, text: a2, tokens: i2.inlineTokens(a2) };
              return i2.state.inLink = false, l2;
            }
            return { type: "image", raw: n3, href: r2, title: o2, text: d(a2) };
          }
          var T = (function() {
            function t3(t4) {
              this.options = t4 || e2.defaults;
            }
            var n3 = t3.prototype;
            return n3.space = function(e3) {
              var t4 = this.rules.block.newline.exec(e3);
              if (t4 && t4[0].length > 0) return { type: "space", raw: t4[0] };
            }, n3.code = function(e3) {
              var t4 = this.rules.block.code.exec(e3);
              if (t4) {
                var n4 = t4[0].replace(/^ {1,4}/gm, "");
                return { type: "code", raw: t4[0], codeBlockStyle: "indented", text: this.options.pedantic ? n4 : F(n4, "\n") };
              }
            }, n3.fences = function(e3) {
              var t4 = this.rules.block.fences.exec(e3);
              if (t4) {
                var n4 = t4[0], i2 = (function(e4, t5) {
                  var n5 = e4.match(/^(\s+)(?:```)/);
                  if (null === n5) return t5;
                  var i3 = n5[1];
                  return t5.split("\n").map((function(e5) {
                    var t6 = e5.match(/^\s+/);
                    return null === t6 ? e5 : t6[0].length >= i3.length ? e5.slice(i3.length) : e5;
                  })).join("\n");
                })(n4, t4[3] || "");
                return { type: "code", raw: n4, lang: t4[2] ? t4[2].trim() : t4[2], text: i2 };
              }
            }, n3.heading = function(e3) {
              var t4 = this.rules.block.heading.exec(e3);
              if (t4) {
                var n4 = t4[2].trim();
                if (/#$/.test(n4)) {
                  var i2 = F(n4, "#");
                  this.options.pedantic ? n4 = i2.trim() : i2 && !/ $/.test(i2) || (n4 = i2.trim());
                }
                return { type: "heading", raw: t4[0], depth: t4[1].length, text: n4, tokens: this.lexer.inline(n4) };
              }
            }, n3.hr = function(e3) {
              var t4 = this.rules.block.hr.exec(e3);
              if (t4) return { type: "hr", raw: t4[0] };
            }, n3.blockquote = function(e3) {
              var t4 = this.rules.block.blockquote.exec(e3);
              if (t4) {
                var n4 = t4[0].replace(/^ *>[ \t]?/gm, "");
                return { type: "blockquote", raw: t4[0], tokens: this.lexer.blockTokens(n4, []), text: n4 };
              }
            }, n3.list = function(e3) {
              var t4 = this.rules.block.list.exec(e3);
              if (t4) {
                var n4, r2, o2, a2, l2, s2, u2, c2, d2, h2, f2, p2, m2 = t4[1].trim(), g2 = m2.length > 1, v2 = { type: "list", raw: "", ordered: g2, start: g2 ? +m2.slice(0, -1) : "", loose: false, items: [] };
                m2 = g2 ? "\\d{1,9}\\" + m2.slice(-1) : "\\" + m2, this.options.pedantic && (m2 = g2 ? m2 : "[*+-]");
                for (var x2 = new RegExp("^( {0,3}" + m2 + ")((?:[	 ][^\\n]*)?(?:\\n|$))"); e3 && (p2 = false, t4 = x2.exec(e3)) && !this.rules.block.hr.test(e3); ) {
                  if (n4 = t4[0], e3 = e3.substring(n4.length), c2 = t4[2].split("\n", 1)[0], d2 = e3.split("\n", 1)[0], this.options.pedantic ? (a2 = 2, f2 = c2.trimLeft()) : (a2 = (a2 = t4[2].search(/[^ ]/)) > 4 ? 1 : a2, f2 = c2.slice(a2), a2 += t4[1].length), s2 = false, !c2 && /^ *$/.test(d2) && (n4 += d2 + "\n", e3 = e3.substring(d2.length + 1), p2 = true), !p2) for (var y2 = new RegExp("^ {0," + Math.min(3, a2 - 1) + "}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))"), b2 = new RegExp("^ {0," + Math.min(3, a2 - 1) + "}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)"), D2 = new RegExp("^ {0," + Math.min(3, a2 - 1) + "}(?:```|~~~)"), C2 = new RegExp("^ {0," + Math.min(3, a2 - 1) + "}#"); e3 && (c2 = h2 = e3.split("\n", 1)[0], this.options.pedantic && (c2 = c2.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), !D2.test(c2)) && !C2.test(c2) && !y2.test(c2) && !b2.test(e3); ) {
                    if (c2.search(/[^ ]/) >= a2 || !c2.trim()) f2 += "\n" + c2.slice(a2);
                    else {
                      if (s2) break;
                      f2 += "\n" + c2;
                    }
                    s2 || c2.trim() || (s2 = true), n4 += h2 + "\n", e3 = e3.substring(h2.length + 1);
                  }
                  v2.loose || (u2 ? v2.loose = true : /\n *\n *$/.test(n4) && (u2 = true)), this.options.gfm && (r2 = /^\[[ xX]\] /.exec(f2)) && (o2 = "[ ] " !== r2[0], f2 = f2.replace(/^\[[ xX]\] +/, "")), v2.items.push({ type: "list_item", raw: n4, task: !!r2, checked: o2, loose: false, text: f2 }), v2.raw += n4;
                }
                v2.items[v2.items.length - 1].raw = n4.trimRight(), v2.items[v2.items.length - 1].text = f2.trimRight(), v2.raw = v2.raw.trimRight();
                var w2 = v2.items.length;
                for (l2 = 0; l2 < w2; l2++) {
                  this.lexer.state.top = false, v2.items[l2].tokens = this.lexer.blockTokens(v2.items[l2].text, []);
                  var k2 = v2.items[l2].tokens.filter((function(e4) {
                    return "space" === e4.type;
                  })), S2 = k2.every((function(e4) {
                    for (var t5, n5 = 0, r3 = i(e4.raw.split("")); !(t5 = r3()).done; ) {
                      if ("\n" === t5.value && (n5 += 1), n5 > 1) return true;
                    }
                    return false;
                  }));
                  !v2.loose && k2.length && S2 && (v2.loose = true, v2.items[l2].loose = true);
                }
                return v2;
              }
            }, n3.html = function(e3) {
              var t4 = this.rules.block.html.exec(e3);
              if (t4) {
                var n4 = { type: "html", raw: t4[0], pre: !this.options.sanitizer && ("pre" === t4[1] || "script" === t4[1] || "style" === t4[1]), text: t4[0] };
                if (this.options.sanitize) {
                  var i2 = this.options.sanitizer ? this.options.sanitizer(t4[0]) : d(t4[0]);
                  n4.type = "paragraph", n4.text = i2, n4.tokens = this.lexer.inline(i2);
                }
                return n4;
              }
            }, n3.def = function(e3) {
              var t4 = this.rules.block.def.exec(e3);
              if (t4) return t4[3] && (t4[3] = t4[3].substring(1, t4[3].length - 1)), { type: "def", tag: t4[1].toLowerCase().replace(/\s+/g, " "), raw: t4[0], href: t4[2], title: t4[3] };
            }, n3.table = function(e3) {
              var t4 = this.rules.block.table.exec(e3);
              if (t4) {
                var n4 = { type: "table", header: S(t4[1]).map((function(e4) {
                  return { text: e4 };
                })), align: t4[2].replace(/^ *|\| *$/g, "").split(/ *\| */), rows: t4[3] && t4[3].trim() ? t4[3].replace(/\n[ \t]*$/, "").split("\n") : [] };
                if (n4.header.length === n4.align.length) {
                  n4.raw = t4[0];
                  var i2, r2, o2, a2, l2 = n4.align.length;
                  for (i2 = 0; i2 < l2; i2++) /^ *-+: *$/.test(n4.align[i2]) ? n4.align[i2] = "right" : /^ *:-+: *$/.test(n4.align[i2]) ? n4.align[i2] = "center" : /^ *:-+ *$/.test(n4.align[i2]) ? n4.align[i2] = "left" : n4.align[i2] = null;
                  for (l2 = n4.rows.length, i2 = 0; i2 < l2; i2++) n4.rows[i2] = S(n4.rows[i2], n4.header.length).map((function(e4) {
                    return { text: e4 };
                  }));
                  for (l2 = n4.header.length, r2 = 0; r2 < l2; r2++) n4.header[r2].tokens = this.lexer.inline(n4.header[r2].text);
                  for (l2 = n4.rows.length, r2 = 0; r2 < l2; r2++) for (a2 = n4.rows[r2], o2 = 0; o2 < a2.length; o2++) a2[o2].tokens = this.lexer.inline(a2[o2].text);
                  return n4;
                }
              }
            }, n3.lheading = function(e3) {
              var t4 = this.rules.block.lheading.exec(e3);
              if (t4) return { type: "heading", raw: t4[0], depth: "=" === t4[2].charAt(0) ? 1 : 2, text: t4[1], tokens: this.lexer.inline(t4[1]) };
            }, n3.paragraph = function(e3) {
              var t4 = this.rules.block.paragraph.exec(e3);
              if (t4) {
                var n4 = "\n" === t4[1].charAt(t4[1].length - 1) ? t4[1].slice(0, -1) : t4[1];
                return { type: "paragraph", raw: t4[0], text: n4, tokens: this.lexer.inline(n4) };
              }
            }, n3.text = function(e3) {
              var t4 = this.rules.block.text.exec(e3);
              if (t4) return { type: "text", raw: t4[0], text: t4[0], tokens: this.lexer.inline(t4[0]) };
            }, n3.escape = function(e3) {
              var t4 = this.rules.inline.escape.exec(e3);
              if (t4) return { type: "escape", raw: t4[0], text: d(t4[1]) };
            }, n3.tag = function(e3) {
              var t4 = this.rules.inline.tag.exec(e3);
              if (t4) return !this.lexer.state.inLink && /^<a /i.test(t4[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && /^<\/a>/i.test(t4[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t4[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t4[0]) && (this.lexer.state.inRawBlock = false), { type: this.options.sanitize ? "text" : "html", raw: t4[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(t4[0]) : d(t4[0]) : t4[0] };
            }, n3.link = function(e3) {
              var t4 = this.rules.inline.link.exec(e3);
              if (t4) {
                var n4 = t4[2].trim();
                if (!this.options.pedantic && /^</.test(n4)) {
                  if (!/>$/.test(n4)) return;
                  var i2 = F(n4.slice(0, -1), "\\");
                  if ((n4.length - i2.length) % 2 == 0) return;
                } else {
                  var r2 = (function(e4, t5) {
                    if (-1 === e4.indexOf(t5[1])) return -1;
                    for (var n5 = e4.length, i3 = 0, r3 = 0; r3 < n5; r3++) if ("\\" === e4[r3]) r3++;
                    else if (e4[r3] === t5[0]) i3++;
                    else if (e4[r3] === t5[1] && --i3 < 0) return r3;
                    return -1;
                  })(t4[2], "()");
                  if (r2 > -1) {
                    var o2 = (0 === t4[0].indexOf("!") ? 5 : 4) + t4[1].length + r2;
                    t4[2] = t4[2].substring(0, r2), t4[0] = t4[0].substring(0, o2).trim(), t4[3] = "";
                  }
                }
                var a2 = t4[2], l2 = "";
                if (this.options.pedantic) {
                  var s2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(a2);
                  s2 && (a2 = s2[1], l2 = s2[3]);
                } else l2 = t4[3] ? t4[3].slice(1, -1) : "";
                return a2 = a2.trim(), /^</.test(a2) && (a2 = this.options.pedantic && !/>$/.test(n4) ? a2.slice(1) : a2.slice(1, -1)), L(t4, { href: a2 ? a2.replace(this.rules.inline._escapes, "$1") : a2, title: l2 ? l2.replace(this.rules.inline._escapes, "$1") : l2 }, t4[0], this.lexer);
              }
            }, n3.reflink = function(e3, t4) {
              var n4;
              if ((n4 = this.rules.inline.reflink.exec(e3)) || (n4 = this.rules.inline.nolink.exec(e3))) {
                var i2 = (n4[2] || n4[1]).replace(/\s+/g, " ");
                if (!(i2 = t4[i2.toLowerCase()]) || !i2.href) {
                  var r2 = n4[0].charAt(0);
                  return { type: "text", raw: r2, text: r2 };
                }
                return L(n4, i2, n4[0], this.lexer);
              }
            }, n3.emStrong = function(e3, t4, n4) {
              void 0 === n4 && (n4 = "");
              var i2 = this.rules.inline.emStrong.lDelim.exec(e3);
              if (i2 && (!i2[3] || !n4.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/))) {
                var r2 = i2[1] || i2[2] || "";
                if (!r2 || r2 && ("" === n4 || this.rules.inline.punctuation.exec(n4))) {
                  var o2, a2, l2 = i2[0].length - 1, s2 = l2, u2 = 0, c2 = "*" === i2[0][0] ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
                  for (c2.lastIndex = 0, t4 = t4.slice(-1 * e3.length + l2); null != (i2 = c2.exec(t4)); ) if (o2 = i2[1] || i2[2] || i2[3] || i2[4] || i2[5] || i2[6]) if (a2 = o2.length, i2[3] || i2[4]) s2 += a2;
                  else if (!((i2[5] || i2[6]) && l2 % 3) || (l2 + a2) % 3) {
                    if (!((s2 -= a2) > 0)) {
                      if (a2 = Math.min(a2, a2 + s2 + u2), Math.min(l2, a2) % 2) {
                        var d2 = e3.slice(1, l2 + i2.index + a2);
                        return { type: "em", raw: e3.slice(0, l2 + i2.index + a2 + 1), text: d2, tokens: this.lexer.inlineTokens(d2) };
                      }
                      var h2 = e3.slice(2, l2 + i2.index + a2 - 1);
                      return { type: "strong", raw: e3.slice(0, l2 + i2.index + a2 + 1), text: h2, tokens: this.lexer.inlineTokens(h2) };
                    }
                  } else u2 += a2;
                }
              }
            }, n3.codespan = function(e3) {
              var t4 = this.rules.inline.code.exec(e3);
              if (t4) {
                var n4 = t4[2].replace(/\n/g, " "), i2 = /[^ ]/.test(n4), r2 = /^ /.test(n4) && / $/.test(n4);
                return i2 && r2 && (n4 = n4.substring(1, n4.length - 1)), n4 = d(n4, true), { type: "codespan", raw: t4[0], text: n4 };
              }
            }, n3.br = function(e3) {
              var t4 = this.rules.inline.br.exec(e3);
              if (t4) return { type: "br", raw: t4[0] };
            }, n3.del = function(e3) {
              var t4 = this.rules.inline.del.exec(e3);
              if (t4) return { type: "del", raw: t4[0], text: t4[2], tokens: this.lexer.inlineTokens(t4[2]) };
            }, n3.autolink = function(e3, t4) {
              var n4, i2, r2 = this.rules.inline.autolink.exec(e3);
              if (r2) return i2 = "@" === r2[2] ? "mailto:" + (n4 = d(this.options.mangle ? t4(r2[1]) : r2[1])) : n4 = d(r2[1]), { type: "link", raw: r2[0], text: n4, href: i2, tokens: [{ type: "text", raw: n4, text: n4 }] };
            }, n3.url = function(e3, t4) {
              var n4;
              if (n4 = this.rules.inline.url.exec(e3)) {
                var i2, r2;
                if ("@" === n4[2]) r2 = "mailto:" + (i2 = d(this.options.mangle ? t4(n4[0]) : n4[0]));
                else {
                  var o2;
                  do {
                    o2 = n4[0], n4[0] = this.rules.inline._backpedal.exec(n4[0])[0];
                  } while (o2 !== n4[0]);
                  i2 = d(n4[0]), r2 = "www." === n4[1] ? "http://" + i2 : i2;
                }
                return { type: "link", raw: n4[0], text: i2, href: r2, tokens: [{ type: "text", raw: i2, text: i2 }] };
              }
            }, n3.inlineText = function(e3, t4) {
              var n4, i2 = this.rules.inline.text.exec(e3);
              if (i2) return n4 = this.lexer.state.inRawBlock ? this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(i2[0]) : d(i2[0]) : i2[0] : d(this.options.smartypants ? t4(i2[0]) : i2[0]), { type: "text", raw: i2[0], text: n4 };
            }, t3;
          })(), M = { newline: /^(?: *(?:\n|$))+/, code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/, hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/, list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/, html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", def: /^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/, table: w, lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/, _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, text: /^[^\n]+/, _label: /(?!\s*\])(?:\\.|[^\[\]\\])+/, _title: /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/ };
          M.def = m(M.def).replace("label", M._label).replace("title", M._title).getRegex(), M.bullet = /(?:[*+-]|\d{1,9}[.)])/, M.listItemStart = m(/^( *)(bull) */).replace("bull", M.bullet).getRegex(), M.list = m(M.list).replace(/bull/g, M.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + M.def.source + ")").getRegex(), M._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", M._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/, M.html = m(M.html, "i").replace("comment", M._comment).replace("tag", M._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), M.paragraph = m(M._paragraph).replace("hr", M.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", M._tag).getRegex(), M.blockquote = m(M.blockquote).replace("paragraph", M.paragraph).getRegex(), M.normal = k({}, M), M.gfm = k({}, M.normal, { table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)" }), M.gfm.table = m(M.gfm.table).replace("hr", M.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", M._tag).getRegex(), M.gfm.paragraph = m(M._paragraph).replace("hr", M.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", M.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", M._tag).getRegex(), M.pedantic = k({}, M.normal, { html: m(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", M._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: w, paragraph: m(M.normal._paragraph).replace("hr", M.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", M.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex() });
          var B = { escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/, url: w, tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/, reflink: /^!?\[(label)\]\[(ref)\]/, nolink: /^!?\[(ref)\](?:\[\])?/, reflinkSearch: "reflink|nolink(?!\\()", emStrong: { lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/, rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/, rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ }, code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, br: /^( {2,}|\\)\n(?!\s*$)/, del: w, text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, punctuation: /^([\spunctuation])/ };
          function N(e3) {
            return e3.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
          }
          function O(e3) {
            var t3, n3, i2 = "", r2 = e3.length;
            for (t3 = 0; t3 < r2; t3++) n3 = e3.charCodeAt(t3), Math.random() > 0.5 && (n3 = "x" + n3.toString(16)), i2 += "&#" + n3 + ";";
            return i2;
          }
          B._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~", B.punctuation = m(B.punctuation).replace(/punctuation/g, B._punctuation).getRegex(), B.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g, B.escapedEmSt = /\\\*|\\_/g, B._comment = m(M._comment).replace("(?:-->|$)", "-->").getRegex(), B.emStrong.lDelim = m(B.emStrong.lDelim).replace(/punct/g, B._punctuation).getRegex(), B.emStrong.rDelimAst = m(B.emStrong.rDelimAst, "g").replace(/punct/g, B._punctuation).getRegex(), B.emStrong.rDelimUnd = m(B.emStrong.rDelimUnd, "g").replace(/punct/g, B._punctuation).getRegex(), B._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g, B._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/, B._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/, B.autolink = m(B.autolink).replace("scheme", B._scheme).replace("email", B._email).getRegex(), B._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/, B.tag = m(B.tag).replace("comment", B._comment).replace("attribute", B._attribute).getRegex(), B._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, B._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/, B._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/, B.link = m(B.link).replace("label", B._label).replace("href", B._href).replace("title", B._title).getRegex(), B.reflink = m(B.reflink).replace("label", B._label).replace("ref", M._label).getRegex(), B.nolink = m(B.nolink).replace("ref", M._label).getRegex(), B.reflinkSearch = m(B.reflinkSearch, "g").replace("reflink", B.reflink).replace("nolink", B.nolink).getRegex(), B.normal = k({}, B), B.pedantic = k({}, B.normal, { strong: { start: /^__|\*\*/, middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/, endAst: /\*\*(?!\*)/g, endUnd: /__(?!_)/g }, em: { start: /^_|\*/, middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/, endAst: /\*(?!\*)/g, endUnd: /_(?!_)/g }, link: m(/^!?\[(label)\]\((.*?)\)/).replace("label", B._label).getRegex(), reflink: m(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", B._label).getRegex() }), B.gfm = k({}, B.normal, { escape: m(B.escape).replace("])", "~|])").getRegex(), _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/, url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/, text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/ }), B.gfm.url = m(B.gfm.url, "i").replace("email", B.gfm._extended_email).getRegex(), B.breaks = k({}, B.gfm, { br: m(B.br).replace("{2,}", "*").getRegex(), text: m(B.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() });
          var I = (function() {
            function n3(t3) {
              this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t3 || e2.defaults, this.options.tokenizer = this.options.tokenizer || new T(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
              var n4 = { block: M.normal, inline: B.normal };
              this.options.pedantic ? (n4.block = M.pedantic, n4.inline = B.pedantic) : this.options.gfm && (n4.block = M.gfm, this.options.breaks ? n4.inline = B.breaks : n4.inline = B.gfm), this.tokenizer.rules = n4;
            }
            n3.lex = function(e3, t3) {
              return new n3(t3).lex(e3);
            }, n3.lexInline = function(e3, t3) {
              return new n3(t3).inlineTokens(e3);
            };
            var i2, r2, o2, a2 = n3.prototype;
            return a2.lex = function(e3) {
              var t3;
              for (e3 = e3.replace(/\r\n|\r/g, "\n"), this.blockTokens(e3, this.tokens); t3 = this.inlineQueue.shift(); ) this.inlineTokens(t3.src, t3.tokens);
              return this.tokens;
            }, a2.blockTokens = function(e3, t3) {
              var n4, i3, r3, o3, a3 = this;
              for (void 0 === t3 && (t3 = []), e3 = this.options.pedantic ? e3.replace(/\t/g, "    ").replace(/^ +$/gm, "") : e3.replace(/^( *)(\t+)/gm, (function(e4, t4, n5) {
                return t4 + "    ".repeat(n5.length);
              })); e3; ) if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((function(i4) {
                return !!(n4 = i4.call({ lexer: a3 }, e3, t3)) && (e3 = e3.substring(n4.raw.length), t3.push(n4), true);
              })))) {
                if (n4 = this.tokenizer.space(e3)) e3 = e3.substring(n4.raw.length), 1 === n4.raw.length && t3.length > 0 ? t3[t3.length - 1].raw += "\n" : t3.push(n4);
                else if (n4 = this.tokenizer.code(e3)) e3 = e3.substring(n4.raw.length), !(i3 = t3[t3.length - 1]) || "paragraph" !== i3.type && "text" !== i3.type ? t3.push(n4) : (i3.raw += "\n" + n4.raw, i3.text += "\n" + n4.text, this.inlineQueue[this.inlineQueue.length - 1].src = i3.text);
                else if (n4 = this.tokenizer.fences(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (n4 = this.tokenizer.heading(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (n4 = this.tokenizer.hr(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (n4 = this.tokenizer.blockquote(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (n4 = this.tokenizer.list(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (n4 = this.tokenizer.html(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (n4 = this.tokenizer.def(e3)) e3 = e3.substring(n4.raw.length), !(i3 = t3[t3.length - 1]) || "paragraph" !== i3.type && "text" !== i3.type ? this.tokens.links[n4.tag] || (this.tokens.links[n4.tag] = { href: n4.href, title: n4.title }) : (i3.raw += "\n" + n4.raw, i3.text += "\n" + n4.raw, this.inlineQueue[this.inlineQueue.length - 1].src = i3.text);
                else if (n4 = this.tokenizer.table(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (n4 = this.tokenizer.lheading(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
                else if (r3 = e3, this.options.extensions && this.options.extensions.startBlock && (function() {
                  var t4 = 1 / 0, n5 = e3.slice(1), i4 = void 0;
                  a3.options.extensions.startBlock.forEach((function(e4) {
                    "number" == typeof (i4 = e4.call({ lexer: this }, n5)) && i4 >= 0 && (t4 = Math.min(t4, i4));
                  })), t4 < 1 / 0 && t4 >= 0 && (r3 = e3.substring(0, t4 + 1));
                })(), this.state.top && (n4 = this.tokenizer.paragraph(r3))) i3 = t3[t3.length - 1], o3 && "paragraph" === i3.type ? (i3.raw += "\n" + n4.raw, i3.text += "\n" + n4.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i3.text) : t3.push(n4), o3 = r3.length !== e3.length, e3 = e3.substring(n4.raw.length);
                else if (n4 = this.tokenizer.text(e3)) e3 = e3.substring(n4.raw.length), (i3 = t3[t3.length - 1]) && "text" === i3.type ? (i3.raw += "\n" + n4.raw, i3.text += "\n" + n4.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i3.text) : t3.push(n4);
                else if (e3) {
                  var l2 = "Infinite loop on byte: " + e3.charCodeAt(0);
                  if (this.options.silent) {
                    console.error(l2);
                    break;
                  }
                  throw new Error(l2);
                }
              }
              return this.state.top = true, t3;
            }, a2.inline = function(e3, t3) {
              return void 0 === t3 && (t3 = []), this.inlineQueue.push({ src: e3, tokens: t3 }), t3;
            }, a2.inlineTokens = function(e3, t3) {
              var n4, i3, r3, o3 = this;
              void 0 === t3 && (t3 = []);
              var a3, l2, s2, u2 = e3;
              if (this.tokens.links) {
                var c2 = Object.keys(this.tokens.links);
                if (c2.length > 0) for (; null != (a3 = this.tokenizer.rules.inline.reflinkSearch.exec(u2)); ) c2.includes(a3[0].slice(a3[0].lastIndexOf("[") + 1, -1)) && (u2 = u2.slice(0, a3.index) + "[" + E("a", a3[0].length - 2) + "]" + u2.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
              }
              for (; null != (a3 = this.tokenizer.rules.inline.blockSkip.exec(u2)); ) u2 = u2.slice(0, a3.index) + "[" + E("a", a3[0].length - 2) + "]" + u2.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
              for (; null != (a3 = this.tokenizer.rules.inline.escapedEmSt.exec(u2)); ) u2 = u2.slice(0, a3.index) + "++" + u2.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
              for (; e3; ) if (l2 || (s2 = ""), l2 = false, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((function(i4) {
                return !!(n4 = i4.call({ lexer: o3 }, e3, t3)) && (e3 = e3.substring(n4.raw.length), t3.push(n4), true);
              })))) if (n4 = this.tokenizer.escape(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
              else if (n4 = this.tokenizer.tag(e3)) e3 = e3.substring(n4.raw.length), (i3 = t3[t3.length - 1]) && "text" === n4.type && "text" === i3.type ? (i3.raw += n4.raw, i3.text += n4.text) : t3.push(n4);
              else if (n4 = this.tokenizer.link(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
              else if (n4 = this.tokenizer.reflink(e3, this.tokens.links)) e3 = e3.substring(n4.raw.length), (i3 = t3[t3.length - 1]) && "text" === n4.type && "text" === i3.type ? (i3.raw += n4.raw, i3.text += n4.text) : t3.push(n4);
              else if (n4 = this.tokenizer.emStrong(e3, u2, s2)) e3 = e3.substring(n4.raw.length), t3.push(n4);
              else if (n4 = this.tokenizer.codespan(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
              else if (n4 = this.tokenizer.br(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
              else if (n4 = this.tokenizer.del(e3)) e3 = e3.substring(n4.raw.length), t3.push(n4);
              else if (n4 = this.tokenizer.autolink(e3, O)) e3 = e3.substring(n4.raw.length), t3.push(n4);
              else if (this.state.inLink || !(n4 = this.tokenizer.url(e3, O))) {
                if (r3 = e3, this.options.extensions && this.options.extensions.startInline && (function() {
                  var t4 = 1 / 0, n5 = e3.slice(1), i4 = void 0;
                  o3.options.extensions.startInline.forEach((function(e4) {
                    "number" == typeof (i4 = e4.call({ lexer: this }, n5)) && i4 >= 0 && (t4 = Math.min(t4, i4));
                  })), t4 < 1 / 0 && t4 >= 0 && (r3 = e3.substring(0, t4 + 1));
                })(), n4 = this.tokenizer.inlineText(r3, N)) e3 = e3.substring(n4.raw.length), "_" !== n4.raw.slice(-1) && (s2 = n4.raw.slice(-1)), l2 = true, (i3 = t3[t3.length - 1]) && "text" === i3.type ? (i3.raw += n4.raw, i3.text += n4.text) : t3.push(n4);
                else if (e3) {
                  var d2 = "Infinite loop on byte: " + e3.charCodeAt(0);
                  if (this.options.silent) {
                    console.error(d2);
                    break;
                  }
                  throw new Error(d2);
                }
              } else e3 = e3.substring(n4.raw.length), t3.push(n4);
              return t3;
            }, i2 = n3, o2 = [{ key: "rules", get: function() {
              return { block: M, inline: B };
            } }], (r2 = null) && t2(i2.prototype, r2), o2 && t2(i2, o2), Object.defineProperty(i2, "prototype", { writable: false }), n3;
          })(), z = (function() {
            function t3(t4) {
              this.options = t4 || e2.defaults;
            }
            var n3 = t3.prototype;
            return n3.code = function(e3, t4, n4) {
              var i2 = (t4 || "").match(/\S*/)[0];
              if (this.options.highlight) {
                var r2 = this.options.highlight(e3, i2);
                null != r2 && r2 !== e3 && (n4 = true, e3 = r2);
              }
              return e3 = e3.replace(/\n$/, "") + "\n", i2 ? '<pre><code class="' + this.options.langPrefix + d(i2, true) + '">' + (n4 ? e3 : d(e3, true)) + "</code></pre>\n" : "<pre><code>" + (n4 ? e3 : d(e3, true)) + "</code></pre>\n";
            }, n3.blockquote = function(e3) {
              return "<blockquote>\n" + e3 + "</blockquote>\n";
            }, n3.html = function(e3) {
              return e3;
            }, n3.heading = function(e3, t4, n4, i2) {
              return this.options.headerIds ? "<h" + t4 + ' id="' + (this.options.headerPrefix + i2.slug(n4)) + '">' + e3 + "</h" + t4 + ">\n" : "<h" + t4 + ">" + e3 + "</h" + t4 + ">\n";
            }, n3.hr = function() {
              return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
            }, n3.list = function(e3, t4, n4) {
              var i2 = t4 ? "ol" : "ul";
              return "<" + i2 + (t4 && 1 !== n4 ? ' start="' + n4 + '"' : "") + ">\n" + e3 + "</" + i2 + ">\n";
            }, n3.listitem = function(e3) {
              return "<li>" + e3 + "</li>\n";
            }, n3.checkbox = function(e3) {
              return "<input " + (e3 ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
            }, n3.paragraph = function(e3) {
              return "<p>" + e3 + "</p>\n";
            }, n3.table = function(e3, t4) {
              return t4 && (t4 = "<tbody>" + t4 + "</tbody>"), "<table>\n<thead>\n" + e3 + "</thead>\n" + t4 + "</table>\n";
            }, n3.tablerow = function(e3) {
              return "<tr>\n" + e3 + "</tr>\n";
            }, n3.tablecell = function(e3, t4) {
              var n4 = t4.header ? "th" : "td";
              return (t4.align ? "<" + n4 + ' align="' + t4.align + '">' : "<" + n4 + ">") + e3 + "</" + n4 + ">\n";
            }, n3.strong = function(e3) {
              return "<strong>" + e3 + "</strong>";
            }, n3.em = function(e3) {
              return "<em>" + e3 + "</em>";
            }, n3.codespan = function(e3) {
              return "<code>" + e3 + "</code>";
            }, n3.br = function() {
              return this.options.xhtml ? "<br/>" : "<br>";
            }, n3.del = function(e3) {
              return "<del>" + e3 + "</del>";
            }, n3.link = function(e3, t4, n4) {
              if (null === (e3 = x(this.options.sanitize, this.options.baseUrl, e3))) return n4;
              var i2 = '<a href="' + d(e3) + '"';
              return t4 && (i2 += ' title="' + t4 + '"'), i2 += ">" + n4 + "</a>";
            }, n3.image = function(e3, t4, n4) {
              if (null === (e3 = x(this.options.sanitize, this.options.baseUrl, e3))) return n4;
              var i2 = '<img src="' + e3 + '" alt="' + n4 + '"';
              return t4 && (i2 += ' title="' + t4 + '"'), i2 += this.options.xhtml ? "/>" : ">";
            }, n3.text = function(e3) {
              return e3;
            }, t3;
          })(), H = (function() {
            function e3() {
            }
            var t3 = e3.prototype;
            return t3.strong = function(e4) {
              return e4;
            }, t3.em = function(e4) {
              return e4;
            }, t3.codespan = function(e4) {
              return e4;
            }, t3.del = function(e4) {
              return e4;
            }, t3.html = function(e4) {
              return e4;
            }, t3.text = function(e4) {
              return e4;
            }, t3.link = function(e4, t4, n3) {
              return "" + n3;
            }, t3.image = function(e4, t4, n3) {
              return "" + n3;
            }, t3.br = function() {
              return "";
            }, e3;
          })(), R = (function() {
            function e3() {
              this.seen = {};
            }
            var t3 = e3.prototype;
            return t3.serialize = function(e4) {
              return e4.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
            }, t3.getNextSafeSlug = function(e4, t4) {
              var n3 = e4, i2 = 0;
              if (this.seen.hasOwnProperty(n3)) {
                i2 = this.seen[e4];
                do {
                  n3 = e4 + "-" + ++i2;
                } while (this.seen.hasOwnProperty(n3));
              }
              return t4 || (this.seen[e4] = i2, this.seen[n3] = 0), n3;
            }, t3.slug = function(e4, t4) {
              void 0 === t4 && (t4 = {});
              var n3 = this.serialize(e4);
              return this.getNextSafeSlug(n3, t4.dryrun);
            }, e3;
          })(), P = (function() {
            function t3(t4) {
              this.options = t4 || e2.defaults, this.options.renderer = this.options.renderer || new z(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new H(), this.slugger = new R();
            }
            t3.parse = function(e3, n4) {
              return new t3(n4).parse(e3);
            }, t3.parseInline = function(e3, n4) {
              return new t3(n4).parseInline(e3);
            };
            var n3 = t3.prototype;
            return n3.parse = function(e3, t4) {
              void 0 === t4 && (t4 = true);
              var n4, i2, r2, o2, a2, l2, s2, u2, c2, d2, h2, p2, m2, g2, v2, x2, y2, b2, D2, C2 = "", w2 = e3.length;
              for (n4 = 0; n4 < w2; n4++) if (d2 = e3[n4], !(this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[d2.type]) || false === (D2 = this.options.extensions.renderers[d2.type].call({ parser: this }, d2)) && ["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(d2.type)) switch (d2.type) {
                case "space":
                  continue;
                case "hr":
                  C2 += this.renderer.hr();
                  continue;
                case "heading":
                  C2 += this.renderer.heading(this.parseInline(d2.tokens), d2.depth, f(this.parseInline(d2.tokens, this.textRenderer)), this.slugger);
                  continue;
                case "code":
                  C2 += this.renderer.code(d2.text, d2.lang, d2.escaped);
                  continue;
                case "table":
                  for (u2 = "", s2 = "", o2 = d2.header.length, i2 = 0; i2 < o2; i2++) s2 += this.renderer.tablecell(this.parseInline(d2.header[i2].tokens), { header: true, align: d2.align[i2] });
                  for (u2 += this.renderer.tablerow(s2), c2 = "", o2 = d2.rows.length, i2 = 0; i2 < o2; i2++) {
                    for (s2 = "", a2 = (l2 = d2.rows[i2]).length, r2 = 0; r2 < a2; r2++) s2 += this.renderer.tablecell(this.parseInline(l2[r2].tokens), { header: false, align: d2.align[r2] });
                    c2 += this.renderer.tablerow(s2);
                  }
                  C2 += this.renderer.table(u2, c2);
                  continue;
                case "blockquote":
                  c2 = this.parse(d2.tokens), C2 += this.renderer.blockquote(c2);
                  continue;
                case "list":
                  for (h2 = d2.ordered, p2 = d2.start, m2 = d2.loose, o2 = d2.items.length, c2 = "", i2 = 0; i2 < o2; i2++) x2 = (v2 = d2.items[i2]).checked, y2 = v2.task, g2 = "", v2.task && (b2 = this.renderer.checkbox(x2), m2 ? v2.tokens.length > 0 && "paragraph" === v2.tokens[0].type ? (v2.tokens[0].text = b2 + " " + v2.tokens[0].text, v2.tokens[0].tokens && v2.tokens[0].tokens.length > 0 && "text" === v2.tokens[0].tokens[0].type && (v2.tokens[0].tokens[0].text = b2 + " " + v2.tokens[0].tokens[0].text)) : v2.tokens.unshift({ type: "text", text: b2 }) : g2 += b2), g2 += this.parse(v2.tokens, m2), c2 += this.renderer.listitem(g2, y2, x2);
                  C2 += this.renderer.list(c2, h2, p2);
                  continue;
                case "html":
                  C2 += this.renderer.html(d2.text);
                  continue;
                case "paragraph":
                  C2 += this.renderer.paragraph(this.parseInline(d2.tokens));
                  continue;
                case "text":
                  for (c2 = d2.tokens ? this.parseInline(d2.tokens) : d2.text; n4 + 1 < w2 && "text" === e3[n4 + 1].type; ) c2 += "\n" + ((d2 = e3[++n4]).tokens ? this.parseInline(d2.tokens) : d2.text);
                  C2 += t4 ? this.renderer.paragraph(c2) : c2;
                  continue;
                default:
                  var k2 = 'Token with "' + d2.type + '" type was not found.';
                  if (this.options.silent) return void console.error(k2);
                  throw new Error(k2);
              }
              else C2 += D2 || "";
              return C2;
            }, n3.parseInline = function(e3, t4) {
              t4 = t4 || this.renderer;
              var n4, i2, r2, o2 = "", a2 = e3.length;
              for (n4 = 0; n4 < a2; n4++) if (i2 = e3[n4], !(this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[i2.type]) || false === (r2 = this.options.extensions.renderers[i2.type].call({ parser: this }, i2)) && ["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i2.type)) switch (i2.type) {
                case "escape":
                case "text":
                  o2 += t4.text(i2.text);
                  break;
                case "html":
                  o2 += t4.html(i2.text);
                  break;
                case "link":
                  o2 += t4.link(i2.href, i2.title, this.parseInline(i2.tokens, t4));
                  break;
                case "image":
                  o2 += t4.image(i2.href, i2.title, i2.text);
                  break;
                case "strong":
                  o2 += t4.strong(this.parseInline(i2.tokens, t4));
                  break;
                case "em":
                  o2 += t4.em(this.parseInline(i2.tokens, t4));
                  break;
                case "codespan":
                  o2 += t4.codespan(i2.text);
                  break;
                case "br":
                  o2 += t4.br();
                  break;
                case "del":
                  o2 += t4.del(this.parseInline(i2.tokens, t4));
                  break;
                default:
                  var l2 = 'Token with "' + i2.type + '" type was not found.';
                  if (this.options.silent) return void console.error(l2);
                  throw new Error(l2);
              }
              else o2 += r2 || "";
              return o2;
            }, t3;
          })();
          function _(e3, t3, n3) {
            if (null == e3) throw new Error("marked(): input parameter is undefined or null");
            if ("string" != typeof e3) throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e3) + ", string expected");
            if ("function" == typeof t3 && (n3 = t3, t3 = null), A(t3 = k({}, _.defaults, t3 || {})), n3) {
              var i2, r2 = t3.highlight;
              try {
                i2 = I.lex(e3, t3);
              } catch (e4) {
                return n3(e4);
              }
              var o2 = function(e4) {
                var o3;
                if (!e4) try {
                  t3.walkTokens && _.walkTokens(i2, t3.walkTokens), o3 = P.parse(i2, t3);
                } catch (t4) {
                  e4 = t4;
                }
                return t3.highlight = r2, e4 ? n3(e4) : n3(null, o3);
              };
              if (!r2 || r2.length < 3) return o2();
              if (delete t3.highlight, !i2.length) return o2();
              var a2 = 0;
              return _.walkTokens(i2, (function(e4) {
                "code" === e4.type && (a2++, setTimeout((function() {
                  r2(e4.text, e4.lang, (function(t4, n4) {
                    if (t4) return o2(t4);
                    null != n4 && n4 !== e4.text && (e4.text = n4, e4.escaped = true), 0 === --a2 && o2();
                  }));
                }), 0));
              })), void (0 === a2 && o2());
            }
            function l2(e4) {
              if (e4.message += "\nPlease report this to https://github.com/markedjs/marked.", t3.silent) return "<p>An error occurred:</p><pre>" + d(e4.message + "", true) + "</pre>";
              throw e4;
            }
            try {
              var s2 = I.lex(e3, t3);
              if (t3.walkTokens) {
                if (t3.async) return Promise.all(_.walkTokens(s2, t3.walkTokens)).then((function() {
                  return P.parse(s2, t3);
                })).catch(l2);
                _.walkTokens(s2, t3.walkTokens);
              }
              return P.parse(s2, t3);
            } catch (e4) {
              l2(e4);
            }
          }
          _.options = _.setOptions = function(t3) {
            var n3;
            return k(_.defaults, t3), n3 = _.defaults, e2.defaults = n3, _;
          }, _.getDefaults = r, _.defaults = e2.defaults, _.use = function() {
            for (var e3 = arguments.length, t3 = new Array(e3), n3 = 0; n3 < e3; n3++) t3[n3] = arguments[n3];
            var i2, r2 = k.apply(void 0, [{}].concat(t3)), o2 = _.defaults.extensions || { renderers: {}, childTokens: {} };
            t3.forEach((function(e4) {
              if (e4.extensions && (i2 = true, e4.extensions.forEach((function(e5) {
                if (!e5.name) throw new Error("extension name required");
                if (e5.renderer) {
                  var t5 = o2.renderers ? o2.renderers[e5.name] : null;
                  o2.renderers[e5.name] = t5 ? function() {
                    for (var n4 = arguments.length, i3 = new Array(n4), r3 = 0; r3 < n4; r3++) i3[r3] = arguments[r3];
                    var o3 = e5.renderer.apply(this, i3);
                    return false === o3 && (o3 = t5.apply(this, i3)), o3;
                  } : e5.renderer;
                }
                if (e5.tokenizer) {
                  if (!e5.level || "block" !== e5.level && "inline" !== e5.level) throw new Error("extension level must be 'block' or 'inline'");
                  o2[e5.level] ? o2[e5.level].unshift(e5.tokenizer) : o2[e5.level] = [e5.tokenizer], e5.start && ("block" === e5.level ? o2.startBlock ? o2.startBlock.push(e5.start) : o2.startBlock = [e5.start] : "inline" === e5.level && (o2.startInline ? o2.startInline.push(e5.start) : o2.startInline = [e5.start]));
                }
                e5.childTokens && (o2.childTokens[e5.name] = e5.childTokens);
              }))), e4.renderer && (function() {
                var t5 = _.defaults.renderer || new z(), n4 = function(n5) {
                  var i4 = t5[n5];
                  t5[n5] = function() {
                    for (var r3 = arguments.length, o3 = new Array(r3), a2 = 0; a2 < r3; a2++) o3[a2] = arguments[a2];
                    var l2 = e4.renderer[n5].apply(t5, o3);
                    return false === l2 && (l2 = i4.apply(t5, o3)), l2;
                  };
                };
                for (var i3 in e4.renderer) n4(i3);
                r2.renderer = t5;
              })(), e4.tokenizer && (function() {
                var t5 = _.defaults.tokenizer || new T(), n4 = function(n5) {
                  var i4 = t5[n5];
                  t5[n5] = function() {
                    for (var r3 = arguments.length, o3 = new Array(r3), a2 = 0; a2 < r3; a2++) o3[a2] = arguments[a2];
                    var l2 = e4.tokenizer[n5].apply(t5, o3);
                    return false === l2 && (l2 = i4.apply(t5, o3)), l2;
                  };
                };
                for (var i3 in e4.tokenizer) n4(i3);
                r2.tokenizer = t5;
              })(), e4.walkTokens) {
                var t4 = _.defaults.walkTokens;
                r2.walkTokens = function(n4) {
                  var i3 = [];
                  return i3.push(e4.walkTokens.call(this, n4)), t4 && (i3 = i3.concat(t4.call(this, n4))), i3;
                };
              }
              i2 && (r2.extensions = o2), _.setOptions(r2);
            }));
          }, _.walkTokens = function(e3, t3) {
            for (var n3, r2 = [], o2 = function() {
              var e4 = n3.value;
              switch (r2 = r2.concat(t3.call(_, e4)), e4.type) {
                case "table":
                  for (var o3, a3 = i(e4.header); !(o3 = a3()).done; ) {
                    var l2 = o3.value;
                    r2 = r2.concat(_.walkTokens(l2.tokens, t3));
                  }
                  for (var s2, u2 = i(e4.rows); !(s2 = u2()).done; ) for (var c2, d2 = i(s2.value); !(c2 = d2()).done; ) {
                    var h2 = c2.value;
                    r2 = r2.concat(_.walkTokens(h2.tokens, t3));
                  }
                  break;
                case "list":
                  r2 = r2.concat(_.walkTokens(e4.items, t3));
                  break;
                default:
                  _.defaults.extensions && _.defaults.extensions.childTokens && _.defaults.extensions.childTokens[e4.type] ? _.defaults.extensions.childTokens[e4.type].forEach((function(n4) {
                    r2 = r2.concat(_.walkTokens(e4[n4], t3));
                  })) : e4.tokens && (r2 = r2.concat(_.walkTokens(e4.tokens, t3)));
              }
            }, a2 = i(e3); !(n3 = a2()).done; ) o2();
            return r2;
          }, _.parseInline = function(e3, t3) {
            if (null == e3) throw new Error("marked.parseInline(): input parameter is undefined or null");
            if ("string" != typeof e3) throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(e3) + ", string expected");
            A(t3 = k({}, _.defaults, t3 || {}));
            try {
              var n3 = I.lexInline(e3, t3);
              return t3.walkTokens && _.walkTokens(n3, t3.walkTokens), P.parseInline(n3, t3);
            } catch (e4) {
              if (e4.message += "\nPlease report this to https://github.com/markedjs/marked.", t3.silent) return "<p>An error occurred:</p><pre>" + d(e4.message + "", true) + "</pre>";
              throw e4;
            }
          }, _.Parser = P, _.parser = P.parse, _.Renderer = z, _.TextRenderer = H, _.Lexer = I, _.lexer = I.lex, _.Tokenizer = T, _.Slugger = R, _.parse = _;
          var W = _.options, j = _.setOptions, q = _.use, U = _.walkTokens, $ = _.parseInline, G = _, V = P.parse, X = I.lex;
          e2.Lexer = I, e2.Parser = P, e2.Renderer = z, e2.Slugger = R, e2.TextRenderer = H, e2.Tokenizer = T, e2.getDefaults = r, e2.lexer = X, e2.marked = _, e2.options = W, e2.parse = G, e2.parseInline = $, e2.parser = V, e2.setOptions = j, e2.use = q, e2.walkTokens = U, Object.defineProperty(e2, "__esModule", { value: true });
        }));
      }, {}], 16: [function(e, t, n) {
        (function(n2) {
          (function() {
            var i;
            !(function() {
              "use strict";
              (i = function(e2, t2, i2, r) {
                r = r || {}, this.dictionary = null, this.rules = {}, this.dictionaryTable = {}, this.compoundRules = [], this.compoundRuleCodes = {}, this.replacementTable = [], this.flags = r.flags || {}, this.memoized = {}, this.loaded = false;
                var o, a, l, s, u, c = this;
                function d(e3, t3) {
                  var n3 = c._readFile(e3, null, r.asyncLoad);
                  r.asyncLoad ? n3.then((function(e4) {
                    t3(e4);
                  })) : t3(n3);
                }
                function h(e3) {
                  t2 = e3, i2 && p();
                }
                function f(e3) {
                  i2 = e3, t2 && p();
                }
                function p() {
                  for (c.rules = c._parseAFF(t2), c.compoundRuleCodes = {}, a = 0, s = c.compoundRules.length; a < s; a++) {
                    var e3 = c.compoundRules[a];
                    for (l = 0, u = e3.length; l < u; l++) c.compoundRuleCodes[e3[l]] = [];
                  }
                  for (a in "ONLYINCOMPOUND" in c.flags && (c.compoundRuleCodes[c.flags.ONLYINCOMPOUND] = []), c.dictionaryTable = c._parseDIC(i2), c.compoundRuleCodes) 0 === c.compoundRuleCodes[a].length && delete c.compoundRuleCodes[a];
                  for (a = 0, s = c.compoundRules.length; a < s; a++) {
                    var n3 = c.compoundRules[a], o2 = "";
                    for (l = 0, u = n3.length; l < u; l++) {
                      var d2 = n3[l];
                      d2 in c.compoundRuleCodes ? o2 += "(" + c.compoundRuleCodes[d2].join("|") + ")" : o2 += d2;
                    }
                    c.compoundRules[a] = new RegExp(o2, "i");
                  }
                  c.loaded = true, r.asyncLoad && r.loadedCallback && r.loadedCallback(c);
                }
                return e2 && (c.dictionary = e2, t2 && i2 ? p() : "undefined" != typeof window && "chrome" in window && "extension" in window.chrome && "getURL" in window.chrome.extension ? (o = r.dictionaryPath ? r.dictionaryPath : "typo/dictionaries", t2 || d(chrome.extension.getURL(o + "/" + e2 + "/" + e2 + ".aff"), h), i2 || d(chrome.extension.getURL(o + "/" + e2 + "/" + e2 + ".dic"), f)) : (o = r.dictionaryPath ? r.dictionaryPath : void 0 !== n2 ? n2 + "/dictionaries" : "./dictionaries", t2 || d(o + "/" + e2 + "/" + e2 + ".aff", h), i2 || d(o + "/" + e2 + "/" + e2 + ".dic", f))), this;
              }).prototype = { load: function(e2) {
                for (var t2 in e2) e2.hasOwnProperty(t2) && (this[t2] = e2[t2]);
                return this;
              }, _readFile: function(t2, n3, i2) {
                if (n3 = n3 || "utf8", "undefined" != typeof XMLHttpRequest) {
                  var r, o = new XMLHttpRequest();
                  return o.open("GET", t2, i2), i2 && (r = new Promise((function(e2, t3) {
                    o.onload = function() {
                      200 === o.status ? e2(o.responseText) : t3(o.statusText);
                    }, o.onerror = function() {
                      t3(o.statusText);
                    };
                  }))), o.overrideMimeType && o.overrideMimeType("text/plain; charset=" + n3), o.send(null), i2 ? r : o.responseText;
                }
                if (void 0 !== e) {
                  var a = e("fs");
                  try {
                    if (a.existsSync(t2)) return a.readFileSync(t2, n3);
                    console.log("Path " + t2 + " does not exist.");
                  } catch (e2) {
                    return console.log(e2), "";
                  }
                }
              }, _parseAFF: function(e2) {
                var t2, n3, i2, r, o, a, l, s = {}, u = e2.split(/\r?\n/);
                for (r = 0, a = u.length; r < a; r++) if (t2 = (t2 = this._removeAffixComments(u[r])).trim()) {
                  var c = t2.split(/\s+/), d = c[0];
                  if ("PFX" == d || "SFX" == d) {
                    var h = c[1], f = c[2], p = [];
                    for (o = r + 1, l = r + 1 + (n3 = parseInt(c[3], 10)); o < l; o++) {
                      var m = (i2 = u[o].split(/\s+/))[2], g = i2[3].split("/"), v = g[0];
                      "0" === v && (v = "");
                      var x = this.parseRuleCodes(g[1]), y = i2[4], b = {};
                      b.add = v, x.length > 0 && (b.continuationClasses = x), "." !== y && (b.match = "SFX" === d ? new RegExp(y + "$") : new RegExp("^" + y)), "0" != m && (b.remove = "SFX" === d ? new RegExp(m + "$") : m), p.push(b);
                    }
                    s[h] = { type: d, combineable: "Y" == f, entries: p }, r += n3;
                  } else if ("COMPOUNDRULE" === d) {
                    for (o = r + 1, l = r + 1 + (n3 = parseInt(c[1], 10)); o < l; o++) i2 = (t2 = u[o]).split(/\s+/), this.compoundRules.push(i2[1]);
                    r += n3;
                  } else "REP" === d ? 3 === (i2 = t2.split(/\s+/)).length && this.replacementTable.push([i2[1], i2[2]]) : this.flags[d] = c[1];
                }
                return s;
              }, _removeAffixComments: function(e2) {
                return e2.match(/^\s*#/, "") ? "" : e2;
              }, _parseDIC: function(e2) {
                var t2 = (e2 = this._removeDicComments(e2)).split(/\r?\n/), n3 = {};
                function i2(e3, t3) {
                  n3.hasOwnProperty(e3) || (n3[e3] = null), t3.length > 0 && (null === n3[e3] && (n3[e3] = []), n3[e3].push(t3));
                }
                for (var r = 1, o = t2.length; r < o; r++) {
                  var a = t2[r];
                  if (a) {
                    var l = a.split("/", 2), s = l[0];
                    if (l.length > 1) {
                      var u = this.parseRuleCodes(l[1]);
                      "NEEDAFFIX" in this.flags && -1 != u.indexOf(this.flags.NEEDAFFIX) || i2(s, u);
                      for (var c = 0, d = u.length; c < d; c++) {
                        var h = u[c], f = this.rules[h];
                        if (f) for (var p = this._applyRule(s, f), m = 0, g = p.length; m < g; m++) {
                          var v = p[m];
                          if (i2(v, []), f.combineable) for (var x = c + 1; x < d; x++) {
                            var y = u[x], b = this.rules[y];
                            if (b && b.combineable && f.type != b.type) for (var D = this._applyRule(v, b), C = 0, w = D.length; C < w; C++) {
                              i2(D[C], []);
                            }
                          }
                        }
                        h in this.compoundRuleCodes && this.compoundRuleCodes[h].push(s);
                      }
                    } else i2(s.trim(), []);
                  }
                }
                return n3;
              }, _removeDicComments: function(e2) {
                return e2 = e2.replace(/^\t.*$/gm, "");
              }, parseRuleCodes: function(e2) {
                if (e2) {
                  if ("FLAG" in this.flags) {
                    if ("long" === this.flags.FLAG) {
                      for (var t2 = [], n3 = 0, i2 = e2.length; n3 < i2; n3 += 2) t2.push(e2.substr(n3, 2));
                      return t2;
                    }
                    return "num" === this.flags.FLAG ? e2.split(",") : "UTF-8" === this.flags.FLAG ? Array.from(e2) : e2.split("");
                  }
                  return e2.split("");
                }
                return [];
              }, _applyRule: function(e2, t2) {
                for (var n3 = t2.entries, i2 = [], r = 0, o = n3.length; r < o; r++) {
                  var a = n3[r];
                  if (!a.match || e2.match(a.match)) {
                    var l = e2;
                    if (a.remove && (l = l.replace(a.remove, "")), "SFX" === t2.type ? l += a.add : l = a.add + l, i2.push(l), "continuationClasses" in a) for (var s = 0, u = a.continuationClasses.length; s < u; s++) {
                      var c = this.rules[a.continuationClasses[s]];
                      c && (i2 = i2.concat(this._applyRule(l, c)));
                    }
                  }
                }
                return i2;
              }, check: function(e2) {
                if (!this.loaded) throw "Dictionary not loaded.";
                var t2 = e2.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
                if (this.checkExact(t2)) return true;
                if (t2.toUpperCase() === t2) {
                  var n3 = t2[0] + t2.substring(1).toLowerCase();
                  if (this.hasFlag(n3, "KEEPCASE")) return false;
                  if (this.checkExact(n3)) return true;
                  if (this.checkExact(t2.toLowerCase())) return true;
                }
                var i2 = t2[0].toLowerCase() + t2.substring(1);
                if (i2 !== t2) {
                  if (this.hasFlag(i2, "KEEPCASE")) return false;
                  if (this.checkExact(i2)) return true;
                }
                return false;
              }, checkExact: function(e2) {
                if (!this.loaded) throw "Dictionary not loaded.";
                var t2, n3, i2 = this.dictionaryTable[e2];
                if (void 0 === i2) {
                  if ("COMPOUNDMIN" in this.flags && e2.length >= this.flags.COMPOUNDMIN) {
                    for (t2 = 0, n3 = this.compoundRules.length; t2 < n3; t2++) if (e2.match(this.compoundRules[t2])) return true;
                  }
                } else {
                  if (null === i2) return true;
                  if ("object" == typeof i2) {
                    for (t2 = 0, n3 = i2.length; t2 < n3; t2++) if (!this.hasFlag(e2, "ONLYINCOMPOUND", i2[t2])) return true;
                  }
                }
                return false;
              }, hasFlag: function(e2, t2, n3) {
                if (!this.loaded) throw "Dictionary not loaded.";
                return !(!(t2 in this.flags) || (void 0 === n3 && (n3 = Array.prototype.concat.apply([], this.dictionaryTable[e2])), !n3 || -1 === n3.indexOf(this.flags[t2])));
              }, alphabet: "", suggest: function(e2, t2) {
                if (!this.loaded) throw "Dictionary not loaded.";
                if (t2 = t2 || 5, this.memoized.hasOwnProperty(e2)) {
                  var n3 = this.memoized[e2].limit;
                  if (t2 <= n3 || this.memoized[e2].suggestions.length < n3) return this.memoized[e2].suggestions.slice(0, t2);
                }
                if (this.check(e2)) return [];
                for (var i2 = 0, r = this.replacementTable.length; i2 < r; i2++) {
                  var o = this.replacementTable[i2];
                  if (-1 !== e2.indexOf(o[0])) {
                    var a = e2.replace(o[0], o[1]);
                    if (this.check(a)) return [a];
                  }
                }
                var l = this;
                function s(e3, t3) {
                  var n4, i3, r2, o2, a2 = {}, s2 = l.alphabet.length;
                  if ("string" == typeof e3) {
                    var u = e3;
                    (e3 = {})[u] = true;
                  }
                  for (var u in e3) for (n4 = 0, r2 = u.length + 1; n4 < r2; n4++) {
                    var c = [u.substring(0, n4), u.substring(n4)];
                    if (c[1] && (o2 = c[0] + c[1].substring(1), t3 && !l.check(o2) || (o2 in a2 ? a2[o2] += 1 : a2[o2] = 1)), c[1].length > 1 && c[1][1] !== c[1][0] && (o2 = c[0] + c[1][1] + c[1][0] + c[1].substring(2), t3 && !l.check(o2) || (o2 in a2 ? a2[o2] += 1 : a2[o2] = 1)), c[1]) {
                      var d = c[1].substring(0, 1).toUpperCase() === c[1].substring(0, 1) ? "uppercase" : "lowercase";
                      for (i3 = 0; i3 < s2; i3++) {
                        var h = l.alphabet[i3];
                        "uppercase" === d && (h = h.toUpperCase()), h != c[1].substring(0, 1) && (o2 = c[0] + h + c[1].substring(1), t3 && !l.check(o2) || (o2 in a2 ? a2[o2] += 1 : a2[o2] = 1));
                      }
                    }
                    if (c[1]) for (i3 = 0; i3 < s2; i3++) {
                      d = c[0].substring(-1).toUpperCase() === c[0].substring(-1) && c[1].substring(0, 1).toUpperCase() === c[1].substring(0, 1) ? "uppercase" : "lowercase", h = l.alphabet[i3];
                      "uppercase" === d && (h = h.toUpperCase()), o2 = c[0] + h + c[1], t3 && !l.check(o2) || (o2 in a2 ? a2[o2] += 1 : a2[o2] = 1);
                    }
                  }
                  return a2;
                }
                return l.alphabet = "abcdefghijklmnopqrstuvwxyz", this.memoized[e2] = { suggestions: (function(e3) {
                  var n4, i3 = s(e3), r2 = s(i3, true);
                  for (var o2 in i3) l.check(o2) && (o2 in r2 ? r2[o2] += i3[o2] : r2[o2] = i3[o2]);
                  var a2 = [];
                  for (n4 in r2) r2.hasOwnProperty(n4) && a2.push([n4, r2[n4]]);
                  a2.sort((function(e4, t3) {
                    var n5 = e4[1], i4 = t3[1];
                    return n5 < i4 ? -1 : n5 > i4 ? 1 : t3[0].localeCompare(e4[0]);
                  })).reverse();
                  var u = [], c = "lowercase";
                  e3.toUpperCase() === e3 ? c = "uppercase" : e3.substr(0, 1).toUpperCase() + e3.substr(1).toLowerCase() === e3 && (c = "capitalized");
                  var d = t2;
                  for (n4 = 0; n4 < Math.min(d, a2.length); n4++) "uppercase" === c ? a2[n4][0] = a2[n4][0].toUpperCase() : "capitalized" === c && (a2[n4][0] = a2[n4][0].substr(0, 1).toUpperCase() + a2[n4][0].substr(1)), l.hasFlag(a2[n4][0], "NOSUGGEST") || -1 != u.indexOf(a2[n4][0]) ? d++ : u.push(a2[n4][0]);
                  return u;
                })(e2), limit: t2 }, this.memoized[e2].suggestions;
              } };
            })(), void 0 !== t && (t.exports = i);
          }).call(this);
        }).call(this, "/node_modules/typo-js");
      }, { fs: 1 }], 17: [function(e, t, n) {
        var i = e("codemirror");
        i.commands.tabAndIndentMarkdownList = function(e2) {
          var t2 = e2.listSelections()[0].head;
          if (false !== e2.getStateAfter(t2.line).list) e2.execCommand("indentMore");
          else if (e2.options.indentWithTabs) e2.execCommand("insertTab");
          else {
            var n2 = Array(e2.options.tabSize + 1).join(" ");
            e2.replaceSelection(n2);
          }
        }, i.commands.shiftTabAndUnindentMarkdownList = function(e2) {
          var t2 = e2.listSelections()[0].head;
          if (false !== e2.getStateAfter(t2.line).list) e2.execCommand("indentLess");
          else if (e2.options.indentWithTabs) e2.execCommand("insertTab");
          else {
            var n2 = Array(e2.options.tabSize + 1).join(" ");
            e2.replaceSelection(n2);
          }
        };
      }, { codemirror: 10 }], 18: [function(e, t, n) {
        "use strict";
        var i = e("codemirror");
        e("codemirror/addon/edit/continuelist.js"), e("./codemirror/tablist"), e("codemirror/addon/display/fullscreen.js"), e("codemirror/mode/markdown/markdown.js"), e("codemirror/addon/mode/overlay.js"), e("codemirror/addon/display/placeholder.js"), e("codemirror/addon/display/autorefresh.js"), e("codemirror/addon/selection/mark-selection.js"), e("codemirror/addon/search/searchcursor.js"), e("codemirror/mode/gfm/gfm.js"), e("codemirror/mode/xml/xml.js");
        var r = e("codemirror-spell-checker"), o = e("marked").marked, a = /Mac/.test(navigator.platform), l = new RegExp(/(<a.*?https?:\/\/.*?[^a]>)+?/g), s = { toggleBold: x, toggleItalic: y, drawLink: I, toggleHeadingSmaller: w, toggleHeadingBigger: k, drawImage: z, toggleBlockquote: C, toggleOrderedList: B, toggleUnorderedList: M, toggleCheckList: N, toggleCodeBlock: D, togglePreview: $, toggleStrikethrough: b, toggleHeading1: S, toggleHeading2: F, toggleHeading3: A, toggleHeading4: E, toggleHeading5: L, toggleHeading6: T, cleanBlock: O, drawTable: _, drawHorizontalRule: W, undo: j, redo: q, toggleSideBySide: U, toggleFullScreen: v }, u = { toggleBold: "Cmd-B", toggleItalic: "Cmd-I", drawLink: "Cmd-K", toggleHeadingSmaller: "Cmd-H", toggleHeadingBigger: "Shift-Cmd-H", toggleHeading1: "Ctrl+Alt+1", toggleHeading2: "Ctrl+Alt+2", toggleHeading3: "Ctrl+Alt+3", toggleHeading4: "Ctrl+Alt+4", toggleHeading5: "Ctrl+Alt+5", toggleHeading6: "Ctrl+Alt+6", cleanBlock: "Cmd-E", drawImage: "Cmd-Alt-I", toggleBlockquote: "Cmd-'", toggleOrderedList: "Cmd-Alt-L", toggleUnorderedList: "Cmd-L", toggleCheckList: "Shift-Cmd-L", toggleCodeBlock: "Cmd-Alt-C", togglePreview: "Cmd-P", toggleSideBySide: "F9", toggleFullScreen: "F11" }, c = function() {
          var e2, t2 = false;
          return e2 = navigator.userAgent || navigator.vendor || window.opera, (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e2) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(e2.substr(0, 4))) && (t2 = true), t2;
        };
        function d(e2) {
          return e2 = a ? e2.replace("Ctrl", "Cmd") : e2.replace("Cmd", "Ctrl");
        }
        function h(e2, t2, n2, i2) {
          var r2 = f(e2, false, t2, n2, "button", i2);
          r2.classList.add("easymde-dropdown"), r2.onclick = function() {
            r2.focus();
          };
          var o2 = document.createElement("div");
          o2.className = "easymde-dropdown-content";
          for (var a2 = 0; a2 < e2.children.length; a2++) {
            var l2, s2 = e2.children[a2];
            (l2 = f("string" == typeof s2 && s2 in ne ? ne[s2] : s2, true, t2, n2, "button", i2)).addEventListener("click", (function(e3) {
              e3.stopPropagation();
            }), false), o2.appendChild(l2);
          }
          return r2.appendChild(o2), r2;
        }
        function f(e2, t2, n2, i2, r2, o2) {
          e2 = e2 || {};
          var l2 = document.createElement(r2);
          if (e2.attributes) for (var u2 in e2.attributes) Object.prototype.hasOwnProperty.call(e2.attributes, u2) && l2.setAttribute(u2, e2.attributes[u2]);
          var c2 = o2.options.toolbarButtonClassPrefix ? o2.options.toolbarButtonClassPrefix + "-" : "";
          l2.className = c2 + e2.name, l2.setAttribute("type", r2), n2 = null == n2 || n2, e2.text && (l2.innerText = e2.text), e2.name && e2.name in i2 && (s[e2.name] = e2.action), e2.title && n2 && (l2.title = (function(e3, t3, n3) {
            var i3, r3 = e3;
            t3 && n3[i3 = (function(e4) {
              for (var t4 in s) if (s[t4] === e4) return t4;
              return null;
            })(t3)] && (r3 += " (" + d(n3[i3]) + ")");
            return r3;
          })(e2.title, e2.action, i2), a && (l2.title = l2.title.replace("Ctrl", "\u2318"), l2.title = l2.title.replace("Alt", "\u2325"))), e2.title && l2.setAttribute("aria-label", e2.title), e2.noDisable && l2.classList.add("no-disable"), e2.noMobile && l2.classList.add("no-mobile");
          var h2 = [];
          void 0 !== e2.className && (h2 = e2.className.split(" "));
          for (var f2 = [], p2 = 0; p2 < h2.length; p2++) {
            var m2 = h2[p2];
            m2.match(/^fa([srlb]|(-[\w-]*)|$)/) ? f2.push(m2) : l2.classList.add(m2);
          }
          if (l2.tabIndex = -1, f2.length > 0) {
            for (var g2 = document.createElement("i"), v2 = 0; v2 < f2.length; v2++) {
              var x2 = f2[v2];
              g2.classList.add(x2);
            }
            l2.appendChild(g2);
          }
          return void 0 !== e2.icon && (l2.innerHTML = e2.icon), e2.action && t2 && ("function" == typeof e2.action ? l2.onclick = function(t3) {
            t3.preventDefault(), e2.action(o2);
          } : "string" == typeof e2.action && (l2.onclick = function(t3) {
            t3.preventDefault(), window.open(e2.action, "_blank");
          })), l2;
        }
        function p() {
          var e2 = document.createElement("i");
          return e2.className = "separator", e2.innerHTML = "|", e2;
        }
        function m(e2, t2) {
          t2 = t2 || e2.getCursor("start");
          var n2 = e2.getTokenAt(t2);
          if (!n2.type) return {};
          for (var i2, r2, o2 = n2.type.split(" "), a2 = {}, l2 = 0; l2 < o2.length; l2++) "strong" === (i2 = o2[l2]) ? a2.bold = true : "variable-2" === i2 ? (r2 = e2.getLine(t2.line), /^\s*\d+\.\s/.test(r2) ? a2["ordered-list"] = true : /^\s*- \[[ xX]]\s/.test(r2) ? a2["check-list"] = true : a2["unordered-list"] = true) : "atom" === i2 ? a2.quote = true : "em" === i2 ? a2.italic = true : "quote" === i2 ? a2.quote = true : "strikethrough" === i2 ? a2.strikethrough = true : "comment" === i2 ? a2.code = true : "link" !== i2 || a2.image ? "image" === i2 ? a2.image = true : i2.match(/^header(-[1-6])?$/) && (a2[i2.replace("header", "heading")] = true) : a2.link = true;
          return a2;
        }
        var g = "";
        function v(e2) {
          var t2 = e2.codemirror;
          t2.setOption("fullScreen", !t2.getOption("fullScreen")), t2.getOption("fullScreen") ? (g = document.body.style.overflow, document.body.style.overflow = "hidden") : document.body.style.overflow = g;
          var n2 = t2.getWrapperElement(), i2 = n2.nextSibling;
          if (i2.classList.contains("editor-preview-active-side")) if (false === e2.options.sideBySideFullscreen) {
            var r2 = n2.parentNode;
            t2.getOption("fullScreen") ? r2.classList.remove("sided--no-fullscreen") : r2.classList.add("sided--no-fullscreen");
          } else U(e2);
          (e2.options.onToggleFullScreen && e2.options.onToggleFullScreen(t2.getOption("fullScreen") || false), void 0 !== e2.options.maxHeight && (t2.getOption("fullScreen") ? (t2.getScrollerElement().style.removeProperty("height"), i2.style.removeProperty("height")) : (t2.getScrollerElement().style.height = e2.options.maxHeight, e2.setPreviewMaxHeight())), e2.toolbar_div.classList.toggle("fullscreen"), e2.toolbarElements && e2.toolbarElements.fullscreen) && e2.toolbarElements.fullscreen.classList.toggle("active");
        }
        function x(e2) {
          Z(e2, "bold", e2.options.blockStyles.bold);
        }
        function y(e2) {
          Z(e2, "italic", e2.options.blockStyles.italic);
        }
        function b(e2) {
          Z(e2, "strikethrough", "~~");
        }
        function D(e2) {
          var t2 = e2.options.blockStyles.code;
          function n2(e3) {
            if ("object" != typeof e3) throw "fencing_line() takes a 'line' object (not a line number, or line text).  Got: " + typeof e3 + ": " + e3;
            return e3.styles && e3.styles[2] && -1 !== e3.styles[2].indexOf("formatting-code-block");
          }
          function i2(e3) {
            return e3.state.base.base || e3.state.base;
          }
          function r2(e3, t3, r3, o3, a3) {
            r3 = r3 || e3.getLineHandle(t3), o3 = o3 || e3.getTokenAt({ line: t3, ch: 1 }), a3 = a3 || !!r3.text && e3.getTokenAt({ line: t3, ch: r3.text.length - 1 });
            var l3 = o3.type ? o3.type.split(" ") : [];
            return a3 && i2(a3).indentedCode ? "indented" : -1 !== l3.indexOf("comment") && (i2(o3).fencedChars || i2(a3).fencedChars || n2(r3) ? "fenced" : "single");
          }
          var o2, a2, l2, s2 = e2.codemirror, u2 = s2.getCursor("start"), c2 = s2.getCursor("end"), d2 = s2.getTokenAt({ line: u2.line, ch: u2.ch || 1 }), h2 = s2.getLineHandle(u2.line), f2 = r2(s2, u2.line, h2, d2);
          if ("single" === f2) {
            var p2 = h2.text.slice(0, u2.ch).replace("`", ""), m2 = h2.text.slice(u2.ch).replace("`", "");
            s2.replaceRange(p2 + m2, { line: u2.line, ch: 0 }, { line: u2.line, ch: 99999999999999 }), u2.ch--, u2 !== c2 && c2.ch--, s2.setSelection(u2, c2), s2.focus();
          } else if ("fenced" === f2) if (u2.line !== c2.line || u2.ch !== c2.ch) {
            for (o2 = u2.line; o2 >= 0 && !n2(h2 = s2.getLineHandle(o2)); o2--) ;
            var g2, v2, x2, y2, b2 = i2(s2.getTokenAt({ line: o2, ch: 1 })).fencedChars;
            n2(s2.getLineHandle(u2.line)) ? (g2 = "", v2 = u2.line) : n2(s2.getLineHandle(u2.line - 1)) ? (g2 = "", v2 = u2.line - 1) : (g2 = b2 + "\n", v2 = u2.line), n2(s2.getLineHandle(c2.line)) ? (x2 = "", y2 = c2.line, 0 === c2.ch && (y2 += 1)) : 0 !== c2.ch && n2(s2.getLineHandle(c2.line + 1)) ? (x2 = "", y2 = c2.line + 1) : (x2 = b2 + "\n", y2 = c2.line + 1), 0 === c2.ch && (y2 -= 1), s2.operation((function() {
              s2.replaceRange(x2, { line: y2, ch: 0 }, { line: y2 + (x2 ? 0 : 1), ch: 0 }), s2.replaceRange(g2, { line: v2, ch: 0 }, { line: v2 + (g2 ? 0 : 1), ch: 0 });
            })), s2.setSelection({ line: v2 + (g2 ? 1 : 0), ch: 0 }, { line: y2 + (g2 ? 1 : -1), ch: 0 }), s2.focus();
          } else {
            var D2 = u2.line;
            if (n2(s2.getLineHandle(u2.line)) && ("fenced" === r2(s2, u2.line + 1) ? (o2 = u2.line, D2 = u2.line + 1) : (a2 = u2.line, D2 = u2.line - 1)), void 0 === o2) for (o2 = D2; o2 >= 0 && !n2(h2 = s2.getLineHandle(o2)); o2--) ;
            if (void 0 === a2) for (l2 = s2.lineCount(), a2 = D2; a2 < l2 && !n2(h2 = s2.getLineHandle(a2)); a2++) ;
            s2.operation((function() {
              s2.replaceRange("", { line: o2, ch: 0 }, { line: o2 + 1, ch: 0 }), s2.replaceRange("", { line: a2 - 1, ch: 0 }, { line: a2, ch: 0 });
            })), s2.focus();
          }
          else if ("indented" === f2) {
            if (u2.line !== c2.line || u2.ch !== c2.ch) o2 = u2.line, a2 = c2.line, 0 === c2.ch && a2--;
            else {
              for (o2 = u2.line; o2 >= 0; o2--) if (!(h2 = s2.getLineHandle(o2)).text.match(/^\s*$/) && "indented" !== r2(s2, o2, h2)) {
                o2 += 1;
                break;
              }
              for (l2 = s2.lineCount(), a2 = u2.line; a2 < l2; a2++) if (!(h2 = s2.getLineHandle(a2)).text.match(/^\s*$/) && "indented" !== r2(s2, a2, h2)) {
                a2 -= 1;
                break;
              }
            }
            var C2 = s2.getLineHandle(a2 + 1), w2 = C2 && s2.getTokenAt({ line: a2 + 1, ch: C2.text.length - 1 });
            w2 && i2(w2).indentedCode && s2.replaceRange("\n", { line: a2 + 1, ch: 0 });
            for (var k2 = o2; k2 <= a2; k2++) s2.indentLine(k2, "subtract");
            s2.focus();
          } else {
            var S2 = u2.line === c2.line && u2.ch === c2.ch && 0 === u2.ch, F2 = u2.line !== c2.line;
            S2 || F2 ? (function(e3, t3, n3, i3) {
              var r3 = t3.line + 1, o3 = n3.line + 1, a3 = t3.line !== n3.line, l3 = i3 + "\n", s3 = "\n" + i3;
              a3 && o3++, a3 && 0 === n3.ch && (s3 = i3 + "\n", o3--), G(e3, false, [l3, s3]), e3.setSelection({ line: r3, ch: 0 }, { line: o3, ch: 0 });
            })(s2, u2, c2, t2) : G(s2, false, ["`", "`"]);
          }
        }
        function C(e2) {
          X(e2.codemirror, "quote");
        }
        function w(e2) {
          V(e2.codemirror, "smaller");
        }
        function k(e2) {
          V(e2.codemirror, "bigger");
        }
        function S(e2) {
          V(e2.codemirror, void 0, 1);
        }
        function F(e2) {
          V(e2.codemirror, void 0, 2);
        }
        function A(e2) {
          V(e2.codemirror, void 0, 3);
        }
        function E(e2) {
          V(e2.codemirror, void 0, 4);
        }
        function L(e2) {
          V(e2.codemirror, void 0, 5);
        }
        function T(e2) {
          V(e2.codemirror, void 0, 6);
        }
        function M(e2) {
          var t2 = e2.codemirror, n2 = "*";
          ["-", "+", "*"].includes(e2.options.unorderedListStyle) && (n2 = e2.options.unorderedListStyle), X(t2, "unordered-list", n2);
        }
        function B(e2) {
          X(e2.codemirror, "ordered-list");
        }
        function N(e2) {
          X(e2.codemirror, "check-list");
        }
        function O(e2) {
          !(function(e3) {
            if (e3.getWrapperElement().lastChild.classList.contains("editor-preview-active")) return;
            for (var t2, n2 = e3.getCursor("start"), i2 = e3.getCursor("end"), r2 = n2.line; r2 <= i2.line; r2++) t2 = (t2 = e3.getLine(r2)).replace(/^[ ]*([# ]+|\*|-|[> ]+|[0-9]+(.|\)))[ ]*/, ""), e3.replaceRange(t2, { line: r2, ch: 0 }, { line: r2, ch: 99999999999999 });
          })(e2.codemirror);
        }
        function I(e2) {
          var t2 = e2.options, n2 = "https://";
          if (t2.promptURLs) {
            var i2 = prompt(t2.promptTexts.link, n2);
            if (!i2) return false;
            n2 = H(i2);
          }
          K(e2, "link", t2.insertTexts.link, n2);
        }
        function z(e2) {
          var t2 = e2.options, n2 = "https://";
          if (t2.promptURLs) {
            var i2 = prompt(t2.promptTexts.image, n2);
            if (!i2) return false;
            n2 = H(i2);
          }
          K(e2, "image", t2.insertTexts.image, n2);
        }
        function H(e2) {
          return encodeURI(e2).replace(/([\\()])/g, "\\$1");
        }
        function R(e2) {
          e2.openBrowseFileWindow();
        }
        function P(e2, t2) {
          var n2 = e2.codemirror, i2 = m(n2), r2 = e2.options, o2 = t2.substr(t2.lastIndexOf("/") + 1), a2 = o2.substring(o2.lastIndexOf(".") + 1).replace(/\?.*$/, "").toLowerCase();
          if (["png", "jpg", "jpeg", "gif", "svg", "apng", "avif", "webp"].includes(a2)) G(n2, i2.image, r2.insertTexts.uploadedImage, t2);
          else {
            var l2 = r2.insertTexts.link;
            l2[0] = "[" + o2, G(n2, i2.link, l2, t2);
          }
          e2.updateStatusBar("upload-image", e2.options.imageTexts.sbOnUploaded.replace("#image_name#", o2)), setTimeout((function() {
            e2.updateStatusBar("upload-image", e2.options.imageTexts.sbInit);
          }), 1e3);
        }
        function _(e2) {
          var t2 = e2.codemirror, n2 = m(t2), i2 = e2.options;
          G(t2, n2.table, i2.insertTexts.table);
        }
        function W(e2) {
          var t2 = e2.codemirror, n2 = m(t2), i2 = e2.options;
          G(t2, n2.image, i2.insertTexts.horizontalRule);
        }
        function j(e2) {
          var t2 = e2.codemirror;
          t2.undo(), t2.focus();
        }
        function q(e2) {
          var t2 = e2.codemirror;
          t2.redo(), t2.focus();
        }
        function U(e2) {
          var t2 = e2.codemirror, n2 = t2.getWrapperElement(), i2 = n2.nextSibling, r2 = e2.toolbarElements && e2.toolbarElements["side-by-side"], o2 = false, a2 = n2.parentNode;
          i2.classList.contains("editor-preview-active-side") ? (false === e2.options.sideBySideFullscreen && a2.classList.remove("sided--no-fullscreen"), i2.classList.remove("editor-preview-active-side"), r2 && r2.classList.remove("active"), n2.classList.remove("CodeMirror-sided")) : (setTimeout((function() {
            t2.getOption("fullScreen") || (false === e2.options.sideBySideFullscreen ? a2.classList.add("sided--no-fullscreen") : v(e2)), i2.classList.add("editor-preview-active-side");
          }), 1), r2 && r2.classList.add("active"), n2.classList.add("CodeMirror-sided"), o2 = true);
          var l2 = n2.lastChild;
          if (l2.classList.contains("editor-preview-active")) {
            l2.classList.remove("editor-preview-active");
            var s2 = e2.toolbarElements.preview, u2 = e2.toolbar_div;
            s2.classList.remove("active"), u2.classList.remove("disabled-for-preview");
          }
          if (t2.sideBySideRenderingFunction || (t2.sideBySideRenderingFunction = function() {
            var t3 = e2.options.previewRender(e2.value(), i2);
            null != t3 && (i2.innerHTML = t3);
          }), o2) {
            var c2 = e2.options.previewRender(e2.value(), i2);
            null != c2 && (i2.innerHTML = c2), t2.on("update", t2.sideBySideRenderingFunction);
          } else t2.off("update", t2.sideBySideRenderingFunction);
          t2.refresh();
        }
        function $(e2) {
          var t2 = e2.codemirror, n2 = t2.getWrapperElement(), i2 = e2.toolbar_div, r2 = !!e2.options.toolbar && e2.toolbarElements.preview, o2 = n2.lastChild;
          if (t2.getWrapperElement().nextSibling.classList.contains("editor-preview-active-side") && U(e2), !o2 || !o2.classList.contains("editor-preview-full")) {
            if ((o2 = document.createElement("div")).className = "editor-preview-full", e2.options.previewClass) if (Array.isArray(e2.options.previewClass)) for (var a2 = 0; a2 < e2.options.previewClass.length; a2++) o2.classList.add(e2.options.previewClass[a2]);
            else "string" == typeof e2.options.previewClass && o2.classList.add(e2.options.previewClass);
            n2.appendChild(o2);
          }
          o2.classList.contains("editor-preview-active") ? (o2.classList.remove("editor-preview-active"), r2 && (r2.classList.remove("active"), i2.classList.remove("disabled-for-preview"))) : (setTimeout((function() {
            o2.classList.add("editor-preview-active");
          }), 1), r2 && (r2.classList.add("active"), i2.classList.add("disabled-for-preview")));
          var l2 = e2.options.previewRender(e2.value(), o2);
          null !== l2 && (o2.innerHTML = l2);
        }
        function G(e2, t2, n2, i2) {
          if (!e2.getWrapperElement().lastChild.classList.contains("editor-preview-active")) {
            var r2, o2 = n2[0], a2 = n2[1], l2 = {}, s2 = {};
            Object.assign(l2, e2.getCursor("start")), Object.assign(s2, e2.getCursor("end")), i2 && (o2 = o2.replace("#url#", i2), a2 = a2.replace("#url#", i2)), t2 ? (o2 = (r2 = e2.getLine(l2.line)).slice(0, l2.ch), a2 = r2.slice(l2.ch), e2.replaceRange(o2 + a2, { line: l2.line, ch: 0 })) : (r2 = e2.getSelection(), e2.replaceSelection(o2 + r2 + a2), l2.ch += o2.length, l2 !== s2 && (s2.ch += o2.length)), e2.setSelection(l2, s2), e2.focus();
          }
        }
        function V(e2, t2, n2) {
          if (!e2.getWrapperElement().lastChild.classList.contains("editor-preview-active")) {
            for (var i2 = e2.getCursor("start"), r2 = e2.getCursor("end"), o2 = i2.line; o2 <= r2.line; o2++) !(function(i3) {
              var r3 = e2.getLine(i3), o3 = r3.search(/[^#]/);
              r3 = void 0 !== t2 ? o3 <= 0 ? "bigger" == t2 ? "###### " + r3 : "# " + r3 : 6 == o3 && "smaller" == t2 ? r3.substr(7) : 1 == o3 && "bigger" == t2 ? r3.substr(2) : "bigger" == t2 ? r3.substr(1) : "#" + r3 : o3 <= 0 ? "#".repeat(n2) + " " + r3 : o3 == n2 ? r3.substr(o3 + 1) : "#".repeat(n2) + " " + r3.substr(o3 + 1), e2.replaceRange(r3, { line: i3, ch: 0 }, { line: i3, ch: 99999999999999 });
            })(o2);
            e2.focus();
          }
        }
        function X(e2, t2, n2) {
          if (!e2.getWrapperElement().lastChild.classList.contains("editor-preview-active")) {
            var i2 = /^(\s*)(\*|-|\+|\d*\.)(\s+)/, r2 = /^\s*/, o2 = m(e2), a2 = e2.getCursor("start"), l2 = e2.getCursor("end"), s2 = { quote: /^(\s*)>\s+/, "unordered-list": i2, "ordered-list": i2, "check-list": /^(\s*)(- \[[ xX]])(\s+)/ }, u2 = function(e3, t3, o3) {
              var a3 = i2.exec(t3), l3 = (function(e4, t4) {
                return { quote: ">", "unordered-list": n2, "ordered-list": "%%i.", "check-list": "- [ ]" }[e4].replace("%%i", t4);
              })(e3, c2);
              return null !== a3 ? ((function(e4, t4) {
                var i3 = new RegExp({ quote: ">", "unordered-list": "\\" + n2, "ordered-list": "\\d+.", "check-list": "- \\[[ xX]]" }[e4]);
                return t4 && i3.test(t4);
              })(e3, a3[2]) && (l3 = ""), t3 = a3[1] + l3 + a3[3] + t3.replace(r2, "").replace(s2[e3], "$1")) : 0 == o3 && (t3 = l3 + " " + t3), t3;
            }, c2 = 1, d2 = ["unordered-list", "ordered-list", "check-list"], h2 = Object.keys(o2)[0];
            if (!d2.includes(h2)) {
              var f2 = e2.getLine(a2.line);
              /^\s*- \[[ xX]]\s/.test(f2) ? h2 = "check-list" : /^\s*\d+\.\s/.test(f2) ? h2 = "ordered-list" : /^\s*[*\-+]\s/.test(f2) && (h2 = "unordered-list");
            }
            for (var p2 = a2.line; p2 <= l2.line; p2++) !(function(n3) {
              var i3 = e2.getLine(n3);
              o2[t2] ? i3 = i3.replace(s2[t2], "$1") : d2.includes(h2) && d2.includes(t2) ? (i3 = i3.replace(s2[h2], "$1"), i3 = u2(t2, i3, false), c2 += 1) : (i3 = u2(t2, i3, false), c2 += 1), e2.replaceRange(i3, { line: n3, ch: 0 }, { line: n3, ch: 99999999999999 });
            })(p2);
            e2.focus();
          }
        }
        function K(e2, t2, n2, i2) {
          if (e2.codemirror && !e2.isPreviewActive()) {
            var r2 = e2.codemirror, o2 = m(r2)[t2];
            if (o2) {
              var a2 = r2.getCursor("start"), l2 = r2.getCursor("end"), s2 = r2.getLine(a2.line), u2 = s2.slice(0, a2.ch), c2 = s2.slice(a2.ch);
              "link" == t2 ? u2 = u2.replace(/(.*)[^!]\[/, "$1") : "image" == t2 && (u2 = u2.replace(/(.*)!\[$/, "$1")), c2 = c2.replace(/]\(.*?\)/, ""), r2.replaceRange(u2 + c2, { line: a2.line, ch: 0 }, { line: a2.line, ch: 99999999999999 }), a2.ch -= n2[0].length, a2 !== l2 && (l2.ch -= n2[0].length), r2.setSelection(a2, l2), r2.focus();
            } else G(r2, o2, n2, i2);
          }
        }
        function Z(e2, t2, n2, i2) {
          if (e2.codemirror && !e2.isPreviewActive()) {
            i2 = void 0 === i2 ? n2 : i2;
            var r2, o2 = e2.codemirror, a2 = m(o2), l2 = n2, s2 = i2, u2 = o2.getCursor("start"), c2 = o2.getCursor("end");
            a2[t2] ? (l2 = (r2 = o2.getLine(u2.line)).slice(0, u2.ch), s2 = r2.slice(u2.ch), "bold" == t2 ? (l2 = l2.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, ""), s2 = s2.replace(/(\*\*|__)/, "")) : "italic" == t2 ? (l2 = l2.replace(/(\*|_)(?![\s\S]*(\*|_))/, ""), s2 = s2.replace(/(\*|_)/, "")) : "strikethrough" == t2 && (l2 = l2.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, ""), s2 = s2.replace(/(\*\*|~~)/, "")), o2.replaceRange(l2 + s2, { line: u2.line, ch: 0 }, { line: u2.line, ch: 99999999999999 }), "bold" == t2 || "strikethrough" == t2 ? (u2.ch -= 2, u2 !== c2 && (c2.ch -= 2)) : "italic" == t2 && (u2.ch -= 1, u2 !== c2 && (c2.ch -= 1))) : (r2 = o2.getSelection(), "bold" == t2 ? r2 = (r2 = r2.split("**").join("")).split("__").join("") : "italic" == t2 ? r2 = (r2 = r2.split("*").join("")).split("_").join("") : "strikethrough" == t2 && (r2 = r2.split("~~").join("")), o2.replaceSelection(l2 + r2 + s2), u2.ch += n2.length, c2.ch = u2.ch + r2.length), o2.setSelection(u2, c2), o2.focus();
          }
        }
        function Y(e2, t2) {
          if (Math.abs(e2) < 1024) return "" + e2 + t2[0];
          var n2 = 0;
          do {
            e2 /= 1024, ++n2;
          } while (Math.abs(e2) >= 1024 && n2 < t2.length);
          return "" + e2.toFixed(1) + t2[n2];
        }
        function Q(e2, t2) {
          for (var n2 in t2) Object.prototype.hasOwnProperty.call(t2, n2) && (t2[n2] instanceof Array ? e2[n2] = t2[n2].concat(e2[n2] instanceof Array ? e2[n2] : []) : null !== t2[n2] && "object" == typeof t2[n2] && t2[n2].constructor === Object ? e2[n2] = Q(e2[n2] || {}, t2[n2]) : e2[n2] = t2[n2]);
          return e2;
        }
        function J(e2) {
          for (var t2 = 1; t2 < arguments.length; t2++) e2 = Q(e2, arguments[t2]);
          return e2;
        }
        function ee(e2) {
          var t2 = e2.match(/[a-zA-Z0-9_\u00A0-\u02AF\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g), n2 = 0;
          if (null === t2) return n2;
          for (var i2 = 0; i2 < t2.length; i2++) t2[i2].charCodeAt(0) >= 19968 ? n2 += t2[i2].length : n2 += 1;
          return n2;
        }
        var te = { bold: "fa fa-bold", italic: "fa fa-italic", strikethrough: "fa fa-strikethrough", heading: "fa fa-header fa-heading", "heading-smaller": "fa fa-header fa-heading header-smaller", "heading-bigger": "fa fa-header fa-heading header-bigger", "heading-1": "fa fa-header fa-heading header-1", "heading-2": "fa fa-header fa-heading header-2", "heading-3": "fa fa-header fa-heading header-3", code: "fa fa-code", quote: "fa fa-quote-left", "ordered-list": "fa fa-list-ol", "unordered-list": "fa fa-list-ul", "check-list": "fa fa-check-square-o", "clean-block": "fa fa-eraser", link: "fa fa-link", image: "fa fa-image", "upload-image": "fa fa-image", table: "fa fa-table", "horizontal-rule": "fa fa-minus", preview: "fa fa-eye", "side-by-side": "fa fa-columns", fullscreen: "fa fa-arrows-alt", guide: "fa fa-question-circle", undo: "fa fa-undo", redo: "fa fa-repeat fa-redo" }, ne = { bold: { name: "bold", action: x, className: te.bold, title: "Bold", default: true }, italic: { name: "italic", action: y, className: te.italic, title: "Italic", default: true }, strikethrough: { name: "strikethrough", action: b, className: te.strikethrough, title: "Strikethrough" }, heading: { name: "heading", action: w, className: te.heading, title: "Heading", default: true }, "heading-smaller": { name: "heading-smaller", action: w, className: te["heading-smaller"], title: "Smaller Heading" }, "heading-bigger": { name: "heading-bigger", action: k, className: te["heading-bigger"], title: "Bigger Heading" }, "heading-1": { name: "heading-1", action: S, className: te["heading-1"], title: "Big Heading" }, "heading-2": { name: "heading-2", action: F, className: te["heading-2"], title: "Medium Heading" }, "heading-3": { name: "heading-3", action: A, className: te["heading-3"], title: "Small Heading" }, "separator-1": { name: "separator-1" }, code: { name: "code", action: D, className: te.code, title: "Code" }, quote: { name: "quote", action: C, className: te.quote, title: "Quote", default: true }, "unordered-list": { name: "unordered-list", action: M, className: te["unordered-list"], title: "Generic List", default: true }, "ordered-list": { name: "ordered-list", action: B, className: te["ordered-list"], title: "Numbered List", default: true }, "check-list": { name: "check-list", action: N, className: te["check-list"], title: "Check List", default: true }, "clean-block": { name: "clean-block", action: O, className: te["clean-block"], title: "Clean block" }, "separator-2": { name: "separator-2" }, link: { name: "link", action: I, className: te.link, title: "Create Link", default: true }, image: { name: "image", action: z, className: te.image, title: "Insert Image", default: true }, "upload-image": { name: "upload-image", action: R, className: te["upload-image"], title: "Import an image" }, table: { name: "table", action: _, className: te.table, title: "Insert Table" }, "horizontal-rule": { name: "horizontal-rule", action: W, className: te["horizontal-rule"], title: "Insert Horizontal Line" }, "separator-3": { name: "separator-3" }, preview: { name: "preview", action: $, className: te.preview, noDisable: true, title: "Toggle Preview", default: true }, "side-by-side": { name: "side-by-side", action: U, className: te["side-by-side"], noDisable: true, noMobile: true, title: "Toggle Side by Side", default: true }, fullscreen: { name: "fullscreen", action: v, className: te.fullscreen, noDisable: true, noMobile: true, title: "Toggle Fullscreen", default: true }, "separator-4": { name: "separator-4" }, guide: { name: "guide", action: "https://www.markdownguide.org/basic-syntax/", className: te.guide, noDisable: true, title: "Markdown Guide", default: true }, "separator-5": { name: "separator-5" }, undo: { name: "undo", action: j, className: te.undo, noDisable: true, title: "Undo" }, redo: { name: "redo", action: q, className: te.redo, noDisable: true, title: "Redo" } }, ie = { link: ["[", "](#url#)"], image: ["![", "](#url#)"], uploadedImage: ["![](#url#)", ""], table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n"], horizontalRule: ["", "\n\n-----\n\n"] }, re = { link: "URL for the link:", image: "URL of the image:" }, oe = { locale: "en-US", format: { hour: "2-digit", minute: "2-digit" } }, ae = { bold: "**", code: "```", italic: "*" }, le = { sbInit: "Attach files by drag and dropping or pasting from clipboard.", sbOnDragEnter: "Drop image to upload it.", sbOnDrop: "Uploading image #images_names#...", sbProgress: "Uploading #file_name#: #progress#%", sbOnUploaded: "Uploaded #image_name#", sizeUnits: " B, KB, MB" }, se = { noFileGiven: "You must select a file.", typeNotAllowed: "This image type is not allowed.", fileTooLarge: "Image #image_name# is too big (#image_size#).\nMaximum file size is #image_max_size#.", importError: "Something went wrong when uploading the image #image_name#." };
        function ue(e2) {
          (e2 = e2 || {}).parent = this;
          var t2 = true;
          if (false === e2.autoDownloadFontAwesome && (t2 = false), true !== e2.autoDownloadFontAwesome) for (var n2 = document.styleSheets, i2 = 0; i2 < n2.length; i2++) n2[i2].href && n2[i2].href.indexOf("//maxcdn.bootstrapcdn.com/font-awesome/") > -1 && (t2 = false);
          if (t2) {
            var r2 = document.createElement("link");
            r2.rel = "stylesheet", r2.href = "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css", document.getElementsByTagName("head")[0].appendChild(r2);
          }
          if (e2.element) this.element = e2.element;
          else if (null === e2.element) return void console.log("EasyMDE: Error. No element was found.");
          if (void 0 === e2.toolbar) for (var o2 in e2.toolbar = [], ne) Object.prototype.hasOwnProperty.call(ne, o2) && (-1 != o2.indexOf("separator-") && e2.toolbar.push("|"), (true === ne[o2].default || e2.showIcons && e2.showIcons.constructor === Array && -1 != e2.showIcons.indexOf(o2)) && e2.toolbar.push(o2));
          if (Object.prototype.hasOwnProperty.call(e2, "previewClass") || (e2.previewClass = "editor-preview"), Object.prototype.hasOwnProperty.call(e2, "status") || (e2.status = ["autosave", "lines", "words", "cursor"], e2.uploadImage && e2.status.unshift("upload-image")), e2.previewRender || (e2.previewRender = function(e3) {
            return this.parent.markdown(e3);
          }), e2.parsingConfig = J({ highlightFormatting: true }, e2.parsingConfig || {}), e2.insertTexts = J({}, ie, e2.insertTexts || {}), e2.promptTexts = J({}, re, e2.promptTexts || {}), e2.blockStyles = J({}, ae, e2.blockStyles || {}), null != e2.autosave && (e2.autosave.timeFormat = J({}, oe, e2.autosave.timeFormat || {})), e2.iconClassMap = J({}, te, e2.iconClassMap || {}), e2.shortcuts = J({}, u, e2.shortcuts || {}), e2.maxHeight = e2.maxHeight || void 0, e2.direction = e2.direction || "ltr", void 0 !== e2.maxHeight ? e2.minHeight = e2.maxHeight : e2.minHeight = e2.minHeight || "300px", e2.errorCallback = e2.errorCallback || function(e3) {
            alert(e3);
          }, e2.uploadImage = e2.uploadImage || false, e2.imageMaxSize = e2.imageMaxSize || 2097152, e2.imageAccept = e2.imageAccept || "image/png, image/jpeg, image/gif, image/avif", e2.imageTexts = J({}, le, e2.imageTexts || {}), e2.errorMessages = J({}, se, e2.errorMessages || {}), e2.imagePathAbsolute = e2.imagePathAbsolute || false, e2.imageCSRFName = e2.imageCSRFName || "csrfmiddlewaretoken", e2.imageCSRFHeader = e2.imageCSRFHeader || false, e2.imageInputName = e2.imageInputName || "image", null != e2.autosave && null != e2.autosave.unique_id && "" != e2.autosave.unique_id && (e2.autosave.uniqueId = e2.autosave.unique_id), e2.overlayMode && void 0 === e2.overlayMode.combine && (e2.overlayMode.combine = true), this.options = e2, this.render(), !e2.initialValue || this.options.autosave && true === this.options.autosave.foundSavedValue || this.value(e2.initialValue), e2.uploadImage) {
            var a2 = this;
            this.codemirror.on("dragenter", (function(e3, t3) {
              a2.updateStatusBar("upload-image", a2.options.imageTexts.sbOnDragEnter), t3.stopPropagation(), t3.preventDefault();
            })), this.codemirror.on("dragend", (function(e3, t3) {
              a2.updateStatusBar("upload-image", a2.options.imageTexts.sbInit), t3.stopPropagation(), t3.preventDefault();
            })), this.codemirror.on("dragleave", (function(e3, t3) {
              a2.updateStatusBar("upload-image", a2.options.imageTexts.sbInit), t3.stopPropagation(), t3.preventDefault();
            })), this.codemirror.on("dragover", (function(e3, t3) {
              a2.updateStatusBar("upload-image", a2.options.imageTexts.sbOnDragEnter), t3.stopPropagation(), t3.preventDefault();
            })), this.codemirror.on("drop", (function(t3, n3) {
              n3.stopPropagation(), n3.preventDefault(), e2.imageUploadFunction ? a2.uploadImagesUsingCustomFunction(e2.imageUploadFunction, n3.dataTransfer.files) : a2.uploadImages(n3.dataTransfer.files);
            })), this.codemirror.on("paste", (function(t3, n3) {
              e2.imageUploadFunction ? a2.uploadImagesUsingCustomFunction(e2.imageUploadFunction, n3.clipboardData.files) : a2.uploadImages(n3.clipboardData.files);
            }));
          }
        }
        function ce() {
          if ("object" != typeof localStorage) return false;
          try {
            localStorage.setItem("smde_localStorage", 1), localStorage.removeItem("smde_localStorage");
          } catch (e2) {
            return false;
          }
          return true;
        }
        ue.prototype.uploadImages = function(e2, t2, n2) {
          if (0 !== e2.length) {
            for (var i2 = [], r2 = 0; r2 < e2.length; r2++) i2.push(e2[r2].name), this.uploadImage(e2[r2], t2, n2);
            this.updateStatusBar("upload-image", this.options.imageTexts.sbOnDrop.replace("#images_names#", i2.join(", ")));
          }
        }, ue.prototype.uploadImagesUsingCustomFunction = function(e2, t2) {
          if (0 !== t2.length) {
            for (var n2 = [], i2 = 0; i2 < t2.length; i2++) n2.push(t2[i2].name), this.uploadImageUsingCustomFunction(e2, t2[i2]);
            this.updateStatusBar("upload-image", this.options.imageTexts.sbOnDrop.replace("#images_names#", n2.join(", ")));
          }
        }, ue.prototype.updateStatusBar = function(e2, t2) {
          if (this.gui.statusbar) {
            var n2 = this.gui.statusbar.getElementsByClassName(e2);
            1 === n2.length ? this.gui.statusbar.getElementsByClassName(e2)[0].textContent = t2 : 0 === n2.length ? console.log("EasyMDE: status bar item " + e2 + " was not found.") : console.log("EasyMDE: Several status bar items named " + e2 + " was found.");
          }
        }, ue.prototype.markdown = function(e2) {
          if (o) {
            var t2;
            if (t2 = this.options && this.options.renderingConfig && this.options.renderingConfig.markedOptions ? this.options.renderingConfig.markedOptions : {}, this.options && this.options.renderingConfig && false === this.options.renderingConfig.singleLineBreaks ? t2.breaks = false : t2.breaks = true, this.options && this.options.renderingConfig && true === this.options.renderingConfig.codeSyntaxHighlighting) {
              var n2 = this.options.renderingConfig.hljs || window.hljs;
              n2 && (t2.highlight = function(e3, t3) {
                return t3 && n2.getLanguage(t3) ? n2.highlight(t3, e3).value : n2.highlightAuto(e3).value;
              });
            }
            o.use(t2);
            var i2 = o.parse(e2);
            return this.options.renderingConfig && "function" == typeof this.options.renderingConfig.sanitizerFunction && (i2 = this.options.renderingConfig.sanitizerFunction.call(this, i2)), i2 = (function(e3) {
              for (var t3 = new DOMParser().parseFromString(e3, "text/html"), n3 = t3.getElementsByTagName("li"), i3 = 0; i3 < n3.length; i3++) for (var r2 = n3[i3], o2 = 0; o2 < r2.children.length; o2++) {
                var a2 = r2.children[o2];
                a2 instanceof HTMLInputElement && "checkbox" === a2.type && (r2.style.marginLeft = "-1.5em", r2.style.listStyleType = "none");
              }
              return t3.documentElement.innerHTML;
            })(i2 = (function(e3) {
              for (var t3; null !== (t3 = l.exec(e3)); ) {
                var n3 = t3[0];
                if (-1 === n3.indexOf("target=")) {
                  var i3 = n3.replace(/>$/, ' target="_blank">');
                  e3 = e3.replace(n3, i3);
                }
              }
              return e3;
            })(i2));
          }
        }, ue.prototype.render = function(e2) {
          if (e2 || (e2 = this.element || document.getElementsByTagName("textarea")[0]), !this._rendered || this._rendered !== e2) {
            this.element = e2;
            var t2, n2, o2 = this.options, a2 = this, l2 = {};
            for (var u2 in o2.shortcuts) null !== o2.shortcuts[u2] && null !== s[u2] && (function(e3) {
              l2[d(o2.shortcuts[e3])] = function() {
                var t3 = s[e3];
                "function" == typeof t3 ? t3(a2) : "string" == typeof t3 && window.open(t3, "_blank");
              };
            })(u2);
            if (l2.Enter = "newlineAndIndentContinueMarkdownList", l2.Tab = "tabAndIndentMarkdownList", l2["Shift-Tab"] = "shiftTabAndUnindentMarkdownList", l2.Esc = function(e3) {
              e3.getOption("fullScreen") && v(a2);
            }, this.documentOnKeyDown = function(e3) {
              27 == (e3 = e3 || window.event).keyCode && a2.codemirror.getOption("fullScreen") && v(a2);
            }, document.addEventListener("keydown", this.documentOnKeyDown, false), o2.overlayMode ? (i.defineMode("overlay-mode", (function(e3) {
              return i.overlayMode(i.getMode(e3, false !== o2.spellChecker ? "spell-checker" : "gfm"), o2.overlayMode.mode, o2.overlayMode.combine);
            })), t2 = "overlay-mode", (n2 = o2.parsingConfig).gitHubSpice = false) : ((t2 = o2.parsingConfig).name = "gfm", t2.gitHubSpice = false), false !== o2.spellChecker && (t2 = "spell-checker", (n2 = o2.parsingConfig).name = "gfm", n2.gitHubSpice = false, "function" == typeof o2.spellChecker ? o2.spellChecker({ codeMirrorInstance: i }) : r({ codeMirrorInstance: i })), this.codemirror = i.fromTextArea(e2, { mode: t2, backdrop: n2, theme: null != o2.theme ? o2.theme : "easymde", tabSize: null != o2.tabSize ? o2.tabSize : 2, indentUnit: null != o2.tabSize ? o2.tabSize : 2, indentWithTabs: false !== o2.indentWithTabs, lineNumbers: true === o2.lineNumbers, autofocus: true === o2.autofocus, extraKeys: l2, direction: o2.direction, lineWrapping: false !== o2.lineWrapping, allowDropFileTypes: ["text/plain"], placeholder: o2.placeholder || e2.getAttribute("placeholder") || "", styleSelectedText: null != o2.styleSelectedText ? o2.styleSelectedText : !c(), scrollbarStyle: null != o2.scrollbarStyle ? o2.scrollbarStyle : "native", configureMouse: function(e3, t3, n3) {
              return { addNew: false };
            }, inputStyle: null != o2.inputStyle ? o2.inputStyle : c() ? "contenteditable" : "textarea", spellcheck: null == o2.nativeSpellcheck || o2.nativeSpellcheck, autoRefresh: null != o2.autoRefresh && o2.autoRefresh }), this.codemirror.getScrollerElement().style.minHeight = o2.minHeight, void 0 !== o2.maxHeight && (this.codemirror.getScrollerElement().style.height = o2.maxHeight), true === o2.forceSync) {
              var h2 = this.codemirror;
              h2.on("change", (function() {
                h2.save();
              }));
            }
            this.gui = {};
            var f2 = document.createElement("div");
            f2.classList.add("EasyMDEContainer"), f2.setAttribute("role", "application");
            var p2 = this.codemirror.getWrapperElement();
            p2.parentNode.insertBefore(f2, p2), f2.appendChild(p2), false !== o2.toolbar && (this.gui.toolbar = this.createToolbar()), false !== o2.status && (this.gui.statusbar = this.createStatusbar()), null != o2.autosave && true === o2.autosave.enabled && (this.autosave(), this.codemirror.on("change", (function() {
              clearTimeout(a2._autosave_timeout), a2._autosave_timeout = setTimeout((function() {
                a2.autosave();
              }), a2.options.autosave.submit_delay || a2.options.autosave.delay || 1e3);
            })));
            var m2 = this;
            this.codemirror.on("update", (function() {
              o2.previewImagesInEditor && f2.querySelectorAll(".cm-image-marker").forEach((function(e3) {
                var t3 = e3.parentElement;
                if (t3.innerText.match(/^!\[.*?\]\(.*\)/g) && !t3.hasAttribute("data-img-src")) {
                  var n3 = t3.innerText.match(/!\[.*?\]\((.*?)\)/);
                  if (window.EMDEimagesCache || (window.EMDEimagesCache = {}), n3 && n3.length >= 2) {
                    var i2 = n3[1];
                    if (o2.imagesPreviewHandler) {
                      var r2 = o2.imagesPreviewHandler(n3[1]);
                      "string" == typeof r2 && (i2 = r2);
                    }
                    if (window.EMDEimagesCache[i2]) x2(t3, window.EMDEimagesCache[i2]);
                    else {
                      window.EMDEimagesCache[i2] = {};
                      var a3 = document.createElement("img");
                      a3.onload = function() {
                        window.EMDEimagesCache[i2] = { naturalWidth: a3.naturalWidth, naturalHeight: a3.naturalHeight, url: i2 }, x2(t3, window.EMDEimagesCache[i2]);
                      }, a3.src = i2;
                    }
                  }
                }
              }));
            })), this.gui.sideBySide = this.createSideBySide(), this._rendered = this.element, (true === o2.autofocus || e2.autofocus) && this.codemirror.focus();
            var g2 = this.codemirror;
            setTimeout(function() {
              g2.refresh();
            }.bind(g2), 0);
          }
          function x2(e3, t3) {
            var n3, i2, r2 = new URL(t3.url, document.baseURI).href;
            e3.setAttribute("data-img-src", r2), e3.setAttribute("style", "--bg-image:url(" + r2 + ");--width:" + t3.naturalWidth + "px;--height:" + (n3 = t3.naturalWidth, i2 = t3.naturalHeight, n3 < window.getComputedStyle(document.querySelector(".CodeMirror-sizer")).width.replace("px", "") ? i2 + "px" : i2 / n3 * 100 + "%")), m2.codemirror.setSize();
          }
        }, ue.prototype.cleanup = function() {
          document.removeEventListener("keydown", this.documentOnKeyDown);
        }, ue.prototype.autosave = function() {
          if (ce()) {
            var e2 = this;
            if (null == this.options.autosave.uniqueId || "" == this.options.autosave.uniqueId) return void console.log("EasyMDE: You must set a uniqueId to use the autosave feature");
            true !== this.options.autosave.binded && (null != e2.element.form && null != e2.element.form && e2.element.form.addEventListener("submit", (function() {
              clearTimeout(e2.autosaveTimeoutId), e2.autosaveTimeoutId = void 0, localStorage.removeItem("smde_" + e2.options.autosave.uniqueId);
            })), this.options.autosave.binded = true), true !== this.options.autosave.loaded && ("string" == typeof localStorage.getItem("smde_" + this.options.autosave.uniqueId) && "" != localStorage.getItem("smde_" + this.options.autosave.uniqueId) && (this.codemirror.setValue(localStorage.getItem("smde_" + this.options.autosave.uniqueId)), this.options.autosave.foundSavedValue = true), this.options.autosave.loaded = true);
            var t2 = e2.value();
            "" !== t2 ? localStorage.setItem("smde_" + this.options.autosave.uniqueId, t2) : localStorage.removeItem("smde_" + this.options.autosave.uniqueId);
            var n2 = document.getElementById("autosaved");
            if (null != n2 && null != n2 && "" != n2) {
              var i2 = /* @__PURE__ */ new Date(), r2 = new Intl.DateTimeFormat([this.options.autosave.timeFormat.locale, "en-US"], this.options.autosave.timeFormat.format).format(i2), o2 = null == this.options.autosave.text ? "Autosaved: " : this.options.autosave.text;
              n2.innerHTML = o2 + r2;
            }
          } else console.log("EasyMDE: localStorage not available, cannot autosave");
        }, ue.prototype.clearAutosavedValue = function() {
          if (ce()) {
            if (null == this.options.autosave || null == this.options.autosave.uniqueId || "" == this.options.autosave.uniqueId) return void console.log("EasyMDE: You must set a uniqueId to clear the autosave value");
            localStorage.removeItem("smde_" + this.options.autosave.uniqueId);
          } else console.log("EasyMDE: localStorage not available, cannot autosave");
        }, ue.prototype.openBrowseFileWindow = function(e2, t2) {
          var n2 = this, i2 = this.gui.toolbar.getElementsByClassName("imageInput")[0];
          i2.click(), i2.addEventListener("change", (function r2(o2) {
            n2.options.imageUploadFunction ? n2.uploadImagesUsingCustomFunction(n2.options.imageUploadFunction, o2.target.files) : n2.uploadImages(o2.target.files, e2, t2), i2.removeEventListener("change", r2);
          }));
        }, ue.prototype.uploadImage = function(e2, t2, n2) {
          var i2 = this;
          function r2(e3) {
            i2.updateStatusBar("upload-image", e3), setTimeout((function() {
              i2.updateStatusBar("upload-image", i2.options.imageTexts.sbInit);
            }), 1e4), n2 && "function" == typeof n2 && n2(e3), i2.options.errorCallback(e3);
          }
          function o2(t3) {
            var n3 = i2.options.imageTexts.sizeUnits.split(",");
            return t3.replace("#image_name#", e2.name).replace("#image_size#", Y(e2.size, n3)).replace("#image_max_size#", Y(i2.options.imageMaxSize, n3));
          }
          if (t2 = t2 || function(e3) {
            P(i2, e3);
          }, e2.size > this.options.imageMaxSize) r2(o2(this.options.errorMessages.fileTooLarge));
          else {
            var a2 = new FormData();
            a2.append("image", e2), i2.options.imageCSRFToken && !i2.options.imageCSRFHeader && a2.append(i2.options.imageCSRFName, i2.options.imageCSRFToken);
            var l2 = new XMLHttpRequest();
            l2.upload.onprogress = function(t3) {
              if (t3.lengthComputable) {
                var n3 = "" + Math.round(100 * t3.loaded / t3.total);
                i2.updateStatusBar("upload-image", i2.options.imageTexts.sbProgress.replace("#file_name#", e2.name).replace("#progress#", n3));
              }
            }, l2.open("POST", this.options.imageUploadEndpoint), i2.options.imageCSRFToken && i2.options.imageCSRFHeader && l2.setRequestHeader(i2.options.imageCSRFName, i2.options.imageCSRFToken), l2.onload = function() {
              try {
                var e3 = JSON.parse(this.responseText);
              } catch (e4) {
                return console.error("EasyMDE: The server did not return a valid json."), void r2(o2(i2.options.errorMessages.importError));
              }
              200 === this.status && e3 && !e3.error && e3.data && e3.data.filePath ? t2((i2.options.imagePathAbsolute ? "" : window.location.origin + "/") + e3.data.filePath) : e3.error && e3.error in i2.options.errorMessages ? r2(o2(i2.options.errorMessages[e3.error])) : e3.error ? r2(o2(e3.error)) : (console.error("EasyMDE: Received an unexpected response after uploading the image." + this.status + " (" + this.statusText + ")"), r2(o2(i2.options.errorMessages.importError)));
            }, l2.onerror = function(e3) {
              console.error("EasyMDE: An unexpected error occurred when trying to upload the image." + e3.target.status + " (" + e3.target.statusText + ")"), r2(i2.options.errorMessages.importError);
            }, l2.send(a2);
          }
        }, ue.prototype.uploadImageUsingCustomFunction = function(e2, t2) {
          var n2 = this;
          e2.apply(this, [t2, function(e3) {
            P(n2, e3);
          }, function(e3) {
            var i2 = (function(e4) {
              var i3 = n2.options.imageTexts.sizeUnits.split(",");
              return e4.replace("#image_name#", t2.name).replace("#image_size#", Y(t2.size, i3)).replace("#image_max_size#", Y(n2.options.imageMaxSize, i3));
            })(e3);
            n2.updateStatusBar("upload-image", i2), setTimeout((function() {
              n2.updateStatusBar("upload-image", n2.options.imageTexts.sbInit);
            }), 1e4), n2.options.errorCallback(i2);
          }]);
        }, ue.prototype.setPreviewMaxHeight = function() {
          var e2 = this.codemirror.getWrapperElement(), t2 = e2.nextSibling, n2 = parseInt(window.getComputedStyle(e2).paddingTop), i2 = parseInt(window.getComputedStyle(e2).borderTopWidth), r2 = (parseInt(this.options.maxHeight) + 2 * n2 + 2 * i2).toString() + "px";
          t2.style.height = r2;
        }, ue.prototype.createSideBySide = function() {
          var e2 = this.codemirror, t2 = e2.getWrapperElement(), n2 = t2.nextSibling;
          if (!n2 || !n2.classList.contains("editor-preview-side")) {
            if ((n2 = document.createElement("div")).className = "editor-preview-side", this.options.previewClass) if (Array.isArray(this.options.previewClass)) for (var i2 = 0; i2 < this.options.previewClass.length; i2++) n2.classList.add(this.options.previewClass[i2]);
            else "string" == typeof this.options.previewClass && n2.classList.add(this.options.previewClass);
            t2.parentNode.insertBefore(n2, t2.nextSibling);
          }
          if (void 0 !== this.options.maxHeight && this.setPreviewMaxHeight(), false === this.options.syncSideBySidePreviewScroll) return n2;
          var r2 = false, o2 = false;
          return e2.on("scroll", (function(e3) {
            if (r2) r2 = false;
            else {
              o2 = true;
              var t3 = e3.getScrollInfo().height - e3.getScrollInfo().clientHeight, i3 = parseFloat(e3.getScrollInfo().top) / t3, a2 = (n2.scrollHeight - n2.clientHeight) * i3;
              n2.scrollTop = a2;
            }
          })), n2.onscroll = function() {
            if (o2) o2 = false;
            else {
              r2 = true;
              var t3 = n2.scrollHeight - n2.clientHeight, i3 = parseFloat(n2.scrollTop) / t3, a2 = (e2.getScrollInfo().height - e2.getScrollInfo().clientHeight) * i3;
              e2.scrollTo(0, a2);
            }
          }, n2;
        }, ue.prototype.createToolbar = function(e2) {
          if ((e2 = e2 || this.options.toolbar) && 0 !== e2.length) {
            var t2;
            for (t2 = 0; t2 < e2.length; t2++) null != ne[e2[t2]] && (e2[t2] = ne[e2[t2]]);
            var n2 = document.createElement("div");
            n2.className = "editor-toolbar", n2.setAttribute("role", "toolbar");
            var i2 = this, r2 = {};
            for (i2.toolbar = e2, t2 = 0; t2 < e2.length; t2++) if (("guide" != e2[t2].name || false !== i2.options.toolbarGuideIcon) && !(i2.options.hideIcons && -1 != i2.options.hideIcons.indexOf(e2[t2].name) || ("fullscreen" == e2[t2].name || "side-by-side" == e2[t2].name) && c())) {
              if ("|" === e2[t2]) {
                for (var o2 = false, a2 = t2 + 1; a2 < e2.length; a2++) "|" === e2[a2] || i2.options.hideIcons && -1 != i2.options.hideIcons.indexOf(e2[a2].name) || (o2 = true);
                if (!o2) continue;
              }
              !(function(e3) {
                var t3;
                if (t3 = "|" === e3 ? p() : e3.children ? h(e3, i2.options.toolbarTips, i2.options.shortcuts, i2) : f(e3, true, i2.options.toolbarTips, i2.options.shortcuts, "button", i2), r2[e3.name || e3] = t3, n2.appendChild(t3), "upload-image" === e3.name) {
                  var o3 = document.createElement("input");
                  o3.className = "imageInput", o3.type = "file", o3.multiple = true, o3.name = i2.options.imageInputName, o3.accept = i2.options.imageAccept, o3.style.display = "none", o3.style.opacity = 0, n2.appendChild(o3);
                }
              })(e2[t2]);
            }
            i2.toolbar_div = n2, i2.toolbarElements = r2;
            var l2 = this.codemirror;
            l2.on("cursorActivity", (function() {
              var e3 = m(l2);
              for (var t3 in r2) !(function(t4) {
                var n3 = r2[t4];
                e3[t4] ? n3.classList.add("active") : "fullscreen" != t4 && "side-by-side" != t4 && n3.classList.remove("active");
              })(t3);
            }));
            var s2 = l2.getWrapperElement();
            return s2.parentNode.insertBefore(n2, s2), n2;
          }
        }, ue.prototype.createStatusbar = function(e2) {
          e2 = e2 || this.options.status;
          var t2 = this.options, n2 = this.codemirror;
          if (e2 && 0 !== e2.length) {
            var i2, r2, o2, a2, l2 = [];
            for (i2 = 0; i2 < e2.length; i2++) if (r2 = void 0, o2 = void 0, a2 = void 0, "object" == typeof e2[i2]) l2.push({ className: e2[i2].className, defaultValue: e2[i2].defaultValue, onUpdate: e2[i2].onUpdate, onActivity: e2[i2].onActivity });
            else {
              var s2 = e2[i2];
              "words" === s2 ? (a2 = function(e3) {
                e3.innerHTML = ee(n2.getValue());
              }, r2 = function(e3) {
                e3.innerHTML = ee(n2.getValue());
              }) : "lines" === s2 ? (a2 = function(e3) {
                e3.innerHTML = n2.lineCount();
              }, r2 = function(e3) {
                e3.innerHTML = n2.lineCount();
              }) : "cursor" === s2 ? (a2 = function(e3) {
                e3.innerHTML = "1:1";
              }, o2 = function(e3) {
                var t3 = n2.getCursor(), i3 = t3.line + 1, r3 = t3.ch + 1;
                e3.innerHTML = i3 + ":" + r3;
              }) : "autosave" === s2 ? a2 = function(e3) {
                null != t2.autosave && true === t2.autosave.enabled && e3.setAttribute("id", "autosaved");
              } : "upload-image" === s2 && (a2 = function(e3) {
                e3.innerHTML = t2.imageTexts.sbInit;
              }), l2.push({ className: s2, defaultValue: a2, onUpdate: r2, onActivity: o2 });
            }
            var u2 = document.createElement("div");
            for (u2.className = "editor-statusbar", i2 = 0; i2 < l2.length; i2++) {
              var c2 = l2[i2], d2 = document.createElement("span");
              d2.className = c2.className, "function" == typeof c2.defaultValue && c2.defaultValue(d2), "function" == typeof c2.onUpdate && this.codemirror.on("update", /* @__PURE__ */ (function(e3, t3) {
                return function() {
                  t3.onUpdate(e3);
                };
              })(d2, c2)), "function" == typeof c2.onActivity && this.codemirror.on("cursorActivity", /* @__PURE__ */ (function(e3, t3) {
                return function() {
                  t3.onActivity(e3);
                };
              })(d2, c2)), u2.appendChild(d2);
            }
            var h2 = this.codemirror.getWrapperElement();
            return h2.parentNode.insertBefore(u2, h2.nextSibling), u2;
          }
        }, ue.prototype.value = function(e2) {
          var t2 = this.codemirror;
          if (void 0 === e2) return t2.getValue();
          if (t2.getDoc().setValue(e2), this.isPreviewActive()) {
            var n2 = t2.getWrapperElement().lastChild, i2 = this.options.previewRender(e2, n2);
            null !== i2 && (n2.innerHTML = i2);
          }
          return this;
        }, ue.toggleBold = x, ue.toggleItalic = y, ue.toggleStrikethrough = b, ue.toggleBlockquote = C, ue.toggleHeadingSmaller = w, ue.toggleHeadingBigger = k, ue.toggleHeading1 = S, ue.toggleHeading2 = F, ue.toggleHeading3 = A, ue.toggleHeading4 = E, ue.toggleHeading5 = L, ue.toggleHeading6 = T, ue.toggleCodeBlock = D, ue.toggleUnorderedList = M, ue.toggleOrderedList = B, ue.toggleCheckList = N, ue.cleanBlock = O, ue.drawLink = I, ue.drawImage = z, ue.drawUploadedImage = R, ue.drawTable = _, ue.drawHorizontalRule = W, ue.undo = j, ue.redo = q, ue.togglePreview = $, ue.toggleSideBySide = U, ue.toggleFullScreen = v, ue.prototype.toggleBold = function() {
          x(this);
        }, ue.prototype.toggleItalic = function() {
          y(this);
        }, ue.prototype.toggleStrikethrough = function() {
          b(this);
        }, ue.prototype.toggleBlockquote = function() {
          C(this);
        }, ue.prototype.toggleHeadingSmaller = function() {
          w(this);
        }, ue.prototype.toggleHeadingBigger = function() {
          k(this);
        }, ue.prototype.toggleHeading1 = function() {
          S(this);
        }, ue.prototype.toggleHeading2 = function() {
          F(this);
        }, ue.prototype.toggleHeading3 = function() {
          A(this);
        }, ue.prototype.toggleHeading4 = function() {
          E(this);
        }, ue.prototype.toggleHeading5 = function() {
          L(this);
        }, ue.prototype.toggleHeading6 = function() {
          T(this);
        }, ue.prototype.toggleCodeBlock = function() {
          D(this);
        }, ue.prototype.toggleUnorderedList = function() {
          M(this);
        }, ue.prototype.toggleOrderedList = function() {
          B(this);
        }, ue.prototype.toggleCheckList = function() {
          N(this);
        }, ue.prototype.cleanBlock = function() {
          O(this);
        }, ue.prototype.drawLink = function() {
          I(this);
        }, ue.prototype.drawImage = function() {
          z(this);
        }, ue.prototype.drawUploadedImage = function() {
          R(this);
        }, ue.prototype.drawTable = function() {
          _(this);
        }, ue.prototype.drawHorizontalRule = function() {
          W(this);
        }, ue.prototype.undo = function() {
          j(this);
        }, ue.prototype.redo = function() {
          q(this);
        }, ue.prototype.togglePreview = function() {
          $(this);
        }, ue.prototype.toggleSideBySide = function() {
          U(this);
        }, ue.prototype.toggleFullScreen = function() {
          v(this);
        }, ue.prototype.isPreviewActive = function() {
          return this.codemirror.getWrapperElement().lastChild.classList.contains("editor-preview-active");
        }, ue.prototype.isSideBySideActive = function() {
          return this.codemirror.getWrapperElement().nextSibling.classList.contains("editor-preview-active-side");
        }, ue.prototype.isFullscreenActive = function() {
          return this.codemirror.getOption("fullScreen");
        }, ue.prototype.getState = function() {
          return m(this.codemirror);
        }, ue.prototype.toTextArea = function() {
          var e2 = this.codemirror, t2 = e2.getWrapperElement(), n2 = t2.parentNode;
          n2 && (this.gui.toolbar && n2.removeChild(this.gui.toolbar), this.gui.statusbar && n2.removeChild(this.gui.statusbar), this.gui.sideBySide && n2.removeChild(this.gui.sideBySide)), n2.parentNode.insertBefore(t2, n2), n2.remove(), e2.toTextArea(), this.autosaveTimeoutId && (clearTimeout(this.autosaveTimeoutId), this.autosaveTimeoutId = void 0, this.clearAutosavedValue());
        }, t.exports = ue;
      }, { "./codemirror/tablist": 17, codemirror: 10, "codemirror-spell-checker": 2, "codemirror/addon/display/autorefresh.js": 3, "codemirror/addon/display/fullscreen.js": 4, "codemirror/addon/display/placeholder.js": 5, "codemirror/addon/edit/continuelist.js": 6, "codemirror/addon/mode/overlay.js": 7, "codemirror/addon/search/searchcursor.js": 8, "codemirror/addon/selection/mark-selection.js": 9, "codemirror/mode/gfm/gfm.js": 11, "codemirror/mode/markdown/markdown.js": 12, "codemirror/mode/xml/xml.js": 14, marked: 15 }] }, {}, [18])(18);
    }));
  }
});
export default require_easymde_min();
/*! Bundled license information:

easymde/dist/easymde.min.js:
  (**
   * easymde v2.21.0
   * Copyright Jeroen Akkerman
   * @link https://github.com/ionaru/easy-markdown-editor
   * @license MIT
   *)
*/
