/*
 * Produsele din magazinul online.
 * Adaugă / șterge / modifică obiecte în listă. Câmpuri:
 *   id        – identificator unic (fără spații)
 *   name      – denumire
 *   category  – una dintre cheile din PRODUCT_CATEGORIES
 *   price     – preț în lei (număr) sau null pentru „la cerere” (când produsul are un singur gramaj)
 *   unit      – ex. „1 kg boabe”, „250 g” (când produsul are un singur gramaj)
 *   variants  – opțional, gramajele disponibile: [{ unit: "250 g", price: 40.99 }, ...]
 *               (înlocuiesc price / unit; priceGround = alt preț pentru varianta măcinată)
 *   grinds    – opțional, formele în care se poate comanda (ex. „Boabe”, „Măcinată – Espresso”)
 *   desc      – descriere scurtă
 *   image     – cale către imagine (ex. "assets/img/produse/fresso-blue.webp") sau "" pentru imagine generică
 *   badge     – etichetă opțională (ex. „Nou”, „Single origin”)
 *   available – false dacă produsul nu e momentan în stoc
 *
 * Produse și prețuri preluate de pe coffeepoint.ro (Fresso), 27.10.2026.
 */
window.PRODUCT_CATEGORIES = {
  specialitate: "Cafea de specialitate",
  boabe: "Cafea boabe 1 kg",
};

// Toate cafelele de specialitate Fresso se pot lua boabe sau măcinate pentru metoda de preparare.
var FRESSO_GRINDS = [
  "Boabe",
  "Măcinată – Espresso",
  "Măcinată – Moka Pot",
  "Măcinată – Ibric",
  "Măcinată – French Press",
  "Măcinată – Filtru (V60)",
  "Măcinată – AeroPress",
];

window.PRODUCTS = [
  // ---------- Cafea de specialitate Fresso (proaspăt prăjită) ----------
  {
    id: "fresso-etiopia-konga",
    name: "Fresso Etiopia Konga",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 40.99 },
      { unit: "500 g", price: 75.99 },
      { unit: "1 kg", price: 138.99, priceGround: 140.99 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Microlot din Etiopia, Q-Grade 86,5/100. Aromă florală, aciditate ridicată, note de caisă, citrice și ceai Darjeeling. Excelentă la filtru.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-etiopia-yirgacheffe",
    name: "Fresso Etiopia Yirgacheffe",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 40.99 },
      { unit: "500 g", price: 75.49 },
      { unit: "1 kg", price: 137.49 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din regiunea Yirgacheffe, Q-Grade 85. Note de căpșuni, coacăze negre și citrice, aftertaste lung. Prăjire medie.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-guatemala-huehuetenango",
    name: "Fresso Guatemala Huehuetenango Huipil",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 40.99 },
      { unit: "500 g", price: 75.99 },
      { unit: "1 kg", price: 138.99 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Microlot din Guatemala, Q-Grade 85/100. Note de coacăze negre, vanilie și miere, cu aciditate vibrantă.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-rwanda-huye",
    name: "Fresso Rwanda Huye Honey",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 41.99 },
      { unit: "500 g", price: 76.99 },
      { unit: "1 kg", price: 140.99 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Microlot din Rwanda, procesare honey, Q-Grade 85/100. Note dulci de caramel, miere de tei și caisă coaptă.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-columbia-caldas",
    name: "Fresso Columbia Caldas",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 38.49 },
      { unit: "500 g", price: 72.49 },
      { unit: "1 kg", price: 130.49 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din Columbia, procesare spălată, Q-Grade 83. Note de zmeură, mure, caramel și portocală.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-costa-rica-tarrazu",
    name: "Fresso Costa Rica Tarrazu SHB",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 39.99 },
      { unit: "500 g", price: 74.49 },
      { unit: "1 kg", price: 134.49 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din regiunea Tarrazu, boabe SHB, Q-Grade 82,25. Note de caramel, ciocolată, alune de pădure și portocală.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-brazilia-alta-mogiana",
    name: "Fresso Brazilia Alta Mogiana",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 36.49 },
      { unit: "500 g", price: 68.49 },
      { unit: "1 kg", price: 122.49 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din Brazilia, procesare naturală, Q-Grade 82,5. Note fructate, alune de pădure, caramel și corp cremos.",
    image: "",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-evoke-blend",
    name: "Fresso Evoke Blend",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 36.49 },
      { unit: "500 g", price: 69.49 },
      { unit: "1 kg", price: 127.49 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Blend de specialitate 100% Arabica din Brazilia și Etiopia, gândit pentru espresso. Note de căpșuni, coacăze, caramel și alune.",
    image: "",
    badge: "Blend",
    available: true,
  },
  {
    id: "fresso-columbia-huila-decaf",
    name: "Fresso Columbia Huila Decaf",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 41.99 },
      { unit: "500 g", price: 77.99 },
      { unit: "1 kg", price: 142.49 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Cafea de specialitate decofeinizată din Huila, Columbia, Q-Grade 84,5. Note de ciocolată neagră, măr și migdale.",
    image: "",
    badge: "Decofeinizată",
    available: true,
  },

  // ---------- Cafea boabe Fresso 1 kg ----------
  {
    id: "fresso-blue-1kg",
    name: "Fresso Blue",
    category: "boabe",
    price: 77.49,
    unit: "1 kg boabe",
    desc: "100% Arabica din America Latină, corp rotund și aciditate vie. Note de fructe de pădure, ciocolată și zahăr brun.",
    image: "",
    badge: "100% Arabica",
    available: true,
  },
  {
    id: "fresso-green-1kg",
    name: "Fresso Green",
    category: "boabe",
    price: 74.49,
    unit: "1 kg boabe",
    desc: "85% Arabica și 15% Robusta, prăjire lentă pentru un corp de espresso italian.",
    image: "",
    badge: "",
    available: true,
  },
  {
    id: "fresso-intense-1kg",
    name: "Fresso Intense",
    category: "boabe",
    price: 65.49,
    unit: "1 kg boabe",
    desc: "Blend Arabica și Robusta din America de Sud și Africa, corpolent și intens. Note de ciocolată neagră, cacao și condimente.",
    image: "",
    badge: "",
    available: true,
  },
  {
    id: "fresso-red-1kg",
    name: "Fresso Red",
    category: "boabe",
    price: 61.5,
    unit: "1 kg boabe",
    desc: "Corp hotărât, aciditate medie și aromă fructată. Gândită pentru aparatele automate și vending.",
    image: "",
    badge: "",
    available: true,
  },
];
