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

- **`config.js`** – WhatsApp, email, adresă, date firmă (CUI, Reg. Com., sediu social, IBAN), livrare (curier, cost, termen), emailul de confirmare (EmailJS), linkuri Facebook/Instagram.
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

Nu există plată online. Clientul pune produsele în coș (gramaj, boabe sau măcinată, cantitate), completează numele și telefonul și apasă „Trimite comanda pe WhatsApp”: i se deschide un mesaj gata completat, cu toate produsele și totalul, către numărul din `config.js`. Coșul se păstrează în browserul clientului. Formularele de parteneriat și contact funcționează la fel (WhatsApp sau email). Pentru comenzi pe email setează `orderChannel: "email"`.

## Emailul de confirmare a comenzii (EmailJS)

Site-ul nu are server, așa că emailurile pleacă prin [EmailJS](https://www.emailjs.com) (plan gratuit: 200 de emailuri pe lună). Cât timp datele EmailJS din `config.js` sunt goale, comanda se trimite doar pe WhatsApp.

1. Fă-ți cont pe emailjs.com și, la **Email Services**, conectează adresa de email a firmei (Gmail, Outlook etc.). Notează **Service ID**.
2. La **Email Templates** creează un șablon:
   - **To Email:** `{{to_email}}` · **Bcc:** adresa ta (primești o copie la fiecare comandă) · **Reply To:** adresa ta
   - **Subject:** `Am primit comanda {{order_id}} – Coffee & Snacks`
   - **Conținut:**
     ```
     Bună, {{to_name}}!

     Am primit comanda ta {{order_id}}:
     {{order_lines}}

     Produse: {{subtotal}}
     Transport: {{shipping}}
     Total: {{total}}

     Telefon: {{phone}}
     Adresă livrare: {{address}}
     Observații: {{notes}}

     Te contactăm în curând pentru confirmarea stocului, a transportului și a plății.
     Comanda devine fermă după confirmarea noastră.

     {{shop_name}} · {{shop_email}} · WhatsApp {{shop_whatsapp}}
     ```
   Notează **Template ID**.
3. La **Account → General** copiază **Public Key**.
4. Completează `emailjs: { publicKey, serviceId, templateId }` în `config.js`.
5. În EmailJS, la **Account → Security**, pune domeniul site-ului la „Allowed origins”, ca să nu poată trimite altcineva emailuri cu cheia ta.

## Pagini legale

`termeni-si-conditii.html`, `politica-de-confidentialitate.html`, `politica-cookies.html`, `politica-de-livrare.html`, `metode-de-plata.html`, `politica-de-retur.html`, `garantia-produselor.html`, `formular-de-retur.html`. Datele firmei din ele (denumire, CUI, Reg. Com., sediu, email, IBAN, livrare) se iau din `config.js`. Textele sunt un punct de plecare – citește-le și, ideal, verifică-le cu un avocat sau contabil înainte de lansare.

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

- [ ] Completează în `config.js`: emailul real, Nr. Reg. Com., sediul social, IBAN-ul, datele de livrare
- [ ] Configurează EmailJS pentru emailul de confirmare (vezi mai sus)
- [ ] Activează autentificarea în doi pași (2FA) pe contul GitHub care are acces la repo
- [ ] Verifică prețurile Fresso din `products.js` (coffeepoint.ro din 27.10.2026 + 35% specialitate / + 25% boabe 1 kg)
- [ ] Adaugă pozele care lipsesc în `assets/img/produse/` (Blue, Green, Intense, Red)
- [ ] Adaugă linkurile reale de Facebook / Instagram
