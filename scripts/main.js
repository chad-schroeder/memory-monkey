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
      deck.appendChild(cardContainer);
    });

    setTimeout(() => {
      this.play();
    }, 2000);
  },
  play() {
    // shuffle card data
    this.shuffle();
    console.log(this.data.cards);

    // deal out cards
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
      card.setAttribute('data-match', this.data.cards[index]);
      card.classList.remove('card-stacked');
    });

    this.data.allowClick = true;
  },
  cardSelection(currentId, currentMatch) {
    // update score
    this.data.score += 1;
    score.textContent = this.data.score;

    // if no previous stored card exists, set to this one
    if (!this.data.storedId) {
      console.log('new card');
      this.data.storedId = currentId;
      this.data.storedMatch = currentMatch;
    } else {
      console.log('checking for match...');
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
    console.log('match!');

    // update matched count
    this.data.matched += 1;

    // update classes on matched cards
    [
      deck.querySelector(`#${this.data.storedId}`),
      deck.querySelector(`#${currentId}`)
    ].forEach(card => card.classList.add('card-matched'));

    this.resetCards();
  },
  unmatch(currentId, currentMatch) {
    console.log('no match');

    // flip selected cards back over after 1 second
    setTimeout(() => {
      [
        deck.querySelector(`#${this.data.storedId}`),
        deck.querySelector(`#${currentId}`)
      ].forEach(card => {
        card.classList.remove('card-selected', 'is-flipped');
      });

      // reset stored data
      this.resetCards();
    }, 1000);
  },
  resetCards() {
    if (this.data.matched === 8) {
      this.gameOver();
    } else {
      this.data.storedId = '';
      this.data.storedMatch = '';
      this.data.allowClick = true;
    }
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
    console.log('Game over!');

    // new best score
    if (this.data.bestScore === '' || this.data.score < this.data.bestScore) {
      this.data.bestScore = this.data.score;
      bestScore.textContent = this.data.score;
    }

    // save score to local storage
    localStorage.setItem('bestScore', this.data.score);

    // display random congratulations
    const messages = [
      'Jolly good show!',
      'Well done, Old Bean!',
      'Pip! Pip! Hooray!',
      'Absolutely spiffing!',
      'By Jove, sensational!'
    ];
    alertHeading.textContent =
      messages[Math.floor(Math.random() * messages.length)];
  }
};

const deck = document.querySelector('.card-stack');
const score = document.querySelector('.score');
const bestScore = document.querySelector('.best-score');
const alert = document.querySelector('.alert');
const alertHeading = alert.querySelector('.alert-heading');

const cardSelection = event => {
  if (!event.target.closest('.card')) return;
  console.log(event.target);

  const parent = event.target.parentNode.parentNode;
  const cardId = parent.getAttribute('id');
  const cardMatch = parent.getAttribute('data-match');

  if (game.data.storedId !== cardId && game.data.allowClick) {
    parent.classList.add('is-flipped');
    game.cardSelection(cardId, cardMatch);
  }
};

document.addEventListener(
  'click',
  function(event) {
    cardSelection(event);
  },
  false
);

game.init();
