document.addEventListener('DOMContentLoaded', () => {
    clearStorage(); 
    createSquares();
    document.getElementById('numberInput').value = 29200;
    document.getElementById('squaresContainer').addEventListener('scroll', handleScroll);

    let currentDay = 0;
    setInterval(() => {
        markCurrentDay(currentDay);
        currentDay++;
    }, 17280000); 
});

let totalSquares = 29200;
const buffer = 100; 
let renderedSquares = [];

function createSquares() {
    totalSquares = parseInt(document.getElementById('numberInput').value, 10);
    handleScroll(); 
}

function handleScroll() {
    const container = document.getElementById('squaresContainer');
    const scrollTop = container.scrollTop;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const itemSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--square-size'), 10) + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--square-gap'), 10);

    const itemsPerRow = Math.floor(containerWidth / itemSize);
    const totalRows = Math.ceil(totalSquares / itemsPerRow);

    const startRow = Math.max(0, Math.floor(scrollTop / itemSize) - buffer);
    const endRow = Math.min(totalRows, Math.ceil((scrollTop + containerHeight) / itemSize) + buffer);

    const startIdx = startRow * itemsPerRow;
    const endIdx = Math.min(totalSquares, endRow * itemsPerRow);

    renderSquares(startIdx, endIdx);
}

function renderSquares(startIdx, endIdx) {
    const container = document.getElementById('squaresContainer');

    renderedSquares.forEach(idx => {
        if (idx < startIdx || idx > endIdx) {
            const square = container.querySelector(`[data-id='${idx}']`);
            if (square) square.remove();
        }
    });

    renderedSquares = renderedSquares.filter(idx => idx >= startIdx && idx <= endIdx);

    for (let i = startIdx; i < endIdx; i++) {
        if (!renderedSquares.includes(i)) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('data-id', i);

            const innerSquare = document.createElement('div');
            innerSquare.classList.add('square-inner');
            square.appendChild(innerSquare);

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '';
            input.value = localStorage.getItem(`square-${i}`) || '';
            innerSquare.appendChild(input);

            container.appendChild(square);
            renderedSquares.push(i);

            updateSquareColor(innerSquare, input.value);

            input.addEventListener('input', () => handleInputChange(i, input.value, innerSquare));
        }
    }
}

function handleInputChange(index, value, squareElement) {
    localStorage.setItem(`square-${index}`, value);
    updateSquareColor(squareElement, value);
}

function updateSquareColor(squareElement, value) {
    if (value.trim() === '-') {
        squareElement.classList.remove('done');
        squareElement.classList.remove('missed');
        squareElement.style.backgroundColor = 'grey'; // -
    } else if (value.trim() !== '') {
        squareElement.classList.add('done');
        squareElement.classList.remove('missed');
        squareElement.style.backgroundColor = 'green'; // dfdfdf
    } else {
        squareElement.classList.remove('done');
        squareElement.classList.add('missed');
        squareElement.style.backgroundColor = 'grey'; // none
    } 

    
}

function markCurrentDay(dayIndex) {
    const previousActiveSquare = document.querySelector('.square-inner.active');
    if (previousActiveSquare) {
        const inputValue = previousActiveSquare.querySelector('input').value.trim();
        if (inputValue === '') {
            previousActiveSquare.classList.add('missed');
        }
        previousActiveSquare.classList.remove('active');
        previousActiveSquare.querySelector('input').placeholder = 'Что сделал?';
        previousActiveSquare.querySelector('input').style.pointerEvents = 'none';
    }

    const currentSquare = document.querySelector(`[data-id='${dayIndex}'] .square-inner`);
    if (currentSquare) {
        currentSquare.classList.add('active');
        currentSquare.querySelector('input').placeholder = 'Сегодня';
        currentSquare.querySelector('input').style.pointerEvents = 'auto'; 
    }
}

function scaleSquares() {
    const scaleValue = document.getElementById('scaleRange').value;
    const newSize = 150 * scaleValue;
    const newGap = 10 * scaleValue;

    document.documentElement.style.setProperty('--square-size', `${newSize}px`);
    document.documentElement.style.setProperty('--square-gap', `${newGap}px`);

    handleScroll();
}

function clearStorage() {
    localStorage.clear(); 
}
