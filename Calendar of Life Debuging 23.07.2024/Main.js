document.addEventListener('DOMContentLoaded', () => {
    createSquares();
    document.getElementById('squaresContainer').addEventListener('scroll', handleScroll);

    const registrationDateStr = localStorage.getItem('registrationDate');
    if (registrationDateStr) {
        console.log(`Found registration date: ${registrationDateStr}`);
        const registrationDate = new Date(registrationDateStr);
        const currentDayIndex = getDayIndex(registrationDate);
        currentDay = currentDayIndex;

        console.log(`Current day index: ${currentDay}`);
    } else {
        console.warn('Registration date not found.');
    }

    const savedSquareCount = localStorage.getItem('squareCount');
    if (savedSquareCount) {
        squareCount = parseInt(savedSquareCount, 10);
        console.log(`Loaded squareCount: ${squareCount}`);
    }

    setInterval(() => {
        markCurrentDay();
        squareCount++;
    }, 5000);

    markCurrentDay();
    console.log(`Зелёных квадратов: ${greenSquareCount}`);
    console.log(`Красных квадратов: ${redSquareCount}`);
    console.log(`Серых квадратов: ${graySquareCount}`);
});

function getDayIndex(registrationDate) {
    const startDate = new Date(registrationDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}


let totalSquares = 29200;
const buffer = 100; 
let renderedSquares = [];
let squareCount = 0; 

let greenSquareCount = 0;
let redSquareCount = 0;
let graySquareCount = 0;

function createSquares() {
    const registrationDateStr = localStorage.getItem('registrationDate');
    if (registrationDateStr) {
        const registrationDate = new Date(registrationDateStr);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate - registrationDate;
        const millisecondsInADay = 24 * 60 * 60 * 1000;
        const currentDayIndex = getDayIndex(registrationDate);
        const savedSquareCount = localStorage.getItem('squareCount');
        if (savedSquareCount) {
            squareCount = parseInt(savedSquareCount, 10);
        }
        currentDay = currentDayIndex;

        console.log(`Разница: ${currentDay}`);
        console.log(`Число квадратов: ${squareCount}`);
    } else {
        console.log('Дата регистрации не найдена в localStorage');
    }

    for (let i = 0; i < currentDay + squareCount; i++) {
        const container = document.getElementById('squaresContainer');
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

        if (i < currentDay) {
            updateSquareColor(innerSquare, input.value, true);
        } else {
            updateSquareColor(innerSquare, input.value, false);
        }

        container.appendChild(square);
        renderedSquares.push(i);

        input.addEventListener('input', () => handleInputChange(i, input.value, innerSquare));
    }

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
            innerSquare.style.backgroundColor = '#8a8a8a';
            innerSquare.style.boxShadow = '0 0 10px #8a8a8a';
            square.appendChild(innerSquare);

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '';
            input.value = localStorage.getItem(`square-${i}`) || '';
            innerSquare.appendChild(input);

            container.appendChild(square);
            renderedSquares.push(i);

            input.addEventListener('input', () => handleInputChange(i, input.value, innerSquare));
        }
    }
}

function updateSquareColor(squareElement, value, isGray) {
    if (isGray) {
        squareElement.style.backgroundColor = '#1f1f1f';
        squareElement.style.boxShadow = '0 0 10px #1f1f1f';
    } else {
        if (value.trim() === '-') {
            squareElement.style.backgroundColor = '#8a8a8a';
            squareElement.style.boxShadow = '0 0 10px #8a8a8a';
            graySquareCount++;
        } else if (value.trim() !== '') {
            squareElement.style.backgroundColor = 'green';
            squareElement.style.boxShadow = '0 0 10px green';
            greenSquareCount++;
        } else {
            squareElement.style.backgroundColor = 'red';
            squareElement.style.boxShadow = 'none';
            redSquareCount++;
        }
    }
}

function handleInputChange(index, value, squareElement) {
    localStorage.setItem(`square-${index}`, value);
    updateSquareColor(squareElement, value);
}

function markCurrentDay() {
    const previousActiveSquare = document.querySelector('.square-inner.active');
    if (previousActiveSquare) {
        const inputValue = previousActiveSquare.querySelector('input').value.trim();
        if (inputValue === '') {
            previousActiveSquare.classList.add('missed');
            previousActiveSquare.style.backgroundColor = 'red';
            previousActiveSquare.style.boxShadow = 'none';
        }
        previousActiveSquare.classList.remove('active');
        previousActiveSquare.querySelector('input').placeholder = '';
        previousActiveSquare.querySelector('input').style.pointerEvents = 'none';
    }

    const currentSquareId = currentDay + squareCount;
    const currentSquare = document.querySelector(`[data-id='${currentSquareId}'] .square-inner`);
    if (currentSquare) {
        currentSquare.classList.add('active');
        currentSquare.querySelector('input').placeholder = 'Сегодня';
        currentSquare.querySelector('input').style.pointerEvents = 'auto';
        currentSquare.style.backgroundColor = '#8a8a8a'; 
        currentSquare.style.boxShadow = '0 0 10px #8a8a8a'; 
        currentSquare.classList.remove('missed');
    }

    localStorage.setItem('squareCount', squareCount); 
}

function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
}

function getDayIndex(firstVisitDate) {
    const startDate = new Date(firstVisitDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays - 1;
}

function scaleSquares() {
    const scaleValue = document.getElementById('scaleRange').value;
    const newSize = 150 * scaleValue;
    const newGap = 10 * scaleValue;

    document.documentElement.style.setProperty('--square-size', `${newSize}px`);
    document.documentElement.style.setProperty('--square-gap', `${newGap}px`);

    handleScroll();
}

function info() {
    document.getElementById('redText').value = 'Красный - ' + redSquareCount;
    document.getElementById('greenText').value = 'Зелёный - ' + greenSquareCount;
    document.getElementById('grayText').value = 'Серый - ' + graySquareCount;
}

function DeleteAccaount() {
    localStorage.removeItem('registrationDate');
    localStorage.removeItem('userData');
    localStorage.removeItem('firstVisitDate');
    localStorage.clear();
    window.location.href = 'login.html';
}