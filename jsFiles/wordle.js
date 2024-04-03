var wordle = (() => {

    let correctLettersWrongPlace = [];
    let correctLettersRightPlace = [];
    let wordle;

    async function startGame(event){
        event.preventDefault();
        wordle = await generateWordle();
        console.log(wordle);
    }

    async function generateWordle(){
        const wordle = await process.generateWord(5);
        return wordle;
    }




    return {
        startGame,
    };
  })();
