# Coffee & Snacks – Self Service Station

Site de prezentare pentru Coffee & Snacks: stația self service non-stop din centrul Borca, rețeaua de aparate de vending și un magazin online simplu (doar prezentare, fără plăți online).

Site static (HTML + CSS + JavaScript), fără build și fără server. Poate fi găzduit gratuit pe GitHub Pages, Netlify sau orice hosting.

## Pagini

| Pagină | Conținut |
| --- | --- |
| `index.html` | Prezentare, meniu cafea (5 lei), ofertă cafea + apă, galerie, hartă, noutăți |
| `locatii.html` | Harta interactivă (OpenStreetMap) + lista locațiilor cu filtru |
| `magazin.html` | Catalog de produse cu categorii și căutare; comanda se trimite pe WhatsApp/email |
| `vending.html` | Pagina pentru parteneri: „Vrei un aparat în locația ta?” + formular |
| `contact.html` | Date de contact și formular |

## Ce modifici și unde

Toate datele se schimbă din fișierele din `assets/js/`, fără să atingi HTML-ul:

- **`config.js`** – WhatsApp, email, adresă, date firmă (CUI, Reg. Com.), linkuri Facebook/Instagram.
- **`locations.js`** – locațiile de pe hartă. Pentru o locație nouă copiezi un bloc `{ ... }` și completezi câmpurile.
- **`products.js`** – produsele din magazin (nume, preț, categorie, descriere, imagine, stoc).

### Coordonatele pe hartă

Pentru o locație nouă, coordonatele le iei așa:
1. Deschide Google Maps și găsește locul exact.
2. Click dreapta pe el → primul rând sunt coordonatele (ex. `47.18350, 25.77050`).
3. Le treci la `lat` și `lng` în `locations.js` (și în `config.js` pentru locația proprie).

### Imagini pentru produse

Pune pozele în `assets/img/produse/` (JPG, ~800 px lățime) și scrie calea la câmpul `image`, ex. `"assets/img/produse/espresso.jpg"`. Fără imagine se afișează o iconiță.

## Cum funcționează comenzile

Nu există plată online. Clientul apasă „Comandă pe WhatsApp” și i se deschide un mesaj gata completat către numărul din `config.js`. Formularele de parteneriat și contact funcționează la fel (WhatsApp sau email). Pentru comenzi pe email setează `orderChannel: "email"`.

## Publicare pe GitHub Pages

1. Pe GitHub: **Settings → Pages**.
2. La „Source” alegi branch-ul și folderul `/ (root)`.
3. După câteva minute site-ul e disponibil la `https://<utilizator>.github.io/coffee-snacks/`.

Pentru un domeniu propriu (ex. `coffeesnacks.ro`) îl adaugi în aceeași pagină, la „Custom domain”.

## Testare locală

```bash
python3 -m http.server 8000
# deschide http://localhost:8000
```

## Înainte de lansare

- [ ] Completează emailul și Nr. Reg. Com. în `config.js`
- [ ] Înlocuiește produsele exemplu din `products.js` cu produsele reale
- [ ] Adaugă linkurile reale de Facebook / Instagram
