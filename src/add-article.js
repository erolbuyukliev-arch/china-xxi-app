import { createClient } from '@supabase/supabase-js';

// Твоите ключове за Supabase
const supabaseUrl = 'https://uiqctrgucsuwdonjdvdr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWN0cmd1Y3N1d2RvbmpkdmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTI4NTAsImV4cCI6MjA4NzgyODg1MH0.RgWCf1tXQonj0F-1MBoo-3CL82xDKK74Uy2aDrxe5WQ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('add-article-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const titleValue = document.getElementById('title').value;
    const contentValue = document.getElementById('content').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    let uploadedFileUrl = null;

    submitBtn.textContent = 'Обработка...';
    submitBtn.disabled = true;

    // 1. Ако има избран файл, първо качваме него в Storage
    if (file) {
      submitBtn.textContent = 'Качване на файл...';
      const fileName = `${Date.now()}-${file.name}`; // Уникално име
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('analysis-files')
        .upload(fileName, file);

      if (uploadError) {
        alert('Грешка при качване на файла: ' + uploadError.message);
        submitBtn.textContent = 'Публикувай в сайта';
        submitBtn.disabled = false;
        return; // Спираме процеса, ако файлът не се качи
      }

      // Взимаме публичния линк към вече качения файл
      const { data: publicUrlData } = supabase.storage
        .from('analysis-files')
        .getPublicUrl(fileName);
        
      uploadedFileUrl = publicUrlData.publicUrl;
    }

    // 2. Записваме всичко (текст + линк към файл) в таблицата analyses
    submitBtn.textContent = 'Записване в базата...';
    const { error: dbError } = await supabase
      .from('analyses')
      .insert([
        { 
          title: titleValue, 
          content: contentValue,
          image_url: uploadedFileUrl // Тук подаваме линка или null, ако няма файл
        }
      ]);

    if (dbError) {
      alert('Грешка при запис в базата: ' + dbError.message);
      submitBtn.textContent = 'Публикувай в сайта';
      submitBtn.disabled = false;
    } else {
      alert('Анализът е публикуван успешно!');
      window.location.href = 'index.html';
    }
  });
} 