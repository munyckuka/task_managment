const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');

document.getElementById('switchToRegister').addEventListener('click', () => {
    loginPage.style.display = 'none';
    registerPage.style.display = 'block';
});

document.getElementById('switchToLogin').addEventListener('click', () => {
    registerPage.style.display = 'none';
    loginPage.style.display = 'block';
});
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Обработчик формы логина
    loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
    const response = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
},
    body: JSON.stringify({ email, password }),
});

    if (response.ok) {
    const data = await response.json();
    alert('Login successful!'); // Обновите с редиректом или другой логикой
        window.location.href = '/dashboard';

        console.log(data);
} else {
    const error = await response.json();
    alert(`Login failed: ${error.message}`);
}
} catch (err) {
    console.error(err);
    alert('An error occurred. Please try again later.');
}
});

    // Обработчик формы регистрации
    registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
}

    try {
    const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
},
    body: JSON.stringify({ name, email, password }),
});

    if (response.ok) {
    const data = await response.json();
    alert('Registration successful!'); // Обновите с редиректом или другой логикой
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    console.log(data);
} else {
    const error = await response.json();
    alert(`Registration failed: ${error.message}`);
}
} catch (err) {
    console.error(err);
    alert('An error occurred. Please try again later.');
}
});
