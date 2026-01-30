import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewsCreatePage.module.css';

const NewsCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'normal',
    title: '',
    content: '',
    isPinned: false,
    isPublished: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.isPublished ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        alert('Новость создана!');
        navigate('/manager/news');
      } else {
        alert('Ошибка создания новости');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка создания новости');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Назад
        </button>
        <h1>Создать новость</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            Категория <span className={styles.required}>*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={styles.select}
            required
          >
            <option value="normal">📅 Объявления</option>
            <option value="planned">⚠️ Плановые работы</option>
            <option value="urgent">🚨 Срочное (авария)</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Заголовок <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={styles.input}
            placeholder="Например: Плановое отключение воды"
            required
            maxLength={200}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Текст новости <span className={styles.required}>*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className={styles.textarea}
            placeholder="Введите полный текст новости..."
            required
            rows={10}
          />
          <div className={styles.charCount}>
            {formData.content.length} символов
          </div>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            />
            <span>📌 Закрепить новость (показывать первой)</span>
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            <span>✓ Опубликовать сразу</span>
          </label>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton}>
            Создать новость
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsCreatePage;
