import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from './services/supabaseClient.js';

// Елементи
const loginLink = document.getElementById('login-link');
const logoutBtn = document.getElementById('logout-btn');
const userGreeting = document.getElementById('user-greeting');

// 1. Проверка за влязъл потребител
async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        const userEmail = session.user.email;
        loginLink.classList.add('d-none');
        logoutBtn.classList.remove('d-none');
        userGreeting.textContent = `Здравей, ${userEmail}`;
    } else {
        loginLink.classList.remove('d-none');
        logoutBtn.classList.add('d-none');
        userGreeting.textContent = '';
    }
}

// 2. Изход от профила
logoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert('Грешка: ' + error.message);
    else window.location.reload();
});

// 3. Зареждане на анализите от базата данни
async function loadAnalyses() {
    const container = document.getElementById('articles-container');

    const { data: analyses, error } = await supabase
        .from('analyses')
        .select('*');

    if (error) {
        console.error('Грешка:', error);
        container.innerHTML = '<div class="alert alert-danger">Грешка при зареждане.</div>';
        return;
    }

    if (!analyses || analyses.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted"><p>Все още няма анализи.</p></div>';
        return;
    }

    container.innerHTML = ''; // Изчистваме текста "Зареждане..."

    analyses.forEach(analysis => {
        const contentText = analysis.content ? analysis.content.substring(0, 100) + '...' : '';
        const card = `
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm h-100 border-0">
                    <div class="card-body">
                        <h5 class="card-title text-danger fw-bold">${analysis.title}</h5>
                        <p class="card-text text-muted">${contentText}</p>
                        <a href="/article.html?id=${analysis.id}" class="btn btn-outline-danger btn-sm">Прочети целия анализ</a> 
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Стартираме функциите
checkUser();
loadAnalyses(); 
