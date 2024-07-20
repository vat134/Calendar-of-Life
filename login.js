class User {
    constructor(username, password, data) {
      this.username = username;
      this.password = password;
      this.data = data;
    }

    getData(){
        console.log(this.data);
    }

    toJSON() {
        return {
            username: this.username,
            password: this.password,
            data: this.data
        };
    }

    static fromJSON(json) {
        return new User(json.username, json.password, json.data);
    }

}

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
    const user = userData.find(user => user.username === username);

    if (!user) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'Username not found. Please create an account.';
        isValid = false;
    } else if (username.trim() === "") {
        usernameInput.classList.add('error');
        usernameError.textContent = 'Enter your username.';
        isValid = false;
    }

    if (isValid) {
        passwordInput.value = user.password;
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
        const user = userData.find(user => user.username === username);

        if (user && user.password === password) {
            window.location.href = 'Main.html';
        } else if (user && user.password !== password) {
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password is incorrect.';
            isValid = false;
        } else {
            usernameInput.classList.add('error');
            usernameError.textContent = 'Username is incorrect.';
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password is incorrect.';
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

    if (usernameInput.value.trim() === '') {
        usernameInput.classList.add('error');
        usernameError.textContent = 'Username is required.';
        isValid = false;
    } else {
        const username = usernameInput.value;
        const userExists = userData.some(user => user.username === username);
        if (userExists) {
            usernameInput.classList.add('error');
            usernameError.textContent = 'Username already exists. Please choose another one.';
            isValid = false;
        }
    }

    if (passwordInput.value.trim() === '') {
        passwordInput.classList.add('error');
        passwordError.textContent = 'Password is required.';
        isValid = false;
    }
    
    if (dateInput.value.trim() === '') {
        dateInput.classList.add('error');
        dateError.textContent = 'Date is required.';
        isValid = false;
    }
    
    if (isValid) {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const date = dateInput.value;
        
        const user = new User(username, password, date);
        userData.push(user);
        save();

        // Save registration date in localStorage
        localStorage.setItem('registrationDate', date);

        showLoginForm();
    }
}


function save() {
    const userDataJSON = userData.map(user => user.toJSON());
    localStorage.setItem('userData', JSON.stringify(userDataJSON));
}

function load() {
    const userDataJSON = localStorage.getItem('userData');
    if (userDataJSON) {
        const parsedData = JSON.parse(userDataJSON);
        userData = parsedData.map(userJSON => User.fromJSON(userJSON));
    } else {
        userData = [];
    }
}

function clearData() {
    localStorage.removeItem('userData');
    userData = [];
}

function deleteAccount(usernameToDelete) {
    const userIndex = userData.findIndex(user => user.username === usernameToDelete);

    if (userIndex !== -1) {
        userData.splice(userIndex, 1);
        
        save();
    }
}
