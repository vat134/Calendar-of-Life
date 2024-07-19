let userData = [];

load()

function Forgot(){
    const username = document.getElementById('loginUsername').value;

    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
    usernameError.textContent = '';
    passwordError.textContent = '';

    let isValid = true;

    if (userData[0] == null) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'CREATE ACCOUNT.';
        isValid = false;
    }

    else if (usernameInput.value.trim() === "") {
        usernameInput.classList.add('error');
        usernameError.textContent = 'ENTER YOUR USERNAME.';
        isValid = false;
    }

    else if (usernameInput.value.trim() !== userData[0]) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'YOU ENTER WRONG USERNAME.';
        isValid = false;
    }

    if (isValid) {
        passwordInput.value = userData[1];
    }
}

function Login() {

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
    usernameError.textContent = '';
    passwordError.textContent = '';

    let isValid = true;

    if (usernameInput.value.trim() === '') {
        usernameInput.classList.add('error');
        usernameError.textContent = 'Username is required.';
        isValid = false;
    }

    if (passwordInput.value.trim() === '') {
        passwordInput.classList.add('error');
        passwordError.textContent = 'Password is required.';
        isValid = false;
    }

    if (isValid) {
        if (username == userData[0] && password == userData[1]){
            window.location.href = 'Main.html';
        } else if(username == userData[0] && password != userData[1]){
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password is incorrect.';
            isValid = false;
        }else if(username != userData[0] && password == userData[1]){
            usernameInput.classList.add('error');
            usernameError.textContent = 'Username is incorrect.';
            isValid = false;
        }else{
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password is incorrect.';
            isValid = false;

            usernameInput.classList.add('error');
            usernameError.textContent = 'Username is incorrect.';
            isValid = false;
        }
    }
            
}


function getRegister() {

    const usernameInput = document.getElementById('registerUsername');
    const passwordInput = document.getElementById('registerPassword');
    const dateInput = document.getElementById('registerDate');
    
    const usernameError = document.getElementById('usernameErrorRegister');
    const passwordError = document.getElementById('passwordErrorRegister');
    const dateError = document.getElementById('dateErrorRegister');

    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
    dateInput.classList.remove('error');
    usernameError.textContent = '';
    passwordError.textContent = '';
    dateError.textContent = '';

    let isValid = true;

    if (usernameInput.value.trim() == '') {
        usernameInput.classList.add('error');
        usernameError.textContent = 'Username is required.';
        isValid = false;
    }

    if (passwordInput.value.trim() == '') {
        passwordInput.classList.add('error');
        passwordError.textContent = 'Password is required.';
        isValid = false;
        }
    
    if (dateInput.value.trim() == '') {
        dateInput.classList.add('error');
        dateError.textContent = 'Date is required.';
        isValid = false;
        }
    
    if (isValid) {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const date = dateInput.value;
    
        userData.push(username);
        userData.push(password);
        userData.push(date);
        
        
        save();

        showLoginForm()
    }
}

function save(){
    localStorage.setItem('userData', JSON.stringify(userData));
}

function load() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        userData = JSON.parse(savedData);
        renderList();
    }
}

function clearData() {
    localStorage.removeItem('userData');
    userData = [];
}