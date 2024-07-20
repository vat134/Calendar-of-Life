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

    setInterval(() => {
        markCurrentDay(currentDay);
    }, 2500);

    markCurrentDay(currentDay);
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

function createSquares() {

    const registrationDateStr = localStorage.getItem('registrationDate');

    if (registrationDateStr) {
    const registrationDate = new Date(registrationDateStr);

    const currentDate = new Date();

    const differenceInMilliseconds = currentDate - registrationDate;

    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const millisecondsInAnHour = 60 * 60 * 1000;
    const millisecondsInAMinute = 60 * 1000;
    const millisecondsInASecond = 1000;

    const days = Math.floor(differenceInMilliseconds / millisecondsInADay);
    const hours = Math.floor((differenceInMilliseconds % millisecondsInADay) / millisecondsInAnHour);
    const minutes = Math.floor((differenceInMilliseconds % millisecondsInAnHour) / millisecondsInAMinute);
    const seconds = Math.floor((differenceInMilliseconds % millisecondsInAMinute) / millisecondsInASecond);

    currentDay = days; 

        console.log(`Разница: ${days}`);
    } else {
        console.log('Дата регистрации не найдена в localStorage');
    }

    for (let i = 0; i < currentDay; i++) {
        const container = document.getElementById('squaresContainer');
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('data-id', i);

        const innerSquare = document.createElement('div');
        innerSquare.classList.add('square-inner');
        innerSquare.style.backgroundColor = 'darkgray'; 
        innerSquare.style.boxShadow = '0 0 10px darkgray';
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

function handleInputChange(index, value, squareElement) {
    localStorage.setItem(`square-${index}`, value);
    updateSquareColor(squareElement, value);
}

function updateSquareColor(squareElement, value) {
    if (value.trim() === '-') {
        squareElement.classList.remove('done');
        squareElement.classList.remove('missed');
        squareElement.style.backgroundColor = '#8a8a8a';
        squareElement.style.boxShadow = '0 0 10px #8a8a8a';
    } else if (value.trim() !== '') {
        squareElement.classList.add('done');
        squareElement.classList.remove('missed');
        squareElement.style.animation = 'neonGreenToBlack 3s infinite';
    } else {
        squareElement.classList.remove('done');
        squareElement.classList.add('missed');
        squareElement.style.backgroundColor = '#8a8a8a';
        squareElement.style.boxShadow = '0 0 10px #8a8a8a';
    }
}

function markCurrentDay(firstVisitDate) {
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

    const currentSquare = document.querySelector(`[data-id='${currentDay}'] .square-inner`);
    if (currentSquare) {
        currentSquare.classList.add('active');
        currentSquare.querySelector('input').placeholder = 'Сегодня';
        currentSquare.querySelector('input').style.pointerEvents = 'auto';
        currentSquare.style.backgroundColor = '#8a8a8a'; 
        currentSquare.style.boxShadow = '0 0 10px #8a8a8a'; 
        currentSquare.classList.remove('missed');

        setTimeout(() => {
            const inputValue = currentSquare.querySelector('input').value.trim();
            if (inputValue === '' && currentSquare.classList.contains('active')) {
                currentSquare.classList.add('missed');
                currentSquare.style.backgroundColor = 'red';
                currentSquare.style.boxShadow = 'none';
            }
        }, 5000);
    }

    currentDay++;
    squareCount++; 

    if (squareCount % 10 === 0) { 
    
    }
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

function clearProgress() {
    localStorage.clear();
    localStorage.removeItem('firstVisitDate');
    location.reload();
}


document.addEventListener('DOMContentLoaded', () => {
    
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            
            localStorage.removeItem('registrationDate');
            localStorage.removeItem('userData');

            window.location.href = 'login.html';
        });
    }
});
