// Blackjack Game
//by John Hennessy

//Card variables:
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let ranks = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight",
"Seven", "Six", "Five", "Four", "Three", "Two"];

//Dom variables:
let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");

//Game variables:
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";
showStatus();

newGameButton.addEventListener("click", function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  showStatus();
  checkForTwentyOne();

  newGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  showStatus();
});

hitButton.addEventListener("click", function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener("click", function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
})

function createDeck() {
  let deck = [];
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
    for (rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
      let card = {
        suit: suits[suitIndex],
        rank: ranks[rankIndex]
      };

      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIndex = Math.trunc(Math.random() * deck.length);
    let temp = deck[swapIndex];
    deck[swapIndex] = deck[i];
    deck[i] = temp;
  }
}

function getCardString(card) {
  return card.rank + " of " + card.suit;
}

function getNextCard() {
  return deck.shift();
}

function getCardNumericValue(card) {
  switch (card.rank) {
    case "Ace":
      return 1;
    case "Two":
      return 2;
    case "Three":
      return 3;
    case "Four":
      return 4;
    case "Five":
      return 5;
    case "Six":
      return 6;
    case "Seven":
      return 7;
    case "Eight":
      return 8;
    case "Nine":
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.rank === "Ace") {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForTwentyOne() {
  updateScores();

  if (playerScore === 21) {
    playerWon = true;
    gameOver = true;
  }
  else if (dealerScore === 21) {
    playerWon = false;
    gameOver = true;
  }
  else if (playerScore === 21 && dealerScore === 21) {
    playerWon = false;
    gameOver = true;
  }
}

function checkForEndOfGame() {
  //Check to see if scores are current:
  updateScores();

  if (gameOver) {
    //let the dealer take cards:
    while (dealerScore <= playerScore && playerScore <=21 && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }


  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  }
  else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  }
  else if (dealerCards.length === 5 && dealerScore < 22) {
    playerWon = false;
    gameOver = true;
  }
  else if (playerScore === dealerScore) {
    playerWon = false;
    gameOver = true;
  }
  else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
    }
    else {
      playerWon = false;
    }

    // newGameButton.style.display = "inline";
    // hitButton.style.display = "none";
    // stayButton.style.display = "none";
  }
}

function showStatus() {
  if (!gameStarted) {
    textArea.innerText = "Welcome to the table!";
    return;
  }

  let dealerCardString = "";
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + "\n";
  }

  let playerCardString = "";
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + "\n";
  }

  updateScores();

  textArea.innerText = "Dealer has:\n" + dealerCardString + "(score: " + dealerScore + ")\n\n" +

  "Player has:\n" + playerCardString + "(score: " + playerScore + ")\n\n";

  if (gameOver) {
    if (playerCards.length === 2 && playerWon && playerScore === 21) {
      textArea.innerText += "Congrats! You got Blackjack!"
    }
    else if (dealerCards.length === 2 && dealerScore === 21) {
      textArea.innerText += "You are not very lucky ... Dealer got Blackjack, whomp, whomp."
    }
    else if (playerScore === 21 && dealerScore === 21) {
      textArea.innerText = "And you thought you were lucky this time! Too bad, you both got Blackjack and it's a push. No one wins, haha!"
    }
    else if (dealerCards.length === 5) {
      textArea.innerText += "Better luck next time ... Dealer reached five cards without going over twenty-one and wins!"
    }
    else if (playerWon) {
      textArea.innerText += "Winner! Winner! Chicken Dinner!";
    }
    else if (playerScore === dealerScore) {
      textArea.innerText += "It's a push, no one wins...";
    }
    else {
      textArea.innerText += "Ouch! Dealer Wins.";
    }
    newGameButton.style.display = "inline";
    hitButton.style.display = "none";
    stayButton.style.display = "none";
  }

  //This shows how the cards are put in random order:
  // for (var i = 0; i < deck.length; i++) {
  //   textArea.innerText += "\n" + getCardString(deck[i]);
  // }
}

function getNextCard() {
  return deck.shift();
}

// deck = createDeck();
//
//
// playerCards = [ getNextCard(), getNextCard() ];
