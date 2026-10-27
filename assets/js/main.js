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
    var dest = loc.lat != null ? loc.lat + "," + loc.lng : loc.address;
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(dest);
  }

  /* ---------- Date firmă în pagină ---------- */
  function applyConfig() {
    document.querySelectorAll("[data-config]").forEach(function (el) {
      var val = get(cfg, el.getAttribute("data-config"));
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-href]").forEach(function (el) {
      var kind = el.getAttribute("data-href");
      if (kind === "phone") el.href = "tel:" + String(cfg.phone).replace(/\s+/g, "");
      else if (kind === "email") el.href = "mailto:" + cfg.email;
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
  function orderLink(p) {
    var text =
      "Bună ziua! Aș dori să comand / să aflu mai multe despre:\n" +
      "• " + p.name + " (" + p.unit + ") – " + formatPrice(p.price) + "\n\nCantitate: \nNume: \nAdresă livrare: ";
    if (cfg.orderChannel === "email") {
      return { href: mailtoUrl("Comandă: " + p.name, text), label: "Comandă pe email" };
    }
    return { href: whatsappUrl(text), label: "Comandă pe WhatsApp" };
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
      '<p class="product-unit">' + esc(p.unit) + "</p>" +
      '<div class="product-foot"><span class="price">' + formatPrice(p.price) + "</span>" +
      '<button type="button" class="btn btn-small" data-open="' + esc(p.id) + '">Detalii</button></div>' +
      "</div></article>"
    );
  }

  function initShop() {
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
        if (q && normalize(p.name + " " + p.desc + " " + p.unit).indexOf(q) === -1) return false;
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
      var trigger = e.target.closest("[data-open]");
      if (!trigger) return;
      var p = products.find(function (x) { return x.id === trigger.getAttribute("data-open"); });
      if (!p) return;
      var order = orderLink(p);
      var phoneHref = "tel:" + String(cfg.phone).replace(/\s+/g, "");
      content.innerHTML =
        '<div class="dialog-media">' + productImage(p) + "</div>" +
        '<div class="dialog-info">' +
        '<p class="product-cat">' + esc(cats[p.category] || "") + "</p>" +
        '<h2 id="product-dialog-title">' + esc(p.name) + "</h2>" +
        '<p class="product-unit">' + esc(p.unit) + "</p>" +
        "<p>" + esc(p.desc) + "</p>" +
        '<p class="price price-lg">' + formatPrice(p.price) + "</p>" +
        (p.available === false
          ? '<p class="notice">Produsul nu este momentan în stoc. Scrie-ne și te anunțăm când revine.</p>'
          : "") +
        '<div class="dialog-actions">' +
        '<a class="btn" href="' + esc(order.href) + '" target="_blank" rel="noopener">' + order.label + "</a>" +
        '<a class="btn btn-ghost" href="' + esc(phoneHref) + '">Sună-ne</a>' +
        "</div>" +
        '<p class="fine">Plata se face la livrare sau prin transfer bancar, după confirmarea comenzii.</p>' +
        "</div>";
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });

    render();
  }

  /* ---------- Locații ---------- */
  var PRODUCT_LABELS = { cafea: "Cafea", snacks: "Snacks", bauturi: "Băuturi reci" };

  function locationCard(l, i) {
    return (
      '<li class="location-card' + (l.own ? " is-own" : "") + '" data-index="' + i + '">' +
      '<div class="location-head"><span class="location-type">' + esc(l.type) + "</span>" +
      (l.soon ? '<span class="badge badge-muted">În curând</span>' : /non-stop|24\/7/i.test(l.hours) ? '<span class="badge">24/7</span>' : "") +
      "</div>" +
      "<h3>" + esc(l.name) + "</h3>" +
      '<p class="location-addr">' + esc(l.address) + "</p>" +
      (l.details ? '<p class="location-details">' + esc(l.details) + "</p>" : "") +
      '<p class="location-hours">' + esc(l.hours) + "</p>" +
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
    all.forEach(function (l, i) {
      if (l.lat == null) return;
      var icon = L.divIcon({
        className: "map-pin" + (l.own ? " map-pin-own" : ""),
        html: l.own ? "<span><b>24/7</b></span>" : "<span></span>",
        iconSize: l.own ? [46, 46] : [30, 30],
        iconAnchor: l.own ? [23, 46] : [15, 30],
        popupAnchor: [0, l.own ? -44 : -28],
      });
      markers[i] = L.marker([l.lat, l.lng], { icon: icon, title: l.name })
        .addTo(map)
        .bindPopup(
          "<strong>" + esc(l.name) + "</strong><br>" + esc(l.address) +
          (l.details ? "<br><em>" + esc(l.details) + "</em>" : "") +
          "<br>" + esc(l.hours) +
          '<br><a href="' + esc(directionsUrl(l)) + '" target="_blank" rel="noopener">Indicații rutiere →</a>'
        );
    });

    function fit(city) {
      var pts = locations.filter(function (l) { return !city || l.city === city; }).map(function (l) { return [l.lat, l.lng]; });
      if (pts.length === 1) map.setView(pts[0], 15);
      else if (pts.length) map.fitBounds(pts, { padding: [50, 50], maxZoom: 15 });
    }
    fit("");

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

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();
    initNav();
    initShop();
    initLocations();
    initMaps();
    initForms();
  });
})();
