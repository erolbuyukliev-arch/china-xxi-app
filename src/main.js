import { createClient } from '@supabase/supabase-js';

// 1. Връзка със Supabase
const supabaseUrl = 'https://uiqctrgucsuwdonjdvdr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWN0cmd1Y3N1d2RvbmpkdmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTI4NTAsImV4cCI6MjA4NzgyODg1MH0.RgWCf1tXQonj0F-1MBoo-3CL82xDKK74Uy2aDrxe5WQ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Функция за зареждане на анализите от базата данни
async function fetchAnalyses() {
  const container = document.getElementById('articles-container');
  if (!container) return;

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = `<p class="text-danger">Грешка при зареждане: ${error.message}</p>`;
    return;
  }

  container.innerHTML = '';
  data.forEach(article => {
    // НОВО: Проверяваме дали статията има снимка
    const imageElement = article.image_url 
      ? `<img src="${article.image_url}" class="card-img-top" alt="Снимка към анализ" style="height: 200px; object-fit: cover;">` 
      : `<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="height: 200px;"><span>Няма прикачена снимка</span></div>`;

    const card = `
      <div class="col-md-6 mb-4">
        <div class="card h-100 shadow-sm border-0">
          ${imageElement}
          <div class="card-body">
            <h5 class="card-title fw-bold text-danger">${article.title}</h5>
            <p class="card-text text-muted text-truncate">${article.content.substring(0, 150)}...</p>
            <a href="article.html?id=${article.id}" class="btn btn-outline-danger btn-sm">Прочети повече</a>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', card);
  });
}

// 3. Управление на интерфейса (Логин/Бутони)
async function updateUI() {
  const { data: { session } } = await supabase.auth.getSession();
  const loginLink = document.getElementById('login-link');
  const logoutBtn = document.getElementById('logout-btn');
  const userGreeting = document.getElementById('user-greeting');
  const addArticleBtn = document.getElementById('add-article-btn');

  if (session) {
    if (loginLink) loginLink.classList.add('d-none');
    if (logoutBtn) logoutBtn.classList.remove('d-none');
    if (userGreeting) userGreeting.textContent = `👤 ${session.user.email}`;
    if (addArticleBtn) addArticleBtn.classList.remove('d-none');
  }
}

// Изпълнение при зареждане
updateUI();
fetchAnalyses();

// Изход
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
  });
} 
// 4. Обработка на формата за вход (Login)
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Това спира презареждането и появата на въпросителния знак!

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorBox = document.getElementById('login-error');

    // Опит за влизане чрез Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Показваме грешката, ако има такава (напр. грешна парола)
      errorBox.textContent = 'Грешка: ' + error.message;
      errorBox.classList.remove('d-none');
    } else {
      // При успех пренасочваме към началната страница
      window.location.href = 'index.html';
    }
  });
}  