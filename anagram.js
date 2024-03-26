
var anagram = (() => {
    var scrambledWord;
    let foundWords = [];
    let score = 0;

    async function generateScrambledWord(event){
        event.preventDefault();
        var word = await generateWord(8);
        scrambleAndDisplay(word);
        
        newGameCleanUp();
        return scrambledWord;
    }

    async function guessWord(event){
        event.preventDefault();
        var successMessage = document.getElementById('success-message');

        var word = document.getElementById('user-guess').value;
        var wordIsValid = checkWordValidity(word.toLowerCase());
        var wordExists = await checkIfWordExists(word);
        document.getElementById('user-guess').value = '';

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
        
        displayFoundWords();
        displayScore(word);
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


    async function checkIfWordExists(word){
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if(data[0]){
                return true;
            }
        } catch (error) {
            console.error('There was a problem getting dictionary entry:', error);
            return false;
        }
    }

    function displayFoundWords(){
        const foundWordsContainer = document.getElementById('found-words');
        foundWordsContainer.innerHTML = '';
        const ul = document.createElement('ul');

        //foundWords = foundWords.sort();
        foundWords.sort().forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            ul.appendChild(li);
        });
        foundWordsContainer.appendChild(ul);
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
    
    async function generateWord(wordLength){
        try {
            const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('There was a problem getting a word:', error);
            throw error; 
        }
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


    return {
        generateScrambledWord,
        guessWord,
        reScramble,
    };
  })();
