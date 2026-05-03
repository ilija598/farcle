# Farcle

Radni zapis projekta za slucaj da se izgubi kontekst. Ovo je browser igra sa kockicama. Frontend je staticki (`index.html`, `styles.css`, `game.js`), a online multiplayer koristi tanak PHP + MySQL backend na InfinityFree.

## Trenutno stanje

- AI mod radi lokalno u browseru.
- Online multiplayer radi preko soba sa imenom, kodom ili preko liste otvorenih soba na `Pronadji sobu`.
- Multiplayer nije WebSocket; koristi polling prema PHP endpointima.
- Game state se cuva kao JSON u MySQL tabeli `rooms`.
- Zvukovi su lokalni MP3 fajlovi u `assets/sounds/`.
- Postoji mute dugme gore desno, vidljivo na landing ekranu i u igri.
- Host bira 2-4 igraca za sobu i startuje partiju dugmetom `Start`.
- Host unosi ime sobe, a svaki igrac unosi ime koje ce se prikazati u partiji.
- Refresh u multiplayeru vraca igraca u sobu preko `localStorage`.
- Multiplayer ima chat koji se cuva u `state_json`.
- `Izlaz` u multiplayeru znaci forfeit i stvarni izlazak iz sobe.

## Fajlovi

- `index.html` - markup, landing, igra, pravila, "Kako se igra", dugmad.
- `styles.css` - kompletan izgled, responsive layout, animacije, mute dugme.
- `game.js` - pravila igre, AI, zvukovi, multiplayer polling, restore session, UI logika.
- `README.md` - ovaj radni zapis.
- `assets/sounds/` - MP3 zvukovi.
- `api/` - PHP backend.

## Backend fajlovi

- `api/config.php` - bez tajni; cita env varijable ako postoje.
- `api/config.local.php` - stvarni DB kredencijali na serveru. Ne commitovati i ne deliti.
- `api/config.local.sample.php` - primer lokalne konfiguracije.
- `api/config.sample.php` - primer konfiguracije.
- `api/db.php` - PDO konekcija, JSON helpers, room/token helpers.
- `api/schema.sql` - SQL za novu instalaciju baze.
- `api/migrations.sql` - migracija za `version` kolonu ako je tabela starija.
- `api/create_room.php` - pravi sobu i vraca room code + token za igraca 1.
- `api/join_room.php` - igrac ulazi u izabranu sobu dok je lobby u `waiting` statusu.
- `api/list_rooms.php` - vraca otvorene sobe za prikaz u lobby listi; ne ulazi automatski ni u jednu sobu.
- `api/start_room.php` - host startuje lobby kada ima bar 2 igraca.
- `api/send_message.php` - dodaje chat poruku u room state.
- `api/get_state.php` - polling endpoint za trenutno stanje sobe.
- `api/save_state.php` - cuva state posle roll/keep/turn/reset akcija.
- `api/timeout_turn.php` - server-side zavrsava potez kad istekne 60s.
- `api/forfeit_room.php` - izlaz/predaja; drugi igrac dobija 10050 i pobedu.
- `api/health.php` - debug endpoint za proveru DB konekcije i kolona.

## InfinityFree konfiguracija

Trenutni podaci koji su uneti u `api/config.php`:

- `DB_HOST`: `sql213.infinityfree.com`
- `DB_PORT`: `3306`
- `DB_NAME`: `if0_41800151_farcle`
- `DB_USER`: `if0_41800151`
- `DB_PASS`: upisuje se samo u `api/config.local.php` na serveru
- `DB_CHARSET`: `utf8mb4`

DB password se vise ne drzi u `api/config.php`.
Na serveru napraviti `api/config.local.php` iz `api/config.local.sample.php` i popuniti vrednosti.
Ako `api/config.local.php` vec postoji na serveru, ne pregaziti ga deploy-om.

## MySQL tabela

Tabela treba da izgleda ovako:

```sql
CREATE TABLE IF NOT EXISTS rooms (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(8) NOT NULL,
  state_json MEDIUMTEXT NOT NULL,
  player1_token VARCHAR(64) NOT NULL,
  player2_token VARCHAR(64) DEFAULT NULL,
  player_tokens_json MEDIUMTEXT DEFAULT NULL,
  host_token VARCHAR(64) DEFAULT NULL,
  max_players TINYINT UNSIGNED NOT NULL DEFAULT 2,
  status ENUM('waiting', 'active', 'finished') NOT NULL DEFAULT 'waiting',
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY rooms_code_unique (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Ako tabela postoji bez `version`, pokrenuti:

```sql
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS version INT UNSIGNED NOT NULL DEFAULT 1 AFTER status;

ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS player_tokens_json MEDIUMTEXT DEFAULT NULL AFTER player2_token,
  ADD COLUMN IF NOT EXISTS host_token VARCHAR(64) DEFAULT NULL AFTER player_tokens_json,
  ADD COLUMN IF NOT EXISTS max_players TINYINT UNSIGNED NOT NULL DEFAULT 2 AFTER host_token;
