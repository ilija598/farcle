# Farcle

Farcle je browser igra sa kockicama, napravljena kao mala staticka HTML/CSS/JS aplikacija.

## Pokretanje

Otvori `index.html` direktno u browseru.

Nema instalacije, build procesa ili dodatnih dependency-ja.

## Trenutno stanje

- Igra radi lokalno u browseru.
- Kod je razdvojen na `index.html`, `styles.css` i `game.js`.
- Pocetni ekran nudi igru protiv AI igraca.
- Multiplayer dugme je prikazano kao work in progress.
- Igrac 1 igra protiv AI igraca.
- Cilj igre je 10000 poena.
- Dugme za upis poteza postuje minimum poena.
- Selektovane kockice imaju jak crveni highlight.
- Jedinice i petice koje mogu da se cuvaju su bronzane.
- Grupe od 3 ili vise istih kockica su zlatne.
- Bacanje kockica ima tumbling animaciju sa razlicitim pravcem i rotacijom po kockici.
- AI bira najbolju validnu kombinaciju iz bacanja i ima oprezniju logiku za upis poena.

## Struktura

- `index.html` drzi markup i ucitava CSS/JS fajlove.
- `styles.css` drzi kompletan izgled i animacije.
- `game.js` drzi pravila igre, stanje partije, AI i interakcije.

## Pravila

- Minimum za upis poteza je 350 poena.
- Od 9000 ukupnih poena, minimum za upis poteza je 1000 poena.
- Jedinica vredi 100 poena.
- Petica vredi 50 poena.
- Tri jedinice vrede 1000 poena.
- Tri iste vrednosti 2-6 vrede `vrednost * 100`.
- Cetiri, pet i sest istih dalje dupliraju vrednost grupe.
- Kenta `1-2-3-4-5-6` vredi 1500 poena.
- Tri para vrede 750 poena.
- Ako bacanje nema nijednu bodovnu kockicu, potez se zavrsava kao Farkle.
- Tri crtice skidaju 1000 poena.
- Uspesan upis poteza brise crtice.
- Kada igrac sacuva svih 6 kockica, mora ponovo da baci i sacuva bar jednu kockicu pre upisa.

## Kontrole

- `Baci` baca dostupne kockice.
- Klik na kockicu bira ili skida izbor.
- Klik na jednu kockicu iz grupe od 3 ili vise istih bira celu grupu.
- `Sacuvaj izabrano` dodaje izabrane bodove u trenutnu rundu.
- `Zavrsi potez` upisuje bodove u ukupni skor.
- `Space` baca kockice.
- `Enter` cuva izabrane kockice.

## Planirano

- Ispravke i poboljsanje AI logike.
- Multiplayer mod.
- Bolji tok partije za vise igraca.
- Eventualno razdvajanje `index.html` na HTML, CSS i JS fajlove ako projekat poraste.
