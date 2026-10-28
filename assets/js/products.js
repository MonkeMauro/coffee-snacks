/*
 * Produsele din magazinul online.
 * Adaugă / șterge / modifică obiecte în listă. Câmpuri:
 *   id        – identificator unic (fără spații)
 *   name      – denumire
 *   category  – una dintre cheile din PRODUCT_CATEGORIES
 *   price     – preț în lei (număr) sau null pentru „la cerere” (când produsul are un singur gramaj)
 *   unit      – ex. „1 kg boabe”, „250 g” (când produsul are un singur gramaj)
 *   variants  – opțional, gramajele disponibile: [{ unit: "250 g", price: 60 }, ...]
 *               (înlocuiesc price / unit; priceGround = alt preț pentru varianta măcinată)
 *   grinds    – opțional, metodele pentru care se poate măcina (clientul bifează „Vreau cafeaua măcinată”)
 *   desc      – descriere scurtă
 *   image     – cale către imagine (ex. "assets/img/produse/fresso-blue.webp") sau "" pentru imagine generică
 *   badge     – etichetă opțională (ex. „Nou”, „Single origin”)
 *   available – false dacă produsul nu e momentan în stoc
 *
 * Produse preluate de pe coffeepoint.ro (Fresso), 27.10.2026. Prețuri de vânzare = prețul coffeepoint.ro
 * + 35% la cafeaua de specialitate și + 25% la cafeaua boabe 1 kg, rotunjit în sus la 5 lei.
 */
window.PRODUCT_CATEGORIES = {
  specialitate: "Cafea de specialitate",
  boabe: "Cafea boabe 1 kg",
};

// Cafelele de specialitate Fresso vin boabe sau, la cerere, măcinate pentru metoda de preparare.
var FRESSO_GRINDS = ["Espresso", "Moka Pot", "Ibric", "French Press", "Filtru (V60)", "AeroPress"];

window.PRODUCTS = [
  // ---------- Cafea de specialitate Fresso (proaspăt prăjită) ----------
  {
    id: "fresso-etiopia-konga",
    name: "Fresso Etiopia Konga",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 60 },
      { unit: "500 g", price: 105 },
      { unit: "1 kg", price: 190, priceGround: 195 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Microlot din Etiopia, Q-Grade 86,5/100. Aromă florală, aciditate ridicată, note de caisă, citrice și ceai Darjeeling. Excelentă la filtru.",
    image: "assets/img/produse/fresso-etiopia-konga.webp",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-etiopia-yirgacheffe",
    name: "Fresso Etiopia Yirgacheffe",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 60 },
      { unit: "500 g", price: 105 },
      { unit: "1 kg", price: 190 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din regiunea Yirgacheffe, Q-Grade 85. Note de căpșuni, coacăze negre și citrice, aftertaste lung. Prăjire medie.",
    image: "assets/img/produse/fresso-etiopia-yirgacheffe.webp",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-guatemala-huehuetenango",
    name: "Fresso Guatemala Huehuetenango Huipil",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 60 },
      { unit: "500 g", price: 105 },
      { unit: "1 kg", price: 190 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Microlot din Guatemala, Q-Grade 85/100. Note de coacăze negre, vanilie și miere, cu aciditate vibrantă.",
    image: "assets/img/produse/fresso-guatemala.webp",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-rwanda-huye",
    name: "Fresso Rwanda Huye Honey",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 60 },
      { unit: "500 g", price: 105 },
      { unit: "1 kg", price: 195 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Microlot din Rwanda, procesare honey, Q-Grade 85/100. Note dulci de caramel, miere de tei și caisă coaptă.",
    image: "assets/img/produse/fresso-rwanda.webp",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-columbia-caldas",
    name: "Fresso Columbia Caldas",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 55 },
      { unit: "500 g", price: 100 },
      { unit: "1 kg", price: 180 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din Columbia, procesare spălată, Q-Grade 83. Note de zmeură, mure, caramel și portocală.",
    image: "assets/img/produse/fresso-columbia-caldas.webp",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-costa-rica-tarrazu",
    name: "Fresso Costa Rica Tarrazu SHB",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 55 },
      { unit: "500 g", price: 105 },
      { unit: "1 kg", price: 185 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din regiunea Tarrazu, boabe SHB, Q-Grade 82,25. Note de caramel, ciocolată, alune de pădure și portocală.",
    image: "assets/img/produse/fresso-costa-rica.webp",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-brazilia-alta-mogiana",
    name: "Fresso Brazilia Alta Mogiana",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 50 },
      { unit: "500 g", price: 95 },
      { unit: "1 kg", price: 170 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "100% Arabica din Brazilia, procesare naturală, Q-Grade 82,5. Note fructate, alune de pădure, caramel și corp cremos.",
    image: "assets/img/produse/fresso-brazilia.webp",
    badge: "Single origin",
    available: true,
  },
  {
    id: "fresso-evoke-blend",
    name: "Fresso Evoke Blend",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 50 },
      { unit: "500 g", price: 95 },
      { unit: "1 kg", price: 175 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Blend de specialitate 100% Arabica din Brazilia și Etiopia, gândit pentru espresso. Note de căpșuni, coacăze, caramel și alune.",
    image: "assets/img/produse/fresso-evoke.webp",
    badge: "Blend",
    available: true,
  },
  {
    id: "fresso-columbia-huila-decaf",
    name: "Fresso Columbia Huila Decaf",
    category: "specialitate",
    variants: [
      { unit: "250 g", price: 60 },
      { unit: "500 g", price: 110 },
      { unit: "1 kg", price: 195 },
    ],
    grinds: FRESSO_GRINDS,
    desc: "Cafea de specialitate decofeinizată din Huila, Columbia, Q-Grade 84,5. Note de ciocolată neagră, măr și migdale.",
    image: "assets/img/produse/fresso-columbia-huila.webp",
    badge: "Decofeinizată",
    available: true,
  },

  // ---------- Cafea boabe Fresso 1 kg ----------
  {
    id: "fresso-blue-1kg",
    name: "Fresso Blue",
    category: "boabe",
    price: 100,
    unit: "1 kg boabe",
    desc: "100% Arabica din America Latină, corp rotund și aciditate vie. Note de fructe de pădure, ciocolată și zahăr brun.",
    image: "assets/img/produse/fresso-blue.webp",
    badge: "100% Arabica",
    available: true,
  },
  {
    id: "fresso-green-1kg",
    name: "Fresso Green",
    category: "boabe",
    price: 95,
    unit: "1 kg boabe",
    desc: "85% Arabica și 15% Robusta, prăjire lentă pentru un corp de espresso italian.",
    image: "assets/img/produse/fresso-green.webp",
    badge: "",
    available: true,
  },
  {
    id: "fresso-intense-1kg",
    name: "Fresso Intense",
    category: "boabe",
    price: 85,
    unit: "1 kg boabe",
    desc: "Blend Arabica și Robusta din America de Sud și Africa, corpolent și intens. Note de ciocolată neagră, cacao și condimente.",
    image: "assets/img/produse/fresso-intense.webp",
    badge: "",
    available: true,
  },
  {
    id: "fresso-red-1kg",
    name: "Fresso Red",
    category: "boabe",
    price: 80,
    unit: "1 kg boabe",
    desc: "Corp hotărât, aciditate medie și aromă fructată. Gândită pentru aparatele automate și vending.",
    image: "assets/img/produse/fresso-red.webp",
    badge: "",
    available: true,
  },
];
