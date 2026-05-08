const modeScreen = document.getElementById("modeScreen");
    const gameApp = document.getElementById("gameApp");
    const aiModeBtn = document.getElementById("aiModeBtn");
    const multiplayerModeBtn = document.getElementById("multiplayerModeBtn");
    const soundToggleButtons = [
      document.getElementById("soundToggle"),
      document.getElementById("soundToggleGame")
    ].filter(Boolean);
    const mpPanel = document.getElementById("mpPanel");
    const createRoomBtn = document.getElementById("createRoomBtn");
    const findRoomBtn = document.getElementById("findRoomBtn");
    const joinRoomBtn = document.getElementById("joinRoomBtn");
    const maxPlayersSelect = document.getElementById("maxPlayersSelect");
    const playerNameInput = document.getElementById("playerNameInput");
    const roomNameInput = document.getElementById("roomNameInput");
    const roomCodeInput = document.getElementById("roomCodeInput");
    const roomResults = document.getElementById("roomResults");
    const roomStatusText = document.getElementById("roomStatusText");
    const roomBadge = document.getElementById("roomBadge");
    const roomCodeText = document.getElementById("roomCodeText");
    const appVersionText = document.getElementById("appVersionText");
    const startRoomBtn = document.getElementById("startRoomBtn");
    const playersList = document.getElementById("playersList");
    const diceWrap = document.getElementById("diceWrap");
    const rollBtn = document.getElementById("rollBtn");
    const keepBtn = document.getElementById("keepBtn");
    const bankBtn = document.getElementById("bankBtn");
    const resetBtn = document.getElementById("resetBtn");
    const rulesBtn = document.getElementById("rulesBtn");
    const howToBtn = document.getElementById("howToBtn");
    const leaveRoomBtn = document.getElementById("leaveRoomBtn");
    const turnText = document.getElementById("turnText");
    const turnPointsEl = document.getElementById("turnPoints");
    const selectedPointsEl = document.getElementById("selectedPoints");
    const diceLeftEl = document.getElementById("diceLeft");
    const turnTimerEl = document.getElementById("turnTimer");
    const statusMeta = document.getElementById("statusMeta");
    const messageText = document.getElementById("messageText");
    const historyList = document.getElementById("historyList");
    const chatPanel = document.getElementById("chatPanel");
    const chatList = document.getElementById("chatList");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const infoModal = document.getElementById("infoModal");
    const infoModalTitle = document.getElementById("infoModalTitle");
    const infoModalClose = document.getElementById("infoModalClose");
    const rulesModalContent = document.getElementById("rulesModalContent");
    const howToModalContent = document.getElementById("howToModalContent");
    const specialBanner = document.getElementById("specialBanner");
    const languageToggleButtons = [
      document.getElementById("langToggle"),
      document.getElementById("langToggleGame")
    ].filter(Boolean);
    const resultModal = document.getElementById("resultModal");
    const resultKicker = document.getElementById("resultKicker");
    const resultTitle = document.getElementById("resultTitle");
    const resultText = document.getElementById("resultText");
    const resultScores = document.getElementById("resultScores");
    const resultPrimaryBtn = document.getElementById("resultPrimaryBtn");
    const resultSecondaryBtn = document.getElementById("resultSecondaryBtn");
    const testPanel = document.getElementById("testPanel");
    const testGrid = document.getElementById("testGrid");
    const testExitBtn = document.getElementById("testExitBtn");

    const pipMap = {
      1: [[50, 50]],
      2: [[28, 28], [72, 72]],
      3: [[28, 28], [50, 50], [72, 72]],
      4: [[28, 28], [72, 28], [28, 72], [72, 72]],
      5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
      6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]]
    };

    let players = [
      { name: "Player 1", score: 0, strikes: 0, timeoutStrikes: 0, aiControlled: false },
      { name: "Player 2", score: 0, strikes: 0, timeoutStrikes: 0, aiControlled: false }
    ];
    let savedDiceValues = [[], []];
    let chatMessages = [];
    let maxPlayers = 2;
    const standardBankMinimum = 350;
    const highScoreThreshold = 9000;
    const highScoreBankMinimum = 1000;
    const rollResolveDelay = 900;
    const rollFaceTickDelay = 70;
    const aiRollingWaitDelay = 700;
    const aiPostRollSelectionDelay = 900;
    const multiplayerPollDelay = 1200;
    const turnDurationMs = 60000;
    const appVersion = "v24";
    const i18n = {
      en: {
        langButton: "EN",
        soundOn: "Sound on",
        soundOff: "Sound off",
        chooseGame: "Choose game",
        yourName: "Your name",
        vsAi: "Vs AI",
        startGame: "Start game",
        multiplayer: "Multiplayer",
        createJoinRoom: "Create or join a room",
        roomName: "Room name",
        players: "Players",
        createRoom: "Create room",
        findRoom: "Find room",
        roomCode: "Room code",
        join: "Join",
        lobbyHelp: "Create a room or enter a code from another player.",
        newGame: "New game",
        rules: "Rules",
        howTo: "How to play",
        exit: "Exit",
        subtitleGame: "Farcle for 2-4 players",
        version: "Version",
        goal: "Goal",
        room: "Room",
        turn: "Turn: {name}",
        round: "Round",
        selected: "Selected",
        toRoll: "To roll",
        time: "Time",
        roll: "Roll",
        keepSelected: "Keep selected",
        endTurn: "End turn",
        startMessage: "Roll 6 dice to start your turn.",
        setDiceRoll: "Set dice roll",
        exitTest: "Exit test",
        history: "History",
        message: "Message",
        send: "Send",
        close: "Close",
        gameOver: "Game over",
        mpGameOver: "Multiplayer game over",
        victory: "Victory",
        lost: "Lost",
        rematch: "Rematch",
        emptyHistory: "No turns played yet.",
        noMessages: "No messages.",
        total: "Total",
        marks: "Marks",
        savedDice: "Saved dice",
        waitingPlayer: "Waiting for player {n}",
        player: "Player {n}",
        ai: "AI",
        testMode: "Testing mode ACAB9: set dice rolls with the admin buttons.",
        testApplied: "TEST: {label} ({values}).",
        roomCreated: "Room {code} created. Waiting for players ({count}/{max}).",
        waitStart: "Room {code} is waiting to start ({count}/{max}).",
        waitOther: "Room {code}: waiting for another player.",
        otherJoined: "Another player joined. Your turn.",
        roomStarted: "Game started.",
        restored: "Restored room {code}.",
        finished: "Game is finished.",
        restoring: "Restoring multiplayer room...",
        restoreFailed: "Could not restore previous room.",
        leftRoom: "You left the room.",
        creatingRoom: "Creating room...",
        enterCode: "Enter a room code.",
        searchingRooms: "Searching open rooms...",
        chooseRoom: "Choose a room from the list.",
        noRooms: "No open rooms.",
        joiningRoom: "Joining room...",
        joinedRoom: "Joined room {code}. Waiting for start.",
        testingStarted: "Testing mode ACAB9 started against AI.",
        roomPlayers: "{code} | {count}/{max} players",
        invalidFirst: "Keep selected dice first, or deselect them.",
        allDiceBack: "You used all dice. All 6 are back.",
        chooseScoring: "Choose scoring dice to keep.",
        invalidSelection: "Selected dice are not a valid scoring combination.",
        allSaved: "You kept all dice. Roll all 6 again.",
        keptPoints: "Kept {points} points. {remaining} dice left.",
        minBank: "You need at least {points} points to end the turn.",
        mustRollAfterAll: "After keeping all 6 dice, you must roll and keep at least one die before banking.",
        banked: "{name} banked {points} points.",
        playerRolls: "{name} rolls 6 dice.",
        kentaAuto: "Straight is kept automatically. Roll all 6 again.",
        pairsAuto: "Three pairs are kept automatically. Roll all 6 again.",
        winner: "{name} won with {points} points.",
        winnerText: "{name} won with {points} points.",
        loserText: "{name} won. Your score is {points}.",
        noScoring: "{name} has no scoring dice.",
        noMarksOver9000: " No marks over 9000.",
        threeMarks: " Three marks: -1000 points.",
        gotMark: " Got a mark.",
        farkleHistory: "{name}: Farkle",
        bankHistory: "{name}: banked turn",
        timeoutDone: "60 seconds expired. Turn ended.",
        rulesList: [
          "Goal: pass 10000 points and stay ahead after the other players get their answer turn.",
          "On your turn you roll dice, choose scoring dice, keep them, then decide whether to continue or bank points.",
          "A single 1 is worth 100 points. A single 5 is worth 50 points.",
          "Three 1s are worth 1000. Three of any number from 2 to 6 are worth that number times 100.",
          "Four, five and six of a kind double the group value: for example, three 2s are 200, four 2s are 400, five 2s are 800.",
          "A straight 1-2-3-4-5-6 is worth 1500. Three pairs are worth 750.",
          "You can only keep a valid scoring combination. Non-scoring dice cannot be kept alone.",
          "To end a turn you need at least 350 points this round. Once your total is 9000 or more, the minimum bank is 1000.",
          "If you keep all 6 dice, you get a fresh roll with all 6, but you must roll and keep at least one die before banking.",
          "If a roll has no scoring dice, it is a Farkle: you lose the round points and the turn passes.",
          "Each Farkle gives a mark. Three marks remove 1000 points. A successful bank clears marks.",
          "Over 9000 total points there are no Farkle marks and no -1000 penalty.",
          "When someone passes 10000, the next player gets a chance to catch or beat them. If they do, play continues and the new leader waits for an answer.",
          "The winner is declared only when the answering player finishes behind the current leader."
        ],
        howList: [
          "Click Roll. After the roll, click the dice you want to keep.",
          "Bronze dice are single 1s or 5s. Gold dice are groups of three or more.",
          "Red dice are currently selected. Click Keep selected to add them to the round.",
          "After keeping dice, choose: roll again for more points or end the turn to bank the round.",
          "You cannot end the turn until the round has at least 350 points, or 1000 if your total is 9000 or more.",
          "If selected dice are not kept, you cannot roll again. Keep them first or deselect them.",
          "If you use all 6 dice, the table clears and the next roll uses all 6 dice again.",
          "In multiplayer, the host creates a room, chooses 2-4 players and shares the code. Others can enter the code or click Find room.",
          "The game does not start until the host clicks Start. While the room is waiting, the timer does not run.",
          "In multiplayer, each active turn has 60 seconds. The timer resets when you keep dice or when the turn passes.",
          "If time expires, the turn ends with 0 points and you get an AFK warning. After 2 warnings, AI takes over that player.",
          "Exit in multiplayer forfeits the game while the game is active.",
          "Chat is in the lower panel and works while you are in a multiplayer room."
        ]
      },
      sr: {}
    };
    i18n.sr = {
      ...i18n.en,
      langButton: "RS",
      soundOn: "Zvuk ukljucen",
      soundOff: "Zvuk iskljucen",
      chooseGame: "Izaberi partiju",
      yourName: "Tvoje ime",
      vsAi: "Protiv AI",
      startGame: "Pokreni igru",
      createJoinRoom: "Napravi ili udji u sobu",
      roomName: "Ime sobe",
      players: "Igraci",
      createRoom: "Napravi sobu",
      findRoom: "Pronadji sobu",
      roomCode: "Kod sobe",
      join: "Udji",
      lobbyHelp: "Napravi sobu ili unesi kod koji ti je poslao drugi igrac.",
      newGame: "Nova partija",
      rules: "Pravila",
      howTo: "Kako se igra",
      exit: "Izlaz",
      subtitleGame: "Farcle za 2-4 igraca",
      version: "Verzija",
      goal: "Cilj",
      room: "Soba",
      turn: "Na potezu: {name}",
      round: "Runda",
      selected: "Izabrano",
      toRoll: "Za bacanje",
      time: "Vreme",
      roll: "Baci",
      keepSelected: "Sacuvaj izabrano",
      endTurn: "Zavrsi potez",
      startMessage: "Baci 6 kockica da zapocnes potez.",
      setDiceRoll: "Namesti bacanje",
      exitTest: "Izadji iz testa",
      history: "Istorija",
      message: "Poruka",
      send: "Posalji",
      close: "Zatvori",
      gameOver: "Kraj partije",
      mpGameOver: "Multiplayer kraj",
      lost: "Izgubljeno",
      rematch: "Revans",
      emptyHistory: "Jos nema odigranih poteza.",
      noMessages: "Nema poruka.",
      total: "Ukupno",
      marks: "Crtice",
      savedDice: "Sacuvane kockice",
      waitingPlayer: "Ceka igraca {n}",
      player: "Igrac {n}",
      testMode: "Testing mode ACAB9: namesti bacanje preko admin dugmica.",
      testApplied: "TEST: {label} ({values}).",
      roomCreated: "Soba {code} je napravljena. Ceka igrace ({count}/{max}).",
      waitStart: "Soba {code} ceka start ({count}/{max}).",
      waitOther: "Soba {code}: cekas potez drugog igraca.",
      otherJoined: "Drugi igrac je usao. Tvoj potez.",
      roomStarted: "Partija je startovana.",
      restored: "Vracen si u sobu {code}.",
      finished: "Partija je zavrsena.",
      restoring: "Vracam multiplayer sobu...",
      restoreFailed: "Nije moguce vratiti prethodnu sobu.",
      leftRoom: "Izasao si iz sobe.",
      creatingRoom: "Pravim sobu...",
      enterCode: "Unesi kod sobe.",
      searchingRooms: "Trazim otvorene sobe...",
      chooseRoom: "Izaberi sobu iz liste.",
      noRooms: "Nema otvorenih soba.",
      joiningRoom: "Ulazim u sobu...",
      joinedRoom: "Usao si u sobu {code}. Ceka se start.",
      testingStarted: "Testing mode ACAB9 je pokrenut protiv AI.",
      roomPlayers: "{code} | {count}/{max} igraca",
      invalidFirst: "Prvo sacuvaj izabrane kockice ili ih odznaci.",
      allDiceBack: "Iskoristio si sve kockice, vraca se svih 6.",
      chooseScoring: "Izaberi bodovne kockice koje hoces da sacuvas.",
      invalidSelection: "Izabrane kockice nisu validna bodovna kombinacija.",
      allSaved: "Sacuvao si sve kockice. Bacas ponovo svih 6.",
      keptPoints: "Sacuvano {points} poena. Ostaje {remaining} kockica.",
      minBank: "Za kraj poteza treba minimum {points} poena.",
      mustRollAfterAll: "Posle svih 6 sacuvanih moras jos jednom da bacis i sacuvas bar jednu kockicu.",
      banked: "{name} je upisao {points} poena.",
      playerRolls: "{name} baca 6 kockica.",
      kentaAuto: "Kenta se automatski upisuje. Bacas ponovo svih 6.",
      pairsAuto: "Tri para se automatski upisuju. Bacas ponovo svih 6.",
      winner: "{name} je pobedio sa {points} poena.",
      winnerText: "{name} je pobedio sa {points} poena.",
      loserText: "{name} je pobedio. Tvoj rezultat je {points}.",
      noScoring: "{name} nema bodovnu kombinaciju.",
      noMarksOver9000: " Preko 9000 nema crtica.",
      threeMarks: " Tri crtice: -1000 poena.",
      gotMark: " Dobijena crtica.",
      farkleHistory: "{name}: Farkle",
      bankHistory: "{name}: upisao potez",
      timeoutDone: "Isteklo je 60 sekundi. Potez je zavrsen.",
      rulesList: [
        "Cilj je preci 10000 poena i ostati ispred kada ostali igraci zavrse odgovor.",
        "U potezu bacas kockice, biras bodovne kockice, cuvas ih, pa odlucujes da li nastavljas ili upisujes poene.",
        "Jedinica vredi 100 poena. Petica vredi 50 poena.",
        "Tri jedinice vrede 1000. Tri iste od 2 do 6 vrede broj kockice puta 100.",
        "Cetiri, pet i sest istih dupliraju vrednost grupe: na primer 3 dvojke su 200, 4 dvojke 400, 5 dvojki 800.",
        "Kenta 1-2-3-4-5-6 vredi 1500 poena. Tri para vrede 750 poena.",
        "Mozes sacuvati samo validnu bodovnu kombinaciju. Kockice koje nisu bodovne ne mogu same da se cuvaju.",
        "Za zavrsetak poteza treba minimum 350 poena u toj rundi. Kada imas 9000 ili vise ukupno, minimum za upis je 1000.",
        "Ako sacuvas svih 6 kockica, dobijas novo bacanje sa svih 6, ali moras jos jednom da bacis i sacuvas bar jednu kockicu pre upisa.",
        "Ako bacanje nema nijednu bodovnu kockicu, to je Farkle: gubis poene iz trenutne runde i potez prelazi dalje.",
        "Svaki Farkle daje crticu. Tri crtice skidaju 1000 poena. Uspesan upis poteza brise crtice.",
        "Preko 9000 ukupnih poena nema crtica i ne skida se 1000 poena za Farkle.",
        "Kada neko predje 10000, sledeci igrac dobija sansu da ga stigne ili prestigne. Ako ga stigne, igra se nastavlja i novi lider ceka odgovor.",
        "Pobednik se proglasava tek kada igrac koji odgovara zavrsi potez i ostane iza trenutnog lidera."
      ],
      howList: [
        "Klikni Baci. Posle bacanja klikni kockice koje zelis da sacuvas.",
        "Bronzane kockice su pojedinacne jedinice ili petice. Zlatne kockice su grupe od tri ili vise istih.",
        "Crvene kockice su trenutno izabrane. Klikni Sacuvaj izabrano da ih dodas u rundu.",
        "Posle cuvanja biras: Baci ponovo za jos poena ili Zavrsi potez da upises rundu u ukupan skor.",
        "Ne mozes da zavrsis potez dok runda nema bar 350 poena, odnosno 1000 ako si na 9000 ili vise ukupno.",
        "Ako ne sacuvas izabrane kockice, ne mozes da bacas dalje. Prvo ih sacuvaj ili odznaci.",
        "Ako iskoristis svih 6 kockica, tabla se prazni i sledece bacanje opet koristi svih 6 kockica.",
        "U multiplayeru host pravi sobu, bira 2-4 igraca i salje kod. Ostali mogu da unesu kod ili kliknu Pronadji sobu.",
        "Partija ne krece dok host ne klikne Start. Dok je soba u cekanju, timer ne istice.",
        "U multiplayeru svaki aktivan potez ima 60 sekundi. Timer se resetuje kada sacuvas kockice ili kada potez predje na sledeceg igraca.",
        "Ako vreme istekne, potez se zavrsava sa 0 poena i dobijas AFK opomenu. Posle 2 AFK opomene AI preuzima tog igraca.",
        "Dugme Izlaz u multiplayeru znaci predaju partije dok partija traje.",
        "Chat je u donjem panelu i radi dok si u multiplayer sobi."
      ]
    };
    const testingRoomCode = "ACAB9";
    const testCombinations = buildTestCombinations();
    const soundsPath = "assets/sounds/";
    const sounds = {
      roll: new Audio(soundsPath + "dice-roll.mp3"),
      pairs: new Audio(soundsPath + "pairs.mp3"),
      kenta: new Audio(soundsPath + "kenta.mp3"),
      bigHand: new Audio(soundsPath + "big-hand.mp3"),
      farcle: new Audio(soundsPath + "farcle.mp3"),
      manualFarcle: new Audio(soundsPath + "manual-farcle.mp3")
    };

    let currentPlayer = 0;
    let turnPoints = 0;
    let dice = [];
    let history = [];
    let turnStarted = false;
    let gameOver = false;
    let hasRolled = false;
    let isRolling = false;
    let mustKeepAfterFullReset = false;
    let aiTimer = null;
    let bannerTimer = null;
    let rollFaceTimer = null;
    let turnTimerInterval = null;
    let mustKeepFromCurrentRoll = false;
    let turnToken = 0;
    let lastRollFinishedAt = 0;
    let keepableIds = new Map();
    let gameMode = null;
    let turnDeadlineAt = 0;
    let finishLeaderIndex = null;
    let isResolvingTimeout = false;
    let roomCode = null;
    let roomName = "";
    let playerToken = null;
    let playerIndex = null;
    let roomStatus = null;
    let pollTimer = null;
    let lastRoomUpdatedAt = null;
    let roomVersion = 0;
    let isApplyingRemoteState = false;
    let syncChain = Promise.resolve();
    let audioUnlocked = false;
    let soundsMuted = localStorage.getItem("farcleSoundsMuted") === "1";
    let currentLang = localStorage.getItem("farcleLang") === "sr" ? "sr" : "en";
    let isTestingMode = false;
    let lastResultKey = "";

    function t(key, params = {}) {
      let value = i18n[currentLang][key] ?? i18n.en[key] ?? key;
      for (const [name, replacement] of Object.entries(params)) {
        value = String(value).replaceAll("{" + name + "}", String(replacement));
      }
      return value;
    }

    function setText(selector, value) {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    }

    function setPlaceholder(selector, value) {
      const node = document.querySelector(selector);
      if (node) node.placeholder = value;
    }

    function renderRulesList(node, items) {
      if (!node) return;
      node.innerHTML = "";
      for (const item of items) {
        const row = document.createElement("div");
        row.className = "rules-item";
        const span = document.createElement("span");
        span.textContent = item;
        row.appendChild(span);
        node.appendChild(row);
      }
    }

    function applyLanguage() {
      document.documentElement.lang = currentLang === "sr" ? "sr" : "en";
      languageToggleButtons.forEach((button) => {
        button.textContent = t("langButton");
        button.title = currentLang === "sr" ? "Srpski" : "English";
      });
      setText(".mode-title h1", t("chooseGame"));
      setPlaceholder("#playerNameInput", t("yourName"));
      setText("#aiModeBtn span", t("vsAi"));
      setText("#aiModeBtn strong", t("startGame"));
      setText("#multiplayerModeBtn span", t("multiplayer"));
      setText("#multiplayerModeBtn strong", t("createJoinRoom"));
      setPlaceholder("#roomNameInput", t("roomName"));
      setText(".select-box span", t("players"));
      createRoomBtn.textContent = t("createRoom");
      findRoomBtn.textContent = t("findRoom");
      setPlaceholder("#roomCodeInput", t("roomCode"));
      joinRoomBtn.textContent = t("join");
      if (!gameMode) roomStatusText.textContent = t("lobbyHelp");
      resetBtn.textContent = t("newGame");
      rulesBtn.textContent = t("rules");
      howToBtn.textContent = t("howTo");
      leaveRoomBtn.textContent = t("exit");
      setText(".top .subtitle", t("subtitleGame"));
      setText(".version-badge span", t("version"));
      setText(".goalbox span", t("goal"));
      setText(".room-badge span", t("room"));
      rollBtn.textContent = t("roll");
      keepBtn.textContent = t("keepSelected");
      bankBtn.textContent = t("endTurn");
      setText(".test-panel-head strong", t("setDiceRoll"));
      testExitBtn.textContent = t("exitTest");
      setText(".panel h3", t("history"));
      setText(".chat-panel h3", t("multiplayer") === "Multiplayer" ? "Chat" : "Chat");
      setPlaceholder("#chatInput", t("message"));
      setText(".chat-form button", t("send"));
      infoModalClose.textContent = t("close");
      renderRulesList(rulesModalContent, t("rulesList"));
      renderRulesList(howToModalContent, t("howList"));
      updateSoundToggleLabels();
      renderAll();
    }

    function toggleLanguage() {
      currentLang = currentLang === "en" ? "sr" : "en";
      localStorage.setItem("farcleLang", currentLang);
      applyLanguage();
    }

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createDie(value) {
      return {
        id: crypto.randomUUID(),
        value,
        selected: false,
        special: false
      };
    }

    function buildDieFace(value) {
      const frag = document.createDocumentFragment();
      for (const [x, y] of pipMap[value]) {
        const pip = document.createElement("span");
        pip.className = "pip";
        pip.style.left = x + "%";
        pip.style.top = y + "%";
        frag.appendChild(pip);
      }
      return frag;
    }

    function setMessage(text) {
      messageText.textContent = text;
    }

    function cleanName(value, fallback, maxLength = 18) {
      const cleaned = String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
      return cleaned || fallback;
    }

    function getLobbyPlayerName(fallback = t("player", { n: "" }).trim()) {
      return cleanName(playerNameInput.value, fallback, 18);
    }

    function getLobbyRoomName() {
      return cleanName(roomNameInput.value, "Farcle room", 28);
    }

    function openInfoModal(kind) {
      const isHowTo = kind === "how";
      infoModalTitle.textContent = isHowTo ? t("howTo") : t("rules");
      rulesModalContent.hidden = isHowTo;
      howToModalContent.hidden = !isHowTo;
      infoModal.hidden = false;
      infoModalClose.focus();
    }

    function closeInfoModal() {
      infoModal.hidden = true;
    }

    function closeResultModal() {
      resultModal.hidden = true;
    }

    function getWinnerIndex() {
      let winner = 0;
      for (let index = 1; index < players.length; index += 1) {
        if (players[index].score > players[winner].score) winner = index;
      }
      return winner;
    }

    function isLocalWinner(winnerIndex) {
      if (gameMode === "ai") return winnerIndex === 0;
      if (gameMode === "mp") return winnerIndex === playerIndex;
      return true;
    }

    function renderResultScores() {
      resultScores.innerHTML = "";
      players
        .map((player, index) => ({ player, index }))
        .sort((a, b) => b.player.score - a.player.score)
        .forEach((item, rank) => {
          const row = document.createElement("div");
          row.className = "result-score-row";
          row.innerHTML =
            "<span>" + (rank + 1) + ". " + item.player.name + "</span>" +
            "<strong>" + item.player.score + "</strong>";
          resultScores.appendChild(row);
        });
    }

    function showResultModal(winnerIndex = getWinnerIndex()) {
      if (!gameOver || !players[winnerIndex]) return;
      const key = gameMode + ":" + winnerIndex + ":" + players.map((player) => player.score).join("-");
      if (lastResultKey === key && !resultModal.hidden) return;
      lastResultKey = key;

      const won = isLocalWinner(winnerIndex);
      const localIndex = gameMode === "mp" && playerIndex !== null ? playerIndex : 0;
      const localScore = players[localIndex]?.score || 0;
      resultKicker.textContent = gameMode === "mp" ? t("mpGameOver") : t("gameOver");
      resultTitle.textContent = won ? t("victory") : t("lost");
      resultText.textContent = won
        ? t("winnerText", { name: players[winnerIndex].name, points: players[winnerIndex].score })
        : t("loserText", { name: players[winnerIndex].name, points: localScore });
      renderResultScores();

      if (gameMode === "mp") {
        resultPrimaryBtn.textContent = t("rematch");
        resultSecondaryBtn.textContent = t("exit");
      } else {
        resultPrimaryBtn.textContent = t("newGame");
        resultSecondaryBtn.textContent = "Exit game";
      }

      resultModal.hidden = false;
      resultPrimaryBtn.focus();
    }

    function updateSoundToggleLabels() {
      const label = soundsMuted ? t("soundOff") : t("soundOn");
      for (const button of soundToggleButtons) {
        button.setAttribute("aria-label", label);
        button.title = label;
        button.classList.toggle("muted", soundsMuted);
      }
    }

    function toggleSounds() {
      soundsMuted = !soundsMuted;
      localStorage.setItem("farcleSoundsMuted", soundsMuted ? "1" : "0");
      if (soundsMuted) {
        for (const sound of Object.values(sounds)) {
          sound.pause();
          sound.currentTime = 0;
        }
      } else {
        unlockAudio();
      }
      updateSoundToggleLabels();
    }

    function unlockAudio() {
      if (audioUnlocked) return;
      audioUnlocked = true;
      for (const sound of Object.values(sounds)) {
        sound.preload = "auto";
        sound.volume = 0.75;
        sound.load();
        sound.muted = true;
        const unlockAttempt = sound.play();
        if (unlockAttempt && typeof unlockAttempt.then === "function") {
          unlockAttempt
            .then(() => {
              sound.pause();
              sound.currentTime = 0;
              sound.muted = false;
            })
            .catch(() => {
              sound.muted = false;
            });
        } else {
          sound.muted = false;
        }
      }
    }

    function playSound(name) {
      const sound = sounds[name];
      if (soundsMuted) return;
      if (!sound) return;
      if (!audioUnlocked) unlockAudio();
      sound.pause();
      sound.currentTime = 0;
      sound.muted = false;
      sound.play().catch(() => {});
    }

    function faceName(value) {
      return ["", "jedinice", "dvojke", "trojke", "cetvorke", "petice", "sestice"][value] || String(value);
    }

    function repeatValue(value, count) {
      return Array.from({ length: count }, () => value);
    }

    function padTestRoll(selection) {
      const values = [...selection];
      const counts = countMap(values.map((value) => ({ value })));
      const fillers = [2, 3, 4, 6];
      while (values.length < 6) {
        const filler = fillers.find((value) => (counts.get(value) || 0) < 2) || 2;
        values.push(filler);
        counts.set(filler, (counts.get(filler) || 0) + 1);
      }
      return values.slice(0, 6);
    }

    function makeTestCombo(label, selection, note = null, exactRoll = false) {
      const selectedValues = [...selection];
      const values = exactRoll ? [...selection] : padTestRoll(selectedValues);
      const result = scoreSelection(selectedValues.map((value) => ({ value })));
      return {
        label,
        values,
        selectedValues,
        note: note || (result.valid ? result.points + " points" : "No points")
      };
    }

    function buildTestCombinations() {
      const combos = [
        { label: "Farkle", values: [2, 2, 3, 3, 4, 6], selectedValues: [], note: "No points" },
        makeTestCombo("Straight", [1, 2, 3, 4, 5, 6], "1500 points", true)
      ];

      for (let count = 1; count <= 2; count += 1) {
        combos.push(makeTestCombo(count + "x 1", repeatValue(1, count)));
        combos.push(makeTestCombo(count + "x 5", repeatValue(5, count)));
      }

      for (let value = 1; value <= 6; value += 1) {
        for (let count = 3; count <= 6; count += 1) {
          combos.push(makeTestCombo(count + "x " + faceName(value), repeatValue(value, count), null, count === 6));
        }
      }

      for (let a = 1; a <= 4; a += 1) {
        for (let b = a + 1; b <= 5; b += 1) {
          for (let c = b + 1; c <= 6; c += 1) {
            combos.push(makeTestCombo("Three pairs " + a + "-" + b + "-" + c, [a, a, b, b, c, c], "750 points", true));
          }
        }
      }

      for (let a = 1; a <= 5; a += 1) {
        for (let b = a + 1; b <= 6; b += 1) {
          combos.push(makeTestCombo("Two triples " + a + "-" + b, [...repeatValue(a, 3), ...repeatValue(b, 3)], null, true));
        }
      }

      for (let value = 1; value <= 6; value += 1) {
        combos.push(makeTestCombo("3x " + value + " + 1", [...repeatValue(value, 3), 1]));
        combos.push(makeTestCombo("3x " + value + " + 5", [...repeatValue(value, 3), 5]));
        combos.push(makeTestCombo("3x " + value + " + 1 + 5", [...repeatValue(value, 3), 1, 5]));
        combos.push(makeTestCombo("4x " + value + " + 1", [...repeatValue(value, 4), 1]));
        combos.push(makeTestCombo("4x " + value + " + 5", [...repeatValue(value, 4), 5]));
      }

      combos.push(makeTestCombo("Samo singlovi 1/5", [1, 1, 5, 5]));
      combos.push(makeTestCombo("Pun roll 1 i 5", [1, 1, 1, 5, 5, 5], null, true));
      return combos;
    }

    function renderTestPanel() {
      testPanel.hidden = !isTestingMode;
      if (!isTestingMode || testGrid.children.length) return;

      for (const combo of testCombinations) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "test-combo";
        button.innerHTML = "<strong>" + combo.label + "</strong><span>" + combo.values.join(" ") + " | " + combo.note + "</span>";
        button.addEventListener("click", () => applyTestCombination(combo));
        testGrid.appendChild(button);
      }
    }

    function applyTestCombination(combo) {
      if (!isTestingMode || gameMode !== "ai" || currentPlayer !== 0 || gameOver) return;
      clearAiTimer();
      clearRollFaceTimer();
      isRolling = false;
      turnStarted = true;
      hasRolled = true;
      mustKeepAfterFullReset = false;
      mustKeepFromCurrentRoll = true;
      keepableIds = new Map();
      const selectedCounts = countMap((combo.selectedValues || []).map((value) => ({ value })));
      dice = combo.values.map((value) => {
        const die = createDie(value);
        const remaining = selectedCounts.get(value) || 0;
        if (remaining > 0) {
          die.selected = true;
          selectedCounts.set(value, remaining - 1);
        }
        return die;
      });
      const result = scoreSelection(dice);
      if (result.special) {
        for (const die of dice) die.special = true;
      }
      setMessage(t("testApplied", { label: combo.label, values: combo.values.join(", ") }));
      resetTurnDeadline();
      startTurnTimer();
      renderAll();
      if (!hasAnyScoringDice(dice)) {
        setTimeout(() => {
          if (isTestingMode && gameMode === "ai" && currentPlayer === 0 && !gameOver) endTurnAfterFarkle();
        }, 350);
      } else if (result.special) {
        setTimeout(() => {
          if (isTestingMode && gameMode === "ai" && currentPlayer === 0 && !gameOver) autoKeepSpecial(result);
        }, 500);
      }
    }

    function countMap(diceList) {
      const map = new Map();
      for (const die of diceList) {
        map.set(die.value, (map.get(die.value) || 0) + 1);
      }
      return map;
    }

    function scoreGroup(value, count) {
      if (count < 3) {
        if (value === 1) return count * 100;
        if (value === 5) return count * 50;
        return null;
      }

      const base = value === 1 ? 1000 : value * 100;
      return base * (2 ** (count - 3));
    }

    function scoreSelection(diceList) {
      if (diceList.length === 0) return { valid: false, points: 0, special: null };

      const counts = countMap(diceList);
      if (diceList.length === 6) {
        const values = [...counts.keys()].sort((a, b) => a - b);
        const countValues = [...counts.values()].sort((a, b) => a - b);
        if (values.length === 6 && values.every((value, index) => value === index + 1)) {
          return { valid: true, points: 1500, special: "kenta" };
        }
        if (countValues.length === 3 && countValues.every((count) => count === 2)) {
          return { valid: true, points: 750, special: "parovi" };
        }
      }

      let points = 0;

      for (const [value, count] of counts.entries()) {
        if (count >= 3) {
          points += scoreGroup(value, count);
          continue;
        }

        const partial = scoreGroup(value, count);
        if (partial === null) {
          return { valid: false, points: 0, special: null };
        }
        points += partial;
      }

      return { valid: points > 0, points, special: null };
    }

    function hasAnyScoringDice(diceList) {
      if (diceList.length === 6 && scoreSelection(diceList).valid) return true;
      const counts = countMap(diceList);
      for (const [value, count] of counts.entries()) {
        if (value === 1 || value === 5) return true;
        if (count >= 3) return true;
      }
      return false;
    }

    function getActiveDice() {
      return dice;
    }

    function getSelectedDice() {
      return dice.filter((die) => die.selected);
    }

    function createPlayer(index, name = null) {
      return {
        name: name || t("player", { n: index + 1 }),
        score: 0,
        strikes: 0,
        timeoutStrikes: 0,
        aiControlled: false
      };
    }

    function setPlayerCount(count, aiMode = false) {
      const nextCount = Math.max(2, Math.min(4, Number(count) || 2));
      maxPlayers = nextCount;
      players = Array.from({ length: nextCount }, (_, index) => createPlayer(index, aiMode && index === 1 ? "AI" : null));
      savedDiceValues = Array.from({ length: nextCount }, () => []);
      if (currentPlayer >= players.length) currentPlayer = 0;
    }

    function getNextPlayerIndex(fromIndex = currentPlayer) {
      return (fromIndex + 1) % players.length;
    }

    function lockActionButtons() {
      rollBtn.disabled = true;
      keepBtn.disabled = true;
      bankBtn.disabled = true;
    }

    function isLocalPlayersTurn() {
      if (gameMode !== "mp") return true;
      if (players[currentPlayer].aiControlled) return false;
      return roomStatus === "active" && playerIndex === currentPlayer;
    }

    function shouldAiControlCurrentTurn() {
      if (gameMode === "ai") return currentPlayer === 1;
      if (gameMode === "mp") {
        return roomStatus === "active" && Boolean(players[currentPlayer].aiControlled) && playerIndex !== currentPlayer;
      }
      return false;
    }

    function getRequiredBankPoints(player = players[currentPlayer]) {
      return player.score >= highScoreThreshold ? highScoreBankMinimum : standardBankMinimum;
    }

    function clearSelections() {
      for (const die of dice) {
        die.selected = false;
      }
    }

    function buildMiniDie(value) {
      const node = document.createElement("div");
      node.className = "mini-die";
      node.textContent = String(value);
      return node;
    }

    function buildPlayerCard(player, index) {
      const card = document.createElement("article");
      card.className = "player-card";
      card.classList.toggle("active", index === currentPlayer);
      card.classList.toggle("waiting", gameMode === "mp" && roomStatus === "waiting" && index >= players.length);

      const head = document.createElement("div");
      head.className = "player-card-head";

      const title = document.createElement("h2");
      title.textContent = player.name + (player.aiControlled ? " (" + t("ai") + ")" : "");
      head.appendChild(title);

      const scoreBox = document.createElement("div");
      scoreBox.className = "player-score-box";
      scoreBox.innerHTML = "<span>" + t("total") + "</span><strong>" + player.score + "</strong>";
      head.appendChild(scoreBox);
      card.appendChild(head);

      const stats = document.createElement("div");
      stats.className = "player-stats";
      stats.innerHTML =
        "<div><span>" + t("marks") + "</span><strong class=\"strike-marks\">" + (player.strikes > 0 ? "/".repeat(player.strikes) : "") + "</strong></div>" +
        "<div><span>AFK</span><strong>" + (player.timeoutStrikes || 0) + "/2</strong></div>";
      card.appendChild(stats);

      const savedArea = document.createElement("div");
      savedArea.className = "saved-area";
      const savedLabel = document.createElement("span");
      savedLabel.textContent = t("savedDice");
      const savedWrap = document.createElement("div");
      savedWrap.className = "saved-dice";
      for (const value of savedDiceValues[index] || []) {
        savedWrap.appendChild(buildMiniDie(value));
      }
      savedArea.appendChild(savedLabel);
      savedArea.appendChild(savedWrap);
      card.appendChild(savedArea);
      return card;
    }

    function updateKeepableHighlights() {
      keepableIds = new Map();
      if (!hasRolled || isRolling || gameOver || dice.length === 0) return;

      const counts = countMap(dice);
      const specialResult = scoreSelection(dice);
      if (specialResult.special) return;

      for (const [value, count] of counts.entries()) {
        const matchingDice = dice.filter((die) => die.value === value);
        if (count >= 3) {
          for (const die of matchingDice) {
            keepableIds.set(die.id, "group");
          }
        } else if (value === 1 || value === 5) {
          for (const die of matchingDice) {
            keepableIds.set(die.id, "single");
          }
        }
      }
    }

    function renderDice() {
      diceWrap.innerHTML = "";
      updateKeepableHighlights();
      for (const die of dice) {
        const node = document.createElement("button");
        node.type = "button";
        node.className = "die";
        node.style.setProperty("--rot", rand(-8, 8) + "deg");
        if (die.rolling) {
          node.style.setProperty("--roll-x", die.rollX + "px");
          node.style.setProperty("--roll-y", die.rollY + "px");
          node.style.setProperty("--roll-spin", die.rollSpin + "deg");
        }
        const keepType = keepableIds.get(die.id);
        if (keepType === "single") node.classList.add("keep-single");
        if (keepType === "group") node.classList.add("keep-group");
        if (die.selected) node.classList.add("selected");
        if (die.special) node.classList.add("special");
        if (die.rolling) node.classList.add("rolling");
        node.dataset.id = die.id;
        node.disabled = gameOver;

        const label = document.createElement("span");
        label.className = "die-label";
        label.textContent = die.value;
        node.appendChild(label);
        node.appendChild(buildDieFace(die.value));
        diceWrap.appendChild(node);
      }
    }

    function refreshDieFace(die) {
      const node = diceWrap.querySelector('[data-id="' + die.id + '"]');
      if (!node) return;

      const label = node.querySelector(".die-label");
      if (label) label.textContent = die.value;

      for (const pip of node.querySelectorAll(".pip")) {
        pip.remove();
      }
      node.appendChild(buildDieFace(die.value));
    }

    function renderSavedDice() {
      renderPlayers();
    }

    function renderHistory() {
      historyList.innerHTML = "";
      if (history.length === 0) {
        const row = document.createElement("div");
        row.className = "history-item";
        row.innerHTML = "<span>" + t("emptyHistory") + "</span><strong>0</strong>";
        historyList.appendChild(row);
        return;
      }

      for (const item of history) {
        const row = document.createElement("div");
        row.className = "history-item";
        const when = item.at ? new Date(item.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
        row.innerHTML = "<span>" + item.label + (when ? "<em>" + when + "</em>" : "") + "</span><strong>" + item.points + "</strong>";
        historyList.appendChild(row);
      }
    }

    function renderPlayers() {
      playersList.innerHTML = "";
      players.forEach((player, index) => {
        playersList.appendChild(buildPlayerCard(player, index));
      });
      if (gameMode === "mp" && roomStatus === "waiting") {
        for (let index = players.length; index < maxPlayers; index += 1) {
          playersList.appendChild(buildPlayerCard(createPlayer(index, t("waitingPlayer", { n: index + 1 })), index));
        }
      }
    }

    function renderChat() {
      chatPanel.hidden = gameMode !== "mp";
      chatList.innerHTML = "";
      const visibleMessages = chatMessages.slice(-30);
      if (visibleMessages.length === 0) {
        const row = document.createElement("div");
        row.className = "chat-item";
        row.textContent = t("noMessages");
        chatList.appendChild(row);
        return;
      }

      for (const item of visibleMessages) {
        const row = document.createElement("div");
        row.className = "chat-item";
        const name = document.createElement("strong");
        name.textContent = item.name || t("player", { n: "" }).trim();
        const text = document.createElement("span");
        text.textContent = item.text || "";
        row.appendChild(name);
        row.appendChild(text);
        chatList.appendChild(row);
      }
      chatList.scrollTop = chatList.scrollHeight;
    }

    function getTurnSecondsLeft() {
      if (gameMode === "mp" && roomStatus !== "active") return turnDurationMs / 1000;
      if (!turnDeadlineAt || gameOver) return turnDurationMs / 1000;
      return Math.max(0, Math.ceil((turnDeadlineAt - Date.now()) / 1000));
    }

    function updateTurnTimerDisplay() {
      const node = document.getElementById("turnTimer");
      if (node) node.textContent = String(getTurnSecondsLeft());
    }

    function updateSelectedPoints() {
      const result = scoreSelection(getSelectedDice());
      const node = document.getElementById("selectedPoints");
      if (node) node.textContent = result.valid ? String(result.points) : "0";
    }

    function renderStatus() {
      turnText.textContent = t("turn", { name: players[currentPlayer].name });
      statusMeta.innerHTML =
        t("round") + ': <strong id="turnPoints">' + turnPoints + '</strong> | ' +
        t("selected") + ': <strong id="selectedPoints">' + (scoreSelection(getSelectedDice()).valid ? scoreSelection(getSelectedDice()).points : 0) + '</strong> | ' +
        t("toRoll") + ': <strong id="diceLeft">' + (getActiveDice().length || 6) + '</strong> | ' +
        t("time") + ': <strong id="turnTimer">' + getTurnSecondsLeft() + '</strong>s';
      const isAiTurn = shouldAiControlCurrentTurn();
      const isRemoteTurn = gameMode === "mp" && !isLocalPlayersTurn();
      const requiredBankPoints = getRequiredBankPoints();
      rollBtn.disabled = gameOver || isRolling || !turnStarted || getSelectedDice().length > 0 || mustKeepFromCurrentRoll || (gameMode === "ai" && isAiTurn) || isRemoteTurn;
      keepBtn.disabled = gameOver || isRolling || !hasRolled || getSelectedDice().length === 0 || (gameMode === "ai" && isAiTurn) || isRemoteTurn;
      bankBtn.disabled = gameOver || isRolling || !turnStarted || turnPoints < requiredBankPoints || mustKeepAfterFullReset || (gameMode === "ai" && isAiTurn) || isRemoteTurn;
    }

    function renderAll() {
      renderPlayers();
      renderDice();
      renderStatus();
      renderHistory();
      renderChat();
      renderTestPanel();
    }

    function newTurn() {
      clearAiTimer();
      clearRollFaceTimer();
      turnToken += 1;
      turnPoints = 0;
      turnStarted = true;
      hasRolled = false;
      isRolling = false;
      resetTurnDeadline();
      mustKeepAfterFullReset = false;
      mustKeepFromCurrentRoll = false;
      keepableIds = new Map();
      savedDiceValues[currentPlayer] = [];
      dice = Array.from({ length: 6 }, () => createDie(1));
      clearSelections();
      setMessage(t("playerRolls", { name: players[currentPlayer].name }));
      renderAll();
      startTurnTimer();
      scheduleAiTurn();
    }

    function nextPlayer() {
      clearAiTimer();
      currentPlayer = getNextPlayerIndex();
      newTurn();
    }

    function clearAiTimer() {
      if (aiTimer !== null) {
        clearTimeout(aiTimer);
        aiTimer = null;
      }
    }

    function clearRollFaceTimer() {
      if (rollFaceTimer !== null) {
        clearInterval(rollFaceTimer);
        rollFaceTimer = null;
      }
    }

    function clearTurnTimer() {
      if (turnTimerInterval !== null) {
        clearInterval(turnTimerInterval);
        turnTimerInterval = null;
      }
    }

    function resetTurnDeadline() {
      turnDeadlineAt = Date.now() + turnDurationMs;
    }

    function startTurnTimer() {
      clearTurnTimer();
      updateTurnTimerDisplay();
      turnTimerInterval = setInterval(() => {
        updateTurnTimerDisplay();
        if (gameMode === "mp" && !gameOver && roomStatus === "active" && turnDeadlineAt && Date.now() >= turnDeadlineAt) {
          resolveMultiplayerTimeout();
        }
      }, 500);
    }

    function clearPollTimer() {
      if (pollTimer !== null) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }
    }

    function showSpecialBanner(text) {
      specialBanner.textContent = text;
      specialBanner.classList.add("visible");
      if (bannerTimer !== null) {
        clearTimeout(bannerTimer);
      }
      bannerTimer = setTimeout(() => {
        specialBanner.classList.remove("visible");
        bannerTimer = null;
      }, 1400);
    }

    function autoKeepSpecial(result) {
      if (result.special === "kenta") {
        playSound("kenta");
      } else if (result.special === "parovi") {
        playSound("pairs");
      }

      turnPoints += result.points;
      savedDiceValues[currentPlayer].push(...dice.map((die) => die.value));
      dice = [];
      hasRolled = false;
      mustKeepFromCurrentRoll = false;
      mustKeepAfterFullReset = true;

      if (result.special === "kenta") {
        showSpecialBanner("Kenta! 1500");
        setMessage(t("kentaAuto"));
      } else if (result.special === "parovi") {
        showSpecialBanner("Tri para! 750");
        setMessage(t("pairsAuto"));
      }

      resetTurnDeadline();
      startTurnTimer();
      renderAll();
      syncMultiplayerState("keep");
      scheduleAiTurn();
    }

    function scheduleAiTurn(delay = 1400) {
      clearAiTimer();
      if (gameOver || !shouldAiControlCurrentTurn()) return;
      const token = turnToken;
      aiTimer = setTimeout(() => runAiStep(token), delay);
    }

    function recordHistory(label, points) {
      history.unshift({ label, points, at: Date.now() });
      history = history.slice(0, 14);
      renderHistory();
    }

    function applyStrike(player) {
      if (player.score >= highScoreThreshold) {
        player.strikes = 0;
        return t("noMarksOver9000");
      }

      player.strikes += 1;
      if (player.strikes >= 3) {
        player.score -= 1000;
        player.strikes = 0;
        return t("threeMarks");
      }
      return t("gotMark");
    }

    function inferFinishLeaderIndex(state = null) {
      const rawLeader = state?.finishLeaderIndex;
      if (rawLeader !== null && rawLeader !== undefined) {
        const explicitLeader = Number(rawLeader);
        if (explicitLeader >= 0 && explicitLeader < (state?.players?.length || players.length)) return explicitLeader;
      }

      const statePlayers = state?.players || players;
      const stateCurrentPlayer = Number(state?.currentPlayer ?? currentPlayer);
      const opponentIndex = (stateCurrentPlayer + 1) % statePlayers.length;
      const opponentScore = Number(statePlayers?.[opponentIndex]?.score || 0);
      if (!Boolean(state?.gameOver ?? gameOver) && opponentScore >= 10000) {
        return opponentIndex;
      }

      return null;
    }

    function getWinnerAfterCompletedTurn(endedPlayerIndex) {
      const endedPlayer = players[endedPlayerIndex];

      if (finishLeaderIndex !== null && endedPlayerIndex !== finishLeaderIndex) {
        const leader = players[finishLeaderIndex];
        if (endedPlayer.score >= leader.score) {
          finishLeaderIndex = endedPlayerIndex;
          return null;
        }

        if (getNextPlayerIndex(endedPlayerIndex) === finishLeaderIndex) {
          return finishLeaderIndex;
        }
      }

      if (endedPlayer.score >= 10000) {
        finishLeaderIndex = endedPlayerIndex;
      }

      return null;
    }

    function finishGame(winnerIndex) {
      gameOver = true;
      finishLeaderIndex = null;
      clearAiTimer();
      clearTurnTimer();
      setMessage(t("winner", { name: players[winnerIndex].name, points: players[winnerIndex].score }));
      renderAll();
      showResultModal(winnerIndex);
      syncMultiplayerState("turn");
    }

    function endTurnAfterFarkle() {
      clearAiTimer();
      clearRollFaceTimer();
      playSound(getActiveDice().length === 6 ? "manualFarcle" : "farcle");
      const player = players[currentPlayer];
      const strikeText = " " + applyStrike(player);
      recordHistory(t("farkleHistory", { name: player.name }), 0);
      setMessage(t("noScoring", { name: player.name }) + strikeText);
      turnPoints = 0;
      mustKeepAfterFullReset = false;
      mustKeepFromCurrentRoll = false;
      hasRolled = false;
      isRolling = false;
      keepableIds = new Map();
      savedDiceValues[currentPlayer] = [];
      const playerIndexBeforeNext = currentPlayer;
      dice = Array.from({ length: 6 }, () => createDie(1));
      clearSelections();
      renderAll();
      if (gameOver) return;
      const winnerIndex = getWinnerAfterCompletedTurn(playerIndexBeforeNext);
      if (winnerIndex !== null) {
        finishGame(winnerIndex);
        return;
      }
      nextPlayer();
      syncMultiplayerState("farkle:" + playerIndexBeforeNext);
    }

    function rollDice() {
      if (gameOver || isRolling || !turnStarted || (!isLocalPlayersTurn() && !shouldAiControlCurrentTurn())) return;
      isRolling = true;
      lockActionButtons();
      playSound("roll");

      if (getSelectedDice().length > 0) {
        isRolling = false;
        renderStatus();
        setMessage(t("invalidFirst"));
        return;
      }
      const token = turnToken;

      let activeDice = getActiveDice();
      if (activeDice.length === 0) {
        dice = Array.from({ length: 6 }, () => createDie(1));
        activeDice = getActiveDice();
        setMessage(t("allDiceBack"));
      }

      for (const die of activeDice) {
        die.finalValue = rand(1, 6);
        die.value = rand(1, 6);
        die.rolling = true;
        die.rollX = rand(-24, 24);
        die.rollY = rand(12, 30);
        die.rollSpin = rand(70, 170) * (Math.random() < 0.5 ? -1 : 1);
        die.selected = false;
        die.special = false;
      }
      hasRolled = true;
      mustKeepFromCurrentRoll = false;
      keepableIds = new Map();

      renderAll();
      clearRollFaceTimer();
      rollFaceTimer = setInterval(() => {
        if (token !== turnToken) {
          clearRollFaceTimer();
          return;
        }
        for (const die of getActiveDice()) {
          if (die.rolling) die.value = rand(1, 6);
          if (die.rolling) refreshDieFace(die);
        }
      }, rollFaceTickDelay);

      setTimeout(() => {
        if (token !== turnToken) return;
        clearRollFaceTimer();
        for (const die of dice) {
          if (die.finalValue) die.value = die.finalValue;
          delete die.finalValue;
          die.rolling = false;
        }
        isRolling = false;
        lastRollFinishedAt = Date.now();

        renderAll();

        if (!hasAnyScoringDice(getActiveDice())) {
          endTurnAfterFarkle();
          return;
        }

        const activeResult = scoreSelection(getActiveDice());
        if (activeResult.special === "kenta" || activeResult.special === "parovi") {
          for (const die of getActiveDice()) die.special = true;
          renderAll();
          setTimeout(() => {
            if (token !== turnToken) return;
            autoKeepSpecial(activeResult);
          }, 700);
          return;
        }

        mustKeepFromCurrentRoll = true;
        renderStatus();
        setMessage(t("chooseScoring"));
        syncMultiplayerState("roll");
        scheduleAiTurn(aiPostRollSelectionDelay);
      }, rollResolveDelay);
    }

    function flashInvalidSelection() {
      const ids = new Set(getSelectedDice().map((die) => die.id));
      for (const node of diceWrap.querySelectorAll(".die")) {
        if (ids.has(node.dataset.id)) {
          node.classList.add("invalid");
          setTimeout(() => node.classList.remove("invalid"), 320);
        }
      }
    }

    function keepSelectedDice() {
      if (gameOver || isRolling || (!isLocalPlayersTurn() && !shouldAiControlCurrentTurn())) return;
      const selected = getSelectedDice();
      const result = scoreSelection(selected);
      if (!result.valid) {
        setMessage(t("invalidSelection"));
        flashInvalidSelection();
        return;
      }

      if (result.special === "kenta") {
        playSound("kenta");
      } else if (result.special === "parovi") {
        playSound("pairs");
      } else if (result.points >= 2000) {
        playSound("bigHand");
      }

      turnPoints += result.points;
      savedDiceValues[currentPlayer].push(...selected.map((die) => die.value));
      const selectedIds = new Set(selected.map((die) => die.id));
      dice = dice.filter((die) => !selectedIds.has(die.id));
      mustKeepAfterFullReset = false;
      mustKeepFromCurrentRoll = false;
      keepableIds = new Map();

      if (result.special === "kenta") {
        showSpecialBanner("Kenta sacuvana");
      } else if (result.special === "parovi") {
        showSpecialBanner("Tri para sacuvana");
      }

      const remaining = getActiveDice().length;
      if (remaining === 0) {
        dice = [];
        hasRolled = false;
        mustKeepAfterFullReset = true;
        setMessage(t("allSaved"));
      } else {
        setMessage(t("keptPoints", { points: result.points, remaining }));
      }
      resetTurnDeadline();
      startTurnTimer();
      renderAll();
      syncMultiplayerState("keep");
      scheduleAiTurn();
    }

    function bankPoints() {
      if (gameOver || isRolling || (!isLocalPlayersTurn() && !shouldAiControlCurrentTurn())) return;
      const player = players[currentPlayer];
      const requiredBankPoints = getRequiredBankPoints(player);
      if (turnPoints < requiredBankPoints) {
        setMessage(t("minBank", { points: requiredBankPoints }));
        return;
      }
      if (mustKeepAfterFullReset) {
        setMessage(t("mustRollAfterAll"));
        return;
      }

      const banked = turnPoints;
      const endedPlayerIndex = currentPlayer;
      if (banked >= 2000) playSound("bigHand");
      player.score += banked;
      player.strikes = 0;
      savedDiceValues[currentPlayer] = [];
      recordHistory(t("bankHistory", { name: player.name }), banked);

      const winnerIndex = getWinnerAfterCompletedTurn(endedPlayerIndex);
      if (winnerIndex !== null) {
        finishGame(winnerIndex);
        return;
      }

      setMessage(t("banked", { name: player.name, points: banked }));
      renderPlayers();
      nextPlayer();
      syncMultiplayerState("turn");
    }

    function resetGame() {
      closeResultModal();
      lastResultKey = "";
      clearAiTimer();
      clearRollFaceTimer();
      clearTurnTimer();
      players.forEach((player) => {
        player.score = 0;
        player.strikes = 0;
        player.timeoutStrikes = 0;
        player.aiControlled = false;
      });
      savedDiceValues = players.map(() => []);
      currentPlayer = 0;
      turnPoints = 0;
      history = [];
      chatMessages = gameMode === "mp" ? chatMessages : [];
      gameOver = false;
      finishLeaderIndex = null;
      mustKeepFromCurrentRoll = false;
      isRolling = false;
      keepableIds = new Map();
      newTurn();
      renderHistory();
      syncMultiplayerState("reset");
    }

    function buildStateSnapshot() {
      return {
        players: players.map((player) => ({
          name: player.name,
          score: player.score,
          strikes: player.strikes,
          timeoutStrikes: player.timeoutStrikes || 0,
          aiControlled: Boolean(player.aiControlled)
        })),
        savedDiceValues: savedDiceValues.map((values) => [...values]),
        maxPlayers,
        roomName,
        chatMessages: chatMessages.map((item) => ({ name: item.name, text: item.text, at: item.at || 0 })),
        currentPlayer,
        turnPoints,
        dice: dice.map((die) => ({
          id: die.id,
          value: die.value,
          selected: false,
          special: Boolean(die.special)
        })),
        history: history.map((item) => ({ label: item.label, points: item.points, at: item.at || 0 })),
        turnDeadlineAt,
        finishLeaderIndex,
        turnStarted,
        gameOver,
        hasRolled,
        mustKeepAfterFullReset,
        mustKeepFromCurrentRoll
      };
    }

    function applyStateSnapshot(state) {
      if (!state || typeof state !== "object") return;
      isApplyingRemoteState = true;
      clearAiTimer();
      clearRollFaceTimer();

      const incomingPlayers = Array.isArray(state.players) && state.players.length >= 2 ? state.players : players;
      maxPlayers = Math.max(Number(state.maxPlayers || incomingPlayers.length || maxPlayers), incomingPlayers.length);
      roomName = String(state.roomName || roomName || "");
      players = incomingPlayers.map((player, index) => ({
        name: player?.name || t("player", { n: index + 1 }),
        score: Number(player?.score || 0),
        strikes: Number(player?.strikes || 0),
        timeoutStrikes: Number(player?.timeoutStrikes || 0),
        aiControlled: Boolean(player?.aiControlled)
      }));

      savedDiceValues = players.map((_, index) => (
        Array.isArray(state.savedDiceValues?.[index]) ? [...state.savedDiceValues[index]] : []
      ));
      chatMessages = Array.isArray(state.chatMessages) ? state.chatMessages.map((item) => ({
        name: String(item.name || t("player", { n: "" }).trim()),
        text: String(item.text || ""),
        at: Number(item.at || 0)
      })) : [];
      currentPlayer = Number(state.currentPlayer || 0);
      if (currentPlayer < 0 || currentPlayer >= players.length) currentPlayer = 0;
      finishLeaderIndex = inferFinishLeaderIndex(state);
      turnPoints = Number(state.turnPoints || 0);
      dice = Array.isArray(state.dice) ? state.dice.map((die) => ({
        id: die.id || crypto.randomUUID(),
        value: Number(die.value || 1),
        selected: false,
        special: Boolean(die.special),
        rolling: false
      })) : [];
      history = Array.isArray(state.history) ? state.history.map((item) => ({
        label: String(item.label || ""),
        points: Number(item.points || 0),
        at: Number(item.at || 0)
      })) : [];
      turnDeadlineAt = Number(state.turnDeadlineAt || (Date.now() + turnDurationMs));
      turnStarted = Boolean(state.turnStarted);
      gameOver = Boolean(state.gameOver);
      hasRolled = Boolean(state.hasRolled);
      isRolling = false;
      mustKeepAfterFullReset = Boolean(state.mustKeepAfterFullReset);
      mustKeepFromCurrentRoll = Boolean(state.mustKeepFromCurrentRoll);
      keepableIds = new Map();
      renderAll();
      startTurnTimer();
      scheduleAiTurn();
      updateRoomUi();
      if (gameOver) {
        showResultModal(getWinnerIndex());
      } else {
        closeResultModal();
      }
      isApplyingRemoteState = false;
    }

    async function apiRequest(endpoint, payload = null) {
      const options = payload === null ? {} : {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      };
      const response = await fetch("api/" + endpoint, options);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        const preview = text.replace(/\s+/g, " ").slice(0, 120);
        throw new Error("API " + endpoint + " ne vraca JSON. HTTP " + response.status + ". " + preview);
      }
      if (!data.ok) {
        const apiError = new Error(data.error || "Server error.");
        apiError.data = data;
        throw apiError;
      }
      return data;
    }

    function setRoomStatus(text) {
      roomStatusText.textContent = text;
      setMessage(text);
    }

    function storeMultiplayerSession() {
      if (!roomCode || !playerToken || playerIndex === null) return;
      localStorage.setItem("farcleRoom", JSON.stringify({ roomCode, playerToken, playerIndex }));
    }

    function clearMultiplayerSession() {
      localStorage.removeItem("farcleRoom");
    }

    function updateRoomUi() {
      roomBadge.hidden = gameMode !== "mp" || !roomCode;
      roomCodeText.textContent = roomCode || "-----";
      leaveRoomBtn.hidden = gameMode !== "ai" && (gameMode !== "mp" || !roomCode);
      leaveRoomBtn.disabled = gameMode !== "ai" && (gameMode !== "mp" || !roomCode);
      startRoomBtn.hidden = gameMode !== "mp" || !roomCode || playerIndex !== 0 || roomStatus !== "waiting" || gameOver;
      startRoomBtn.disabled = players.length < 2;
      chatPanel.hidden = gameMode !== "mp";
    }

    async function sendMultiplayerState(action) {
      if (gameMode !== "mp" || isApplyingRemoteState || !roomCode || !playerToken || playerIndex === null) return;
      try {
        const data = await apiRequest("save_state.php", {
          code: roomCode,
          token: playerToken,
          action,
          expectedVersion: roomVersion,
          state: buildStateSnapshot()
        });
        roomStatus = data.status;
        roomVersion = Number(data.version || roomVersion);
        lastRoomUpdatedAt = data.updatedAt || lastRoomUpdatedAt;
        if (data.state?.turnDeadlineAt) {
          turnDeadlineAt = Number(data.state.turnDeadlineAt);
          startTurnTimer();
          renderStatus();
        }
        updateRoomUi();
      } catch (error) {
        if (error.data?.state) {
          roomStatus = error.data.status || roomStatus;
          roomVersion = Number(error.data.version || roomVersion);
          lastRoomUpdatedAt = error.data.updatedAt || lastRoomUpdatedAt;
          applyStateSnapshot(error.data.state);
        } else {
          setRoomStatus(error.message);
        }
      }
    }

    function syncMultiplayerState(action = "turn") {
      syncChain = syncChain.then(() => sendMultiplayerState(action));
      return syncChain;
    }

    async function pollMultiplayerState() {
      if (gameMode !== "mp" || !roomCode || !playerToken) return;
      if (isRolling) {
        clearPollTimer();
        pollTimer = setTimeout(pollMultiplayerState, multiplayerPollDelay);
        return;
      }
      try {
        const query = "?code=" + encodeURIComponent(roomCode) + "&token=" + encodeURIComponent(playerToken);
        const data = await apiRequest("get_state.php" + query);
        roomStatus = data.status;
        playerIndex = data.playerIndex;
        const nextVersion = Number(data.version || 0);
        if (nextVersion > roomVersion || (data.updatedAt && data.updatedAt !== lastRoomUpdatedAt)) {
          roomVersion = nextVersion || roomVersion;
          lastRoomUpdatedAt = data.updatedAt;
          applyStateSnapshot(data.state);
        } else {
          renderStatus();
        }

        if (roomStatus === "waiting") {
          setMessage(t("waitStart", { code: roomCode, count: players.length, max: maxPlayers }));
        } else if (gameOver) {
          updateRoomUi();
        } else if (!gameOver && playerIndex !== currentPlayer) {
          setMessage(t("waitOther", { code: roomCode }));
        } else if (!gameOver && (messageText.textContent.includes("waiting") || messageText.textContent.includes("ceka"))) {
          setMessage(t("otherJoined"));
        }
      } catch (error) {
        setRoomStatus(error.message);
      } finally {
        clearPollTimer();
        if (gameMode === "mp") {
          pollTimer = setTimeout(pollMultiplayerState, multiplayerPollDelay);
        }
      }
    }

    function startPolling() {
      clearPollTimer();
      pollTimer = setTimeout(pollMultiplayerState, multiplayerPollDelay);
    }

    async function resolveMultiplayerTimeout() {
      if (isResolvingTimeout || gameMode !== "mp" || !roomCode || !playerToken || gameOver) return;
      isResolvingTimeout = true;
      try {
        const data = await apiRequest("timeout_turn.php", {
          code: roomCode,
          token: playerToken
        });
        roomStatus = data.status;
        const nextVersion = Number(data.version || 0);
        if (data.changed || nextVersion > roomVersion) {
          roomVersion = nextVersion || roomVersion;
          lastRoomUpdatedAt = data.updatedAt || lastRoomUpdatedAt;
          applyStateSnapshot(data.state);
          setMessage(t("timeoutDone"));
        }
      } catch (error) {
        setRoomStatus(error.message);
      } finally {
        isResolvingTimeout = false;
      }
    }

    async function restoreMultiplayerSession() {
      const rawSession = localStorage.getItem("farcleRoom");
      if (!rawSession) return;

      try {
        const session = JSON.parse(rawSession);
        if (!session.roomCode || !session.playerToken) return;

        roomStatusText.textContent = t("restoring");
        const query = "?code=" + encodeURIComponent(session.roomCode) + "&token=" + encodeURIComponent(session.playerToken);
        const data = await apiRequest("get_state.php" + query);
        roomCode = data.code;
        playerToken = session.playerToken;
        playerIndex = data.playerIndex;
        roomStatus = data.status;
        roomVersion = Number(data.version || 1);
        lastRoomUpdatedAt = data.updatedAt || null;
        gameMode = "mp";
        showGame("mp");
        applyStateSnapshot(data.state);
        setRoomStatus(gameOver ? t("finished") : t("restored", { code: roomCode }));
        startPolling();
      } catch (error) {
        clearMultiplayerSession();
        roomStatusText.textContent = t("restoreFailed");
      }
    }

    async function leaveMultiplayerRoom() {
      if (gameMode !== "mp" || !roomCode || !playerToken) return;
      if (gameOver || roomStatus === "finished") {
        clearMultiplayerSession();
        showModeScreenAfterLeave();
        return;
      }
      const confirmed = window.confirm(currentLang === "sr" ? "Izlaz iz multiplayera znaci predaju partije. Nastaviti?" : "Leaving multiplayer forfeits the game. Continue?");
      if (!confirmed) return;

      leaveRoomBtn.disabled = true;
      try {
        const data = await apiRequest("forfeit_room.php", {
          code: roomCode,
          token: playerToken
        });
        roomStatus = data.status;
        roomVersion = Number(data.version || roomVersion);
        lastRoomUpdatedAt = data.updatedAt || lastRoomUpdatedAt;
        clearMultiplayerSession();
        showModeScreenAfterLeave();
      } catch (error) {
        setRoomStatus(error.message);
      } finally {
        leaveRoomBtn.disabled = false;
        updateRoomUi();
      }
    }

    function handleLeaveGame() {
      if (gameMode === "ai") {
        exitCurrentGame();
        return;
      }
      leaveMultiplayerRoom();
    }

    async function startMultiplayerRoom() {
      if (gameMode !== "mp" || !roomCode || !playerToken || playerIndex !== 0 || roomStatus !== "waiting") return;
      startRoomBtn.disabled = true;
      try {
        const data = await apiRequest("start_room.php", {
          code: roomCode,
          token: playerToken
        });
        roomStatus = data.status;
        roomVersion = Number(data.version || roomVersion);
        lastRoomUpdatedAt = data.updatedAt || lastRoomUpdatedAt;
        applyStateSnapshot(data.state);
        setRoomStatus(t("roomStarted"));
      } catch (error) {
        setRoomStatus(error.message);
      } finally {
        updateRoomUi();
      }
    }

    async function sendChatMessage(event) {
      event.preventDefault();
      const text = chatInput.value.trim();
      if (!text || gameMode !== "mp" || !roomCode || !playerToken) return;
      chatInput.value = "";
      try {
        const data = await apiRequest("send_message.php", {
          code: roomCode,
          token: playerToken,
          text
        });
        roomStatus = data.status;
        roomVersion = Number(data.version || roomVersion);
        lastRoomUpdatedAt = data.updatedAt || lastRoomUpdatedAt;
        applyStateSnapshot(data.state);
      } catch (error) {
        setRoomStatus(error.message);
      }
    }

    function renderRoomResults(rooms) {
      roomResults.innerHTML = "";
      roomResults.hidden = false;

      if (!rooms.length) {
        const empty = document.createElement("div");
        empty.className = "room-result empty";
        empty.textContent = t("noRooms");
        roomResults.appendChild(empty);
        return;
      }

      for (const room of rooms) {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "room-result";
        row.dataset.code = room.code;

        const title = document.createElement("span");
        title.className = "room-result-title";
        title.textContent = room.name || (t("room") + " " + room.code);

        const meta = document.createElement("span");
        meta.className = "room-result-meta";
        meta.textContent = t("roomPlayers", { code: room.code, count: room.playerCount, max: room.maxPlayers });

        row.appendChild(title);
        row.appendChild(meta);
        row.addEventListener("click", () => enterMultiplayerRoom(room.code));
        roomResults.appendChild(row);
      }
    }

    function getDiceSubsets(diceList) {
      const subsets = [];
      const maxMask = 2 ** diceList.length;
      for (let mask = 1; mask < maxMask; mask += 1) {
        const subset = [];
        for (let index = 0; index < diceList.length; index += 1) {
          if (mask & (1 << index)) subset.push(diceList[index]);
        }
        subsets.push(subset);
      }
      return subsets;
    }

    function rateAiSelection(selection, result, activeDiceCount) {
      const remainingDice = activeDiceCount - selection.length;
      let rating = result.points;
      const player = players[currentPlayer];
      const bestOpponentScore = Math.max(...players.map((item, index) => index === currentPlayer ? 0 : item.score));

      if (remainingDice === 0) rating += 260;
      if (remainingDice >= 3) rating += remainingDice * 18;
      if (selection.length === 1 && result.points < 100) rating -= 35;
      if (turnPoints + result.points >= getRequiredBankPoints(player)) rating += 80;
      if (player.score >= highScoreThreshold && turnPoints + result.points >= highScoreBankMinimum) rating += 160;
      if (bestOpponentScore >= 10000 && player.score + turnPoints + result.points >= bestOpponentScore) rating += 320;
      if (player.score < bestOpponentScore && player.score + turnPoints + result.points > bestOpponentScore) rating += 140;

      return rating;
    }

    function chooseAiSelection(activeDice) {
      let bestChoice = null;

      for (const subset of getDiceSubsets(activeDice)) {
        const result = scoreSelection(subset);
        if (!result.valid) continue;

        const rating = rateAiSelection(subset, result, activeDice.length);
        if (
          !bestChoice ||
          rating > bestChoice.rating ||
          (rating === bestChoice.rating && result.points > bestChoice.points) ||
          (rating === bestChoice.rating && result.points === bestChoice.points && subset.length > bestChoice.length)
        ) {
          bestChoice = {
            ids: subset.map((die) => die.id),
            length: subset.length,
            points: result.points,
            rating
          };
        }
      }

      return bestChoice ? bestChoice.ids : [];
    }

    function shouldAiBank() {
      if (mustKeepAfterFullReset) return false;
      const player = players[currentPlayer];
      if (turnPoints < getRequiredBankPoints(player)) return false;
      const totalScore = player.score;
      const projectedScore = totalScore + turnPoints;
      const diceLeft = getActiveDice().length;
      const bestOpponentScore = Math.max(...players.map((item, index) => index === currentPlayer ? 0 : item.score));

      if (bestOpponentScore >= 10000 && projectedScore >= bestOpponentScore) return true;
      if (projectedScore >= 10000 && turnPoints >= getRequiredBankPoints(player)) return true;
      if (totalScore >= highScoreThreshold && turnPoints >= highScoreBankMinimum) return true;
      if (player.strikes >= 2 && turnPoints >= 500) return true;
      if (bestOpponentScore - totalScore >= 2500 && turnPoints < 900 && diceLeft >= 3) return false;

      if (totalScore < 3500) {
        if (turnPoints >= 1100) return true;
        if (turnPoints >= 800 && diceLeft <= 3) return true;
        if (turnPoints >= 550 && diceLeft <= 1) return true;
        return false;
      }

      if (totalScore < 8000) {
        if (turnPoints >= 900) return true;
        if (turnPoints >= 650 && diceLeft <= 3) return true;
        if (turnPoints >= 450 && diceLeft <= 2) return true;
        return false;
      }

      if (turnPoints >= 700) return true;
      if (turnPoints >= 500 && diceLeft <= 3) return true;
      if (turnPoints >= getRequiredBankPoints(player) && diceLeft <= 2) return true;
      return false;
    }

    function toggleDieSelection(die) {
      const sameValueDice = dice.filter((item) => item.value === die.value);
      if (sameValueDice.length >= 3) {
        const shouldSelectGroup = sameValueDice.some((item) => !item.selected);
        for (const item of sameValueDice) {
          item.selected = shouldSelectGroup;
        }
        return;
      }

      die.selected = !die.selected;
    }

    function runAiStep(token) {
      aiTimer = null;
      if (token !== turnToken || gameOver || !shouldAiControlCurrentTurn()) return;
      if (isRolling) {
        aiTimer = setTimeout(() => runAiStep(token), aiRollingWaitDelay);
        return;
      }
      const timeSinceRoll = Date.now() - lastRollFinishedAt;
      if (hasRolled && timeSinceRoll < aiPostRollSelectionDelay) {
        aiTimer = setTimeout(() => runAiStep(token), aiPostRollSelectionDelay - timeSinceRoll);
        return;
      }

      if (!hasRolled) {
        rollDice();
        return;
      }

      const activeDice = getActiveDice();
      const selected = getSelectedDice();
      if (selected.length > 0) {
        keepSelectedDice();
        return;
      }

      const choiceIds = chooseAiSelection(activeDice);
      if (choiceIds.length === 0) {
        rollDice();
        return;
      }

      for (const die of activeDice) {
        die.selected = choiceIds.includes(die.id);
      }
      renderAll();

      setTimeout(() => {
        if (token !== turnToken || gameOver || !shouldAiControlCurrentTurn()) return;
        keepSelectedDice();
        setTimeout(() => {
          if (token !== turnToken || gameOver || !shouldAiControlCurrentTurn()) return;
          if (shouldAiBank()) {
            bankPoints();
          } else if (!hasRolled || getSelectedDice().length === 0) {
            rollDice();
          }
        }, 1200);
      }, 900);
    }

    diceWrap.addEventListener("click", (event) => {
      const button = event.target.closest(".die");
      if (!button) return;
      const die = dice.find((item) => item.id === button.dataset.id);
      if (!die || gameOver || isRolling || !hasRolled || (gameMode === "ai" && currentPlayer === 1) || !isLocalPlayersTurn()) return;
      toggleDieSelection(die);
      renderDice();
      renderStatus();
    });

    function showGame(mode) {
      modeScreen.hidden = true;
      gameApp.hidden = false;
      gameMode = mode;
      updateRoomUi();
    }

    function showModeScreenAfterLeave(message = t("leftRoom")) {
      clearPollTimer();
      clearAiTimer();
      clearRollFaceTimer();
      clearTurnTimer();
      closeResultModal();
      gameMode = null;
      roomCode = null;
      roomName = "";
      playerToken = null;
      playerIndex = null;
      roomStatus = null;
      lastRoomUpdatedAt = null;
      roomVersion = 0;
      isResolvingTimeout = false;
      isTestingMode = false;
      maxPlayers = 2;
      chatMessages = [];
      modeScreen.hidden = false;
      gameApp.hidden = true;
      mpPanel.hidden = false;
      roomStatusText.textContent = message;
      updateRoomUi();
      renderTestPanel();
    }

    function startGame(mode) {
      clearPollTimer();
      clearMultiplayerSession();
      closeResultModal();
      isTestingMode = false;
      roomCode = null;
      roomName = "";
      playerToken = null;
      playerIndex = null;
      roomStatus = null;
      lastRoomUpdatedAt = null;
      roomVersion = 0;
      isResolvingTimeout = false;
      updateRoomUi();
      setPlayerCount(2, mode === "ai");
      showGame(mode);
      resetGame();
    }

    function startTestingMode() {
      closeResultModal();
      clearPollTimer();
      clearMultiplayerSession();
      isTestingMode = true;
      roomCode = null;
      roomName = "Testing " + testingRoomCode;
      playerToken = null;
      playerIndex = null;
      roomStatus = null;
      lastRoomUpdatedAt = null;
      roomVersion = 0;
      setPlayerCount(2, true);
      players[0].name = getLobbyPlayerName("Admin");
      showGame("ai");
      resetGame();
      isTestingMode = true;
      renderTestPanel();
      setMessage(t("testMode"));
    }

    function exitCurrentGame() {
      if (gameMode === "mp") {
        clearMultiplayerSession();
        showModeScreenAfterLeave(t("leftRoom"));
        return;
      }
      clearAiTimer();
      clearRollFaceTimer();
      clearTurnTimer();
      closeResultModal();
      isTestingMode = false;
      gameMode = null;
      modeScreen.hidden = false;
      gameApp.hidden = true;
      mpPanel.hidden = true;
      renderTestPanel();
    }

    async function createMultiplayerRoom() {
      createRoomBtn.disabled = true;
      joinRoomBtn.disabled = true;
      findRoomBtn.disabled = true;
      roomResults.hidden = true;
      roomStatusText.textContent = t("creatingRoom");

      try {
        gameMode = "mp";
        maxPlayers = Math.max(2, Math.min(4, Number(maxPlayersSelect.value || 4)));
        roomName = getLobbyRoomName();
        players = [createPlayer(0, getLobbyPlayerName(t("player", { n: 1 })))];
        savedDiceValues = [[]];
        chatMessages = [];
        resetGame();
        const data = await apiRequest("create_room.php", {
          state: buildStateSnapshot(),
          maxPlayers,
          roomName: getLobbyRoomName(),
          playerName: getLobbyPlayerName(t("player", { n: 1 }))
        });
        roomCode = data.code;
        roomName = data.state?.roomName || roomName;
        playerToken = data.token;
        playerIndex = data.playerIndex;
        roomStatus = data.status;
        lastRoomUpdatedAt = data.updatedAt || null;
        roomVersion = Number(data.version || 1);
        storeMultiplayerSession();
        showGame("mp");
        applyStateSnapshot(data.state);
        setRoomStatus(t("roomCreated", { code: roomCode, count: players.length, max: maxPlayers }));
        startPolling();
      } catch (error) {
        gameMode = null;
        roomStatusText.textContent = error.message;
      } finally {
        createRoomBtn.disabled = false;
        joinRoomBtn.disabled = false;
        findRoomBtn.disabled = false;
      }
    }

    async function joinMultiplayerRoom() {
      const code = roomCodeInput.value.trim().toUpperCase();
      if (!code) {
        roomStatusText.textContent = t("enterCode");
        return;
      }
      await enterMultiplayerRoom(code);
    }

    async function findMultiplayerRoom() {
      createRoomBtn.disabled = true;
      joinRoomBtn.disabled = true;
      findRoomBtn.disabled = true;
      roomStatusText.textContent = t("searchingRooms");

      try {
        const data = await apiRequest("list_rooms.php");
        renderRoomResults(data.rooms || []);
        roomStatusText.textContent = (data.rooms || []).length ? t("chooseRoom") : t("noRooms");
      } catch (error) {
        roomResults.hidden = true;
        roomStatusText.textContent = error.message;
      } finally {
        createRoomBtn.disabled = false;
        joinRoomBtn.disabled = false;
        findRoomBtn.disabled = false;
      }
    }

    async function enterMultiplayerRoom(code) {
      if (code === null) code = "";
      code = String(code).trim().toUpperCase();
      if (code === testingRoomCode) {
        startTestingMode();
        roomStatusText.textContent = t("testingStarted");
        return;
      }
      createRoomBtn.disabled = true;
      joinRoomBtn.disabled = true;
      findRoomBtn.disabled = true;
      roomResults.hidden = true;
      roomStatusText.textContent = t("joiningRoom");

      try {
        const data = await apiRequest("join_room.php", {
          code,
          playerName: getLobbyPlayerName(t("player", { n: "" }).trim())
        });
        roomCode = data.code;
        roomName = data.state?.roomName || "";
        playerToken = data.token;
        playerIndex = data.playerIndex;
        roomStatus = data.status;
        lastRoomUpdatedAt = data.updatedAt || null;
        roomVersion = Number(data.version || 1);
        gameMode = "mp";
        storeMultiplayerSession();
        showGame("mp");
        applyStateSnapshot(data.state);
        setRoomStatus(t("joinedRoom", { code: roomCode }));
        startPolling();
      } catch (error) {
        roomStatusText.textContent = error.message;
      } finally {
        createRoomBtn.disabled = false;
        joinRoomBtn.disabled = false;
        findRoomBtn.disabled = false;
      }
    }

    aiModeBtn.addEventListener("click", () => startGame("ai"));
    multiplayerModeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      mpPanel.hidden = !mpPanel.hidden;
      if (!mpPanel.hidden) roomCodeInput.focus();
    });
    createRoomBtn.addEventListener("click", createMultiplayerRoom);
    findRoomBtn.addEventListener("click", findMultiplayerRoom);
    joinRoomBtn.addEventListener("click", joinMultiplayerRoom);
    startRoomBtn.addEventListener("click", startMultiplayerRoom);
    chatForm.addEventListener("submit", sendChatMessage);
    rulesBtn.addEventListener("click", () => openInfoModal("rules"));
    howToBtn.addEventListener("click", () => openInfoModal("how"));
    infoModalClose.addEventListener("click", closeInfoModal);
    infoModal.addEventListener("click", (event) => {
      if (event.target === infoModal) closeInfoModal();
    });
    soundToggleButtons.forEach((button) => button.addEventListener("click", toggleSounds));
    languageToggleButtons.forEach((button) => button.addEventListener("click", toggleLanguage));
    roomCodeInput.addEventListener("input", () => {
      roomCodeInput.value = roomCodeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    });

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    rollBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (isRolling || rollBtn.disabled) return;
      rollDice();
    });
    keepBtn.addEventListener("click", keepSelectedDice);
    bankBtn.addEventListener("click", bankPoints);
    resetBtn.addEventListener("click", resetGame);
    leaveRoomBtn.addEventListener("click", handleLeaveGame);
    resultPrimaryBtn.addEventListener("click", () => {
      closeResultModal();
      if (gameMode === "mp") {
        roomStatus = "active";
      }
      resetGame();
    });
    resultSecondaryBtn.addEventListener("click", exitCurrentGame);
    testExitBtn.addEventListener("click", exitCurrentGame);

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !infoModal.hidden) {
        closeInfoModal();
        return;
      }
      if (!gameMode) return;
      if (event.target === chatInput || event.target === roomCodeInput) return;
      if (event.code === "Space") {
        event.preventDefault();
        rollDice();
      }
      if (event.key === "Enter") {
        keepSelectedDice();
      }
    });

    restoreMultiplayerSession();
    updateSoundToggleLabels();
    applyLanguage();
    appVersionText.textContent = appVersion;
