(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function formatPrice(price) {
    if (price == null) return "Preț la cerere";
    return price.toLocaleString("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " lei";
  }

  function whatsappUrl(text) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text);
  }

  function mailtoUrl(subject, body) {
    return "mailto:" + cfg.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function directionsUrl(loc) {
    if (loc.mapsUrl) return loc.mapsUrl;
    var dest = loc.lat != null ? loc.lat + "," + loc.lng : loc.address;
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(dest);
  }

  /* ---------- Date firmă în pagină ---------- */
  function applyConfig() {
    document.querySelectorAll("[data-config]").forEach(function (el) {
      var val = get(cfg, el.getAttribute("data-config"));
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-if-config]").forEach(function (el) {
      if (!get(cfg, el.getAttribute("data-if-config"))) el.hidden = true;
    });
    document.querySelectorAll("[data-unless-config]").forEach(function (el) {
      if (get(cfg, el.getAttribute("data-unless-config"))) el.hidden = true;
    });
    document.querySelectorAll("[data-href]").forEach(function (el) {
      var kind = el.getAttribute("data-href");
      if (kind === "email") el.href = "mailto:" + cfg.email;
      else if (kind === "whatsapp") el.href = "https://wa.me/" + cfg.whatsapp;
      else if (kind === "map") el.href = directionsUrl(cfg.shop || {});
      else {
        var url = get(cfg, kind);
        if (url) el.href = url;
      }
    });
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Meniu mobil ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Imagini generice pentru produse ---------- */
  var ICONS = {
    specialitate: '<path d="M14 26h28v14a10 10 0 0 1-10 10h-8a10 10 0 0 1-10-10z"/><path d="M42 30h4a5 5 0 0 1 0 10h-4"/><path d="M22 12c0 3 3 3 3 6M30 12c0 3 3 3 3 6"/>',
    boabe: '<ellipse cx="25" cy="34" rx="10" ry="14" transform="rotate(-30 25 34)"/><path d="M19 23c5 5 7 15 12 22"/><ellipse cx="42" cy="26" rx="8" ry="11" transform="rotate(25 42 26)"/><path d="M37 17c5 5 4 13 9 18"/>',
    cafea: '<path d="M14 26h28v14a10 10 0 0 1-10 10h-8a10 10 0 0 1-10-10z"/><path d="M42 30h4a5 5 0 0 1 0 10h-4"/><path d="M22 12c0 3 3 3 3 6M30 12c0 3 3 3 3 6"/>',
    capsule: '<path d="M18 22h28l-4 24H22z"/><ellipse cx="32" cy="22" rx="16" ry="4"/>',
    ceai: '<path d="M14 24h30v12a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z"/><path d="M44 28h3a5 5 0 0 1 0 10h-3"/><path d="M28 24v-8l6 4"/>',
    snacks: '<rect x="14" y="20" width="36" height="22" rx="4"/><path d="M14 26h36M22 20v22M42 20v22"/>',
    accesorii: '<path d="M20 16h24l-3 34H23z"/><path d="M18 16h28"/><path d="M22 26h20"/>',
  };

  function productImage(p) {
    if (p.image) {
      return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">';
    }
    var icon = ICONS[p.category] || ICONS.cafea;
    return '<svg class="placeholder" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + icon + "</svg>";
  }

  /* ---------- Magazin ---------- */
  function productUnits(p) {
    return p.variants ? p.variants.map(function (v) { return v.unit; }).join(" / ") : p.unit;
  }

  function cardPrice(p) {
    return formatPrice(p.variants ? p.variants[0].price : p.price);
  }

  // grind = "" pentru boabe, altfel metoda de preparare pentru care se macină
  function itemPrice(p, variantIdx, grind) {
    if (!p.variants) return p.price;
    var v = p.variants[variantIdx] || p.variants[0];
    return grind && v.priceGround != null ? v.priceGround : v.price;
  }

  function itemUnit(p, variantIdx) {
    return p.variants ? (p.variants[variantIdx] || p.variants[0]).unit : p.unit;
  }

  function grindLabel(grind) {
    return grind ? "măcinată pentru " + grind : "boabe";
  }

  /* ---------- Coș ---------- */
  var CART_KEY = "cs-cart";

  function loadCart() {
    try {
      var data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  var cart = loadCart();

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* fără stocare: coșul ține până la reîncărcarea paginii */
    }
    updateCartBadges();
  }

  function cartLines() {
    var products = window.PRODUCTS || [];
    return cart
      .map(function (it) {
        var p = products.find(function (x) { return x.id === it.id; });
        if (!p) return null;
        var price = itemPrice(p, it.v, it.g);
        return { item: it, product: p, unit: itemUnit(p, it.v), price: price, total: price == null ? null : price * it.q };
      })
      .filter(Boolean);
  }

  function cartCount() {
    return cart.reduce(function (n, it) { return n + it.q; }, 0);
  }

  function addToCart(id, v, g, q) {
    var found = cart.find(function (it) { return it.id === id && it.v === v && it.g === g; });
    if (found) found.q += q;
    else cart.push({ id: id, v: v, g: g, q: q });
    saveCart();
  }

  function updateCartBadges() {
    var n = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  function cartTotals() {
    var lines = cartLines();
    var sub = 0;
    var unknown = false;
    lines.forEach(function (l) {
      if (l.total == null) unknown = true;
      else sub += l.total;
    });
    var d = cfg.delivery || {};
    var ship = d.cost == null ? null : d.freeFrom != null && sub >= d.freeFrom ? 0 : d.cost;
    return { lines: lines, sub: sub, unknown: unknown, ship: ship, total: sub + (ship || 0) };
  }

  function shippingLabel(t) {
    if (t.ship == null) return "se comunică la confirmare";
    return t.ship === 0 ? "gratuit" : formatPrice(t.ship);
  }

  function newOrderId() {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return "CS-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + (1000 + Math.floor(Math.random() * 9000));
  }

  function orderLinesText(t) {
    return t.lines
      .map(function (l) {
        return "• " + l.item.q + " x " + l.product.name + " (" + l.unit + (l.product.grinds ? ", " + grindLabel(l.item.g) : "") + ") – " + formatPrice(l.total);
      })
      .join("\n");
  }

  function field(form, k) {
    var el = form.elements[k];
    return el ? el.value.trim() : "";
  }

  function orderText(form, orderId, t) {
    var text = "Bună ziua! Comanda " + orderId + ":\n" + orderLinesText(t) + "\n\n";
    text += "Produse: " + formatPrice(t.sub) + (t.unknown ? " + produse cu preț la cerere" : "") + "\n";
    text += "Transport: " + shippingLabel(t) + "\n";
    text += "Total: " + formatPrice(t.total) + (t.ship == null ? " + transport" : "") + "\n";
    [["nume", "Nume"], ["telefon", "Telefon"], ["email", "Email"], ["adresa", "Adresă livrare"], ["observatii", "Observații"]].forEach(function (f) {
      var v = field(form, f[0]);
      if (v) text += "\n" + f[1] + ": " + v;
    });
    text += "\n\nAm citit și sunt de acord cu Termenii și condițiile și Politica de confidențialitate.";
    return text;
  }

  function emailEnabled() {
    var e = cfg.emailjs || {};
    return !!(e.publicKey && e.serviceId && e.templateId);
  }

  // Trimite confirmarea comenzii prin EmailJS: clientul o primește pe email, magazinul în copie (setat în șablon)
  function sendOrderEmail(form, orderId, t) {
    var e = cfg.emailjs;
    return fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: e.serviceId,
        template_id: e.templateId,
        user_id: e.publicKey,
        template_params: {
          order_id: orderId,
          to_name: field(form, "nume"),
          to_email: field(form, "email"),
          phone: field(form, "telefon"),
          address: field(form, "adresa"),
          notes: field(form, "observatii"),
          order_lines: orderLinesText(t),
          subtotal: formatPrice(t.sub),
          shipping: shippingLabel(t),
          total: formatPrice(t.total) + (t.ship == null ? " + transport" : ""),
          shop_name: cfg.companyName,
          shop_email: cfg.email,
          shop_whatsapp: "+" + cfg.whatsapp,
        },
      }),
    }).then(function (res) {
      if (!res.ok) throw new Error("EmailJS " + res.status);
    });
  }

  function initCart() {
    // Butonul de coș din antet, pe toate paginile
    var header = document.querySelector(".header-inner");
    var onShop = !!document.getElementById("product-grid");
    if (header) {
      var btn = document.createElement(onShop ? "button" : "a");
      btn.className = "cart-btn";
      if (onShop) {
        btn.type = "button";
        btn.setAttribute("data-cart-open", "");
      } else {
        btn.href = "magazin.html#cos";
      }
      btn.setAttribute("aria-label", "Coșul de cumpărături");
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>' +
        '<span class="cart-count" data-cart-count hidden>0</span>';
      header.insertBefore(btn, header.querySelector(".nav-toggle"));
    }
    updateCartBadges();
    if (!onShop) return;

    var dialog = document.getElementById("cart-dialog");
    var content = document.getElementById("cart-dialog-content");
    var sending = false;

    function render() {
      var t = cartTotals();
      if (!t.lines.length) {
        content.innerHTML =
          '<h2 id="cart-dialog-title">Coșul tău</h2>' +
          '<p class="cart-empty">Coșul e gol. Alege un produs și apasă „Adaugă în coș”.</p>' +
          '<button type="button" class="btn" data-close>Înapoi la produse</button>';
        return;
      }
      var rows = t.lines.map(function (l, i) {
        return (
          '<li class="cart-item">' +
          '<div class="cart-item-info"><strong>' + esc(l.product.name) + "</strong>" +
          "<span>" + esc(l.unit) + (l.product.grinds ? " · " + esc(grindLabel(l.item.g)) : "") + "</span></div>" +
          '<div class="qty" role="group" aria-label="Cantitate">' +
          '<button type="button" data-qty="-1" data-i="' + i + '" aria-label="Scade">−</button>' +
          "<span>" + l.item.q + "</span>" +
          '<button type="button" data-qty="1" data-i="' + i + '" aria-label="Adaugă">+</button></div>' +
          '<span class="cart-item-total">' + formatPrice(l.total) + "</span>" +
          '<button type="button" class="cart-remove" data-remove="' + i + '" aria-label="Scoate din coș">&times;</button>' +
          "</li>"
        );
      });
      var d = cfg.delivery || {};
      var viaEmail = emailEnabled() || cfg.orderChannel === "email";
      content.innerHTML =
        '<h2 id="cart-dialog-title">Coșul tău</h2>' +
        '<ul class="cart-list">' + rows.join("") + "</ul>" +
        '<p class="cart-shipping"><span>Transport' + (d.freeFrom != null && t.ship ? " (gratuit de la " + formatPrice(d.freeFrom) + ")" : "") + "</span><span>" + shippingLabel(t) + "</span></p>" +
        '<p class="cart-sum"><span>Total</span><strong>' + formatPrice(t.total) + (t.ship == null ? " + transport" : "") + (t.unknown ? " + la cerere" : "") + "</strong></p>" +
        '<form class="cart-form" novalidate>' +
        '<div class="field"><label for="c-nume">Nume și prenume *</label><input id="c-nume" name="nume" autocomplete="name" required></div>' +
        '<div class="form-row">' +
        '<div class="field"><label for="c-tel">Telefon *</label><input id="c-tel" name="telefon" type="tel" autocomplete="tel" required minlength="10"></div>' +
        '<div class="field"><label for="c-email">Email *</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>' +
        "</div>" +
        '<div class="field"><label for="c-adresa">Adresă livrare *</label><input id="c-adresa" name="adresa" autocomplete="street-address" required placeholder="Stradă, număr, localitate, județ – sau „ridicare personală”"></div>' +
        '<div class="field"><label for="c-obs">Observații</label><textarea id="c-obs" name="observatii" rows="2" placeholder="Ex. date pentru factură pe firmă"></textarea></div>' +
        '<div class="hp-field" aria-hidden="true"><label for="c-site">Nu completa</label><input id="c-site" name="website" tabindex="-1" autocomplete="off"></div>' +
        '<label class="check"><input type="checkbox" name="acord"> <span>Am citit și sunt de acord cu <a href="termeni-si-conditii.html" target="_blank">Termenii și condițiile</a> și cu <a href="politica-de-confidentialitate.html" target="_blank">Politica de confidențialitate</a>. *</span></label>' +
        '<p class="form-error" data-error hidden></p>' +
        '<div class="dialog-actions"><button type="submit" class="btn" data-submit>' + (viaEmail ? "Trimite comanda" : "Trimite comanda pe WhatsApp") + "</button>" +
        '<button type="button" class="btn btn-ghost" data-clear>Golește coșul</button></div>' +
        '<p class="fine">Comanda devine fermă după ce o confirmăm (stoc, transport, termen). Plata se face la livrare, prin link de card sau transfer bancar – vezi <a href="metode-de-plata.html" target="_blank">Metode de plată</a>. Ai drept de retragere în 14 zile, cu excepțiile din <a href="politica-de-retur.html" target="_blank">Politica de retur</a>.</p>' +
        "</form>";
    }

    function done(orderId, text, emailed) {
      cart = [];
      saveCart();
      content.innerHTML =
        '<div class="order-done">' +
        '<h2 id="cart-dialog-title">Mulțumim!</h2>' +
        "<p>Numărul comenzii tale este</p>" +
        '<p class="order-id">' + esc(orderId) + "</p>" +
        (emailed
          ? "<p>Ți-am trimis confirmarea primirii pe email. Te contactăm în curând pentru confirmarea stocului, a transportului și a plății.</p>"
          : "<p>Trimite mesajul deschis în WhatsApp ca să ajungă comanda la noi. Dacă nu s-a deschis, apasă butonul de mai jos.</p>") +
        '<div class="dialog-actions">' +
        '<a class="btn' + (emailed ? " btn-ghost" : "") + '" href="' + esc(whatsappUrl(text)) + '" target="_blank" rel="noopener">' + (emailed ? "Scrie-ne și pe WhatsApp" : "Deschide WhatsApp") + "</a>" +
        '<button type="button" class="btn' + (emailed ? "" : " btn-ghost") + '" data-close>Închide</button>' +
        "</div></div>";
    }

    function open() {
      render();
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-cart-open]")) open();
    });

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) return dialog.close();
      var qty = e.target.closest("[data-qty]");
      if (qty) {
        var it = cart[+qty.getAttribute("data-i")];
        it.q += +qty.getAttribute("data-qty");
        if (it.q < 1) cart.splice(cart.indexOf(it), 1);
        saveCart();
        return render();
      }
      var rm = e.target.closest("[data-remove]");
      if (rm) {
        cart.splice(+rm.getAttribute("data-remove"), 1);
        saveCart();
        return render();
      }
      if (e.target.closest("[data-clear]")) {
        cart = [];
        saveCart();
        render();
      }
    });

    dialog.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending) return;
      var form = e.target;
      var err = form.querySelector("[data-error]");
      err.hidden = true;
      if (!form.reportValidity()) return;
      if (!form.elements.acord.checked) {
        err.textContent = "Bifează acordul cu Termenii și condițiile și Politica de confidențialitate ca să poți trimite comanda.";
        err.hidden = false;
        form.elements.acord.focus();
        return;
      }
      var orderId = newOrderId();
      var t = cartTotals();
      var text = orderText(form, orderId, t);
      // Câmp capcană pentru roboți: completat doar de spam
      if (field(form, "website")) return done(orderId, text, true);

      if (emailEnabled()) {
        var submit = form.querySelector("[data-submit]");
        sending = true;
        submit.disabled = true;
        submit.textContent = "Se trimite…";
        sendOrderEmail(form, orderId, t)
          .then(function () {
            done(orderId, text, true);
          })
          .catch(function () {
            err.textContent = "Nu am putut trimite emailul. Trimite comanda pe WhatsApp, din butonul de mai jos.";
            err.hidden = false;
            submit.disabled = false;
            submit.textContent = "Trimite comanda";
            if (form.querySelector("[data-wa-fallback]")) return;
            var wa = document.createElement("a");
            wa.setAttribute("data-wa-fallback", "");
            wa.className = "btn btn-ghost";
            wa.href = whatsappUrl(text);
            wa.target = "_blank";
            wa.rel = "noopener";
            wa.textContent = "Trimite pe WhatsApp";
            submit.parentNode.insertBefore(wa, submit.nextSibling);
          })
          .then(function () {
            sending = false;
          });
        return;
      }
      if (cfg.orderChannel === "email") window.location.href = mailtoUrl("Comanda " + orderId, text);
      else window.open(whatsappUrl(text), "_blank", "noopener");
      done(orderId, text, false);
    });

    if (location.hash === "#cos") open();
  }

  function productCard(p) {
    var badge = p.badge ? '<span class="badge">' + esc(p.badge) + "</span>" : "";
    var stock = p.available === false ? '<span class="badge badge-muted">Stoc epuizat</span>' : "";
    return (
      '<article class="product-card' + (p.available === false ? " is-unavailable" : "") + '" data-id="' + esc(p.id) + '">' +
      '<button class="product-media" type="button" data-open="' + esc(p.id) + '" aria-label="Detalii ' + esc(p.name) + '">' +
      productImage(p) + '<span class="badges">' + badge + stock + "</span></button>" +
      '<div class="product-body">' +
      '<p class="product-cat">' + esc(window.PRODUCT_CATEGORIES[p.category] || "") + "</p>" +
      '<h3><button type="button" class="link-btn" data-open="' + esc(p.id) + '">' + esc(p.name) + "</button></h3>" +
      (p.variants && p.variants.length > 1
        ? '<div class="chips chips-sm" role="group" aria-label="Gramaj">' +
          p.variants.map(function (v, i) {
            return '<button type="button" class="chip" data-card-variant="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(v.unit) + "</button>";
          }).join("") + "</div>"
        : '<p class="product-unit">' + esc(productUnits(p)) + "</p>") +
      '<div class="product-foot"><span class="price" data-card-price>' + cardPrice(p) + "</span>" +
      (p.available === false
        ? '<button type="button" class="btn btn-small" data-open="' + esc(p.id) + '">Detalii</button>'
        : '<button type="button" class="btn btn-small" data-quick-add>Adaugă în coș</button>') +
      "</div></div></article>"
    );
  }

  function initShop() {
    initCart();
    var grid = document.getElementById("product-grid");
    if (!grid) return;
    var products = window.PRODUCTS || [];
    var cats = window.PRODUCT_CATEGORIES || {};
    var filters = document.getElementById("shop-filters");
    var search = document.getElementById("shop-search");
    var empty = document.getElementById("shop-empty");
    var state = { cat: "toate", q: "" };

    var params = new URLSearchParams(location.search);
    if (params.get("categorie") && cats[params.get("categorie")]) state.cat = params.get("categorie");

    var chips = [["toate", "Toate"]].concat(Object.keys(cats).map(function (k) { return [k, cats[k]]; }));
    filters.innerHTML = chips
      .map(function (c) {
        return '<button type="button" class="chip" data-cat="' + c[0] + '" aria-pressed="' + (state.cat === c[0]) + '">' + esc(c[1]) + "</button>";
      })
      .join("");

    function normalize(s) {
      return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function render() {
      var q = normalize(state.q.trim());
      var list = products.filter(function (p) {
        if (state.cat !== "toate" && p.category !== state.cat) return false;
        if (q && normalize(p.name + " " + p.desc + " " + productUnits(p)).indexOf(q) === -1) return false;
        return true;
      });
      grid.innerHTML = list.map(productCard).join("");
      empty.hidden = list.length > 0;
    }

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      state.cat = btn.getAttribute("data-cat");
      filters.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", c === btn ? "true" : "false");
      });
      render();
    });
    search.addEventListener("input", function () {
      state.q = search.value;
      render();
    });

    // Fereastra cu detalii produs
    var dialog = document.getElementById("product-dialog");
    var content = document.getElementById("product-dialog-content");
    grid.addEventListener("click", function (e) {
      // Gramaj ales direct pe card: schimbă prețul afișat
      var pick = e.target.closest("[data-card-variant]");
      if (pick) {
        var card = pick.closest(".product-card");
        var cp = products.find(function (x) { return x.id === card.getAttribute("data-id"); });
        var i = +pick.getAttribute("data-card-variant");
        card.setAttribute("data-variant", i);
        card.querySelectorAll("[data-card-variant]").forEach(function (c) {
          c.setAttribute("aria-pressed", c === pick ? "true" : "false");
        });
        card.querySelector("[data-card-price]").textContent = formatPrice(cp.variants[i].price);
        return;
      }
      // Adaugă direct din card: gramajul ales, boabe, 1 bucată
      var quick = e.target.closest("[data-quick-add]");
      if (quick) {
        var qc = quick.closest(".product-card");
        addToCart(qc.getAttribute("data-id"), +(qc.getAttribute("data-variant") || 0), "", 1);
        quick.textContent = "Adăugat ✓";
        quick.classList.add("is-added");
        setTimeout(function () {
          quick.textContent = "Adaugă în coș";
          quick.classList.remove("is-added");
        }, 1400);
        return;
      }
      var trigger = e.target.closest("[data-open]");
      if (!trigger) return;
      var p = products.find(function (x) { return x.id === trigger.getAttribute("data-open"); });
      if (!p) return;
      var sel = { v: +(trigger.closest(".product-card").getAttribute("data-variant") || 0), g: "", q: 1 };
      var variantChips = p.variants && p.variants.length > 1
        ? '<div class="option-group"><p class="option-label">Gramaj</p><div class="chips" data-variants>' +
          p.variants.map(function (v, i) {
            return '<button type="button" class="chip" data-variant="' + i + '" aria-pressed="' + (i === sel.v) + '">' + esc(v.unit) + "</button>";
          }).join("") + "</div></div>"
        : "";
      var grindOptions = p.grinds
        ? '<div class="option-group">' +
          '<label class="check"><input type="checkbox" id="grind-check"> Vreau cafeaua măcinată</label>' +
          '<div id="grind-method" class="grind-method" hidden><label class="option-label" for="grind-select">Măcinată pentru</label>' +
          '<select id="grind-select" class="select">' +
          p.grinds.map(function (g) { return "<option>" + esc(g) + "</option>"; }).join("") +
          "</select></div></div>"
        : "";
      var canBuy = p.available !== false;
      content.innerHTML =
        '<div class="dialog-media">' + productImage(p) + "</div>" +
        '<div class="dialog-info">' +
        '<p class="product-cat">' + esc(cats[p.category] || "") + "</p>" +
        '<h2 id="product-dialog-title">' + esc(p.name) + "</h2>" +
        '<p class="product-unit" data-unit></p>' +
        "<p>" + esc(p.desc) + "</p>" +
        variantChips + grindOptions +
        '<p class="price price-lg" data-price></p>' +
        (canBuy
          ? '<div class="dialog-actions">' +
            '<div class="qty qty-lg" role="group" aria-label="Cantitate"><button type="button" data-dq="-1" aria-label="Scade">−</button><span data-qty-val>1</span><button type="button" data-dq="1" aria-label="Adaugă">+</button></div>' +
            '<button type="button" class="btn" data-add>Adaugă în coș</button>' +
            "</div>" +
            '<p class="added" data-added hidden>Adăugat în coș ✓ <button type="button" class="link-btn" data-cart-open>Vezi coșul</button></p>'
          : '<p class="notice">Produsul nu este momentan în stoc. Scrie-ne și te anunțăm când revine.</p>') +
        '<p class="fine">Plata se face la livrare sau prin transfer bancar, după confirmarea comenzii.</p>' +
        "</div>";

      function update() {
        content.querySelector("[data-unit]").textContent = itemUnit(p, sel.v);
        var price = itemPrice(p, sel.v, sel.g);
        content.querySelector("[data-price]").textContent =
          sel.q > 1 && price != null ? formatPrice(price * sel.q) + " (" + sel.q + " × " + formatPrice(price) + ")" : formatPrice(price);
        var qv = content.querySelector("[data-qty-val]");
        if (qv) qv.textContent = sel.q;
        var added = content.querySelector("[data-added]");
        if (added) added.hidden = true;
      }

      content.onclick = function (ev) {
        var vb = ev.target.closest("[data-variant]");
        if (vb) {
          sel.v = +vb.getAttribute("data-variant");
          content.querySelectorAll("[data-variant]").forEach(function (c) {
            c.setAttribute("aria-pressed", c === vb ? "true" : "false");
          });
          return update();
        }
        var dq = ev.target.closest("[data-dq]");
        if (dq) {
          sel.q = Math.max(1, sel.q + +dq.getAttribute("data-dq"));
          return update();
        }
        if (ev.target.closest("[data-add]")) {
          addToCart(p.id, sel.v, sel.g, sel.q);
          content.querySelector("[data-added]").hidden = false;
          return;
        }
        if (ev.target.closest("[data-cart-open]")) dialog.close();
      };
      var check = content.querySelector("#grind-check");
      if (check) {
        var method = content.querySelector("#grind-method");
        var gs = content.querySelector("#grind-select");
        check.addEventListener("change", function () {
          method.hidden = !check.checked;
          sel.g = check.checked ? gs.value : "";
          update();
        });
        gs.addEventListener("change", function () {
          sel.g = gs.value;
          update();
        });
      }
      update();
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });

    render();
  }

  /* ---------- Locații ---------- */
  var PRODUCT_LABELS = { cafea: "Cafea", irish: "Irish cappuccino", ciocolata: "Ciocolată caldă", snacks: "Snacks", bauturi: "Băuturi reci" };

  function locationCard(l, i) {
    return (
      '<li class="location-card' + (l.own ? " is-own" : "") + (l.image ? " has-image" : "") + '" data-index="' + i + '">' +
      (l.image ? '<img class="location-img" src="' + esc(l.image) + '" alt="' + esc(l.imageAlt || l.name) + '" loading="lazy">' : "") +
      '<div class="location-head"><span class="location-type">' + esc(l.type) + "</span>" +
      (l.soon ? '<span class="badge badge-muted">În curând</span>' : /non-stop|24\/7/i.test(l.hours) ? '<span class="badge">24/7</span>' : "") +
      "</div>" +
      "<h3>" + esc(l.name) + "</h3>" +
      '<p class="location-addr">' + esc(l.address) + "</p>" +
      (l.details ? '<p class="location-details">' + esc(l.details) + "</p>" : "") +
      '<p class="location-hours">' + esc(l.hours) + "</p>" +
      (l.price ? '<p class="location-price">' + esc(l.price) + "</p>" : "") +
      '<ul class="tags">' +
      (l.products || []).map(function (p) { return "<li>" + esc(PRODUCT_LABELS[p] || p) + "</li>"; }).join("") +
      "</ul>" +
      '<div class="location-actions">' +
      (l.lat != null ? '<button type="button" class="link-btn link-arrow" data-focus="' + i + '">Arată pe hartă</button>' : "") +
      '<a class="link-arrow" href="' + esc(directionsUrl(l)) + '" target="_blank" rel="noopener">Indicații rutiere</a>' +
      "</div></li>"
    );
  }

  function initLocations() {
    var list = document.getElementById("location-list");
    var locations = window.LOCATIONS || [];
    var cities = Array.from(new Set(locations.map(function (l) { return l.city; })));
    document.querySelectorAll("[data-stat='locations']").forEach(function (el) { el.textContent = locations.length; });
    document.querySelectorAll("[data-stat='cities']").forEach(function (el) { el.textContent = cities.length; });
    if (!list) return;

    var select = document.getElementById("city-filter");
    cities.sort(function (a, b) { return a.localeCompare(b, "ro"); });
    if (select) {
      select.innerHTML =
        '<option value="">Toate localitățile (' + locations.length + ")</option>" +
        cities
          .map(function (c) {
            var n = locations.filter(function (l) { return l.city === c; }).length;
            return '<option value="' + esc(c) + '">' + esc(c) + " (" + n + ")</option>";
          })
          .join("");
    }

    function render() {
      var city = select ? select.value : "";
      list.innerHTML = locations
        .map(function (l, i) { return { l: l, i: i }; })
        .filter(function (x) { return !city || x.l.city === city; })
        .sort(function (a, b) { return (b.l.own ? 1 : 0) - (a.l.own ? 1 : 0); })
        .map(function (x) { return locationCard(x.l, x.i); })
        .join("");
      document.dispatchEvent(new CustomEvent("locations:filter", { detail: { city: city } }));
    }

    if (select) select.addEventListener("change", render);
    list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-focus]");
      if (!btn) return;
      document.dispatchEvent(new CustomEvent("locations:focus", { detail: { index: +btn.getAttribute("data-focus") } }));
    });
    render();
  }

  /* ---------- Hartă (Leaflet + OpenStreetMap) ---------- */
  function initMaps() {
    var el = document.getElementById("map");
    if (!el) return;
    if (!window.L) {
      el.innerHTML = '<p class="map-fallback">Harta nu a putut fi încărcată. Vezi lista locațiilor mai jos.</p>';
      return;
    }
    var locations = (window.LOCATIONS || []).filter(function (l) { return l.lat != null; });
    var map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var markers = {};
    var all = window.LOCATIONS || [];

    // dx = deplasare pe orizontală (px), folosită când două pinuri se suprapun
    function makeIcon(l, dx) {
      var w = l.own ? 46 : 30;
      return L.divIcon({
        className: "map-pin" + (l.own ? " map-pin-own" : ""),
        html: l.own ? "<span><b>24/7</b></span>" : "<span></span>",
        iconSize: [w, w],
        iconAnchor: [w / 2 - dx, w],
        popupAnchor: [dx, -w + 2],
        tooltipAnchor: [dx + (l.own ? -w / 2 : w / 2), -w / 2],
      });
    }

    all.forEach(function (l, i) {
      if (l.lat == null) return;
      markers[i] = L.marker([l.lat, l.lng], { icon: makeIcon(l, 0), title: l.name, zIndexOffset: l.own ? 0 : 500 })
        .addTo(map)
        .bindTooltip(esc(l.own ? "Coffee & Snacks 24/7" : l.name), {
          permanent: true,
          direction: l.own ? "left" : "right",
          className: "map-label" + (l.own ? " map-label-own" : ""),
        })
        .bindPopup(
          "<strong>" + esc(l.name) + "</strong><br>" + esc(l.address) +
          (l.details ? "<br><em>" + esc(l.details) + "</em>" : "") +
          "<br>" + esc(l.hours) +
          (l.price ? "<br><strong>" + esc(l.price) + "</strong>" : "") +
          '<br><a href="' + esc(directionsUrl(l)) + '" target="_blank" rel="noopener">Indicații rutiere →</a>'
        );
    });

    // Pinurile prea apropiate de locația proprie se așază lângă ea, ca să se vadă amândouă
    function spread() {
      var own = all.map(function (l, i) { return l.own && markers[i] ? map.latLngToContainerPoint(markers[i].getLatLng()) : null; }).filter(Boolean);
      all.forEach(function (l, i) {
        if (!markers[i] || l.own) return;
        var pt = map.latLngToContainerPoint(markers[i].getLatLng());
        var dx = 0;
        own.forEach(function (o) {
          if (Math.abs(pt.x - o.x) < 40 && Math.abs(pt.y - o.y) < 48) {
            dx = (pt.x >= o.x ? 1 : -1) * 40 - (pt.x - o.x);
          }
        });
        if (dx !== markers[i]._dx) {
          markers[i]._dx = dx;
          markers[i].setIcon(makeIcon(l, dx));
        }
      });
    }
    map.on("zoomend viewreset", spread);

    function fit(city) {
      var pts = locations.filter(function (l) { return !city || l.city === city; }).map(function (l) { return [l.lat, l.lng]; });
      if (pts.length === 1) map.setView(pts[0], 15);
      else if (pts.length) map.fitBounds(pts, { padding: [50, 50], maxZoom: 15 });
    }
    fit("");
    spread();

    document.addEventListener("locations:filter", function (e) { fit(e.detail.city); });
    document.addEventListener("locations:focus", function (e) {
      var m = markers[e.detail.index];
      if (!m) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      map.setView(m.getLatLng(), 16);
      m.openPopup();
    });
  }

  /* ---------- Formulare (trimise pe email / WhatsApp, fără server) ---------- */
  function initForms() {
    document.querySelectorAll("form[data-mail-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var subject = form.getAttribute("data-mail-form");
        var lines = [];
        Array.from(form.elements).forEach(function (el) {
          if (!el.name || el.type === "submit") return;
          if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
          var label = form.querySelector('label[for="' + el.id + '"]');
          var name = el.getAttribute("data-label") || (label ? label.textContent.replace(/\*/g, "").trim() : el.name);
          lines.push(name + ": " + el.value);
        });
        var body = lines.join("\n");
        var via = (e.submitter && e.submitter.getAttribute("data-via")) || "email";
        if (via === "whatsapp") {
          window.open(whatsappUrl(subject + "\n\n" + body), "_blank", "noopener");
        } else {
          window.location.href = mailtoUrl(subject, body);
        }
        var ok = form.querySelector(".form-ok");
        if (ok) ok.hidden = false;
      });
    });
  }

  // Cât e deschisă o fereastră (produs, coș), pagina din spate stă pe loc
  function initDialogs() {
    document.querySelectorAll("dialog").forEach(function (d) {
      new MutationObserver(function () {
        document.documentElement.classList.toggle("modal-open", !!document.querySelector("dialog[open]"));
      }).observe(d, { attributes: true, attributeFilter: ["open"] });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();
    initDialogs();
    initNav();
    initShop();
    initLocations();
    initMaps();
    initForms();
  });
})();