```

## Deploy

Uploadovati na hosting:

- `index.html`
- `styles.css`
- `game.js`
- `assets/sounds/`
- `api/*.php`

Ne mora na server:

- `README.md`
- `api/schema.sql`
- `api/migrations.sql`
- `api/config.sample.php`
- `api/config.local.sample.php`

Paziti: `api/config.local.php` mora ostati na serveru sa pravim DB podacima i ne treba ga uploadovati u javne kopije.

Posle deploy-a uraditi hard refresh. Trenutni `index.html` koristi `styles.css?v=18` i `game.js?v=18`; ista verzija se prikazuje u headeru igre. Povecati broj pri sledecem deploy-u ako se menja CSS/JS.
Ako korisnik ima star cache, otvoriti:

```text
https://farcle.wuaze.com/?v=2
```

Bitno: `index.html` i `game.js` moraju ici zajedno. Ako novi HTML ukloni stare player elemente, a browser zadrzi stari JS, javlja se greska tipa `Cannot set properties of null (setting 'textContent')`.

## Multiplayer tok

- Igrac 1 unese svoje ime, ime sobe, klikne `Multiplayer`, zatim `Napravi sobu`.
- Igrac 1 prvo bira 2, 3 ili 4 igraca za sobu.
- Backend kreira sobu sa statusom `waiting`.
- Dok je soba `waiting`, timer stoji na 60 i niko ne moze da igra.
- Ostali igraci unesu svoje ime i mogu da unesu kod i kliknu `Udji`, ili da kliknu `Pronadji sobu`.
- `Pronadji sobu` samo prikazuje listu otvorenih soba; igrac mora da klikne konkretnu sobu za ulazak.
- `join_room.php` dodaje igraca u izabrani lobby dok soba nije puna.
- Host klikne `Start`; `start_room.php` setuje status na `active` i postavlja prvi `turnDeadlineAt`.
- Svi browseri polluju `get_state.php` na oko 1.2s.
- Kontrole su zakljucane ako nije tvoj potez.
- `localStorage` cuva `{ roomCode, playerToken, playerIndex }` pod kljucem `farcleRoom`.
- Ako igrac refreshuje browser, `restoreMultiplayerSession()` ga vraca u sobu.
- `Izlaz` poziva `forfeit_room.php`, brise lokalni session i vraca igraca na landing.
- Drugi igrac posle forfeit-a dobija skor `10050` i partija je zavrsena.

## Timer i AFK

- Svaki aktivan potez u multiplayeru ima 60 sekundi.
- Timer NE krece dok oba igraca nisu u sobi.
- Timer se NE resetuje na `Baci`.
- Timer se resetuje na `Sacuvaj izabrano`.
- Timer se resetuje kada potez predje na drugog igraca.
- Ako istekne 60s, frontend zove `api/timeout_turn.php`.
- Backend proverava deadline i tek onda zavrsava potez.
- Timeout uvek daje 0 poena za taj potez.
- Timeout upisuje AFK strike `1/2`.
- Posle `2/2`, igrac postaje diskvalifikovan i dobija `aiControlled: true`.
- AI tada preuzima njegove poteze.

Napomena: na shared hostingu PHP ne moze sam da pokrene timer bez requesta. Timeout se desava kada neki browser polluje/pozove endpoint posle isteka.

## Pravila igre

- Cilj je preci 10000 poena i ostati ispred posle protivnikovog odgovora.
- Kada jedan igrac predje 10000, drugi igrac dobija odgovor da ga stigne ili prestigne.
- Ako ga stigne/prestigne, igra se nastavlja i prvi igrac opet odgovara.
- Pobeda se dodeljuje tek kada protivnik zavrsi odgovor i ostane iza.
- U zavrsnici state nosi `finishLeaderIndex`, tj. igraca ciji skor trenutno mora da se stigne.
- Minimum za upis poteza je 350 poena.
- Od 9000 ukupnih poena minimum za upis je 1000 poena.
- Od 9000 ukupnih poena ne upisuju se Farkle crtice i ne skidaju se poeni.
- Jedinica vredi 100.
- Petica vredi 50.
- Tri jedinice vrede 1000.
- Tri iste vrednosti 2-6 vrede `vrednost * 100`.
- Cetiri, pet i sest istih dalje dupliraju vrednost grupe.
- Kenta `1-2-3-4-5-6` vredi 1500.
- Tri para vrede 750.
- Tri crtice (`///`) skidaju 1000 poena, osim sto preko 9000 nema crtica.
- Uspesan upis poteza brise crtice.
- Kada se sacuva svih 6 kockica, igrac mora jos jednom da baci i sacuva bar jednu kockicu pre upisa.

## UI i UX

- Landing ima `Protiv AI` i `Multiplayer`.
- Multiplayer panel ima `Napravi sobu`, input za kod i `Udji`.
- Mute dugme je fiksno gore desno.
- U igri postoji `Kako se igra` panel.
- Selektovane kockice su jarko crvene.
- Bodovne jedinice/petice su bronzane.
- Grupe od 3+ istih su zlatne.
- Bacanje kockica ima animaciju kotrljanja i menja lica tokom animacije, tako da se rezultat ne vidi odmah.

## Zvukovi

Zvukovi se ucitavaju iz:

- `assets/sounds/dice-roll.mp3`
- `assets/sounds/pairs.mp3`
- `assets/sounds/kenta.mp3`
- `assets/sounds/big-hand.mp3`
- `assets/sounds/farcle.mp3`
- `assets/sounds/manual-farcle.mp3`

Mapiranje:

- `dice-roll` - kada se klikne `Baci`.
- `pairs` - tri para.
- `kenta` - kenta.
- `big-hand` - izbor ili upis od `>= 2000` poena.
- `farcle` - obican Farkle.
- `manual-farcle` - kada bacanje svih 6 kockica nema nijednu bodovnu kockicu.

Browser autoplay pravilo:

- `unlockAudio()` radi na prvi `pointerdown` ili `keydown`.
- Mute stanje se cuva u `localStorage` pod `farcleSoundsMuted`.

## AI

- AI bira najbolju validnu kombinaciju iz svih podskupova aktivnih kockica.
- AI bankuje opreznije u zavisnosti od skora, broja preostalih kockica i stanja zavrsnice.
- AI zna da juri protivnika ako protivnik ima 10000+.
- U multiplayeru AI moze da preuzme igraca posle 2 AFK strike-a.

## Vazne implementacione napomene

- Backend je namerno tanak i cuva state kao JSON. Pravila su uglavnom u `game.js`.
- Ovo olaksava buducu zamenu PHP backend-a Python/FastAPI backendom.
- `finishLeaderIndex` u state-u pamti ko je presao 10000 i ceka odgovor protivnika.
- `save_state.php` razlikuje akcije:
  - `roll` - ne resetuje deadline; backend zadrzava stari `turnDeadlineAt`.
  - `keep` - resetuje deadline na serveru.
  - `turn` - resetuje deadline za sledeceg igraca.
  - `reset` - resetuje igru.
  - `farkle:<index>` - dozvoljava cuvanje state-a posle Farkle-a gde je vec promenjen current player.
- `save_state.php` trazi `expectedVersion` i koristi optimistic locking da spreci pregazene poteze.
- `save_state.php` radi osnovnu server-side validaciju akcija i skorova.
- `send_message.php` koristi version check/retry da chat poruka ne pregazi potez koji je stigao u isto vreme.
- `timeout_turn.php` server-side zavrsava potez i upisuje AFK strike.
- `forfeit_room.php` zavrsava partiju i setuje protivnika na 10050.
- `health.php` sluzi za debug ako API vraca HTML umesto JSON-a.

## Debug

Ako frontend prikaze `Unexpected token '<'` ili `API ... ne vraca JSON`, PHP endpoint vraca HTML error page.

Proveriti:

```text
https://farcle.wuaze.com/api/health.php
https://farcle.wuaze.com/api/get_state.php
```

`get_state.php` bez parametara treba da vrati JSON gresku:

```json
{"ok":false,"error":"Missing room code or token."}
```

Ako vrati HTML, problem je PHP/server/config, ne frontend.

## Poznati operativni detalji

- Nakon deploy-a telefoni cesto drze star `game.js`. Koristiti hard refresh ili `?v=...`.
- Ako samo jedan korisnik vidi bug, prvo proveriti cache.
- Ako MP ne radi posle izmene SQL-a, proveriti `SHOW CREATE TABLE rooms;`.
- `php` CLI nije instaliran lokalno u ovom workspace-u, pa PHP lint nije pokretan lokalno.
