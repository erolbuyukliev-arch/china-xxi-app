import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from './services/supabaseClient.js';

let isLogin = true;

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toggleFormBtn = document.getElementById('toggle-form');
const formTitle = document.querySelector('.card-header h3');

toggleFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    if (isLogin) {
        formTitle.textContent = 'Вход в системата';
        submitBtn.textContent = 'Влез';
        toggleFormBtn.textContent = 'Нямаш акаунт? Регистрирай се!';
    } else {
        formTitle.textContent = 'Регистрация';
        submitBtn.textContent = 'Регистрирай ме';
        toggleFormBtn.textContent = 'Вече имаш акаунт? Влез тук!';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Моля, изчакайте...';

    try {
        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) throw error;
            alert('Успешен вход! Добре дошъл.');
        } else {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (error) throw error;
            alert('Успешна регистрация! Сега можеш да влезеш с данните си.');
            toggleFormBtn.click();
        }
    } catch (error) {
        alert('Възникна грешка: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? 'Влез' : 'Регистрирай ме';
    }
});