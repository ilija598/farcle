# Farcle

Project notes for the browser dice game. The frontend is static (`index.html`, `styles.css`, `game.js`), while online multiplayer uses a small PHP + MySQL backend hosted on InfinityFree.

## Current State

- English is the default UI language.
- The UI can switch between English and Serbian with the `EN/RS` button.
- AI mode runs locally in the browser.
- Online multiplayer works through named rooms, room codes, and the open-room list.
- Multiplayer is polling based, not WebSocket based.
- Game state is stored as JSON in the MySQL `rooms` table.
- Sounds are local MP3 files in `assets/sounds/`.
- The sound button is visible on the landing screen and in the game menu.
- The host chooses 2-4 players and starts the game with `Start`.
- The host enters a room name; every player enters a display name.
- Multiplayer refresh/reconnect restores the player through `localStorage`.
- Multiplayer includes chat stored in `state_json`.
- `Exit` in active multiplayer forfeits the game; after game over it only leaves the room.
- Admin testing mode starts by entering room code `ACAB9`; it runs a local AI game with buttons for forced dice combinations.

## Files

- `index.html` - markup, landing screen, game screen, modals, controls.
- `styles.css` - full UI styling, responsive layout, animations.
- `game.js` - game rules, UI logic, language switching, AI, sounds, multiplayer polling, session restore.
- `README.md` - this project note.
- `assets/sounds/` - MP3 sounds.
- `api/` - PHP backend.

## Backend Files

- `api/config.php` - secretless config; reads environment variables if available.
- `api/config.local.php` - real DB credentials on the server. Do not commit or share.
- `api/config.local.sample.php` - sample local config.
- `api/config.sample.php` - sample config.
- `api/db.php` - PDO connection, JSON helpers, room/token helpers.
- `api/schema.sql` - SQL for a fresh install.
- `api/migrations.sql` - migration for older tables.
- `api/create_room.php` - creates a room and returns room code + host token.
- `api/join_room.php` - joins a selected waiting room.
- `api/list_rooms.php` - returns open rooms; does not auto-join.
- `api/start_room.php` - host starts a waiting room with at least 2 players.
- `api/send_message.php` - appends chat messages to room state.
- `api/get_state.php` - polling endpoint.
- `api/save_state.php` - saves state after roll/keep/turn/reset actions.
- `api/timeout_turn.php` - ends a turn server-side after the 60s deadline.
- `api/forfeit_room.php` - forfeit/exit endpoint.
- `api/health.php` - debug endpoint for DB/config checks.

## InfinityFree Configuration

Known non-secret settings:

- `DB_HOST`: `sql213.infinityfree.com`
- `DB_PORT`: `3306`
- `DB_NAME`: `if0_41800151_farcle`
- `DB_USER`: `if0_41800151`
- `DB_PASS`: only in `api/config.local.php` on the server
- `DB_CHARSET`: `utf8mb4`

The DB password must not live in `api/config.php`.
Keep `api/config.local.php` on the server with the real credentials and do not overwrite it with deploys.

## MySQL Table

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

For older tables:

```sql
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS version INT UNSIGNED NOT NULL DEFAULT 1 AFTER status;

ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS player_tokens_json MEDIUMTEXT DEFAULT NULL AFTER player2_token,
  ADD COLUMN IF NOT EXISTS host_token VARCHAR(64) DEFAULT NULL AFTER player_tokens_json,
  ADD COLUMN IF NOT EXISTS max_players TINYINT UNSIGNED NOT NULL DEFAULT 2 AFTER host_token;
```

## Deploy

Upload:

- `index.html`
- `styles.css`
- `game.js`
- `assets/sounds/`
- `api/*.php`

Do not upload as public/shared files:

- `README.md`
- `api/schema.sql`
- `api/migrations.sql`
- `api/config.sample.php`
- `api/config.local.sample.php`

Important: `api/config.local.php` must stay on the server with the real DB credentials.

Current cache-busted frontend version:

- `styles.css?v=24`
- `game.js?v=24`
- header version: `v24`

`index.html` and `game.js` must be deployed together. If new HTML and old JS get mixed by cache, null DOM errors can happen.

## Multiplayer Flow

- Player 1 enters their name, room name, player count, then creates a room.
- The backend creates a `waiting` room.
- While the room is waiting, the timer is stopped and no one can play.
- Other players enter their names and either join by code or use the open-room list.
- `Find room` only displays rooms; the player must click a room to join.
- Host clicks `Start`; `start_room.php` sets status to `active`.
- Browsers poll `get_state.php` roughly every 1.2s.
- Controls are locked when it is not your turn.
- `localStorage` stores `{ roomCode, playerToken, playerIndex }` under `farcleRoom`.
- Refresh restores the player into the room.
- Active multiplayer `Exit` calls `forfeit_room.php`; after game over, `Exit` only leaves locally.

