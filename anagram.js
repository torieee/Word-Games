var anagram = (() => {
    var scrambledWord;
    let foundWords = [];
    let score = 0;


    async function newGame(event){
        process.stopTimer();
        document.getElementById('timer-display').innerHTML = 'Timer Off';
        generateScrambledWord(event);
    }

    async function generateScrambledWord(event){
        event.preventDefault();
        var word = await process.generateWord(8);
        scrambleAndDisplay(word);
        newGameCleanUp();
        return scrambledWord;
    }

    async function guessWord(event){
        event.preventDefault();
        var word = document.getElementById('user-guess').value;
        document.getElementById('user-guess').value = '';

        await processWord(word);
        displayFoundWords();
        displayScore(word);
    }

    async function startTimer(event, seconds){
        event.preventDefault();
        process.startTimer(event, seconds);
        generateScrambledWord(event);
    }

    async function processWord(word){
        var successMessage = document.getElementById('success-message');
        var wordIsValid = checkWordValidity(word.toLowerCase());
        var wordExists = await process.dictionaryCheck(word);
        
        if(!wordIsValid || !wordExists){
            successMessage.innerHTML = "Invalid word."
            return false;
        }
        if(foundWords.includes(word))
        {
            successMessage.innerHTML = "Already found."
            return false;
        }
       
        foundWords.push(word);
        successMessage.innerHTML = "Found " + word + "!";
    }

    function scrambleAndDisplay(word){
        scrambledWord = scrambleWord(word);
        displayWord(scrambledWord);
        document.getElementById("user-guess-id").style.display = "block";
    }

    function reScramble(event){
        event.preventDefault();
        scrambleAndDisplay(scrambledWord);
    }

    function displayScore(word){
        var score = calculateScore(word);
        var scoreElement = document.getElementById('score');
        scoreElement.innerHTML = "Score: " + score;
    }

    function checkWordValidity(word){
        if(word.length < 4){
            return false;
        }
        const wordLetters = word.split('');
        var scrambledWordLetters = scrambledWord.split('');
        
        for (let letter of wordLetters) {
            let indexOfLetter = scrambledWordLetters.indexOf(letter)
            if (indexOfLetter === -1) {
                return false; 
            }
            scrambledWordLetters.splice(indexOfLetter, 1);
        }
        return true;
    }
    
    function displayFoundWords() {
        const foundWordsContainer = document.getElementById('found-words');
        foundWordsContainer.innerHTML = '';
        foundWords.sort();
        
        var count = 1;
        var list = createListElement(count);
        
        for (var i = 0; i < foundWords.length; i++) {
            if (i % 11 === 0 && i !== 0) {
                count++;
                list = createListElement(count);
            }

            const li = document.createElement('li');
            li.textContent = foundWords[i];
            list.appendChild(li);
        }
    
        function createListElement(count) {
            var listId = 'list-' + count;
            var existingList = document.getElementById(listId);
            
            if (!existingList) {
                existingList = document.createElement('ul');
                existingList.id = listId;
                foundWordsContainer.appendChild(existingList);
                if (count > 1) {
                    foundWordsContainer.appendChild(document.createElement('br'));
                }
            }
            return existingList;
        }
    }

    function calculateScore(word){
        switch(word.length){
            case 4: score += 2;
                break;
            case 5: score += 4;
                break;
            case 6: score += 6;
                break;
            case 7: score += 8;
                break;
            case 8: score += 10;
                break;
            default: score += 0;
                break;
        }

        return score;
    }

    function displayWord(word){
        var generatedWord = document.getElementById('generated-word');
        generatedWord.innerHTML = word;

        const container = document.getElementById('scrambled-word-container');
        container.innerHTML = '';
        
        const letters = scrambledWord.split('');
        const radius = 100; 
        const centerX = 150; 
        const centerY = 150; 
        const totalLetters = letters.length;
        const angleIncrement = (2 * Math.PI) / totalLetters;
        
        letters.forEach((letter, index) => {
            const angle = index * angleIncrement;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const letterBox = document.createElement('div');
            letterBox.textContent = letter;
            letterBox.classList.add('letter-box');
            letterBox.style.left = x + 'px';
            letterBox.style.top = y + 'px';
            container.appendChild(letterBox);
        });

       container.style.display = "block";
       document.getElementById("shuffle").style.display = "block";  
    }

    function scrambleWord(word){
        const charsInWord = word.split('');
        for (let i = charsInWord.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [charsInWord[i], charsInWord[j]] = [charsInWord[j], charsInWord[i]];
        }
        const scrambledWord = charsInWord.join('');
        const input = document.getElementById('user-guess');
        input.focus();
        return scrambledWord;
    }

    function newGameCleanUp(){
        foundWords = [];
        score = 0;
        displayFoundWords();
        displayScore("", true);
        var successMessage = document.getElementById('success-message');
        successMessage.innerHTML = "";
    }

    window.onload = function(event) {
        generateScrambledWord(event);
    };

    return {
        generateScrambledWord,
        guessWord,
        reScramble,
        startTimer,
        newGame
    };
  })();
