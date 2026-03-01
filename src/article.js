import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from './services/supabaseClient.js';

async function loadSingleArticle() {
    const container = document.getElementById('article-content');
    
    // Вземаме ID-то на статията от URL адреса (например: ?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        container.innerHTML = '<div class="alert alert-danger">Не е избран анализ за четене.</div>';
        return;
    }

    // Търсим конкретната статия в таблицата 'analyses'
    const { data: analysis, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', articleId)
        .single(); // Искаме само един резултат

    if (error || !analysis) {
        console.error('Грешка:', error);
        container.innerHTML = '<div class="alert alert-danger">Анализът не беше намерен.</div>';
        return;
    }

    // Показваме статията на екрана
    container.innerHTML = `
        <h1 class="fw-bold text-danger mb-4">${analysis.title}</h1>
        <hr>
        <div class="mt-4" style="white-space: pre-wrap; font-size: 1.1rem; line-height: 1.8;">
            ${analysis.content}
        </div>
    `;
}

// Зареждаме статията при отваряне
loadSingleArticle(); 