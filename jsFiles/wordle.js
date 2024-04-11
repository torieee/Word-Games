var wordle = (() => {

    let correctLettersWrongPlace = [];
    let correctLettersRightPlace = [];
    let wordle;
    let guessCounter = 0;

    async function startGame(event){
        event.preventDefault();
        loadGrid();
        wordle = await generateWordle();
    }

    async function generateWordle(){
        var wordle = await process.generateWord(5);
        wordle = wordle.toUpperCase();
        return wordle;
    }

    async function submitGuess(event){
        event.preventDefault();
        var verification = document.getElementById('verification-message');

        let guessedWord = [];
        for (let i = 0; i < 5; i++){ //Letters in guessed word
            const elementID = guessCounter + "" + i; //Element id of the current letter
            const letter = document.getElementById(elementID).value;
            guessedWord[i] = letter;
        }

        var wordValid = await checkWordValidity(guessedWord.join(''));
        
        if(!wordValid){
            verification.innerHTML = "Not a valid word!";
            return false;
        }

        verification.innerHTML = '';
        checkGuess(guessedWord);
        const gameWon = checkWinningConditions(guessedWord.join(''));
        
        if(!gameWon){
            guessCounter++;
            checkRow(guessCounter, verification);
        } else {
            disableRows(6);
        }
    }

    function checkRow(row, verification){
        if(row < 6){
            disableRows(guessCounter);
        }
        else{
            verification.innerHTML = "Out of guesses! The Wordle was: " + wordle;
        }
    }

    async function checkWordValidity(guessedWord){
        var valid = await process.dictionaryCheck(guessedWord);
        return valid;
    }

    function checkGuess(wordArray){
        for(let i = 0; i < 5; i++){
            const elementID = guessCounter + "" + i; //Element id of the current letter
            const letter = document.getElementById(elementID);
            const letterGridLetter = document.getElementById(wordArray[i]);

            if(wordle[i] == wordArray[i]){
                correctLettersRightPlace[i] = wordArray[i];
                letter.setAttribute('style', 'text-align: center; background-color: #8fc66f; color: white');
                letterGridLetter.setAttribute('style', 'text-align: center; background-color: #8fc66f; color: white');
                continue;
            }
            if(wordle.includes(wordArray[i])){
                correctLettersWrongPlace[i] = wordArray[i]; //NEED TO CHANGE THIS to make it for only the number of times in the word
                letter.setAttribute('style', 'text-align: center; background-color: yellow; color: black');
                letterGridLetter.setAttribute('style', 'text-align: center; background-color: yellow; color: black');
                continue;
            }
            letter.setAttribute('style', 'text-align: center; background-color: grey; color: white');
            letterGridLetter.setAttribute('style', 'text-align: center; background-color: grey; color: white');
        }
    }

    function loadGrid() {
        const guessInputsContainer = document.getElementById('guess-inputs');
        for (let rows = 0; rows < 6; rows++) { //All rows
            for (let i = 0; i < 5; i++) { //CURRENT WORD
                const input = document.createElement('input');
                setUpInputElements(i, rows, input);
                guessInputsContainer.appendChild(input);
            }
        }
        disableRows(0);
    }
    

    function disableRows(currentRow){
        console.log("Enabling row: ", guessCounter + 1);
        for (let row = 0; row < 6; row++){
            if(currentRow === row){
                continue;
            }

            for(let column = 0; column < 5; column ++){
                const boxName = row + "" + column;
                const inputBox = document.getElementById(boxName);
                inputBox.setAttribute('disabled', 'true');
            }
        }
        for(let column = 0; column < 5; column ++){
            const boxName = currentRow + "" + column;
            const inputBox = document.getElementById(boxName);
            inputBox.removeAttribute('disabled');
        }
    }

    function setUpInputElements(i, rows, input){
        input.type = 'text';
        input.setAttribute('maxlength', '1');
        const inputName = rows + "" + i;
        input.id = inputName;

        input.setAttribute('style', 'text-align: center;');

        input.addEventListener('input', function() {
            focusNextInput(i, rows, this);
        });

        input.addEventListener('keydown', function(event) {
            handleKeyFunctions(event, this, rows, i);
        });
    }

    function focusNextInput(i, rows, inputBox){
        inputBox.value = inputBox.value.toUpperCase();
        const nextInputIndex = (rows * 5) + (i + 1);
        const nextInput = document.querySelectorAll('#guess-inputs input')[nextInputIndex];
        if (nextInput && inputBox.value.length === 1) {
            nextInput.focus();
        }
    }

    function handleKeyFunctions(event, inputBox, rows, i){
        if (event.key === 'Backspace' && inputBox.value.length === 0) {
            const previousInputIndex = (rows * 5) + (i - 1);
            const previousInput = document.querySelectorAll('#guess-inputs input')[previousInputIndex];
            if (previousInput) {
                previousInput.focus();
            }
        }
        if (event.key === 'Enter' && i === 4) {
            event.preventDefault();
            submitGuess(event);
        }
    }

    function checkWinningConditions(word){
        if(word === wordle){
            var verification = document.getElementById('verification-message');
            verification.innerHTML = "You got it! The word was " + word;
            return true;
        }
        return false;
    }

    document.addEventListener('DOMContentLoaded', function(event) {
        startGame(event)
    });

    return {
        startGame,
        submitGuess,
    };
  })();
