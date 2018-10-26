const game = {
  data: {
    cards: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
    matched: 0,
    storedId: '',
    storedMatch: '',
    score: 0,
    bestScore: '',
    allowClick: false
  },

  init() {
    // retrieve local storage, if exists
    if (localStorage.getItem('bestScore')) {
      bestScore.textContent = localStorage.getItem('bestScore');
    }

    // populate card stack
    this.data.cards.forEach((card, index) => {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card-container');

      const cardTemplate = `
        <div id=${`card-${index + 1}`} class="card card-stacked">
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
    // reset game data, if replay
    this.data.matched = 0;
    this.data.score = 0;
    score.textContent = this.data.score;
    const cards = document.querySelectorAll('.card');

    // hide alert box
    alert.classList.add('alert-hide');

    // shuffle card data
    this.shuffle();
    console.log(this.data.cards);

    // apply card matching and remove previous game classes, if any
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

    setTimeout(() => {
      stack.querySelector('.card-animated').remove();

      //  deal out cards
      cards.forEach(card => card.classList.remove('card-stacked'));

      // allow card clicks
      this.data.allowClick = true;
    }, 4500);
  },

  cardSelection(currentId, currentMatch) {
    // update score
    this.data.score += 1;
    score.textContent = this.data.score;

    // if no previous stored card exists, set to this one
    if (!this.data.storedId) {
      this.data.storedId = currentId;
      this.data.storedMatch = currentMatch;
    } else {
      // prevent further clicks
      this.data.allowClick = false;

      // check for a match
      if (this.data.storedMatch === currentMatch) {
        this.match(currentId, currentMatch);
      } else {
        this.unmatch(currentId, currentMatch);
      }
    }
  },

  match(currentId, currentMatch) {
    // update matched count
    this.data.matched += 1;

    // update classes on matched cards
    [
      stack.querySelector(`#${this.data.storedId}`),
      stack.querySelector(`#${currentId}`)
    ].forEach(card => card.classList.add('card-matched'));

    if (this.data.matched === 8) {
      this.gameOver();
    } else {
      this.resetCards();
    }
  },

  unmatch(currentId, currentMatch) {
    // flip selected cards back over after 1 second
    setTimeout(() => {
      [
        stack.querySelector(`#${this.data.storedId}`),
        stack.querySelector(`#${currentId}`)
      ].forEach(card => {
        card.classList.remove('is-flipped');
      });

      // reset stored data
      this.resetCards();
    }, 1000);
  },

  resetCards() {
    this.data.storedId = '';
    this.data.storedMatch = '';
    this.data.allowClick = true;
  },

  shuffle(cards) {
    // Fisher-Yates shuffle algorithm
    for (let i = this.data.cards.length - 1; i > 0; i -= 1) {
      let randomIndex = Math.floor(Math.random() * i);
      let placeholder = this.data.cards[i];
      this.data.cards[i] = this.data.cards[randomIndex];
      this.data.cards[randomIndex] = placeholder;
    }
  },

  gameOver() {
    // check for new best score
    if (!this.data.bestScore || this.data.score < this.data.bestScore) {
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
const cardSelection = event => {
  if (!event.target.closest('.card')) return;

  const parent = event.target.parentNode.parentNode;
  const cardId = parent.getAttribute('id');
  const cardMatch = parent.getAttribute('data-match');

  if (game.data.allowClick && game.data.storedId !== cardId) {
    parent.classList.add('is-flipped');
    game.cardSelection(cardId, cardMatch);
  }
};
const playGame = event => {
  if (!event.target.closest('[data-game=play]')) return;
  game.play();
};

document.addEventListener(
  'click',
  function(event) {
    cardSelection(event);
    playGame(event);
  },
  false
);

game.init();
