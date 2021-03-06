const game = {
  data: {
    cards: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
    matchedCards: 0,
    activeCards: 0,
    storedCardId: '',
    storedCardMatch: '',
    score: 0,
    bestScore: '--'
  },

  init() {
    // get best score from local storage, if exists
    if (localStorage.getItem('bestScore')) {
      this.data.bestScore = localStorage.getItem('bestScore');
    }

    // display best score, or default 0
    bestScore.textContent = this.data.bestScore;

    // populate card stack
    this.data.cards.forEach((card, index) => {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card-container');

      const cardTemplate = `
        <div id=${`card-${index + 1}`} class="card">
          <div class="card-body">
            <div class="card-face card-face-front"></div>
            <div class="card-face card-face-back"></div>
          </div>
        </div>
      `;

      cardContainer.innerHTML = cardTemplate;
      stack.appendChild(cardContainer);
    });
  },

  play() {
    // reset game data
    this.data.matchedCards = 0;
    this.data.score = 0;
    score.textContent = 0;

    // hide alert box
    alert.classList.add('alert-hide');

    // shuffle card data
    this.shuffle();

    // apply card matching and remove previous game classes, if any
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      // clear out previous game card classes, if exists
      card.classList.remove('card-matched', 'is-flipped');
      card.classList.add('card-stacked');
      card.setAttribute('data-match', this.data.cards[index]);
    });

    // begin card shuffle animation
    stack.classList.remove('card-stack-loading');
    stack.classList.add('card-stack-shuffling');

    // place animated top card
    setTimeout(() => {
      const topCardContainer = document.createElement('div');
      topCardContainer.classList.add('card-container', 'card-animated');
      const cardTemplate = `
        <div class="card card-stacked">
          <div class="card-body">
            <div class="card-face card-face-front"></div>
          </div>
        </div>
      `;
      topCardContainer.innerHTML = cardTemplate;
      stack.append(topCardContainer);
    }, 1000);

    // after 4.5 seconds, remove animated card and deal out cards
    setTimeout(() => {
      stack.querySelector('.card-animated').remove();
      cards.forEach(card => card.classList.remove('card-stacked'));
    }, 4500);
  },

  // card selected, update click count and check for match
  cardSelection(currentId, currentMatch) {
    // update active cards
    this.data.activeCards += 1;

    // update score
    this.data.score += 1;
    score.textContent = this.data.score;

    // if no previous stored card exists, set to this one
    if (this.data.activeCards === 1) {
      this.data.storedCardId = currentId;
      this.data.storedCardMatch = currentMatch;
    } else {
      // check for a match
      if (this.data.storedCardMatch === currentMatch) {
        this.match();
      } else {
        this.unmatch();
      }
    }
  },

  // if match
  match() {
    // update matched cards count
    this.data.matchedCards += 1;

    // update classes on matched cards
    const cards = stack.querySelectorAll('.is-flipped');
    cards.forEach(card => card.classList.add('card-matched'));

    if (this.data.matchedCards === 8) {
      this.gameOver();
    } else {
      this.resetCards();
    }
  },

  // if not a match
  unmatch() {
    // flip selected cards back over after 1 second
    setTimeout(() => {
      this.resetCards();
      const cards = stack.querySelectorAll('.is-flipped');
      cards.forEach(card => card.classList.remove('is-flipped'));
    }, 1000);
  },

  // reset
  resetCards() {
    this.data.activeCards = 0;
    this.data.storedCardId = '';
    this.data.storedCardMatch = '';
  },

  // Fisher-Yates shuffle
  shuffle() {
    const cards = this.data.cards;

    for (let i = cards.length - 1; i > 0; i -= 1) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }
  },

  // on game end
  gameOver() {
    if (this.data.score < this.data.bestScore || this.data.bestScore === '--') {
      this.data.bestScore = this.data.score;
      bestScore.textContent = this.data.score;
      localStorage.setItem('bestScore', this.data.score);
    }

    // update alert message heading
    if (this.data.score <= 32) {
      alertHeading.textContent = 'Outstanding!';
    } else if (this.data.score <= 40) {
      alertHeading.textContent = 'Well done!';
    } else {
      alertHeading.textContent = 'Pip! Pip! Horray!';
    }

    // update button text
    playButton.textContent = 'Play Again';

    // reveal alert
    alert.classList.remove('alert-hide');

    // reset cards
    this.resetCards();
  }
};

const stack = document.querySelector('.card-stack');
const score = document.querySelector('.score');
const bestScore = document.querySelector('.best-score');
const alert = document.querySelector('.alert');
const alertHeading = alert.querySelector('.alert-heading');
const playButton = alert.querySelector('button');

// card selected
const cardSelection = event => {
  if (!event.target.closest('.card')) return;

  const card = event.target.closest('.card');
  const cardId = card.getAttribute('id');
  const cardMatch = card.getAttribute('data-match');

  if (game.data.activeCards < 2 && game.data.storedCardId !== cardId) {
    card.classList.add('is-flipped');
    game.cardSelection(cardId, cardMatch);
  }
};

// start game
const playGame = event => {
  if (!event.target.closest('[data-game=play]')) return;
  game.play();
};

// listen for card selection and start game
document.addEventListener(
  'click',
  function(event) {
    cardSelection(event);
    playGame(event);
  },
  false
);

game.init();
