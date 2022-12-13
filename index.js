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


function startGame() {

  cards = []
  let firstCard = getRandomCard()
  let secondCard = getRandomCard()
  
  if(JSON.stringify(firstCard) != JSON.stringify(secondCard)) {
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
    setInterval(function () {
      cardsEl.innerHTML = `<h2>You've got Blackjack!</h2>`
    }, 2000)
   
    message = "You've got Blackjack!"
    hasBlackJack = true
  } else {
    message = "You're out of the game!"
    isAlive = false
  }
  messageEl.textContent = message
  let cardsImg = document.querySelector("#cards-el").children

  /*Style */
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
      let includes = cards.some(item => JSON.stringify(card) === JSON.stringify(item))
      if(!includes) {
        cards.push(card)
        sum += card.deckValue
        renderGame()      
      }
  }
}

/*Style*/


