const Word = require("./word.js");
const inquirer = require("inquirer");

const wordBank = [
  "telescope", "binocular", "monocle",
  "bifocals", "kaleidoscope", "sniper scope",
  "gunsight", "magnifier"
];

let guessLeft;
let wordChoices;
let word;
let wordChoice;

function init() {
  wordChoices = [];
  console.log("WORD CONSTRUCTOR GAME");
  console.log("------------------------------------------");
  playGame();
}

//Start game gunction
function playGame() {
  wordChoice = "";
  //Reset number of guesses remainingm when user starts a new game.
  guessLeft = 15;
  if(wordChoices.length < wordBank.length) {
    wordChoice = getWord();
  } else {
    // WIN CONDITION
    console.log("Don't stop now. Try another!");
    continuePrompt();
  }
  if(wordChoice) {
    word = new Word(wordChoice);
    word.makeLetters();
    makeGuess();
  }
}
//Function to choose a word from the word bank array
function getWord() {
    //Randomly generate word
  let rand = Math.floor(Math.random() * wordBank.length);
  let randomWord = wordBank[rand];
  if(wordChoices.indexOf(randomWord) === -1) {
    wordChoices.push(randomWord);
    return randomWord;
  } else {
    return getWord();
  }
}

//Function prompting user to their guess letter and number of guesses left
function makeGuess() {
  let checker = [];
  inquirer.prompt([
    {
      name: "guessedLetter",
      message: word.update() +
              "\n====================================" +
              "\nGuess a letter!" +
              "\nGuesses Left: " + guessLeft +
              "\n===================================="
    }
  ])
  //We need to check all the letters in the word
  //and determing if the letter guesses matches
  .then(data => {
    word.letters.forEach(letter => {
      letter.checkLetter(data.guessedLetter);
      checker.push(letter.getCharacter());
    });
    
    if(guessLeft > 0 && checker.indexOf("_") !== -1) {
      guessLeft--;
      //If user has no more guesses left prompt gameover
      if(guessLeft === 0) {
        console.log("GAME OVER");
        continuePrompt();
      } else {
        makeGuess();
      }
      //If user guesses the word correctly prompt "guessed the word"
    } else {
      console.log("YOU GUESSED THE WORD!");
      console.log(word.update());
      //Call start game function again
      playGame();
    }
  });
}

function continuePrompt() {
  inquirer.prompt([
      {
        name: "continue",
        type: "list",
        message: "Play again?",
        choices: ["Yes", "No"]
      }
    ])
  .then(data => {
      if(data.continue === "Yes") {
        init();
      } else {
        console.log("Thanks for playing!");
      }
  });
}

init();