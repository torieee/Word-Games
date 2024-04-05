var wordle = (() => {

    let correctLettersWrongPlace = [];
    let correctLettersRightPlace = [];
    let wordle;
    let guessCounter = 0;

    async function startGame(event){
        event.preventDefault();
        wordle = await generateWordle();
        console.log(wordle);
    }

    async function generateWordle(){
        const wordle = await process.generateWord(5);
        return wordle;
    }

    function submitGuess(event){
        event.preventDefault();
        //get letters in each input box based on guess counter
        //put in string array to string
        //check the letters against the original word

        let guessedWord = [];
        for (let i = 0; i < 5; i++){
            const elementID = guessCounter + "" + i;
            console.log("Element ID: ", elementID);
            const letter = document.getElementById(elementID).value;
            guessedWord[i] = letter;
        }
        console.log(guessedWord);
        guessCounter++;
    }

    function loadGrid() {
        const guessInputsContainer = document.getElementById('guess-inputs');
        const wordLength = 5;
        const numRows = 6;
    
        for (let rows = 0; rows < numRows; rows++) {
            for (let i = 0; i < wordLength; i++) { //CURRENT ROW / WORD
                const input = document.createElement('input');
                input.type = 'text';
                input.setAttribute('maxlength', '1');
                const inputName = rows + "" + i;
                input.id = inputName;
                input.addEventListener('input', function() {
                    const nextInputIndex = (rows * wordLength) + (i + 1);
                    const nextInput = document.querySelectorAll('#guess-inputs input')[nextInputIndex];
                    if (nextInput && this.value.length === 1) {
                        nextInput.focus();
                    }
                });
                input.addEventListener('keydown', function(event) {
                    if (event.key === 'Backspace' && this.value.length === 0) {
                        const previousInputIndex = (rows * wordLength) + (i - 1);
                        const previousInput = document.querySelectorAll('#guess-inputs input')[previousInputIndex];
                        if (previousInput) {
                            previousInput.focus();
                        }
                    }
                    
                    // Check if the Enter key is pressed and the input is the last column
                    if (event.key === 'Enter' && i === (wordLength - 1)) {
                        event.preventDefault(); // Prevent default form submission behavior
                        submitGuess(event); // Call the submitGuess function
                    }
                });
                guessInputsContainer.appendChild(input);
            }
        }
    
        disableRows(0);
    }
    

    function disableRows(currentRow){
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
    }


    document.addEventListener('DOMContentLoaded', function() {
        loadGrid();
    });


    return {
        startGame,
        submitGuess,
        loadGrid
    };
  })();
