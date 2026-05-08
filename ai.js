(function () {
  "use strict";

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

  function bestOpponentScore(state) {
    return Math.max(...state.players.map((player, index) => index === state.currentPlayer ? 0 : player.score));
  }

  function leaderScore(state) {
    return Math.max(...state.players.map((player) => player.score));
  }

  function getRequiredBankPoints(player, rules) {
    return player.score >= rules.highScoreThreshold ? rules.highScoreBankMinimum : rules.standardBankMinimum;
  }

  function estimateRollRisk(diceLeft) {
    const risks = {
      1: 0.66,
      2: 0.44,
      3: 0.28,
      4: 0.18,
      5: 0.11,
      6: 0.08
    };
    return risks[Math.max(1, Math.min(6, diceLeft))] || 0.2;
  }

  function rateSelection(selection, result, state, rules) {
    const player = state.players[state.currentPlayer];
    const remainingDice = state.activeDice.length - selection.length;
    const diceAfterKeep = remainingDice === 0 ? 6 : remainingDice;
    const requiredBank = getRequiredBankPoints(player, rules);
    const opponentsBest = bestOpponentScore(state);
    const projectedTurn = state.turnPoints + result.points;
    const projectedTotal = player.score + projectedTurn;
    const currentLeader = leaderScore(state);
    const rollRisk = estimateRollRisk(diceAfterKeep);
    let rating = result.points;

    if (remainingDice === 0) rating += 360;
    if (diceAfterKeep >= 4) rating += 95;
    if (diceAfterKeep === 3) rating += 52;
    if (diceAfterKeep <= 2) rating -= Math.round(rollRisk * 90);

    if (projectedTurn >= requiredBank) rating += 120;
    if (player.score >= rules.highScoreThreshold && projectedTurn >= rules.highScoreBankMinimum) rating += 220;
    if (player.strikes >= 2 && projectedTurn >= requiredBank) rating += 75;

    if (selection.length === 1 && result.points < 100 && state.turnPoints < requiredBank) rating -= 50;
    if (selection.length === state.activeDice.length && result.points < 350 && remainingDice !== 0) rating -= 60;

    if (opponentsBest >= 10000 && projectedTotal >= opponentsBest) rating += 520;
    if (projectedTotal >= 10000) rating += 300;
    if (player.score < currentLeader && projectedTotal > currentLeader) rating += 190;
    if (currentLeader - player.score >= 2500 && projectedTurn < 700 && diceAfterKeep >= 3) rating += 95;

    return rating;
  }

  function chooseSelection(state, rules, scoreSelection) {
    let bestChoice = null;

    for (const subset of getDiceSubsets(state.activeDice)) {
      const result = scoreSelection(subset);
      if (!result.valid) continue;

      const rating = rateSelection(subset, result, state, rules);
      const diceLeft = state.activeDice.length - subset.length;
      const choice = {
        ids: subset.map((die) => die.id),
        points: result.points,
        length: subset.length,
        diceLeft,
        rating
      };

      if (
        !bestChoice ||
        choice.rating > bestChoice.rating ||
        (choice.rating === bestChoice.rating && choice.points > bestChoice.points) ||
        (choice.rating === bestChoice.rating && choice.points === bestChoice.points && choice.diceLeft > bestChoice.diceLeft)
      ) {
        bestChoice = choice;
      }
    }

    return bestChoice || { ids: [], points: 0, length: 0, diceLeft: state.activeDice.length, rating: 0 };
  }

  function shouldBank(state, rules) {
    if (state.mustKeepAfterFullReset) return false;

    const player = state.players[state.currentPlayer];
    const requiredBank = getRequiredBankPoints(player, rules);
    if (state.turnPoints < requiredBank) return false;

    const totalScore = player.score;
    const projectedScore = totalScore + state.turnPoints;
    const diceLeft = state.activeDice.length || 6;
    const opponentsBest = bestOpponentScore(state);
    const lead = projectedScore - opponentsBest;
    const behind = opponentsBest - totalScore;
    const risk = estimateRollRisk(diceLeft);

    if (opponentsBest >= 10000 && projectedScore >= opponentsBest) return true;
    if (projectedScore >= 10000 && state.turnPoints >= requiredBank) return true;
    if (totalScore >= rules.highScoreThreshold && state.turnPoints >= rules.highScoreBankMinimum) return true;
    if (player.strikes >= 2 && state.turnPoints >= 500) return true;
    if (lead >= 1800 && state.turnPoints >= requiredBank) return true;

    if (behind >= 3500 && state.turnPoints < 1000 && diceLeft >= 3 && risk < 0.35) return false;
    if (behind >= 1800 && state.turnPoints < 750 && diceLeft >= 4) return false;

    if (totalScore < 3500) {
      if (state.turnPoints >= 1200) return true;
      if (state.turnPoints >= 850 && diceLeft <= 3) return true;
      if (state.turnPoints >= 600 && diceLeft <= 2) return true;
      return false;
    }

    if (totalScore < 8000) {
      if (state.turnPoints >= 1000) return true;
      if (state.turnPoints >= 700 && diceLeft <= 3) return true;
      if (state.turnPoints >= 500 && diceLeft <= 2) return true;
      return false;
    }

    if (state.turnPoints >= 800) return true;
    if (state.turnPoints >= 550 && diceLeft <= 3) return true;
    if (state.turnPoints >= requiredBank && diceLeft <= 2) return true;
    return false;
  }

  window.FarcleAi = {
    chooseSelection,
    shouldBank
  };
}());
