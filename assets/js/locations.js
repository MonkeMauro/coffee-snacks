/*
 * Locațiile Coffee & Snacks — apar pe hartă și în listă.
 * Câmpuri:
 *   name     – numele locației
 *   city     – localitatea (folosită la filtrare)
 *   address  – adresa
 *   details  – reper (opțional)
 *   type     – ex. „Locație proprie”, „Aparat în magazin”
 *   products – ce găsești: "cafea", "irish", "ciocolata", "snacks", "bauturi"
 *   hours    – program de acces
 *   lat, lng – coordonate pentru hartă (în Google Maps: click dreapta pe locul exact
 *              → copiezi cele două numere).
 *   own      – true pentru locația proprie non-stop (apare evidențiată)
 *   soon     – true dacă locația nu e încă deschisă
 */
window.LOCATIONS = [
  {
    name: "Coffee & Snacks – Self Service Station",
    city: "Borca",
    address: "Str. Principală nr. 45, Borca, jud. Neamț",
    details: "Centru Borca, la parter – fosta Casa Dornei",
    type: "Locație proprie",
    products: ["cafea", "irish", "ciocolata", "snacks", "bauturi"],
    hours: "Non-stop, 24/7",
    lat: 47.17969,
    lng: 25.785338,
    own: true,
  },
  {
    name: "Simos Borca",
    city: "Borca",
    address: "Borca, jud. Neamț",
    details: "Aparat de cafea, irish și ciocolată caldă în magazinul Simos",
    type: "Aparat vending",
    products: ["cafea", "irish", "ciocolata"],
    hours: "În programul magazinului",
    lat: 47.17889,
    lng: 25.78861,
  },
  {
    name: "Simos Broșteni",
    city: "Broșteni",
    address: "Broșteni, jud. Suceava",
    details: "Aparat de cafea, irish și ciocolată caldă în magazinul Simos",
    type: "Aparat vending",
    products: ["cafea", "irish", "ciocolata"],
    hours: "În programul magazinului",
    lat: 47.239972,
    lng: 25.7001,
  },
];
