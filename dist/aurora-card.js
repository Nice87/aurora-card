/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, K = Y.ShadowRoot && (Y.ShadyCSS === void 0 || Y.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), ie = /* @__PURE__ */ new WeakMap();
let be = class {
  constructor(e, t, o) {
    if (this._$cssResult$ = !0, o !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (K && e === void 0) {
      const o = t !== void 0 && t.length === 1;
      o && (e = ie.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), o && ie.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const we = (a) => new be(typeof a == "string" ? a : a + "", void 0, Q), me = (a, ...e) => {
  const t = a.length === 1 ? a[0] : e.reduce((o, i, s) => o + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + a[s + 1], a[0]);
  return new be(t, a, Q);
}, Se = (a, e) => {
  if (K) a.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const o = document.createElement("style"), i = Y.litNonce;
    i !== void 0 && o.setAttribute("nonce", i), o.textContent = t.cssText, a.appendChild(o);
  }
}, se = K ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const o of e.cssRules) t += o.cssText;
  return we(t);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ke, defineProperty: Ce, getOwnPropertyDescriptor: Me, getOwnPropertyNames: Ae, getOwnPropertySymbols: Ee, getPrototypeOf: Te } = Object, H = globalThis, ae = H.trustedTypes, Pe = ae ? ae.emptyScript : "", Oe = H.reactiveElementPolyfillSupport, D = (a, e) => a, U = { toAttribute(a, e) {
  switch (e) {
    case Boolean:
      a = a ? Pe : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, e) {
  let t = a;
  switch (e) {
    case Boolean:
      t = a !== null;
      break;
    case Number:
      t = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(a);
      } catch {
        t = null;
      }
  }
  return t;
} }, Z = (a, e) => !ke(a, e), re = { attribute: !0, type: String, converter: U, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ??= Symbol("metadata"), H.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = re) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const o = Symbol(), i = this.getPropertyDescriptor(e, o, t);
      i !== void 0 && Ce(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, o) {
    const { get: i, set: s } = Me(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: i, set(n) {
      const c = i?.call(this);
      s?.call(this, n), this.requestUpdate(e, c, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? re;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const e = Te(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const t = this.properties, o = [...Ae(t), ...Ee(t)];
      for (const i of o) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [o, i] of t) this.elementProperties.set(o, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, o] of this.elementProperties) {
      const i = this._$Eu(t, o);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const o = new Set(e.flat(1 / 0).reverse());
      for (const i of o) t.unshift(se(i));
    } else e !== void 0 && t.push(se(e));
    return t;
  }
  static _$Eu(e, t) {
    const o = t.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const o of t.keys()) this.hasOwnProperty(o) && (e.set(o, this[o]), delete this[o]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Se(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, o) {
    this._$AK(e, o);
  }
  _$ET(e, t) {
    const o = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, o);
    if (i !== void 0 && o.reflect === !0) {
      const s = (o.converter?.toAttribute !== void 0 ? o.converter : U).toAttribute(t, o.type);
      this._$Em = e, s == null ? this.removeAttribute(i) : this.setAttribute(i, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const o = this.constructor, i = o._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const s = o.getPropertyOptions(i), n = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : U;
      this._$Em = i;
      const c = n.fromAttribute(t, s.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, o, i = !1, s) {
    if (e !== void 0) {
      const n = this.constructor;
      if (i === !1 && (s = this[e]), o ??= n.getPropertyOptions(e), !((o.hasChanged ?? Z)(s, t) || o.useDefault && o.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, o)))) return;
      this.C(e, t, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: o, reflect: i, wrapped: s }, n) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), s !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || o || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, s] of this._$Ep) this[i] = s;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [i, s] of o) {
        const { wrapped: n } = s, c = this[i];
        n !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, s, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[D("elementProperties")] = /* @__PURE__ */ new Map(), E[D("finalized")] = /* @__PURE__ */ new Map(), Oe?.({ ReactiveElement: E }), (H.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, ne = (a) => a, j = X.trustedTypes, le = j ? j.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, fe = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, _e = "?" + $, ze = `<${_e}>`, M = document, B = () => M.createComment(""), I = (a) => a === null || typeof a != "object" && typeof a != "function", ee = Array.isArray, De = (a) => ee(a) || typeof a?.[Symbol.iterator] == "function", J = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, de = />/g, S = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, ue = /"/g, ve = /^(?:script|style|textarea|title)$/i, Be = (a) => (e, ...t) => ({ _$litType$: a, strings: e, values: t }), r = Be(1), P = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function ye(a, e) {
  if (!ee(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(e) : e;
}
const Ie = (a, e) => {
  const t = a.length - 1, o = [];
  let i, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = z;
  for (let c = 0; c < t; c++) {
    const l = a[c];
    let d, u, p = -1, h = 0;
    for (; h < l.length && (n.lastIndex = h, u = n.exec(l), u !== null); ) h = n.lastIndex, n === z ? u[1] === "!--" ? n = ce : u[1] !== void 0 ? n = de : u[2] !== void 0 ? (ve.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = S) : u[3] !== void 0 && (n = S) : n === S ? u[0] === ">" ? (n = i ?? z, p = -1) : u[1] === void 0 ? p = -2 : (p = n.lastIndex - u[2].length, d = u[1], n = u[3] === void 0 ? S : u[3] === '"' ? ue : pe) : n === ue || n === pe ? n = S : n === ce || n === de ? n = z : (n = S, i = void 0);
    const g = n === S && a[c + 1].startsWith("/>") ? " " : "";
    s += n === z ? l + ze : p >= 0 ? (o.push(d), l.slice(0, p) + fe + l.slice(p) + $ + g) : l + $ + (p === -2 ? c : g);
  }
  return [ye(a, s + (a[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), o];
};
class N {
  constructor({ strings: e, _$litType$: t }, o) {
    let i;
    this.parts = [];
    let s = 0, n = 0;
    const c = e.length - 1, l = this.parts, [d, u] = Ie(e, t);
    if (this.el = N.createElement(d, o), C.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = C.nextNode()) !== null && l.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(fe)) {
          const h = u[n++], g = i.getAttribute(p).split($), v = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: s, name: v[2], strings: g, ctor: v[1] === "." ? Fe : v[1] === "?" ? Ve : v[1] === "@" ? Le : G }), i.removeAttribute(p);
        } else p.startsWith($) && (l.push({ type: 6, index: s }), i.removeAttribute(p));
        if (ve.test(i.tagName)) {
          const p = i.textContent.split($), h = p.length - 1;
          if (h > 0) {
            i.textContent = j ? j.emptyScript : "";
            for (let g = 0; g < h; g++) i.append(p[g], B()), C.nextNode(), l.push({ type: 2, index: ++s });
            i.append(p[h], B());
          }
        }
      } else if (i.nodeType === 8) if (i.data === _e) l.push({ type: 2, index: s });
      else {
        let p = -1;
        for (; (p = i.data.indexOf($, p + 1)) !== -1; ) l.push({ type: 7, index: s }), p += $.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const o = M.createElement("template");
    return o.innerHTML = e, o;
  }
}
function O(a, e, t = a, o) {
  if (e === P) return e;
  let i = o !== void 0 ? t._$Co?.[o] : t._$Cl;
  const s = I(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== s && (i?._$AO?.(!1), s === void 0 ? i = void 0 : (i = new s(a), i._$AT(a, t, o)), o !== void 0 ? (t._$Co ??= [])[o] = i : t._$Cl = i), i !== void 0 && (e = O(a, i._$AS(a, e.values), i, o)), e;
}
class Ne {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: o } = this._$AD, i = (e?.creationScope ?? M).importNode(t, !0);
    C.currentNode = i;
    let s = C.nextNode(), n = 0, c = 0, l = o[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new V(s, s.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (d = new Re(s, this, e)), this._$AV.push(d), l = o[++c];
      }
      n !== l?.index && (s = C.nextNode(), n++);
    }
    return C.currentNode = M, i;
  }
  p(e) {
    let t = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(e, o, t), t += o.strings.length - 2) : o._$AI(e[t])), t++;
  }
}
class V {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, o, i) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = o, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = O(this, e, t), I(e) ? e === y || e == null || e === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : e !== this._$AH && e !== P && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : De(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== y && I(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: o } = e, i = typeof o == "number" ? this._$AC(e) : (o.el === void 0 && (o.el = N.createElement(ye(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const s = new Ne(i, this), n = s.u(this.options);
      s.p(t), this.T(n), this._$AH = s;
    }
  }
  _$AC(e) {
    let t = he.get(e.strings);
    return t === void 0 && he.set(e.strings, t = new N(e)), t;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let o, i = 0;
    for (const s of e) i === t.length ? t.push(o = new V(this.O(B()), this.O(B()), this, this.options)) : o = t[i], o._$AI(s), i++;
    i < t.length && (this._$AR(o && o._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const o = ne(e).nextSibling;
      ne(e).remove(), e = o;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, o, i, s) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = s, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = y;
  }
  _$AI(e, t = this, o, i) {
    const s = this.strings;
    let n = !1;
    if (s === void 0) e = O(this, e, t, 0), n = !I(e) || e !== this._$AH && e !== P, n && (this._$AH = e);
    else {
      const c = e;
      let l, d;
      for (e = s[0], l = 0; l < s.length - 1; l++) d = O(this, c[o + l], t, l), d === P && (d = this._$AH[l]), n ||= !I(d) || d !== this._$AH[l], d === y ? e = y : e !== y && (e += (d ?? "") + s[l + 1]), this._$AH[l] = d;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Fe extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === y ? void 0 : e;
  }
}
class Ve extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== y);
  }
}
class Le extends G {
  constructor(e, t, o, i, s) {
    super(e, t, o, i, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = O(this, e, t, 0) ?? y) === P) return;
    const o = this._$AH, i = e === y && o !== y || e.capture !== o.capture || e.once !== o.once || e.passive !== o.passive, s = e !== y && (o === y || i);
    i && this.element.removeEventListener(this.name, this, o), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Re {
  constructor(e, t, o) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    O(this, e);
  }
}
const Ye = X.litHtmlPolyfillSupport;
Ye?.(N, V), (X.litHtmlVersions ??= []).push("3.3.3");
const Ue = (a, e, t) => {
  const o = t?.renderBefore ?? e;
  let i = o._$litPart$;
  if (i === void 0) {
    const s = t?.renderBefore ?? null;
    o._$litPart$ = i = new V(e.insertBefore(B(), s), s, void 0, t ?? {});
  }
  return i._$AI(a), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
class T extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ue(t, this.renderRoot, this.renderOptions);
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
T._$litElement$ = !0, T.finalized = !0, te.litElementHydrateSupport?.({ LitElement: T });
const je = te.litElementPolyfillSupport;
je?.({ LitElement: T });
(te.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = (a) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(a, e);
  }) : customElements.define(a, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: U, reflect: !1, hasChanged: Z }, Ge = (a = He, e, t) => {
  const { kind: o, metadata: i } = t;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), o === "setter" && ((a = Object.create(a)).wrapped = !0), s.set(t.name, a), o === "accessor") {
    const { name: n } = t;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, l, a, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, a, c), c;
    } };
  }
  if (o === "setter") {
    const { name: n } = t;
    return function(c) {
      const l = this[n];
      e.call(this, c), this.requestUpdate(n, l, a, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function oe(a) {
  return (e, t) => typeof t == "object" ? Ge(a, e, t) : ((o, i, s) => {
    const n = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, o), n ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(a, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(a) {
  return oe({ ...a, state: !0, attribute: !1 });
}
const F = (a, e, t, o) => {
  const i = {}, s = new CustomEvent(e, {
    bubbles: i.bubbles === void 0 ? !0 : i.bubbles,
    cancelable: !!i.cancelable,
    composed: i.composed === void 0 ? !0 : i.composed,
    detail: t ?? {}
  });
  return a.dispatchEvent(s), s;
}, R = (a, e, t, o, i) => {
  if (!e)
    return;
  const s = i ?? t.entity ?? "", n = typeof o == "string" ? { action: "toggle" } : o ?? t.tap_action ?? { action: "toggle" }, c = n.action ?? "toggle";
  if (c !== "none") {
    if (c === "more-info") {
      s && a instanceof HTMLElement && F(a, "hass-more-info", { entityId: s });
      return;
    }
    if (c === "navigate") {
      const l = n.navigation_path ?? t.hash ?? "#aurora-popup";
      l.startsWith("#") ? (window.location.hash = l, window.dispatchEvent(new HashChangeEvent("hashchange"))) : (window.history.pushState(null, "", l), window instanceof Window && F(window, "location-changed", { replace: !1 }));
      return;
    }
    if (c === "call-service" && n.service) {
      const [l, d] = n.service.split(".");
      l && d && e.callService(l, d, n.service_data ?? { entity_id: s });
      return;
    }
    if (s) {
      const l = s.split(".")[0];
      l === "scene" || l === "script" ? e.callService(l, "turn_on", { entity_id: s }) : e.callService("homeassistant", "toggle", { entity_id: s });
    }
  }
}, ge = "aurora_global_modules_state_v1", Je = "aurora_custom_modules_v1";
class k {
  /**
   * Synchronizes "All cards" (global_modules) and their settings across the dashboard
   */
  static syncGlobalConfigFromCard(e) {
    try {
      if (Array.isArray(e.global_modules)) {
        const o = {
          ...this.getGlobalPayload().moduleConfigs,
          ...e.module_configs ?? {}
        }, i = {
          globalModules: e.global_modules,
          moduleConfigs: o
        };
        localStorage.setItem(ge, JSON.stringify(i));
      }
    } catch {
    }
  }
  static getGlobalPayload() {
    try {
      const e = localStorage.getItem(ge);
      if (e) {
        const t = JSON.parse(e);
        return {
          globalModules: Array.isArray(t.globalModules) ? t.globalModules : [],
          moduleConfigs: t.moduleConfigs ?? {}
        };
      }
    } catch {
    }
    return { globalModules: [], moduleConfigs: {} };
  }
  static getCustomModules() {
    try {
      const e = localStorage.getItem(Je);
      if (e) {
        const t = JSON.parse(e);
        if (Array.isArray(t))
          return t;
      }
    } catch {
    }
    return [];
  }
  /**
   * Returns a deduplicated list of active module IDs for a given card
   */
  static getActiveModuleIds(e) {
    this.syncGlobalConfigFromCard(e);
    const t = e.active_modules ?? [], o = e.global_modules ?? [], i = this.getGlobalPayload().globalModules, s = /* @__PURE__ */ new Set([
      ...t,
      ...o,
      ...i
    ]);
    return Array.from(s);
  }
  /**
   * Retrieves merged configuration for a specific module ID
   */
  static getModuleConfig(e, t) {
    const o = this.getGlobalPayload().moduleConfigs[t] ?? {}, i = e.module_configs?.[t] ?? {};
    return {
      ...o,
      ...i
    };
  }
  /**
   * Evaluates ${state}, ${entity}, ${module.xyz} and inline JS template strings safely
   */
  static evaluateTemplateString(e, t, o, i) {
    if (!e)
      return "";
    const s = o.entity ?? "", n = s && t?.states ? t.states[s] : void 0, c = n ? n.state : "unknown", l = Number.isNaN(Number(c)) ? c : Number(c);
    return e.replace(/\$\{([^}]+)\}/g, (d, u) => {
      const p = u.trim();
      if (p === "state")
        return String(c);
      if (p === "entity")
        return s;
      if (p.startsWith("module.")) {
        const h = p.slice(7), g = i[h];
        return g !== void 0 ? String(g) : "";
      }
      try {
        const g = new Function("hass", "entity", "state", "stateObj", "module", "return (" + p + ");")(t, s, l, n, i);
        return g != null ? String(g) : "";
      } catch {
        return "";
      }
    });
  }
  /**
   * Checks whether default card content should be hidden (e.g. Multi Section Card)
   */
  static shouldHideDefaultContent(e) {
    return this.getActiveModuleIds(e).includes("multi_section_card") ? this.getModuleConfig(e, "multi_section_card").hide_default_content !== !1 : !1;
  }
  /**
   * Generates dynamic <style> rules for Vibe Presets, Active Modules, and Custom Styles
   */
  static generateDynamicStyles(e, t) {
    const o = [], i = this.getActiveModuleIds(t), s = t.vibe_preset ?? "aurora_lumina";
    if (s === "crimson_midnight" ? o.push(`
        .aurora-card-surface {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(136, 19, 55, 0.45)) !important;
          border: 1px solid rgba(212, 175, 55, 0.38) !important;
          box-shadow: 0 8px 28px rgba(136, 19, 55, 0.28) !important;
        }
      `) : s === "obsidian_minimal" ? o.push(`
        .aurora-card-surface {
          background: #111315 !important;
          border: 1px solid rgba(255, 255, 255, 0.07) !important;
          backdrop-filter: none !important;
        }
      `) : s === "ha_native" && o.push(`
        .aurora-card-surface {
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c)) !important;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12)) !important;
          backdrop-filter: none !important;
        }
      `), i.includes("bubble_chips")) {
      const c = this.getModuleConfig(t, "bubble_chips"), l = Number(c.chip_height ?? 42);
      o.push(`
        .aurora-card-surface {
          border-radius: 999px !important;
          min-height: ${l}px !important;
          padding: 6px 14px !important;
        }
      `);
    }
    if (i.includes("accent_color_picker")) {
      const c = this.getModuleConfig(t, "accent_color_picker"), l = String(c.accent_color ?? c.custom_param ?? "#e11d48");
      o.push(`
        :host {
          --aurora-accent: ${l} !important;
        }
        .aurora-card-surface[data-state-on] {
          border-color: ${l} !important;
          box-shadow: 0 0 20px ${l}40 !important;
        }
        .aurora-card-surface[data-state-on] .aurora-main-icon-wrap {
          background: ${l}33 !important;
          color: ${l} !important;
        }
      `);
    }
    if (i.includes("multi_section_card")) {
      const c = this.getModuleConfig(t, "multi_section_card");
      if (c.bg_color) {
        const l = String(c.bg_color).trim(), d = l === "accent" ? "var(--accent-color)" : l === "primary" ? "var(--primary-color)" : l;
        o.push(`
          .aurora-card-surface {
            background: ${d} !important;
          }
        `);
      }
    }
    if (i.includes("conditional_slider_coloring")) {
      const c = this.getModuleConfig(t, "conditional_slider_coloring"), l = String(c.default_color ?? "var(--primary-color, #38bdf8)"), d = String(c.condition_rule ?? "").trim();
      let u = l;
      const p = t.entity ?? "", h = p && e?.states ? e.states[p] : void 0, g = h ? parseFloat(h.state) : NaN;
      if (d && !Number.isNaN(g)) {
        const v = d.match(/^([^\s]+)\s+when\s*([><=]+)\s*(-?\d+(?:\.\d+)?)/i);
        if (v) {
          const x = v[1], b = v[2], w = parseFloat(v[3]);
          b === ">" && g > w && (u = x), b === ">=" && g >= w && (u = x), b === "<" && g < w && (u = x), b === "<=" && g <= w && (u = x), b === "==" && g === w && (u = x);
        }
      }
      o.push(`
        .aurora-slider-fill {
          background: ${u} !important;
        }
      `);
    }
    const n = this.getCustomModules();
    for (const c of n)
      if (i.includes(c.id) && c.codeTemplate) {
        const l = this.getModuleConfig(t, c.id), d = this.evaluateTemplateString(c.codeTemplate, e, t, l);
        o.push(d);
      }
    if (t.custom_styles) {
      const c = this.evaluateTemplateString(t.custom_styles, e, t, {});
      o.push(c);
    }
    return o.join(`
`);
  }
  /**
   * Renders the Card Backdrop Image layer if enabled
   */
  static renderBackdropLayer(e) {
    if (!this.getActiveModuleIds(e).includes("card_backdrop_image"))
      return r``;
    const o = this.getModuleConfig(e, "card_backdrop_image"), i = String(o.image_url ?? "");
    if (!i)
      return r``;
    const s = String(o.size ?? "cover"), n = String(o.repeat ?? "no-repeat"), c = !!o.custom_position, l = Number(o.pos_x ?? 50), d = Number(o.pos_y ?? 50), u = Number(o.image_opacity ?? 100) / 100, p = Number(o.blur ?? 0), h = Number(o.scale ?? 100) / 100, g = String(o.overlay_color ?? "#000000"), v = c ? `${l}%${d}%` : "center center", x = [
      `background-image: url('${i}')`,
      `background-size: ${s}`,
      `background-repeat: ${n}`,
      `background-position: ${v}`,
      `opacity: ${u}`,
      `filter: blur(${p}px)`,
      `transform: scale(${h})`
    ].join("; ");
    return r`
      <div class="aurora-backdrop-container">
        <div class="aurora-backdrop-image" style="${x}"></div>
        <div
          class="aurora-backdrop-overlay"
          style="background-color: ${g}; opacity: 0.32;"
        ></div>
      </div>
    `;
  }
  /**
   * Renders the SVG Circular Progress Ring around the main icon if Icon Border Progress is enabled
   */
  static renderIconProgressRing(e, t) {
    if (!this.getActiveModuleIds(t).includes("icon_border_progress"))
      return r``;
    const i = this.getModuleConfig(t, "icon_border_progress"), s = String(i.progress_entity ?? t.entity ?? ""), n = s && e?.states ? e.states[s] : void 0;
    let c = 65;
    if (n) {
      const p = parseFloat(n.state);
      Number.isNaN(p) ? n.attributes.brightness !== void 0 ? c = Math.round(Number(n.attributes.brightness) / 255 * 100) : n.attributes.battery_level !== void 0 ? c = Number(n.attributes.battery_level) : n.state === "on" || n.state === "heat" ? c = 100 : c = 0 : c = Math.max(0, Math.min(100, p));
    }
    const l = 19, d = 2 * Math.PI * l, u = d - c / 100 * d;
    return r`
      <svg class="aurora-icon-progress-svg" viewBox="0 0 44 44">
        <circle
          class="ring-track"
          cx="22"
          cy="22"
          r="${l}"
          fill="none"
          stroke-width="2.5"
        ></circle>
        <circle
          class="ring-fill"
          cx="22"
          cy="22"
          r="${l}"
          fill="none"
          stroke-width="2.5"
          stroke-dasharray="${d}"
          stroke-dashoffset="${u}"
        ></circle>
      </svg>
    `;
  }
  /**
   * Renders the 2, 3, or 4 column Multi Section Card extension
   */
  static renderMultiSectionExtension(e, t, o, i, s, n) {
    if (!this.getActiveModuleIds(o).includes("multi_section_card"))
      return r``;
    const l = this.getModuleConfig(o, "multi_section_card"), d = Math.min(4, Math.max(2, Number(l.section_count ?? 3))), u = Array.from({ length: d }, (p, h) => h + 1);
    return r`
      <div
        class="aurora-multi-section-grid"
        style="grid-template-columns: repeat(${d}, minmax(0, 1fr));"
      >
        ${u.map((p) => {
      const h = String(l["entity_" + p] ?? o.entity ?? ""), g = String(l["icon_" + p] ?? ""), v = String(l["name_" + p] ?? ""), x = i(h, g), b = s(h, v), w = n(h);
      return r`
            <div
              class="aurora-multi-sec-cell"
              @click="${($e) => {
        $e.stopPropagation(), h && t && F(e, "hass-more-info", { entityId: h });
      }}"
            >
              <div class="sec-cell-icon">
                <ha-icon .icon="${x}"></ha-icon>
              </div>
              <div class="sec-cell-text">
                <span class="sec-cell-name">${b}</span>
                <span class="sec-cell-state">${w}</span>
              </div>
            </div>
          `;
    })}
      </div>
    `;
  }
}
var _ = function(a, e, t, o) {
  var i = arguments.length, s = i < 3 ? e : o === null ? o = Object.getOwnPropertyDescriptor(e, t) : o, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(a, e, t, o);
  else for (var c = a.length - 1; c >= 0; c--) (n = a[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, t, s) : n(e, t)) || s);
  return i > 3 && s && Object.defineProperty(e, t, s), s;
};
const W = [
  { id: "button", label: "Button" },
  { id: "calendar", label: "Calendar" },
  { id: "climate", label: "Thermostat" },
  { id: "cover", label: "Cover" },
  { id: "horizontal-buttons-stack", label: "Horizontal buttons stack" },
  { id: "media-player", label: "Media player" },
  { id: "pop-up", label: "Pop-up" },
  { id: "select", label: "Select" },
  { id: "separator", label: "Separator" },
  { id: "sub-buttons", label: "Sub-buttons" },
  { id: "energy-flow", label: "Energy Flow Matrix" },
  { id: "security-matrix", label: "Security & Camera Hub" },
  { id: "hvac-zoning", label: "HVAC & Storage Heating" },
  { id: "mesh-topology", label: "Zigbee / Matter Mesh" }
], q = [
  {
    id: "card_backdrop_image",
    name: "Card Backdrop Image",
    version: "v1.2.0",
    creator: "Aurora Studio",
    description: "Add a configurable image backdrop to an individual card or all cards. Pick an image from Home Assistant media, enter a direct URL, and fine-tune layout, blur, scale, and overlay opacity.",
    supportedCards: ["button", "climate", "media-player", "pop-up", "cover"],
    allCards: !0,
    codeTemplate: '.aurora-card {\n  background-image: url("${module.image_url}");\n  background-size: ${module.size};\n  background-position: ${module.pos_x}% ${module.pos_y}%;\n}',
    editorSchemaYaml: `image_url:
  type: string
size:
  type: select
  options: [cover, contain]
image_opacity:
  type: number
  default: 100`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `card_backdrop_image:
  background_image:
    media_content_id: media-source://media_source/local/bg.jpg
    media_content_type: image/jpeg
  size: cover
  position: center
  repeat: no-repeat
  image_opacity: 100
  overlay_enabled: true
  overlay_color: "#000000"
  overlay_opacity: 35
  blur: 0
  scale: 100`,
    builtIn: !0
  },
  {
    id: "multi_section_card",
    name: "Multi Section Card",
    version: "v1.1.0",
    creator: "dksnbx",
    description: "Splits the card into 2, 3, or 4 sections, each showing an entity with a circular icon, optional name and state - matching the default card button look. Each section is tappable: opens more-info by default, or navigates to a pop-up hash.",
    supportedCards: ["button", "separator"],
    allCards: !1,
    codeTemplate: `/* Multi-section flex layout injection */
.aurora-multi-section {
  display: grid;
  grid-template-columns: repeat(\${module.section_count}, 1fr);
  gap: 8px;
}`,
    editorSchemaYaml: `section_count:
  type: select
  options: ["2", "3", "4"]
hide_default_content:
  type: boolean`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `multi_section_card:
  section_count: "3"
  entity_1: sensor.temperature
  icon_1: mdi:thermometer
  show_name_1: true
  name_1: "Temperature"
  show_state_1: true
  entity_2: sensor.pressure
  icon_2: mdi:gauge
  show_state_2: true
  entity_3: sensor.humidity
  icon_3: mdi:water-percent
  show_state_3: true`,
    builtIn: !0
  },
  {
    id: "conditional_slider_coloring",
    name: "Conditional slider button coloring",
    version: "v1.0.4",
    creator: "Clooos / Aurora",
    description: "Allows you to change slider colors dynamically based on entity states, numeric thresholds, or attribute conditions. Settings can be applied to this card or across all cards.",
    supportedCards: ["button", "climate", "cover", "media-player"],
    allCards: !1,
    codeTemplate: `.aurora-slider-fill {
  background: \${state > 22 ? "#ef4444" : "#38bdf8"} !important;
}`,
    editorSchemaYaml: `default_slider_color:
  type: string
conditions:
  type: list`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `conditional_slider_coloring:
  default_color: "var(--primary-color)"
  conditions:
    - condition: numeric_state
      above: 21
      color: "#ff5733"`,
    builtIn: !0
  },
  {
    id: "bubble_chips",
    name: "Bubble Chips",
    version: "v1.3.0",
    creator: "Aurora Community",
    description: "Transforms compact button and sub-button cards into floating pill-shaped status chips with customizable icon borders and compact padding.",
    supportedCards: ["button", "sub-buttons"],
    allCards: !1,
    codeTemplate: `.aurora-card {
  border-radius: 999px !important;
  min-height: 36px !important;
  padding: 4px 12px !important;
}`,
    editorSchemaYaml: `chip_height:
  type: number
  default: 36`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `bubble_chips:
  chip_height: 36
  compact_mode: true`,
    builtIn: !0
  },
  {
    id: "accent_color_picker",
    name: "Accent Color Picker",
    version: "v1.1.2",
    creator: "Aurora Studio",
    description: "Override the active glow, icon tint, and glassmorphism border accent color for individual cards using hex, RGB, or theme color tokens.",
    supportedCards: ["button", "climate", "cover", "media-player", "energy-flow"],
    allCards: !0,
    codeTemplate: `:host {
  --aurora-accent-color: \${module.accent_color};
}`,
    editorSchemaYaml: `accent_color:
  type: string
  default: "#38bdf8"`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `accent_color_picker:
  accent_color: "#e11d48"
  glow_intensity: 45`,
    builtIn: !0
  },
  {
    id: "icon_border_progress",
    name: "Icon Border Progress",
    version: "v1.0.8",
    creator: "Aurora Community",
    description: "Renders a circular SVG radial progress ring around the main card icon or sub-button icon bound to battery level, brightness, or humidity.",
    supportedCards: ["button", "climate", "sensor", "sub-buttons"],
    allCards: !1,
    codeTemplate: `.entity-icon-badge {
  box-shadow: inset 0 0 0 2px var(--primary-color);
}`,
    editorSchemaYaml: `progress_entity:
  type: entity
stroke_width:
  type: number`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `icon_border_progress:
  progress_entity: sensor.livingroom_humidity
  stroke_width: 3`,
    builtIn: !0
  },
  {
    id: "collapsible_sub_button_groups",
    name: "Collapsible Sub Button Groups",
    version: "v1.2.1",
    creator: "Aurora Studio",
    description: "Groups multiple sub-buttons into an expandable drawer badge that unfolds smoothly when tapped, saving horizontal space on mobile dashboards.",
    supportedCards: ["button", "climate", "media-player", "sub-buttons"],
    allCards: !0,
    codeTemplate: `.sub-button-group {
  transition: max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}`,
    editorSchemaYaml: `group_icon:
  type: icon
auto_collapse_seconds:
  type: number`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `collapsible_sub_button_groups:
  group_icon: mdi:dots-horizontal
  auto_collapse_seconds: 10`,
    builtIn: !0
  }
], We = [
  {
    id: "animated_weather_icons",
    name: "Animated Weather Icon",
    version: "v1.4.0",
    creator: "MeteoUX",
    description: "Replaces static weather and temperature icons with smooth keyframe-animated SVG rain, snow, sunbeams, and wind effects.",
    supportedCards: ["button", "weather-radar", "climate"],
    allCards: !0,
    codeTemplate: `@keyframes auroraPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
.entity-icon-badge ha-icon { animation: auroraPulse 3s infinite ease-in-out; }`,
    editorSchemaYaml: `animation_speed:
  type: string
  default: "3s"`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `animated_weather_icons:
  animation_speed: "3s"`
  },
  {
    id: "crimson_gothic_glass",
    name: "Crimson Midnight Gothic Shader",
    version: "v2.0.0",
    creator: "Aurora Lumina",
    description: "Applies deep midnight-blue and crimson-undertone frosted glass with metallic gold and silver border highlights.",
    supportedCards: ["button", "pop-up", "media-player", "climate"],
    allCards: !0,
    codeTemplate: `.aurora-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(136, 19, 55, 0.42)) !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
}`,
    editorSchemaYaml: `crimson_intensity:
  type: number
  default: 42`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `crimson_gothic_glass:
  crimson_intensity: 42
  metallic_accent: gold`
  },
  {
    id: "timer_progress_bar",
    name: "Timer Progress Bar",
    version: "v1.1.5",
    creator: "ChronoHA",
    description: "Displays a live countdown bar along the bottom edge of any card linked to a timer, washing machine cycle, or off-peak charging window.",
    supportedCards: ["button", "hvac-zoning", "ev-charger"],
    allCards: !1,
    codeTemplate: `.aurora-timer-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--primary-color);
}`,
    editorSchemaYaml: `timer_entity:
  type: entity`,
    suggestionRulesYaml: "",
    computedSuggestionsJs: "",
    yamlExample: `timer_progress_bar:
  timer_entity: timer.octopus_go_window`
  }
];
let m = class extends T {
  constructor() {
    super(...arguments), this._activeCategory = "all", this._moduleSubTab = "my_modules", this._moduleSearchFilter = "", this._pickerOpen = !1, this._pickerTarget = { type: "main" }, this._pickerSearchQuery = "", this._pickerDomainFilter = "all", this._installedModules = [...q], this._expandedModules = {}, this._moduleInnerAccordions = {
      backdrop_image: !0,
      backdrop_layout: !0,
      backdrop_appearance: !0,
      backdrop_overlay: !1,
      multi_sec_1: !1,
      multi_sec_2: !1,
      multi_sec_3: !1,
      multi_sec_4: !1,
      cond_default: !1,
      cond_list: !1
    }, this._creatorOpen = !1, this._importYamlOpen = !1, this._importYamlText = "", this._statusToast = "", this._creatorDraft = {
      id: "my_module",
      name: "My Module",
      version: "1.0",
      creator: "",
      description: "",
      supportedCards: ["button", "climate", "cover", "media-player", "pop-up", "separator", "sub-buttons"],
      allCards: !0,
      codeTemplate: "",
      editorSchemaYaml: "",
      suggestionRulesYaml: "",
      computedSuggestionsJs: "",
      yamlExample: ""
    }, this._creatorPreviewMode = !1, this._creatorPreviewEntity = "", this._creatorSections = {
      supported_cards: !0,
      description: !1,
      code_template: !0,
      editor_schema: !0,
      entity_suggestions: !0,
      export_module: !0
    }, this._openSections = {
      card_settings: !0,
      tap_icon: !1,
      tap_card: !1,
      hold_card: !1,
      sub_buttons: !1,
      sub_top: !0,
      sub_bottom: !1,
      styling: !1,
      style_layout: !0,
      style_custom: !1,
      modules: !1
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._loadStoredCustomModules();
  }
  _loadStoredCustomModules() {
    try {
      const e = localStorage.getItem("aurora_custom_modules_v1");
      if (e) {
        const t = JSON.parse(e);
        if (Array.isArray(t) && t.length > 0) {
          const o = new Set(q.map((s) => s.id)), i = [
            ...q,
            ...t.filter((s) => !o.has(s.id))
          ];
          this._installedModules = i;
        }
      }
    } catch {
    }
  }
  _persistCustomModules() {
    try {
      const e = this._installedModules.filter((t) => !t.builtIn);
      localStorage.setItem("aurora_custom_modules_v1", JSON.stringify(e));
    } catch {
    }
  }
  setConfig(e) {
    this._config = {
      card_type: "button",
      button_type: "switch",
      scrolling_effect: !0,
      show_icon: !0,
      prioritise_icon: !1,
      show_name: !0,
      state_content: ["state", "preset_mode", "hvac_action"],
      active_modules: [],
      global_modules: [],
      module_configs: {},
      ...e
    }, !this._creatorPreviewEntity && e.entity && (this._creatorPreviewEntity = e.entity);
  }
  _showToast(e) {
    this._statusToast = e, setTimeout(() => {
      this._statusToast = "";
    }, 2800);
  }
  _toggleSection(e) {
    const t = !!this._openSections[e];
    this._openSections = {
      ...this._openSections,
      [e]: !t
    };
  }
  _toggleModuleAccordion(e) {
    const t = !!this._expandedModules[e];
    this._expandedModules = {
      ...this._expandedModules,
      [e]: !t
    };
  }
  _toggleModuleInner(e) {
    const t = !!this._moduleInnerAccordions[e];
    this._moduleInnerAccordions = {
      ...this._moduleInnerAccordions,
      [e]: !t
    };
  }
  _toggleCreatorSection(e) {
    const t = !!this._creatorSections[e];
    this._creatorSections = {
      ...this._creatorSections,
      [e]: !t
    };
  }
  _openEntityPicker(e) {
    this._pickerTarget = e, this._pickerSearchQuery = "", this._pickerDomainFilter = "all", this._pickerOpen = !0;
  }
  _closeEntityPicker() {
    this._pickerOpen = !1;
  }
  _getCurrentTargetEntity() {
    return this._config ? this._pickerTarget.type === "main" ? this._config.entity ?? "" : this._pickerTarget.type === "sub" ? (this._config.sub_button ?? [])[this._pickerTarget.index]?.entity ?? "" : this._pickerTarget.type === "module_field" ? String(this._getModuleFieldVal(this._pickerTarget.moduleId, this._pickerTarget.fieldKey, "")) : this._pickerTarget.type === "creator_preview" ? this._creatorPreviewEntity : "" : "";
  }
  _selectEntityFromModal(e) {
    this._config && (this._pickerTarget.type === "main" ? this._setDirectValue("entity", e) : this._pickerTarget.type === "sub" ? this._updateSubButton(this._pickerTarget.index, "entity", e) : this._pickerTarget.type === "module_field" ? this._setModuleFieldVal(this._pickerTarget.moduleId, this._pickerTarget.fieldKey, e) : this._pickerTarget.type === "creator_preview" && (this._creatorPreviewEntity = e), this._pickerOpen = !1);
  }
  _getEntityFriendlyName(e) {
    if (!e)
      return "Select an entity";
    if (!this.hass || !this.hass.states[e])
      return e;
    const t = this.hass.states[e].attributes.friendly_name;
    return t ? String(t) : e;
  }
  _getEntitySecondary(e) {
    if (!e)
      return "Tap to search entities";
    if (this.hass && this.hass.states[e]) {
      const t = this.hass.states[e].attributes;
      if (t.area_name)
        return String(t.area_name);
      if (t.device_class) {
        const o = String(t.device_class).replace(/_/g, " ");
        return o.charAt(0).toUpperCase() + o.slice(1) + " • " + e;
      }
    }
    return e;
  }
  _getEntityDomainBadge(e) {
    if (!e)
      return "";
    const o = (e.split(".")[0] ?? "").replace(/_/g, " ");
    return o.charAt(0).toUpperCase() + o.slice(1);
  }
  _getEntityIcon(e) {
    if (!e || !this.hass || !this.hass.states[e])
      return "mdi:help-circle-outline";
    const t = this.hass.states[e], o = t.attributes.icon;
    if (o)
      return String(o);
    const i = e.split(".")[0], s = t.attributes.device_class;
    if (i === "sensor")
      return s === "temperature" ? "mdi:thermometer" : s === "humidity" ? "mdi:water-percent" : s === "power" || s === "energy" ? "mdi:flash" : s === "battery" ? "mdi:battery" : "mdi:eye-outline";
    const n = {
      light: "mdi:lightbulb",
      switch: "mdi:toggle-switch",
      climate: "mdi:thermostat",
      binary_sensor: "mdi:radiobox-marked",
      media_player: "mdi:cast-audio",
      remote: "mdi:remote",
      cover: "mdi:window-shutter",
      fan: "mdi:fan",
      lock: "mdi:lock",
      camera: "mdi:video",
      weather: "mdi:weather-partly-cloudy",
      update: "mdi:package-up",
      select: "mdi:format-list-bulleted",
      input_select: "mdi:tune-vertical",
      input_number: "mdi:thermometer-lines",
      input_boolean: "mdi:toggle-switch-outline",
      person: "mdi:account",
      scene: "mdi:palette-outline",
      script: "mdi:script-text-outline",
      automation: "mdi:robot"
    };
    return n[i] ? n[i] : "mdi:bookmark-outline";
  }
  _getModalFilteredEntities() {
    if (!this.hass || !this.hass.states)
      return [];
    const e = Object.keys(this.hass.states).sort((i, s) => {
      const n = this._getEntityFriendlyName(i).toLowerCase(), c = this._getEntityFriendlyName(s).toLowerCase();
      return n.localeCompare(c);
    }), t = this._pickerSearchQuery.trim().toLowerCase(), o = this._pickerDomainFilter;
    return e.filter((i) => {
      const s = i.split(".")[0];
      if (o !== "all" && s !== o)
        return !1;
      if (!t)
        return !0;
      const n = this._getEntityFriendlyName(i).toLowerCase(), c = this._getEntityDomainBadge(i).toLowerCase();
      return i.toLowerCase().includes(t) || n.includes(t) || c.includes(t);
    });
  }
  // Phase 3 Helper Methods for Module Compatibility & Config
  _isModuleCompatible(e) {
    if (e.allCards)
      return !0;
    const t = this._config?.card_type ?? "button";
    return e.supportedCards.includes(t);
  }
  _isModuleAppliedToThisCard(e) {
    return (this._config?.active_modules ?? []).includes(e);
  }
  _isModuleAppliedToAllCards(e) {
    return (this._config?.global_modules ?? []).includes(e);
  }
  _toggleModuleApplyThisCard(e) {
    const t = [...this._config?.active_modules ?? []], o = t.includes(e) ? t.filter((i) => i !== e) : [...t, e];
    this._setDirectValue("active_modules", o);
  }
  _toggleModuleApplyAllCards(e) {
    const t = [...this._config?.global_modules ?? []], o = t.includes(e) ? t.filter((i) => i !== e) : [...t, e];
    this._setDirectValue("global_modules", o);
  }
  _getModuleFieldVal(e, t, o) {
    const s = (this._config?.module_configs ?? {})[e] ?? {};
    return s[t] !== void 0 ? s[t] : o;
  }
  _setModuleFieldVal(e, t, o) {
    if (!this._config)
      return;
    const i = { ...this._config.module_configs ?? {} }, s = { ...i[e] ?? {}, [t]: o };
    i[e] = s, this._setDirectValue("module_configs", i);
  }
  _openNewModuleCreator() {
    this._creatorDraft = {
      id: "my_module",
      name: "My Module",
      version: "1.0",
      creator: "Przemysław",
      description: "Custom style and behavior extension for Aurora Card.",
      supportedCards: [
        "button",
        "calendar",
        "climate",
        "cover",
        "horizontal-buttons-stack",
        "media-player",
        "pop-up",
        "select",
        "separator",
        "sub-buttons"
      ],
      allCards: !0,
      codeTemplate: `/* Access card state via \${state} or \${entity} */
.aurora-card {
  
}`,
      editorSchemaYaml: `# Define visual editor inputs for this module:
accent_override:
  name: Accent Override
  type: string`,
      suggestionRulesYaml: `domain: climate
name_includes: heater`,
      computedSuggestionsJs: 'return Object.keys(hass.states).filter(id => id.startsWith("climate."));',
      yamlExample: `my_module:
  accent_override: "#38bdf8"`
    }, this._creatorOpen = !0;
  }
  _openEditModuleInCreator(e) {
    this._creatorDraft = {
      ...e,
      supportedCards: [...e.supportedCards]
    }, this._creatorOpen = !0;
  }
  _deleteInstalledModule(e) {
    this._installedModules = this._installedModules.filter((t) => t.id !== e), this._persistCustomModules(), this._showToast("Module removed.");
  }
  _saveCreatorModule() {
    const e = this._creatorDraft.id.trim().replace(/\s+/g, "_").toLowerCase();
    if (!e)
      return;
    const t = {
      ...this._creatorDraft,
      id: e,
      yamlExample: this._creatorDraft.yamlExample || e + `:
  enabled: true
  version: "` + this._creatorDraft.version + '"'
    }, o = this._installedModules.findIndex((i) => i.id === e);
    if (o >= 0) {
      const i = [...this._installedModules];
      i[o] = t, this._installedModules = i;
    } else
      this._installedModules = [t, ...this._installedModules];
    this._persistCustomModules(), this._creatorOpen = !1, this._expandedModules = { ...this._expandedModules, [e]: !0 }, this._showToast('Module "' + t.name + '" saved!');
  }
  _buildModuleExportYaml(e) {
    const t = [
      "# Aurora Card Module Definition",
      "id: " + e.id,
      'name: "' + e.name + '"',
      'version: "' + e.version + '"',
      'creator: "' + e.creator + '"',
      "supported_cards: [" + (e.allCards ? "all" : e.supportedCards.join(", ")) + "]",
      "description: |",
      "  " + (e.description || "Custom Aurora module"),
      "code: |",
      ...e.codeTemplate.split(`
`).map((o) => "  " + o)
    ];
    return e.editorSchemaYaml && (t.push("schema: |"), t.push(...e.editorSchemaYaml.split(`
`).map((o) => "  " + o))), t.join(`
`);
  }
  _copyModuleYaml(e) {
    const t = this._buildModuleExportYaml(this._creatorDraft), o = e ? "### " + this._creatorDraft.name + " (" + this._creatorDraft.version + `)
Created by **` + (this._creatorDraft.creator || "Community") + "**\n\n```yaml\n" + t + "\n```" : t;
    navigator.clipboard && navigator.clipboard.writeText(o), this._showToast(e ? "Copied Markdown for GitHub!" : "Copied Module YAML!");
  }
  _downloadModuleYaml() {
    const e = this._buildModuleExportYaml(this._creatorDraft), t = new Blob([e], { type: "text/yaml;charset=utf-8" }), o = URL.createObjectURL(t), i = document.createElement("a");
    i.href = o, i.download = (this._creatorDraft.id || "aurora_module") + ".yaml", i.click(), URL.revokeObjectURL(o), this._showToast("Downloaded " + i.download);
  }
  _handleImportYamlConfirm() {
    const e = this._importYamlText.trim();
    if (!e)
      return;
    const t = e.match(/^id:\s*([^\n\r]+)/m), o = e.match(/^name:\s*["']?([^"'\n\r]+)["']?/m), i = e.match(/^version:\s*["']?([^"'\n\r]+)["']?/m), s = e.match(/^creator:\s*["']?([^"'\n\r]+)["']?/m), n = t ? t[1].trim() : "imported_" + Date.now(), c = o ? o[1].trim() : "Imported YAML Module", l = i ? i[1].trim() : "v1.0.0", d = s ? s[1].trim() : "YAML Import", u = {
      id: n,
      name: c,
      version: l,
      creator: d,
      description: "Imported from YAML configuration.",
      supportedCards: ["button", "climate", "media-player"],
      allCards: !0,
      codeTemplate: e,
      editorSchemaYaml: "",
      suggestionRulesYaml: "",
      computedSuggestionsJs: "",
      yamlExample: e
    };
    this._installedModules = [u, ...this._installedModules], this._persistCustomModules(), this._importYamlText = "", this._importYamlOpen = !1, this._expandedModules = { ...this._expandedModules, [n]: !0 }, this._showToast('Imported "' + c + '"!');
  }
  _installFromStore(e) {
    this._installedModules.some((o) => o.id === e.id) || (this._installedModules = [e, ...this._installedModules], this._persistCustomModules()), this._moduleSubTab = "my_modules", this._expandedModules = { ...this._expandedModules, [e.id]: !0 }, this._showToast('Installed "' + e.name + '" to My Modules!');
  }
  render() {
    if (!this._config || !this.hass)
      return r``;
    const e = this._activeCategory === "all" || this._activeCategory === "general", t = this._activeCategory === "all" || this._activeCategory === "subbuttons", o = this._activeCategory === "all" || this._activeCategory === "styles", i = this._activeCategory === "all" || this._activeCategory === "modules";
    return r`
      <div class="aurora-editor-root">
        ${this._statusToast ? r`<div class="aurora-toast">${this._statusToast}</div>` : r``}
        ${this._renderCategoryTabs()}
        ${e ? this._renderTopSelectors() : r``}
        <div class="accordions-stack">
          ${e ? this._renderCardSettingsAccordion() : r``}
          ${e ? this._renderTapIconAccordion() : r``}
          ${e ? this._renderTapCardAccordion() : r``}
          ${e ? this._renderHoldAccordion() : r``}
          ${t ? this._renderSubButtonsAccordion() : r``}
          ${o ? this._renderStylingAccordion() : r``}
          ${i ? this._renderModulesAccordion() : r``}
        </div>
        ${this._pickerOpen ? this._renderEntityPickerModal() : r``}
      </div>
    `;
  }
  _renderEntityPickerModal() {
    const e = this._getModalFilteredEntities(), t = e.slice(0, 100), o = this._getCurrentTargetEntity(), i = [
      { id: "all", label: "All" },
      { id: "climate", label: "Climate" },
      { id: "light", label: "Lights" },
      { id: "switch", label: "Switches" },
      { id: "media_player", label: "Media" },
      { id: "sensor", label: "Sensors" },
      { id: "binary_sensor", label: "Binary" },
      { id: "input_select", label: "Inputs" }
    ];
    return r`
      <div class="picker-backdrop" @click="${this._closeEntityPicker}">
        <div class="picker-sheet" @click="${(s) => s.stopPropagation()}">
          <div class="picker-handle-bar">
            <span class="sheet-grip"></span>
          </div>

          <div class="picker-header">
            <div class="picker-search-Input-wrap">
              <ha-icon icon="mdi:magnify" class="search-icon"></ha-icon>
              <input
                type="text"
                class="picker-search-input"
                placeholder="Search"
                autofocus
                .value="${this._pickerSearchQuery}"
                @input="${(s) => this._pickerSearchQuery = s.target.value}"
              />
              ${this._pickerSearchQuery ? r`
                    <button
                      class="clear-btn"
                      @click="${() => this._pickerSearchQuery = ""}"
                    >
                      ✕
                    </button>
                  ` : r``}
            </div>
            <button class="modal-close-btn" @click="${this._closeEntityPicker}">
              Cancel
            </button>
          </div>

          <div class="picker-domain-bar">
            ${i.map((s) => r`
                <button
                  class="dom-chip"
                  ?data-active="${this._pickerDomainFilter === s.id}"
                  @click="${() => this._pickerDomainFilter = s.id}"
                >
                  ${s.label}
                </button>
              `)}
          </div>

          <div class="picker-list">
            ${t.map((s) => r`
                <div
                  class="picker-row"
                  ?data-selected="${s === o}"
                  @click="${() => this._selectEntityFromModal(s)}"
                >
                  <div class="picker-row-icon">
                    <ha-icon .icon="${this._getEntityIcon(s)}"></ha-icon>
                  </div>
                  <div class="picker-row-main">
                    <span class="picker-row-title">${this._getEntityFriendlyName(s)}</span>
                    <span class="picker-row-sub">${this._getEntitySecondary(s)}</span>
                  </div>
                  <div class="picker-row-domain">
                    ${this._getEntityDomainBadge(s)}
                  </div>
                </div>
              `)}

            ${e.length === 0 ? r`
                  <div class="picker-empty">
                    No matching entities found.
                  </div>
                ` : r``}

            ${e.length > 100 ? r`
                  <div class="picker-more-hint">
                    Showing top 100 of ${e.length} entities. Type above to refine.
                  </div>
                ` : r``}
          </div>
        </div>
      </div>
    `;
  }
  _renderCategoryTabs() {
    const e = (this._config?.sub_button ?? []).length, t = (this._config?.active_modules ?? []).length + (this._config?.global_modules ?? []).length;
    return r`
      <div class="category-bar">
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === "all"}"
          @click="${() => this._activeCategory = "all"}"
        >
          All
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === "general"}"
          @click="${() => this._activeCategory = "general"}"
        >
          General
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === "subbuttons"}"
          @click="${() => this._activeCategory = "subbuttons"}"
        >
          Sub-buttons (${e})
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === "styles"}"
          @click="${() => this._activeCategory = "styles"}"
        >
          Styling
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === "modules"}"
          @click="${() => {
      this._activeCategory = "modules", this._openSections = { ...this._openSections, modules: !0 };
    }}"
        >
          Modules (${t})
        </button>
      </div>
    `;
  }
  _renderTopSelectors() {
    const e = this._config?.card_type ?? "button", t = this._config?.button_type ?? "switch", o = this._config?.entity ?? "";
    return r`
      <div class="top-selectors">
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Card type</span>
            <select
              class="native-select"
              .value="${e}"
              @change="${(i) => this._valueChanged(i, "card_type")}"
            >
              <optgroup label="Core Bubble Parity">
                <option value="button">Button (Switch, slider, ...)</option>
                <option value="pop-up">Pop-up</option>
                <option value="separator">Separator</option>
                <option value="cover">Cover</option>
                <option value="climate">Climate</option>
                <option value="media-player">Media player</option>
                <option value="empty-column">Empty column</option>
              </optgroup>
              <optgroup label="Aurora Enterprise Suite">
                <option value="routine-macro">Routine Macro Launcher</option>
                <option value="energy-flow">Energy Flow Matrix</option>
                <option value="security-matrix">Security & Camera Hub</option>
                <option value="weather-radar">Weather & Microclimate</option>
                <option value="multi-room-audio">Multi-Room Audio (MA)</option>
                <option value="hvac-zoning">HVAC & Storage Heating</option>
                <option value="mesh-topology">Zigbee / Matter Mesh</option>
                <option value="ev-charger">EV & Solar Charger</option>
                <option value="air-quality">Air Quality Matrix</option>
                <option value="floorplan">Interactive Floorplan</option>
              </optgroup>
            </select>
          </div>
          <button
            class="clear-btn"
            title="Reset to button"
            @click="${() => this._setDirectValue("card_type", "button")}"
          >
            ✕
          </button>
        </div>

        ${e === "button" ? r`
              <div class="ha-filled-box">
                <div class="box-content">
                  <span class="floating-label">Button type</span>
                  <select
                    class="native-select"
                    .value="${t}"
                    @change="${(i) => this._valueChanged(i, "button_type")}"
                  >
                    <option value="switch">Switch</option>
                    <option value="slider">Slider</option>
                    <option value="state">State</option>
                    <option value="name">Name / Text</option>
                  </select>
                </div>
                <button
                  class="clear-btn"
                  title="Reset"
                  @click="${() => this._setDirectValue("button_type", "switch")}"
                >
                  ✕
                </button>
              </div>
            ` : r``}

        ${e !== "empty-column" ? r`
              <div class="section-caption">Entity (toggle)</div>
              <div
                class="ha-entity-box"
                @click="${() => this._openEntityPicker({ type: "main" })}"
              >
                <div class="entity-icon-badge">
                  <ha-icon .icon="${this._getEntityIcon(o)}"></ha-icon>
                </div>
                <div class="entity-text-col">
                  <span class="entity-primary">${this._getEntityFriendlyName(o)}</span>
                  <span class="entity-secondary">${this._getEntitySecondary(o)}</span>
                </div>
                ${o ? r`
                      <button
                        class="clear-btn"
                        title="Clear entity"
                        @click="${(i) => {
      i.stopPropagation(), this._setDirectValue("entity", void 0);
    }}"
                      >
                        ✕
                      </button>
                    ` : r``}
                <span class="dropdown-caret">▼</span>
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderCardSettingsAccordion() {
    const e = !!this._openSections.card_settings, t = this._config?.name ?? "", o = this._config?.icon ?? "", i = this._config?.scrolling_effect !== !1, s = this._config?.show_icon !== !1, n = !!this._config?.prioritise_icon, c = this._config?.show_name !== !1, l = this._config?.state_content ?? ["state"];
    return r`
      <div class="ha-accordion" ?data-open="${e}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection("card_settings")}">
          <div class="header-left">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>Card settings</span>
          </div>
          <span class="chevron">${e ? "▲" : "▼"}</span>
        </div>

        ${e ? r`
              <div class="ha-accordion-body">
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Name</span>
                    <input
                      type="text"
                      class="native-input"
                      .value="${t}"
                      placeholder=" "
                      @input="${(d) => this._valueChanged(d, "name")}"
                    />
                  </div>
                </div>

                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Icon</span>
                    <input
                      type="text"
                      class="native-input"
                      .value="${o}"
                      placeholder="e.g. mdi:thermometer"
                      @input="${(d) => this._valueChanged(d, "icon")}"
                    />
                  </div>
                </div>

                <div class="toggle-list">
                  ${this._renderToggleRow("Text scrolling effect", i, (d) => this._setDirectValue("scrolling_effect", d))}
                  ${this._renderToggleRow("Show icon", s, (d) => this._setDirectValue("show_icon", d))}
                  ${this._renderToggleRow("Prioritise icon over entity picture", n, (d) => this._setDirectValue("prioritise_icon", d))}
                  ${this._renderToggleRow("Show name", c, (d) => this._setDirectValue("show_name", d))}
                </div>

                <div class="state-content-block">
                  <span class="block-label">State content</span>
                  <div class="chips-well">
                    <div class="chips-list">
                      ${l.map((d, u) => r`
                          <div class="ha-chip">
                            <span class="chip-drag">＝</span>
                            <span class="chip-text">${this._formatChipLabel(d)}</span>
                            <button
                              class="chip-remove"
                              @click="${() => this._removeStateChip(u)}"
                            >
                              ✕
                            </button>
                          </div>
                        `)}
                    </div>
                    <button class="chip-add-btn" @click="${this._addStateChip}">
                      <span>＋</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderTapIconAccordion() {
    const e = !!this._openSections.tap_icon, t = this._config?.icon_tap_action?.action ?? "toggle";
    return r`
      <div class="ha-accordion" ?data-open="${e}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection("tap_icon")}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap"></ha-icon>
            <span>Tap action on icon</span>
          </div>
          <span class="chevron">${e ? "▲" : "▼"}</span>
        </div>
        ${e ? r`
              <div class="ha-accordion-body">
                ${this._renderActionSelector("icon_tap_action", t)}
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderTapCardAccordion() {
    const e = !!this._openSections.tap_card, t = this._config?.tap_action?.action ?? "toggle";
    return r`
      <div class="ha-accordion" ?data-open="${e}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection("tap_card")}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
            <span>Tap action on card</span>
          </div>
          <span class="chevron">${e ? "▲" : "▼"}</span>
        </div>
        ${e ? r`
              <div class="ha-accordion-body">
                ${this._renderActionSelector("tap_action", t)}
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderHoldAccordion() {
    const e = !!this._openSections.hold_card, t = this._config?.hold_action?.action ?? "more-info";
    return r`
      <div class="ha-accordion" ?data-open="${e}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection("hold_card")}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap-hold"></ha-icon>
            <span>Hold behaviour</span>
          </div>
          <span class="chevron">${e ? "▲" : "▼"}</span>
        </div>
        ${e ? r`
              <div class="ha-accordion-body">
                ${this._renderActionSelector("hold_action", t)}
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderSubButtonsAccordion() {
    const e = !!this._openSections.sub_buttons, t = !!this._openSections.sub_top, o = !!this._openSections.sub_bottom, i = this._config?.sub_button ?? [];
    return r`
      <div class="ha-accordion" ?data-open="${e}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection("sub_buttons")}">
          <div class="header-left">
            <ha-icon icon="mdi:shape-square-plus"></ha-icon>
            <span>Sub-buttons editor</span>
          </div>
          <span class="chevron">${e ? "▲" : "▼"}</span>
        </div>

        ${e ? r`
              <div class="ha-accordion-body">
                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection("sub_top")}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:arrow-up-circle-outline"></ha-icon>
                      <span>Main sub-buttons (top)</span>
                    </div>
                    <span class="chevron">${t ? "▲" : "▼"}</span>
                  </div>
                  ${t ? r`
                        <div class="ha-nested-body">
                          ${i.map((s, n) => {
      const c = s.entity ?? "";
      return r`
                              <div class="sub-button-row">
                                <button
                                  type="button"
                                  class="sub-entity-picker-btn"
                                  @click="${() => this._openEntityPicker({ type: "sub", index: n })}"
                                >
                                  <ha-icon .icon="${this._getEntityIcon(c)}"></ha-icon>
                                  <span class="sub-ent-label">
                                    ${this._getEntityFriendlyName(c)}
                                  </span>
                                  <span class="dropdown-caret">▼</span>
                                </button>
                                <input
                                  type="text"
                                  class="native-input sub-icon-input"
                                  placeholder="mdi:power"
                                  .value="${s.icon ?? ""}"
                                  @input="${(l) => this._updateSubButton(n, "icon", l.target.value)}"
                                />
                                <button
                                  class="danger-icon-btn"
                                  @click="${() => this._removeSubButton(n)}"
                                >
                                  ✕
                                </button>
                              </div>
                            `;
    })}
                          <button class="chip-add-btn" @click="${this._addSubButton}">
                            <span>＋</span>
                            <span>Add sub-button</span>
                          </button>
                        </div>
                      ` : r``}
                </div>

                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection("sub_bottom")}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:arrow-down-circle-outline"></ha-icon>
                      <span>Bottom sub-buttons</span>
                    </div>
                    <span class="chevron">${o ? "▲" : "▼"}</span>
                  </div>
                  ${o ? r`
                        <div class="ha-nested-body">
                          <p class="muted-note">
                            Configure bottom-aligned bar sub-buttons or group stacks.
                          </p>
                          <button class="chip-add-btn" @click="${this._addSubButton}">
                            <span>＋</span>
                            <span>Add bottom sub-button</span>
                          </button>
                        </div>
                      ` : r``}
                </div>

                <div class="ha-info-callout">
                  <div class="callout-title">
                    <ha-icon icon="mdi:information-outline"></ha-icon>
                    <span>Sub-buttons</span>
                  </div>
                  <p>
                    This editor allows you to add customised sub-buttons to your card.
                    Sub-buttons support three types:
                  </p>
                  <ul class="callout-list">
                    <li>
                      <strong>Default (button)</strong> - Standard button with tap actions
                    </li>
                    <li>
                      <strong>Slider</strong> - Control or display numeric values (brightness,
                      volume, temperature, etc.)
                    </li>
                    <li>
                      <strong>Dropdown / Select</strong> - Dropdown menu for selectable entities
                    </li>
                  </ul>
                </div>
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderStylingAccordion() {
    const e = !!this._openSections.styling, t = !!this._openSections.style_layout, o = !!this._openSections.style_custom, i = this._config?.vibe_preset ?? "aurora_lumina", s = this._config?.custom_styles ?? "";
    return r`
      <div class="ha-accordion" ?data-open="${e}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection("styling")}">
          <div class="header-left">
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>Styling and layout options</span>
          </div>
          <span class="chevron">${e ? "▲" : "▼"}</span>
        </div>

        ${e ? r`
              <div class="ha-accordion-body">
                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection("style_layout")}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:view-grid"></ha-icon>
                      <span>Layout</span>
                    </div>
                    <span class="chevron">${t ? "▲" : "▼"}</span>
                  </div>
                  ${t ? r`
                        <div class="ha-nested-body">
                          <div class="ha-filled-box">
                            <div class="box-content">
                              <span class="floating-label">Aurora Aesthetic Vibe Preset</span>
                              <select
                                class="native-select"
                                .value="${i}"
                                @change="${(n) => this._valueChanged(n, "vibe_preset")}"
                              >
                                <option value="aurora_lumina">Aurora Lumina (Frosted Glass)</option>
                                <option value="crimson_midnight">Crimson Midnight (Gothic Dark)</option>
                                <option value="obsidian_minimal">Obsidian Minimal</option>
                                <option value="ha_native">Home Assistant Native Surface</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ` : r``}
                </div>

                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection("style_custom")}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:code-braces"></ha-icon>
                      <span>Custom styles & templates</span>
                    </div>
                    <span class="chevron">${o ? "▲" : "▼"}</span>
                  </div>
                  ${o ? r`
                        <div class="ha-nested-body">
                          <textarea
                            class="code-textarea"
                            rows="4"
                            placeholder=".aurora-card { --aurora-blur: 24px; }"
                            .value="${s}"
                            @input="${(n) => this._valueChanged(n, "custom_styles")}"
                          ></textarea>
                        </div>
                      ` : r``}
                </div>
              </div>
            ` : r``}
      </div>
    `;
  }
  // ============================================================================
  // PHASE 3: MODULES ACCORDION, MODULE STUDIO & MODULE CREATOR
  // ============================================================================
  _renderModulesAccordion() {
    const e = !!this._openSections.modules;
    return r`
      <div class="ha-accordion" ?data-open="${e}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection("modules")}">
          <div class="header-left">
            <ha-icon icon="mdi:puzzle"></ha-icon>
            <span>Modules</span>
          </div>
          <span class="chevron">${e ? "▲" : "▼"}</span>
        </div>

        ${e ? r`
              <div class="ha-accordion-body">
                <!-- Top Sub-Tabs: My Modules | Module Store (Screenshots 4, 5, 8) -->
                <div class="module-subtabs">
                  <button
                    class="mod-tab"
                    ?data-active="${this._moduleSubTab === "my_modules"}"
                    @click="${() => {
      this._moduleSubTab = "my_modules", this._creatorOpen = !1;
    }}"
                  >
                    <ha-icon icon="mdi:puzzle-heart-outline"></ha-icon>
                    <span>My Modules</span>
                  </button>
                  <button
                    class="mod-tab"
                    ?data-active="${this._moduleSubTab === "store"}"
                    @click="${() => {
      this._moduleSubTab = "store", this._creatorOpen = !1;
    }}"
                  >
                    <ha-icon icon="mdi:puzzle-plus-outline"></ha-icon>
                    <span>Module Store</span>
                  </button>
                </div>

                ${this._creatorOpen ? this._renderModuleCreatorStudio() : this._moduleSubTab === "my_modules" ? this._renderMyModulesView() : this._renderModuleStoreView()}
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderMyModulesView() {
    const e = !!this._config?.enable_unsupported_modules, t = this._moduleSearchFilter.trim().toLowerCase(), o = this._installedModules.filter((i) => {
      const s = this._isModuleCompatible(i);
      return !e && !s ? !1 : t ? i.name.toLowerCase().includes(t) || i.id.toLowerCase().includes(t) || i.description.toLowerCase().includes(t) : !0;
    });
    return r`
      <!-- Search Bar & Sort Row (Screenshot 8) -->
      <div class="module-search-row">
        <div class="module-search-bar">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search modules"
            .value="${this._moduleSearchFilter}"
            @input="${(i) => this._moduleSearchFilter = i.target.value}"
          />
        </div>
        <button
          class="sort-icon-btn"
          title="Sort compatible first"
          @click="${() => {
      this._installedModules = [...this._installedModules].reverse();
    }}"
        >
          <ha-icon icon="mdi:sort"></ha-icon>
        </button>
      </div>

      ${this._renderToggleRow("Enable unsupported modules", e, (i) => this._setDirectValue("enable_unsupported_modules", i))}

      <!-- Installed Modules Accordion List (Screenshots 6, 7, 11, 12) -->
      <div class="modules-accordion-list">
        ${o.map((i) => this._renderSingleInstalledModule(i))}
      </div>

      <!-- Create New Module & Import From YAML Action Pills (Screenshot 6, 11) -->
      <div class="module-action-pills-row">
        <button class="teal-action-pill" @click="${this._openNewModuleCreator}">
          <ha-icon icon="mdi:puzzle-plus"></ha-icon>
          <span>Create new Module</span>
        </button>
        <button
          class="teal-action-pill"
          @click="${() => this._importYamlOpen = !this._importYamlOpen}"
        >
          <ha-icon icon="mdi:code-braces"></ha-icon>
          <span>Import from YAML</span>
        </button>
      </div>

      ${this._importYamlOpen ? r`
            <div class="import-yaml-drawer">
              <span class="block-label">Paste Module YAML</span>
              <textarea
                class="code-textarea"
                rows="6"
                placeholder="id: custom_glow\nname: Custom Glow\nversion: 1.0\ncode: |\n  .aurora-card { box-shadow: 0 0 18px #38bdf8; }"
                .value="${this._importYamlText}"
                @input="${(i) => this._importYamlText = i.target.value}"
              ></textarea>
              <div class="creator-bottom-actions">
                <button
                  class="teal-action-pill secondary-pill"
                  @click="${() => this._importYamlOpen = !1}"
                >
                  ✕ Cancel
                </button>
                <button class="teal-action-pill" @click="${this._handleImportYamlConfirm}">
                  ＋ Import Module
                </button>
              </div>
            </div>
          ` : r``}

      <!-- Informational Callout Box (Screenshot 6, 11) -->
      <div class="ha-info-callout">
        <div class="callout-title">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <span>Modules</span>
        </div>
        <p>
          Modules are really powerful and the best way to apply
          <u>custom styles</u> and/or <u>JS templates</u> to your cards, without having to
          copy/paste the same code over and over again.
        </p>
        <p>
          This makes it easy to change things like the styles of all your cards, and for
          advanced users, to modify or add features with a real editor.
        </p>
        <p>
          <strong>If coding isn't your thing</strong>, you can also find and install modules
          made by the community in the <strong>Module Store</strong>.
        </p>
      </div>
    `;
  }
  _renderSingleInstalledModule(e) {
    const t = !!this._expandedModules[e.id], o = this._isModuleCompatible(e), i = this._isModuleAppliedToThisCard(e.id), s = this._isModuleAppliedToAllCards(e.id), n = i || s;
    return r`
      <div
        class="module-item-accordion"
        ?data-compatible="${o}"
        ?data-active="${n}"
        ?data-expanded="${t}"
      >
        <div
          class="module-item-header"
          @click="${() => this._toggleModuleAccordion(e.id)}"
        >
          <div class="header-left">
            <ha-icon
              .icon="${n ? "mdi:puzzle-check-outline" : "mdi:puzzle-outline"}"
              class="mod-puzzle-icon"
            ></ha-icon>
            <span class="mod-item-title">${e.name}</span>
            ${o ? r`` : r`<span class="unsupported-tag">Unsupported</span>`}
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>

        ${t ? r`
              <div class="module-item-body">
                <!-- APPLY TO Bar + Edit/Delete Controls (Screenshots 7, 11, 12) -->
                <div class="apply-to-section">
                  <span class="apply-to-caption">APPLY TO</span>
                  <div class="apply-to-bar">
                    <div class="apply-pills-left">
                      <button
                        type="button"
                        class="apply-pill"
                        ?data-selected="${i}"
                        @click="${() => this._toggleModuleApplyThisCard(e.id)}"
                      >
                        <ha-icon icon="mdi:card-text-outline"></ha-icon>
                        <span>This card</span>
                      </button>
                      <button
                        type="button"
                        class="apply-pill"
                        ?data-selected="${s}"
                        @click="${() => this._toggleModuleApplyAllCards(e.id)}"
                      >
                        <ha-icon icon="mdi:cards-outline"></ha-icon>
                        <span>All cards</span>
                      </button>
                      <button
                        type="button"
                        class="circle-help-btn"
                        title="Module compatibility & scope info"
                      >
                        ?
                      </button>
                    </div>
                    <div class="apply-actions-right">
                      <button
                        type="button"
                        class="icon-tool-btn"
                        title="Edit module in Module Studio"
                        @click="${() => this._openEditModuleInCreator(e)}"
                      >
                        <ha-icon icon="mdi:pencil"></ha-icon>
                      </button>
                      <button
                        type="button"
                        class="icon-tool-btn"
                        title="Delete module"
                        @click="${() => this._deleteInstalledModule(e.id)}"
                      >
                        <ha-icon icon="mdi:delete"></ha-icon>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Module Configuration Header (Screenshots 7, 11, 12) -->
                <div class="mod-config-title-row">
                  <ha-icon icon="mdi:cog"></ha-icon>
                  <span>Configuration</span>
                </div>

                <!-- Specialized or Generic Module Configuration Controls -->
                ${this._renderModuleSpecificControls(e)}

                <!-- About this module Box with YAML Example & Version Badge (Screenshots 7, 11, 12) -->
                <div class="ha-info-callout mod-about-box">
                  <div class="callout-title">
                    <ha-icon icon="mdi:information-outline"></ha-icon>
                    <span>About this module</span>
                  </div>
                  <p>${e.description}</p>
                  <pre class="yaml-code-preview"><code>${e.yamlExample}</code></pre>
                  <div class="mod-about-footer">
                    <span class="mod-creator-credit">Created by ${e.creator}</span>
                    <span class="mod-version-badge">Module info • ${e.version}</span>
                  </div>
                </div>
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderModuleSpecificControls(e) {
    if (e.id === "card_backdrop_image") {
      const o = !!this._moduleInnerAccordions.backdrop_image, i = !!this._moduleInnerAccordions.backdrop_layout, s = !!this._moduleInnerAccordions.backdrop_appearance, n = !!this._moduleInnerAccordions.backdrop_overlay, c = String(this._getModuleFieldVal(e.id, "image_url", "")), l = String(this._getModuleFieldVal(e.id, "size", "cover")), d = String(this._getModuleFieldVal(e.id, "repeat", "no-repeat")), u = !!this._getModuleFieldVal(e.id, "custom_position", !1), p = Number(this._getModuleFieldVal(e.id, "pos_x", 50)), h = Number(this._getModuleFieldVal(e.id, "pos_y", 50)), g = Number(this._getModuleFieldVal(e.id, "image_opacity", 100)), v = Number(this._getModuleFieldVal(e.id, "blur", 0)), x = Number(this._getModuleFieldVal(e.id, "scale", 100));
      return r`
        <div class="mod-controls-stack">
          <!-- Image Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner("backdrop_image")}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:image-outline"></ha-icon>
                <span>Image</span>
              </div>
              <span class="chevron">${o ? "▲" : "▼"}</span>
            </div>
            ${o ? r`
                  <div class="ha-nested-body">
                    <span class="floating-label">Background image</span>
                    <div class="media-dropzone">
                      <button
                        type="button"
                        class="media-pick-btn"
                        @click="${() => this._setModuleFieldVal(e.id, "image_url", "/local/aurora_backdrop.jpg")}"
                      >
                        <ha-icon icon="mdi:image-plus"></ha-icon>
                        <span>Pick media</span>
                      </button>
                      <span class="muted-note">
                        Drop file here or click to choose from Media Browser
                      </span>
                    </div>
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Direct Image URL</span>
                        <input
                          type="text"
                          class="native-input"
                          placeholder="/local/bg.jpg or https://..."
                          .value="${c}"
                          @input="${(b) => this._setModuleFieldVal(e.id, "image_url", b.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                ` : r``}
          </div>

          <!-- Image Layout Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner("backdrop_layout")}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:crop-free"></ha-icon>
                <span>Image layout</span>
              </div>
              <span class="chevron">${i ? "▲" : "▼"}</span>
            </div>
            ${i ? r`
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Size</span>
                        <select
                          class="native-select"
                          .value="${l}"
                          @change="${(b) => this._setModuleFieldVal(e.id, "size", b.target.value)}"
                        >
                          <option value="cover">Cover</option>
                          <option value="contain">Contain</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </div>

                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Repeat</span>
                        <select
                          class="native-select"
                          .value="${d}"
                          @change="${(b) => this._setModuleFieldVal(e.id, "repeat", b.target.value)}"
                        >
                          <option value="no-repeat">No repeat</option>
                          <option value="repeat">Repeat</option>
                        </select>
                      </div>
                    </div>

                    ${this._renderToggleRow("Use custom position", u, (b) => this._setModuleFieldVal(e.id, "custom_position", b))}

                    ${this._renderSliderControl("Horizontal position", p, 0, 100, (b) => this._setModuleFieldVal(e.id, "pos_x", b))}${this._renderSliderControl("Vertical position", h, 0, 100, (b) => this._setModuleFieldVal(e.id, "pos_y", b))}
                  </div>
                ` : r``}
          </div>

          <!-- Appearance Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner("backdrop_appearance")}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:tune"></ha-icon>
                <span>Appearance</span>
              </div>
              <span class="chevron">${s ? "▲" : "▼"}</span>
            </div>
            ${s ? r`
                  <div class="ha-nested-body">
                    ${this._renderSliderControl("Image opacity", g, 0, 100, (b) => this._setModuleFieldVal(e.id, "image_opacity", b))}
                    ${this._renderSliderControl("Background blur", v, 0, 30, (b) => this._setModuleFieldVal(e.id, "blur", b))}${this._renderSliderControl("Image scale", x, 50, 200, (b) => this._setModuleFieldVal(e.id, "scale", b))}
                  </div>
                ` : r``}
          </div>

          <!-- Overlay Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner("backdrop_overlay")}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:layers-outline"></ha-icon>
                <span>Overlay</span>
              </div>
              <span class="chevron">${n ? "▲" : "▼"}</span>
            </div>
            ${n ? r`
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Overlay Hex Color</span>
                        <input
                          type="text"
                          class="native-input"
                          .value="${String(this._getModuleFieldVal(e.id, "overlay_color", "#000000"))}"
                          @input="${(b) => this._setModuleFieldVal(e.id, "overlay_color", b.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                ` : r``}
          </div>
        </div>
      `;
    }
    if (e.id === "multi_section_card") {
      const o = String(this._getModuleFieldVal(e.id, "section_count", "4")), i = !!this._getModuleFieldVal(e.id, "hide_default_content", !0), s = String(this._getModuleFieldVal(e.id, "bg_color", ""));
      return r`
        <div class="mod-controls-stack">
          <div class="ha-filled-box">
            <div class="box-content">
              <span class="floating-label">Section count</span>
              <select
                class="native-select"
                .value="${o}"
                @change="${(c) => this._setModuleFieldVal(e.id, "section_count", c.target.value)}"
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          ${[1, 2, 3, 4].map((c) => {
        const l = "multi_sec_" + c, d = !!this._moduleInnerAccordions[l], u = "entity_" + c, p = "icon_" + c, h = String(this._getModuleFieldVal(e.id, u, "")), g = String(this._getModuleFieldVal(e.id, p, ""));
        return r`
              <div class="ha-nested-accordion">
                <div
                  class="ha-nested-header"
                  @click="${() => this._toggleModuleInner(l)}"
                >
                  <div class="header-left">
                    <span class="num-circle-badge">${c}</span>
                    <span>Section ${c}</span>
                  </div>
                  <span class="chevron">${d ? "▲" : "▼"}</span>
                </div>
                ${d ? r`
                      <div class="ha-nested-body">
                        <div
                          class="ha-entity-box"
                          @click="${() => this._openEntityPicker({
          type: "module_field",
          moduleId: e.id,
          fieldKey: u
        })}"
                        >
                          <div class="entity-icon-badge">
                            <ha-icon .icon="${this._getEntityIcon(h)}"></ha-icon>
                          </div>
                          <div class="entity-text-col">
                            <span class="entity-primary">
                              ${this._getEntityFriendlyName(h)}
                            </span>
                            <span class="entity-secondary">
                              ${this._getEntitySecondary(h)}
                            </span>
                          </div>
                          <span class="dropdown-caret">▼</span>
                        </div>

                        <div class="ha-filled-box">
                          <div class="box-content">
                            <span class="floating-label">Section ${c} Icon</span>
                            <input
                              type="text"
                              class="native-input"
                              placeholder="mdi:thermometer"
                              .value="${g}"
                              @input="${(v) => this._setModuleFieldVal(e.id, p, v.target.value)}"
                            />
                          </div>
                        </div>
                      </div>
                    ` : r``}
              </div>
            `;
      })}

          ${this._renderToggleRow("Hide default card content", i, (c) => this._setModuleFieldVal(e.id, "hide_default_content", c))}

          <div class="ha-filled-box">
            <div class="box-content">
              <span class="floating-label">Card Background Color (name, hex, or rgb)</span>
              <input
                type="text"
                class="native-input"
                placeholder="e.g. #ff5733 or accent"
                .value="${s}"
                @input="${(c) => this._setModuleFieldVal(e.id, "bg_color", c.target.value)}"
              />
            </div>
          </div>
          <span class="field-caption-note">
            Accepts: color name (red, blue), hex (#ff5733), rgb(255,87,51), or HA theme color
            name (accent, primary)
          </span>
        </div>
      `;
    }
    if (e.id === "conditional_slider_coloring") {
      const o = !!this._moduleInnerAccordions.cond_default, i = !!this._moduleInnerAccordions.cond_list;
      return r`
        <div class="mod-controls-stack">
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner("cond_default")}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:palette-outline"></ha-icon>
                <span>Default slider color</span>
              </div>
              <span class="chevron">${o ? "▲" : "▼"}</span>
            </div>
            ${o ? r`
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Default CSS Color</span>
                        <input
                          type="text"
                          class="native-input"
                          .value="${String(this._getModuleFieldVal(e.id, "default_color", "var(--primary-color)"))}"
                          @input="${(s) => this._setModuleFieldVal(e.id, "default_color", s.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                ` : r``}
          </div>

          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner("cond_list")}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:format-list-checks"></ha-icon>
                <span>Conditions list</span>
              </div>
              <span class="chevron">${i ? "▲" : "▼"}</span>
            </div>
            ${i ? r`
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Threshold Color Override</span>
                        <input
                          type="text"
                          class="native-input"
                          placeholder="#ef4444 when > 22"
                          .value="${String(this._getModuleFieldVal(e.id, "condition_rule", ""))}"
                          @input="${(s) => this._setModuleFieldVal(e.id, "condition_rule", s.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                ` : r``}
          </div>
        </div>
      `;
    }
    const t = String(this._getModuleFieldVal(e.id, "custom_param", ""));
    return r`
      <div class="mod-controls-stack">
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Module Custom Parameter / Override</span>
            <input
              type="text"
              class="native-input"
              placeholder="Enter value or CSS token..."
              .value="${t}"
              @input="${(o) => this._setModuleFieldVal(e.id, "custom_param", o.target.value)}"
            />
          </div>
        </div>
      </div>
    `;
  }
  _renderSliderControl(e, t, o, i, s) {
    return r`
      <div class="slider-control-block">
        <span class="slider-label">${e}</span>
        <div class="slider-input-row">
          <input
            type="range"
            class="ha-range-slider"
            min="${o}"
            max="${i}"
            .value="${String(t)}"
            @input="${(n) => s(Number(n.target.value))}"
          />
          <input
            type="number"
            class="slider-num-box"
            min="${o}"
            max="${i}"
            .value="${String(t)}"
            @input="${(n) => s(Number(n.target.value))}"
          />
        </div>
      </div>
    `;
  }
  // ============================================================================
  // PHASE 3: CREATE NEW MODULE STUDIO (Screenshots 3, 4, 5)
  // ============================================================================
  _renderModuleCreatorStudio() {
    const e = this._creatorDraft, t = !!this._creatorSections.supported_cards, o = !!this._creatorSections.description, i = !!this._creatorSections.code_template, s = !!this._creatorSections.editor_schema, n = !!this._creatorSections.entity_suggestions, c = !!this._creatorSections.export_module;
    return r`
      <div class="creator-studio-container">
        <div class="creator-title-row">
          <ha-icon icon="mdi:puzzle-plus-outline"></ha-icon>
          <span>Create new Module</span>
        </div>

        <!-- Module ID -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Module ID</span>
            <input
              type="text"
              class="native-input"
              .value="${e.id}"
              @input="${(l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        id: l.target.value
      };
    }}"
            />
          </div>
        </div>
        <span class="field-caption-note">
          Must be unique and cannot be changed after the Module is created.
        </span>

        <!-- Module Name -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Module Name</span>
            <input
              type="text"
              class="native-input"
              .value="${e.name}"
              @input="${(l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        name: l.target.value
      };
    }}"
            />
          </div>
        </div>

        <!-- Version -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Version</span>
            <input
              type="text"
              class="native-input"
              .value="${e.version}"
              @input="${(l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        version: l.target.value
      };
    }}"
            />
          </div>
        </div>

        <!-- Creator -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Creator</span>
            <input
              type="text"
              class="native-input"
              placeholder="Your name or handle"
              .value="${e.creator}"
              @input="${(l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        creator: l.target.value
      };
    }}"
            />
          </div>
        </div>

        <!-- 1. Supported Cards Accordion (Screenshots 4 & 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection("supported_cards")}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:filter-check-outline"></ha-icon>
              <span>Supported cards</span>
            </div>
            <span class="chevron">${t ? "▲" : "▼"}</span>
          </div>
          ${t ? r`
                <div class="creator-sub-body">
                  <label class="ha-checkbox-item master-checkbox">
                    <input
                      type="checkbox"
                      .checked="${e.allCards}"
                      @change="${(l) => {
      const d = l.target.checked;
      this._creatorDraft = {
        ...this._creatorDraft,
        allCards: d,
        supportedCards: d ? W.map((u) => u.id) : []
      };
    }}"
                    />
                    <span>All cards</span>
                  </label>

                  <div class="checkbox-two-col-grid">
                    ${W.map((l) => {
      const d = e.allCards || e.supportedCards.includes(l.id);
      return r`
                        <label class="ha-checkbox-item">
                          <input
                            type="checkbox"
                            .checked="${d}"
                            @change="${(u) => {
        const p = u.target.checked, h = new Set(this._creatorDraft.supportedCards);
        p ? h.add(l.id) : h.delete(l.id), this._creatorDraft = {
          ...this._creatorDraft,
          allCards: h.size === W.length,
          supportedCards: Array.from(h)
        };
      }}"
                          />
                          <span>${l.label}</span>
                        </label>
                      `;
    })}
                  </div>
                  <span class="field-caption-note">
                    Select the card types that this module supports.
                  </span>
                </div>
              ` : r``}
        </div>

        <!-- 2. Description Accordion (Screenshots 3, 4, 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection("description")}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:file-document-outline"></ha-icon>
              <span>Description</span>
            </div>
            <span class="chevron">${o ? "▲" : "▼"}</span>
          </div>
          ${o ? r`
                <div class="creator-sub-body">
                  <textarea
                    class="code-textarea"
                    rows="3"
                    placeholder="Describe what this module styles or extends..."
                    .value="${e.description}"
                    @input="${(l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        description: l.target.value
      };
    }}"
                  ></textarea>
                </div>
              ` : r``}
        </div>

        <!-- 3. Code (CSS/JS template) Accordion (Screenshots 3, 4, 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection("code_template")}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:code-braces"></ha-icon>
              <span>Code (CSS/JS template)</span>
            </div>
            <span class="chevron">${i ? "▲" : "▼"}</span>
          </div>
          ${i ? r`
                <div class="creator-sub-body">
                  ${this._renderCodeEditorWidget(e.codeTemplate, (l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        codeTemplate: l
      };
    }, !0)}
                  <span class="field-caption-note">
                    More information and examples about the CSS and JS template possibilities
                    can be found in the <u>Styling and Templates documentation</u>.
                  </span>
                </div>
              ` : r``}
        </div>

        <!-- 4. Optional: Editor schema (YAML) Accordion (Screenshots 3, 4, 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection("editor_schema")}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:view-list-outline"></ha-icon>
              <span>Optional: Editor schema (YAML)</span>
            </div>
            <span class="chevron">${s ? "▲" : "▼"}</span>
          </div>
          ${s ? r`
                <div class="creator-sub-body">
                  ${this._renderCodeEditorWidget(e.editorSchemaYaml, (l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        editorSchemaYaml: l
      };
    }, !1)}
                  <span class="field-caption-note">
                    This allows you to add a visual editor to your module. Learn about all
                    available editor schema options in the <u>editor schema documentation</u>.
                  </span>
                </div>
              ` : r``}
        </div>

        <!-- 5. Optional: Entity suggestions Accordion (Screenshots 3, 4) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection("entity_suggestions")}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:lightbulb-question-outline"></ha-icon>
              <span>Optional: Entity suggestions</span>
            </div>
            <span class="chevron">${n ? "▲" : "▼"}</span>
          </div>
          ${n ? r`
                <div class="creator-sub-body">
                  <span class="sub-block-heading">Suggestion rules (YAML)</span>
                  ${this._renderCodeEditorWidget(e.suggestionRulesYaml, (l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        suggestionRulesYaml: l
      };
    }, !1)}
                  <span class="field-caption-note">
                    This allows your Module to be offered in the entity card picker of Home
                    Assistant, as a list of rules.
                  </span>

                  <span class="sub-block-heading">Computed suggestions (JavaScript)</span>
                  ${this._renderCodeEditorWidget(e.computedSuggestionsJs, (l) => {
      this._creatorDraft = {
        ...this._creatorDraft,
        computedSuggestionsJs: l
      };
    }, !1)}
                  <span class="field-caption-note">
                    When a configuration has to be computed instead of being known in advance,
                    write a function body called with
                    <code>(hass, entity, stateObj, helpers, module)</code>.
                  </span>

                  <!-- Live Preview Sandbox Card (Screenshot 4) -->
                  <div class="creator-preview-card">
                    <span class="sub-block-heading">Preview</span>
                    ${this._renderToggleRow("Show the suggestions instead of the card", this._creatorPreviewMode, (l) => this._creatorPreviewMode = l)}
                    <span class="section-caption">Entity</span>
                    <div
                      class="ha-entity-box"
                      @click="${() => this._openEntityPicker({ type: "creator_preview" })}"
                    >
                      <div class="entity-icon-badge">
                        <ha-icon
                          .icon="${this._getEntityIcon(this._creatorPreviewEntity)}"
                        ></ha-icon>
                      </div>
                      <div class="entity-text-col">
                        <span class="entity-primary">
                          ${this._getEntityFriendlyName(this._creatorPreviewEntity)}
                        </span>
                        <span class="entity-secondary">
                          ${this._getEntitySecondary(this._creatorPreviewEntity)}
                        </span>
                      </div>
                      <span class="dropdown-caret">▼</span>
                    </div>
                  </div>
                </div>
              ` : r``}
        </div>

        <!-- 6. Export Module Accordion (Screenshot 3, 4) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection("export_module")}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:export"></ha-icon>
              <span>Export Module</span>
            </div>
            <span class="chevron">${c ? "▲" : "▼"}</span>
          </div>
          ${c ? r`
                <div class="creator-sub-body export-pills-stack">
                  <button
                    type="button"
                    class="export-full-pill"
                    @click="${() => this._copyModuleYaml(!1)}"
                  >
                    <ha-icon icon="mdi:content-copy"></ha-icon>
                    <span>Copy YAML</span>
                  </button>
                  <button
                    type="button"
                    class="export-full-pill"
                    @click="${() => this._copyModuleYaml(!0)}"
                  >
                    <ha-icon icon="mdi:content-duplicate"></ha-icon>
                    <span>Copy for GitHub</span>
                  </button>
                  <button
                    type="button"
                    class="export-full-pill"
                    @click="${this._downloadModuleYaml}"
                  >
                    <ha-icon icon="mdi:file-download-outline"></ha-icon>
                    <span>Download YAML</span>
                  </button>
                </div>
              ` : r``}
        </div>

        <!-- Bottom Cancel & Save Module Bar (Screenshot 4) -->
        <div class="creator-bottom-actions">
          <button
            type="button"
            class="teal-action-pill secondary-pill"
            @click="${() => this._creatorOpen = !1}"
          >
            <span>✕</span>
            <span>Cancel</span>
          </button>
          <button
            type="button"
            class="teal-action-pill"
            @click="${this._saveCreatorModule}"
          >
            <ha-icon icon="mdi:content-save-outline"></ha-icon>
            <span>Save Module</span>
          </button>
        </div>
      </div>
    `;
  }
  _renderCodeEditorWidget(e, t, o) {
    return r`
      <div class="aurora-code-widget">
        <div class="code-widget-toolbar">
          <div class="snippet-chips-row">
            ${o ? r`
                  <button
                    type="button"
                    class="snippet-chip"
                    @click="${() => t(e + `
/* State check */
\${state === "on" ? "" : ""}`)}"
                  >
                    + state
                  </button>
                  <button
                    type="button"
                    class="snippet-chip"
                    @click="${() => t(e + `
.aurora-card {
  backdrop-filter: blur(22px);
}`)}"
                  >
                    + glass
                  </button>
                ` : r``}
          </div>
          <div class="toolbar-icons-right">
            <button
              type="button"
              class="code-tool-btn"
              title="Copy code"
              @click="${() => {
      navigator.clipboard && navigator.clipboard.writeText(e), this._showToast("Code copied");
    }}"
            >
              <ha-icon icon="mdi:content-copy"></ha-icon>
            </button>
          </div>
        </div>
        <div class="code-gutter-body">
          <div class="line-num-gutter">1</div>
          <textarea
            class="gutter-textarea"
            rows="4"
            .value="${e}"
            @input="${(i) => t(i.target.value)}"
          ></textarea>
        </div>
      </div>
    `;
  }
  _renderModuleStoreView() {
    const e = this._moduleSearchFilter.trim().toLowerCase(), t = We.filter((o) => e ? o.name.toLowerCase().includes(e) || o.description.toLowerCase().includes(e) : !0);
    return r`
      <div class="module-search-row">
        <div class="module-search-bar">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search community store..."
            .value="${this._moduleSearchFilter}"
            @input="${(o) => this._moduleSearchFilter = o.target.value}"
          />
        </div>
      </div>

      <div class="store-cards-list">
        ${t.map((o) => {
      const i = this._installedModules.some((s) => s.id === o.id);
      return r`
            <div class="store-module-card">
              <div class="store-mod-top">
                <div class="header-left">
                  <ha-icon icon="mdi:puzzle-star-outline"></ha-icon>
                  <span class="mod-item-title">${o.name}</span>
                </div>
                <span class="mod-version-badge">${o.version}</span>
              </div>
              <p class="store-mod-desc">${o.description}</p>
              <div class="store-mod-footer">
                <span class="mod-creator-credit">By ${o.creator}</span>
                <button
                  type="button"
                  class="teal-action-pill store-install-btn"
                  @click="${() => this._installFromStore(o)}"
                >
                  <ha-icon
                    .icon="${i ? "mdi:check" : "mdi:download"}"
                  ></ha-icon>
                  <span>${i ? "Installed (Open)" : "Install Module"}</span>
                </button>
              </div>
            </div>
          `;
    })}
      </div>
    `;
  }
  _renderToggleRow(e, t, o) {
    return r`
      <label class="ha-toggle-row">
        <button
          type="button"
          role="switch"
          aria-checked="${t ? "true" : "false"}"
          class="ha-pill-switch"
          ?data-checked="${t}"
          @click="${() => o(!t)}"
        >
          <span class="switch-thumb"></span>
        </button>
        <span class="toggle-label">${e}</span>
      </label>
    `;
  }
  _renderActionSelector(e, t) {
    return r`
      <div class="ha-filled-box">
        <div class="box-content">
          <span class="floating-label">Action</span>
          <select
            class="native-select"
            .value="${t}"
            @change="${(o) => this._actionChanged(o, e)}"
          >
            <option value="toggle">Toggle</option>
            <option value="more-info">More info</option>
            <option value="navigate">Navigate / Pop-up (#hash)</option>
            <option value="call-service">Perform action (Call service)</option>
            <option value="none">No action</option>
          </select>
        </div>
      </div>
    `;
  }
  _formatChipLabel(e) {
    const t = {
      state: "State",
      preset_mode: "Preset",
      hvac_action: "Current action",
      last_changed: "Last changed",
      brightness: "Brightness"
    };
    return t[e] ? t[e] : e;
  }
  _addStateChip() {
    if (!this._config)
      return;
    const e = ["state", "preset_mode", "hvac_action", "last_changed", "brightness"], t = [...this._config.state_content ?? ["state"]], o = e.find((i) => !t.includes(i)) ?? "state";
    t.push(o), this._setDirectValue("state_content", t);
  }
  _removeStateChip(e) {
    if (!this._config)
      return;
    const o = [...this._config.state_content ?? []].filter((i, s) => s !== e);
    this._setDirectValue("state_content", o);
  }
  _valueChanged(e, t) {
    if (!this._config)
      return;
    const i = e.target.value;
    this._setDirectValue(t, i === "" ? void 0 : i);
  }
  _setDirectValue(e, t) {
    this._config && (this._config = {
      ...this._config,
      [e]: t
    }, F(this, "config-changed", { config: this._config }));
  }
  _actionChanged(e, t) {
    if (!this._config)
      return;
    const o = e.target, i = this._config[t] ?? {};
    this._config = {
      ...this._config,
      [t]: {
        ...i,
        action: o.value
      }
    }, F(this, "config-changed", { config: this._config });
  }
  _addSubButton() {
    if (!this._config)
      return;
    const e = [...this._config.sub_button ?? []];
    e.push({ icon: "mdi:power", show_state: !0 }), this._setDirectValue("sub_button", e);
  }
  _updateSubButton(e, t, o) {
    if (!this._config || !this._config.sub_button)
      return;
    const i = [...this._config.sub_button];
    i[e] = {
      ...i[e],
      [t]: o === "" ? void 0 : o
    }, this._setDirectValue("sub_button", i);
  }
  _removeSubButton(e) {
    if (!this._config || !this._config.sub_button)
      return;
    const t = this._config.sub_button.filter((o, i) => i !== e);
    this._setDirectValue("sub_button", t);
  }
  static {
    this.styles = me`
    :host {
      display: block;
      color: var(--primary-text-color, #e1e1e1);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }

    .aurora-editor-root {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 0 16px 0;
    }

    .aurora-toast {
      position: sticky;
      top: 6px;
      z-index: 100;
      background: #0284c7;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    /* Hybrid Category Bar */
    .category-bar {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .cat-pill {
      background: var(--secondary-background-color, #202124);
      color: var(--secondary-text-color, #9b9b9b);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 18px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .cat-pill[data-active] {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    /* Top Floating-Label Boxes */
    .top-selectors {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-caption {
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
      margin-bottom: -4px;
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

    .native-select option,
    .native-select optgroup {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color, #ffffff);
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 16px;
      cursor: pointer;
      padding: 4px 8px;
    }

    /* Entity Box */
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
      transition: background 0.15s ease;
    }

    .ha-entity-box:hover {
      background: rgba(255, 255, 255, 0.1);
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

    .dropdown-caret {
      font-size: 10px;
      color: var(--secondary-text-color, #9b9b9b);
      padding-left: 4px;
    }

    /* PHASE 2: Searchable Entity Picker Modal Overlay */
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

    .picker-sheet {
      width: 100%;
      max-width: 540px;
      height: 84vh;
      background: var(--card-background-color, #141414);
      border-radius: 20px 20px 0 0;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.14));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.6);
    }

    .picker-handle-bar {
      display: flex;
      justify-content: center;
      padding: 10px 0 4px 0;
    }

    .sheet-grip {
      width: 38px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.25);
    }

    .picker-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px 10px 14px;
    }

    .picker-search-Input-wrap {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      border-radius: 10px;
      padding: 8px 12px;
    }

    .picker-search-Input-wrap:focus-within {
      border-color: var(--primary-color, #03a9f4);
    }

    .search-icon {
      color: var(--primary-text-color, #ffffff);
      --mdc-icon-size: 20px;
    }

    .picker-search-input {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      font-size: 15px;
      width: 100%;
      outline: none;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: var(--primary-color, #03a9f4);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      padding: 6px 8px;
    }

    .picker-domain-bar {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 0 14px 10px 14px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
    }

    .dom-chip {
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #9b9b9b);
      border: 1px solid transparent;
      border-radius: 14px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }

    .dom-chip[data-active] {
      background: rgba(3, 169, 244, 0.2);
      color: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
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
      transition: background 0.12s ease;
    }

    .picker-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .picker-row[data-selected] {
      background: rgba(3, 169, 244, 0.18);
    }

    .picker-row-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      color: var(--secondary-text-color, #a0a0a0);
    }

    .picker-row[data-selected] .picker-row-icon {
      color: var(--primary-color, #38bdf8);
    }

    .picker-row-main {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      gap: 2px;
    }

    .picker-row-title {
      font-size: 15px;
      color: var(--primary-text-color, #ffffff);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .picker-row-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .picker-row-domain {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
      white-space: nowrap;
      padding-left: 8px;
    }

    .picker-empty,
    .picker-more-hint {
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    /* Main Accordions Stack */
    .accordions-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ha-accordion {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      background: var(--card-background-color, #1c1c1c);
      overflow: hidden;
    }

    .ha-accordion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      cursor: pointer;
      user-select: none;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }

    .chevron {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .ha-accordion-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 16px 16px 16px;
    }

    /* Nested Accordions */
    .ha-nested-accordion {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      overflow: hidden;
    }

    .ha-nested-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      cursor: pointer;
    }

    .ha-nested-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 14px 14px 14px;
    }

    /* HA Pill Switches */
    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 4px 0;
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
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 0;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .ha-pill-switch[data-checked] {
      background: rgba(3, 169, 244, 0.35);
      border-color: var(--primary-color, #03a9f4);
    }

    .switch-thumb {
      position: absolute;
      top: 3px;
      left: 4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--secondary-text-color, #9b9b9b);
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .ha-pill-switch[data-checked] .switch-thumb {
      transform: translateX(20px);
      background: var(--primary-color, #03a9f4);
    }

    .toggle-label {
      font-size: 14px;
      color: var(--primary-text-color, #e1e1e1);
    }

    /* State Content Chips */
    .state-content-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .block-label {
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
    }

    .chips-well {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      border-radius: 6px;
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
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 4px 10px;
      font-size: 13px;
    }

    .chip-drag {
      color: var(--secondary-text-color, #9b9b9b);
      cursor: grab;
    }

    .chip-remove {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      font-size: 12px;
      padding: 0 2px;
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

    /* Sub-button rows */
    .sub-button-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr auto;
      gap: 8px;
      align-items: center;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
      padding: 8px;
      border-radius: 8px;
    }

    .sub-entity-picker-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      color: var(--primary-text-color, #ffffff);
      padding: 6px 10px;
      cursor: pointer;
      overflow: hidden;
      text-align: left;
    }

    .sub-ent-label {
      flex: 1;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-icon-input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 13px;
    }

    .danger-icon-btn {
      background: rgba(244, 67, 54, 0.15);
      color: #f44336;
      border: 1px solid rgba(244, 67, 54, 0.3);
      border-radius: 6px;
      width: 32px;
      height: 32px;
      cursor: pointer;
    }

    /* Info Callout Box */
    .ha-info-callout {
      background: rgba(255, 255, 255, 0.04);
      border-left: 4px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      padding: 12px 14px;
      font-size: 13px;
      line-height: 1.45;
      color: var(--secondary-text-color, #b0b0b0);
    }

    .callout-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      margin-bottom: 6px;
    }

    .callout-list {
      margin: 6px 0 0 0;
      padding-left: 18px;
    }

    .callout-list li {
      margin-bottom: 4px;
    }

    /* ============================================================================
       PHASE 3 STYLES: MODULES, MODULE CREATOR STUDIO & MODULE STORE
       ============================================================================ */
    .module-subtabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
    }

    .mod-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--secondary-text-color, #9b9b9b);
      padding: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .mod-tab[data-active] {
      color: var(--primary-text-color, #ffffff);
      border-bottom-color: var(--primary-color, #03a9f4);
    }

    .module-search-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .module-search-bar {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 10px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 24px;
      padding: 8px 14px;
    }

    .module-search-bar input {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      font-size: 14px;
      width: 100%;
      outline: none;
    }

    .sort-icon-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      padding: 6px;
    }

    .modules-accordion-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .module-item-accordion {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      overflow: hidden;
      opacity: 0.55;
      transition: all 0.18s ease;
    }

    .module-item-accordion[data-compatible] {
      opacity: 1;
    }

    .module-item-accordion[data-active] {
      border-color: var(--primary-color, #03a9f4);
      box-shadow: 0 0 0 1px rgba(3, 169, 244, 0.25);
    }

    .module-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      cursor: pointer;
    }

    .mod-puzzle-icon {
      color: var(--secondary-text-color, #9b9b9b);
    }

    .module-item-accordion[data-active] .mod-puzzle-icon {
      color: var(--primary-color, #03a9f4);
    }

    .mod-item-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }

    .unsupported-tag {
      font-size: 10px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--secondary-text-color, #9b9b9b);
      padding: 2px 6px;
      border-radius: 8px;
    }

    .module-item-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 14px 16px 14px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.07));
    }

    /* APPLY TO Bar (Screenshots 7, 11, 12) */
    .apply-to-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 8px;
    }

    .apply-to-caption {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .apply-to-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .apply-pills-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .apply-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.25));
      border-radius: 18px;
      color: var(--primary-text-color, #ffffff);
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 15px;
    }

    .apply-pill[data-selected] {
      background: rgba(3, 169, 244, 0.22);
      border-color: var(--primary-color, #03a9f4);
      color: #ffffff;
    }

    .circle-help-btn {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.25));
      background: transparent;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .apply-actions-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .icon-tool-btn {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #e1e1e1);
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
      --mdc-icon-size: 18px;
    }

    .icon-tool-btn:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .mod-config-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #e1e1e1);
      --mdc-icon-size: 18px;
    }

    .mod-controls-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .media-dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 1px dashed var(--divider-color, rgba(255, 255, 255, 0.22));
      border-radius: 10px;
      padding: 20px 12px;
      background: rgba(255, 255, 255, 0.02);
    }

    .media-pick-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(3, 169, 244, 0.18);
      color: var(--primary-color, #38bdf8);
      border: 1px solid rgba(3, 169, 244, 0.35);
      border-radius: 16px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .slider-control-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .slider-label {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .slider-input-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ha-range-slider {
      flex: 1;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .slider-num-box {
      width: 58px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 6px;
      color: var(--primary-text-color, #ffffff);
      padding: 6px 8px;
      font-size: 13px;
      text-align: center;
    }

    .num-circle-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
      font-size: 12px;
      font-weight: 700;
    }

    /* About This Module & YAML Code Preview (Screenshots 7, 11, 12) */
    .yaml-code-preview {
      background: #0c4a6e;
      color: #e0f2fe;
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      line-height: 1.45;
      overflow-x: auto;
      margin: 10px 0;
    }

    .mod-about-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      padding-top: 6px;
    }

    .mod-creator-credit {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .mod-version-badge {
      background: #0284c7;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
    }

    /* Action Pills Row (Create new Module | Import from YAML - Screenshot 6) */
    .module-action-pills-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 4px 0;
    }

    .teal-action-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #0c4a6e;
      color: #ffffff;
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 24px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .teal-action-pill:hover {
      background: #075985;
    }

    .secondary-pill {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .import-yaml-drawer {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
    }

    /* Creator Studio View (Screenshots 3, 4, 5) */
    .creator-studio-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 6px;
    }

    .creator-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      padding: 4px 0;
    }

    .field-caption-note {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
      line-height: 1.4;
      margin-top: -4px;
    }

    .creator-sub-section {
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .creator-sub-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 4px;
      cursor: pointer;
    }

    .creator-sub-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0 4px 8px 4px;
    }

    .checkbox-two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 16px;
      padding-top: 6px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }

    .ha-checkbox-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
      cursor: pointer;
    }

    .ha-checkbox-item input[type='checkbox'] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Code Editor Widget with Line Number Gutter (Screenshots 4 & 5) */
    .aurora-code-widget {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.14));
      border-radius: 8px;
      overflow: hidden;
      background: #141414;
    }

    .code-widget-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0c2d48;
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .snippet-chips-row {
      display: flex;
      gap: 6px;
    }

    .snippet-chip {
      background: rgba(255, 255, 255, 0.1);
      color: #bae6fd;
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 11px;
      font-family: monospace;
      cursor: pointer;
    }

    .toolbar-icons-right {
      display: flex;
      gap: 6px;
    }

    .code-tool-btn {
      background: transparent;
      border: none;
      color: #cbd5e1;
      cursor: pointer;
      padding: 2px 4px;
      --mdc-icon-size: 16px;
    }

    .code-gutter-body {
      display: flex;
      min-height: 84px;
    }

    .line-num-gutter {
      width: 28px;
      background: #1a1a1a;
      color: #64748b;
      font-family: monospace;
      font-size: 12px;
      padding: 10px 4px;
      text-align: center;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      user-select: none;
    }

    .gutter-textarea {
      flex: 1;
      background: transparent;
      border: none;
      color: #e2e8f0;
      font-family: monospace;
      font-size: 13px;
      padding: 10px;
      outline: none;
      resize: vertical;
    }

    .sub-block-heading {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      margin-top: 4px;
    }

    .creator-preview-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.14));
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: rgba(255, 255, 255, 0.02);
    }

    .export-pills-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .export-full-pill {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: #0c4a6e;
      color: #ffffff;
      border: none;
      border-radius: 28px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .export-full-pill:hover {
      background: #075985;
    }

    .creator-bottom-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 6px;
    }

    /* Module Store Cards */
    .store-cards-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .store-module-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .store-mod-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .store-mod-desc {
      margin: 0;
      font-size: 12px;
      line-height: 1.45;
      color: var(--secondary-text-color, #b0b0b0);
    }

    .store-mod-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .store-install-btn {
      padding: 6px 14px;
      font-size: 12px;
    }

    .code-textarea {
      width: 100%;
      box-sizing: border-box;
      background: #141414;
      color: #e2e8f0;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 8px;
      padding: 10px;
      font-family: monospace;
      font-size: 13px;
      outline: none;
    }

    .muted-note {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }
  `;
  }
};
_([
  oe({ attribute: !1 })
], m.prototype, "hass", void 0);
_([
  f()
], m.prototype, "_config", void 0);
_([
  f()
], m.prototype, "_activeCategory", void 0);
_([
  f()
], m.prototype, "_moduleSubTab", void 0);
_([
  f()
], m.prototype, "_moduleSearchFilter", void 0);
_([
  f()
], m.prototype, "_pickerOpen", void 0);
_([
  f()
], m.prototype, "_pickerTarget", void 0);
_([
  f()
], m.prototype, "_pickerSearchQuery", void 0);
_([
  f()
], m.prototype, "_pickerDomainFilter", void 0);
_([
  f()
], m.prototype, "_installedModules", void 0);
_([
  f()
], m.prototype, "_expandedModules", void 0);
_([
  f()
], m.prototype, "_moduleInnerAccordions", void 0);
_([
  f()
], m.prototype, "_creatorOpen", void 0);
_([
  f()
], m.prototype, "_importYamlOpen", void 0);
_([
  f()
], m.prototype, "_importYamlText", void 0);
_([
  f()
], m.prototype, "_statusToast", void 0);
_([
  f()
], m.prototype, "_creatorDraft", void 0);
_([
  f()
], m.prototype, "_creatorPreviewMode", void 0);
_([
  f()
], m.prototype, "_creatorPreviewEntity", void 0);
_([
  f()
], m.prototype, "_creatorSections", void 0);
_([
  f()
], m.prototype, "_openSections", void 0);
m = _([
  xe("aurora-card-editor")
], m);
var qe = Object.defineProperty, Ke = Object.getOwnPropertyDescriptor, L = (a, e, t, o) => {
  for (var i = o > 1 ? void 0 : o ? Ke(e, t) : e, s = a.length - 1, n; s >= 0; s--)
    (n = a[s]) && (i = (o ? n(e, t, i) : n(i)) || i);
  return o && i && qe(e, t, i), i;
};
let A = class extends T {
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
  setConfig(a) {
    if (!a)
      throw new Error("Invalid Aurora Card configuration");
    this._config = {
      card_type: "button",
      button_type: "switch",
      scrolling_effect: !0,
      show_icon: !0,
      prioritise_icon: !1,
      show_name: !0,
      state_content: ["state"],
      ...a
    }, k.syncGlobalConfigFromCard(this._config);
  }
  getCardSize() {
    return 1;
  }
  _isEntityActive(a) {
    if (!a || !this.hass || !this.hass.states[a]) return !1;
    const e = this.hass.states[a].state;
    return e === "on" || e === "playing" || e === "open" || e === "heat" || e === "cool" || e === "heating" || e === "home";
  }
  _resolveIcon(a, e) {
    if (e) return e;
    if (a && this.hass && this.hass.states[a]) {
      const i = this.hass.states[a].attributes.icon;
      if (i) return String(i);
    }
    const t = a ? a.split(".")[0] : "", o = {
      light: "mdi:lightbulb",
      switch: "mdi:power",
      climate: "mdi:thermostat",
      media_player: "mdi:speaker",
      cover: "mdi:window-shutter",
      sensor: "mdi:eye-outline",
      binary_sensor: "mdi:radiobox-marked"
    };
    return o[t] ? o[t] : "mdi:aurora";
  }
  _resolveName(a, e) {
    if (e) return e;
    if (a && this.hass && this.hass.states[a]) {
      const t = this.hass.states[a].attributes.friendly_name;
      if (t) return String(t);
    }
    return a || "Aurora Card";
  }
  _resolveFormattedState(a) {
    if (!a || !this.hass || !this.hass.states[a]) return "";
    const e = this.hass.states[a], t = this._config?.state_content ?? ["state"], o = [];
    for (const i of t)
      if (i === "state") {
        const s = e.attributes.unit_of_measurement ?? "";
        o.push(s ? `${e.state}${s}` : e.state);
      } else e.attributes[i] !== void 0 && o.push(String(e.attributes[i]));
    return o.join(" • ");
  }
  _resolveNumericSliderPercent(a) {
    if (this._sliderTempValue !== null) return this._sliderTempValue;
    if (!a || !this.hass || !this.hass.states[a]) return 0;
    const e = this.hass.states[a];
    if (e.attributes.brightness !== void 0)
      return Math.round(Number(e.attributes.brightness) / 255 * 100);
    if (e.attributes.volume_level !== void 0)
      return Math.round(Number(e.attributes.volume_level) * 100);
    if (e.attributes.current_position !== void 0)
      return Number(e.attributes.current_position);
    const t = parseFloat(e.state);
    return Number.isNaN(t) ? this._isEntityActive(a) ? 100 : 0 : Math.max(0, Math.min(100, t));
  }
  _onSliderInput(a) {
    a.stopPropagation();
    const e = Number(a.target.value);
    this._sliderTempValue = e;
  }
  _onSliderChange(a) {
    a.stopPropagation();
    const e = Number(a.target.value);
    this._sliderTempValue = null;
    const t = this._config?.entity ?? "";
    if (!t || !this.hass) return;
    const o = t.split(".")[0];
    o === "light" ? this.hass.callService("light", "turn_on", {
      entity_id: t,
      brightness_pct: e
    }) : o === "media_player" ? this.hass.callService("media_player", "volume_set", {
      entity_id: t,
      volume_level: e / 100
    }) : o === "cover" ? this.hass.callService("cover", "set_cover_position", {
      entity_id: t,
      position: e
    }) : (o === "input_number" || o === "number") && this.hass.callService(o, "set_value", {
      entity_id: t,
      value: e
    });
  }
  _handlePointerDown() {
    this._holdTriggered = !1, this._holdTimer = window.setTimeout(() => {
      this._holdTriggered = !0, this._config && this.hass && R(
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
    !this._config || !this.hass || R(this, this.hass, this._config, this._config.tap_action);
  }
  _handleIconClick(a) {
    a.stopPropagation(), !(!this._config || !this.hass) && R(
      this,
      this.hass,
      this._config,
      this._config.icon_tap_action ?? this._config.tap_action
    );
  }
  render() {
    if (!this._config) return r``;
    if ((this._config.card_type ?? "button") === "empty-column")
      return r`<div class="aurora-empty-column"></div>`;
    const e = this._config.entity ?? "", t = this._isEntityActive(e), o = k.generateDynamicStyles(this.hass, this._config), i = k.shouldHideDefaultContent(this._config), s = this._config.button_type === "slider", n = s ? this._resolveNumericSliderPercent(e) : 0;
    return r`
      <style>
        ${o}
      </style>
      <div
        class="aurora-card-surface"
        ?data-state-on="${t}"
        @pointerdown="${this._handlePointerDown}"
        @pointerup="${this._handlePointerUp}"
        @pointercancel="${this._handlePointerUp}"
        @click="${this._handleCardClick}"
      >
        <!-- Module Extension: Card Backdrop Image Layer -->
        ${k.renderBackdropLayer(this._config)}

        <!-- Optional Range Slider Fill Track -->
        ${s ? r`
              <div class="aurora-slider-fill" style="width: ${n}%;"></div>
              <input
                type="range"
                class="aurora-slider-overlay-input"
                min="0"
                max="100"
                .value="${String(n)}"
                @click="${(c) => c.stopPropagation()}"
                @input="${this._onSliderInput}"
                @change="${this._onSliderChange}"
              />
            ` : r``}

        <!-- Main Card Foreground Content (Hidden if Multi Section Card hides default) -->
        ${i ? r`` : this._renderMainContent(e)}

        <!-- Module Extension: Multi Section Card (2, 3, or 4 sections) -->
        ${k.renderMultiSectionExtension(
      this,
      this.hass,
      this._config,
      (c, l) => this._resolveIcon(c, l),
      (c, l) => this._resolveName(c, l),
      (c) => this._resolveFormattedState(c)
    )}
      </div>
    `;
  }
  _renderMainContent(a) {
    const e = this._config?.show_icon !== !1, t = this._config?.show_name !== !1, o = this._config?.scrolling_effect !== !1, i = !!this._config?.prioritise_icon, n = (a && this.hass?.states ? this.hass.states[a] : void 0)?.attributes?.entity_picture, c = !!(n && !i), l = this._resolveIcon(a, this._config?.icon), d = this._resolveName(a, this._config?.name), u = this._resolveFormattedState(a), p = this._config?.sub_button ?? [], g = k.getActiveModuleIds(this._config).includes("collapsible_sub_button_groups");
    return r`
      <div class="aurora-foreground-row">
        ${e ? r`
              <div class="aurora-main-icon-wrap" @click="${this._handleIconClick}">
                ${k.renderIconProgressRing(this.hass, this._config)}${c ? r`<img class="entity-avatar-img" src="${n}" alt="" />` : r`<ha-icon .icon="${l}"></ha-icon>`}
              </div>
            ` : r``}

        <div class="aurora-title-state-col" ?data-scrolling="${o}">
          ${t ? r`<span class="aurora-card-title">${d}</span>` : r``}
          ${u ? r`<span class="aurora-card-state">${u}</span>` : r``}
        </div>

        ${p.length > 0 ? r`
              <div class="aurora-sub-buttons-bar">
                ${g ? r`
                      <button
                        type="button"
                        class="aurora-sub-pill drawer-toggle-pill"
                        @click="${(v) => {
      v.stopPropagation(), this._subButtonsCollapsed = !this._subButtonsCollapsed;
    }}"
                      >
                        <ha-icon
                          .icon="${this._subButtonsCollapsed ? "mdi:dots-horizontal" : "mdi:chevron-right"}"
                        ></ha-icon>
                      </button>
                    ` : r``}
                ${this._subButtonsCollapsed ? r`` : p.map((v) => this._renderSubButtonPill(v))}
              </div>
            ` : r``}
      </div>
    `;
  }
  _renderSubButtonPill(a) {
    const e = a.entity ?? this._config?.entity ?? "", t = this._resolveIcon(e, a.icon), o = this._isEntityActive(e), i = a.show_state && e && this.hass?.states?.[e] ? this.hass.states[e].state : "";
    return r`
      <button
        type="button"
        class="aurora-sub-pill"
        ?data-sub-active="${o}"
        @click="${(s) => {
      s.stopPropagation(), this._config && this.hass && R(
        this,
        this.hass,
        this._config,
        a.tap_action ?? { action: "toggle" },
        e
      );
    }}"
      >
        <ha-icon .icon="${t}"></ha-icon>
        ${i ? r`<span class="sub-pill-state">${i}</span>` : r``}
      </button>
    `;
  }
};
A.styles = me`
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
L([
  oe({ attribute: !1 })
], A.prototype, "hass", 2);
L([
  f()
], A.prototype, "_config", 2);
L([
  f()
], A.prototype, "_sliderTempValue", 2);
L([
  f()
], A.prototype, "_subButtonsCollapsed", 2);
A = L([
  xe("aurora-card")
], A);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "aurora-card",
  name: "Aurora Card",
  description: "A high-performance modular card inspired by Bubble Card.",
  preview: !0
  // Optional: enables visual preview in the card picker
});
export {
  A as AuroraCard
};
//# sourceMappingURL=aurora-card.js.map
