let player = {
  name: "Anna",
  chips: 200
}

let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let winnerGif
let gameOver


let deck = {
  ACE: {val:11, url:[]},
  2: {val:2, url:[]},
  3: {val:3, url:[]},
  4: {val:4, url:[]},
  5: {val:5, url:[]},
  6: {val:6, url:[]},
  7: {val:7, url:[]},
  8: {val:8, url:[]},
  9: {val:9, url:[]},
  10: {val:10, url:[]},
  JACK: {val:10, url:[]},
  QUEEN: {val:10, url:[]},
  KING: {val:10, url:[]}
}


let deckVal = Object.values(deck)


fetch("https://www.deckofcardsapi.com/api/deck/new/draw/?count=52")
.then(res => res.json())
.then(data => {  
  
      for (const property in deck) {
         for(let card of data.cards) {
              if(card.value == [property]) {
                deck[property].url.push(card.image)                                     
          }       
}        
  }
  
})



playerEl.textContent = player.name + ": $" + player.chips

function getRandomCard() {
  let randomNumber = Math.floor( Math.random()* deckVal.length )
  let randomUrl
  for(let item of deckVal) {
    randomUrl = Math.floor(Math.random() * item.url.length)
  }
   return {
    "deckValue": deckVal[randomNumber].val, 
    "deckUrl":deckVal[randomNumber].url[randomUrl]
  }
}

function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }
  return true
}

function startGame() {
  clearInterval(winnerGif)
  clearInterval(gameOver)
  cards = []
  let firstCard = getRandomCard()
  let secondCard = getRandomCard()
  
  let equal = shallowEqual(firstCard, secondCard)
  
  if(!equal) {
  isAlive = true
  hasBlackJack = false
  cards = [firstCard, secondCard]
  sum = firstCard.deckValue + secondCard.deckValue

  renderGame()
  } 
 
}



function renderGame() {  
  cardsEl.innerHTML = ""
  for (let card of cards) {    
    cardsEl.innerHTML += ` <img class="card_img" src= "${card.deckUrl}"/>`
  }
  
  sumEl.textContent = "Sum: " + sum
  if (sum <= 20) {
    message = "Do you want to draw a new card?"
  } else if (sum === 21) {
    winnerGif = setInterval(function () {
      cardsEl.innerHTML = `<img class="winner" src="/images/winner.gif"/>`
    }, 1000)
    message = "You've got Blackjack!"
    hasBlackJack = true
  } else {
    message = "You're out of the game!"
    isAlive = false
    gameOver =  setInterval(function () {
      cardsEl.innerHTML = `<img class="over" src="/images/over.gif"/>`
    }, 1000)
  }
  messageEl.textContent = message

  if(isAlive && !hasBlackJack) {
    document.getElementById("start_btn").disabled = true
  }else{
    document.getElementById("start_btn").disabled = false
  }
  
  /*Style */
  let cardsImg = document.querySelector("#cards-el").children
  let topMargin = 10
  let leftMargin = -110
  for(let i=0; i<cardsImg.length; i++) {
    topMargin += 20
    cardsImg[i].style.marginTop += `${topMargin}px`
    }
    for(let i=1; i<cardsImg.length; i++) {
      cardsImg[i].style.marginLeft += `${leftMargin}px`     
    }
}


function newCard() {
  if (isAlive === true && hasBlackJack === false) {
      let card = getRandomCard()
      
      let includes = cards.some(item => shallowEqual(card, item))
      if(!includes) {
        cards.push(card)
        sum += card.deckValue
        renderGame()      
      }
  }
}
