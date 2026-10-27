/*
 * Datele firmei — modifică aici și se actualizează pe tot site-ul.
 * Toate elementele cu atributul data-config="cheie" primesc valoarea de mai jos.
 */
window.SITE_CONFIG = {
  brand: "Coffee & Snacks",
  tagline: "Self Service Station",
  companyName: "Viral 4 Hype SRL",
  cui: "RO44420073",
  // Nr. Registrul Comerțului (ex. "J27/123/2021"); gol = nu se afișează
  regCom: "",
  // Sediul social, exact ca în certificatul de înregistrare (apare în footer și în paginile legale)
  registeredOffice: "",
  // Banca și IBAN pentru plata prin transfer (apar la Metode de plată); gol = nu se afișează
  bank: "",
  iban: "",

  // Număr WhatsApp doar cu cifre, cu prefix de țară (fără + sau spații)
  whatsapp: "40757173566",
  email: "contact@exemplu.ro",

  // Locația proprie, deschisă non-stop
  shop: {
    name: "Coffee & Snacks Borca",
    address: "Str. Principală nr. 45, Borca, jud. Neamț",
    landmark: "Centru Borca, la parter – fosta Casa Dornei",
    hours: "Deschis non-stop, 24/7",
    // Coordonatele exacte ale intrării (vezi README pentru cum le iei din Google Maps)
    lat: 47.1783,
    lng: 25.78861,
    // Link Google Maps folosit la butoanele „Indicații rutiere”
    mapsUrl: "https://maps.app.goo.gl/9YKh9P8rPN1No68w9",
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },

  // Cum ajung la tine comenzile din magazinul online (fără plată online)
  // "whatsapp" sau "email"
  orderChannel: "whatsapp",

  // Livrarea comenzilor din magazin. cost = null → „se comunică la confirmarea comenzii”
  delivery: {
    courier: "", // ex. "Fan Courier"
    cost: null, // ex. 20 (lei)
    freeFrom: null, // ex. 200 → transport gratuit pentru comenzi de la 200 lei
    time: "", // ex. "1–3 zile lucrătoare de la confirmare"
  },

  // Email de confirmare a comenzii prin EmailJS (gratuit, vezi README).
  // Cât timp sunt goale, comanda se trimite doar pe WhatsApp.
  emailjs: {
    publicKey: "",
    serviceId: "",
    templateId: "",
  },
};
