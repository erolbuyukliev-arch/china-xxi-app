import { createClient } from '@supabase/supabase-js';

// 1. Връзка със Supabase
const supabaseUrl = 'https://uiqctrgucsuwdonjdvdr.supabase.co';
// Поставяме твоя дълъг anon ключ точно вътре в кавичките
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWN0cmd1Y3N1d2RvbmpkdmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTI4NTAsImV4cCI6MjA4NzgyODg1MH0.RgWCf1tXQonj0F-1MBoo-3CL82xDKK74Uy2aDrxe5WQ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Функция за управление на бутоните
async function updateUI() {
  // Вземаме сесията, за да проверим дали има логнат потребител
  const { data: { session } } = await supabase.auth.getSession();

  const loginLink = document.getElementById('login-link');
  const logoutBtn = document.getElementById('logout-btn');
  const userGreeting = document.getElementById('user-greeting');
  const addArticleBtn = document.getElementById('add-article-btn');

  if (session) {
    // ПОТРЕБИТЕЛЯТ Е ВЛЯЗЪЛ
    if (loginLink) loginLink.classList.add('d-none');
    if (logoutBtn) logoutBtn.classList.remove('d-none');
    if (userGreeting) userGreeting.textContent = `👤 ${session.user.email}`;
    if (addArticleBtn) addArticleBtn.classList.remove('d-none');
  } else {
    // НЯМА ВЛЯЗЪЛ ПОТРЕБИТЕЛ
    if (loginLink) loginLink.classList.remove('d-none');
    if (logoutBtn) logoutBtn.classList.add('d-none');
    if (userGreeting) userGreeting.textContent = '';
    if (addArticleBtn) addArticleBtn.classList.add('d-none');
  }
}

// Стартираме проверката при отваряне на сайта
updateUI();

// 3. Логика за бутона Изход
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Презарежда страницата
  });
} 
// 4. Логика за формата за Вход (в login.html)
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Спираме презареждането на страницата по подразбиране
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    // Опитваме се да влезем чрез Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Ако има грешка, показваме я
      errorDiv.textContent = 'Грешен имейл или парола!';
      errorDiv.classList.remove('d-none');
    } else {
      // Ако влезем успешно, пренасочваме към началната страница
      window.location.href = 'index.html';
    }
  });
} 