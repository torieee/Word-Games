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
            updateTileStyles();
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
            let moved = false;

            switch(event.key) {
                case 'ArrowUp':
                    for (let col = 0; col < 4; col++) {
                        shiftColumnUp(col);
                        moved = true;
                    }
                    break;
                case 'ArrowDown':
                    for (let col = 0; col < 4; col++) {
                        shiftColumnDown(col);
                        moved = true;
                    }
                    break;
                case 'ArrowLeft':
                    for (let row = 0; row < 4; row++) {
                        shiftRowLeft(row);
                        moved = true;
                    }
                    break;
                case 'ArrowRight':
                    for (let row = 0; row < 4; row++) {
                        shiftRowRight(row);
                        moved = true;
                    }
                    break;
            }

            if (moved) {
                    placeRandomTile();
                    updateTileStyles();
            }
        }

        function updateTileStyles() {
            const cells = document.querySelectorAll('#grid-16 input');

            cells.forEach(cell => {
                const value = parseInt(cell.value);

                if (!value) {
                    cell.style.backgroundColor = "#cdc1b4"; // default empty tile color
                    return;
                }

                switch (value) {
                    case 2:
                        cell.style.backgroundColor = "#eee4da";
                        break;
                    case 4:
                        cell.style.backgroundColor = "#efcc96";
                        break;
                    case 8:
                        cell.style.backgroundColor = "#f2b179";
                        break;
                    case 16:
                        cell.style.backgroundColor = "#f59563";
                        break;
                    case 32:
                        cell.style.backgroundColor = "#f67c5f";
                        break;
                    case 64:
                        cell.style.backgroundColor = "#f65e3b";
                        break;
                    case 128:
                        cell.style.backgroundColor = "#f6de5e";
                        break;
                    case 256:
                        cell.style.backgroundColor = "#edcc61";
                        break;
                    case 512:
                        cell.style.backgroundColor = "#edc850";
                        break;
                    case 1024:
                        cell.style.backgroundColor = "#edc53f";
                        break;
                    case 2048:
                        cell.style.backgroundColor = "#edc22e";
                        break;
                    case 4096:
                        cell.style.backgroundColor = "#528436"
                    default:
                        cell.style.backgroundColor = "#3c3a32";
                        break;
                }
            });
        }




        document.addEventListener('keydown', handleMovement);

        generateGrid();
        populateInitialTiles();

    });

    return {

    };
})();
