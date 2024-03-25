
var anagram = (() => {
    var scrambledWord;
    let correctWords = [];

    async function generateScrambledWord(event){
        event.preventDefault();
        
        var word = await generateWord(8);
        console.log("Original word: ", word);
        scrambledWord = scrambleWord(word);
        console.log("Scrambled word: ", scrambledWord);
        
        displayWord(scrambledWord);
        document.getElementById("user-guess-id").style.display = "block";
        return scrambledWord;
    }

    async function guessWord(event){
        event.preventDefault();
        var successMessage = document.getElementById('success-message');

        var word = document.getElementById('user-guess').value;
        var wordIsValid = checkWordValidity(word.toLowerCase());
        var wordExists = await checkIfWordExists(word);

        if(!wordIsValid || !wordExists){
            successMessage.innerHTML = "Invalid word."
        }
        var addWord = determineIfWordShouldBeAdded(wordIsValid, wordExists);
        if(addWord){
            correctWords.push(word);
            successMessage.innerHTML = "Found " + word + "!";
        }
        document.getElementById('user-guess').value = '';
        console.log(correctWords);
    }

    function checkWordValidity(word){
        const wordLetters = word.split('');
        const scrambledWordLetters = scrambledWord.split('');
        
        for (let letter of wordLetters) {
            if (scrambledWordLetters.indexOf(letter) === -1) {
                return false; 
            }
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
            console.log(data);
            if(data[0])
            {
                return true;
            }
        } catch (error) {
            console.error('There was a problem getting dictionary entry:', error);
            return false;
        }
    }

    function determineIfWordShouldBeAdded(wordIsValid, wordExists){
        if(wordIsValid && wordExists){
            return true;
        }
        return false;
    }

    function displayWord(word){
        var generatedWord = document.getElementById('generated-word');
        generatedWord.innerHTML = word;
    }
    
    async function generateWord(wordLength){
        try {
            const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Random word:', data);
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
        return scrambledWord;
    }


    return {
        generateScrambledWord,
        guessWord,
    };
  })();
