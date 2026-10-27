/*
 * Datele firmei — modifică aici și se actualizează pe tot site-ul.
 * Toate elementele cu atributul data-config="cheie" primesc valoarea de mai jos.
 */
window.SITE_CONFIG = {
  brand: "Coffee & Snacks",
  tagline: "Self Service Station",
  companyName: "Coffee & Snacks SRL",
  cui: "RO00000000",
  regCom: "J00/0000/2026",

  phone: "+40 700 000 000",
  // Număr WhatsApp doar cu cifre, cu prefix de țară (fără + sau spații)
  whatsapp: "40700000000",
  email: "contact@exemplu.ro",

  // Locația proprie, deschisă non-stop
  shop: {
    name: "Coffee & Snacks Borca",
    address: "Str. Principală nr. 45, Borca, jud. Neamț",
    landmark: "Centru Borca, la parter – fosta Casa Dornei",
    hours: "Deschis non-stop, 24/7",
    // Coordonatele exacte ale intrării (vezi README pentru cum le iei din Google Maps)
    lat: 47.1856,
    lng: 25.7831,
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },

  // Cum ajung la tine comenzile din magazinul online (fără plată online)
  // "whatsapp" sau "email"
  orderChannel: "whatsapp",
};
