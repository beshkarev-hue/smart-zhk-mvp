import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BuildingsPage.module.css';

interface Building {
  id: string;
  address: string;
  yearBuilt?: number;
  floors?: number;
  entrances?: number;
  totalApartments?: number;
  wallMaterial?: string;
}

const BuildingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/buildings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error('Ошибка загрузки адресов:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Назад
        </button>
        <h1>Список адресов на обслуживании</h1>
        <button 
          onClick={() => navigate('/manager/buildings/create')} 
          className={styles.createButton}
        >
          + Добавить адрес
        </button>
      </div>

      <div className={styles.buildingsList}>
        {buildings.length === 0 ? (
          <div className={styles.empty}>
            <p>Адресов пока нет</p>
            <button onClick={() => navigate('/manager/buildings/create')} className={styles.emptyButton}>
              Добавить первый адрес
            </button>
          </div>
        ) : (
          buildings.map((building) => (
            <div key={building.id} className={styles.buildingCard}>
              <div className={styles.cardHeader}>
                <h3>{building.address}</h3>
              </div>
              
              <div className={styles.info}>
                {building.yearBuilt && <span>🏗️ Год постройки: {building.yearBuilt}</span>}
                {building.entrances && <span>🚪 Подъездов: {building.entrances}</span>}
                {building.floors && <span>📏 Этажей: {building.floors}</span>}
                {building.totalApartments && <span>🏠 Квартир: {building.totalApartments}</span>}
                {building.wallMaterial && <span>🧱 Материал: {building.wallMaterial}</span>}
              </div>

              <div className={styles.actions}>
                <button 
                  onClick={() => navigate(`/manager/buildings/edit/${building.id}`)}
                  className={styles.editButton}
                >
                  ✏️ Редактировать
                </button>
                <button 
                  onClick={() => navigate(`/manager/buildings/${building.id}`)}
                  className={styles.viewButton}
                >
                  👁️ Подробнее
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BuildingsPage;
