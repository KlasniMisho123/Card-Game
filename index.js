const audio = new Audio("./assets/click.mp3");
const winnerS = new Audio("./assets/winner.wav")

let gameStarted = false;
let clickCount = 0;

$(document).ready(function() {
    $('.start-btn').click(function() {
        audio.play();
        
        
        if (!gameStarted) {
            shuffleGridItems();
            gameStarted = true;
        } else {
            clickCount++;
            if (clickCount === 1) {
                halfAndShuffleItems();
            } else if (clickCount === 2) {
                halfAndShuffleItems();
            } else if (clickCount === 3) {
                leaveTwoItems();
            } else if (clickCount === 4) {
                removeRandomColor();
                declareWinner();
                
                clickCount = 0;
            }
        }
    });
});

function shuffleGridItems() {
    const gridItems = $('#column-flex .square').get();
    let shuffledItems = shuffleArray([...gridItems]); // sawyisi achexva
    console.log(gridItems)

    while (!isValidShuffle(shuffledItems)) {
        shuffledItems = shuffleArray([...gridItems]);
    }

    $('#column-flex').empty();

    const half = Math.ceil(shuffledItems.length / 2);
    const firstHalf = shuffledItems.slice(0, half);
    const secondHalf = shuffledItems.slice(half);

    const column1 = $('<div class="column"></div>').appendTo('#column-flex');
    const column2 = $('<div class="column"></div>').appendTo('#column-flex');
    appendRows(column1, firstHalf);
    appendRows(column2, secondHalf);
}

function halfAndShuffleItems() {
    const colors = ['teal', 'gold', 'crimson', 'gray'];
    
    colors.forEach(color => {
        const colorItems = $(`.square.${color}`);
        const halfCount = Math.ceil(colorItems.length / 2);
        
        colorItems.slice(halfCount).remove();
    });

    shuffleGridItems();
}

function leaveTwoItems() {
    const gridItems = $('#column-flex .square').get();
    if (gridItems.length > 2) {
        shuffleGridItems();
        $('#column-flex .square').slice(2).remove();
    }
}

function removeRandomColor() {
    const remainingColors = $('.square').map(function() {
        return getColorClass($(this));
    }).get();
    
    const uniqueColors = [...new Set(remainingColors)]; // gansxvavebuli ferebi

    if (uniqueColors.length >= 2) {
        const randomColorToRemove = uniqueColors[Math.floor(Math.random() * uniqueColors.length)];
        $(`.square.${randomColorToRemove}`).remove();
    }
}

function declareWinner() {
    const remainingItems = $('#column-flex .square');
    if (remainingItems.length === 1) {
        if ($('.background-div').children('h1').length === 0) {
            $('.background-div').append('<h1>WINNER</h1>');
            winnerS.play();
        }
    } else {
        alert('No winner. Try again!');
    }
}


function appendRows(column, items) {
    for (let i = 0; i < items.length; i += 2) {
        const row = $('<div class="row"></div>').appendTo(column);
        row.append(items[i]);
        if (items[i + 1]) {
            row.append(items[i + 1]);
        }
    }
}

function shuffleArray(array) {
    // achexva, swapit
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValidShuffle(items) {
    const gridSize = 2;

    for (let i = 0; i < items.length; i++) {
        const item = $(items[i]);
        const colorClass = getColorClass(item);

        if ((i % gridSize !== gridSize - 1) && getColorClass($(items[i + 1])) === colorClass) {
            return false;
        }
        
        // zemot damtxveva
        if ((i + gridSize < items.length) && getColorClass($(items[i + gridSize])) === colorClass) {
            return false;
        }
        
        // qvemot damtxveva
        if (i >= gridSize && getColorClass($(items[i - gridSize])) === colorClass) {
            return false;
        }
    }
    return true;
}

function getColorClass(item) {
    if (item.hasClass('teal')) return 'teal';
    if (item.hasClass('gold')) return 'gold';
    if (item.hasClass('crimson')) return 'crimson';
    if (item.hasClass('gray')) return 'gray';
    return '';
}
