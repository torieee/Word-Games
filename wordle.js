var wordle = (() => {

    let correctLettersWrongPlace = [];
    let correctLettersRightPlace = [];

    async function generateWordle(event){
        event.preventDefault();
        const wordle = await process.generateWord(5);
        console.log("Wordle works! ", wordle);
    }




    return {
        generateWordle,
    };
  })();
