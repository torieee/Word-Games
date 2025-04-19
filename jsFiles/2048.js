var play2048 = (() => {
    document.addEventListener("DOMContentLoaded", function() {
        const grid = document.getElementById('grid-16');

        function generateGrid() {
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const input = document.createElement('input');
                    setUpInputElements(col, row, input);
                    grid.appendChild(input);
                }
            }
        }

        function setUpInputElements(i, row, input) {
            input.type = 'text';
            const inputName = row + "" + i;
            input.id = inputName;
            input.readOnly = true;
            input.setAttribute('style', 'text-align: center; width: 50px; height: 50px; font-size: 18px;');
        }

        function generateRandomInput(){
            return Math.random() < 0.75 ? 2 : 4;
        }

        function placeRandomTile() {
            let emptyCells = [];

            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const cell = document.getElementById(`${row}${col}`);
                    if (!cell.value) {
                        emptyCells.push(cell);
                    }
                }
            }

            if (emptyCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const selectedCell = emptyCells[randomIndex];
                selectedCell.value = generateRandomInput();
            }
        }

        function populateInitialTiles() {
            let emptyCells = [];

            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const cell = document.getElementById(`${row}${col}`);
                    if (!cell.value) {
                        emptyCells.push(cell);
                    }
                }
            }

            if (emptyCells.length >= 2) {
                const firstIndex = Math.floor(Math.random() * emptyCells.length);
                const firstCell = emptyCells.splice(firstIndex, 1)[0];
                const secondCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

                firstCell.value = generateRandomInput();
                secondCell.value = generateRandomInput();
            }
        }

        function shiftRowLeft(row) {
            const rowCells = Array.from({ length: 4 }, (_, col) => document.getElementById(`${row}${col}`));
            let values = rowCells.map(cell => parseInt(cell.value) || 0).filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            for (let i = 0; i < 3; i++) {
                if (values[i] === values[i + 1] && values[i] !== 0) {
                    values[i] *= 2;
                    values[i + 1] = 0;
                }
            }

            values = values.filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            values.forEach((value, index) => {
                rowCells[index].value = value === 0 ? '' : value;
            });
        }

        function shiftRowRight(row) {
            const rowCells = Array.from({ length: 4 }, (_, col) => document.getElementById(`${row}${col}`));
            let values = rowCells.map(cell => parseInt(cell.value) || 0).filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            values.reverse();
            for (let i = 0; i < 3; i++) {
                if (values[i] === values[i + 1] && values[i] !== 0) {
                    values[i] *= 2;
                    values[i + 1] = 0;
                }
            }
            values = values.filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            values.reverse();
            values.forEach((value, index) => {
                rowCells[index].value = value === 0 ? '' : value;
            });
        }

        function shiftColumnUp(col) {
            let values = [];
            for (let row = 0; row < 4; row++) {
                const cell = document.getElementById(`${row}${col}`);
                values.push(parseInt(cell.value) || 0);
            }

            values = values.filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            for (let i = 0; i < 3; i++) {
                if (values[i] === values[i + 1] && values[i] !== 0) {
                    values[i] *= 2;
                    values[i + 1] = 0;
                }
            }

            values = values.filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            values.forEach((value, row) => {
                document.getElementById(`${row}${col}`).value = value === 0 ? '' : value;
            });
        }

        function shiftColumnDown(col) {
            let values = [];
            for (let row = 0; row < 4; row++) {
                const cell = document.getElementById(`${row}${col}`);
                values.push(parseInt(cell.value) || 0);
            }

            values.reverse();
            values = values.filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            for (let i = 0; i < 3; i++) {
                if (values[i] === values[i + 1] && values[i] !== 0) {
                    values[i] *= 2;
                    values[i + 1] = 0;
                }
            }

            values = values.filter(val => val !== 0);
            while (values.length < 4) values.push(0);

            values.reverse();
            values.forEach((value, row) => {
                document.getElementById(`${row}${col}`).value = value === 0 ? '' : value;
            });
        }

        function handleMovement(event) {
            if (event.key === 'Shift') {
                return;
            }

            switch(event.key) {
                case 'ArrowUp':
                    for (let col = 0; col < 4; col++) {
                        shiftColumnUp(col);
                    }
                    break;
                case 'ArrowDown':
                    for (let col = 0; col < 4; col++) {
                        shiftColumnDown(col);
                    }
                    break;
                case 'ArrowLeft':
                    for (let row = 0; row < 4; row++) {
                        shiftRowLeft(row);
                    }
                    break;
                case 'ArrowRight':
                    for (let row = 0; row < 4; row++) {
                        shiftRowRight(row);
                    }
                    break;
            }

            placeRandomTile();
        }


        document.addEventListener('keydown', handleMovement);

        generateGrid();
        populateInitialTiles();

    });

    return {
        movement
    };
})();
