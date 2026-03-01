import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from './services/supabaseClient.js';

const userEmailDisplay = document.getElementById('user-email');
const avatarImg = document.getElementById('profile-img');
const fileInput = document.getElementById('avatar-input');
const uploadBtn = document.getElementById('upload-btn');

async function loadProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/login.html';
        return;
    }
    userEmailDisplay.textContent = session.user.email;
}

uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return alert('Моля, избери снимка първо!');

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Качване...';

    const { data: { session } } = await supabase.auth.getSession();
    const fileName = `${session.user.id}-${Math.random()}.png`;

    // Качваме в Supabase Storage (кофата 'avatars')
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

    if (error) {
        alert('Грешка: ' + error.message);
    } else {
        // Вземаме линка към снимката
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarImg.src = urlData.publicUrl;
        alert('Снимката е качена успешно!');
    }
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Качи снимка';
});

loadProfile();   