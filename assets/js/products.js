/*
 * Produsele din magazinul online.
 * Adaugă / șterge / modifică obiecte în listă. Câmpuri:
 *   id        – identificator unic (fără spații)
 *   name      – denumire
 *   category  – una dintre cheile din PRODUCT_CATEGORIES
 *   price     – preț în lei (număr) sau null pentru „la cerere”
 *   unit      – ex. „1 kg boabe”, „250 g”
 *   desc      – descriere scurtă
 *   image     – cale către imagine (ex. "assets/img/produse/fresso-blue.jpg") sau "" pentru imagine generică
 *   badge     – etichetă opțională (ex. „Nou”, „Single origin”)
 *   available – false dacă produsul nu e momentan în stoc
 *
 * Produse și prețuri preluate după coffeepoint.ro (Fresso) — verifică prețurile înainte de lansare.
 */
window.PRODUCT_CATEGORIES = {
  specialitate: "Cafea de specialitate",
  boabe: "Cafea boabe 1 kg",
};

window.PRODUCTS = [
  // ---------- Cafea de specialitate (Fresso single origin) ----------
  {
    id: "fresso-columbia-caldas",
    name: "Fresso Columbia Caldas",
    category: "specialitate",
    price: 38.49,
    unit: "250 g",
    desc: "Cafea de specialitate 100% Arabica din Columbia, proaspăt prăjită. Scor Q-Grade 83.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-brazilia-alta-mogiana",
    name: "Fresso Brazilia Alta Mogiana",
    category: "specialitate",
    price: 36.49,
    unit: "250 g",
    desc: "Cafea de origine din Brazilia, regiunea Alta Mogiana, proaspăt prăjită. Disponibilă boabe sau măcinată.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-guatemala-huehuetenango",
    name: "Fresso Guatemala Huehuetenango",
    category: "specialitate",
    price: 40.99,
    unit: "250 g",
    desc: "Microlot din Guatemala, regiunea Huehuetenango. Scor Q-Grade 85/100.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-costa-rica-tarrazu",
    name: "Fresso Costa Rica Tarrazu SHB",
    category: "specialitate",
    price: 39.99,
    unit: "250 g",
    desc: "Cafea de origine din Costa Rica, regiunea Tarrazu, boabe SHB (Strictly Hard Bean), proaspăt prăjită.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-etiopia-yirgacheffe",
    name: "Fresso Etiopia Yirgacheffe",
    category: "specialitate",
    price: null,
    unit: "250 g",
    desc: "Cafea de origine din Etiopia, regiunea Yirgacheffe, proaspăt prăjită.",
    image: "",
    badge: "Single origin",
    available: true,
  },

  // ---------- Cafea boabe Fresso 1 kg ----------
  {
    id: "fresso-green-1kg",
    name: "Fresso Green",
    category: "boabe",
    price: 74.49,
    unit: "1 kg boabe",
    desc: "85% Arabica și 15% Robusta, prăjire lentă pentru un gust puternic și echilibrat. Pentru espressoare cu râșniță, birou sau vending.",
    image: "",
    badge: "",
    available: true,
  },
  {
    id: "fresso-red-1kg",
    name: "Fresso Red",
    category: "boabe",
    price: 61.49,
    unit: "1 kg boabe",
    desc: "Cafea boabe proaspăt prăjită, 100% boabe de cafea naturală. Gândită pentru aparate automate și vending.",
    image: "",
    badge: "",
    available: true,
  },
  {
    id: "fresso-blue-1kg",
    name: "Fresso Blue",
    category: "boabe",
    price: 75.49,
    unit: "1 kg boabe",
    desc: "Cafea boabe 100% Arabica, proaspăt prăjită. Gust fin, potrivită pentru espresso și cappuccino.",
    image: "",
    badge: "100% Arabica",
    available: true,
  },
  {
    id: "fresso-brown-1kg",
    name: "Fresso Brown",
    category: "boabe",
    price: null,
    unit: "1 kg boabe",
    desc: "Cafea boabe Fresso proaspăt prăjită, pentru espressoare automate și vending.",
    image: "",
    badge: "",
    available: true,
  },
];
