/*
Author: Hajer Hamed (hamed.hajer@live.fr)
content: contribution to Udacity fend-memory-game

*/

//************************VAR INIT AREA***************************

//A restricted array to two to contain the two cards chosen to be opened
let openedCards = [];
//A moves counter
let Movescounter = 0;
//Number of clicks
let clicks = 0;
//Number of moves
let moves = 0;
//number of matched cards
let matches = 0;
//timer values
let interval;
let timer = document.querySelector('#timer');
timer.innerHTML = '0 mins : 0 secs';
let seconds = 0,
    minutes = 0,
    hours = 0;
//let time = timeCounter();
//stars icons
let stars = $('.fa-star');
//deck of cards
let deck = $('.deck')

//************************CONTROLLER AREA***************************

//Intial card list
let cardList = cardsInit();
//console.log(cardList);
//Shuffled card list
let shuffledList = shuffle(cardList);
//console.log(shuffledList); // 1st attempt : Not shuffled as 'shuffle' function expects an array => Need to convert cardList => transform()

//Function to display the cards' symbols
displayCards();

//Add event listener : click on card => timeCounter() - cardsMatcher
$('.card').on('click', function () {
    clicks++;
    if (clicks == 1) {
      setInterval(function(){
                        timeCounter();
                      }, 1000);
        //Function to count playing time

    }
    //Function to check if two cards are matching
    cardsMatcher(this); // where 'this' refers to the clicked card
});

//Add event listener : click on button restart => reset game
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", function () {
    location.reload();

});

//************************OPERTAIONAL AREA***************************

function cardsInit() {
    // to initialize cards
    let getCards = [];
    getCards = document.getElementsByClassName('card');
    return transform(getCards); //so that our cardsInit can get shuffled
}
//---------------------------------------------------------
function transform(obj) {
    // to return the object to 'shuffle' as expected
    let transformed = [];
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            transformed.push(obj[i].innerHTML);
        }
    }
    return transformed;
}
//---------------------------------------------------------


function displayCards() {
    // to display cards
    let list = manageCardsList();
    replaceCardsLists(list);
}
//---------------------------------------------------------

function replaceCardsLists(list) {
    //to replace the actual cards deck by the one we created (shuffled)
    document.getElementsByClassName('deck')[0].innerHTML = list.innerHTML;
}
//---------------------------------------------------------

function manageCardsList() {
    // We need to overwrite the initial cards list to the new shuffled cards
    let list = document.createElement('ul');
    for (let i = 0; i < shuffledList.length; i++) {
        let li = document.createElement('li');
        li.innerHTML = shuffledList[i];
        li.classList.add('card'); // helps adding a class 'card' to the li element
        list.appendChild(li); // our li has to be combined with the ul we already created
    }
    return list;
}

//---------------------------------------------------------

function isClicked(card){
  //find out if a card is clicked (it has classes 'open' or 'match')
  if($(card).hasClass('show') || $(card).hasClass('open')){
    return true;
  }
  else return false;

}
//---------------------------------------------------------

function cardsMatcher(card) {
    //to handle matched cards
    //We need to block the moves counter if a card is already clicked
    if(isClicked(card)){
      return;
    }
    displaySymbol(card);
    markAsOpened(card);
}
//---------------------------------------------------------

function displaySymbol(card) {
    //display the card's symbol
    $(card).addClass('open');
    $(card).addClass('show');

}
//---------------------------------------------------------

function countMoves() {
    //to count the number of moves
    moves++;
    $('.moves').text(moves);
}
//---------------------------------------------------------

function areMatching(openedCards) {
    //to verify if cards are matching
    let condition1 = openedCards[0].innerHTML != openedCards[1].innerHTML; //check if different content
    let condition2 = $(openedCards[0]).is($(openedCards[1])) //check if same node
    if (condition1 || condition2) {
        return false;
    } else {
        return true;
    }
}


//---------------------------------------------------------
function markAsMatched(openedCards) {
    //keep the cards at the opened position (class 'match')
    for (let i = 0; i < openedCards.length; i++) {
        $(openedCards[i]).addClass('match');
    }
}
//---------------------------------------------------------

function manageNonMatchingCards(openedCards) {
    // if the cards do not match, animate the cards, remove the cards from the list and hide the card's symbol

    //we need a little delay to be able to visualize the symbols before deleting them
    let theseCards = openedCards;
    setTimeout(function () {

        markAsnonMatched(theseCards);

    }, 1000);


}

//---------------------------------------------------------

function markAsnonMatched(openedCards) {
    //remove the cards from the list and hide the card's symbol and color (classes 'open' & 'show')

    setTimeout(function () {
        for (let i = 0; i < openedCards.length; i++) {
            $(openedCards[i]).removeClass('open');
            $(openedCards[i]).removeClass('show');

        }
    }, 1000);
}


//---------------------------------------------------------
function markAsOpened(card) {
    //check openedCards array

    if (openedCards.length > 0) {
        countMoves();
        //display card's symbol
        openedCards.push(card);
        //check to see if the two cards match
        if (areMatching(openedCards)) {
            markAsMatched(openedCards);
            //truncate openedCards
            openedCards = [];
            matches++;
            console.log(matches);
        } else {
            //  $(openedCards).addClass('nonMatching');
            markAsnonMatched(openedCards);

            //truncate openedCards
            openedCards = [];


        }
    } else {
        openedCards.push(card); //display symbol
        countMoves(); //increment moves' number
    }
    setTimeout(function () {
        gameStatistics();
    }, 1000);
}
//---------------------------------------------------------
function gameStatistics() {
    let rating = ratingScore(moves);
    clearInterval(interval);
    let time = $('#timer').text();
    //check if all the cards are matching
    if (matches === 8) {

  swal({
  title: "Congratulations!",
  text:  `You won in ${time}  and made ${moves} moves! That was a ${rating} star performance! Do you want to play again?`,
  icon: "success",
  buttons: true,
  dangerMode: true,
})
.then((willDelete) => {
  if (willDelete) {
    location.reload();
  } else {
    swal("See you soon! Have a nice day :) ");
  }
});
}
}
//---------------------------------------------------------
function ratingScore(moves) {
    let rating = 3;
    if (moves <= 16) {
        stars.eq(3).removeClass('fa-star');
        rating = 3;
    } else if (moves > 16 && moves < 24) {
        stars.eq(2).removeClass('fa-star');
        rating = 2;
    } else if (moves > 24) {
        stars.eq(1).removeClass('fa-star');
        rating = 1;
    }
    return rating;
}

//---------------------------------------------------------

function timeCounter() {
    // calculate playing time

        timer.innerHTML = minutes + ' mins ' + ' : ' + seconds + ' secs';
        seconds++;
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes == 60) {
            hours++;
            minutes = 0;
        }


}

//---------------------------------------------------------
function shuffle(array) {
    // Shuffle function from http://stackoverflow.com/a/2450976
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
