const GAME = (function () {
  //nodelist of all of the cells from html
  const cells = document.querySelectorAll('.cell');
  //initilizing the players using the factory functions
  const player1 = PlayerFactory('bill', 'x');
  const player2 = PlayerFactory('steve', 'o');
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
    //uses the addWinnerClass method from the displayController obj. to style the 3 winning cells, add a point to the winner, reset.
    winner: function (firstNum, secondNum, thirdNum) {
      //highlight the winning cells
      displayController.addWinnerClass(firstNum, secondNum, thirdNum);
      //add a point to the winners tally
      gameboard.playerTurn.increaseScore();
      console.log(gameboard.playerTurn.getScore());
    },
    reset: function () {
      //removes values from game array, replaces with empty strings
      gameboard.currentGame = ['', '', '', '', '', '', '', '', ''];
      //using the newly cleared array, resets the display to have no values
      displayController.fillCellsFromGameArray();
      //remove the WinnerClass
      cells.forEach(cell => cell.classList.remove('winning-cell')) 
    },
  };
  //displayController object. used for dom manipulation
  const displayController = {
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
      //checks to see if the cell is empty, if it is, it performs the following functions, if it isn't it stops the function
      if (gameboard.checkIfCellIsEmpty(this)) {
        //put's the players symbol into the current game array.
        displayController.addSymbolToArray(this);
        //refreshes the display are with the newly added symbol
        displayController.fillCellsFromGameArray();
        //check to see if a winning move has been made
        gameboard.checkForWinner();
        //changes the current player
        gameboard.changePlayer();
      }
    },
    //takes the value of this, which is the that the event was called on, uses that data to put the symbol of the current player in the currentGame array
    addSymbolToArray: function (cell) {
      gameboard.currentGame[cell.dataset.number] =
        gameboard.playerTurn.getSymbol();
    },
    addWinnerClass: function (firstNum, secondNum, thirdNum) {
      cells[firstNum].classList.add('winning-cell');
      cells[secondNum].classList.add('winning-cell');
      cells[thirdNum].classList.add('winning-cell');
    },
  };
  //factory function that builds the players and has methods for accessing their information
  function PlayerFactory(name, symbol) {
    let score = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;
    const increaseScore = () => score++;
    return { getName, getSymbol, getScore, increaseScore };
  }

  displayController.fillCellsFromGameArray();
  displayController.singleMove();
  const resetBtn = document.querySelector('.resetBtn');
  resetBtn.addEventListener('click', gameboard.reset);
})();
