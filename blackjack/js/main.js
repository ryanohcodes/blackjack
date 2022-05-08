let id = ''
let cardsInDeck = 0;
let playerCardsValue = []
let playerCardsImage = []
let dealerCardsValue = []
let dealerCardsImage = []
let playerTotal = 0;
let dealerTotal = 0;
const dealer= document.getElementById('dealer')
const img = document.createElement('img')
const player= document.getElementById('player')
const imgs= document.querySelector('img')

function aceLogic(){
  playerTotal = playerCardsValue.reduce((sum,x) => sum +x,0)
  dealerTotal = dealerCardsValue.reduce((sum,x) => sum +x,0)
  if(playerCardsValue.includes(11) && playerTotal > 21){
    playerCardsValue.splice(playerCardsValue.indexOf(11),1,1)
  }
  if(dealerCardsValue.includes(11) && dealerTotal > 21){
    dealerCardsValue.splice(dealerCardsValue.indexOf(11),1,1)
  }
};
function newDeck(){
  if(cardsInDeck < 15){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
          id = (data.deck_id);
          cardsInDeck = data.remaining;
        })
        .catch(err=>{
          console.log(`error ${err}`)
        })
  }
}
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  .then(res=>res.json())
  .then(data=>{
    console.log(data)
    console.log(data.remaining)
    id = (data.deck_id);
    cardsInDeck = data.remaining;
  })
  .catch(err=>{
    console.log(`error ${err}`)
  })
function reset(){
  if(document.querySelector('h1').textContent != false) {
    while(player.firstChild){
      player.removeChild(player.firstChild)
    }
    while(dealer.firstChild){
      dealer.removeChild(dealer.firstChild)
    }
    document.querySelector('h1').textContent = ''
     playerCardsValue = []
     playerCardsImage = []
     dealerCardsValue = []
     dealerCardsImage = []
     dealerTotal = 0
     playerTotal = 0
  }
}
  document.querySelector('.start').addEventListener('click', draw)
  document.querySelector('.hit').addEventListener('click', hit)
  document.querySelector('.end').addEventListener('click', end)

  function draw(){
    reset();
    newDeck();
    if(playerCardsValue.length > 0) return

    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=4`)
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        for(let number in data.cards){
          
          if(number %2 === 0){
            dealerCardsImage.push(data.cards[number].image)
            dealerCardsValue.push(convert(data.cards[number].value))
            const img = document.createElement('img')
            img.src = data.cards[number].image
            dealer.appendChild(img)
          }else {
            playerCardsImage.push(data.cards[number].image)
            playerCardsValue.push(convert(data.cards[number].value))
            const img = document.createElement('img')
            img.src = data.cards[number].image
            player.appendChild(img)
          }
        }
        cardsInDeck = data.remaining;
        playerTotal = playerCardsValue.reduce((sum,x) => sum +x,0)
        dealerTotal = dealerCardsValue.reduce((sum,x) => sum +x,0)
        if(playerTotal=== 21) document.querySelector('h1').textContent = 'BLACKJACK'
        if(dealerTotal=== 21) document.querySelector('h1').textContent = 'YOU LOSE'
        if(playerTotal ===21 && dealerTotal === 21) document.querySelector('h1').textContent = 'That sucks lol'
      })
      .catch(err=>{
        console.log(`error ${err}`)
      })
  }

  function hit(){
    if(playerCardsValue.length === 0) return
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      for(let number in data.cards){
          playerCardsImage.push(data.cards[number].image)
          playerCardsValue.push(convert(data.cards[number].value))
          const img = document.createElement('img')
          img.src = data.cards[number].image
          player.appendChild(img)
      }
      cardsInDeck = data.remaining;
      playerBust();
    })
    .catch(err=>{
      console.log(`error ${err}`)
    })
  }

  function convert(card){
    if (card === 'KING') return 10
    else if (card === 'QUEEN') return 10
    else if (card === 'JACK') return 10
    else if (card === 'ACE') return 11
    else return Number(card)
  }

  function playerBust(){
    aceLogic();
    playerTotal = playerCardsValue.reduce((sum,x) => sum +x,0)
    if(playerTotal > 21) {
      return document.querySelector('h1').textContent = 'YOU LOSE'
    }
    
    if(playerTotal === 21) {
      return document.querySelector('h1').textContent = 'YOU WIN'
    }
  }
  function dealerBust(){
    aceLogic();
    dealerTotal = dealerCardsValue.reduce((sum,x) => sum +x,0)
    if(dealerTotal > 21) {
      document.querySelector('h1').textContent = 'YOU WIN'
      return
    }
    else if (dealerTotal === 21) {
      document.querySelector('h1').textContent = 'YOU LOSE'
      return
    }
    if (dealerTotal === playerTotal) {
      document.querySelector('h1').textContent = 'PUSH'
      return
    }
    if(dealerTotal >= 17){
      if(playerTotal > dealerTotal){
        document.querySelector('h1').textContent = 'YOU WIN'
        return
      }else {
        document.querySelector('h1').textContent = 'YOU LOSE'
        return
    } 
   }
  }
  function end(){
    if(playerCardsValue.length === 0) return
    if (dealerTotal >= 17){
      dealerBust()
      return
    }
    
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      for(let number in data.cards){
        dealerCardsImage.push(data.cards[number].image)
        dealerCardsValue.push(convert(data.cards[number].value))
        const dealer= document.getElementById('dealer')
        const img = document.createElement('img')
        img.src = data.cards[number].image
        dealer.appendChild(img)
      }
      cardsInDeck = data.remaining;
      dealerBust();
    })
    .catch(err=>{
      console.log(`error ${err}`)
    })
  }