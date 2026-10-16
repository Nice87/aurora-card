/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, bt = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, vt = Symbol(), Mt = /* @__PURE__ */ new WeakMap();
let Vt = class {
  constructor(t, e, a) {
    if (this._$cssResult$ = !0, a !== vt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (bt && t === void 0) {
      const a = e !== void 0 && e.length === 1;
      a && (t = Mt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && Mt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Qt = (o) => new Vt(typeof o == "string" ? o : o + "", void 0, vt), g = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((a, r, i) => a + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + o[i + 1], o[0]);
  return new Vt(e, o, vt);
}, Yt = (o, t) => {
  if (bt) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const a = document.createElement("style"), r = G.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = e.cssText, o.appendChild(a);
  }
}, Rt = bt ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const a of t.cssRules) e += a.cssText;
  return Qt(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Kt, defineProperty: Xt, getOwnPropertyDescriptor: te, getOwnPropertyNames: ee, getOwnPropertySymbols: ae, getPrototypeOf: re } = Object, ct = globalThis, Tt = ct.trustedTypes, ie = Tt ? Tt.emptyScript : "", oe = ct.reactiveElementPolyfillSupport, T = (o, t) => o, J = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? ie : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, mt = (o, t) => !Kt(o, t), Nt = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: mt };
Symbol.metadata ??= Symbol("metadata"), ct.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Nt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(t, a, e);
      r !== void 0 && Xt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, a) {
    const { get: r, set: i } = te(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: r, set(s) {
      const n = r?.call(this);
      i?.call(this, s), this.requestUpdate(t, n, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const t = re(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const e = this.properties, a = [...ee(e), ...ae(e)];
      for (const r of a) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [a, r] of e) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, a] of this.elementProperties) {
      const r = this._$Eu(e, a);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const r of a) e.unshift(Rt(r));
    } else t !== void 0 && e.push(Rt(t));
    return e;
  }
  static _$Eu(t, e) {
    const a = e.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const a of e.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Yt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, a) {
    this._$AK(t, a);
  }
  _$ET(t, e) {
    const a = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, a);
    if (r !== void 0 && a.reflect === !0) {
      const i = (a.converter?.toAttribute !== void 0 ? a.converter : J).toAttribute(e, a.type);
      this._$Em = t, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const a = this.constructor, r = a._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const i = a.getPropertyOptions(r), s = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : J;
      this._$Em = r;
      const n = s.fromAttribute(e, i.type);
      this[r] = n ?? this._$Ej?.get(r) ?? n, this._$Em = null;
    }
  }
  requestUpdate(t, e, a, r = !1, i) {
    if (t !== void 0) {
      const s = this.constructor;
      if (r === !1 && (i = this[t]), a ??= s.getPropertyOptions(t), !((a.hasChanged ?? mt)(i, e) || a.useDefault && a.reflect && i === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, a)))) return;
      this.C(t, e, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: a, reflect: r, wrapped: i }, s) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), i !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, i] of this._$Ep) this[r] = i;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, i] of a) {
        const { wrapped: s } = i, n = this[r];
        s !== !0 || this._$AL.has(r) || n === void 0 || this.C(r, void 0, i, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[T("elementProperties")] = /* @__PURE__ */ new Map(), z[T("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: z }), (ct.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = globalThis, Ht = (o) => o, Q = xt.trustedTypes, Dt = Q ? Q.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Wt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Ft = "?" + k, se = `<${Ft}>`, S = document, N = () => S.createComment(""), H = (o) => o === null || typeof o != "object" && typeof o != "function", yt = Array.isArray, ne = (o) => yt(o) || typeof o?.[Symbol.iterator] == "function", ft = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ut = /-->/g, qt = />/g, A = RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), It = /'/g, Lt = /"/g, Zt = /^(?:script|style|textarea|title)$/i, ce = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), c = ce(1), P = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Bt = /* @__PURE__ */ new WeakMap(), C = S.createTreeWalker(S, 129);
function Gt(o, t) {
  if (!yt(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Dt !== void 0 ? Dt.createHTML(t) : t;
}
const le = (o, t) => {
  const e = o.length - 1, a = [];
  let r, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = R;
  for (let n = 0; n < e; n++) {
    const l = o[n];
    let d, p, h = -1, _ = 0;
    for (; _ < l.length && (s.lastIndex = _, p = s.exec(l), p !== null); ) _ = s.lastIndex, s === R ? p[1] === "!--" ? s = Ut : p[1] !== void 0 ? s = qt : p[2] !== void 0 ? (Zt.test(p[2]) && (r = RegExp("</" + p[2], "g")), s = A) : p[3] !== void 0 && (s = A) : s === A ? p[0] === ">" ? (s = r ?? R, h = -1) : p[1] === void 0 ? h = -2 : (h = s.lastIndex - p[2].length, d = p[1], s = p[3] === void 0 ? A : p[3] === '"' ? Lt : It) : s === Lt || s === It ? s = A : s === Ut || s === qt ? s = R : (s = A, r = void 0);
    const $ = s === A && o[n + 1].startsWith("/>") ? " " : "";
    i += s === R ? l + se : h >= 0 ? (a.push(d), l.slice(0, h) + Wt + l.slice(h) + k + $) : l + k + (h === -2 ? n : $);
  }
  return [Gt(o, i + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class D {
  constructor({ strings: t, _$litType$: e }, a) {
    let r;
    this.parts = [];
    let i = 0, s = 0;
    const n = t.length - 1, l = this.parts, [d, p] = le(t, e);
    if (this.el = D.createElement(d, a), C.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = C.nextNode()) !== null && l.length < n; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Wt)) {
          const _ = p[s++], $ = r.getAttribute(h).split(k), Z = /([.?@])?(.*)/.exec(_);
          l.push({ type: 1, index: i, name: Z[2], strings: $, ctor: Z[1] === "." ? pe : Z[1] === "?" ? ue : Z[1] === "@" ? he : lt }), r.removeAttribute(h);
        } else h.startsWith(k) && (l.push({ type: 6, index: i }), r.removeAttribute(h));
        if (Zt.test(r.tagName)) {
          const h = r.textContent.split(k), _ = h.length - 1;
          if (_ > 0) {
            r.textContent = Q ? Q.emptyScript : "";
            for (let $ = 0; $ < _; $++) r.append(h[$], N()), C.nextNode(), l.push({ type: 2, index: ++i });
            r.append(h[_], N());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ft) l.push({ type: 2, index: i });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(k, h + 1)) !== -1; ) l.push({ type: 7, index: i }), h += k.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const a = S.createElement("template");
    return a.innerHTML = t, a;
  }
}
function j(o, t, e = o, a) {
  if (t === P) return t;
  let r = a !== void 0 ? e._$Co?.[a] : e._$Cl;
  const i = H(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== i && (r?._$AO?.(!1), i === void 0 ? r = void 0 : (r = new i(o), r._$AT(o, e, a)), a !== void 0 ? (e._$Co ??= [])[a] = r : e._$Cl = r), r !== void 0 && (t = j(o, r._$AS(o, t.values), r, a)), t;
}
class de {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: a } = this._$AD, r = (t?.creationScope ?? S).importNode(e, !0);
    C.currentNode = r;
    let i = C.nextNode(), s = 0, n = 0, l = a[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let d;
        l.type === 2 ? d = new B(i, i.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(i, l.name, l.strings, this, t) : l.type === 6 && (d = new fe(i, this, t)), this._$AV.push(d), l = a[++n];
      }
      s !== l?.index && (i = C.nextNode(), s++);
    }
    return C.currentNode = S, r;
  }
  p(t) {
    let e = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, e), e += a.strings.length - 2) : a._$AI(t[e])), e++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, a, r) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = a, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = j(this, t, e), H(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ne(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: a } = t, r = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = D.createElement(Gt(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const i = new de(r, this), s = i.u(this.options);
      i.p(e), this.T(s), this._$AH = i;
    }
  }
  _$AC(t) {
    let e = Bt.get(t.strings);
    return e === void 0 && Bt.set(t.strings, e = new D(t)), e;
  }
  k(t) {
    yt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let a, r = 0;
    for (const i of t) r === e.length ? e.push(a = new B(this.O(N()), this.O(N()), this, this.options)) : a = e[r], a._$AI(i), r++;
    r < e.length && (this._$AR(a && a._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const a = Ht(t).nextSibling;
      Ht(t).remove(), t = a;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class lt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, a, r, i) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = i, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = v;
  }
  _$AI(t, e = this, a, r) {
    const i = this.strings;
    let s = !1;
    if (i === void 0) t = j(this, t, e, 0), s = !H(t) || t !== this._$AH && t !== P, s && (this._$AH = t);
    else {
      const n = t;
      let l, d;
      for (t = i[0], l = 0; l < i.length - 1; l++) d = j(this, n[a + l], e, l), d === P && (d = this._$AH[l]), s ||= !H(d) || d !== this._$AH[l], d === v ? t = v : t !== v && (t += (d ?? "") + i[l + 1]), this._$AH[l] = d;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class pe extends lt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class ue extends lt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
class he extends lt {
  constructor(t, e, a, r, i) {
    super(t, e, a, r, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = j(this, t, e, 0) ?? v) === P) return;
    const a = this._$AH, r = t === v && a !== v || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, i = t !== v && (a === v || r);
    r && this.element.removeEventListener(this.name, this, a), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class fe {
  constructor(t, e, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    j(this, t);
  }
}
const ge = xt.litHtmlPolyfillSupport;
ge?.(D, B), (xt.litHtmlVersions ??= []).push("3.3.3");
const be = (o, t, e) => {
  const a = e?.renderBefore ?? t;
  let r = a._$litPart$;
  if (r === void 0) {
    const i = e?.renderBefore ?? null;
    a._$litPart$ = r = new B(t.insertBefore(N(), i), i, void 0, e ?? {});
  }
  return r._$AI(o), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = globalThis;
class f extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = be(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return P;
  }
}
f._$litElement$ = !0, f.finalized = !0, _t.litElementHydrateSupport?.({ LitElement: f });
const ve = _t.litElementPolyfillSupport;
ve?.({ LitElement: f });
(_t.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const b = (o) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(o, t);
  }) : customElements.define(o, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = { attribute: !0, type: String, converter: J, reflect: !1, hasChanged: mt }, xe = (o = me, t, e) => {
  const { kind: a, metadata: r } = e;
  let i = globalThis.litPropertyMetadata.get(r);
  if (i === void 0 && globalThis.litPropertyMetadata.set(r, i = /* @__PURE__ */ new Map()), a === "setter" && ((o = Object.create(o)).wrapped = !0), i.set(e.name, o), a === "accessor") {
    const { name: s } = e;
    return { set(n) {
      const l = t.get.call(this);
      t.set.call(this, n), this.requestUpdate(s, l, o, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(s, void 0, o, n), n;
    } };
  }
  if (a === "setter") {
    const { name: s } = e;
    return function(n) {
      const l = this[s];
      t.call(this, n), this.requestUpdate(s, l, o, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function u(o) {
  return (t, e) => typeof e == "object" ? xe(o, t, e) : ((a, r, i) => {
    const s = r.hasOwnProperty(i);
    return r.constructor.createProperty(i, a), s ? Object.getOwnPropertyDescriptor(r, i) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(o) {
  return u({ ...o, state: !0, attribute: !1 });
}
function ye(o, t) {
  return !t || t.length === 0 ? !0 : t.every((e) => {
    const a = o.states[e.entity];
    if (!a)
      return !1;
    const r = a.state;
    if (e.condition === "state")
      return Array.isArray(e.state) ? e.state.includes(r) : r === e.state;
    if (e.condition === "numeric_state") {
      const i = parseFloat(r);
      return !(isNaN(i) || e.above !== void 0 && i <= e.above || e.below !== void 0 && i >= e.below);
    }
    return !0;
  });
}
const _e = {
  "Aurora Lumina": {
    "primary-color": "#818cf8",
    "accent-color": "#38bdf8",
    "primary-background-color": "#090d16",
    "secondary-background-color": "#0f172a",
    "card-background-color": "rgba(15, 23, 42, 0.68)",
    "ha-card-background": "rgba(15, 23, 42, 0.68)",
    "ha-card-border-radius": "20px",
    "ha-card-border-width": "1px",
    "ha-card-border-color": "rgba(255, 255, 255, 0.09)",
    "primary-text-color": "#f8fafc",
    "secondary-text-color": "#94a3b8",
    "aurora-card-background": "rgba(15, 23, 42, 0.68)",
    "aurora-card-backdrop-filter": "blur(22px) saturate(190%)",
    "aurora-card-border": "1px solid rgba(255, 255, 255, 0.1)",
    "aurora-card-border-radius": "20px",
    "aurora-card-shadow": "0 12px 34px 0 rgba(0, 0, 0, 0.5)",
    "aurora-surface-subtle": "rgba(255, 255, 255, 0.04)",
    "aurora-surface-hover": "rgba(255, 255, 255, 0.09)",
    "aurora-text-primary": "#f8fafc",
    "aurora-text-secondary": "#94a3b8",
    "aurora-accent-color": "#818cf8",
    "aurora-accent-glow": "rgba(129, 140, 248, 0.32)",
    "aurora-success-color": "#34d399",
    "aurora-warning-color": "#fbbf24",
    "aurora-danger-color": "#f87171"
  }
};
function $e(o) {
  !o || window.__auroraThemeRegistered || (o.connection?.sendMessage({
    type: "frontend/set_themes",
    themes: _e,
    default_theme: "Aurora Lumina"
  }).catch(() => {
  }), window.__auroraThemeRegistered = !0);
}
function w(o, t, e = {}, a = {}) {
  const r = new CustomEvent(t, {
    bubbles: a.bubbles ?? !0,
    composed: a.composed ?? !0,
    detail: e
  });
  return o.dispatchEvent(r), r;
}
function m(o, t, e, a) {
  const r = e.tap_action;
  switch (r?.action || "toggle") {
    case "toggle":
      e.entity && t.callService("homeassistant", "toggle", { entity_id: e.entity });
      break;
    case "navigate":
      r?.navigation_path && (r.navigation_path.startsWith("#") ? (window.location.hash = r.navigation_path, w(window, "location-changed", {})) : (history.pushState(null, "", r.navigation_path), w(window, "location-changed", {})));
      break;
    case "call-service":
      if (r?.service) {
        const [s, n] = r.service.split("."), l = { ...r.service_data || {} };
        e.entity && !l.entity_id && (l.entity_id = e.entity), t.callService(s, n, l);
      }
      break;
    case "more-info":
      e.entity && w(o, "hass-more-info", { entityId: e.entity });
      break;
  }
}
var V = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let E = class extends f {
  constructor() {
    super(...arguments), this._activeTab = "general", this._entitySearchFilter = "";
  }
  setConfig(t) {
    this._config = {
      card_type: "button",
      button_type: "switch",
      ...t
    };
  }
  render() {
    if (!this._config || !this.hass)
      return c``;
    const t = this._config.card_type || "button";
    this._config.button_type;
    const e = this._config.entity || "", a = this._config.name || "", r = this._config.icon || "";
    this._config.tap_action?.action;
    const i = this._config.sub_button || [], s = Object.keys(this.hass.states).sort(), n = s.filter((l) => {
      const d = (this.hass.states[l]?.attributes.friendly_name || "").toLowerCase(), p = this._entitySearchFilter.toLowerCase();
      return l.toLowerCase().includes(p) || d.includes(p);
    });
    return c`
      <div class="card-config-container">
        <div class="editor-header">
          <div class="header-titles">
            <h3>Aurora Card Studio</h3>
            <p>Modular glassmorphism card suite & module store</p>
          </div>
          <div class="editor-tabs">
            <button
              class="tab-btn ${this._activeTab === "general" ? "active" : ""}"
              @click="${() => this._activeTab = "general"}"
            >
              General
            </button>
            <button
              class="tab-btn ${this._activeTab === "subbuttons" ? "active" : ""}"
              @click="${() => this._activeTab = "subbuttons"}"
            >
              Sub-Buttons (${i.length})
            </button>
            <button
              class="tab-btn ${this._activeTab === "styles" ? "active" : ""}"
              @click="${() => this._activeTab = "styles"}"
            >
              Styles
            </button>
            <button
              class="tab-btn ${this._activeTab === "modules" ? "active" : ""}"
              @click="${() => this._activeTab = "modules"}"
            >
              Module Store 📦
            </button>
          </div>
        </div>

        ${this._activeTab === "general" ? c`
              <div class="tab-content">
                <div class="form-row">
                  <div class="form-group">
                    <label>Card Architecture</label>
                    <select
                      .value="${t}"
                      @change="${(l) => this._valueChanged(l, "card_type")}"
                    >
                      <option value="button">Button / Slider</option>
                      <option value="pop-up">Pop-up Container</option>
                      <option value="separator">Separator / Header</option>
                      <option value="cover">Cover / Shutter</option>
                      <option value="climate">Climate / HVAC</option>
                      <option value="media-player">Media Player</option>
                      <option value="energy-flow">Energy Flow Matrix</option>
                      <option value="security-matrix">Security & Camera Hub</option>
                      <option value="hvac-zoning">HVAC & Storage Heating</option>
                      <option value="mesh-topology">Zigbee / Matter Mesh</option>
                      <option value="floorplan">Interactive Floorplan</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Primary Entity Search</label>
                    <input
                      type="text"
                      placeholder="Filter entities..."
                      .value="${this._entitySearchFilter}"
                      @input="${(l) => this._entitySearchFilter = l.target.value}"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Primary Entity</label>
                  <select
                    .value="${e}"
                    @change="${(l) => this._valueChanged(l, "entity")}"
                  >
                    <option value="">-- Select Entity --</option>
                    ${n.map((l) => c`
                        <option value="${l}" ?selected="${l === e}">
                          ${this.hass.states[l]?.attributes.friendly_name || l} (${l})
                        </option>
                      `)}
                  </select>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Custom Title</label>
                    <input
                      type="text"
                      .value="${a}"
                      placeholder="Auto"
                      @input="${(l) => this._valueChanged(l, "name")}"
                    />
                  </div>
                  <div class="form-group">
                    <label>Custom Icon</label>
                    <input
                      type="text"
                      .value="${r}"
                      placeholder="mdi:lightbulb"
                      @input="${(l) => this._valueChanged(l, "icon")}"
                    />
                  </div>
                </div>
              </div>
            ` : ""}

        ${this._activeTab === "subbuttons" ? c`
              <div class="tab-content">
                <div class="sub-header-row">
                  <span>Sub-Button Stack (${i.length})</span>
                  <button class="primary-action-btn" @click="${this._addSubButton}">+ Add</button>
                </div>
                <div class="sub-list">
                  ${i.map((l, d) => c`
                      <div class="sub-item-card">
                        <select
                          .value="${l.entity || ""}"
                          @change="${(p) => this._updateSubButton(d, "entity", p.target.value)}"
                        >
                          <option value="">-- Entity --</option>
                          ${s.map((p) => c`<option value="${p}" ?selected="${p === l.entity}">${p}</option>`)}
                        </select>
                        <input
                          type="text"
                          placeholder="Icon"
                          .value="${l.icon || ""}"
                          @input="${(p) => this._updateSubButton(d, "icon", p.target.value)}"
                        />
                        <button class="danger-btn" @click="${() => this._removeSubButton(d)}">✕</button>
                      </div>
                    `)}
                </div>
              </div>
            ` : ""}

        ${this._activeTab === "styles" ? c`
              <div class="tab-content">
                <div class="form-group">
                  <label>Backdrop Blur & Card Mod</label>
                  <input
                    type="text"
                    placeholder="blur(20px) saturate(180%)"
                    @input="${(l) => this._valueChanged(l, "backdrop_blur")}"
                  />
                </div>
              </div>
            ` : ""}

        ${this._activeTab === "modules" ? c`
              <div class="tab-content">
                <div class="module-store-header">
                  <h4>Aurora Module Store 📦</h4>
                  <p>Discover and install community modules & macro packs.</p>
                </div>
                <div class="module-grid">
                  <div class="module-card-item">
                    <div class="m-info">
                      <span class="m-title">Advanced Energy Flow Pack</span>
                      <span class="m-desc">Animated battery and solar particle streams.</span>
                    </div>
                    <button class="install-btn" @click="${() => alert("Installed!")}">Install</button>
                  </div>
                </div>
              </div>
            ` : ""}
      </div>
    `;
  }
  _valueChanged(t, e) {
    if (!this._config)
      return;
    const a = t.target;
    this._config = { ...this._config, [e]: a.value || void 0 }, w(this, "config-changed", { config: this._config });
  }
  _addSubButton() {
    if (!this._config)
      return;
    const t = [...this._config.sub_button || []];
    t.push({ icon: "mdi:power", show_state: !0 }), this._config = { ...this._config, sub_button: t }, w(this, "config-changed", { config: this._config });
  }
  _updateSubButton(t, e, a) {
    if (!this._config || !this._config.sub_button)
      return;
    const r = [...this._config.sub_button];
    r[t] = { ...r[t], [e]: a || void 0 }, this._config = { ...this._config, sub_button: r }, w(this, "config-changed", { config: this._config });
  }
  _removeSubButton(t) {
    if (!this._config || !this._config.sub_button)
      return;
    const e = this._config.sub_button.filter((a, r) => r !== t);
    this._config = { ...this._config, sub_button: e }, w(this, "config-changed", { config: this._config });
  }
  static {
    this.styles = g`
    :host {
      display: block;
      color: var(--primary-text-color, #f8fafc);
      padding: 4px 0;
    }
    .card-config-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .editor-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 12px;
    }
    .header-titles h3 {
      margin: 0 0 2px 0;
      font-size: 17px;
    }
    .header-titles p {
      margin: 0;
      font-size: 12px;
      color: #94a3b8;
    }
    .editor-tabs {
      display: flex;
      gap: 6px;
    }
    .tab-btn {
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .tab-btn.active {
      background: #818cf8;
      color: #fff;
      border-color: #818cf8;
    }
    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
    }
    select, input {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #fff;
      padding: 9px 12px;
      font-size: 13px;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    select:focus, input:focus {
      border-color: #818cf8;
    }
    .sub-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
    }
    .primary-action-btn {
      background: #818cf8;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
    }
    .sub-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sub-item-card {
      display: grid;
      grid-template-columns: 1.5fr 1fr auto;
      gap: 8px;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px;
      border-radius: 10px;
    }
    .danger-btn {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 6px;
      width: 32px;
      height: 34px;
      cursor: pointer;
    }
    .module-store-header h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
    }
    .module-store-header p {
      margin: 0 0 10px 0;
      font-size: 12px;
      color: #94a3b8;
    }
    .module-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .module-card-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px;
      border-radius: 12px;
    }
    .m-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .m-title {
      font-size: 13px;
      font-weight: 600;
    }
    .m-desc {
      font-size: 11px;
      color: #94a3b8;
    }
    .install-btn {
      background: rgba(52, 211, 153, 0.2);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.4);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
    }
  `;
  }
};
V([
  u({ attribute: !1 })
], E.prototype, "hass", void 0);
V([
  y()
], E.prototype, "_config", void 0);
V([
  y()
], E.prototype, "_activeTab", void 0);
V([
  y()
], E.prototype, "_entitySearchFilter", void 0);
E = V([
  b("aurora-card-editor")
], E);
const x = g`
  :host {
    --aurora-card-background: var(--ha-card-background, var(--card-background-color, rgba(15, 23, 42, 0.68)));
    --aurora-card-backdrop-filter: blur(20px) saturate(180%);
    --aurora-card-border: 1px solid rgba(255, 255, 255, 0.09);
    --aurora-card-border-radius: var(--ha-card-border-radius, 20px);
    --aurora-card-shadow: 0 10px 32px 0 rgba(0, 0, 0, 0.42);
    --aurora-surface-subtle: rgba(255, 255, 255, 0.04);
    --aurora-surface-hover: rgba(255, 255, 255, 0.08);
    --aurora-text-primary: var(--primary-text-color, #f8fafc);
    --aurora-text-secondary: var(--secondary-text-color, #94a3b8);
    --aurora-accent-color: var(--primary-color, #818cf8);
    --aurora-accent-glow: rgba(129, 140, 248, 0.28);
    --aurora-success-color: #34d399;
    --aurora-warning-color: #fbbf24;
    --aurora-danger-color: #f87171;
  }
`;
var dt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let U = class extends f {
  constructor() {
    super(...arguments), this._sliderValue = null;
  }
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, a = e ? e.state : "unavailable", r = ["on", "open", "playing", "home", "unlocked", "active"].includes(a), i = this.config.button_type || "switch", s = this.config.name || e?.attributes.friendly_name || "Aurora Button", n = this.config.icon || e?.attributes.icon || "mdi:radiobox-marked", l = this._getEntityPercentage(e), d = this._sliderValue !== null ? this._sliderValue : l;
    return c`
      <ha-card class="${r ? "is-on" : "is-off"} mode-${i}">
        ${i === "slider" ? c`
              <div class="slider-fill" style="width: ${d}%"></div>
              <input
                type="range"
                class="range-input"
                min="0"
                max="100"
                .value="${String(d)}"
                @input="${this._onSliderInput}"
                @change="${this._onSliderChange}"
              />
            ` : ""}

        <div class="card-content" @click="${this._onMainClick}">
          <div class="icon-container ${r ? "active" : ""}" @click="${this._onIconClick}">
            <ha-icon .icon="${n}"></ha-icon>
          </div>

          <div class="info-container">
            <span class="title">${s}</span>
            <div class="secondary-line">
              ${this.config.show_state !== !1 && e ? c`<span class="state">${a}</span>` : ""}
              ${i === "slider" ? c`<span class="percent-badge">${Math.round(d)}%</span>` : ""}
              ${this.config.show_attribute && this.config.attribute && e?.attributes[this.config.attribute] !== void 0 ? c`<span class="attr">• ${e.attributes[this.config.attribute]}</span>` : ""}
            </div>
          </div>

          ${this.config.sub_button && this.config.sub_button.length > 0 ? c`
                <div class="sub-buttons-stack" @click="${(p) => p.stopPropagation()}">
                  ${this.config.sub_button.map((p) => this._renderSubButton(p))}
                </div>
              ` : ""}
        </div>
      </ha-card>
    `;
  }
  _renderSubButton(t) {
    const e = t.entity ? this.hass.states[t.entity] : void 0, a = e && ["on", "open", "playing", "active"].includes(e.state), r = t.icon || e?.attributes.icon || "mdi:circle-medium";
    return c`
      <button
        class="sub-btn ${a ? "sub-on" : ""} ${t.show_background === !1 ? "no-bg" : ""}"
        @click="${() => m(this, this.hass, t)}"
        title="${t.name || e?.attributes.friendly_name || ""}"
      >
        <ha-icon .icon="${r}"></ha-icon>
        ${t.show_state && e ? c`<span class="sub-state">${e.state}</span>` : ""}
        ${t.name ? c`<span class="sub-state">${t.name}</span>` : ""}
      </button>
    `;
  }
  _getEntityPercentage(t) {
    return t ? t.attributes.brightness !== void 0 ? Math.round(t.attributes.brightness / 255 * 100) : t.attributes.percentage !== void 0 ? Number(t.attributes.percentage) : t.attributes.current_position !== void 0 ? Number(t.attributes.current_position) : t.attributes.volume_level !== void 0 ? Math.round(Number(t.attributes.volume_level) * 100) : t.state === "on" ? 100 : 0 : 0;
  }
  _onSliderInput(t) {
    t.stopPropagation();
    const e = t.target;
    this._sliderValue = Number(e.value);
  }
  _onSliderChange(t) {
    t.stopPropagation();
    const e = t.target, a = Number(e.value);
    if (this._sliderValue = null, !this.config.entity)
      return;
    const r = this.config.entity.split(".")[0];
    r === "light" ? this.hass.callService("light", "turn_on", {
      entity_id: this.config.entity,
      brightness_pct: a
    }) : r === "fan" ? this.hass.callService("fan", "set_percentage", {
      entity_id: this.config.entity,
      percentage: a
    }) : r === "cover" ? this.hass.callService("cover", "set_cover_position", {
      entity_id: this.config.entity,
      position: a
    }) : r === "media_player" && this.hass.callService("media_player", "volume_set", {
      entity_id: this.config.entity,
      volume_level: a / 100
    });
  }
  _onIconClick(t) {
    t.stopPropagation(), this.config.entity && m(this, this.hass, { entity: this.config.entity, tap_action: { action: "more-info" } });
  }
  _onMainClick() {
    if (this.config.button_type === "slider")
      return;
    const t = this.config.button_type === "state" ? "more-info" : "toggle", e = {
      ...this.config,
      tap_action: this.config.tap_action || { action: t }
    };
    m(this, this.hass, e);
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        position: relative;
        overflow: hidden;
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 12px 16px;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--aurora-card-shadow);
        user-select: none;
      }
      ha-card.is-on {
        border-color: var(--aurora-accent-color);
        box-shadow: 0 8px 28px 0 var(--aurora-accent-glow);
      }
      .slider-fill {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: linear-gradient(90deg, var(--aurora-accent-glow) 0%, rgba(129, 140, 248, 0.38) 100%);
        pointer-events: none;
        transition: width 0.1s ease-out;
        z-index: 0;
      }
      .range-input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: ew-resize;
        z-index: 2;
        margin: 0;
      }
      .card-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .icon-container {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        transition: all 0.25s ease;
        flex-shrink: 0;
      }
      .icon-container.active {
        background: var(--aurora-accent-color);
        color: #ffffff;
        box-shadow: 0 0 16px var(--aurora-accent-glow);
      }
      .info-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      .title {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .secondary-line {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .percent-badge {
        font-weight: 600;
        color: var(--aurora-accent-color);
      }
      .sub-buttons-stack {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
      }
      .sub-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 36px;
        min-width: 36px;
        padding: 0 10px;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
      }
      .sub-btn.sub-on {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
        color: #ffffff;
      }
      .sub-btn.no-bg {
        background: transparent;
        border-color: transparent;
      }
      .sub-btn:hover {
        transform: scale(1.05);
      }
    `
    ];
  }
};
dt([
  u({ attribute: !1 })
], U.prototype, "hass", void 0);
dt([
  u({ attribute: !1 })
], U.prototype, "config", void 0);
dt([
  y()
], U.prototype, "_sliderValue", void 0);
U = dt([
  b("aurora-button-card")
], U);
var $t = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let Y = class extends f {
  render() {
    if (!this.config)
      return c``;
    const t = this.config.name || "Section", e = this.config.icon;
    return c`
      <div class="separator-wrapper">
        ${e ? c`
              <div class="sep-icon">
                <ha-icon .icon="${e}"></ha-icon>
              </div>
            ` : ""}
        <span class="sep-title">${t}</span>
        <div class="sep-line"></div>
        ${this.config.sub_button && this.config.sub_button.length > 0 ? c`
              <div class="sep-sub-buttons">
                ${this.config.sub_button.map((a) => {
      const r = a.entity ? this.hass?.states[a.entity] : void 0;
      return c`
                    <button
                      class="sep-sub-btn"
                      @click="${() => m(this, this.hass, a)}"
                    >
                      ${a.icon ? c`<ha-icon .icon="${a.icon}"></ha-icon>` : ""}
                      ${a.show_state && r ? c`<span>${r.state}</span>` : ""}
                    </button>
                  `;
    })}
              </div>
            ` : ""}
      </div>
    `;
  }
  static {
    this.styles = [
      x,
      g`
      .separator-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 4px;
        color: var(--aurora-text-primary);
      }
      .sep-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--aurora-accent-color);
      }
      .sep-title {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.4px;
        white-space: nowrap;
      }
      .sep-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.18) 0%,
          rgba(255, 255, 255, 0.03) 100%
        );
      }
      .sep-sub-buttons {
        display: flex;
        gap: 6px;
      }
      .sep-sub-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 14px;
        background: var(--aurora-card-background);
        border: var(--aurora-card-border);
        color: var(--aurora-text-secondary);
        font-size: 12px;
        cursor: pointer;
      }
    `
    ];
  }
};
$t([
  u({ attribute: !1 })
], Y.prototype, "hass", void 0);
$t([
  u({ attribute: !1 })
], Y.prototype, "config", void 0);
Y = $t([
  b("aurora-separator-card")
], Y);
var Jt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let gt = class extends f {
  render() {
    return c`<div class="empty-column"></div>`;
  }
  static {
    this.styles = g`
    :host {
      display: block;
    }
    .empty-column {
      min-height: 1px;
      width: 100%;
      background: transparent;
    }
  `;
  }
};
Jt([
  u({ attribute: !1 })
], gt.prototype, "config", void 0);
gt = Jt([
  b("aurora-empty-column-card")
], gt);
var W = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let O = class extends f {
  constructor() {
    super(...arguments), this._isOpen = !1, this._childCards = [], this._boundHashListener = () => this._checkHash();
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("hashchange", this._boundHashListener), window.addEventListener("location-changed", this._boundHashListener), this._checkHash();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("hashchange", this._boundHashListener), window.removeEventListener("location-changed", this._boundHashListener), this._clearTimer();
  }
  updated(t) {
    t.has("config") && this.config?.cards && this._buildChildCards(), t.has("hass") && this._childCards.length > 0 && this._childCards.forEach((e) => {
      e && (e.hass = this.hass);
    });
  }
  async _buildChildCards() {
    if (!this.config?.cards || !Array.isArray(this.config.cards)) {
      this._childCards = [];
      return;
    }
    const t = await window.loadCardHelpers?.(), e = [];
    for (const a of this.config.cards)
      try {
        let r;
        if (t)
          r = await t.createCardElement(a);
        else {
          const i = a.type.startsWith("custom:") ? a.type.replace("custom:", "") : `hui-${a.type}-card`;
          r = document.createElement(i), r.setConfig && r.setConfig(a);
        }
        this.hass && (r.hass = this.hass), e.push(r);
      } catch (r) {
        console.error("Aurora Pop-up child card error:", r);
      }
    this._childCards = e;
  }
  _checkHash() {
    const t = this.config?.hash || "#aurora-popup", e = t.startsWith("#") ? t : `#${t}`, a = window.location.hash === e;
    a !== this._isOpen && (this._isOpen = a, this._isOpen && this.config?.auto_close ? (this._clearTimer(), this._autoCloseTimer = window.setTimeout(() => {
      this._closePopUp();
    }, this.config.auto_close)) : this._clearTimer());
  }
  _clearTimer() {
    this._autoCloseTimer && (clearTimeout(this._autoCloseTimer), this._autoCloseTimer = void 0);
  }
  _closePopUp() {
    this._clearTimer(), window.location.hash === (this.config?.hash || "#aurora-popup") && (history.replaceState(null, "", window.location.pathname + window.location.search), w(window, "location-changed", {})), this._isOpen = !1;
  }
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.hash || "#aurora-popup", e = this.config.entity ? this.hass.states[this.config.entity] : void 0, a = this.config.name || e?.attributes.friendly_name || "Aurora Pop-up", r = this.config.icon || e?.attributes.icon || "mdi:layers-triple-outline";
    return c`
      <!-- Compact trigger bar always visible in editor or dashboard to open the Pop-up -->
      <div class="popup-trigger-bar" @click="${() => this._openPopUp(t)}">
        <div class="trigger-left">
          <ha-icon .icon="${r}"></ha-icon>
          <span>${a}</span>
          <span class="hash-pill">${t}</span>
        </div>
        <ha-icon icon="mdi:arrow-expand-all"></ha-icon>
      </div>

      ${this._isOpen ? c`
            <div
              class="popup-backdrop"
              style="--popup-blur: ${this.config.backdrop_blur ?? 18}px"
              @click="${this._closePopUp}"
            >
              <div
                class="popup-sheet"
                @click="${(i) => {
      i.stopPropagation(), this.config.close_on_click && this._closePopUp();
    }}"
              >
                <div class="sheet-handle-bar" @click="${this._closePopUp}">
                  <div class="sheet-pill"></div>
                </div>

                <div class="sheet-header">
                  <div class="header-main" @click="${() => m(this, this.hass, this.config)}">
                    <div class="header-icon">
                      <ha-icon .icon="${r}"></ha-icon>
                    </div>
                    <div class="header-titles">
                      <span class="header-name">${a}</span>
                      ${e ? c`<span class="header-state">${e.state}</span>` : ""}
                    </div>
                  </div>

                  <button class="close-btn" @click="${this._closePopUp}">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <div class="sheet-body">
                  ${this._childCards.length > 0 ? this._childCards.map((i) => c`<div class="child-card-slot">${i}</div>`) : c`
                        <div class="empty-hint">
                          Pop-up active (${t}). Add child cards via the <code>cards:</code> array in YAML or the editor.
                        </div>
                      `}
                </div>
              </div>
            </div>
          ` : ""}
    `;
  }
  _openPopUp(t) {
    const e = t.startsWith("#") ? t : `#${t}`;
    window.location.hash = e, w(window, "location-changed", {});
  }
  static {
    this.styles = [
      x,
      g`
      .popup-trigger-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-radius: var(--aurora-card-border-radius);
        background: var(--aurora-card-background);
        border: 1px dashed rgba(129, 140, 248, 0.35);
        color: var(--aurora-text-primary);
        cursor: pointer;
        font-size: 13px;
      }
      .trigger-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .hash-pill {
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        font-family: monospace;
        font-size: 11px;
      }
      .popup-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(8, 12, 24, 0.65);
        backdrop-filter: blur(var(--popup-blur, 18px)) saturate(160%);
        -webkit-backdrop-filter: blur(var(--popup-blur, 18px)) saturate(160%);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        animation: fadeIn 0.22s ease-out;
      }
      @media (min-width: 768px) {
        .popup-backdrop {
          align-items: center;
        }
      }
      .popup-sheet {
        width: 100%;
        max-width: 540px;
        max-height: 86vh;
        background: var(--aurora-card-background);
        border: var(--aurora-card-border);
        border-radius: 28px 28px 0 0;
        padding: 12px 18px 24px 18px;
        box-shadow: 0 -10px 50px rgba(0, 0, 0, 0.65);
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
        animation: slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @media (min-width: 768px) {
        .popup-sheet {
          border-radius: 28px;
        }
      }
      .sheet-handle-bar {
        display: flex;
        justify-content: center;
        padding: 4px 0;
        cursor: pointer;
      }
      .sheet-pill {
        width: 42px;
        height: 5px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.25);
      }
      .sheet-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .header-main {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .header-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .header-titles {
        display: flex;
        flex-direction: column;
      }
      .header-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--aurora-text-primary);
      }
      .header-state {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .close-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .sheet-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .empty-hint {
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: var(--aurora-text-secondary);
        border: 1px dashed rgba(255, 255, 255, 0.15);
        border-radius: 14px;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(40px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `
    ];
  }
};
W([
  u({ attribute: !1 })
], O.prototype, "hass", void 0);
W([
  u({ attribute: !1 })
], O.prototype, "config", void 0);
W([
  y()
], O.prototype, "_isOpen", void 0);
W([
  y()
], O.prototype, "_childCards", void 0);
O = W([
  b("aurora-pop-up-card")
], O);
var pt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let q = class extends f {
  constructor() {
    super(...arguments), this._dragPos = null;
  }
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, a = e ? e.state : "unavailable", r = e?.attributes.current_position ?? (a === "open" ? 100 : 0), i = this._dragPos !== null ? this._dragPos : r, s = this.config.name || e?.attributes.friendly_name || "Cover", n = this.config.icon || e?.attributes.icon || (i > 0 ? "mdi:window-shutter-open" : "mdi:window-shutter");
    return c`
      <ha-card>
        <div class="cover-top">
          <div class="cover-identity" @click="${() => m(this, this.hass, { entity: t, tap_action: { action: "more-info" } })}">
            <div class="cover-icon ${i > 0 ? "open" : ""}">
              <ha-icon .icon="${n}"></ha-icon>
            </div>
            <div class="cover-meta">
              <span class="title">${s}</span>
              <span class="subtitle">${a} •${Math.round(i)}%</span>
            </div>
          </div>

          <div class="cover-actions">
            <button class="ctrl-btn" @click="${() => this._callCover("open_cover")}" title="Open">
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button class="ctrl-btn" @click="${() => this._callCover("stop_cover")}" title="Stop">
              <ha-icon icon="mdi:stop"></ha-icon>
            </button>
            <button class="ctrl-btn" @click="${() => this._callCover("close_cover")}" title="Close">
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
          </div>
        </div>

        <div class="position-rail">
          <div class="position-fill" style="width: ${i}%"></div>
          <input
            type="range"
            min="0"
            max="100"
            .value="${String(i)}"
            @input="${(l) => {
      this._dragPos = Number(l.target.value);
    }}"
            @change="${(l) => {
      const d = Number(l.target.value);
      this._dragPos = null, t && this.hass.callService("cover", "set_cover_position", {
        entity_id: t,
        position: d
      });
    }}"
          />
        </div>
      </ha-card>
    `;
  }
  _callCover(t) {
    this.config.entity && this.hass.callService("cover", t, { entity_id: this.config.entity });
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 14px 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .cover-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .cover-identity {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        min-width: 0;
      }
      .cover-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cover-icon.open {
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
      }
      .cover-meta {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .cover-actions {
        display: flex;
        gap: 6px;
      }
      .ctrl-btn {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.05);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .ctrl-btn:hover {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
      }
      .position-rail {
        position: relative;
        height: 10px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .position-fill {
        height: 100%;
        background: var(--aurora-accent-color);
        border-radius: 5px;
        transition: width 0.1s ease;
      }
      .position-rail input[type='range'] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: ew-resize;
        margin: 0;
      }
    `
    ];
  }
};
pt([
  u({ attribute: !1 })
], q.prototype, "hass", void 0);
pt([
  u({ attribute: !1 })
], q.prototype, "config", void 0);
pt([
  y()
], q.prototype, "_dragPos", void 0);
q = pt([
  b("aurora-cover-card")
], q);
var wt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let K = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, a = e ? e.state : "off", r = e?.attributes.hvac_action || a, i = e?.attributes.current_temperature ?? "--", s = e?.attributes.temperature ?? 20, n = this.config.step || e?.attributes.target_temp_step || 0.5, l = e?.attributes.hvac_modes || ["off", "heat", "auto"], d = this.config.name || e?.attributes.friendly_name || "Climate", p = this.config.icon || e?.attributes.icon || "mdi:thermostat";
    return c`
      <ha-card class="mode-${a}">
        <div class="climate-header">
          <div
            class="climate-id"
            @click="${() => m(this, this.hass, { entity: t, tap_action: { action: "more-info" } })}"
          >
            <div class="climate-icon ${r}">
              <ha-icon .icon="${p}"></ha-icon>
            </div>
            <div class="climate-titles">
              <span class="title">${d}</span>
              <span class="subtitle">${r} • Current: ${i}°</span>
            </div>
          </div>

          <div class="temp-stepper">
            <button class="step-btn" @click="${() => this._adjustTemp(Number(s) - n)}">
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <span class="target-val">${s}°</span>
            <button class="step-btn" @click="${() => this._adjustTemp(Number(s) + n)}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>

        <div class="hvac-modes-bar">
          ${l.map((h) => c`
              <button
                class="mode-pill ${h === a ? "active" : ""}"
                @click="${() => this._setHvacMode(h)}"
              >
                ${h}
              </button>
            `)}
        </div>
      </ha-card>
    `;
  }
  _adjustTemp(t) {
    this.config.entity && this.hass.callService("climate", "set_temperature", {
      entity_id: this.config.entity,
      temperature: t
    });
  }
  _setHvacMode(t) {
    this.config.entity && this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this.config.entity,
      hvac_mode: t
    });
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 14px 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      ha-card.mode-heat {
        border-color: rgba(249, 115, 22, 0.45);
      }
      ha-card.mode-cool {
        border-color: rgba(56, 189, 248, 0.45);
      }
      .climate-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .climate-id {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .climate-icon {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .climate-icon.heating,
      .climate-icon.heat {
        background: rgba(249, 115, 22, 0.2);
        color: #fb923c;
      }
      .climate-icon.cooling,
      .climate-icon.cool {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
      }
      .climate-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .temp-stepper {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.05);
        padding: 4px 8px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .step-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.08);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .step-btn:hover {
        background: var(--aurora-accent-color);
      }
      .target-val {
        font-size: 15px;
        font-weight: 700;
        min-width: 38px;
        text-align: center;
      }
      .hvac-modes-bar {
        display: flex;
        gap: 6px;
      }
      .mode-pill {
        flex: 1;
        padding: 6px 0;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        color: var(--aurora-text-secondary);
        font-size: 12px;
        font-weight: 600;
        text-transform: capitalize;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .mode-pill.active {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
        color: #ffffff;
      }
    `
    ];
  }
};
wt([
  u({ attribute: !1 })
], K.prototype, "hass", void 0);
wt([
  u({ attribute: !1 })
], K.prototype, "config", void 0);
K = wt([
  b("aurora-climate-card")
], K);
var ut = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let I = class extends f {
  constructor() {
    super(...arguments), this._volDrag = null;
  }
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, a = e ? e.state : "off", r = a === "playing", i = e?.attributes.media_title || this.config.name || e?.attributes.friendly_name || "Media Player", s = e?.attributes.media_artist || a, n = e?.attributes.entity_picture, l = this._volDrag !== null ? this._volDrag : Math.round((e?.attributes.volume_level ?? 0.5) * 100);
    return c`
      <ha-card class="${r ? "playing" : ""}">
        ${n ? c`<div class="artwork-bg" style="background-image: url('${n}')"></div>` : ""}

        <div class="media-content">
          <div class="media-top">
            <div
              class="album-thumb"
              @click="${() => m(this, this.hass, { entity: t, tap_action: { action: "more-info" } })}"
            >
              ${n ? c`<img src="${n}" alt="Album Art" />` : c`<ha-icon icon="mdi:music-note"></ha-icon>`}
            </div>

            <div class="track-info">
              <span class="track-title">${i}</span>
              <span class="track-artist">${s}</span>
            </div>

            <div class="transport-controls">
              <button class="t-btn" @click="${() => this._mediaCmd("media_previous_track")}">
                <ha-icon icon="mdi:skip-previous"></ha-icon>
              </button>
              <button class="t-btn play-btn" @click="${() => this._mediaCmd("media_play_pause")}">
                <ha-icon .icon="${r ? "mdi:pause" : "mdi:play"}"></ha-icon>
              </button>
              <button class="t-btn" @click="${() => this._mediaCmd("media_next_track")}">
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </button>
            </div>
          </div>

          <div class="volume-row">
            <ha-icon icon="mdi:volume-medium"></ha-icon>
            <div class="vol-slider-wrap">
              <div class="vol-fill" style="width: ${l}%"></div>
              <input
                type="range"
                min="0"
                max="100"
                .value="${String(l)}"
                @input="${(d) => {
      this._volDrag = Number(d.target.value);
    }}"
                @change="${(d) => {
      const p = Number(d.target.value);
      this._volDrag = null, t && this.hass.callService("media_player", "volume_set", {
        entity_id: t,
        volume_level: p / 100
      });
    }}"
              />
            </div>
            <span class="vol-pct">${l}%</span>
          </div>
        </div>
      </ha-card>
    `;
  }
  _mediaCmd(t) {
    this.config.entity && this.hass.callService("media_player", t, { entity_id: this.config.entity });
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        position: relative;
        overflow: hidden;
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 14px 16px;
        box-shadow: var(--aurora-card-shadow);
      }
      ha-card.playing {
        border-color: var(--aurora-accent-color);
      }
      .artwork-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        filter: blur(26px) brightness(0.45);
        transform: scale(1.15);
        z-index: 0;
        opacity: 0.65;
      }
      .media-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .media-top {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .album-thumb {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
      }
      .album-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .track-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      .track-title {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .track-artist {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
      }
      .transport-controls {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .t-btn {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.08);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .t-btn.play-btn {
        width: 40px;
        height: 40px;
        background: var(--aurora-accent-color);
        color: #ffffff;
      }
      .volume-row {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--aurora-text-secondary);
        font-size: 12px;
      }
      .vol-slider-wrap {
        position: relative;
        flex: 1;
        height: 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }
      .vol-fill {
        height: 100%;
        background: var(--aurora-accent-color);
      }
      .vol-slider-wrap input[type='range'] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: ew-resize;
        margin: 0;
      }
      .vol-pct {
        min-width: 32px;
        text-align: right;
      }
    `
    ];
  }
};
ut([
  u({ attribute: !1 })
], I.prototype, "hass", void 0);
ut([
  u({ attribute: !1 })
], I.prototype, "config", void 0);
ut([
  y()
], I.prototype, "_volDrag", void 0);
I = ut([
  b("aurora-media-card")
], I);
var F = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let M = class extends f {
  constructor() {
    super(...arguments), this._executing = !1, this._currentStepIndex = 0;
  }
  setConfig(t) {
    this.config = t;
  }
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0, e = this.config.name || t?.attributes.friendly_name || "Routine Macro", a = this.config.icon || t?.attributes.icon || "mdi:flash-auto", r = this.config.macro_steps || [], i = r.length > 0 ? r.length : 1, s = this._executing ? Math.round((this._currentStepIndex + 1) / i * 100) : 0;
    return c`
      <ha-card class="${this._executing ? "is-running" : ""}" @click="${this._runSequence}">
        <div class="progress-bar" style="width: ${s}%"></div>

        <div class="macro-container">
          <div class="icon-wrapper ${this._executing ? "pulse" : ""}">
            <ha-icon .icon="${this._executing ? "mdi:loading" : a}"></ha-icon>
          </div>

          <div class="macro-info">
            <span class="title">${e}</span>
            <span class="subtitle">
              ${this._executing ? `Executing step ${this._currentStepIndex + 1} of ${i}...` : r.length > 0 ? `${r.length} sequential actions ready` : t ? `Target: ${t.entity_id}` : "Tap to trigger macro"}
            </span>
          </div>

          <div class="badge-pill">
            ${this._executing ? `${s}%` : "RUN"}
          </div>
        </div>
      </ha-card>
    `;
  }
  async _runSequence() {
    if (this._executing || !this.hass || !this.config)
      return;
    this._executing = !0, this._currentStepIndex = 0;
    const t = this.config.macro_steps && this.config.macro_steps.length > 0 ? this.config.macro_steps : [
      {
        service: this.config.tap_action?.service || (this.config.entity?.startsWith("scene.") ? "scene.turn_on" : "homeassistant.toggle"),
        entity_id: this.config.entity,
        data: this.config.tap_action?.service_data
      }
    ];
    try {
      for (let e = 0; e < t.length; e++) {
        this._currentStepIndex = e;
        const a = t[e];
        if (a.service) {
          const [r, i] = a.service.split("."), s = { ...a.data || {} };
          a.entity_id && !s.entity_id && (s.entity_id = a.entity_id), await this.hass.callService(r, i, s);
        }
        a.delay_ms && a.delay_ms > 0 && await new Promise((r) => setTimeout(r, a.delay_ms));
      }
    } catch (e) {
      console.error("Aurora Routine Macro execution error:", e);
    } finally {
      setTimeout(() => {
        this._executing = !1, this._currentStepIndex = 0;
      }, 700);
    }
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        position: relative;
        overflow: hidden;
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 14px 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--aurora-card-shadow);
      }
      ha-card:hover,
      ha-card.is-running {
        border-color: var(--aurora-accent-color);
        box-shadow: 0 10px 32px 0 var(--aurora-accent-glow);
      }
      .progress-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3px;
        background: var(--aurora-accent-color);
        transition: width 0.25s ease;
      }
      .macro-container {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .icon-wrapper {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .pulse ha-icon {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }
      .macro-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
        min-width: 0;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .badge-pill {
        padding: 5px 12px;
        border-radius: 14px;
        background: rgba(129, 140, 248, 0.18);
        border: 1px solid rgba(129, 140, 248, 0.35);
        color: var(--aurora-accent-color);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.6px;
      }
    `
    ];
  }
};
F([
  u({ attribute: !1 })
], M.prototype, "hass", void 0);
F([
  u({ attribute: !1 })
], M.prototype, "config", void 0);
F([
  y()
], M.prototype, "_executing", void 0);
F([
  y()
], M.prototype, "_currentStepIndex", void 0);
M = F([
  b("aurora-routine-macro-card")
], M);
var kt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let X = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this._readVal(this.config.solar_entity), e = this._readVal(this.config.grid_entity || this.config.entity), a = this._readVal(this.config.battery_entity), r = this.config.home_entity ? this._readVal(this.config.home_entity) : Math.max(0, t + e), i = this.config.tariff_entity ? this.hass.states[this.config.tariff_entity]?.state : void 0, s = this.config.name || "Energy Flow Matrix";
    return c`
      <ha-card>
        <div class="energy-header">
          <div class="header-left">
            <ha-icon .icon="${this.config.icon || "mdi:transmission-tower"}"></ha-icon>
            <span class="title">${s}</span>
          </div>
          ${i ? c`<span class="tariff-badge">${i}</span>` : c`<span class="tariff-badge">Live Telemetry</span>`}
        </div>

        <div class="flow-grid">
          <!-- Solar Node -->
          <div
            class="node solar ${t > 0 ? "active" : ""}"
            @click="${() => this._openMoreInfo(this.config.solar_entity)}"
          >
            <ha-icon icon="mdi:solar-power-variant"></ha-icon>
            <span class="node-label">Solar</span>
            <span class="node-val">${t} W</span>
          </div>

          <!-- Grid Node -->
          <div
            class="node grid ${e !== 0 ? "active" : ""}"
            @click="${() => this._openMoreInfo(this.config.grid_entity || this.config.entity)}"
          >
            <ha-icon icon="mdi:transmission-tower"></ha-icon>
            <span class="node-label">${e < 0 ? "Export" : "Grid"}</span>
            <span class="node-val">${Math.abs(e)} W</span>
          </div>

          <!-- Home Consumption Node -->
          <div
            class="node home active"
            @click="${() => this._openMoreInfo(this.config.home_entity)}"
          >
            <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
            <span class="node-label">Home</span>
            <span class="node-val">${r} W</span>
          </div>

          <!-- Battery / Storage Node -->
          <div
            class="node battery ${a > 0 ? "active" : ""}"
            @click="${() => this._openMoreInfo(this.config.battery_entity)}"
          >
            <ha-icon icon="mdi:battery-charging-80"></ha-icon>
            <span class="node-label">Storage</span>
            <span class="node-val">${a}${this.config.battery_entity?.includes("soc") ? "%" : " W"}</span>
          </div>
        </div>

        <div class="distribution-bar">
          <div
            class="seg solar-seg"
            style="flex: ${Math.max(1, t)}"
            title="Solar Contribution"
          ></div>
          <div
            class="seg grid-seg"
            style="flex: ${Math.max(1, Math.abs(e))}"
            title="Grid Contribution"
          ></div>
        </div>
      </ha-card>
    `;
  }
  _readVal(t) {
    if (!t || !this.hass.states[t])
      return 0;
    const e = parseFloat(this.hass.states[t].state);
    return isNaN(e) ? 0 : Math.round(e);
  }
  _openMoreInfo(t) {
    t && m(this, this.hass, { entity: t, tap_action: { action: "more-info" } });
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .energy-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--aurora-accent-color);
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        color: var(--aurora-text-primary);
      }
      .tariff-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 12px;
        background: rgba(16, 185, 129, 0.16);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      .flow-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }
      .node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 10px 6px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.07);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .node:hover {
        transform: translateY(-2px);
        border-color: var(--aurora-accent-color);
      }
      .node.solar.active ha-icon {
        color: #facc15;
      }
      .node.grid.active ha-icon {
        color: #38bdf8;
      }
      .node.home.active ha-icon {
        color: var(--aurora-accent-color);
      }
      .node.battery.active ha-icon {
        color: #34d399;
      }
      .node-label {
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .node-val {
        font-size: 13px;
        font-weight: 700;
      }
      .distribution-bar {
        display: flex;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
        gap: 3px;
        background: rgba(255, 255, 255, 0.06);
      }
      .solar-seg {
        background: #facc15;
      }
      .grid-seg {
        background: #38bdf8;
      }
    `
    ];
  }
};
kt([
  u({ attribute: !1 })
], X.prototype, "hass", void 0);
kt([
  u({ attribute: !1 })
], X.prototype, "config", void 0);
X = kt([
  b("aurora-energy-flow-card")
], X);
var ht = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let L = class extends f {
  constructor() {
    super(...arguments), this._selectedCamIndex = 0;
  }
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.cameras && this.config.cameras.length > 0 ? this.config.cameras : this.config.entity ? [this.config.entity] : [], e = t[this._selectedCamIndex] || t[0], a = e ? this.hass.states[e] : void 0, r = a?.attributes.entity_picture, i = this.config.alarm_entity, s = i ? this.hass.states[i]?.state : void 0, n = this.config.doorbell_chime_entity ? this.hass.states[this.config.doorbell_chime_entity] : void 0, l = this.config.doorbell_motion_entity ? this.hass.states[this.config.doorbell_motion_entity] : void 0;
    return c`
      <ha-card>
        <div class="sec-header">
          <div class="sec-title-group">
            <ha-icon .icon="${this.config.icon || "mdi:shield-home"}"></ha-icon>
            <div class="sec-titles">
              <span class="title">${this.config.name || "Security & Perimeter Hub"}</span>
              <span class="subtitle">
                ${s ? `Alarm: ${s.replace("_", " ")}` : "Perimeter Active"}
              </span>
            </div>
          </div>

          ${t.length > 1 ? c`
                <div class="cam-tabs">
                  ${t.map((d, p) => c`
                      <button
                        class="cam-tab ${p === this._selectedCamIndex ? "active" : ""}"
                        @click="${() => this._selectedCamIndex = p}"
                      >
                        Cam ${p + 1}
                      </button>
                    `)}
                </div>
              ` : ""}
        </div>

        <!-- Camera / Doorbell Viewport -->
        <div
          class="camera-viewport"
          @click="${() => e && m(this, this.hass, { entity: e, tap_action: { action: "more-info" } })}"
        >
          ${r ? c`<img src="${r}" alt="${e}" />` : c`
                <div class="cam-fallback">
                  <ha-icon icon="mdi:cctv"></ha-icon>
                  <span>${a?.attributes.friendly_name || e || "Camera Stream Ready"}</span>
                </div>
              `}
          <div class="live-pill">
            <span class="dot"></span>
            LIVE
          </div>
        </div>

        <!-- Doorbell / Perimeter Status Pills (Chime, Entryway Doorbell, Motion) -->
        <div class="telemetry-pills">
          ${e ? c`
                <div
                  class="t-pill"
                  @click="${() => m(this, this.hass, { entity: e, tap_action: { action: "more-info" } })}"
                >
                  <ha-icon icon="mdi:doorbell-video"></ha-icon>
                  <span>${a?.attributes.friendly_name || "Entryway Doorbell"}: ${a?.state || "Ready"}</span>
                </div>
              ` : ""}
          ${n ? c`
                <div
                  class="t-pill"
                  @click="${() => m(this, this.hass, { entity: n.entity_id, tap_action: { action: "toggle" } })}"
                >
                  <ha-icon icon="mdi:bell-ring-outline"></ha-icon>
                  <span>Chime: ${n.state}</span>
                </div>
              ` : ""}
          ${l ? c`
                <div class="t-pill ${l.state === "on" ? "alert" : ""}">
                  <ha-icon icon="mdi:motion-sensor"></ha-icon>
                  <span>Motion: ${l.state}</span>
                </div>
              ` : ""}
        </div>

        ${i ? c`
              <div class="alarm-actions">
                <button @click="${() => this._setAlarm("alarm_arm_home")}">Arm Home</button>
                <button @click="${() => this._setAlarm("alarm_arm_away")}">Arm Away</button>
                <button class="disarm" @click="${() => this._setAlarm("alarm_disarm")}">Disarm</button>
              </div>
            ` : ""}
      </ha-card>
    `;
  }
  _setAlarm(t) {
    this.config.alarm_entity && this.hass.callService("alarm_control_panel", t, {
      entity_id: this.config.alarm_entity
    });
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .sec-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sec-title-group {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--aurora-accent-color);
      }
      .sec-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        color: var(--aurora-text-primary);
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .cam-tabs {
        display: flex;
        gap: 6px;
      }
      .cam-tab {
        padding: 4px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: var(--aurora-text-secondary);
        font-size: 11px;
        cursor: pointer;
      }
      .cam-tab.active {
        background: var(--aurora-accent-color);
        color: #ffffff;
        border-color: var(--aurora-accent-color);
      }
      .camera-viewport {
        position: relative;
        height: 165px;
        border-radius: 14px;
        overflow: hidden;
        background: rgba(10, 14, 24, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .camera-viewport img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .cam-fallback {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        color: var(--aurora-text-secondary);
        font-size: 12px;
      }
      .live-pill {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 9px;
        border-radius: 10px;
        background: rgba(239, 68, 68, 0.85);
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ffffff;
      }
      .telemetry-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .t-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 12px;
        cursor: pointer;
      }
      .t-pill.alert {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.5);
        color: #fca5a5;
      }
      .alarm-actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .alarm-actions button {
        padding: 8px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .alarm-actions button:hover {
        background: var(--aurora-accent-color);
      }
    `
    ];
  }
};
ht([
  u({ attribute: !1 })
], L.prototype, "hass", void 0);
ht([
  u({ attribute: !1 })
], L.prototype, "config", void 0);
ht([
  y()
], L.prototype, "_selectedCamIndex", void 0);
L = ht([
  b("aurora-security-matrix-card")
], L);
var At = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let tt = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity || "weather.home", e = this.hass.states[t], a = e ? e.state : "partlycloudy", r = e?.attributes.temperature ?? "--", i = e?.attributes.humidity ?? "--", s = e?.attributes.wind_speed ?? "--", n = this.config.dew_point_entity ? this.hass.states[this.config.dew_point_entity]?.state : this._calcDewPoint(Number(r), Number(i)), l = this.config.vpd_entity ? this.hass.states[this.config.vpd_entity]?.state : this._calcVpd(Number(r), Number(i)), d = this.config.discomfort_entity ? this.hass.states[this.config.discomfort_entity]?.state : this._calcThomDi(Number(r), Number(i));
    return c`
      <ha-card
        @click="${() => m(this, this.hass, { entity: t, tap_action: { action: "more-info" } })}"
      >
        <div class="weather-top">
          <div class="weather-main">
            <div class="weather-icon">
              <ha-icon .icon="${this.config.icon || "mdi:weather-partly-cloudy"}"></ha-icon>
            </div>
            <div class="weather-primary">
              <span class="title">${this.config.name || e?.attributes.friendly_name || "Atmosphere & Microclimate"}</span>
              <span class="condition-text">${a} • Wind ${s} km/h</span>
            </div>
          </div>

          <div class="temp-readout">${r}°</div>
        </div>

        <div class="microclimate-grid">
          <div class="metric-box">
            <span class="m-label">Humidity</span>
            <span class="m-val">${i}%</span>
          </div>
          <div class="metric-box">
            <span class="m-label">Dew Point</span>
            <span class="m-val">${n}°C</span>
          </div>
          <div class="metric-box">
            <span class="m-label">VPD</span>
            <span class="m-val">${l} kPa</span>
          </div>
          <div class="metric-box">
            <span class="m-label">Thom DI</span>
            <span class="m-val">${d}</span>
          </div>
        </div>
      </ha-card>
    `;
  }
  _calcDewPoint(t, e) {
    if (isNaN(t) || isNaN(e) || e <= 0)
      return "--";
    const a = 17.27, r = 237.7, i = a * t / (r + t) + Math.log(e / 100);
    return (r * i / (a - i)).toFixed(1);
  }
  _calcVpd(t, e) {
    return isNaN(t) || isNaN(e) ? "--" : (0.61078 * Math.exp(17.27 * t / (t + 237.3)) * (1 - e / 100)).toFixed(2);
  }
  _calcThomDi(t, e) {
    return isNaN(t) || isNaN(e) ? "--" : (t - 0.55 * (1 - 0.01 * e) * (t - 14.5)).toFixed(1);
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
        cursor: pointer;
      }
      .weather-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .weather-main {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .weather-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .weather-primary {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .condition-text {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .temp-readout {
        font-size: 26px;
        font-weight: 700;
        color: var(--aurora-accent-color);
      }
      .microclimate-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      .metric-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 6px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.07);
      }
      .m-label {
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .m-val {
        font-size: 13px;
        font-weight: 700;
        margin-top: 2px;
      }
    `
    ];
  }
};
At([
  u({ attribute: !1 })
], tt.prototype, "hass", void 0);
At([
  u({ attribute: !1 })
], tt.prototype, "config", void 0);
tt = At([
  b("aurora-weather-radar-card")
], tt);
var Ct = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let et = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, a = e?.state === "playing", r = e?.attributes.media_title || this.config.name || e?.attributes.friendly_name || "Music Assistant Matrix", i = e?.attributes.media_artist || e?.state || "Idle", s = this.config.speaker_entities && this.config.speaker_entities.length > 0 ? this.config.speaker_entities : t ? [t] : [], n = e?.attributes.group_members || [];
    return c`
      <ha-card>
        <div class="ma-header">
          <div class="ma-icon ${a ? "active" : ""}">
            <ha-icon .icon="${this.config.icon || "mdi:speaker-multiple"}"></ha-icon>
          </div>
          <div class="ma-meta">
            <span class="title">${r}</span>
            <span class="subtitle">${i}</span>
          </div>
          <button
            class="play-toggle"
            @click="${() => t && this.hass.callService("media_player", "media_play_pause", { entity_id: t })}"
          >
            <ha-icon .icon="${a ? "mdi:pause" : "mdi:play"}"></ha-icon>
          </button>
        </div>

        <div class="zones-list">
          ${s.map((l) => {
      const d = this.hass.states[l];
      if (!d)
        return c``;
      const p = Math.round((d.attributes.volume_level ?? 0.4) * 100), h = n.includes(l) || l === t;
      return c`
              <div class="zone-row">
                <button
                  class="join-btn ${h ? "joined" : ""}"
                  @click="${() => this._toggleSpeakerJoin(l, h)}"
                  title="Join / Unjoin Zone"
                >
                  <ha-icon .icon="${h ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}"></ha-icon>
                </button>
                <span class="zone-name">${d.attributes.friendly_name || l}</span>
                <input
                  type="range"
                  class="zone-slider"
                  min="0"
                  max="100"
                  .value="${String(p)}"
                  @change="${(_) => {
        const $ = Number(_.target.value);
        this.hass.callService("media_player", "volume_set", {
          entity_id: l,
          volume_level: $ / 100
        });
      }}"
                />
                <span class="zone-vol">${p}%</span>
              </div>
            `;
    })}
        </div>
      </ha-card>
    `;
  }
  _toggleSpeakerJoin(t, e) {
    const a = this.config.entity;
    !a || t === a || (e ? this.hass.callService("media_player", "unjoin", { entity_id: t }) : this.hass.callService("media_player", "join", {
      entity_id: a,
      group_members: [t]
    }));
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .ma-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ma-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ma-icon.active {
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
      }
      .ma-meta {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      .title {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .play-toggle {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: none;
        background: var(--aurora-accent-color);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .zones-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .zone-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .join-btn {
        background: transparent;
        border: none;
        color: var(--aurora-text-secondary);
        cursor: pointer;
        padding: 0;
        display: flex;
      }
      .join-btn.joined {
        color: var(--aurora-accent-color);
      }
      .zone-name {
        font-size: 12px;
        font-weight: 500;
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .zone-slider {
        flex: 1;
        accent-color: var(--aurora-accent-color);
        cursor: ew-resize;
      }
      .zone-vol {
        font-size: 11px;
        color: var(--aurora-text-secondary);
        min-width: 30px;
        text-align: right;
      }
    `
    ];
  }
};
Ct([
  u({ attribute: !1 })
], et.prototype, "hass", void 0);
Ct([
  u({ attribute: !1 })
], et.prototype, "config", void 0);
et = Ct([
  b("aurora-multi-room-audio-card")
], et);
var St = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let at = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.zone_entities && this.config.zone_entities.length > 0 ? this.config.zone_entities : this.config.entity ? [this.config.entity] : Object.keys(this.hass.states).filter((r) => r.startsWith("climate.")).slice(0, 4), e = this.config.charging_window || "00:30 – 04:30", a = this._checkOffPeakWindow(e);
    return c`
      <ha-card>
        <div class="zoning-header">
          <div class="header-left">
            <div class="hvac-badge-icon">
              <ha-icon .icon="${this.config.icon || "mdi:radiator"}"></ha-icon>
            </div>
            <div class="header-titles">
              <span class="title">${this.config.name || "HVAC & Storage Zoning"}</span>
              <span class="subtitle">${t.length} Active Thermal Zones</span>
            </div>
          </div>

          <div class="window-pill ${a ? "charging" : ""}">
            <ha-icon icon="mdi:clock-bolt-outline"></ha-icon>
            <span>${e}</span>
          </div>
        </div>

        <div class="zones-grid">
          ${t.map((r) => {
      const i = this.hass.states[r];
      if (!i)
        return c``;
      const s = i.attributes.friendly_name || r, n = i.attributes.current_temperature ?? "--", l = i.attributes.temperature ?? 20, d = i.state, p = i.attributes.hvac_action === "heating" || d === "heat" || d === "boost";
      return c`
              <div class="zone-card ${p ? "heating" : ""}">
                <div
                  class="zone-info"
                  @click="${() => m(this, this.hass, { entity: r, tap_action: { action: "more-info" } })}"
                >
                  <span class="z-name">${s}</span>
                  <span class="z-status">${d} • Now ${n}°C</span>
                </div>

                <div class="zone-controls">
                  <button class="z-step" @click="${() => this._stepZoneTemp(r, Number(l) - 0.5)}">
                    <ha-icon icon="mdi:minus"></ha-icon>
                  </button>
                  <span class="z-target">${l}°</span>
                  <button class="z-step" @click="${() => this._stepZoneTemp(r, Number(l) + 0.5)}">
                    <ha-icon icon="mdi:plus"></ha-icon>
                  </button>
                </div>
              </div>
            `;
    })}
        </div>
      </ha-card>
    `;
  }
  _stepZoneTemp(t, e) {
    this.hass.callService("climate", "set_temperature", {
      entity_id: t,
      temperature: e
    });
  }
  _checkOffPeakWindow(t) {
    const e = /* @__PURE__ */ new Date(), a = e.getHours() * 60 + e.getMinutes();
    return t.includes("00:30") && t.includes("04:30") ? a >= 30 && a <= 270 : !1;
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .zoning-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .hvac-badge-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .header-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .window-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 12px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 11px;
        font-weight: 600;
        color: var(--aurora-text-secondary);
      }
      .window-pill.charging {
        background: rgba(52, 211, 153, 0.16);
        border-color: rgba(52, 211, 153, 0.4);
        color: var(--aurora-success-color);
      }
      .zones-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .zone-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: 14px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.2s ease;
      }
      .zone-card.heating {
        border-color: rgba(251, 146, 60, 0.4);
        background: rgba(251, 146, 60, 0.08);
      }
      .zone-info {
        display: flex;
        flex-direction: column;
        cursor: pointer;
      }
      .z-name {
        font-size: 13px;
        font-weight: 600;
      }
      .z-status {
        font-size: 11px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .zone-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .z-step {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .z-step:hover {
        background: var(--aurora-accent-color);
      }
      .z-target {
        font-size: 14px;
        font-weight: 700;
        min-width: 34px;
        text-align: center;
      }
    `
    ];
  }
};
St([
  u({ attribute: !1 })
], at.prototype, "hass", void 0);
St([
  u({ attribute: !1 })
], at.prototype, "config", void 0);
at = St([
  b("aurora-hvac-zoning-card")
], at);
var zt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let rt = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this._collectMeshNodes(), e = t.length > 0 ? Math.round(t.reduce((r, i) => r + i.lqi, 0) / t.length) : 255, a = this.config.coordinator_entity ? this.hass.states[this.config.coordinator_entity]?.state : "Online";
    return c`
      <ha-card>
        <div class="mesh-header">
          <div class="mesh-id">
            <div class="mesh-icon">
              <ha-icon .icon="${this.config.icon || "mdi:hubspot"}"></ha-icon>
            </div>
            <div class="mesh-titles">
              <span class="title">${this.config.name || "Zigbee2MQTT & Matter Mesh"}</span>
              <span class="subtitle">Coordinator: ${a} • Avg LQI ${e}</span>
            </div>
          </div>

          <span class="node-count-pill">${t.length} Nodes</span>
        </div>

        <div class="mesh-list">
          ${t.slice(0, 6).map((r) => {
      const i = Math.min(100, Math.round(r.lqi / 255 * 100)), s = i > 60 ? "good" : i > 30 ? "fair" : "weak";
      return c`
              <div
                class="mesh-row"
                @click="${() => m(this, this.hass, { entity: r.entity_id, tap_action: { action: "more-info" } })}"
              >
                <span class="proto-tag ${r.protocol.toLowerCase()}">${r.protocol}</span>
                <span class="node-name">${r.name}</span>
                <div class="lqi-bar-wrap">
                  <div class="lqi-bar ${s}" style="width: ${i}%"></div>
                </div>
                <span class="lqi-num">${r.lqi}</span>
              </div>
            `;
    })}
        </div>
      </ha-card>
    `;
  }
  _collectMeshNodes() {
    const t = [];
    for (const [e, a] of Object.entries(this.hass.states))
      if (e.endsWith("_linkquality") || a.attributes.linkquality !== void 0) {
        const r = Number(a.attributes.linkquality !== void 0 ? a.attributes.linkquality : a.state);
        isNaN(r) || t.push({
          entity_id: e,
          name: (a.attributes.friendly_name || e).replace(/ linkquality$/i, ""),
          lqi: r,
          protocol: "Zigbee"
        });
      } else (e.includes("matter") || e.includes("thread")) && t.push({
        entity_id: e,
        name: a.attributes.friendly_name || e,
        lqi: a.state === "unavailable" ? 0 : 220,
        protocol: "Matter"
      });
    return t.sort((e, a) => e.lqi - a.lqi);
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .mesh-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mesh-id {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .mesh-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .mesh-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .node-count-pill {
        padding: 4px 10px;
        border-radius: 12px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 11px;
        font-weight: 600;
      }
      .mesh-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .mesh-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 10px;
        border-radius: 10px;
        background: var(--aurora-surface-subtle);
        cursor: pointer;
        font-size: 12px;
      }
      .proto-tag {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 6px;
        text-transform: uppercase;
      }
      .proto-tag.zigbee {
        background: rgba(251, 191, 36, 0.18);
        color: var(--aurora-warning-color);
      }
      .proto-tag.matter {
        background: rgba(56, 189, 248, 0.18);
        color: #38bdf8;
      }
      .node-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .lqi-bar-wrap {
        width: 64px;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .lqi-bar.good {
        height: 100%;
        background: var(--aurora-success-color);
      }
      .lqi-bar.fair {
        height: 100%;
        background: var(--aurora-warning-color);
      }
      .lqi-bar.weak {
        height: 100%;
        background: var(--aurora-danger-color);
      }
      .lqi-num {
        min-width: 28px;
        text-align: right;
        font-weight: 600;
        color: var(--aurora-text-secondary);
      }
    `
    ];
  }
};
zt([
  u({ attribute: !1 })
], rt.prototype, "hass", void 0);
zt([
  u({ attribute: !1 })
], rt.prototype, "config", void 0);
rt = zt([
  b("aurora-mesh-topology-card")
], rt);
var Pt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let it = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0, e = Math.min(100, Math.max(0, Number(t?.state || 0))), a = this.config.power_entity && this.hass.states[this.config.power_entity]?.state || "0", r = this.config.charger_switch_entity || this.config.entity, i = r && this.hass.states[r]?.state === "on" || Number(a) > 10;
    return c`
      <ha-card class="${i ? "charging" : ""}">
        <div class="ev-top">
          <div
            class="ev-id"
            @click="${() => m(this, this.hass, { entity: this.config.entity, tap_action: { action: "more-info" } })}"
          >
            <div class="ev-icon">
              <ha-icon .icon="${this.config.icon || "mdi:ev-station"}"></ha-icon>
            </div>
            <div class="ev-titles">
              <span class="title">${this.config.name || t?.attributes.friendly_name || "Smart Charger Hub"}</span>
              <span class="subtitle">${i ? `Charging • ${a} W` : "Standby"}</span>
            </div>
          </div>

          <button class="charge-btn ${i ? "active" : ""}" @click="${this._toggleCharge}">
            ${i ? "STOP" : "CHARGE"}
          </button>
        </div>

        <div class="soc-bar-container">
          <div class="soc-bar-fill" style="width: ${e}%"></div>
          <span class="soc-label">Battery SoC: ${isNaN(e) ? "--" : `${e}%`}</span>
        </div>
      </ha-card>
    `;
  }
  _toggleCharge() {
    const t = this.config.charger_switch_entity || this.config.entity;
    t && this.hass.callService("homeassistant", "toggle", { entity_id: t });
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      ha-card.charging {
        border-color: var(--aurora-success-color);
      }
      .ev-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ev-id {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .ev-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(52, 211, 153, 0.16);
        color: var(--aurora-success-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ev-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .charge-btn {
        padding: 6px 14px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: var(--aurora-surface-subtle);
        color: var(--aurora-text-primary);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      .charge-btn.active {
        background: var(--aurora-success-color);
        border-color: var(--aurora-success-color);
        color: #064e3b;
      }
      .soc-bar-container {
        position: relative;
        height: 26px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .soc-bar-fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(52, 211, 153, 0.35), rgba(52, 211, 153, 0.75));
        transition: width 0.3s ease;
      }
      .soc-label {
        position: relative;
        z-index: 1;
        font-size: 12px;
        font-weight: 700;
      }
    `
    ];
  }
};
Pt([
  u({ attribute: !1 })
], it.prototype, "hass", void 0);
Pt([
  u({ attribute: !1 })
], it.prototype, "config", void 0);
it = Pt([
  b("aurora-ev-charger-card")
], it);
var jt = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let ot = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this._getState(this.config.co2_entity || this.config.entity, "420"), e = this._getState(this.config.pm25_entity, "6"), a = this._getState(this.config.humidity_entity, "48"), r = this._getState(this.config.air_density_entity, "1.204"), s = parseFloat(t) > 1e3 ? "Ventilate Soon" : "Optimal Air Quality";
    return c`
      <ha-card
        @click="${() => m(this, this.hass, { entity: this.config.entity, tap_action: { action: "more-info" } })}"
      >
        <div class="aq-header">
          <div class="aq-left">
            <div class="aq-icon">
              <ha-icon .icon="${this.config.icon || "mdi:air-filter"}"></ha-icon>
            </div>
            <div class="aq-titles">
              <span class="title">${this.config.name || "Air Quality & Density Matrix"}</span>
              <span class="subtitle">${s}</span>
            </div>
          </div>
        </div>

        <div class="aq-metrics">
          <div class="aq-box">
            <span class="lbl">CO₂</span>
            <span class="val">${t} ppm</span>
          </div>
          <div class="aq-box">
            <span class="lbl">PM2.5</span>
            <span class="val">${e} µg/m³</span>
          </div>
          <div class="aq-box">
            <span class="lbl">Humidity</span>
            <span class="val">${a}%</span>
          </div>
          <div class="aq-box">
            <span class="lbl">Air Density</span>
            <span class="val">${r} kg/m³</span>
          </div>
        </div>
      </ha-card>
    `;
  }
  _getState(t, e = "--") {
    return !t || !this.hass.states[t] ? e : this.hass.states[t].state;
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
        cursor: pointer;
      }
      .aq-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .aq-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .aq-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .aq-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .aq-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      .aq-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 6px;
        border-radius: 12px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .lbl {
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .val {
        font-size: 12px;
        font-weight: 700;
        margin-top: 2px;
      }
    `
    ];
  }
};
jt([
  u({ attribute: !1 })
], ot.prototype, "hass", void 0);
jt([
  u({ attribute: !1 })
], ot.prototype, "config", void 0);
ot = jt([
  b("aurora-air-quality-matrix-card")
], ot);
var Et = function(o, t, e, a) {
  var r = arguments.length, i = r < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, e) : a, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(o, t, e, a);
  else for (var n = o.length - 1; n >= 0; n--) (s = o[n]) && (i = (r < 3 ? s(i) : r > 3 ? s(t, e, i) : s(t, e)) || i);
  return r > 3 && i && Object.defineProperty(t, e, i), i;
};
let st = class extends f {
  render() {
    if (!this.config || !this.hass)
      return c``;
    const t = this.config.hotspots && this.config.hotspots.length > 0 ? this.config.hotspots : this.config.entity ? [{ entity: this.config.entity, x: 50, y: 50, icon: this.config.icon || "mdi:lightbulb" }] : [];
    return c`
      <ha-card>
        <div class="fp-header">
          <ha-icon .icon="${this.config.icon || "mdi:floor-plan"}"></ha-icon>
          <span class="title">${this.config.name || "Interactive Zone Floorplan"}</span>
        </div>

        <div
          class="fp-canvas"
          style="${this.config.image_url ? `background-image: url('${this.config.image_url}')` : ""}"
        >
          ${this.config.image_url ? "" : c`
                <div class="fp-grid-lines">
                  <div class="room-box">Living Room</div>
                  <div class="room-box">Kitchen</div>
                  <div class="room-box">Hall</div>
                  <div class="room-box">Bedroom</div>
                </div>
              `}

          ${t.map((e) => {
      const a = this.hass.states[e.entity], r = a && ["on", "open", "playing", "detected"].includes(a.state), i = e.icon || a?.attributes.icon || "mdi:radiobox-marked";
      return c`
              <button
                class="hotspot-pin ${r ? "active" : ""}"
                style="left: ${e.x}%; top: ${e.y}%"
                @click="${() => this._onHotspotClick(e)}"
                title="${e.name || a?.attributes.friendly_name || e.entity}"
              >
                <ha-icon .icon="${i}"></ha-icon>
              </button>
            `;
    })}
        </div>
      </ha-card>
    `;
  }
  _onHotspotClick(t) {
    if (t.hash) {
      window.location.hash = t.hash.startsWith("#") ? t.hash : `#${t.hash}`, w(window, "location-changed", {});
      return;
    }
    m(this, this.hass, { entity: t.entity, tap_action: { action: "toggle" } });
  }
  static {
    this.styles = [
      x,
      g`
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .fp-header {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--aurora-accent-color);
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        color: var(--aurora-text-primary);
      }
      .fp-canvas {
        position: relative;
        height: 190px;
        border-radius: 14px;
        background-color: rgba(10, 15, 28, 0.75);
        background-size: cover;
        background-position: center;
        border: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .fp-grid-lines {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        width: 100%;
        height: 100%;
      }
      .room-box {
        border: 1px dashed rgba(255, 255, 255, 0.08);
        padding: 10px;
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .hotspot-pin {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(15, 23, 42, 0.85);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.25s ease;
      }
      .hotspot-pin.active {
        background: var(--aurora-accent-color);
        border-color: #ffffff;
        color: #ffffff;
        box-shadow: 0 0 18px var(--aurora-accent-glow);
      }
    `
    ];
  }
};
Et([
  u({ attribute: !1 })
], st.prototype, "hass", void 0);
Et([
  u({ attribute: !1 })
], st.prototype, "config", void 0);
st = Et([
  b("aurora-interactive-floorplan-card")
], st);
var we = Object.defineProperty, ke = Object.getOwnPropertyDescriptor, Ot = (o, t, e, a) => {
  for (var r = a > 1 ? void 0 : a ? ke(t, e) : t, i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (r = (a ? s(t, e, r) : s(r)) || r);
  return a && r && we(t, e, r), r;
};
let nt = class extends f {
  setConfig(o) {
    if (!o)
      throw new Error("Invalid Aurora Card configuration");
    this._config = {
      card_type: "button",
      ...o
    };
  }
  getCardSize() {
    return this._config?.card_type === "empty-column" ? 0 : [
      "media-player",
      "climate",
      "energy-flow",
      "security-matrix",
      "weather-radar",
      "multi-room-audio",
      "hvac-zoning",
      "mesh-topology",
      "floorplan"
    ].includes(this._config?.card_type || "") ? 3 : 1;
  }
  static getConfigElement() {
    return document.createElement("aurora-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:aurora-card",
      card_type: "button",
      button_type: "switch",
      entity: "light.living_room",
      name: "Living Room",
      icon: "mdi:ceiling-light"
    };
  }
  updated(o) {
    super.updated(o), this.hass && $e(this.hass);
  }
  render() {
    if (!this._config || !this.hass) return c``;
    if (!ye(this.hass, this._config.visibility))
      return this.style.display = "none", c``;
    switch (this.style.display = "block", this._config.card_type) {
      case "pop-up":
        return c`<aurora-pop-up-card .hass="${this.hass}" .config="${this._config}"></aurora-pop-up-card>`;
      case "separator":
        return c`<aurora-separator-card .hass="${this.hass}" .config="${this._config}"></aurora-separator-card>`;
      case "cover":
        return c`<aurora-cover-card .hass="${this.hass}" .config="${this._config}"></aurora-cover-card>`;
      case "climate":
        return c`<aurora-climate-card .hass="${this.hass}" .config="${this._config}"></aurora-climate-card>`;
      case "media-player":
        return c`<aurora-media-card .hass="${this.hass}" .config="${this._config}"></aurora-media-card>`;
      case "empty-column":
        return c`<aurora-empty-column-card .config="${this._config}"></aurora-empty-column-card>`;
      case "routine-macro":
        return c`<aurora-routine-macro-card .hass="${this.hass}" .config="${this._config}"></aurora-routine-macro-card>`;
      case "energy-flow":
        return c`<aurora-energy-flow-card .hass="${this.hass}" .config="${this._config}"></aurora-energy-flow-card>`;
      case "security-matrix":
        return c`<aurora-security-matrix-card .hass="${this.hass}" .config="${this._config}"></aurora-security-matrix-card>`;
      case "weather-radar":
        return c`<aurora-weather-radar-card .hass="${this.hass}" .config="${this._config}"></aurora-weather-radar-card>`;
      case "multi-room-audio":
        return c`<aurora-multi-room-audio-card .hass="${this.hass}" .config="${this._config}"></aurora-multi-room-audio-card>`;
      case "hvac-zoning":
        return c`<aurora-hvac-zoning-card .hass="${this.hass}" .config="${this._config}"></aurora-hvac-zoning-card>`;
      case "mesh-topology":
        return c`<aurora-mesh-topology-card .hass="${this.hass}" .config="${this._config}"></aurora-mesh-topology-card>`;
      case "ev-charger":
        return c`<aurora-ev-charger-card .hass="${this.hass}" .config="${this._config}"></aurora-ev-charger-card>`;
      case "air-quality":
        return c`<aurora-air-quality-matrix-card .hass="${this.hass}" .config="${this._config}"></aurora-air-quality-matrix-card>`;
      case "floorplan":
        return c`<aurora-interactive-floorplan-card .hass="${this.hass}" .config="${this._config}"></aurora-interactive-floorplan-card>`;
      case "button":
      default:
        return c`<aurora-button-card .hass="${this.hass}" .config="${this._config}"></aurora-button-card>`;
    }
  }
};
Ot([
  u({ attribute: !1 })
], nt.prototype, "hass", 2);
Ot([
  y()
], nt.prototype, "_config", 2);
nt = Ot([
  b("aurora-card")
], nt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "aurora-card",
  name: "Aurora Card",
  description: "High-performance modular glassmorphism card suite for Home Assistant.",
  preview: !0
});
export {
  nt as AuroraCard
};
//# sourceMappingURL=aurora-card.js.map
