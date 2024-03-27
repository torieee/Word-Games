var process = (() => {
    let timerInterval;
    // let timeLimit = 60;

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

    async function dictionaryCheck(word){
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

    async function startTimer(event, seconds){
        event.preventDefault();
        let timeLimit = seconds;
        
        clearInterval(timerInterval);
        
        timerInterval = setInterval(function() {
            timeLimit--;
            displayTimer(timeLimit);

            if (timeLimit <= 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    function displayTimer(time) {
        var timerElement = document.getElementById('timer-container');
        timerElement.textContent = 'Time: ' + time + 's';
    }

    return {
        generateWord,
        dictionaryCheck,
        startTimer,
    };
  })();
