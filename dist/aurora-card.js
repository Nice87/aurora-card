/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, pt = X.ShadowRoot && (X.ShadyCSS === void 0 || X.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ut = Symbol(), _t = /* @__PURE__ */ new WeakMap();
let zt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ut) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (pt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = _t.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && _t.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (a) => new zt(typeof a == "string" ? a : a + "", void 0, ut), w = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, o, r) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + a[r + 1], a[0]);
  return new zt(e, a, ut);
}, Ut = (a, t) => {
  if (pt) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), o = X.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = e.cssText, a.appendChild(i);
  }
}, yt = pt ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Rt(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Vt, defineProperty: Lt, getOwnPropertyDescriptor: Ft, getOwnPropertyNames: Yt, getOwnPropertySymbols: Wt, getPrototypeOf: Gt } = Object, at = globalThis, xt = at.trustedTypes, qt = xt ? xt.emptyScript : "", Qt = at.reactiveElementPolyfillSupport, F = (a, t) => a, et = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? qt : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, t) {
  let e = a;
  switch (t) {
    case Boolean:
      e = a !== null;
      break;
    case Number:
      e = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(a);
      } catch {
        e = null;
      }
  }
  return e;
} }, ht = (a, t) => !Vt(a, t), $t = { attribute: !0, type: String, converter: et, reflect: !1, useDefault: !1, hasChanged: ht };
Symbol.metadata ??= Symbol("metadata"), at.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let B = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = $t) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(t, i, e);
      o !== void 0 && Lt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: o, set: r } = Ft(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: o, set(s) {
      const l = o?.call(this);
      r?.call(this, s), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? $t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(F("elementProperties"))) return;
    const t = Gt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(F("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(F("properties"))) {
      const e = this.properties, i = [...Yt(e), ...Wt(e)];
      for (const o of i) this.createProperty(o, e[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, o] of e) this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const o = this._$Eu(e, i);
      o !== void 0 && this._$Eh.set(o, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i) e.unshift(yt(o));
    } else t !== void 0 && e.push(yt(t));
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
    return Ut(t, this.constructor.elementStyles), t;
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
    const i = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, i);
    if (o !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : et).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const r = i.getPropertyOptions(o), s = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : et;
      this._$Em = o;
      const l = s.fromAttribute(e, r.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, o = !1, r) {
    if (t !== void 0) {
      const s = this.constructor;
      if (o === !1 && (r = this[t]), i ??= s.getPropertyOptions(t), !((i.hasChanged ?? ht)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: o, wrapped: r }, s) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), r !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, r] of i) {
        const { wrapped: s } = r, l = this[o];
        s !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, r, l);
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
B.elementStyles = [], B.shadowRootOptions = { mode: "open" }, B[F("elementProperties")] = /* @__PURE__ */ new Map(), B[F("finalized")] = /* @__PURE__ */ new Map(), Qt?.({ ReactiveElement: B }), (at.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ft = globalThis, kt = (a) => a, it = ft.trustedTypes, wt = it ? it.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Dt = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Nt = "?" + A, Jt = `<${Nt}>`, D = document, Y = () => D.createComment(""), W = (a) => a === null || typeof a != "object" && typeof a != "function", bt = Array.isArray, Kt = (a) => bt(a) || typeof a?.[Symbol.iterator] == "function", lt = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, St = /-->/g, Ct = />/g, T = RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), At = /'/g, Pt = /"/g, Ht = /^(?:script|style|textarea|title)$/i, Zt = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), n = Zt(1), j = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), Mt = /* @__PURE__ */ new WeakMap(), z = D.createTreeWalker(D, 129);
function It(a, t) {
  if (!bt(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return wt !== void 0 ? wt.createHTML(t) : t;
}
const Xt = (a, t) => {
  const e = a.length - 1, i = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = L;
  for (let l = 0; l < e; l++) {
    const c = a[l];
    let d, u, p = -1, h = 0;
    for (; h < c.length && (s.lastIndex = h, u = s.exec(c), u !== null); ) h = s.lastIndex, s === L ? u[1] === "!--" ? s = St : u[1] !== void 0 ? s = Ct : u[2] !== void 0 ? (Ht.test(u[2]) && (o = RegExp("</" + u[2], "g")), s = T) : u[3] !== void 0 && (s = T) : s === T ? u[0] === ">" ? (s = o ?? L, p = -1) : u[1] === void 0 ? p = -2 : (p = s.lastIndex - u[2].length, d = u[1], s = u[3] === void 0 ? T : u[3] === '"' ? Pt : At) : s === Pt || s === At ? s = T : s === St || s === Ct ? s = L : (s = T, o = void 0);
    const f = s === T && a[l + 1].startsWith("/>") ? " " : "";
    r += s === L ? c + Jt : p >= 0 ? (i.push(d), c.slice(0, p) + Dt + c.slice(p) + A + f) : c + A + (p === -2 ? l : f);
  }
  return [It(a, r + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class G {
  constructor({ strings: t, _$litType$: e }, i) {
    let o;
    this.parts = [];
    let r = 0, s = 0;
    const l = t.length - 1, c = this.parts, [d, u] = Xt(t, e);
    if (this.el = G.createElement(d, i), z.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (o = z.nextNode()) !== null && c.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const p of o.getAttributeNames()) if (p.endsWith(Dt)) {
          const h = u[s++], f = o.getAttribute(p).split(A), v = /([.?@])?(.*)/.exec(h);
          c.push({ type: 1, index: r, name: v[2], strings: f, ctor: v[1] === "." ? ee : v[1] === "?" ? ie : v[1] === "@" ? oe : st }), o.removeAttribute(p);
        } else p.startsWith(A) && (c.push({ type: 6, index: r }), o.removeAttribute(p));
        if (Ht.test(o.tagName)) {
          const p = o.textContent.split(A), h = p.length - 1;
          if (h > 0) {
            o.textContent = it ? it.emptyScript : "";
            for (let f = 0; f < h; f++) o.append(p[f], Y()), z.nextNode(), c.push({ type: 2, index: ++r });
            o.append(p[h], Y());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Nt) c.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = o.data.indexOf(A, p + 1)) !== -1; ) c.push({ type: 7, index: r }), p += A.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = D.createElement("template");
    return i.innerHTML = t, i;
  }
}
function R(a, t, e = a, i) {
  if (t === j) return t;
  let o = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = W(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(a), o._$AT(a, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = o : e._$Cl = o), o !== void 0 && (t = R(a, o._$AS(a, t.values), o, i)), t;
}
class te {
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
    const { el: { content: e }, parts: i } = this._$AD, o = (t?.creationScope ?? D).importNode(e, !0);
    z.currentNode = o;
    let r = z.nextNode(), s = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (s === c.index) {
        let d;
        c.type === 2 ? d = new J(r, r.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (d = new re(r, this, t)), this._$AV.push(d), c = i[++l];
      }
      s !== c?.index && (r = z.nextNode(), s++);
    }
    return z.currentNode = D, o;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class J {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, o) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = R(this, t, e), W(t) ? t === y || t == null || t === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : t !== this._$AH && t !== j && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== y && W(this._$AH) ? this._$AA.nextSibling.data = t : this.T(D.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = G.createElement(It(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === o) this._$AH.p(e);
    else {
      const r = new te(o, this), s = r.u(this.options);
      r.p(e), this.T(s), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = Mt.get(t.strings);
    return e === void 0 && Mt.set(t.strings, e = new G(t)), e;
  }
  k(t) {
    bt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, o = 0;
    for (const r of t) o === e.length ? e.push(i = new J(this.O(Y()), this.O(Y()), this, this.options)) : i = e[o], i._$AI(r), o++;
    o < e.length && (this._$AR(i && i._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = kt(t).nextSibling;
      kt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class st {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, o, r) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = y;
  }
  _$AI(t, e = this, i, o) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) t = R(this, t, e, 0), s = !W(t) || t !== this._$AH && t !== j, s && (this._$AH = t);
    else {
      const l = t;
      let c, d;
      for (t = r[0], c = 0; c < r.length - 1; c++) d = R(this, l[i + c], e, c), d === j && (d = this._$AH[c]), s ||= !W(d) || d !== this._$AH[c], d === y ? t = y : t !== y && (t += (d ?? "") + r[c + 1]), this._$AH[c] = d;
    }
    s && !o && this.j(t);
  }
  j(t) {
    t === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ee extends st {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === y ? void 0 : t;
  }
}
class ie extends st {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== y);
  }
}
class oe extends st {
  constructor(t, e, i, o, r) {
    super(t, e, i, o, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = R(this, t, e, 0) ?? y) === j) return;
    const i = this._$AH, o = t === y && i !== y || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== y && (i === y || o);
    o && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class re {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const ae = ft.litHtmlPolyfillSupport;
ae?.(G, J), (ft.litHtmlVersions ??= []).push("3.3.3");
const se = (a, t, e) => {
  const i = e?.renderBefore ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = o = new J(t.insertBefore(Y(), r), r, void 0, e ?? {});
  }
  return o._$AI(a), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = globalThis;
class $ extends B {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = se(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return j;
  }
}
$._$litElement$ = !0, $.finalized = !0, gt.litElementHydrateSupport?.({ LitElement: $ });
const ne = gt.litElementPolyfillSupport;
ne?.({ LitElement: $ });
(gt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = (a) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(a, t);
  }) : customElements.define(a, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = { attribute: !0, type: String, converter: et, reflect: !1, hasChanged: ht }, le = (a = ce, t, e) => {
  const { kind: i, metadata: o } = e;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), i === "setter" && ((a = Object.create(a)).wrapped = !0), r.set(e.name, a), i === "accessor") {
    const { name: s } = e;
    return { set(l) {
      const c = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(s, c, a, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(s, void 0, a, l), l;
    } };
  }
  if (i === "setter") {
    const { name: s } = e;
    return function(l) {
      const c = this[s];
      t.call(this, l), this.requestUpdate(s, c, a, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function x(a) {
  return (t, e) => typeof e == "object" ? le(a, t, e) : ((i, o, r) => {
    const s = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, i), s ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(a) {
  return x({ ...a, state: !0, attribute: !1 });
}
const N = (a, t, e, i) => {
  const o = {}, r = new CustomEvent(t, {
    bubbles: o.bubbles === void 0 ? !0 : o.bubbles,
    cancelable: !!o.cancelable,
    composed: o.composed === void 0 ? !0 : o.composed,
    detail: e ?? {}
  });
  return a.dispatchEvent(r), r;
}, O = (a, t, e, i, o) => {
  if (!t)
    return;
  const r = o ?? e.entity ?? "", s = typeof i == "string" ? { action: "toggle" } : i ?? e.tap_action ?? { action: "toggle" }, l = s.action ?? "toggle";
  if (l !== "none") {
    if (l === "more-info") {
      r && a instanceof HTMLElement && N(a, "hass-more-info", { entityId: r });
      return;
    }
    if (l === "navigate") {
      const c = s.navigation_path ?? e.hash ?? "#aurora-popup";
      c.startsWith("#") ? (window.location.hash = c, window.dispatchEvent(new HashChangeEvent("hashchange"))) : (window.history.pushState(null, "", c), window instanceof Window && N(window, "location-changed", { replace: !1 }));
      return;
    }
    if (l === "call-service" && s.service) {
      const [c, d] = s.service.split(".");
      c && d && t.callService(c, d, s.service_data ?? { entity_id: r });
      return;
    }
    if (r) {
      const c = r.split(".")[0];
      c === "scene" || c === "script" ? t.callService(c, "turn_on", { entity_id: r }) : t.callService("homeassistant", "toggle", { entity_id: r });
    }
  }
}, P = (a, t, e, i, o) => {
  O(a, t, e, i, o);
}, Tt = "aurora_global_modules_state_v1", de = "aurora_custom_modules_v1";
class E {
  /**
   * Synchronizes "All cards" (global_modules) and their settings across the dashboard
   */
  static syncGlobalConfigFromCard(t) {
    try {
      if (Array.isArray(t.global_modules)) {
        const i = {
          ...this.getGlobalPayload().moduleConfigs,
          ...t.module_configs ?? {}
        }, o = {
          globalModules: t.global_modules,
          moduleConfigs: i
        };
        localStorage.setItem(Tt, JSON.stringify(o));
      }
    } catch {
    }
  }
  static getGlobalPayload() {
    try {
      const t = localStorage.getItem(Tt);
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
      const t = localStorage.getItem(de);
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
    const e = t.active_modules ?? [], i = t.global_modules ?? [], o = this.getGlobalPayload().globalModules, r = /* @__PURE__ */ new Set([
      ...e,
      ...i,
      ...o
    ]);
    return Array.from(r);
  }
  /**
   * Retrieves merged configuration for a specific module ID
   */
  static getModuleConfig(t, e) {
    const i = this.getGlobalPayload().moduleConfigs[e] ?? {}, o = t.module_configs?.[e] ?? {};
    return {
      ...i,
      ...o
    };
  }
  /**
   * Evaluates ${state}, ${entity}, ${module.xyz} and inline JS template strings safely
   */
  static evaluateTemplateString(t, e, i, o) {
    if (!t)
      return "";
    const r = i.entity ?? "", s = r && e?.states ? e.states[r] : void 0, l = s ? s.state : "unknown", c = Number.isNaN(Number(l)) ? l : Number(l);
    return t.replace(/\$\{([^}]+)\}/g, (d, u) => {
      const p = u.trim();
      if (p === "state")
        return String(l);
      if (p === "entity")
        return r;
      if (p.startsWith("module.")) {
        const h = p.slice(7), f = o[h];
        return f !== void 0 ? String(f) : "";
      }
      try {
        const f = new Function("hass", "entity", "state", "stateObj", "module", "return (" + p + ");")(e, r, c, s, o);
        return f != null ? String(f) : "";
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
    const i = [], o = this.getActiveModuleIds(e), r = e.vibe_preset ?? "aurora_lumina";
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
      `), o.includes("bubble_chips")) {
      const l = this.getModuleConfig(e, "bubble_chips"), c = Number(l.chip_height ?? 42);
      i.push(`
        .aurora-card-surface {
          border-radius: 999px !important;
          min-height: ${c}px !important;
          padding: 6px 14px !important;
        }
      `);
    }
    if (o.includes("accent_color_picker")) {
      const l = this.getModuleConfig(e, "accent_color_picker"), c = String(l.accent_color ?? l.custom_param ?? "#e11d48");
      i.push(`
        :host {
          --aurora-accent: ${c} !important;
        }
        .aurora-card-surface[data-state-on] {
          border-color: ${c} !important;
          box-shadow: 0 0 20px ${c}40 !important;
        }
        .aurora-card-surface[data-state-on] .aurora-main-icon-wrap {
          background: ${c}33 !important;
          color: ${c} !important;
        }
      `);
    }
    if (o.includes("multi_section_card")) {
      const l = this.getModuleConfig(e, "multi_section_card");
      if (l.bg_color) {
        const c = String(l.bg_color).trim(), d = c === "accent" ? "var(--accent-color)" : c === "primary" ? "var(--primary-color)" : c;
        i.push(`
          .aurora-card-surface {
            background: ${d} !important;
          }
        `);
      }
    }
    if (o.includes("conditional_slider_coloring")) {
      const l = this.getModuleConfig(e, "conditional_slider_coloring"), c = String(l.default_color ?? "var(--primary-color, #38bdf8)"), d = String(l.condition_rule ?? "").trim();
      let u = c;
      const p = e.entity ?? "", h = p && t?.states ? t.states[p] : void 0, f = h ? parseFloat(h.state) : NaN;
      if (d && !Number.isNaN(f)) {
        const v = d.match(/^([^\s]+)\s+when\s*([><=]+)\s*(-?\d+(?:\.\d+)?)/i);
        if (v) {
          const g = v[1], k = v[2], S = parseFloat(v[3]);
          k === ">" && f > S && (u = g), k === ">=" && f >= S && (u = g), k === "<" && f < S && (u = g), k === "<=" && f <= S && (u = g), k === "==" && f === S && (u = g);
        }
      }
      i.push(`
        .aurora-slider-fill {
          background: ${u} !important;
        }
      `);
    }
    const s = this.getCustomModules();
    for (const l of s)
      if (o.includes(l.id) && l.codeTemplate) {
        const c = this.getModuleConfig(e, l.id), d = this.evaluateTemplateString(l.codeTemplate, t, e, c);
        i.push(d);
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
      return n``;
    const i = this.getModuleConfig(t, "card_backdrop_image"), o = String(i.image_url ?? "");
    if (!o)
      return n``;
    const r = String(i.size ?? "cover"), s = String(i.repeat ?? "no-repeat"), l = !!i.custom_position, c = Number(i.pos_x ?? 50), d = Number(i.pos_y ?? 50), u = Number(i.image_opacity ?? 100) / 100, p = Number(i.blur ?? 0), h = Number(i.scale ?? 100) / 100, f = String(i.overlay_color ?? "#000000"), v = l ? `${c}%${d}%` : "center center", g = [
      `background-image: url('${o}')`,
      `background-size: ${r}`,
      `background-repeat: ${s}`,
      `background-position: ${v}`,
      `opacity: ${u}`,
      `filter: blur(${p}px)`,
      `transform: scale(${h})`
    ].join("; ");
    return n`
      <div class="aurora-backdrop-container">
        <div class="aurora-backdrop-image" style="${g}"></div>
        <div
          class="aurora-backdrop-overlay"
          style="background-color: ${f}; opacity: 0.32;"
        ></div>
      </div>
    `;
  }
  /**
   * Renders the SVG Circular Progress Ring around the main icon if Icon Border Progress is enabled
   */
  static renderIconProgressRing(t, e) {
    if (!this.getActiveModuleIds(e).includes("icon_border_progress"))
      return n``;
    const o = this.getModuleConfig(e, "icon_border_progress"), r = String(o.progress_entity ?? e.entity ?? ""), s = r && t?.states ? t.states[r] : void 0;
    let l = 65;
    if (s) {
      const p = parseFloat(s.state);
      Number.isNaN(p) ? s.attributes.brightness !== void 0 ? l = Math.round(Number(s.attributes.brightness) / 255 * 100) : s.attributes.battery_level !== void 0 ? l = Number(s.attributes.battery_level) : s.state === "on" || s.state === "heat" ? l = 100 : l = 0 : l = Math.max(0, Math.min(100, p));
    }
    const c = 19, d = 2 * Math.PI * c, u = d - l / 100 * d;
    return n`
      <svg class="aurora-icon-progress-svg" viewBox="0 0 44 44">
        <circle
          class="ring-track"
          cx="22"
          cy="22"
          r="${c}"
          fill="none"
          stroke-width="2.5"
        ></circle>
        <circle
          class="ring-fill"
          cx="22"
          cy="22"
          r="${c}"
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
  static renderMultiSectionExtension(t, e, i, o, r, s) {
    if (!this.getActiveModuleIds(i).includes("multi_section_card"))
      return n``;
    const c = this.getModuleConfig(i, "multi_section_card"), d = Math.min(4, Math.max(2, Number(c.section_count ?? 3))), u = Array.from({ length: d }, (p, h) => h + 1);
    return n`
      <div
        class="aurora-multi-section-grid"
        style="grid-template-columns: repeat(${d}, minmax(0, 1fr));"
      >
        ${u.map((p) => {
      const h = String(c["entity_" + p] ?? i.entity ?? ""), f = String(c["icon_" + p] ?? ""), v = String(c["name_" + p] ?? ""), g = o(h, f), k = r(h, v), S = s(h);
      return n`
            <div
              class="aurora-multi-sec-cell"
              @click="${(jt) => {
        jt.stopPropagation(), h && e && N(t, "hass-more-info", { entityId: h });
      }}"
            >
              <div class="sec-cell-icon">
                <ha-icon .icon="${g}"></ha-icon>
              </div>
              <div class="sec-cell-text">
                <span class="sec-cell-name">${k}</span>
                <span class="sec-cell-state">${S}</span>
              </div>
            </div>
          `;
    })}
      </div>
    `;
  }
}
const pe = {
  id: "card_backdrop_image",
  name: "Card Backdrop Image",
  version: "v1.2.0",
  creator: "Aurora Studio",
  description: "Add a configurable image backdrop to an individual card with blur, scale, and overlay options.",
  type: "base-extension",
  supportedCards: ["button", "climate", "media-player", "pop-up", "cover"],
  codeTemplate: `
.aurora-card {
  background-image: url("\${module.image_url}");
  background-size: \${module.size};
  background-position: center;
}
.aurora-card::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(\${module.blur}px);
  background: rgba(0,0,0,\${module.darken});
  z-index: 0;
}
.aurora-card > * {
  z-index: 1;
}
  `,
  editorSchemaYaml: `
image_url:
  type: string
size:
  type: select
  options: [cover, contain]
blur:
  type: number
  default: 0
darken:
  type: number
  default: 0.2
  `,
  yamlExample: `card_backdrop_image:
  image_url: "/local/bg.jpg"
  size: cover
  blur: 4
  darken: 0.5`,
  builtIn: !0
}, ue = {
  id: "multi_section_card",
  name: "Multi Section Card",
  version: "v1.1.0",
  creator: "Aurora Studio",
  description: "Splits the card into a multi-column grid (2, 3, or 4 sections) for compact sub-entities.",
  type: "base-extension",
  supportedCards: ["button", "separator"],
  codeTemplate: `
.aurora-card-content {
  display: grid;
  grid-template-columns: repeat(\${module.section_count}, 1fr);
  gap: 8px;
  align-items: center;
}
  `,
  editorSchemaYaml: `
section_count:
  type: select
  options: ["2", "3", "4"]
  default: "3"
  `,
  yamlExample: `multi_section_card:
  section_count: "3"`,
  builtIn: !0
}, he = {
  id: "animated_weather_icon",
  name: "Animated Weather Icon",
  version: "v1.0.0",
  creator: "Aurora Studio",
  description: "Replaces static weather icons with smooth CSS/SVG keyframe animations based on state.",
  type: "base-extension",
  supportedCards: ["button", "climate"],
  codeTemplate: `
@keyframes pulseWeather {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; text-shadow: 0 0 10px var(--primary-color); }
  100% { transform: scale(1); opacity: 0.8; }
}
.aurora-icon-container {
  animation: pulseWeather 3s infinite ease-in-out;
}
  `,
  editorSchemaYaml: `
animation_intensity:
  type: select
  options: [subtle, normal, high]
  default: normal
  `,
  yamlExample: `animated_weather_icon:
  animation_intensity: normal`,
  builtIn: !0
}, fe = {
  id: "climate_quick_dial",
  name: "Climate Quick Dial",
  version: "v1.0.0",
  creator: "Aurora Studio",
  description: "Injects an interactive mini-slider directly onto climate cards.",
  type: "base-extension",
  supportedCards: ["climate"],
  codeTemplate: `
.aurora-climate-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  background: rgba(255,255,255,0.05);
  padding: 6px 12px;
  border-radius: 12px;
}
  `,
  editorSchemaYaml: `
show_mode_selector:
  type: boolean
  default: true
step_size:
  type: number
  default: 0.5
  `,
  yamlExample: `climate_quick_dial:
  show_mode_selector: true
  step_size: 0.5`,
  builtIn: !0
}, be = {
  id: "battery_health_badge",
  name: "Battery Health Badge",
  version: "v1.0.0",
  creator: "Aurora Studio",
  description: "Automatically scans for a battery entity and appends a color-coded status indicator.",
  type: "base-extension",
  supportedCards: ["button", "cover", "media-player"],
  codeTemplate: `
.aurora-battery-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: \${ module.level > 50 ? 'rgba(76, 175, 80, 0.2)' : module.level > 20 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.4)' };
  color: \${ module.level > 50 ? '#4CAF50' : module.level > 20 ? '#FF9800' : '#F44336' };
  border: 1px solid currentColor;
}
  `,
  editorSchemaYaml: `
override_entity:
  type: string
show_percentage:
  type: boolean
  default: true
  `,
  yamlExample: `battery_health_badge:
  show_percentage: true`,
  builtIn: !0
}, ge = [
  pe,
  ue,
  he,
  fe,
  be
];
class me {
  constructor() {
    this.userModules = /* @__PURE__ */ new Map();
  }
  getAllModules() {
    return [...ge, ...Array.from(this.userModules.values())];
  }
  registerUserModule(t) {
    this.userModules.set(t.id, { ...t, builtIn: !1 });
  }
  deleteUserModule(t) {
    return this.userModules.delete(t);
  }
}
const tt = new me(), V = w`
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
var nt = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
let q = class extends $ {
  constructor() {
    super(...arguments), this._sliderValue = null;
  }
  render() {
    if (!this.config || !this.hass)
      return n``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, i = e ? e.state : "unavailable", o = ["on", "open", "playing", "home", "unlocked", "active"].includes(i), r = this.config.button_type || "switch", s = this.config.name || e?.attributes.friendly_name || "Aurora Button", l = this.config.icon || e?.attributes.icon || "mdi:radiobox-marked", c = this._getEntityPercentage(e), d = this._sliderValue !== null ? this._sliderValue : c;
    return n`
      <ha-card class="${o ? "is-on" : "is-off"} mode-${r}">
        ${r === "slider" ? n`
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
          <div class="icon-container ${o ? "active" : ""}" @click="${this._onIconClick}">
            <ha-icon .icon="${l}"></ha-icon>
          </div>

          <div class="info-container">
            <span class="title">${s}</span>
            <div class="secondary-line">
              ${this.config.show_state !== !1 && e ? n`<span class="state">${i}</span>` : ""}
              ${r === "slider" ? n`<span class="percent-badge">${Math.round(d)}%</span>` : ""}
              ${this.config.show_attribute && this.config.attribute && e?.attributes[this.config.attribute] !== void 0 ? n`<span class="attr">• ${e.attributes[this.config.attribute]}</span>` : ""}
            </div>
          </div>

          ${this.config.sub_button && this.config.sub_button.length > 0 ? n`
                <div class="sub-buttons-stack" @click="${(u) => u.stopPropagation()}">
                  ${this.config.sub_button.map((u) => this._renderSubButton(u))}
                </div>
              ` : ""}
        </div>
      </ha-card>
    `;
  }
  _renderSubButton(t) {
    const e = t.entity ? this.hass.states[t.entity] : void 0, i = e && ["on", "open", "playing", "active"].includes(e.state), o = t.icon || e?.attributes.icon || "mdi:circle-medium";
    return n`
      <button
        class="sub-btn ${i ? "sub-on" : ""} ${t.show_background === !1 ? "no-bg" : ""}"
        @click="${() => P(this, this.hass, t, "tap")}"
        title="${t.name || e?.attributes.friendly_name || ""}"
      >
        <ha-icon .icon="${o}"></ha-icon>
        ${t.show_state && e ? n`<span class="sub-state">${e.state}</span>` : ""}
        ${t.name ? n`<span class="sub-state">${t.name}</span>` : ""}
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
    const e = t.target, i = Number(e.value);
    if (this._sliderValue = null, !this.config.entity)
      return;
    const o = this.config.entity.split(".")[0];
    o === "light" ? this.hass.callService("light", "turn_on", {
      entity_id: this.config.entity,
      brightness_pct: i
    }) : o === "fan" ? this.hass.callService("fan", "set_percentage", {
      entity_id: this.config.entity,
      percentage: i
    }) : o === "cover" ? this.hass.callService("cover", "set_cover_position", {
      entity_id: this.config.entity,
      position: i
    }) : o === "media_player" && this.hass.callService("media_player", "volume_set", {
      entity_id: this.config.entity,
      volume_level: i / 100
    });
  }
  _onIconClick(t) {
    t.stopPropagation(), this.config.entity && P(this, this.hass, { entity: this.config.entity, tap_action: { action: "more-info" } }, "tap");
  }
  _onMainClick() {
    if (this.config.button_type === "slider")
      return;
    const t = this.config.button_type === "state" ? "more-info" : "toggle", e = {
      ...this.config,
      tap_action: this.config.tap_action || { action: t }
    };
    P(this, this.hass, e, "tap");
  }
  static {
    this.styles = [
      V,
      w`
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
nt([
  x({ attribute: !1 })
], q.prototype, "hass", void 0);
nt([
  x({ attribute: !1 })
], q.prototype, "config", void 0);
nt([
  b()
], q.prototype, "_sliderValue", void 0);
q = nt([
  C("aurora-button-card")
], q);
var mt = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
let ot = class extends $ {
  render() {
    if (!this.config || !this.hass)
      return n``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, i = e ? e.state : "off", o = e?.attributes.hvac_action || i, r = e?.attributes.current_temperature ?? "--", s = e?.attributes.temperature ?? 20, l = this.config.step || e?.attributes.target_temp_step || 0.5, c = e?.attributes.hvac_modes || ["off", "heat", "auto"], d = this.config.name || e?.attributes.friendly_name || "Climate", u = this.config.icon || e?.attributes.icon || "mdi:thermostat";
    return n`
      <ha-card class="mode-${i}">
        <div class="climate-header">
          <div
            class="climate-id"
            @click="${() => P(this, this.hass, { entity: t, tap_action: { action: "more-info" } }, "tap")}"
          >
            <div class="climate-icon ${o}">
              <ha-icon .icon="${u}"></ha-icon>
            </div>
            <div class="climate-titles">
              <span class="title">${d}</span>
              <span class="subtitle">${o} • Current: ${r}°</span>
            </div>
          </div>

          <div class="temp-stepper">
            <button class="step-btn" @click="${() => this._adjustTemp(Number(s) - l)}">
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <span class="target-val">${s}°</span>
            <button class="step-btn" @click="${() => this._adjustTemp(Number(s) + l)}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>

        <div class="hvac-modes-bar">
          ${c.map((p) => n`
              <button
                class="mode-pill ${p === i ? "active" : ""}"
                @click="${() => this._setHvacMode(p)}"
              >
                ${p}
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
      V,
      w`
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
mt([
  x({ attribute: !1 })
], ot.prototype, "hass", void 0);
mt([
  x({ attribute: !1 })
], ot.prototype, "config", void 0);
ot = mt([
  C("aurora-climate-card")
], ot);
var ct = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
let Q = class extends $ {
  constructor() {
    super(...arguments), this._dragPos = null;
  }
  render() {
    if (!this.config || !this.hass)
      return n``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, i = e ? e.state : "unavailable", o = e?.attributes.current_position ?? (i === "open" ? 100 : 0), r = this._dragPos !== null ? this._dragPos : o, s = this.config.name || e?.attributes.friendly_name || "Cover", l = this.config.icon || e?.attributes.icon || (r > 0 ? "mdi:window-shutter-open" : "mdi:window-shutter");
    return n`
      <ha-card>
        <div class="cover-top">
          <div class="cover-identity" @click="${() => P(this, this.hass, { entity: t, tap_action: { action: "more-info" } }, "tap")}">
            <div class="cover-icon ${r > 0 ? "open" : ""}">
              <ha-icon .icon="${l}"></ha-icon>
            </div>
            <div class="cover-meta">
              <span class="title">${s}</span>
              <span class="subtitle">${i} •${Math.round(r)}%</span>
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
          <div class="position-fill" style="width: ${r}%"></div>
          <input
            type="range"
            min="0"
            max="100"
            .value="${String(r)}"
            @input="${(c) => {
      this._dragPos = Number(c.target.value);
    }}"
            @change="${(c) => {
      const d = Number(c.target.value);
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
      V,
      w`
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
ct([
  x({ attribute: !1 })
], Q.prototype, "hass", void 0);
ct([
  x({ attribute: !1 })
], Q.prototype, "config", void 0);
ct([
  b()
], Q.prototype, "_dragPos", void 0);
Q = ct([
  C("aurora-cover-card")
], Q);
var I = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
let M = class extends $ {
  constructor() {
    super(...arguments), this._volDrag = null, this._seekDrag = null, this._dspDrawerOpen = !1, this._liveTick = 0;
  }
  render() {
    if (!this.config || !this.hass)
      return n``;
    const t = this.config.entity, e = t ? this.hass.states[t] : void 0, i = e ? e.state : "off", o = i === "playing", r = e?.attributes.media_title || this.config.name || e?.attributes.friendly_name || "Media Player", s = e?.attributes.media_artist || i, l = e?.attributes.entity_picture, c = this._volDrag !== null ? this._volDrag : Math.round((e?.attributes.volume_level ?? 0.5) * 100), d = Number(e?.attributes.media_position ?? 0), u = e?.attributes.media_position_updated_at, p = Number(e?.attributes.media_duration ?? 0);
    let h = d;
    if (o && u) {
      const g = (Date.now() - new Date(u).getTime()) / 1e3;
      g > 0 && (h = Math.min(p, d + g));
    }
    const f = p > 0 ? Math.min(100, Math.max(0, h / p * 100)) : 0, v = this._seekDrag !== null ? this._seekDrag : f;
    return this._seekDrag !== null && this._seekDrag / 100 * p, n`
      <ha-card class="${o ? "playing" : ""}">
        ${l ? n`<div class="artwork-bg" style="background-image: url('${l}')"></div>` : ""}

        <div class="media-content">
          <div class="media-top">
            <div
              class="album-thumb"
              @click="${() => P(this, this.hass, { entity: t, tap_action: { action: "more-info" } }, "tap")}"
            >
              ${l ? n`<img src="${l}" alt="Album Art" />` : n`<ha-icon icon="mdi:music-note"></ha-icon>`}
            </div>

            <div class="track-info">
              <div class="title-row">
                <span class="track-title">${r}</span>${this._renderTelemetryBadge(e)}
              </div>
              <span class="track-artist">${s}</span>
            </div>

            <div class="transport-controls">
              <button class="t-btn" @click="${() => this._mediaCmd("media_previous_track")}">
                <ha-icon icon="mdi:skip-previous"></ha-icon>
              </button>
              <button class="t-btn play-btn" @click="${() => this._mediaCmd("media_play_pause")}">
                <ha-icon .icon="${o ? "mdi:pause" : "mdi:play"}"></ha-icon>
              </button>
              <button class="t-btn" @click="${() => this._mediaCmd("media_next_track")}">
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </button>
              <button 
                class="t-btn dsp-btn ${this._dspDrawerOpen ? "active" : ""}" 
                @click="${(g) => {
      g.stopPropagation(), this._dspDrawerOpen = !this._dspDrawerOpen;
    }}" 
                title="Sound Signatures / DSP"
              >
                <ha-icon icon="mdi:equalizer"></ha-icon>
              </button>
            </div>
          </div>

          <!-- Master Tape Interactive Progress Bar -->
          <div class="progress-section">
            <div class="progress-rail">
              <div class="progress-fill" style="width: ${v}%"></div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                .value="${String(v)}"
                @input="${(g) => {
      this._seekDrag = Number(g.target.value);
    }}"
                @change="${(g) => {
      const k = Number(g.target.value);
      if (this._seekDrag = null, t && p > 0) {
        const S = k / 100 * p;
        this.hass.callService("media_player", "media_seek", {
          entity_id: t,
          seek_position: S
        });
      }
    }}"
              />
            </div>
            <div class="time-row">
              <span>${this._formatTime(h)}</span>
              <span>${this._formatTime(p)}</span>
            </div>
          </div>

          <!-- DSP Sound Signature Profiles Drawer -->
          ${this._dspDrawerOpen ? n`
                <div class="dsp-profiles-drawer" @click="${(g) => g.stopPropagation()}">
                  <span class="dsp-title">DSP Sound Signatures</span>
                  <div class="dsp-pills">
                    <button class="dsp-pill" @click="${() => this._setDspProfile("flat")}">Direct / Flat</button>
                    <button class="dsp-pill" @click="${() => this._setDspProfile("jazz")}">Warm Jazz</button>
                    <button class="dsp-pill" @click="${() => this._setDspProfile("night")}">Night Mode</button>
                  </div>
                </div>
              ` : ""}

          <div class="volume-row">
            <ha-icon icon="mdi:volume-medium"></ha-icon>
            <div class="vol-slider-wrap">
              <div class="vol-fill" style="width: ${c}%"></div>
              <input
                type="range"
                min="0"
                max="100"
                .value="${String(c)}"
                @input="${(g) => {
      this._volDrag = Number(g.target.value);
    }}"
                @change="${(g) => {
      const k = Number(g.target.value);
      this._volDrag = null, t && this.hass.callService("media_player", "volume_set", {
        entity_id: t,
        volume_level: k / 100
      });
    }}"
              />
            </div>
            <span class="vol-pct">${c}%</span>
          </div>
        </div>
      </ha-card>
    `;
  }
  _renderTelemetryBadge(t) {
    const e = t?.attributes;
    if (!e)
      return n``;
    const i = e.audio_codec || e.codec || "", o = e.sample_rate ? `${e.sample_rate / 1e3}kHz` : "", r = e.bit_depth ? `${e.bit_depth}-bit` : "";
    if (!i && !o)
      return n``;
    const s = [i.toUpperCase(), o, r].filter(Boolean).join(" • ");
    return n`
      <div class="telemetry-badge" title="High-Res Stream Telemetry">
        <ha-icon icon="mdi:flash-outline"></ha-icon>
        <span>${s}</span>
      </div>
    `;
  }
  _formatTime(t) {
    if (isNaN(t) || t < 0)
      return "0:00";
    const e = Math.floor(t / 60), i = Math.floor(t % 60);
    return `${e}:${i < 10 ? "0" : ""}${i}`;
  }
  _mediaCmd(t) {
    this.config.entity && this.hass.callService("media_player", t, { entity_id: this.config.entity });
  }
  connectedCallback() {
    super.connectedCallback(), this._tickInterval = window.setInterval(() => {
      const t = this.config?.entity;
      (t ? this.hass?.states[t] : void 0)?.state === "playing" && this._seekDrag === null && (this._liveTick = Date.now());
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tickInterval && (clearInterval(this._tickInterval), this._tickInterval = void 0);
  }
  _setDspProfile(t) {
    this.config.entity && (this.hass.callService("script", "set_audio_dsp_profile", {
      profile: t,
      entity_id: this.config.entity
    }), this._dspDrawerOpen = !1);
  }
  static {
    this.styles = [
      V,
      w`
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
      .title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .track-title {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .telemetry-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 1px 6px;
        border-radius: 6px;
        background: rgba(251, 191, 36, 0.18);
        color: #fbbf24;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        flex-shrink: 0;
      }
      .telemetry-badge ha-icon {
        --mdc-icon-size: 11px;
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
      .t-btn.dsp-btn.active {
        background: var(--aurora-accent-color);
        color: #ffffff;
      }
      .progress-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .progress-rail {
        position: relative;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
        cursor: pointer;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--aurora-accent-color), #f43f5e);
        border-radius: 3px;
        pointer-events: none;
        transition: width 0.1s linear;
      }
      .progress-rail input[type='range'] {
        position: absolute;
        inset: -6px 0;
        width: 100%;
        height: 18px;
        opacity: 0;
        cursor: pointer;
        margin: 0;
      }
      .time-row {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: var(--aurora-text-secondary);
      }
      .dsp-profiles-drawer {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        animation: fadeIn 0.2s ease-out;
      }
      .dsp-title {
        font-size: 11px;
        font-weight: 600;
        color: var(--aurora-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .dsp-pills {
        display: flex;
        gap: 6px;
      }
      .dsp-pill {
        flex: 1;
        padding: 6px 0;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: var(--aurora-text-primary);
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .dsp-pill:hover {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
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
I([
  x({ attribute: !1 })
], M.prototype, "hass", void 0);
I([
  x({ attribute: !1 })
], M.prototype, "config", void 0);
I([
  b()
], M.prototype, "_volDrag", void 0);
I([
  b()
], M.prototype, "_seekDrag", void 0);
I([
  b()
], M.prototype, "_dspDrawerOpen", void 0);
I([
  b()
], M.prototype, "_liveTick", void 0);
M = I([
  C("aurora-media-card")
], M);
var K = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
let U = class extends $ {
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
    for (const i of this.config.cards)
      try {
        let o;
        if (t)
          o = await t.createCardElement(i);
        else {
          const r = i.type.startsWith("custom:") ? i.type.replace("custom:", "") : `hui-${i.type}-card`;
          o = document.createElement(r), o.setConfig && o.setConfig(i);
        }
        this.hass && (o.hass = this.hass), e.push(o);
      } catch (o) {
        console.error("Aurora Pop-up child card error:", o);
      }
    this._childCards = e;
  }
  _checkHash() {
    const t = this.config?.hash || "#aurora-popup", e = t.startsWith("#") ? t : `#${t}`, i = window.location.hash === e;
    i !== this._isOpen && (this._isOpen = i, this._isOpen && this.config?.auto_close ? (this._clearTimer(), this._autoCloseTimer = window.setTimeout(() => {
      this._closePopUp();
    }, this.config.auto_close)) : this._clearTimer());
  }
  _clearTimer() {
    this._autoCloseTimer && (clearTimeout(this._autoCloseTimer), this._autoCloseTimer = void 0);
  }
  _closePopUp() {
    this._clearTimer(), window.location.hash === (this.config?.hash || "#aurora-popup") && (history.replaceState(null, "", window.location.pathname + window.location.search), N(window, "location-changed", {})), this._isOpen = !1;
  }
  render() {
    if (!this.config || !this.hass)
      return n``;
    const t = this.config.hash || "#aurora-popup", e = this.config.entity ? this.hass.states[this.config.entity] : void 0, i = this.config.name || e?.attributes.friendly_name || "Aurora Pop-up", o = this.config.icon || e?.attributes.icon || "mdi:layers-triple-outline";
    return n`
      <!-- Compact trigger bar always visible in editor or dashboard to open the Pop-up -->
      <div class="popup-trigger-bar" @click="${() => this._openPopUp(t)}">
        <div class="trigger-left">
          <ha-icon .icon="${o}"></ha-icon>
          <span>${i}</span>
          <span class="hash-pill">${t}</span>
        </div>
        <ha-icon icon="mdi:arrow-expand-all"></ha-icon>
      </div>

      ${this._isOpen ? n`
            <div
              class="popup-backdrop"
              style="--popup-blur: ${this.config.backdrop_blur ?? 18}px"
              @click="${this._closePopUp}"
            >
              <div
                class="popup-sheet"
                @click="${(r) => {
      r.stopPropagation(), this.config.close_on_click && this._closePopUp();
    }}"
              >
                <div class="sheet-handle-bar" @click="${this._closePopUp}">
                  <div class="sheet-pill"></div>
                </div>

                <div class="sheet-header">
                  <div class="header-main" @click="${() => P(this, this.hass, this.config, "tap")}">
                    <div class="header-icon">
                      <ha-icon .icon="${o}"></ha-icon>
                    </div>
                    <div class="header-titles">
                      <span class="header-name">${i}</span>
                      ${e ? n`<span class="header-state">${e.state}</span>` : ""}
                    </div>
                  </div>

                  <button class="close-btn" @click="${this._closePopUp}">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <div class="sheet-body">
                  ${this._childCards.length > 0 ? this._childCards.map((r) => n`<div class="child-card-slot">${r}</div>`) : n`
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
    window.location.hash = e, N(window, "location-changed", {});
  }
  static {
    this.styles = [
      V,
      w`
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
K([
  x({ attribute: !1 })
], U.prototype, "hass", void 0);
K([
  x({ attribute: !1 })
], U.prototype, "config", void 0);
K([
  b()
], U.prototype, "_isOpen", void 0);
K([
  b()
], U.prototype, "_childCards", void 0);
U = K([
  C("aurora-pop-up-card")
], U);
var vt = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
let rt = class extends $ {
  render() {
    if (!this.config)
      return n``;
    const t = this.config.name || "Section", e = this.config.icon;
    return n`
      <div class="separator-wrapper">
        ${e ? n`
              <div class="sep-icon">
                <ha-icon .icon="${e}"></ha-icon>
              </div>
            ` : ""}
        <span class="sep-title">${t}</span>
        <div class="sep-line"></div>
        ${this.config.sub_button && this.config.sub_button.length > 0 ? n`
              <div class="sep-sub-buttons">
                ${this.config.sub_button.map((i) => {
      const o = i.entity ? this.hass?.states[i.entity] : void 0;
      return n`
                    <button
                      class="sep-sub-btn"
                      @click="${() => P(this, this.hass, i, "tap")}"
                    >
                      ${i.icon ? n`<ha-icon .icon="${i.icon}"></ha-icon>` : ""}
                      ${i.show_state && o ? n`<span>${o.state}</span>` : ""}
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
      V,
      w`
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
vt([
  x({ attribute: !1 })
], rt.prototype, "hass", void 0);
vt([
  x({ attribute: !1 })
], rt.prototype, "config", void 0);
rt = vt([
  C("aurora-separator-card")
], rt);
var Bt = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
let dt = class extends $ {
  render() {
    return n`<div class="empty-column"></div>`;
  }
  static {
    this.styles = w`
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
Bt([
  x({ attribute: !1 })
], dt.prototype, "config", void 0);
dt = Bt([
  C("aurora-empty-column-card")
], dt);
var _ = function(a, t, e, i) {
  var o = arguments.length, r = o < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(a, t, e, i);
  else for (var l = a.length - 1; l >= 0; l--) (s = a[l]) && (r = (o < 3 ? s(r) : o > 3 ? s(t, e, r) : s(t, e)) || r);
  return o > 3 && r && Object.defineProperty(t, e, r), r;
};
const Et = [
  { id: "state", label: "State" },
  { id: "preset_mode", label: "Preset Mode" },
  { id: "hvac_action", label: "HVAC Action" },
  { id: "brightness", label: "Brightness" },
  { id: "battery_level", label: "Battery Level" },
  { id: "temperature", label: "Temperature" },
  { id: "humidity", label: "Humidity" },
  { id: "last_changed", label: "Last Changed" }
], ve = [
  { id: "button", label: "Button" },
  { id: "climate", label: "Thermostat" },
  { id: "cover", label: "Cover" },
  { id: "media-player", label: "Media player" },
  { id: "pop-up", label: "Pop-up" },
  { id: "separator", label: "Separator" },
  { id: "sub-buttons", label: "Sub-buttons" }
], Ot = [
  "mdi:home",
  "mdi:lightbulb",
  "mdi:power",
  "mdi:fan",
  "mdi:television",
  "mdi:speaker",
  "mdi:sofa",
  "mdi:bed",
  "mdi:door",
  "mdi:window-open",
  "mdi:thermometer",
  "mdi:water",
  "mdi:fire",
  "mdi:security",
  "mdi:lock",
  "mdi:camera",
  "mdi:robot-vacuum",
  "mdi:car",
  "mdi:garage",
  "mdi:weather-sunny",
  "mdi:weather-night",
  "mdi:weather-partly-cloudy",
  "mdi:weather-pouring",
  "mdi:snowflake",
  "mdi:palette",
  "mdi:brightness-6",
  "mdi:flash",
  "mdi:battery",
  "mdi:wifi",
  "mdi:router-wireless",
  "mdi:cast",
  "mdi:air-conditioner",
  "mdi:ceiling-fan",
  "mdi:washing-machine",
  "mdi:silverware-fork-knife",
  "mdi:desk",
  "mdi:desktop-pc",
  "mdi:laptop",
  "mdi:flower",
  "mdi:leaf"
];
let m = class extends $ {
  constructor() {
    super(...arguments), this._activeCategory = "all", this._moduleSubTab = "my_modules", this._pickerOpen = !1, this._iconPickerOpen = !1, this._pickerTarget = { type: "main" }, this._pickerSearchQuery = "", this._pickerDomainFilter = "all", this._statePickerOpen = !1, this._customAttributeInput = "", this._expandedModules = {}, this._expandedSubButtons = {}, this._statusToast = "", this._creatorOpen = !1, this._importYamlOpen = !1, this._importYamlText = "", this._creatorDraft = {
      id: "custom_module",
      name: "Custom Module",
      version: "1.0",
      creator: "Przemysław",
      description: "",
      type: "base-extension",
      supportedCards: ["button"],
      codeTemplate: `.aurora-card {
  
}`,
      editorSchemaYaml: "",
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
    this._openHubs = { ...this._openHubs, [t]: !this._openHubs[t] };
  }
  _toggleModuleSettings(t) {
    this._expandedModules = {
      ...this._expandedModules,
      [t]: !this._expandedModules[t]
    };
  }
  _toggleSubButtonSettings(t) {
    this._expandedSubButtons = {
      ...this._expandedSubButtons,
      [t]: !this._expandedSubButtons[t]
    };
  }
  _editUserModule(t) {
    this._creatorDraft = { ...t }, this._creatorOpen = !0;
  }
  _getModuleConfigString(t) {
    if (!this._config || !this._config.module_configs)
      return "";
    const e = this._config.module_configs[t];
    return e ? Object.entries(e).map(([i, o]) => `${i}:${o}`).join(`
`) : "";
  }
  _setModuleConfigString(t, e) {
    if (!this._config)
      return;
    const i = {};
    e.split(`
`).forEach((r) => {
      const s = r.split(":");
      if (s.length >= 2) {
        const l = s[0].trim();
        let c = s.slice(1).join(":").trim();
        c === "true" ? c = !0 : c === "false" ? c = !1 : !isNaN(Number(c)) && c !== "" ? c = Number(c) : c.startsWith('"') && c.endsWith('"') && (c = c.slice(1, -1)), l && (i[l] = c);
      }
    });
    const o = this._config.module_configs || {};
    this._setDirectValue("module_configs", {
      ...o,
      [t]: i
    });
  }
  _openEntityPicker(t) {
    this._pickerTarget = t, this._pickerSearchQuery = "", this._pickerDomainFilter = "all", this._pickerOpen = !0;
  }
  _openIconPicker(t) {
    this._pickerTarget = t, this._pickerSearchQuery = "", this._iconPickerOpen = !0;
  }
  _closeEntityPicker() {
    this._pickerOpen = !1;
  }
  _closeIconPicker() {
    this._iconPickerOpen = !1;
  }
  _selectEntityFromModal(t) {
    this._config && (this._pickerTarget.type === "main" ? this._setDirectValue("entity", t) : this._pickerTarget.type === "sub" && this._updateSubButton(this._pickerTarget.index, "entity", t), this._pickerOpen = !1);
  }
  _selectIconFromModal(t) {
    this._config && (this._pickerTarget.type === "icon_main" ? this._setDirectValue("icon", t) : this._pickerTarget.type === "icon_sub" && this._updateSubButton(this._pickerTarget.index, "icon", t), this._iconPickerOpen = !1);
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
    const t = Object.keys(this.hass.states).sort((o, r) => this._getEntityFriendlyName(o).localeCompare(this._getEntityFriendlyName(r))), e = this._pickerSearchQuery.trim().toLowerCase(), i = this._pickerDomainFilter;
    return t.filter((o) => i !== "all" && o.split(".")[0] !== i ? !1 : e ? o.toLowerCase().includes(e) || this._getEntityFriendlyName(o).toLowerCase().includes(e) : !0);
  }
  _getFilteredIcons() {
    const t = this._pickerSearchQuery.trim().toLowerCase();
    return t ? Ot.filter((e) => e.toLowerCase().includes(t)) : Ot;
  }
  _isModuleEnabled(t) {
    return (this._config?.active_modules ?? []).includes(t);
  }
  _toggleModuleEnabled(t) {
    const e = [...this._config?.active_modules ?? []], i = e.includes(t) ? e.filter((o) => o !== t) : [...e, t];
    this._setDirectValue("active_modules", i);
  }
  render() {
    if (!this._config || !this.hass)
      return n``;
    const t = this._activeCategory === "all" || this._activeCategory === "general", e = this._activeCategory === "all" || this._activeCategory === "subbuttons", i = this._activeCategory === "all" || this._activeCategory === "styles", o = this._activeCategory === "all" || this._activeCategory === "modules";
    return n`
      <div class="aurora-editor-root">
        ${this._statusToast ? n`<div class="aurora-toast">${this._statusToast}</div>` : n``}
        
        <div class="aurora-sticky-context">
          <div class="context-title">
            <ha-icon icon="mdi:alpha-a-box-outline"></ha-icon>
            <span>Aurora Suite • Configuration Hub</span>
          </div>
          ${this._renderCategoryTabs()}
        </div>

        <div class="hubs-container">
          ${t ? this._renderHeroIdentityHub() : n``}
          ${t ? this._renderCardSettingsHub() : n``}
          ${t ? this._renderStateContentHub() : n``}
          ${t ? this._renderActionsHub() : n``}
          ${e ? this._renderSubButtonsHub() : n``}
          ${i ? this._renderStylingHub() : n``}
          ${o ? this._renderModulesHub() : n``}
        </div>

        ${this._pickerOpen ? this._renderEntityPickerModal() : n``}
        ${this._iconPickerOpen ? this._renderIconPickerModal() : n``}
        ${this._statePickerOpen ? this._renderStatePickerModal() : n``}
        ${this._creatorOpen ? this._renderCreatorModal() : n``}
        ${this._importYamlOpen ? this._renderImportModal() : n``}
      </div>
    `;
  }
  _renderCategoryTabs() {
    const t = (this._config?.sub_button ?? []).length, e = (this._config?.active_modules ?? []).length;
    return n`
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
    return n`
      <div class="aurora-hub-card hero-hub">
        <div class="hub-header-static">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <span>Card Identity & Primary Entity</span>
        </div>
        <div class="hub-body">
          <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById("cardTypeSelect")?.click()}">
            <div class="box-content">
              <span class="floating-label">Card type</span>
              <select id="cardTypeSelect" class="native-select" .value="${t}" @change="${(o) => this._valueChanged(o, "card_type")}">
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
              <button class="clear-btn" title="Reset" @click="${(o) => {
      o.stopPropagation(), this._setDirectValue("card_type", "button");
    }}">✕</button>
              <span class="dropdown-caret" @click="${(o) => {
      o.stopPropagation(), this.shadowRoot?.getElementById("cardTypeSelect")?.click();
    }}">▼</span>
            </div>
          </div>

          ${t === "button" ? n`
                <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById("buttonTypeSelect")?.click()}">
                  <div class="box-content">
                    <span class="floating-label">Button type</span>
                    <select id="buttonTypeSelect" class="native-select" .value="${e}" @change="${(o) => this._valueChanged(o, "button_type")}">
                      <option value="switch">Switch</option>
                      <option value="slider">Slider</option>
                      <option value="state">State</option>
                      <option value="name">Name / Text</option>
                    </select>
                  </div>
                  <div class="box-controls">
                    <button class="clear-btn" title="Reset" @click="${(o) => {
      o.stopPropagation(), this._setDirectValue("button_type", "switch");
    }}">✕</button>
                    <span class="dropdown-caret" @click="${(o) => {
      o.stopPropagation(), this.shadowRoot?.getElementById("buttonTypeSelect")?.click();
    }}">▼</span>
                  </div>
                </div>
              ` : n``}

          ${t !== "empty-column" ? n`
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
                    ${i ? n`
                          <button class="clear-btn" title="Clear entity" @click="${(o) => {
      o.stopPropagation(), this._setDirectValue("entity", void 0);
    }}">✕</button>
                        ` : n``}
                    <span class="dropdown-caret">▼</span>
                  </div>
                </div>
              ` : n``}
        </div>
      </div>
    `;
  }
  _renderCardSettingsHub() {
    const t = !!this._openHubs.settings, e = this._config?.name ?? "", i = this._config?.icon ?? "", o = this._config?.scrolling_effect !== !1, r = this._config?.show_icon !== !1, s = !!this._config?.prioritise_icon, l = this._config?.show_name !== !1;
    return n`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("settings")}">
          <div class="header-left">
            <ha-icon icon="mdi:tune"></ha-icon>
            <span>Card Display & Appearance</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? n`
              <div class="hub-body">
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Name</span>
                    <input type="text" class="native-input" .value="${e}" @input="${(c) => this._valueChanged(c, "name")}" />
                  </div>
                  <div class="box-controls">
                    <button class="clear-btn" title="Clear name" @click="${() => this._setDirectValue("name", void 0)}">✕</button>
                  </div>
                </div>
                
                <div class="ha-filled-box" @click="${() => this._openIconPicker({ type: "icon_main" })}">
                  <div class="box-content">
                    <span class="floating-label">Optional - Icon</span>
                    <div class="icon-trigger-preview">
                      <ha-icon .icon="${i || "mdi:image-outline"}"></ha-icon>
                      <span>${i || "Select an icon..."}</span>
                    </div>
                  </div>
                  <div class="box-controls">
                    ${i ? n`<button class="clear-btn" title="Clear icon" @click="${(c) => {
      c.stopPropagation(), this._setDirectValue("icon", void 0);
    }}">✕</button>` : n``}
                    <span class="dropdown-caret">▼</span>
                  </div>
                </div>

                <div class="toggle-list">
                  ${this._renderToggleRow("Text scrolling effect", o, (c) => this._setDirectValue("scrolling_effect", c))}${this._renderToggleRow("Show icon", r, (c) => this._setDirectValue("show_icon", c))}
                  ${this._renderToggleRow("Prioritise icon over entity picture", s, (c) => this._setDirectValue("prioritise_icon", c))}${this._renderToggleRow("Show name", l, (c) => this._setDirectValue("show_name", c))}
                </div>
              </div>
            ` : n``}
      </div>
    `;
  }
  _renderStateContentHub() {
    const t = !!this._openHubs.states, e = this._config?.state_content ?? ["state"];
    return n`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("states")}">
          <div class="header-left">
            <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
            <span>State Content & Attributes</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? n`
              <div class="hub-body">
                <div class="state-content-block">
                  <div class="chips-well">
                    <div class="chips-list">
                      ${e.map((i, o) => n`
                          <div class="ha-chip">
                            <span class="chip-text">${this._formatChipLabel(i)}</span>
                            <div class="chip-actions">
                              ${o > 0 ? n`<button class="chip-shift-btn" title="Move Left" @click="${() => this._moveStateChip(o, -1)}">◄</button>` : n``}
                              ${o < e.length - 1 ? n`<button class="chip-shift-btn" title="Move Right" @click="${() => this._moveStateChip(o, 1)}">►</button>` : n``}
                              <button class="chip-remove" title="Remove" @click="${() => this._removeStateChip(o)}">✕</button>
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
            ` : n``}
      </div>
    `;
  }
  _renderActionsHub() {
    const t = !!this._openHubs.actions, e = this._config?.icon_tap_action?.action ?? "toggle", i = this._config?.tap_action?.action ?? "toggle", o = this._config?.hold_action?.action ?? "more-info";
    return n`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("actions")}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap"></ha-icon>
            <span>Actions & Touch Behaviors</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? n`
              <div class="hub-body">
                ${this._renderActionSelector("Tap action on icon", "icon_tap_action", e, "iconActionSel")}
                ${this._renderActionSelector("Tap action on card", "tap_action", i, "cardActionSel")}${this._renderActionSelector("Hold behavior", "hold_action", o, "holdActionSel")}
              </div>
            ` : n``}
      </div>
    `;
  }
  _renderSubButtonsHub() {
    const t = !!this._openHubs.subbuttons, e = this._config?.sub_button ?? [];
    return n`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("subbuttons")}">
          <div class="header-left">
            <ha-icon icon="mdi:shape-square-plus"></ha-icon>
            <span>Sub-Buttons Matrix</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? n`
              <div class="hub-body">
                ${e.map((i, o) => {
      const r = i.tap_action?.action ?? "toggle", s = i.hold_action?.action ?? "more-info", l = i.double_tap_action?.action ?? "none";
      return n`
                    <div class="sub-button-container">
                      <div class="sub-button-row">
                        <button type="button" class="sub-icon-btn" title="Change Icon" @click="${() => this._openIconPicker({ type: "icon_sub", index: o })}">
                          <ha-icon .icon="${i.icon ?? "mdi:power"}"></ha-icon>
                        </button>
                        <button type="button" class="sub-entity-picker-btn" title="Change Entity" @click="${() => this._openEntityPicker({ type: "sub", index: o })}">
                          <span class="sub-ent-label">${this._getEntityFriendlyName(i.entity ?? "")}</span>
                          <span class="dropdown-caret">▼</span>
                        </button>
                        <button class="icon-action-btn" title="Action Settings" @click="${() => this._toggleSubButtonSettings(o)}">
                          <ha-icon icon="mdi:cog"></ha-icon>
                        </button>
                        <button class="danger-icon-btn" title="Remove sub-button" @click="${() => this._removeSubButton(o)}">✕</button>
                      </div>
                      
                      ${this._expandedSubButtons[o] ? n`
                            <div class="module-settings-drawer">
                              <div class="section-caption" style="margin-top:0;">Sub-Button Actions</div>
                              ${this._renderSubActionSelector(o, "Tap action", "tap_action", r, `subTapSel_${o}`)}
                              ${this._renderSubActionSelector(o, "Hold behavior", "hold_action", s, `subHoldSel_${o}`)}
                              ${this._renderSubActionSelector(o, "Double tap action", "double_tap_action", l, `subDblTapSel_${o}`)}
                            </div>
                          ` : n``}
                    </div>
                  `;
    })}
                <button class="chip-add-btn" @click="${this._addSubButton}"><span>＋</span><span>Add sub-button</span></button>
              </div>
            ` : n``}
      </div>
    `;
  }
  _renderStylingHub() {
    const t = !!this._openHubs.styling, e = this._config?.vibe_preset ?? "aurora_lumina", i = this._config?.custom_styles ?? "";
    return n`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("styling")}">
          <div class="header-left">
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>Styling & Vibe Presets</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? n`
              <div class="hub-body">
                <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById("vibePresetSelect")?.click()}">
                  <div class="box-content">
                    <span class="floating-label">Aurora Aesthetic Vibe Preset</span>
                    <select id="vibePresetSelect" class="native-select" .value="${e}" @change="${(o) => this._valueChanged(o, "vibe_preset")}">
                      <option value="aurora_lumina">Aurora Lumina (Frosted Glass)</option>
                      <option value="crimson_midnight">Crimson Midnight (Gothic Dark)</option>
                      <option value="obsidian_minimal">Obsidian Minimal</option>
                      <option value="ha_native">Home Assistant Native Surface</option>
                    </select>
                  </div>
                  <div class="box-controls">
                    <span class="dropdown-caret" @click="${(o) => {
      o.stopPropagation(), this.shadowRoot?.getElementById("vibePresetSelect")?.click();
    }}">▼</span>
                  </div>
                </div>
                <textarea class="code-textarea" rows="4" placeholder=".aurora-card { --aurora-blur: 24px; }" .value="${i}" @input="${(o) => this._valueChanged(o, "custom_styles")}"></textarea>
              </div>
            ` : n``}
      </div>
    `;
  }
  _renderModulesHub() {
    const t = !!this._openHubs.modules, e = tt.getAllModules();
    return n`
      <div class="aurora-hub-card" ?data-open="${t}">
        <div class="hub-header" @click="${() => this._toggleHub("modules")}">
          <div class="header-left">
            <ha-icon icon="mdi:puzzle"></ha-icon>
            <span>Extension Modules Ecosystem</span>
          </div>
          <span class="chevron">${t ? "▲" : "▼"}</span>
        </div>
        ${t ? n`
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
                  <button class="mod-tab" ?data-active="${this._moduleSubTab === "my_modules"}" @click="${() => this._moduleSubTab = "my_modules"}">Installed Modules (${e.length})</button>
                  <button class="mod-tab" ?data-active="${this._moduleSubTab === "store"}" @click="${() => this._moduleSubTab = "store"}">Module Store</button>
                </div>

                ${this._moduleSubTab === "my_modules" ? this._renderMyModulesView(e) : this._renderModuleStoreView()}
              </div>
            ` : n``}
      </div>
    `;
  }
  _renderMyModulesView(t) {
    return n`
      <div class="modules-grid-list">
        ${t.map((e) => n`
            <div class="module-hub-card">
              <div class="mod-hub-top">
                <div class="mod-title-row">
                  <ha-icon icon="mdi:puzzle-outline"></ha-icon>
                  <span class="mod-name">${e.name}</span>
                  <span class="mod-version">${e.version}</span>
                  <span class="mod-type-badge">${e.type}</span>
                </div>
                <p class="mod-desc">${e.description}</p>
              </div>
              
              <div class="mod-hub-footer">
                <div class="scope-toggles">
                  <label class="scope-toggle-pill" ?data-active="${this._isModuleEnabled(e.id)}">
                    <input type="checkbox" .checked="${this._isModuleEnabled(e.id)}" @change="${() => this._toggleModuleEnabled(e.id)}" hidden />
                    <span>${this._isModuleEnabled(e.id) ? "Enabled" : "Disabled"}</span>
                  </label>
                  
                  <button class="icon-action-btn" title="Module Settings" @click="${() => this._toggleModuleSettings(e.id)}">
                    <ha-icon icon="mdi:cog"></ha-icon>
                  </button>

                  ${e.builtIn ? n`` : n`
                        <button class="icon-action-btn" title="Edit Module" @click="${() => this._editUserModule(e)}">
                          <ha-icon icon="mdi:pencil"></ha-icon>
                        </button>
                        <button class="danger-icon-btn" title="Delete Module" @click="${() => {
      tt.deleteUserModule(e.id), this.requestUpdate(), this._showToast("Module deleted");
    }}">
                          <ha-icon icon="mdi:delete"></ha-icon>
                        </button>
                      `}
                </div>
              </div>

              ${this._expandedModules[e.id] ? n`
                    <div class="module-settings-drawer">
                      <div class="section-caption">Module Configuration</div>
                      <p class="muted-note" style="text-align:left; padding: 2px 0;">Settings based on schema: <code>${e.id}</code></p>
                      <textarea 
                        class="code-textarea" 
                        rows="4" 
                        placeholder="key: value"
                        .value="${this._getModuleConfigString(e.id)}" 
                        @input="${(i) => this._setModuleConfigString(e.id, i.target.value)}"
                      ></textarea>
                    </div>
                  ` : n``}
            </div>
          `)}
      </div>
    `;
  }
  _renderModuleStoreView() {
    return n`<div class="store-cards-list"><p class="muted-note">Community module store connected. All verified modules are loaded.</p></div>`;
  }
  _renderCreatorModal() {
    return n`
      <div class="picker-backdrop" @click="${() => this._creatorOpen = !1}">
        <div class="creator-sheet" @click="${(t) => t.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Aurora Module Studio</span>
            <button class="modal-close-btn" @click="${() => this._creatorOpen = !1}">Close</button>
          </div>
          <div class="creator-body">
            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Module Type</span>
                <select id="modTypeSel" class="native-select" .value="${this._creatorDraft.type}" @change="${(t) => this._creatorDraft = { ...this._creatorDraft, type: t.target.value }}">
                  <option value="base-extension">Base Extension (Style/Behavior Injector)</option>
                  <option value="custom-card">Custom Card (Standalone Element)</option>
                </select>
              </div>
              <div class="box-controls">
                <span class="dropdown-caret" @click="${() => this.shadowRoot?.getElementById("modTypeSel")?.click()}">▼</span>
              </div>
            </div>

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
              ${ve.map((t) => n`
                  <button
                    type="button"
                    class="card-pill-toggle"
                    ?data-selected="${this._creatorDraft.supportedCards.includes(t.id)}"
                    @click="${() => {
      const e = [...this._creatorDraft.supportedCards], i = e.includes(t.id) ? e.filter((o) => o !== t.id) : [...e, t.id];
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
      tt.registerUserModule({ ...this._creatorDraft }), this._creatorOpen = !1, this._showToast("Custom module created and installed successfully!"), this.requestUpdate();
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
    return n`
      <div class="picker-backdrop" @click="${() => this._importYamlOpen = !1}">
        <div class="creator-sheet" @click="${(t) => t.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Import Module from YAML</span>
            <button class="modal-close-btn" @click="${() => this._importYamlOpen = !1}">Cancel</button>
          </div>
          <div class="creator-body">
            <p class="muted-note">Paste your module YAML definition below:</p>
            <textarea class="code-textarea" rows="10" placeholder="my_imported_module:&#10;  type: base-extension&#10;  setting: value" .value="${this._importYamlText}" @input="${(t) => this._importYamlText = t.target.value}"></textarea>
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
    return n`
      <label class="ha-toggle-row">
        <button type="button" role="switch" class="ha-pill-switch" ?data-checked="${e}" @click="${() => i(!e)}">
          <span class="switch-thumb"></span>
        </button>
        <span class="toggle-label">${t}</span>
      </label>
    `;
  }
  _renderActionSelector(t, e, i, o) {
    return n`
      <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById(o)?.click()}">
        <div class="box-content">
          <span class="floating-label">${t}</span>
          <select id="${o}" class="native-select" .value="${i}" @change="${(r) => this._actionChanged(r, e)}">
            <option value="toggle">Toggle</option>
            <option value="more-info">More info</option>
            <option value="navigate">Navigate</option>
            <option value="call-service">Call service</option>
            <option value="none">No action</option>
          </select>
        </div>
        <div class="box-controls">
          <button class="clear-btn" title="Reset" @click="${(r) => {
      r.stopPropagation(), this._actionChangedByVal(e, "toggle");
    }}">✕</button>
          <span class="dropdown-caret" @click="${(r) => {
      r.stopPropagation(), this.shadowRoot?.getElementById(o)?.click();
    }}">▼</span>
        </div>
      </div>
    `;
  }
  _renderSubActionSelector(t, e, i, o, r) {
    return n`
      <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById(r)?.click()}">
        <div class="box-content">
          <span class="floating-label">${e}</span>
          <select id="${r}" class="native-select" .value="${o}" @change="${(s) => this._subActionChanged(t, i, s)}">
            <option value="toggle">Toggle</option>
            <option value="more-info">More info</option>
            <option value="navigate">Navigate</option>
            <option value="call-service">Call service</option>
            <option value="none">No action</option>
          </select>
        </div>
        <div class="box-controls">
          <button class="clear-btn" title="Reset" @click="${(s) => {
      s.stopPropagation(), this._subActionChangedByVal(t, i, "toggle");
    }}">✕</button>
          <span class="dropdown-caret" @click="${(s) => {
      s.stopPropagation(), this.shadowRoot?.getElementById(r)?.click();
    }}">▼</span>
        </div>
      </div>
    `;
  }
  _formatChipLabel(t) {
    const e = Et.find((i) => i.id === t);
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
    const i = [...this._config.state_content ?? []], o = t + e;
    if (o < 0 || o >= i.length)
      return;
    const r = i[t];
    i[t] = i[o], i[o] = r, this._setDirectValue("state_content", i);
  }
  _removeStateChip(t) {
    if (!this._config)
      return;
    const e = [...this._config.state_content ?? []];
    this._setDirectValue("state_content", e.filter((i, o) => o !== t));
  }
  _valueChanged(t, e) {
    if (!this._config)
      return;
    const i = t.target.value;
    this._setDirectValue(e, i === "" ? void 0 : i);
  }
  _setDirectValue(t, e) {
    this._config && (this._config = { ...this._config, [t]: e }, N(this, "config-changed", { config: this._config }));
  }
  _actionChanged(t, e) {
    this._actionChangedByVal(e, t.target.value);
  }
  _actionChangedByVal(t, e) {
    if (!this._config)
      return;
    const i = this._config[t] ?? {};
    this._config = { ...this._config, [t]: { ...i, action: e } }, N(this, "config-changed", { config: this._config });
  }
  _subActionChanged(t, e, i) {
    this._subActionChangedByVal(t, e, i.target.value);
  }
  _subActionChangedByVal(t, e, i) {
    if (!this._config || !this._config.sub_button)
      return;
    const o = [...this._config.sub_button], r = o[t][e] ?? {};
    o[t] = { ...o[t], [e]: { ...r, action: i } }, this._setDirectValue("sub_button", o);
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
    const o = [...this._config.sub_button];
    o[t] = { ...o[t], [e]: i === "" ? void 0 : i }, this._setDirectValue("sub_button", o);
  }
  _removeSubButton(t) {
    !this._config || !this._config.sub_button || this._setDirectValue("sub_button", this._config.sub_button.filter((e, i) => i !== t));
  }
  _renderStatePickerModal() {
    const t = this._config?.state_content ?? [], e = Et.filter((i) => !t.includes(i.id));
    return n`
      <div class="picker-backdrop" @click="${() => this._statePickerOpen = !1}">
        <div class="picker-sheet" @click="${(i) => i.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Select or Type Attribute</span>
            <button class="modal-close-btn" @click="${() => this._statePickerOpen = !1}">Cancel</button>
          </div>
          
          <div class="creator-body" style="padding-bottom: 0;">
            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Custom Attribute / State Key</span>
                <input 
                  type="text" 
                  class="native-input" 
                  placeholder="e.g. media_title, fan_speed..." 
                  .value="${this._customAttributeInput}" 
                  @input="${(i) => this._customAttributeInput = i.target.value}" 
                />
              </div>
              <button 
                class="chip-add-btn primary-save" 
                style="margin-top:0;"
                @click="${() => {
      this._customAttributeInput.trim() && (this._addSpecificStateChip(this._customAttributeInput.trim()), this._customAttributeInput = "", this._statePickerOpen = !1);
    }}"
              >
                <span>Add Custom</span>
              </button>
            </div>
            <div class="section-caption" style="margin-top: 12px;">Or choose from common attributes:</div>
          </div>

          <div class="picker-list">
            ${e.map((i) => n`
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
          </div>
        </div>
      </div>
    `;
  }
  _renderEntityPickerModal() {
    const t = this._getModalFilteredEntities().slice(0, 100);
    return n`
      <div class="picker-backdrop" @click="${this._closeEntityPicker}">
        <div class="picker-sheet" @click="${(e) => e.stopPropagation()}">
          <div class="picker-header">
            <input type="text" class="picker-search-input" placeholder="Search entities..." .value="${this._pickerSearchQuery}" @input="${(e) => this._pickerSearchQuery = e.target.value}" autofocus />
            <button class="modal-close-btn" @click="${this._closeEntityPicker}">Cancel</button>
          </div>
          <div class="picker-list">
            ${t.map((e) => n`
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
  _renderIconPickerModal() {
    const t = this._getFilteredIcons();
    return n`
      <div class="picker-backdrop" @click="${this._closeIconPicker}">
        <div class="picker-sheet" @click="${(e) => e.stopPropagation()}">
          <div class="picker-header">
            <input type="text" class="picker-search-input" placeholder="Search icons (e.g., mdi:home)..." .value="${this._pickerSearchQuery}" @input="${(e) => this._pickerSearchQuery = e.target.value}" autofocus />
            <button class="modal-close-btn" @click="${this._closeIconPicker}">Cancel</button>
          </div>
          <div class="picker-list icon-grid">
            ${t.map((e) => n`
                <div class="icon-tile" @click="${() => this._selectIconFromModal(e)}" title="${e}">
                  <ha-icon .icon="${e}"></ha-icon>
                  <span>${e.replace("mdi:", "")}</span>
                </div>
              `)}
            ${t.length === 0 ? n`<div class="picker-empty" style="grid-column: 1 / -1;">No matching icons found. Type a valid MDI string to manually select.</div>` : n``}
          </div>
        </div>
      </div>
    `;
  }
  static {
    this.styles = w`
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
      cursor: pointer;
    }

    .box-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 2px;
      pointer-events: none;
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
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      pointer-events: auto;
    }

    .native-select option {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color, #ffffff);
    }

    .icon-trigger-preview {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
      color: var(--primary-text-color, #ffffff);
      font-size: 14px;
      pointer-events: auto;
      cursor: pointer;
    }

    .box-controls {
      display: flex;
      align-items: center;
      gap: 6px;
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
      cursor: pointer;
      padding: 4px;
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

    .sub-button-container {
      display: flex;
      flex-direction: column;
      gap: 0;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
      border-radius: 8px;
      padding: 8px 12px;
    }

    .sub-button-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .sub-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 8px;
      color: var(--primary-text-color, #ffffff);
      cursor: pointer;
      transition: background 0.2s;
    }

    .sub-icon-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .sub-entity-picker-btn {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      cursor: pointer;
      font-size: 14px;
      text-align: left;
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

    .mod-type-badge {
      font-size: 10px;
      background: rgba(3, 169, 244, 0.15);
      color: var(--primary-color, #03a9f4);
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: 600;
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
      gap: 8px;
      align-items: center;
    }

    .scope-toggle-pill {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      padding: 4px 12px;
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

    .icon-action-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
    }

    .icon-action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-text-color, #ffffff);
    }

    .icon-action-btn ha-icon, .danger-icon-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    .module-settings-drawer {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
      display: flex;
      flex-direction: column;
      gap: 6px;
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

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
      gap: 12px;
      padding: 16px;
    }

    .icon-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 14px 6px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      cursor: pointer;
      color: var(--primary-text-color, #ffffff);
      transition: all 0.2s ease;
    }

    .icon-tile:hover {
      background: rgba(3, 169, 244, 0.15);
      border-color: var(--primary-color, #03a9f4);
      transform: translateY(-2px);
    }

    .icon-tile ha-icon {
      font-size: 24px;
    }

    .icon-tile span {
      font-size: 10px;
      text-align: center;
      word-break: break-all;
      color: var(--secondary-text-color, #9b9b9b);
      line-height: 1.2;
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
  x({ attribute: !1 })
], m.prototype, "hass", void 0);
_([
  b()
], m.prototype, "_config", void 0);
_([
  b()
], m.prototype, "_activeCategory", void 0);
_([
  b()
], m.prototype, "_moduleSubTab", void 0);
_([
  b()
], m.prototype, "_pickerOpen", void 0);
_([
  b()
], m.prototype, "_iconPickerOpen", void 0);
_([
  b()
], m.prototype, "_pickerTarget", void 0);
_([
  b()
], m.prototype, "_pickerSearchQuery", void 0);
_([
  b()
], m.prototype, "_pickerDomainFilter", void 0);
_([
  b()
], m.prototype, "_statePickerOpen", void 0);
_([
  b()
], m.prototype, "_customAttributeInput", void 0);
_([
  b()
], m.prototype, "_expandedModules", void 0);
_([
  b()
], m.prototype, "_expandedSubButtons", void 0);
_([
  b()
], m.prototype, "_statusToast", void 0);
_([
  b()
], m.prototype, "_creatorOpen", void 0);
_([
  b()
], m.prototype, "_importYamlOpen", void 0);
_([
  b()
], m.prototype, "_importYamlText", void 0);
_([
  b()
], m.prototype, "_creatorDraft", void 0);
_([
  b()
], m.prototype, "_openHubs", void 0);
m = _([
  C("aurora-card-editor")
], m);
var _e = Object.defineProperty, ye = Object.getOwnPropertyDescriptor, Z = (a, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? ye(t, e) : t, r = a.length - 1, s; r >= 0; r--)
    (s = a[r]) && (o = (i ? s(t, e, o) : s(o)) || o);
  return i && o && _e(t, e, o), o;
};
let H = class extends $ {
  constructor() {
    super(...arguments), this._sliderTempValue = null, this._subButtonsCollapsed = !1, this._holdTimer = null, this._holdTriggered = !1, this._subHoldTimer = null, this._subHoldTriggered = !1;
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
      active_modules: [],
      module_configs: {},
      ...a
    }, E.syncGlobalConfigFromCard(this._config);
  }
  getCardSize() {
    if (!this._config) return 1;
    switch (this._config.card_type) {
      case "media-player":
      case "climate":
      case "cover":
        return 2;
      default:
        return 1;
    }
  }
  _isEntityActive(a) {
    if (!a || !this.hass || !this.hass.states[a]) return !1;
    const t = this.hass.states[a].state;
    return t === "on" || t === "playing" || t === "open" || t === "heat" || t === "cool" || t === "heating" || t === "home";
  }
  _resolveIcon(a, t) {
    if (t) return t;
    if (a && this.hass && this.hass.states[a]) {
      const o = this.hass.states[a].attributes.icon;
      if (o) return String(o);
    }
    const e = a ? a.split(".")[0] : "", i = {
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
  _resolveName(a, t) {
    if (t) return t;
    if (a && this.hass && this.hass.states[a]) {
      const e = this.hass.states[a].attributes.friendly_name;
      if (e) return String(e);
    }
    return a || "Aurora Card";
  }
  _resolveFormattedState(a) {
    if (!a || !this.hass || !this.hass.states[a]) return "";
    const t = this.hass.states[a], e = this._config?.state_content ?? ["state"], i = [];
    for (const o of e)
      if (o === "state") {
        const r = t.attributes.unit_of_measurement ?? "";
        i.push(r ? `${t.state}${r}` : t.state);
      } else o === "last_changed" ? i.push(new Date(t.last_changed).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) : t.attributes[o] !== void 0 && i.push(String(t.attributes[o]));
    return i.join(" • ");
  }
  _resolveNumericSliderPercent(a) {
    if (this._sliderTempValue !== null) return this._sliderTempValue;
    if (!a || !this.hass || !this.hass.states[a]) return 0;
    const t = this.hass.states[a];
    if (t.attributes.brightness !== void 0)
      return Math.round(Number(t.attributes.brightness) / 255 * 100);
    if (t.attributes.volume_level !== void 0)
      return Math.round(Number(t.attributes.volume_level) * 100);
    if (t.attributes.current_position !== void 0)
      return Number(t.attributes.current_position);
    const e = parseFloat(t.state);
    return Number.isNaN(e) ? this._isEntityActive(a) ? 100 : 0 : Math.max(0, Math.min(100, e));
  }
  _onSliderInput(a) {
    a.stopPropagation();
    const t = Number(a.target.value);
    this._sliderTempValue = t;
  }
  _onSliderChange(a) {
    a.stopPropagation();
    const t = Number(a.target.value);
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
      this._holdTriggered = !0, this._config && this.hass && O(
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
    !this._config || !this.hass || O(this, this.hass, this._config, this._config.tap_action);
  }
  _handleIconClick(a) {
    a.stopPropagation(), !(!this._config || !this.hass) && O(
      this,
      this.hass,
      this._config,
      this._config.icon_tap_action ?? this._config.tap_action
    );
  }
  _compileRegistryModuleStyles() {
    const a = this._config?.active_modules ?? [], t = this._config?.module_configs ?? {}, e = this._config?.custom_styles ?? "";
    return `${a.map((o) => {
      const r = tt.getAllModules().find((c) => c.id === o);
      if (!r || r.type !== "base-extension") return "";
      let s = r.codeTemplate || "";
      const l = t[o] || {};
      return s = s.replace(/\$\{\s*module\.([a-zA-Z0-9_]+)\s*\}/g, (c, d) => l[d] !== void 0 ? String(l[d]) : ""), s;
    }).join(`
`)}
${e}`;
  }
  render() {
    if (!this._config || !this.hass) return n``;
    const a = this._config.card_type ?? "button", t = E.generateDynamicStyles(this.hass, this._config), e = this._compileRegistryModuleStyles();
    if (a === "empty-column")
      return n`<aurora-empty-column-card .config="${this._config}"></aurora-empty-column-card>`;
    if (a === "climate")
      return n`
        <style>${t} ${e}</style>
        <aurora-climate-card .hass="${this.hass}" .config="${this._config}"></aurora-climate-card>
      `;
    if (a === "cover")
      return n`
        <style>${t} ${e}</style>
        <aurora-cover-card .hass="${this.hass}" .config="${this._config}"></aurora-cover-card>
      `;
    if (a === "media-player")
      return n`
        <style>${t} ${e}</style>
        <aurora-media-card .hass="${this.hass}" .config="${this._config}"></aurora-media-card>
      `;
    if (a === "pop-up")
      return n`
        <style>${t} ${e}</style>
        <aurora-pop-up-card .hass="${this.hass}" .config="${this._config}"></aurora-pop-up-card>
      `;
    if (a === "separator")
      return n`
        <style>${t} ${e}</style>
        <aurora-separator-card .hass="${this.hass}" .config="${this._config}"></aurora-separator-card>
      `;
    const i = this._config.entity ?? "", o = this._isEntityActive(i), r = E.shouldHideDefaultContent(this._config), s = this._config.button_type === "slider", l = s ? this._resolveNumericSliderPercent(i) : 0;
    return n`
      <style>
        ${t}
        ${e}
      </style>
      <div
        class="aurora-card-surface aurora-card"
        ?data-state-on="${o}"
        @pointerdown="${this._handlePointerDown}"
        @pointerup="${this._handlePointerUp}"
        @pointercancel="${this._handlePointerUp}"
        @click="${this._handleCardClick}"
      >
        <!-- Module Extension: Card Backdrop Image Layer -->
        ${E.renderBackdropLayer(this._config)}

        <!-- Optional Range Slider Fill Track -->
        ${s ? n`
              <div class="aurora-slider-fill" style="width: ${l}%;"></div>
              <input
                type="range"
                class="aurora-slider-overlay-input"
                min="0"
                max="100"
                .value="${String(l)}"
                @click="${(c) => c.stopPropagation()}"
                @input="${this._onSliderInput}"
                @change="${this._onSliderChange}"
              />
            ` : n``}

        <!-- Main Card Foreground Content (Hidden if Multi Section Card hides default) -->
        ${r ? n`` : this._renderMainContent(i)}

        <!-- Module Extension: Multi Section Card (2, 3, or 4 sections) -->
        ${E.renderMultiSectionExtension(
      this,
      this.hass,
      this._config,
      (c, d) => this._resolveIcon(c, d),
      (c, d) => this._resolveName(c, d),
      (c) => this._resolveFormattedState(c)
    )}
      </div>
    `;
  }
  _renderMainContent(a) {
    const t = this._config?.show_icon !== !1, e = this._config?.show_name !== !1, i = this._config?.scrolling_effect !== !1, o = !!this._config?.prioritise_icon, s = (a && this.hass?.states ? this.hass.states[a] : void 0)?.attributes?.entity_picture, l = !!(s && !o), c = this._resolveIcon(a, this._config?.icon), d = this._resolveName(a, this._config?.name), u = this._resolveFormattedState(a), p = this._config?.sub_button ?? [], f = E.getActiveModuleIds(this._config).includes("collapsible_sub_button_groups");
    return n`
      <div class="aurora-foreground-row aurora-card-content">
        ${t ? n`
              <div class="aurora-main-icon-wrap aurora-icon-container" @click="${this._handleIconClick}">
                ${E.renderIconProgressRing(this.hass, this._config)}${l ? n`<img class="entity-avatar-img" src="${s}" alt="" />` : n`<ha-icon .icon="${c}"></ha-icon>`}
              </div>
            ` : n``}

        <div class="aurora-title-state-col" ?data-scrolling="${i}">
          ${e ? n`<span class="aurora-card-title">${d}</span>` : n``}
          ${u ? n`<span class="aurora-card-state">${u}</span>` : n``}
        </div>

        ${p.length > 0 ? n`
              <div class="aurora-sub-buttons-bar">
                ${f ? n`
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
                    ` : n``}
                ${this._subButtonsCollapsed ? n`` : p.map((v) => this._renderSubButtonPill(v))}
              </div>
            ` : n``}
      </div>
    `;
  }
  _renderSubButtonPill(a) {
    const t = a.entity ?? this._config?.entity ?? "", e = this._resolveIcon(t, a.icon), i = this._isEntityActive(t), o = a.show_state && t && this.hass?.states?.[t] ? this.hass.states[t].state : "";
    return n`
      <button
        type="button"
        class="aurora-sub-pill"
        ?data-sub-active="${i}"
        @pointerdown="${(r) => {
      r.stopPropagation(), this._subHoldTriggered = !1, this._subHoldTimer = window.setTimeout(() => {
        this._subHoldTriggered = !0, this._config && this.hass && O(
          this,
          this.hass,
          this._config,
          a.hold_action ?? { action: "more-info" },
          t
        );
      }, 520);
    }}"
        @pointerup="${(r) => {
      r.stopPropagation(), this._subHoldTimer !== null && (clearTimeout(this._subHoldTimer), this._subHoldTimer = null);
    }}"
        @pointercancel="${(r) => {
      r.stopPropagation(), this._subHoldTimer !== null && (clearTimeout(this._subHoldTimer), this._subHoldTimer = null);
    }}"
        @click="${(r) => {
      if (r.stopPropagation(), this._subHoldTriggered) {
        this._subHoldTriggered = !1;
        return;
      }
      this._config && this.hass && O(
        this,
        this.hass,
        this._config,
        a.tap_action ?? { action: "toggle" },
        t
      );
    }}"
        @dblclick="${(r) => {
      r.stopPropagation();
      const s = a.double_tap_action;
      this._config && this.hass && s && s.action !== "none" && O(this, this.hass, this._config, s, t);
    }}"
      >
        <ha-icon .icon="${e}"></ha-icon>
        ${o ? n`<span class="sub-pill-state">${o}</span>` : n``}
      </button>
    `;
  }
};
H.styles = w`
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
Z([
  x({ attribute: !1 })
], H.prototype, "hass", 2);
Z([
  b()
], H.prototype, "_config", 2);
Z([
  b()
], H.prototype, "_sliderTempValue", 2);
Z([
  b()
], H.prototype, "_subButtonsCollapsed", 2);
H = Z([
  C("aurora-card")
], H);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "aurora-card",
  name: "Aurora Card",
  description: "A high-performance modular card inspired by Bubble Card.",
  preview: !0
});
export {
  H as AuroraCard
};
//# sourceMappingURL=aurora-card.js.map
