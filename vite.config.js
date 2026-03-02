import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        profile: 'profile.html',
        addArticle: 'add-article.html',
        article: 'article.html'
      }
    }
  }
}) 