import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewsCreatePage.module.css';

interface Building {
  id: string;
  address: string;
}

const NewsCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [formData, setFormData] = useState({
    category: 'normal',
    title: '',
    content: '',
    isPinned: false,
    isPublished: true,
    isForAllBuildings: true,
    selectedBuildings: [] as string[],
  });

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/buildings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error('Ошибка загрузки адресов:', error);
    }
  };

  const handleBuildingToggle = (buildingId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedBuildings: prev.selectedBuildings.includes(buildingId)
        ? prev.selectedBuildings.filter(id => id !== buildingId)
        : [...prev.selectedBuildings, buildingId]
    }));
  };

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
          category: formData.category,
          title: formData.title,
          content: formData.content,
          isPinned: formData.isPinned,
          isPublished: formData.isPublished,
          publishedAt: formData.isPublished ? new Date().toISOString() : null,
          buildingIds: formData.isForAllBuildings ? [] : formData.selectedBuildings,
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
            Адреса получателей <span className={styles.required}>*</span>
          </label>
          
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.isForAllBuildings}
              onChange={(e) => setFormData({ 
                ...formData, 
                isForAllBuildings: e.target.checked,
                selectedBuildings: e.target.checked ? [] : formData.selectedBuildings
              })}
            />
            <span><strong>Все адреса</strong> (новость увидят все жильцы)</span>
          </label>

          {!formData.isForAllBuildings && (
            <div className={styles.buildingsCheckboxes}>
              {buildings.map(building => (
                <label key={building.id} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.selectedBuildings.includes(building.id)}
                    onChange={() => handleBuildingToggle(building.id)}
                  />
                  <span>{building.address}</span>
                </label>
              ))}
            </div>
          )}
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
