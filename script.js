const symbols = ["🚀", "🪐", "👨‍🚀", "🌙", "☄️", "🛰️", "🌎", "⭐"];
const board = document.getElementById("game-board");
const movesElement = document.getElementById("moves");
const timerElement = document.getElementById("timer");
const pairsElement = document.getElementById("pairs");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restart");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerInterval = null;
let started = false;

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function startTimer() {
  if (started) return;
  started = true;
  timerInterval = setInterval(() => {
    seconds++;
    timerElement.textContent = formatTime(seconds);
  }, 1000);
}

function createCard(symbol, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.symbol = symbol;
  card.setAttribute("aria-label", `Carta ${index + 1}, fechada`);
  card.innerHTML = '<span class="symbol"></span>';
  card.querySelector(".symbol").textContent = symbol;
  card.addEventListener("click", () => flipCard(card));
  return card;
}

function setupGame() {
  clearInterval(timerInterval);
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  started = false;
  movesElement.textContent = "0";
  timerElement.textContent = "00:00";
  pairsElement.textContent = "0/8";
  messageElement.textContent = "Escolha duas cartas para começar.";
  board.innerHTML = "";

  const deck = shuffle([...symbols, ...symbols]);
  deck.forEach((symbol, index) => board.appendChild(createCard(symbol, index)));
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;
  startTimer();
  card.classList.add("revealed");
  card.setAttribute("aria-label", `Carta revelada: ${card.dataset.symbol}`);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesElement.textContent = String(moves);
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs++;
    pairsElement.textContent = `${matchedPairs}/8`;
    resetTurn();

    if (matchedPairs === symbols.length) {
      clearInterval(timerInterval);
      messageElement.textContent = `Parabéns! Você encontrou todos os pares em ${moves} movimentos e ${formatTime(seconds)}.`;
    } else {
      messageElement.textContent = "Par encontrado! Continue assim.";
    }
  } else {
    lockBoard = true;
    messageElement.textContent = "Não foi dessa vez. Tente memorizar as posições!";
    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      firstCard.setAttribute("aria-label", "Carta fechada");
      secondCard.setAttribute("aria-label", "Carta fechada");
      resetTurn();
    }, 850);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

restartButton.addEventListener("click", setupGame);
setupGame();
