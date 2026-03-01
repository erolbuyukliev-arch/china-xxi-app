import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from './services/supabaseClient.js';

const form = document.getElementById('add-article-form');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Публикуване...';

    // Записваме данните в таблица 'analyses'
    const { data, error } = await supabase
        .from('analyses')
        .insert([{ title, content }]);

    if (error) {
        alert('Грешка при запис: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Публикувай в сайта';
    } else {
        alert('Анализът е публикуван успешно!');
        window.location.href = '/index.html'; // Връщаме се в началото
    }
});  