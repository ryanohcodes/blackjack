class BlackJack{
  constructor(numberOfDecks){
    this.numberOfDecks = numberOfDecks
    this.id = ''
    this.cardsInDeck = 0
    this.playerCardsValue = []
    this.playerCardsImage = []
    this.dealerCardsValue = []
    this.dealerCardsImage = []
    this.nya = ['css/img/4765327.jpg']
    this.splitHand = [];
    this.splitHandImage = [];
    this.playerTotal = 0;
    this.dealerTotal = 0;
  }
  // gets the number of decks, id, and cards remaining
  startGame(){
    if(this.id == false){
      fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res=>res.json())
      .then(data=>{
        this.id = data.deck_id
        this.cardsInDeck = data.remaining;
        this.deal()
      })
      .catch(err=>{
        console.log(`error ${err}`)
      })
    }
    else{
      this.deal()
    }
  }
  handUpdate(){
    this.playerTotal = this.playerCardsValue.reduce((sum,x) => sum + x,0)
    this.dealerTotal = this.dealerCardsValue.reduce((sum,x) => sum +x,0)
  }
  convert(card){
    if (card === 'KING') return 10
    else if (card === 'QUEEN') return 10
    else if (card === 'JACK') return 10
    else if (card === 'ACE') return 11
    else return Number(card)
  }
  reset(){
    if(document.querySelector('h1').textContent != false) {
      while(player.firstChild){
        player.removeChild(player.firstChild)
      }
      while(dealer.firstChild){
        dealer.removeChild(dealer.firstChild)
      }
      document.querySelector('.split').classList.add('hidden')
      document.querySelector('h1').textContent = ''
       this.playerCardsValue = []
       this.playerCardsImage = []
       this.dealerCardsValue = []
       this.dealerCardsImage = []
       this.splitHand = []
       this.dealerTotal = 0
       this.playerTotal = 0
    }
  }
  aceLogic(){
    this.handUpdate()
    if(this.playerCardsValue.includes(11) && this.playerTotal > 21){
      this.playerCardsValue.splice(this.playerCardsValue.indexOf(11),1,1)
    }
    if(this.dealerCardsValue.includes(11) && this.dealerTotal > 21){
      this.dealerCardsValue.splice(this.dealerCardsValue.indexOf(11),1,1)
    }
    this.handUpdate()
  }
  newDeck(){
    if(this.cardsInDeck < 15){
      fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
          .then(res=>res.json())
          .then(data=>{
            this.id = (data.deck_id);
            this.cardsInDeck = data.remaining;
          })
          .catch(err=>{
            console.log(`error ${err}`)
          })
    }
  }
  deal(){
    this.reset();
    this.newDeck();
    if(this.playerCardsValue.length > 0) return

    fetch(`https://deckofcardsapi.com/api/deck/${this.id}/draw/?count=4`)
      .then(res=>res.json())
      .then(data=>{
        for(let number in data.cards){
          
          if(number %2 === 1){
            this.dealerCardsImage.push(data.cards[number].image)
            this.dealerCardsValue.push(this.convert(data.cards[number].value))
            const img = document.createElement('img')
            img.src = data.cards[number].image
            if(number == 1) dealer.appendChild(img)
            if(number == 3) {
              const img = document.createElement('img')
              img.classList.add('nya')
              img.src = this.nya[0]
              dealer.appendChild(img)
            }
          }else {
            this.playerCardsImage.push(data.cards[number].image)
            this.splitHand.push(data.cards[number].value)
            this.playerCardsValue.push(this.convert(data.cards[number].value))
            const img = document.createElement('img')
            img.src = data.cards[number].image
            player.appendChild(img)
          }
        }
        this.cardsInDeck = data.remaining;
        this.handUpdate()
        this.checkSplit()
        if(this.playerTotal=== 21) {
          document.querySelector('h1').textContent = 'BLACKJACK!!!'
          this.revealCard()
        }
        if(this.dealerTotal=== 21) {
          document.querySelector('h1').textContent = 'YOU LOSE'
          this.revealCard()
        }
        
        if(this.playerTotal ===21 && this.dealerTotal === 21) {
          document.querySelector('h1').textContent = 'That sucks lol'
          this.revealCard()
        }
        
      })
      .catch(err=>{
        console.log(`error ${err}`)
      })
  }
  checkSplit(){
    if(this.splitHand[0] === this.splitHand[1]){
      document.querySelector('.split').classList.remove('hidden')
    }
  }
  split(){
    this.playerCardsValue = this.playerCardsValue[0]
    this.splitHand = this.playerCardsValue[0]
  }
  hit(){
    if(this.playerCardsValue.length === 0) return
    if(document.querySelector('h1').textContent != '') return
    fetch(`https://deckofcardsapi.com/api/deck/${this.id}/draw/?count=1`)
    .then(res=>res.json())
    .then(data=>{
      for(let number in data.cards){
          this.playerCardsImage.push(data.cards[number].image)
          this.playerCardsValue.push(this.convert(data.cards[number].value))
          const img = document.createElement('img')
          img.src = data.cards[number].image
          player.appendChild(img)
      }
      this.cardsInDeck = data.remaining;
      this.playerBust();
    })
    .catch(err=>{
      console.log(`error ${err}`)
    })
  }

  playerBust(){
    this.aceLogic();
    if(this.playerTotal > 21) {
      this.revealCard()
      return document.querySelector('h1').textContent = 'YOU LOSE'
    } else if(this.playerTotal === 21) {
      this.revealCard()
      return document.querySelector('h1').textContent = 'YOU WIN'
    }
  }
  dealerBust(){
    this.aceLogic();
    if(this.dealerTotal > 21) {
      document.querySelector('h1').textContent = 'YOU WIN'
      return
    }
    else if (this.dealerTotal === 21) {
      document.querySelector('h1').textContent = 'YOU LOSE'
      return
    }
    if(this.dealerTotal >= 17){
      if(this.playerTotal > this.dealerTotal){
        document.querySelector('h1').textContent = 'YOU WIN'
        return
      }else if(this.dealerTotal === this.playerTotal){
        document.querySelector('h1').textContent = 'PUSH'
        return
      }else {
        document.querySelector('h1').textContent = 'YOU LOSE'
        return
      } 
    }else{
      this.end()
    }
  }
  revealCard(){
    document.querySelector('.nya').classList.add('hidden')
    img.src = this.dealerCardsImage[1]
    dealer.appendChild(img)
  }
  end(){
    if(this.playerCardsValue.length === 0) return
    if(document.querySelector('h1').textContent != '') return
    this.revealCard()
    if (this.dealerTotal >= 17){
      this.dealerBust()
      return
    }
      fetch(`https://deckofcardsapi.com/api/deck/${this.id}/draw/?count=1`)
      .then(res=>res.json())
      .then(data=>{
        for(let number in data.cards){
          this.dealerCardsImage.push(data.cards[number].image)
          this.dealerCardsValue.push(this.convert(data.cards[number].value))
          const dealer= document.getElementById('dealer')
          const img = document.createElement('img')
          img.src = data.cards[number].image
          dealer.appendChild(img)
        }
        this.cardsInDeck = data.remaining;
        this.dealerBust();
      })
      .catch(err=>{
        console.log(`error ${err}`)
      })
    

  }
}
const firstDeck = new BlackJack(1)

const dealer= document.getElementById('dealer')
const img = document.createElement('img')
const player= document.getElementById('player')
const imgs= document.querySelector('img')
const startButton = document.querySelector('.start')
const hitButton = document.querySelector('.hit')
const endButton = document.querySelector('.end')

startButton.addEventListener('click', ()=>{
  firstDeck.startGame()
})

hitButton.addEventListener('click', ()=>{
  firstDeck.hit()
})

endButton.addEventListener('click',()=>{
  firstDeck.end()
})


