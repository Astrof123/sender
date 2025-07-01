import React, { useState, useEffect, useRef } from 'react';

const MyComponent: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [data, setData] = useState<any[]>([]); // Замените any[] на ваш тип данных
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null); // Для курсорной пагинации
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);

    // Загрузка первой порции данных при монтировании
    loadMoreData();

    return () => {
      window.removeEventListener('scroll', handleScroll); // Обязательно убирайте listener
    };
  }, []);

  // Функция загрузки данных
  const loadMoreData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // Замените это на ваш запрос к API
      const response = await fetch(`/api/data?cursor=${cursor || ''}`);
      const newData = await response.json();

      setData(prevData => [...prevData, ...newData.items]);
      setCursor(newData.nextCursor); // Обновляем курсор для следующей страницы
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Бесконечный скролл
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && window.innerHeight + document.documentElement.scrollTop + 200 > containerRef.current.offsetHeight) {
        if (!isLoading && cursor) {
          loadMoreData();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, cursor]);

  return (
    <div ref={containerRef}>
      {data.map((item, index) => (
        <div key={index}>{item.name}</div> // Замените item.name на нужные свойства
      ))}
      {isLoading && <div>Загрузка...</div>}
    </div>
  );
};

export default MyComponent;