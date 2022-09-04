const GAME = (function () {
  //nodelist of all of the cells from html
  const cells = document.querySelectorAll('.cell');
  const submitButton = document.querySelector('.submitButton');
  //initilizing the players using the factory functions
  let player1;
  let player2;
  let winner;
  //the gameboard object. contains a playerturn property, and the currentgame array
  const gameboard = {
    //property that identifies whose turn it currently is
    playerTurn: player1,
    //array that holds the values of the gameboard
    currentGame: ['', '', '', '', '', '', '', '', ''],
    changePlayer: function () {
      if (gameboard.playerTurn === player1) {
        gameboard.playerTurn = player2;
      } else gameboard.playerTurn = player1;
    },
    checkIfCellIsEmpty: function (cell) {
      if (cell.textContent === '') {
        return true;
      } else return false;
    },
    //takes 3 args, which represent different positions of currentGame Array. If they are the same symbol, it returns true, signifying somebody has won the game.
    checkForWinnerInnerFunction: function (a, b, c) {
      if (
        gameboard.currentGame[a] == this.playerTurn.getSymbol() &&
        gameboard.currentGame[b] == this.playerTurn.getSymbol() &&
        gameboard.currentGame[c] == this.playerTurn.getSymbol()
      ) {
        return true;
      }
    },
    //uses checkForWinnerInnerFunction to compare the values of the tic tac toe board and checks all the winning combinations
    checkForWinner: function () {
      switch (true) {
        case gameboard.checkForWinnerInnerFunction(0, 1, 2):
          gameboard.winner(0, 1, 2);                     
          break;
        case gameboard.checkForWinnerInnerFunction(3, 4, 5):
          gameboard.winner(3, 4, 5);
          break;
        case gameboard.checkForWinnerInnerFunction(6, 7, 8):
          gameboard.winner(6, 7, 8);
          break;
        case gameboard.checkForWinnerInnerFunction(0, 3, 6):
          gameboard.winner(0, 3, 6);
          break;
        case gameboard.checkForWinnerInnerFunction(1, 4, 7):
          gameboard.winner(1, 4, 7);
          break;
        case gameboard.checkForWinnerInnerFunction(2, 5, 8):
          gameboard.winner(2, 5, 8);
          break;
        case gameboard.checkForWinnerInnerFunction(0, 4, 8):
          gameboard.winner(0, 4, 8);
          break;
        case gameboard.checkForWinnerInnerFunction(2, 4, 6):
          gameboard.winner(2, 4, 6);
          break;
      }
    },
    //loops over the currentGame array, if every value is a number or not an empty string. it's a tie.
    checkForTie: function () {
      if (gameboard.currentGame.includes('') === false) {
        return true;
      }
    },
    //uses the addWinnerClass method from the displayController obj. to style the 3 winning cells, add a point to the winner, reset.
    winner: function (firstNum, secondNum, thirdNum) {
      //highlight the winning cells
      displayController.addWinnerClass(firstNum, secondNum, thirdNum);
      winner = true;
    },
    reset: function () {
      const introScreen = document.querySelector('.intro-screen');
      //removes values from game array, replaces with empty strings
      gameboard.currentGame = ['', '', '', '', '', '', '', '', ''];
      //using the newly cleared array, resets the display to have no values
      displayController.fillCellsFromGameArray();
      winner = '';
      //remove the WinnerClass
      cells.forEach((cell) => cell.classList.remove('winning-cell'));
      return (introScreen.style.display = 'flex');
    },
    //takes the value from the input on the opening page and creates a player using the factory funciton
    createPlayerOne: function () {
      const playerOneValues = document.querySelector('#player1Input');
      const playerOne = PlayerFactory(playerOneValues.value, 'X');
      return playerOne;
    },
    //takes the value from the input on the opening page and creates a player using the factory funciton
    createPlayerTwo: function () {
      const playerTwoValues = document.querySelector('#player2Input');
      const playerTwo = PlayerFactory(playerTwoValues.value, 'O');
      return playerTwo;
    },
  };
  //displayController object. used for dom manipulation
  const displayController = {
    turnDisplay:  document.querySelector('.textOutput'),
    //this method loops over the nodelist of cells, and for each cell, inputs the cooresponding index from the gameboard.currentgame array by linking the data-number with the array index
    //this is an important function, as it's run each time a change is made to the board.
    fillCellsFromGameArray: function () {
      cells.forEach(
        (cell) =>
          (cell.textContent = `${gameboard.currentGame[cell.dataset.number]}`),
      );
    },
    //handles a click by looping over every cell and using singleMoveEventHandler method
    singleMove: function () {
      cells.forEach((cell) =>
        cell.addEventListener(
          'click',
          displayController.singleMoveEventHandler,
        ),
      );
    },
    singleMoveEventHandler: function () {
      //check to see if the winner variable has been set to true. if it has, winner is displayed, game is stopped
      if (winner === true)  {
        displayController.declareWinner();
      }
      //checks to see if the cell is empty, if it is, it performs the following functions, if it isn't it stops the function
      else if (gameboard.checkIfCellIsEmpty(this)) {
        //put's the players symbol into the current game array.
        displayController.addSymbolToArray(this);
        //refreshes the display are with the newly added symbol
        displayController.fillCellsFromGameArray();
        //check to see if a winning move has been made
        gameboard.checkForWinner();  
        //if there is a winner, it displays the winner      
        if (winner === true)  {
          displayController.declareWinner();
          //if there isnt a winner, it continues play
        } else if (gameboard.checkForTie() === true) {
          //check for a tie
          displayController.declareTie();
        } else {
          //changes the current player
          gameboard.changePlayer();
          //update the display to show whose turn it is
          displayController.displayWhoseTurnItIs();

        }
        
      }
    },
    //takes the value of this, which is the cell that the event was called on, uses that data to put the symbol of the current player in the currentGame array
    addSymbolToArray: function (cell) {
      gameboard.currentGame[cell.dataset.number] =
        gameboard.playerTurn.getSymbol();
    },
    addWinnerClass: function (firstNum, secondNum, thirdNum) {
      cells[firstNum].classList.add('winning-cell');
      cells[secondNum].classList.add('winning-cell');
      cells[thirdNum].classList.add('winning-cell');
    },
    //takes the values from the player inputs and creates 2 players using the factory funcitons. then removes the display from the screen revealing the play area
    startGame: function () {
      //creates a variable represending the intro screen
      const introScreen = document.querySelector('.intro-screen');
      //assigns the value of the input box to create player1
      player1 = gameboard.createPlayerOne();
      //assigns the value of the input box to create player2
      player2 = gameboard.createPlayerTwo();
      //assigns player1 to be the first player to take a turn
      displayController.clearInputFields();
      gameboard.playerTurn = player1;
      //displays the current players turn, in this case, player one
      displayController.displayWhoseTurnItIs();
      //removes the intro screen to show the play area
      return (introScreen.style.display = 'none');
    },
    //empties out the input fields on the intro page
    clearInputFields: function () {
      const input1 = document.querySelector('#player1Input');
      const input2 = document.querySelector('#player2Input');
      input1.value = '';
      input2.value = '';
    },
    //updates the player display to show whose turn it is, based on the gameboard.playerTurn.
    displayWhoseTurnItIs: function () {
      displayController.turnDisplay.textContent = `${gameboard.playerTurn.getName()}: it is your turn`;
      return displayController.turnDisplay;
    },
    //stop all play, and show the winner. make them press reset, to start the game from the beginning
    declareWinner: function () {
      displayController.turnDisplay.textContent = `${gameboard.playerTurn.getName()}: you have won the game! Click restart to start a new game`
      return displayController.turnDisplay
    },
    declareTie: function () {
      displayController.turnDisplay.textContent = `It's a tie! Everybody wins!`
      return displayController.turnDisplay
    },
  };
  //factory function that builds the players and has methods for accessing their information
  function PlayerFactory(name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
  }

  displayController.fillCellsFromGameArray();
  displayController.singleMove();
  const resetBtn = document.querySelector('.resetBtn');
  resetBtn.addEventListener('click', gameboard.reset);
  submitButton.addEventListener('click', displayController.startGame);
})();

//when the submit buton is clicked, it logs the names into the two players, and assigns them their symbols.