## Timer And AFK

- Every active multiplayer turn has 60 seconds.
- The timer does not run in the waiting lobby.
- The timer does not reset on `Roll`.
- The timer resets on `Keep selected`.
- The timer resets when the turn passes.
- If time expires, the frontend calls `api/timeout_turn.php`.
- Timeout gives 0 points for that turn.
- Timeout adds AFK strike `1/2`.
- After `2/2`, the player is marked `aiControlled: true` and AI takes over.

Shared hosting cannot run its own background timer; timeout is resolved when a browser polls after the deadline.

## Game Rules

- Goal: pass 10000 points and stay ahead after the answering turn.
- When a player passes 10000, the next player gets a chance to catch or beat them.
- If they catch/beat the leader, play continues and the new leader waits for an answer.
- The winner is declared only when the answering player finishes behind.
- `finishLeaderIndex` tracks the leader who must be caught.
- Minimum bank is 350 round points.
- From 9000 total points, minimum bank is 1000.
- From 9000 total points, Farkle marks and the -1000 penalty are disabled.
- A single 1 is worth 100.
- A single 5 is worth 50.
- Three 1s are worth 1000.
- Three of a kind from 2-6 are worth `value * 100`.
- Four, five and six of a kind keep doubling the group value.
- Straight `1-2-3-4-5-6` is worth 1500.
- Three pairs are worth 750.
- Three marks (`///`) remove 1000 points, except over 9000.
- A successful bank clears marks.
- If all 6 dice are kept, the player must roll and keep at least one die before banking.

## UI And UX

- Landing has `Vs AI` and `Multiplayer`.
- Language toggle is `EN/RS`; English is default.
- Multiplayer panel has `Create room`, room code input, and `Join`.
- Sound is an icon button.
- `Rules` and `How to play` open modal windows.
- Selected dice are red.
- Scoring single 1s/5s are bronze.
- Groups of 3+ are gold.
- Dice rolling is animated.

## Sounds

Loaded from:

- `assets/sounds/dice-roll.mp3`
- `assets/sounds/pairs.mp3`
- `assets/sounds/kenta.mp3`
- `assets/sounds/big-hand.mp3`
- `assets/sounds/farcle.mp3`
- `assets/sounds/manual-farcle.mp3`

Mapping:

- `dice-roll` - Roll.
- `pairs` - three pairs.
- `kenta` - straight.
- `big-hand` - selection or bank of `>= 2000`.
- `farcle` - normal Farkle.
- `manual-farcle` - full six-dice roll with no scoring dice.

Browser autoplay:

- `unlockAudio()` runs on the first `pointerdown` or `keydown`.
- Mute state is stored in `localStorage` as `farcleSoundsMuted`.

## AI

- AI chooses the best valid selection from all active dice subsets.
- AI banking considers score, dice left, and endgame state.
- AI can chase a 10000+ opponent.
- In multiplayer, AI can take over after 2 AFK strikes.
- AI code is still inside `game.js`; the next cleanup step is to extract it into a separate `ai.js`.

## Implementation Notes

- Backend is intentionally thin and stores state as JSON.
- Most rules live in `game.js`.
- `save_state.php` requires `expectedVersion` and uses optimistic locking.
- `save_state.php` performs basic server-side validation for actions and scores.
- `send_message.php` uses version check/retry so chat cannot overwrite simultaneous gameplay state.
- `timeout_turn.php` ends timed-out turns server-side.
- `forfeit_room.php` finishes the game and gives the opponent 10050.
- `health.php` is for debugging HTML/non-JSON API responses.

## Debug

If frontend shows `Unexpected token '<'` or `API ... does not return JSON`, the PHP endpoint is returning an HTML error page.

Check:

```text
https://farcle.wuaze.com/api/health.php
https://farcle.wuaze.com/api/get_state.php
```

`get_state.php` without parameters should return JSON:

```json
{"ok":false,"error":"Missing room code or token."}
```

If it returns HTML, the problem is PHP/server/config, not frontend JS.

## Operational Notes

- Phones often keep old `game.js` after deploy. Use hard refresh or a cache-busted URL.
- If only one user sees a bug, check cache first.
- If multiplayer fails after SQL changes, check `SHOW CREATE TABLE rooms;`.
- `php` CLI is not installed locally in this workspace, so PHP lint cannot be run here.
