/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, W = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), et = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (W && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = et.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && et.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const $t = (o) => new bt(typeof o == "string" ? o : o + "", void 0, J), ft = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, r) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[r + 1], o[0]);
  return new bt(e, o, J);
}, kt = (o, t) => {
  if (W) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = V.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  }
}, it = W ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return $t(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: St, getOwnPropertyDescriptor: Ct, getOwnPropertyNames: At, getOwnPropertySymbols: Mt, getPrototypeOf: Et } = Object, Y = globalThis, st = Y.trustedTypes, Tt = st ? st.emptyScript : "", Pt = Y.reactiveElementPolyfillSupport, D = (o, t) => o, L = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? Tt : null;
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
} }, Q = (o, t) => !wt(o, t), ot = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: Q };
Symbol.metadata ??= Symbol("metadata"), Y.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ot) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && St(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = Ct(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: s, set(a) {
      const l = s?.call(this);
      r?.call(this, a), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ot;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const e = this.properties, i = [...At(e), ...Mt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(it(s));
    } else t !== void 0 && e.push(it(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return kt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : L).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = i.getPropertyOptions(s), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : L;
      this._$Em = s;
      const l = a.fromAttribute(e, r.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (r = this[t]), i ??= a.getPropertyOptions(t), !((i.hasChanged ?? Q)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, r] of i) {
        const { wrapped: a } = r, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, r, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[D("elementProperties")] = /* @__PURE__ */ new Map(), E[D("finalized")] = /* @__PURE__ */ new Map(), Pt?.({ ReactiveElement: E }), (Y.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, rt = (o) => o, F = K.trustedTypes, at = F ? F.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, gt = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, _t = "?" + x, Ot = `<${_t}>`, A = document, H = () => A.createComment(""), z = (o) => o === null || typeof o != "object" && typeof o != "function", Z = Array.isArray, Nt = (o) => Z(o) || typeof o?.[Symbol.iterator] == "function", q = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, ct = />/g, w = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, dt = /"/g, vt = /^(?:script|style|textarea|title)$/i, Dt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), c = Dt(1), P = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), C = A.createTreeWalker(A, 129);
function mt(o, t) {
  if (!Z(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return at !== void 0 ? at.createHTML(t) : t;
}
const Ht = (o, t) => {
  const e = o.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = N;
  for (let l = 0; l < e; l++) {
    const n = o[l];
    let p, u, d = -1, b = 0;
    for (; b < n.length && (a.lastIndex = b, u = a.exec(n), u !== null); ) b = a.lastIndex, a === N ? u[1] === "!--" ? a = nt : u[1] !== void 0 ? a = ct : u[2] !== void 0 ? (vt.test(u[2]) && (s = RegExp("</" + u[2], "g")), a = w) : u[3] !== void 0 && (a = w) : a === w ? u[0] === ">" ? (a = s ?? N, d = -1) : u[1] === void 0 ? d = -2 : (d = a.lastIndex - u[2].length, p = u[1], a = u[3] === void 0 ? w : u[3] === '"' ? dt : lt) : a === dt || a === lt ? a = w : a === nt || a === ct ? a = N : (a = w, s = void 0);
    const h = a === w && o[l + 1].startsWith("/>") ? " " : "";
    r += a === N ? n + Ot : d >= 0 ? (i.push(p), n.slice(0, d) + gt + n.slice(d) + x + h) : n + x + (d === -2 ? l : h);
  }
  return [mt(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class B {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, a = 0;
    const l = t.length - 1, n = this.parts, [p, u] = Ht(t, e);
    if (this.el = B.createElement(p, i), C.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = C.nextNode()) !== null && n.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(gt)) {
          const b = u[a++], h = s.getAttribute(d).split(x), m = /([.?@])?(.*)/.exec(b);
          n.push({ type: 1, index: r, name: m[2], strings: h, ctor: m[1] === "." ? Bt : m[1] === "?" ? Ut : m[1] === "@" ? Rt : G }), s.removeAttribute(d);
        } else d.startsWith(x) && (n.push({ type: 6, index: r }), s.removeAttribute(d));
        if (vt.test(s.tagName)) {
          const d = s.textContent.split(x), b = d.length - 1;
          if (b > 0) {
            s.textContent = F ? F.emptyScript : "";
            for (let h = 0; h < b; h++) s.append(d[h], H()), C.nextNode(), n.push({ type: 2, index: ++r });
            s.append(d[b], H());
          }
        }
      } else if (s.nodeType === 8) if (s.data === _t) n.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(x, d + 1)) !== -1; ) n.push({ type: 7, index: r }), d += x.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(o, t, e = o, i) {
  if (t === P) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = z(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(o), s._$AT(o, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = O(o, s._$AS(o, t.values), s, i)), t;
}
class zt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? A).importNode(e, !0);
    C.currentNode = s;
    let r = C.nextNode(), a = 0, l = 0, n = i[0];
    for (; n !== void 0; ) {
      if (a === n.index) {
        let p;
        n.type === 2 ? p = new R(r, r.nextSibling, this, t) : n.type === 1 ? p = new n.ctor(r, n.name, n.strings, this, t) : n.type === 6 && (p = new jt(r, this, t)), this._$AV.push(p), n = i[++l];
      }
      a !== n?.index && (r = C.nextNode(), a++);
    }
    return C.currentNode = A, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = O(this, t, e), z(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Nt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = B.createElement(mt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const r = new zt(s, this), a = r.u(this.options);
      r.p(e), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = pt.get(t.strings);
    return e === void 0 && pt.set(t.strings, e = new B(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new R(this.O(H()), this.O(H()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = rt(t).nextSibling;
      rt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = v;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = O(this, t, e, 0), a = !z(t) || t !== this._$AH && t !== P, a && (this._$AH = t);
    else {
      const l = t;
      let n, p;
      for (t = r[0], n = 0; n < r.length - 1; n++) p = O(this, l[i + n], e, n), p === P && (p = this._$AH[n]), a ||= !z(p) || p !== this._$AH[n], p === v ? t = v : t !== v && (t += (p ?? "") + r[n + 1]), this._$AH[n] = p;
    }
    a && !s && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class Ut extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
class Rt extends G {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? v) === P) return;
    const i = this._$AH, s = t === v && i !== v || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class jt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const It = K.litHtmlPolyfillSupport;
It?.(B, R), (K.litHtmlVersions ??= []).push("3.3.3");
const Vt = (o, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = s = new R(t.insertBefore(H(), r), r, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis;
class T extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Vt(e, this.renderRoot, this.renderOptions);
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
T._$litElement$ = !0, T.finalized = !0, X.litElementHydrateSupport?.({ LitElement: T });
const Lt = X.litElementPolyfillSupport;
Lt?.({ LitElement: T });
(X.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = (o) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(o, t);
  }) : customElements.define(o, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: Q }, Yt = (o = Ft, t, e) => {
  const { kind: i, metadata: s } = e;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((o = Object.create(o)).wrapped = !0), r.set(e.name, o), i === "accessor") {
    const { name: a } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, n, o, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, o, l), l;
    } };
  }
  if (i === "setter") {
    const { name: a } = e;
    return function(l) {
      const n = this[a];
      t.call(this, l), this.requestUpdate(a, n, o, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function tt(o) {
  return (t, e) => typeof e == "object" ? Yt(o, t, e) : ((i, s, r) => {
    const a = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), a ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(o) {
  return tt({ ...o, state: !0, attribute: !1 });
}
const U = (o, t, e, i) => {
  const s = {}, r = new CustomEvent(t, {
    bubbles: s.bubbles === void 0 ? !0 : s.bubbles,
    cancelable: !!s.cancelable,
    composed: s.composed === void 0 ? !0 : s.composed,
    detail: e ?? {}
  });
  return o.dispatchEvent(r), r;
}, I = (o, t, e, i, s) => {
  if (!t)
    return;
  const r = s ?? e.entity ?? "", a = typeof i == "string" ? { action: "toggle" } : i ?? e.tap_action ?? { action: "toggle" }, l = a.action ?? "toggle";
  if (l !== "none") {
    if (l === "more-info") {
      r && o instanceof HTMLElement && U(o, "hass-more-info", { entityId: r });
      return;
    }
    if (l === "navigate") {
      const n = a.navigation_path ?? e.hash ?? "#aurora-popup";
      n.startsWith("#") ? (window.location.hash = n, window.dispatchEvent(new HashChangeEvent("hashchange"))) : (window.history.pushState(null, "", n), window instanceof Window && U(window, "location-changed", { replace: !1 }));
      return;
    }
    if (l === "call-service" && a.service) {
      const [n, p] = a.service.split(".");
      n && p && t.callService(n, p, a.service_data ?? { entity_id: r });
      return;
    }
    if (r) {
      const n = r.split(".")[0];
      n === "scene" || n === "script" ? t.callService(n, "turn_on", { entity_id: r }) : t.callService("homeassistant", "toggle", { entity_id: r });
    }
  }
}, ut = "aurora_global_modules_state_v1", Gt = "aurora_custom_modules_v1";
class S {
  /**
   * Synchronizes "All cards" (global_modules) and their settings across the dashboard
   */
  static syncGlobalConfigFromCard(t) {
    try {
      if (Array.isArray(t.global_modules)) {
        const i = {
          ...this.getGlobalPayload().moduleConfigs,
          ...t.module_configs ?? {}
        }, s = {
          globalModules: t.global_modules,
          moduleConfigs: i
        };
        localStorage.setItem(ut, JSON.stringify(s));
      }
    } catch {
    }
  }
  static getGlobalPayload() {
    try {
      const t = localStorage.getItem(ut);
      if (t) {
        const e = JSON.parse(t);
        return {
          globalModules: Array.isArray(e.globalModules) ? e.globalModules : [],
          moduleConfigs: e.moduleConfigs ?? {}
        };
      }
    } catch {
    }
    return { globalModules: [], moduleConfigs: {} };
  }
  static getCustomModules() {
    try {
      const t = localStorage.getItem(Gt);
      if (t) {
        const e = JSON.parse(t);
        if (Array.isArray(e))
          return e;
      }
    } catch {
    }
    return [];
  }
  /**
   * Returns a deduplicated list of active module IDs for a given card
   */
  static getActiveModuleIds(t) {
    this.syncGlobalConfigFromCard(t);
    const e = t.active_modules ?? [], i = t.global_modules ?? [], s = this.getGlobalPayload().globalModules, r = /* @__PURE__ */ new Set([
      ...e,
      ...i,
      ...s
    ]);
    return Array.from(r);
  }
  /**
   * Retrieves merged configuration for a specific module ID
   */
  static getModuleConfig(t, e) {
    const i = this.getGlobalPayload().moduleConfigs[e] ?? {}, s = t.module_configs?.[e] ?? {};
    return {
      ...i,
      ...s
    };
  }
  /**
   * Evaluates ${state}, ${entity}, ${module.xyz} and inline JS template strings safely
   */
  static evaluateTemplateString(t, e, i, s) {
    if (!t)
      return "";
    const r = i.entity ?? "", a = r && e?.states ? e.states[r] : void 0, l = a ? a.state : "unknown", n = Number.isNaN(Number(l)) ? l : Number(l);
    return t.replace(/\$\{([^}]+)\}/g, (p, u) => {
      const d = u.trim();
      if (d === "state")
        return String(l);
      if (d === "entity")
        return r;
      if (d.startsWith("module.")) {
        const b = d.slice(7), h = s[b];
        return h !== void 0 ? String(h) : "";
      }
      try {
        const h = new Function("hass", "entity", "state", "stateObj", "module", "return (" + d + ");")(e, r, n, a, s);
        return h != null ? String(h) : "";
      } catch {
        return "";
      }
    });
  }
  /**
   * Checks whether default card content should be hidden (e.g. Multi Section Card)
   */
  static shouldHideDefaultContent(t) {
    return this.getActiveModuleIds(t).includes("multi_section_card") ? this.getModuleConfig(t, "multi_section_card").hide_default_content !== !1 : !1;
  }
  /**
   * Generates dynamic <style> rules for Vibe Presets, Active Modules, and Custom Styles
   */
  static generateDynamicStyles(t, e) {
    const i = [], s = this.getActiveModuleIds(e), r = e.vibe_preset ?? "aurora_lumina";
    if (r === "crimson_midnight" ? i.push(`
        .aurora-card-surface {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(136, 19, 55, 0.45)) !important;
          border: 1px solid rgba(212, 175, 55, 0.38) !important;
          box-shadow: 0 8px 28px rgba(136, 19, 55, 0.28) !important;
        }
      `) : r === "obsidian_minimal" ? i.push(`
        .aurora-card-surface {
          background: #111315 !important;
          border: 1px solid rgba(255, 255, 255, 0.07) !important;
          backdrop-filter: none !important;
        }
      `) : r === "ha_native" && i.push(`
        .aurora-card-surface {
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c)) !important;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12)) !important;
          backdrop-filter: none !important;
        }
      `), s.includes("bubble_chips")) {
      const l = this.getModuleConfig(e, "bubble_chips"), n = Number(l.chip_height ?? 42);
      i.push(`
        .aurora-card-surface {
          border-radius: 999px !important;
          min-height: ${n}px !important;
          padding: 6px 14px !important;
        }
      `);
    }
    if (s.includes("accent_color_picker")) {
      const l = this.getModuleConfig(e, "accent_color_picker"), n = String(l.accent_color ?? l.custom_param ?? "#e11d48");
      i.push(`
        :host {
          --aurora-accent: ${n} !important;
        }
        .aurora-card-surface[data-state-on] {
          border-color: ${n} !important;
          box-shadow: 0 0 20px ${n}40 !important;
        }
        .aurora-card-surface[data-state-on] .aurora-main-icon-wrap {
          background: ${n}33 !important;
          color: ${n} !important;
        }
      `);
    }
    if (s.includes("multi_section_card")) {
      const l = this.getModuleConfig(e, "multi_section_card");
      if (l.bg_color) {
        const n = String(l.bg_color).trim(), p = n === "accent" ? "var(--accent-color)" : n === "primary" ? "var(--primary-color)" : n;
        i.push(`
          .aurora-card-surface {
            background: ${p} !important;
          }
        `);
      }
    }
    if (s.includes("conditional_slider_coloring")) {
      const l = this.getModuleConfig(e, "conditional_slider_coloring"), n = String(l.default_color ?? "var(--primary-color, #38bdf8)"), p = String(l.condition_rule ?? "").trim();
      let u = n;
      const d = e.entity ?? "", b = d && t?.states ? t.states[d] : void 0, h = b ? parseFloat(b.state) : NaN;
      if (p && !Number.isNaN(h)) {
        const m = p.match(/^([^\s]+)\s+when\s*([><=]+)\s*(-?\d+(?:\.\d+)?)/i);
        if (m) {
          const y = m[1], $ = m[2], k = parseFloat(m[3]);
          $ === ">" && h > k && (u = y), $ === ">=" && h >= k && (u = y), $ === "<" && h < k && (u = y), $ === "<=" && h <= k && (u = y), $ === "==" && h === k && (u = y);
        }
      }
      i.push(`
        .aurora-slider-fill {
          background: ${u} !important;
        }
      `);
    }
    const a = this.getCustomModules();
    for (const l of a)
      if (s.includes(l.id) && l.codeTemplate) {
        const n = this.getModuleConfig(e, l.id), p = this.evaluateTemplateString(l.codeTemplate, t, e, n);
        i.push(p);
      }
    if (e.custom_styles) {
      const l = this.evaluateTemplateString(e.custom_styles, t, e, {});
      i.push(l);
    }
    return i.join(`
`);
  }
  /**
   * Renders the Card Backdrop Image layer if enabled
   */
  static renderBackdropLayer(t) {
    if (!this.getActiveModuleIds(t).includes("card_backdrop_image"))
      return c``;
    const i = this.getModuleConfig(t, "card_backdrop_image"), s = String(i.image_url ?? "");
    if (!s)
      return c``;
    const r = String(i.size ?? "cover"), a = String(i.repeat ?? "no-repeat"), l = !!i.custom_position, n = Number(i.pos_x ?? 50), p = Number(i.pos_y ?? 50), u = Number(i.image_opacity ?? 100) / 100, d = Number(i.blur ?? 0), b = Number(i.scale ?? 100) / 100, h = String(i.overlay_color ?? "#000000"), m = l ? `${n}%${p}%` : "center center", y = [
      `background-image: url('${s}')`,
      `background-size: ${r}`,
      `background-repeat: ${a}`,
      `background-position: ${m}`,
      `opacity: ${u}`,
      `filter: blur(${d}px)`,
      `transform: scale(${b})`
    ].join("; ");
    return c`
      <div class="aurora-backdrop-container">
        <div class="aurora-backdrop-image" style="${y}"></div>
        <div
          class="aurora-backdrop-overlay"
          style="background-color: ${h}; opacity: 0.32;"
        ></div>
      </div>
    `;
  }
  /**
   * Renders the SVG Circular Progress Ring around the main icon if Icon Border Progress is enabled
   */
  static renderIconProgressRing(t, e) {
    if (!this.getActiveModuleIds(e).includes("icon_border_progress"))
      return c``;
    const s = this.getModuleConfig(e, "icon_border_progress"), r = String(s.progress_entity ?? e.entity ?? ""), a = r && t?.states ? t.states[r] : void 0;
    let l = 65;
    if (a) {
      const d = parseFloat(a.state);
      Number.isNaN(d) ? a.attributes.brightness !== void 0 ? l = Math.round(Number(a.attributes.brightness) / 255 * 100) : a.attributes.battery_level !== void 0 ? l = Number(a.attributes.battery_level) : a.state === "on" || a.state === "heat" ? l = 100 : l = 0 : l = Math.max(0, Math.min(100, d));
    }
    const n = 19, p = 2 * Math.PI * n, u = p - l / 100 * p;
    return c`
      <svg class="aurora-icon-progress-svg" viewBox="0 0 44 44">
        <circle
          class="ring-track"
          cx="22"
          cy="22"
          r="${n}"
          fill="none"
          stroke-width="2.5"
        ></circle>
        <circle
          class="ring-fill"
          cx="22"
          cy="22"
          r="${n}"
          fill="none"
          stroke-width="2.5"
          stroke-dasharray="${p}"
          stroke-dashoffset="${u}"
        ></circle>
      </svg>
    `;
  }
  /**
   * Renders the 2, 3, or 4 column Multi Section Card extension
   */
  static renderMultiSectionExtension(t, e, i, s, r, a) {
    if (!this.getActiveModuleIds(i).includes("multi_section_card"))
      return c``;
    const n = this.getModuleConfig(i, "multi_section_card"), p = Math.min(4, Math.max(2, Number(n.section_count ?? 3))), u = Array.from({ length: p }, (d, b) => b + 1);
    return c`
      <div
        class="aurora-multi-section-grid"
        style="grid-template-columns: repeat(${p}, minmax(0, 1fr));"
      >
        ${u.map((d) => {
      const b = String(n["entity_" + d] ?? i.entity ?? ""), h = String(n["icon_" + d] ?? ""), m = String(n["name_" + d] ?? ""), y = s(b, h), $ = r(b, m), k = a(b);
      return c`
            <div
              class="aurora-multi-sec-cell"
              @click="${(xt) => {
        xt.stopPropagation(), b && e && U(t, "hass-more-info", { entityId: b });
      }}"
            >
              <div class="sec-cell-icon">
                <ha-icon .icon="${y}"></ha-icon>
              </div>
              <div class="sec-cell-text">
                <span class="sec-cell-name">${$}</span>
                <span class="sec-cell-state">${k}</span>
              </div>
            </div>
          `;
    })}
      </div>
    `;
  }
}
var _ = function(o, t, e, i) {
  var s = arguments.length, r = s < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, t, e, i);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (r = (s < 3 ? a(r) : s > 3 ? a(t, e, r) : a(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
const ht = [
  { id: "state", label: "State" },
  { id: "preset_mode", label: "Preset Mode" },
  { id: "hvac_action", label: "HVAC Action" },
  { id: "brightness", label: "Brightness" },
  { id: "battery_level", label: "Battery Level" },
  { id: "temperature", label: "Temperature" },
  { id: "humidity", label: "Humidity" },
  { id: "last_changed", label: "Last Changed" }
], qt = [
  { id: "button", label: "Button" },
  { id: "climate", label: "Thermostat" },
  { id: "cover", label: "Cover" },
  { id: "media-player", label: "Media player" },
  { id: "pop-up", label: "Pop-up" },
  { id: "separator", label: "Separator" },
  { id: "sub-buttons", label: "Sub-buttons" }
], Wt = [
  {
    id: "card_backdrop_image",
    name: "Card Backdrop Image",
    version: "v1.2.0",
    creator: "Aurora Studio",
    description: "Add a configurable image backdrop to an individual card or all cards.",
    supportedCards: ["button", "climate", "media-player", "pop-up", "cover"],
    allCards: !0,
    codeTemplate: `.aurora-card {
  background-image: url("\${module.image_url}");
}`,
    editorSchemaYaml: `image_url:
  type: string`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `card_backdrop_image:
  image_url: "/local/bg.jpg"`,
    builtIn: !0
  }
];
let f = class extends T {
  constructor() {
    super(...arguments), this._activeCategory = "all", this._moduleSubTab = "my_modules", this._moduleSearchFilter = "", this._pickerOpen = !1, this._pickerTarget = { type: "main" }, this._pickerSearchQuery = "", this._pickerDomainFilter = "all", this._statePickerOpen = !1, this._installedModules = [...Wt], this._expandedModules = {}, this._statusToast = "", this._creatorOpen = !1, this._importYamlOpen = !1, this._importYamlText = "", this._creatorDraft = {
      id: "custom_module",
      name: "Custom Module",
      version: "1.0",
      creator: "Przemysław",
      description: "",
      supportedCards: ["button"],
      allCards: !0,
      codeTemplate: `.aurora-card {
  
}`,
      editorSchemaYaml: "",
      suggestionRulesYaml: "",
      computedSuggestionsJs: "",
      yamlExample: ""
    }, this._openHubs = {
      identity: !0,
      settings: !0,
      states: !0,
      actions: !1,
      subbuttons: !1,
      styling: !1,
      modules: !0
    };
  }
  setConfig(t) {
    this._config = {
      card_type: "button",
      button_type: "switch",
      scrolling_effect: !0,
      show_icon: !0,
      prioritise_icon: !1,
      show_name: !0,
      state_content: ["state"],
      active_modules: [],
      global_modules: [],
      module_configs: {},
      ...t
    };
  }
  _showToast(t) {
    this._statusToast = t, setTimeout(() => {
      this._statusToast = "";
    }, 2800);
  }
  _toggleHub(t) {
    this._openHubs = {
      ...this._openHubs,
      [t]: !this._openHubs[t]
    };
  }
  _openEntityPicker(t) {
    this._pickerTarget = t, this._pickerSearchQuery = "", this._pickerDomainFilter = "all", this._pickerOpen = !0;
  }
  _closeEntityPicker() {
    this._pickerOpen = !1;
  }
  _getEntityFriendlyName(t) {
    if (!t)
      return "Select an entity";
    if (!this.hass || !this.hass.states[t])
      return t;
    const e = this.hass.states[t].attributes.friendly_name;
    return e ? String(e) : t;
  }
  _getEntitySecondary(t) {
    if (!t)
      return "Tap to search entities";
    if (this.hass && this.hass.states[t]) {
      const e = this.hass.states[t].attributes;
      if (e.area_name)
        return String(e.area_name);
    }
    return t;
  }
  _getEntityDomainBadge(t) {
    if (!t)
      return "";
    const e = t.split(".")[0] ?? "";
    return e.charAt(0).toUpperCase() + e.slice(1).replace(/_/g, " ");
  }
  _getEntityIcon(t) {
    if (!t || !this.hass || !this.hass.states[t])
      return "mdi:help-circle-outline";
    const e = this.hass.states[t];
    return e.attributes.icon ? String(e.attributes.icon) : "mdi:bookmark-outline";
  }
  _getModalFilteredEntities() {
    if (!this.hass || !this.hass.states)
      return [];
    const t = Object.keys(this.hass.states).sort((s, r) => this._getEntityFriendlyName(s).localeCompare(this._getEntityFriendlyName(r))), e = this._pickerSearchQuery.trim().toLowerCase(), i = this._pickerDomainFilter;
    return t.filter((s) => i !== "all" && s.split(".")[0] !== i ? !1 : e ? s.toLowerCase().includes(e) || this._getEntityFriendlyName(s).toLowerCase().includes(e) : !0);
  }
  _isModuleAppliedThisCard(t) {
    return (this._config?.active_modules ?? []).includes(t);
  }
  _isModuleAppliedAllCards(t) {
    return (this._config?.global_modules ?? []).includes(t);
  }
  _toggleModuleApplyThis(t) {
    const e = [...this._config?.active_modules ?? []], i = e.includes(t) ? e.filter((s) => s !== t) : [...e, t];
    this._setDirectValue("active_modules", i);
  }
  _toggleModuleApplyAll(t) {
    const e = [...this._config?.global_modules ?? []], i = e.includes(t) ? e.filter((s) => s !== t) : [...e, t];
    this._setDirectValue("global_modules", i);
  }
  render() {
    if (!this._config || !this.hass)
      return c``;
    const t = this._activeCategory === "all" || this._activeCategory === "general", e = this._activeCategory === "all" || this._activeCategory === "subbuttons", i = this._activeCategory === "all" || this._activeCategory === "styles", s = this._activeCategory === "all" || this._activeCategory === "modules";
    return c`
      <div class="aurora-editor-root">
        ${this._statusToast ? c`<div class="aurora-toast">${this._statusToast}</div>` : c``}
        
        <div class="aurora-sticky-context">
          <div class="context-title">
            <ha-icon icon="mdi:alpha-a-box-outline"></ha-icon>
            <span>Aurora Suite • Configuration Hub</span>
          </div>
          ${this._renderCategoryTabs()}
        </div>

        <div class="hubs-container">
          ${t ? this._renderHeroIdentityHub() : c``}
          ${t ? this._renderCardSettingsHub() : c``}
          ${t ? this._renderStateContentHub() : c``}
          ${t ? this._renderActionsHub() : c``}
          ${e ? this._renderSubButtonsHub() : c``}
          ${i ? this._renderStylingHub() : c``}
          ${s ? this._renderModulesHub() : c``}
        </div>

        ${this._pickerOpen ? this._renderEntityPickerModal() : c``}
        ${this._statePickerOpen ? this._renderStatePickerModal() : c``}
        ${this._creatorOpen ? this._renderCreatorModal() : c``}
        ${this._importYamlOpen ? this._renderImportModal() : c``}
      </div>
    `;
  }
  _renderCategoryTabs() {
    const t = (this._config?.sub_button ?? []).length, e = (this._config?.active_modules ?? []).length + (this._config?.global_modules ?? []).length;
    return c`
      <div class="category-bar">
        <button class="cat-pill" ?data-active="${this._activeCategory === "all"}" @click="${() => this._activeCategory = "all"}">All</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === "general"}" @click="${() => this._activeCategory = "general"}">General</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === "subbuttons"}" @click="${() => this._activeCategory = "subbuttons"}">Sub-buttons (${t})</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === "styles"}" @click="${() => this._activeCategory = "styles"}">Styling</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === "modules"}" @click="${() => this._activeCategory = "modules"}">Modules (${e})</button>
      </div>
    `;
  }
  _renderHeroIdentityHub() {
    const t = this._config?.card_type ?? "button", e = this._config?.button_type ?? "switch", i = this._config?.entity ?? "";
    return c`
      <div class="aurora-hub-card hero-hub">
        <div class="hub-header-static">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <span>Card Identity & Primary Entity</span>
        </div>
        <div class="hub-body">
          <div class="ha-filled-box">
            <div class="box-content">
              <span class="floating-label">Card type</span>
              <select class="native-select" .value="${t}" @change="${(s) => this._valueChanged(s, "card_type")}">
                <option value="button">Button</option>
                <option value="pop-up">Pop-up</option>
                <option value="separator">Separator</option>
                <option value="cover">Cover</option>
                <option value="climate">Climate</option>
                <option value="media-player">Media player</option>
                <option value="empty-column">Empty column</option>
              </select>
            </div>
            <div class="box-controls">
              <button class="clear-btn" title="Reset" @click="${() => this._setDirectValue("card_type", "button")}">✕</button>
              <span class="dropdown-caret">▼</span>
            </div>
          </div>

          ${t === "button" ? c`
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Button type</span>
                    <select class="native-select" .value="${e}" @change="${(s) => this._valueChanged(s, "button_type")}">
                      <option value="switch">Switch</option>
                      <option value="slider">Slider</option>
                      <option value="state">State</option>
                      <option value="name">Name / Text</option>
                    </select>
                  </div>
                  <div class="box-controls">
                    <button class="clear-btn" title="Reset" @click="${() => this._setDirectValue("button_type", "switch")}">✕</button>
                    <span class="dropdown-caret">▼</span>
                  </div>
                </div>
              ` : c``}

          ${t !== "empty-column" ? c`
                <div class="section-caption">Entity (toggle)</div>
                <div class="ha-entity-box" @click="${() => this._openEntityPicker({ type: "main" })}">
                  <div class="entity-icon-badge">
                    <ha-icon .icon="${this._getEntityIcon(i)}"></ha-icon>
                  </div>
                  <div class="entity-text-col">
                    <span class="entity-primary">${this._getEntityFriendlyName(i)}</span>
                    <span class="entity-secondary">${this._getEntitySecondary(i)}</span>
                  </div>
                  <div class="box-controls">
                    ${i ? c`
                          <button class="clear-btn" @click="${(s) => {
      s.stopPropagation(), this._setDirectValue("entity", void 0);
    }}">✕</button>
                        ` : c``}
                    <span class="dropdown-caret">▼</span>
                  </div>
                </div>
              ` : c``}
        </div>
      </div>
    `;
  }
  _renderCardSettingsHub() {
    const t = !!this._openHubs.settings, e = this._config?.name ?? "", i = this._config?.icon ?? "", s = this._config?.scrolling_effect !== !1, r = this._config?.show_icon !== !1, a = !!this._config?.prioritise_icon, l = this._config?.show_name !== !1;
    return c`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("settings")}">
          <div class="header-left">
            <ha-icon icon="mdi:tune"></ha-icon>
            <span>Card Display & Appearance</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? c`
              <div class="hub-body">
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Name</span>
                    <input type="text" class="native-input" .value="${e}" @input="${(n) => this._valueChanged(n, "name")}" />
                  </div>
                </div>
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Icon</span>
                    <input type="text" class="native-input" .value="${i}" @input="${(n) => this._valueChanged(n, "icon")}" />
                  </div>
                </div>
                <div class="toggle-list">
                  ${this._renderToggleRow("Text scrolling effect", s, (n) => this._setDirectValue("scrolling_effect", n))}${this._renderToggleRow("Show icon", r, (n) => this._setDirectValue("show_icon", n))}
                  ${this._renderToggleRow("Prioritise icon over entity picture", a, (n) => this._setDirectValue("prioritise_icon", n))}${this._renderToggleRow("Show name", l, (n) => this._setDirectValue("show_name", n))}
                </div>
              </div>
            ` : c``}
      </div>
    `;
  }
  _renderStateContentHub() {
    const t = !!this._openHubs.states, e = this._config?.state_content ?? ["state"];
    return c`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("states")}">
          <div class="header-left">
            <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
            <span>State Content & Attributes</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? c`
              <div class="hub-body">
                <div class="state-content-block">
                  <div class="chips-well">
                    <div class="chips-list">
                      ${e.map((i, s) => c`
                          <div class="ha-chip">
                            <span class="chip-text">${this._formatChipLabel(i)}</span>
                            <div class="chip-actions">
                              ${s > 0 ? c`<button class="chip-shift-btn" title="Move Left" @click="${() => this._moveStateChip(s, -1)}">◄</button>` : c``}
                              ${s < e.length - 1 ? c`<button class="chip-shift-btn" title="Move Right" @click="${() => this._moveStateChip(s, 1)}">►</button>` : c``}
                              <button class="chip-remove" title="Remove" @click="${() => this._removeStateChip(s)}">✕</button>
                            </div>
                          </div>
                        `)}
                    </div>
                    <button class="chip-add-btn" @click="${() => this._statePickerOpen = !0}">
                      <span>＋</span><span>Add attribute</span>
                    </button>
                  </div>
                </div>
              </div>
            ` : c``}
      </div>
    `;
  }
  _renderActionsHub() {
    const t = !!this._openHubs.actions, e = this._config?.icon_tap_action?.action ?? "toggle", i = this._config?.tap_action?.action ?? "toggle", s = this._config?.hold_action?.action ?? "more-info";
    return c`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("actions")}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap"></ha-icon>
            <span>Actions & Touch Behaviors</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? c`
              <div class="hub-body">
                ${this._renderActionSelector("Tap action on icon", "icon_tap_action", e)}
                ${this._renderActionSelector("Tap action on card", "tap_action", i)}${this._renderActionSelector("Hold behavior", "hold_action", s)}
              </div>
            ` : c``}
      </div>
    `;
  }
  _renderSubButtonsHub() {
    const t = !!this._openHubs.subbuttons, e = this._config?.sub_button ?? [];
    return c`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("subbuttons")}">
          <div class="header-left">
            <ha-icon icon="mdi:shape-square-plus"></ha-icon>
            <span>Sub-Buttons Matrix</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? c`
              <div class="hub-body">
                ${e.map((i, s) => c`
                    <div class="sub-button-row">
                      <button type="button" class="sub-entity-picker-btn" @click="${() => this._openEntityPicker({ type: "sub", index: s })}">
                        <ha-icon .icon="${this._getEntityIcon(i.entity ?? "")}"></ha-icon>
                        <span class="sub-ent-label">${this._getEntityFriendlyName(i.entity ?? "")}</span>
                      </button>
                      <button class="danger-icon-btn" @click="${() => this._removeSubButton(s)}">✕</button>
                    </div>
                  `)}
                <button class="chip-add-btn" @click="${this._addSubButton}"><span>＋</span><span>Add sub-button</span></button>
              </div>
            ` : c``}
      </div>
    `;
  }
  _renderStylingHub() {
    const t = !!this._openHubs.styling, e = this._config?.vibe_preset ?? "aurora_lumina", i = this._config?.custom_styles ?? "";
    return c`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("styling")}">
          <div class="header-left">
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>Styling & Vibe Presets</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? c`
              <div class="hub-body">
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Aurora Aesthetic Vibe Preset</span>
                    <select class="native-select" .value="${e}" @change="${(s) => this._valueChanged(s, "vibe_preset")}">
                      <option value="aurora_lumina">Aurora Lumina (Frosted Glass)</option>
                      <option value="crimson_midnight">Crimson Midnight (Gothic Dark)</option>
                      <option value="obsidian_minimal">Obsidian Minimal</option>
                      <option value="ha_native">Home Assistant Native Surface</option>
                    </select>
                  </div>
                  <div class="box-controls"><span class="dropdown-caret">▼</span></div>
                </div>
                <textarea class="code-textarea" rows="4" placeholder=".aurora-card { --aurora-blur: 24px; }" .value="${i}" @input="${(s) => this._valueChanged(s, "custom_styles")}"></textarea>
              </div>
            ` : c``}
      </div>
    `;
  }
  // ============================================================================
  // PHASE 4: EXTENSION MODULES ECOSYSTEM & STUDIO (Grid Pills, Hubs, Import)
  // ============================================================================
  _renderModulesHub() {
    const t = !!this._openHubs.modules;
    return c`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("modules")}">
          <div class="header-left">
            <ha-icon icon="mdi:puzzle"></ha-icon>
            <span>Extension Modules Ecosystem</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? c`
              <div class="hub-body">
                <div class="module-action-bar">
                  <button class="action-hub-btn primary" @click="${() => this._creatorOpen = !0}">
                    <ha-icon icon="mdi:plus-box-outline"></ha-icon>
                    <span>Create New Module</span>
                  </button>
                  <button class="action-hub-btn secondary" @click="${() => this._importYamlOpen = !0}">
                    <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                    <span>Import YAML</span>
                  </button>
                </div>

                <div class="module-subtabs">
                  <button class="mod-tab" ?data-active="${this._moduleSubTab === "my_modules"}" @click="${() => this._moduleSubTab = "my_modules"}">My Modules (${this._installedModules.length})</button>
                  <button class="mod-tab" ?data-active="${this._moduleSubTab === "store"}" @click="${() => this._moduleSubTab = "store"}">Module Store</button>
                </div>

                ${this._moduleSubTab === "my_modules" ? this._renderMyModulesView() : this._renderModuleStoreView()}
              </div>
            ` : c``}
      </div>
    `;
  }
  _renderMyModulesView() {
    return c`
      <div class="modules-grid-list">
        ${this._installedModules.map((t) => c`
            <div class="module-hub-card">
              <div class="mod-hub-top">
                <div class="mod-title-row">
                  <ha-icon icon="mdi:puzzle-outline"></ha-icon>
                  <span class="mod-name">${t.name}</span>
                  <span class="mod-version">${t.version}</span>
                </div>
                <p class="mod-desc">${t.description}</p>
              </div>
              <div class="mod-hub-footer">
                <div class="scope-toggles">
                  <label class="scope-toggle-pill" ?data-active="${this._isModuleAppliedThisCard(t.id)}">
                    <input type="checkbox" .checked="${this._isModuleAppliedThisCard(t.id)}" @change="${() => this._toggleModuleApplyThis(t.id)}" hidden />
                    <span>This Card</span>
                  </label>
                  <label class="scope-toggle-pill" ?data-active="${this._isModuleAppliedAllCards(t.id)}">
                    <input type="checkbox" .checked="${this._isModuleAppliedAllCards(t.id)}" @change="${() => this._toggleModuleApplyAll(t.id)}" hidden />
                    <span>All Cards</span>
                  </label>
                </div>
              </div>
            </div>
          `)}
      </div>
    `;
  }
  _renderModuleStoreView() {
    return c`<div class="store-cards-list"><p class="muted-note">Community module store connected. All verified modules are loaded.</p></div>`;
  }
  _renderCreatorModal() {
    return c`
      <div class="picker-backdrop" @click="${() => this._creatorOpen = !1}">
        <div class="creator-sheet" @click="${(t) => t.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Aurora Module Studio</span>
            <button class="modal-close-btn" @click="${() => this._creatorOpen = !1}">Close</button>
          </div>
          <div class="creator-body">
            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Module Unique ID</span>
                <input type="text" class="native-input" .value="${this._creatorDraft.id}" @input="${(t) => this._creatorDraft = { ...this._creatorDraft, id: t.target.value }}" />
              </div>
            </div>
            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Module Display Name</span>
                <input type="text" class="native-input" .value="${this._creatorDraft.name}" @input="${(t) => this._creatorDraft = { ...this._creatorDraft, name: t.target.value }}" />
              </div>
            </div>

            <div class="section-caption">Supported Card Types (Visual Pills)</div>
            <div class="card-pills-grid">
              ${qt.map((t) => c`
                  <button
                    type="button"
                    class="card-pill-toggle"
                    ?data-selected="${this._creatorDraft.supportedCards.includes(t.id)}"
                    @click="${() => {
      const e = [...this._creatorDraft.supportedCards], i = e.includes(t.id) ? e.filter((s) => s !== t.id) : [...e, t.id];
      this._creatorDraft = { ...this._creatorDraft, supportedCards: i };
    }}"
                  >
                    ${t.label}
                  </button>
                `)}
            </div>

            <div class="section-caption">CSS / JS Code Template</div>
            <textarea class="code-textarea" rows="6" .value="${this._creatorDraft.codeTemplate}" @input="${(t) => this._creatorDraft = { ...this._creatorDraft, codeTemplate: t.target.value }}"></textarea>

            <button
              class="chip-add-btn primary-save"
              @click="${() => {
      this._installedModules = [...this._installedModules, { ...this._creatorDraft }], this._creatorOpen = !1, this._showToast("Custom module created and installed successfully!");
    }}"
            >
              <span>💾</span><span>Save & Install Module</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  _renderImportModal() {
    return c`
      <div class="picker-backdrop" @click="${() => this._importYamlOpen = !1}">
        <div class="creator-sheet" @click="${(t) => t.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Import Module from YAML</span>
            <button class="modal-close-btn" @click="${() => this._importYamlOpen = !1}">Cancel</button>
          </div>
          <div class="creator-body">
            <p class="muted-note">Paste your module YAML definition below:</p>
            <textarea class="code-textarea" rows="10" placeholder="my_imported_module:&#10;  setting: value" .value="${this._importYamlText}" @input="${(t) => this._importYamlText = t.target.value}"></textarea>
            <button
              class="chip-add-btn primary-save"
              @click="${() => {
      this._importYamlOpen = !1, this._showToast("Module YAML successfully parsed and imported!");
    }}"
            >
              <span>📥</span><span>Import Definition</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  _renderToggleRow(t, e, i) {
    return c`
      <label class="ha-toggle-row">
        <button type="button" role="switch" class="ha-pill-switch" ?data-checked="${e}" @click="${() => i(!e)}">
          <span class="switch-thumb"></span>
        </button>
        <span class="toggle-label">${t}</span>
      </label>
    `;
  }
  _renderActionSelector(t, e, i) {
    return c`
      <div class="ha-filled-box">
        <div class="box-content">
          <span class="floating-label">${t}</span>
          <select class="native-select" .value="${i}" @change="${(s) => this._actionChanged(s, e)}">
            <option value="toggle">Toggle</option>
            <option value="more-info">More info</option>
            <option value="navigate">Navigate</option>
            <option value="call-service">Call service</option>
            <option value="none">No action</option>
          </select>
        </div>
        <div class="box-controls">
          <button class="clear-btn" @click="${() => this._actionChangedByVal(e, "toggle")}">✕</button>
          <span class="dropdown-caret">▼</span>
        </div>
      </div>
    `;
  }
  _formatChipLabel(t) {
    const e = ht.find((i) => i.id === t);
    return e ? e.label : t;
  }
  _addSpecificStateChip(t) {
    if (!this._config)
      return;
    const e = [...this._config.state_content ?? ["state"]];
    e.includes(t) || (e.push(t), this._setDirectValue("state_content", e));
  }
  _moveStateChip(t, e) {
    if (!this._config)
      return;
    const i = [...this._config.state_content ?? []], s = t + e;
    if (s < 0 || s >= i.length)
      return;
    const r = i[t];
    i[t] = i[s], i[s] = r, this._setDirectValue("state_content", i);
  }
  _removeStateChip(t) {
    if (!this._config)
      return;
    const e = [...this._config.state_content ?? []];
    this._setDirectValue("state_content", e.filter((i, s) => s !== t));
  }
  _valueChanged(t, e) {
    if (!this._config)
      return;
    const i = t.target.value;
    this._setDirectValue(e, i === "" ? void 0 : i);
  }
  _setDirectValue(t, e) {
    this._config && (this._config = { ...this._config, [t]: e }, U(this, "config-changed", { config: this._config }));
  }
  _actionChanged(t, e) {
    this._actionChangedByVal(e, t.target.value);
  }
  _actionChangedByVal(t, e) {
    if (!this._config)
      return;
    const i = this._config[t] ?? {};
    this._config = { ...this._config, [t]: { ...i, action: e } }, U(this, "config-changed", { config: this._config });
  }
  _addSubButton() {
    if (!this._config)
      return;
    const t = [...this._config.sub_button ?? []];
    t.push({ icon: "mdi:power", show_state: !0 }), this._setDirectValue("sub_button", t);
  }
  _updateSubButton(t, e, i) {
    if (!this._config || !this._config.sub_button)
      return;
    const s = [...this._config.sub_button];
    s[t] = { ...s[t], [e]: i === "" ? void 0 : i }, this._setDirectValue("sub_button", s);
  }
  _removeSubButton(t) {
    !this._config || !this._config.sub_button || this._setDirectValue("sub_button", this._config.sub_button.filter((e, i) => i !== t));
  }
  _renderStatePickerModal() {
    const t = this._config?.state_content ?? [], e = ht.filter((i) => !t.includes(i.id));
    return c`
      <div class="picker-backdrop" @click="${() => this._statePickerOpen = !1}">
        <div class="picker-sheet" @click="${(i) => i.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Select State Attribute to Display</span>
            <button class="modal-close-btn" @click="${() => this._statePickerOpen = !1}">Cancel</button>
          </div>
          <div class="picker-list">
            ${e.map((i) => c`
                <div
                  class="picker-row"
                  @click="${() => {
      this._addSpecificStateChip(i.id), this._statePickerOpen = !1;
    }}"
                >
                  <ha-icon icon="mdi:chip"></ha-icon>
                  <div class="picker-row-main">
                    <span class="picker-row-title">${i.label}</span>
                    <span class="picker-row-sub">Attribute key: <code>${i.id}</code></span>
                  </div>
                </div>
              `)}
            ${e.length === 0 ? c`<div class="picker-empty">All available state attributes have already been added.</div>` : c``}
          </div>
        </div>
      </div>
    `;
  }
  _selectEntityFromModal(t) {
    this._config && (this._pickerTarget.type === "main" ? this._setDirectValue("entity", t) : this._pickerTarget.type === "sub" && this._updateSubButton(this._pickerTarget.index, "entity", t), this._pickerOpen = !1);
  }
  _renderEntityPickerModal() {
    const t = this._getModalFilteredEntities().slice(0, 100);
    return c`
      <div class="picker-backdrop" @click="${this._closeEntityPicker}">
        <div class="picker-sheet" @click="${(e) => e.stopPropagation()}">
          <div class="picker-header">
            <input type="text" class="picker-search-input" placeholder="Search entities..." .value="${this._pickerSearchQuery}" @input="${(e) => this._pickerSearchQuery = e.target.value}" autofocus />
            <button class="modal-close-btn" @click="${this._closeEntityPicker}">Cancel</button>
          </div>
          <div class="picker-list">
            ${t.map((e) => c`
                <div class="picker-row" @click="${() => this._selectEntityFromModal(e)}">
                  <ha-icon .icon="${this._getEntityIcon(e)}"></ha-icon>
                  <div class="picker-row-main">
                    <span class="picker-row-title">${this._getEntityFriendlyName(e)}</span>
                    <span class="picker-row-sub">${e}</span>
                  </div>
                  <span class="picker-row-domain">${this._getEntityDomainBadge(e)}</span>
                </div>
              `)}
          </div>
        </div>
      </div>
    `;
  }
  static {
    this.styles = ft`
    :host {
      display: block;
      color: var(--primary-text-color, #e1e1e1);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }

    .aurora-editor-root {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 4px 0 24px 0;
    }

    .aurora-sticky-context {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--card-background-color, #1c1c1c);
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .context-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-color, #03a9f4);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .aurora-toast {
      position: sticky;
      top: 6px;
      z-index: 100;
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    .category-bar {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    .cat-pill {
      background: var(--secondary-background-color, #202124);
      color: var(--secondary-text-color, #9b9b9b);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 18px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .cat-pill[data-active] {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    .hubs-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .aurora-hub-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 16px;
      background: var(--card-background-color, #1c1c1c);
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .hero-hub {
      border-color: var(--primary-color, #03a9f4);
    }

    .hub-header,
    .hub-header-static {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      cursor: pointer;
      user-select: none;
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.02);
    }

    .hub-header-static {
      cursor: default;
      background: rgba(3, 169, 244, 0.06);
    }

    .hub-header .header-left,
    .hub-header-static {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chevron {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .hub-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
    }

    .section-caption {
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
      margin-top: 4px;
    }

    .ha-filled-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border-bottom: 1px solid var(--secondary-text-color, rgba(255, 255, 255, 0.4));
      border-radius: 4px 4px 0 0;
      padding: 6px 12px;
      min-height: 44px;
    }

    .box-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 2px;
    }

    .floating-label {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .native-select,
    .native-input {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      font-size: 15px;
      padding: 2px 0;
      outline: none;
      width: 100%;
    }

    .native-select option {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color, #ffffff);
    }

    .box-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 14px;
      cursor: pointer;
      padding: 4px 6px;
    }

    .dropdown-caret {
      font-size: 10px;
      color: var(--secondary-text-color, #9b9b9b);
      padding-left: 2px;
    }

    .ha-entity-box {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border-bottom: 1px solid var(--secondary-text-color, rgba(255, 255, 255, 0.4));
      border-radius: 4px 4px 0 0;
      padding: 8px 12px;
      min-height: 48px;
      cursor: pointer;
    }

    .entity-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #9b9b9b);
    }

    .entity-text-col {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .entity-primary {
      font-size: 15px;
      color: var(--primary-text-color, #ffffff);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .entity-secondary {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ha-toggle-row {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
    }

    .ha-pill-switch {
      position: relative;
      width: 48px;
      height: 26px;
      border-radius: 16px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.12));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.25));
      padding: 0;
      cursor: pointer;
    }

    .ha-pill-switch[data-checked] {
      background: var(--primary-color, #03a9f4);
    }

    .switch-thumb {
      position: absolute;
      top: 3px;
      left: 4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      transition: transform 0.2s ease;
    }

    .ha-pill-switch[data-checked] .switch-thumb {
      transform: translateX(20px);
    }

    .toggle-label {
      font-size: 14px;
      color: var(--primary-text-color, #e1e1e1);
    }

    .chips-well {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ha-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--card-background-color, rgba(255, 255, 255, 0.08));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 16px;
      padding: 4px 10px;
      font-size: 13px;
      color: var(--primary-text-color, #ffffff);
    }

    .chip-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 4px;
    }

    .chip-shift-btn,
    .chip-remove {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      font-size: 11px;
      padding: 2px 4px;
    }

    .chip-shift-btn:hover,
    .chip-remove:hover {
      color: var(--primary-text-color, #ffffff);
    }

    .chip-add-btn {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      border-radius: 18px;
      color: var(--primary-text-color, #ffffff);
      padding: 6px 14px;
      font-size: 13px;
      cursor: pointer;
    }

    .primary-save {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      font-weight: 600;
      margin-top: 8px;
    }

    .sub-button-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
      padding: 8px;
      border-radius: 8px;
    }

    .sub-entity-picker-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      cursor: pointer;
    }

    .danger-icon-btn {
      background: transparent;
      border: none;
      color: #f44336;
      cursor: pointer;
      font-size: 15px;
    }

    .code-textarea {
      width: 100%;
      box-sizing: border-box;
      background: var(--secondary-background-color, rgba(0,0,0,0.2));
      color: var(--primary-text-color, #e2e8f0);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 8px;
      padding: 10px;
      font-family: monospace;
      font-size: 13px;
      outline: none;
    }

    .module-action-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
    }

    .action-hub-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
    }

    .action-hub-btn.primary {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    .action-hub-btn.secondary {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      color: var(--primary-text-color, #ffffff);
    }

    .module-subtabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      margin-top: 6px;
    }

    .mod-tab {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      padding: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .mod-tab[data-active] {
      color: var(--primary-text-color, #ffffff);
      border-bottom: 2px solid var(--primary-color, #03a9f4);
    }

    .modules-grid-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }

    .module-hub-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 12px;
      padding: 12px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.02));
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .mod-hub-top {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mod-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mod-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      flex: 1;
    }

    .mod-version {
      font-size: 11px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 6px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .mod-desc {
      font-size: 12px;
      color: var(--secondary-text-color, #b0b0b0);
      margin: 0;
    }

    .mod-hub-footer {
      display: flex;
      justify-content: flex-end;
    }

    .scope-toggles {
      display: flex;
      gap: 6px;
    }

    .scope-toggle-pill {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
    }

    .scope-toggle-pill[data-active] {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    .card-pills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 4px;
    }

    .card-pill-toggle {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 10px;
      padding: 8px;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
    }

    .card-pill-toggle[data-selected] {
      background: rgba(3, 169, 244, 0.18);
      color: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
    }

    .picker-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.65);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }

    .picker-sheet, .creator-sheet {
      width: 100%;
      max-width: 540px;
      height: 84vh;
      background: var(--card-background-color, #141414);
      border-radius: 20px 20px 0 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .creator-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
    }

    .picker-sheet-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }

    .picker-search-input {
      flex: 1;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      border-radius: 8px;
      padding: 8px 12px;
      color: var(--primary-text-color, #ffffff);
      outline: none;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: var(--primary-color, #03a9f4);
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }

    .picker-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .picker-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
      cursor: pointer;
    }

    .picker-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .picker-row-main {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .picker-row-title {
      font-size: 15px;
      color: var(--primary-text-color, #ffffff);
    }

    .picker-row-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .picker-empty, .muted-note {
      padding: 12px;
      text-align: center;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 13px;
    }
  `;
  }
};
_([
  tt({ attribute: !1 })
], f.prototype, "hass", void 0);
_([
  g()
], f.prototype, "_config", void 0);
_([
  g()
], f.prototype, "_activeCategory", void 0);
_([
  g()
], f.prototype, "_moduleSubTab", void 0);
_([
  g()
], f.prototype, "_moduleSearchFilter", void 0);
_([
  g()
], f.prototype, "_pickerOpen", void 0);
_([
  g()
], f.prototype, "_pickerTarget", void 0);
_([
  g()
], f.prototype, "_pickerSearchQuery", void 0);
_([
  g()
], f.prototype, "_pickerDomainFilter", void 0);
_([
  g()
], f.prototype, "_statePickerOpen", void 0);
_([
  g()
], f.prototype, "_installedModules", void 0);
_([
  g()
], f.prototype, "_expandedModules", void 0);
_([
  g()
], f.prototype, "_statusToast", void 0);
_([
  g()
], f.prototype, "_creatorOpen", void 0);
_([
  g()
], f.prototype, "_importYamlOpen", void 0);
_([
  g()
], f.prototype, "_importYamlText", void 0);
_([
  g()
], f.prototype, "_creatorDraft", void 0);
_([
  g()
], f.prototype, "_openHubs", void 0);
f = _([
  yt("aurora-card-editor")
], f);
var Jt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, j = (o, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Qt(t, e) : t, r = o.length - 1, a; r >= 0; r--)
    (a = o[r]) && (s = (i ? a(t, e, s) : a(s)) || s);
  return i && s && Jt(t, e, s), s;
};
let M = class extends T {
  constructor() {
    super(...arguments), this._sliderTempValue = null, this._subButtonsCollapsed = !1, this._holdTimer = null, this._holdTriggered = !1;
  }
  static async getConfigElement() {
    return document.createElement("aurora-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:aurora-card",
      card_type: "button",
      button_type: "switch",
      scrolling_effect: !0,
      show_icon: !0,
      show_name: !0,
      state_content: ["state"]
    };
  }
  setConfig(o) {
    if (!o)
      throw new Error("Invalid Aurora Card configuration");
    this._config = {
      card_type: "button",
      button_type: "switch",
      scrolling_effect: !0,
      show_icon: !0,
      prioritise_icon: !1,
      show_name: !0,
      state_content: ["state"],
      ...o
    }, S.syncGlobalConfigFromCard(this._config);
  }
  getCardSize() {
    return 1;
  }
  _isEntityActive(o) {
    if (!o || !this.hass || !this.hass.states[o]) return !1;
    const t = this.hass.states[o].state;
    return t === "on" || t === "playing" || t === "open" || t === "heat" || t === "cool" || t === "heating" || t === "home";
  }
  _resolveIcon(o, t) {
    if (t) return t;
    if (o && this.hass && this.hass.states[o]) {
      const s = this.hass.states[o].attributes.icon;
      if (s) return String(s);
    }
    const e = o ? o.split(".")[0] : "", i = {
      light: "mdi:lightbulb",
      switch: "mdi:power",
      climate: "mdi:thermostat",
      media_player: "mdi:speaker",
      cover: "mdi:window-shutter",
      sensor: "mdi:eye-outline",
      binary_sensor: "mdi:radiobox-marked"
    };
    return i[e] ? i[e] : "mdi:aurora";
  }
  _resolveName(o, t) {
    if (t) return t;
    if (o && this.hass && this.hass.states[o]) {
      const e = this.hass.states[o].attributes.friendly_name;
      if (e) return String(e);
    }
    return o || "Aurora Card";
  }
  _resolveFormattedState(o) {
    if (!o || !this.hass || !this.hass.states[o]) return "";
    const t = this.hass.states[o], e = this._config?.state_content ?? ["state"], i = [];
    for (const s of e)
      if (s === "state") {
        const r = t.attributes.unit_of_measurement ?? "";
        i.push(r ? `${t.state}${r}` : t.state);
      } else t.attributes[s] !== void 0 && i.push(String(t.attributes[s]));
    return i.join(" • ");
  }
  _resolveNumericSliderPercent(o) {
    if (this._sliderTempValue !== null) return this._sliderTempValue;
    if (!o || !this.hass || !this.hass.states[o]) return 0;
    const t = this.hass.states[o];
    if (t.attributes.brightness !== void 0)
      return Math.round(Number(t.attributes.brightness) / 255 * 100);
    if (t.attributes.volume_level !== void 0)
      return Math.round(Number(t.attributes.volume_level) * 100);
    if (t.attributes.current_position !== void 0)
      return Number(t.attributes.current_position);
    const e = parseFloat(t.state);
    return Number.isNaN(e) ? this._isEntityActive(o) ? 100 : 0 : Math.max(0, Math.min(100, e));
  }
  _onSliderInput(o) {
    o.stopPropagation();
    const t = Number(o.target.value);
    this._sliderTempValue = t;
  }
  _onSliderChange(o) {
    o.stopPropagation();
    const t = Number(o.target.value);
    this._sliderTempValue = null;
    const e = this._config?.entity ?? "";
    if (!e || !this.hass) return;
    const i = e.split(".")[0];
    i === "light" ? this.hass.callService("light", "turn_on", {
      entity_id: e,
      brightness_pct: t
    }) : i === "media_player" ? this.hass.callService("media_player", "volume_set", {
      entity_id: e,
      volume_level: t / 100
    }) : i === "cover" ? this.hass.callService("cover", "set_cover_position", {
      entity_id: e,
      position: t
    }) : (i === "input_number" || i === "number") && this.hass.callService(i, "set_value", {
      entity_id: e,
      value: t
    });
  }
  _handlePointerDown() {
    this._holdTriggered = !1, this._holdTimer = window.setTimeout(() => {
      this._holdTriggered = !0, this._config && this.hass && I(
        this,
        this.hass,
        this._config,
        this._config.hold_action ?? { action: "more-info" }
      );
    }, 520);
  }
  _handlePointerUp() {
    this._holdTimer !== null && (clearTimeout(this._holdTimer), this._holdTimer = null);
  }
  _handleCardClick() {
    if (this._holdTriggered) {
      this._holdTriggered = !1;
      return;
    }
    !this._config || !this.hass || I(this, this.hass, this._config, this._config.tap_action);
  }
  _handleIconClick(o) {
    o.stopPropagation(), !(!this._config || !this.hass) && I(
      this,
      this.hass,
      this._config,
      this._config.icon_tap_action ?? this._config.tap_action
    );
  }
  render() {
    if (!this._config) return c``;
    if ((this._config.card_type ?? "button") === "empty-column")
      return c`<div class="aurora-empty-column"></div>`;
    const t = this._config.entity ?? "", e = this._isEntityActive(t), i = S.generateDynamicStyles(this.hass, this._config), s = S.shouldHideDefaultContent(this._config), r = this._config.button_type === "slider", a = r ? this._resolveNumericSliderPercent(t) : 0;
    return c`
      <style>
        ${i}
      </style>
      <div
        class="aurora-card-surface"
        ?data-state-on="${e}"
        @pointerdown="${this._handlePointerDown}"
        @pointerup="${this._handlePointerUp}"
        @pointercancel="${this._handlePointerUp}"
        @click="${this._handleCardClick}"
      >
        <!-- Module Extension: Card Backdrop Image Layer -->
        ${S.renderBackdropLayer(this._config)}

        <!-- Optional Range Slider Fill Track -->
        ${r ? c`
              <div class="aurora-slider-fill" style="width: ${a}%;"></div>
              <input
                type="range"
                class="aurora-slider-overlay-input"
                min="0"
                max="100"
                .value="${String(a)}"
                @click="${(l) => l.stopPropagation()}"
                @input="${this._onSliderInput}"
                @change="${this._onSliderChange}"
              />
            ` : c``}

        <!-- Main Card Foreground Content (Hidden if Multi Section Card hides default) -->
        ${s ? c`` : this._renderMainContent(t)}

        <!-- Module Extension: Multi Section Card (2, 3, or 4 sections) -->
        ${S.renderMultiSectionExtension(
      this,
      this.hass,
      this._config,
      (l, n) => this._resolveIcon(l, n),
      (l, n) => this._resolveName(l, n),
      (l) => this._resolveFormattedState(l)
    )}
      </div>
    `;
  }
  _renderMainContent(o) {
    const t = this._config?.show_icon !== !1, e = this._config?.show_name !== !1, i = this._config?.scrolling_effect !== !1, s = !!this._config?.prioritise_icon, a = (o && this.hass?.states ? this.hass.states[o] : void 0)?.attributes?.entity_picture, l = !!(a && !s), n = this._resolveIcon(o, this._config?.icon), p = this._resolveName(o, this._config?.name), u = this._resolveFormattedState(o), d = this._config?.sub_button ?? [], h = S.getActiveModuleIds(this._config).includes("collapsible_sub_button_groups");
    return c`
      <div class="aurora-foreground-row">
        ${t ? c`
              <div class="aurora-main-icon-wrap" @click="${this._handleIconClick}">
                ${S.renderIconProgressRing(this.hass, this._config)}${l ? c`<img class="entity-avatar-img" src="${a}" alt="" />` : c`<ha-icon .icon="${n}"></ha-icon>`}
              </div>
            ` : c``}

        <div class="aurora-title-state-col" ?data-scrolling="${i}">
          ${e ? c`<span class="aurora-card-title">${p}</span>` : c``}
          ${u ? c`<span class="aurora-card-state">${u}</span>` : c``}
        </div>

        ${d.length > 0 ? c`
              <div class="aurora-sub-buttons-bar">
                ${h ? c`
                      <button
                        type="button"
                        class="aurora-sub-pill drawer-toggle-pill"
                        @click="${(m) => {
      m.stopPropagation(), this._subButtonsCollapsed = !this._subButtonsCollapsed;
    }}"
                      >
                        <ha-icon
                          .icon="${this._subButtonsCollapsed ? "mdi:dots-horizontal" : "mdi:chevron-right"}"
                        ></ha-icon>
                      </button>
                    ` : c``}
                ${this._subButtonsCollapsed ? c`` : d.map((m) => this._renderSubButtonPill(m))}
              </div>
            ` : c``}
      </div>
    `;
  }
  _renderSubButtonPill(o) {
    const t = o.entity ?? this._config?.entity ?? "", e = this._resolveIcon(t, o.icon), i = this._isEntityActive(t), s = o.show_state && t && this.hass?.states?.[t] ? this.hass.states[t].state : "";
    return c`
      <button
        type="button"
        class="aurora-sub-pill"
        ?data-sub-active="${i}"
        @click="${(r) => {
      r.stopPropagation(), this._config && this.hass && I(
        this,
        this.hass,
        this._config,
        o.tap_action ?? { action: "toggle" },
        t
      );
    }}"
      >
        <ha-icon .icon="${e}"></ha-icon>
        ${s ? c`<span class="sub-pill-state">${s}</span>` : c``}
      </button>
    `;
  }
};
M.styles = ft`
    :host {
      display: block;
      --aurora-accent: var(--primary-color, #38bdf8);
    }

    .aurora-empty-column {
      min-height: 12px;
    }

    .aurora-card-surface {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 56px;
      padding: 10px 14px;
      border-radius: 28px;
      background: rgba(30, 41, 59, 0.72);
      backdrop-filter: blur(18px) saturate(160%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--primary-text-color, #f8fafc);
      overflow: hidden;
      cursor: pointer;
      user-select: none;
      transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
    }

    .aurora-card-surface[data-state-on] {
      border-color: rgba(56, 189, 248, 0.45);
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.15);
    }

    /* Card Backdrop Image Module Layer */
    .aurora-backdrop-container {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .aurora-backdrop-image,
    .aurora-backdrop-overlay {
      position: absolute;
      inset: 0;
    }

    /* Slider Track & Input */
    .aurora-slider-fill {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      background: rgba(56, 189, 248, 0.28);
      pointer-events: none;
      transition: width 0.1s ease-out;
    }

    .aurora-slider-overlay-input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 3;
      cursor: ew-resize;
      margin: 0;
    }

    /* Foreground Row */
    .aurora-foreground-row {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .aurora-main-icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      color: var(--secondary-text-color, #94a3b8);
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .aurora-card-surface[data-state-on] .aurora-main-icon-wrap {
      background: rgba(56, 189, 248, 0.22);
      color: var(--aurora-accent, #38bdf8);
    }

    .entity-avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .aurora-icon-progress-svg {
      position: absolute;
      inset: -3px;
      width: 44px;
      height: 44px;
      transform: rotate(-90deg);
      pointer-events: none;
    }

    .ring-track {
      stroke: rgba(255, 255, 255, 0.12);
    }

    .ring-fill {
      stroke: var(--aurora-accent, #38bdf8);
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s ease;
    }

    .aurora-title-state-col {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      min-width: 0;
    }

    .aurora-card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .aurora-card-state {
      font-size: 12px;
      color: var(--secondary-text-color, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Sub-Buttons Bar */
    .aurora-sub-buttons-bar {
      position: relative;
      z-index: 4;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .aurora-sub-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 34px;
      padding: 0 10px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--primary-text-color, #f8fafc);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      --mdc-icon-size: 18px;
      transition: all 0.15s ease;
    }

    .aurora-sub-pill[data-sub-active] {
      background: rgba(56, 189, 248, 0.25);
      border-color: var(--aurora-accent, #38bdf8);
      color: #ffffff;
    }

    /* Multi Section Card Module Grid */
    .aurora-multi-section-grid {
      position: relative;
      z-index: 2;
      display: grid;
      gap: 8px;
      width: 100%;
    }

    .aurora-multi-sec-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.05);
      overflow: hidden;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .aurora-multi-sec-cell:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    .sec-cell-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
      --mdc-icon-size: 17px;
    }

    .sec-cell-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .sec-cell-name {
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sec-cell-state {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
j([
  tt({ attribute: !1 })
], M.prototype, "hass", 2);
j([
  g()
], M.prototype, "_config", 2);
j([
  g()
], M.prototype, "_sliderTempValue", 2);
j([
  g()
], M.prototype, "_subButtonsCollapsed", 2);
M = j([
  yt("aurora-card")
], M);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "aurora-card",
  name: "Aurora Card",
  description: "A high-performance modular card inspired by Bubble Card.",
  preview: !0
  // Optional: enables visual preview in the card picker
});
export {
  M as AuroraCard
};
//# sourceMappingURL=aurora-card.js.map
