import { createClient } from '@supabase/supabase-js';

// Свързване с твоята база данни
const supabaseUrl = 'https://uiqctrgucsuwdonjdvdr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWN0cmd1Y3N1d2RvbmpkdmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTI4NTAsImV4cCI6MjA4NzgyODg1MH0.RgWCf1tXQonj0F-1MBoo-3CL82xDKK74Uy2aDrxe5WQ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('add-article-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Спираме презареждането на страницата

    // Взимаме текста, който си написал
    const titleValue = document.getElementById('title').value;
    const contentValue = document.getElementById('content').value;

    // Сменяме текста на бутона, за да се вижда, че зарежда
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Публикуване...';
    submitBtn.disabled = true;

    // Изпращаме данните към таблицата 'analyses' в Supabase
    const { error } = await supabase
      .from('analyses')
      .insert([
        { title: titleValue, content: contentValue }
      ]);

    if (error) {
      alert('Грешка при публикуване: ' + error.message);
      submitBtn.textContent = 'Публикувай в сайта';
      submitBtn.disabled = false;
    } else {
      alert('Анализът е публикуван успешно!');
      window.location.href = 'index.html'; // Връща те на началната страница
    }
  });
} 