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
    
        for (let rows = 0; rows < 6; rows++) { //All rows
            for (let i = 0; i < 5; i++) { //CURRENT ROW / WORD
                const input = document.createElement('input');
                setUpInputElements(i, rows, input);
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

    function setUpInputElements(i, rows, input){
        input.type = 'text';
        input.setAttribute('maxlength', '1');
        const inputName = rows + "" + i;
        input.id = inputName;

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


    document.addEventListener('DOMContentLoaded', function() {
        loadGrid();
    });


    return {
        startGame,
        submitGuess,
        loadGrid
    };
  })();
