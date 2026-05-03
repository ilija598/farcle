const modeScreen = document.getElementById("modeScreen");
    const gameApp = document.getElementById("gameApp");
    const aiModeBtn = document.getElementById("aiModeBtn");
    const multiplayerModeBtn = document.getElementById("multiplayerModeBtn");
    const soundToggle = document.getElementById("soundToggle");
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

    const pipMap = {
      1: [[50, 50]],
      2: [[28, 28], [72, 72]],
      3: [[28, 28], [50, 50], [72, 72]],
      4: [[28, 28], [72, 28], [28, 72], [72, 72]],
      5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
      6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]]
    };

    let players = [
      { name: "Igrac 1", score: 0, strikes: 0, timeoutStrikes: 0, aiControlled: false },
      { name: "Igrac 2", score: 0, strikes: 0, timeoutStrikes: 0, aiControlled: false }
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
    const appVersion = "v18";
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

    function getLobbyPlayerName(fallback = "Igrac") {
      return cleanName(playerNameInput.value, fallback, 18);
    }

    function getLobbyRoomName() {
      return cleanName(roomNameInput.value, "Farcle soba", 28);
    }

    function openInfoModal(kind) {
      const isHowTo = kind === "how";
      infoModalTitle.textContent = isHowTo ? "Kako se igra" : "Pravila";
      rulesModalContent.hidden = isHowTo;
      howToModalContent.hidden = !isHowTo;
      infoModal.hidden = false;
      infoModalClose.focus();
    }

    function closeInfoModal() {
      infoModal.hidden = true;
    }

    function updateSoundToggleLabels() {
      const label = soundsMuted ? "Zvuk: iskljucen" : "Zvuk: ukljucen";
      soundToggle.textContent = label;
      soundToggle.classList.toggle("muted", soundsMuted);
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
        name: name || ("Igrac " + (index + 1)),
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
      title.textContent = player.name + (player.aiControlled ? " (AI)" : "");
      head.appendChild(title);

      const scoreBox = document.createElement("div");
      scoreBox.className = "player-score-box";
      scoreBox.innerHTML = "<span>Ukupno</span><strong>" + player.score + "</strong>";
      head.appendChild(scoreBox);
      card.appendChild(head);

      const stats = document.createElement("div");
      stats.className = "player-stats";
      stats.innerHTML =
        "<div><span>Crtice</span><strong class=\"strike-marks\">" + (player.strikes > 0 ? "/".repeat(player.strikes) : "") + "</strong></div>" +
        "<div><span>AFK</span><strong>" + (player.timeoutStrikes || 0) + "/2</strong></div>";
      card.appendChild(stats);

      const savedArea = document.createElement("div");
      savedArea.className = "saved-area";
      const savedLabel = document.createElement("span");
      savedLabel.textContent = "Sacuvane kockice";
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
        row.innerHTML = "<span>Jos nema odigranih poteza.</span><strong>0</strong>";
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
          playersList.appendChild(buildPlayerCard(createPlayer(index, "Ceka igraca " + (index + 1)), index));
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
        row.textContent = "Nema poruka.";
        chatList.appendChild(row);
        return;
      }

      for (const item of visibleMessages) {
        const row = document.createElement("div");
        row.className = "chat-item";
        const name = document.createElement("strong");
        name.textContent = item.name || "Igrac";
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
      turnTimerEl.textContent = String(getTurnSecondsLeft());
    }

    function updateSelectedPoints() {
      const result = scoreSelection(getSelectedDice());
      selectedPointsEl.textContent = result.valid ? String(result.points) : "0";
    }

    function renderStatus() {
      turnText.textContent = "Na potezu: " + players[currentPlayer].name;
      turnPointsEl.textContent = String(turnPoints);
      diceLeftEl.textContent = String(getActiveDice().length || 6);
      updateTurnTimerDisplay();
      updateSelectedPoints();
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
      setMessage(players[currentPlayer].name + " baca 6 kockica.");
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
        setMessage("Kenta se automatski upisuje. Bacas ponovo svih 6.");
      } else if (result.special === "parovi") {
        showSpecialBanner("Tri para! 750");
        setMessage("Tri para se automatski upisuju. Bacas ponovo svih 6.");
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
        return "Preko 9000 nema crtica.";
      }

      player.strikes += 1;
      if (player.strikes >= 3) {
        player.score -= 1000;
        player.strikes = 0;
        return "Tri crtice: -1000 poena.";
      }
      return "Dobijena crtica.";
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
      setMessage(players[winnerIndex].name + " je pobedio sa " + players[winnerIndex].score + " poena.");
      renderAll();
      syncMultiplayerState("turn");
    }

    function endTurnAfterFarkle() {
      clearAiTimer();
      clearRollFaceTimer();
      playSound(getActiveDice().length === 6 ? "manualFarcle" : "farcle");
      const player = players[currentPlayer];
      const strikeText = " " + applyStrike(player);
      recordHistory(player.name + ": Farkle", 0);
      setMessage(player.name + " nema bodovnu kombinaciju." + strikeText);
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
        setMessage("Prvo sacuvaj izabrane kockice ili ih odznaci.");
        return;
      }
      const token = turnToken;

      let activeDice = getActiveDice();
      if (activeDice.length === 0) {
        dice = Array.from({ length: 6 }, () => createDie(1));
        activeDice = getActiveDice();
        setMessage("Iskoristio si sve kockice, vraca se svih 6.");
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
        setMessage("Izaberi bodovne kockice koje hoces da sacuvas.");
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
        setMessage("Izabrane kockice nisu validna bodovna kombinacija.");
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
        setMessage("Sacuvao si sve kockice. Bacas ponovo svih 6.");
      } else {
        setMessage("Sacuvano " + result.points + " poena. Ostaje " + remaining + " kockica.");
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
        setMessage("Za kraj poteza treba minimum " + requiredBankPoints + " poena.");
        return;
      }
      if (mustKeepAfterFullReset) {
        setMessage("Posle svih 6 sacuvanih moras jos jednom da bacis i sacuvas bar jednu kockicu.");
        return;
      }

      const banked = turnPoints;
      const endedPlayerIndex = currentPlayer;
      if (banked >= 2000) playSound("bigHand");
      player.score += banked;
      player.strikes = 0;
      savedDiceValues[currentPlayer] = [];
      recordHistory(player.name + ": upisao potez", banked);

      const winnerIndex = getWinnerAfterCompletedTurn(endedPlayerIndex);
      if (winnerIndex !== null) {
        finishGame(winnerIndex);
        return;
      }

      setMessage(player.name + " je upisao " + banked + " poena.");
      renderPlayers();
      nextPlayer();
      syncMultiplayerState("turn");
    }

    function resetGame() {
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
        name: player?.name || ("Igrac " + (index + 1)),
        score: Number(player?.score || 0),
        strikes: Number(player?.strikes || 0),
        timeoutStrikes: Number(player?.timeoutStrikes || 0),
        aiControlled: Boolean(player?.aiControlled)
      }));

      savedDiceValues = players.map((_, index) => (
        Array.isArray(state.savedDiceValues?.[index]) ? [...state.savedDiceValues[index]] : []
      ));
      chatMessages = Array.isArray(state.chatMessages) ? state.chatMessages.map((item) => ({
        name: String(item.name || "Igrac"),
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
      leaveRoomBtn.hidden = gameMode !== "mp" || !roomCode;
      leaveRoomBtn.disabled = gameMode !== "mp" || !roomCode;
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
          setMessage("Soba " + roomCode + " ceka start (" + players.length + "/" + maxPlayers + ").");
        } else if (gameOver) {
          updateRoomUi();
        } else if (!gameOver && playerIndex !== currentPlayer) {
          setMessage("Soba " + roomCode + ": cekas potez drugog igraca.");
        } else if (!gameOver && messageText.textContent.includes("ceka drugog")) {
          setMessage("Drugi igrac je usao. Tvoj potez.");
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
          setMessage("Isteklo je 60 sekundi. Potez je zavrsen.");
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

        roomStatusText.textContent = "Vracam multiplayer sobu...";
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
        setRoomStatus(gameOver ? "Partija je zavrsena." : "Vracen si u sobu " + roomCode + ".");
        startPolling();
      } catch (error) {
        clearMultiplayerSession();
        roomStatusText.textContent = "Nije moguce vratiti prethodnu sobu.";
      }
    }

    async function leaveMultiplayerRoom() {
      if (gameMode !== "mp" || !roomCode || !playerToken) return;
      if (gameOver || roomStatus === "finished") {
        clearMultiplayerSession();
        showModeScreenAfterLeave();
        return;
      }
      const confirmed = window.confirm("Izlaz iz multiplayera znaci predaju partije. Nastaviti?");
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
        setRoomStatus("Partija je startovana.");
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
        empty.textContent = "Nema otvorenih soba.";
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
        title.textContent = room.name || ("Soba " + room.code);

        const meta = document.createElement("span");
        meta.className = "room-result-meta";
        meta.textContent = room.code + " | " + room.playerCount + "/" + room.maxPlayers + " igraca";

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

    function showModeScreenAfterLeave() {
      clearPollTimer();
      clearAiTimer();
      clearRollFaceTimer();
      clearTurnTimer();
      gameMode = null;
      roomCode = null;
      roomName = "";
      playerToken = null;
      playerIndex = null;
      roomStatus = null;
      lastRoomUpdatedAt = null;
      roomVersion = 0;
      isResolvingTimeout = false;
      maxPlayers = 2;
      chatMessages = [];
      modeScreen.hidden = false;
      gameApp.hidden = true;
      mpPanel.hidden = false;
      roomStatusText.textContent = "Izasao si iz sobe. Partija je predata.";
      updateRoomUi();
    }

    function startGame(mode) {
      clearPollTimer();
      clearMultiplayerSession();
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

    async function createMultiplayerRoom() {
      createRoomBtn.disabled = true;
      joinRoomBtn.disabled = true;
      findRoomBtn.disabled = true;
      roomResults.hidden = true;
      roomStatusText.textContent = "Pravim sobu...";

      try {
        gameMode = "mp";
        maxPlayers = Math.max(2, Math.min(4, Number(maxPlayersSelect.value || 4)));
        roomName = getLobbyRoomName();
        players = [createPlayer(0, getLobbyPlayerName("Igrac 1"))];
        savedDiceValues = [[]];
        chatMessages = [];
        resetGame();
        const data = await apiRequest("create_room.php", {
          state: buildStateSnapshot(),
          maxPlayers,
          roomName: getLobbyRoomName(),
          playerName: getLobbyPlayerName("Igrac 1")
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
        setRoomStatus("Soba " + roomCode + " je napravljena. Ceka igrace (" + players.length + "/" + maxPlayers + ").");
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
        roomStatusText.textContent = "Unesi kod sobe.";
        return;
      }
      await enterMultiplayerRoom(code);
    }

    async function findMultiplayerRoom() {
      createRoomBtn.disabled = true;
      joinRoomBtn.disabled = true;
      findRoomBtn.disabled = true;
      roomStatusText.textContent = "Trazim otvorene sobe...";

      try {
        const data = await apiRequest("list_rooms.php");
        renderRoomResults(data.rooms || []);
        roomStatusText.textContent = (data.rooms || []).length ? "Izaberi sobu iz liste." : "Nema otvorenih soba.";
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
      createRoomBtn.disabled = true;
      joinRoomBtn.disabled = true;
      findRoomBtn.disabled = true;
      roomResults.hidden = true;
      roomStatusText.textContent = "Ulazim u sobu...";

      try {
        const data = await apiRequest("join_room.php", {
          code,
          playerName: getLobbyPlayerName("Igrac")
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
        setRoomStatus("Usao si u sobu " + roomCode + ". Ceka se start.");
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
    soundToggle.addEventListener("click", toggleSounds);
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
    leaveRoomBtn.addEventListener("click", leaveMultiplayerRoom);

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
    appVersionText.textContent = appVersion;
