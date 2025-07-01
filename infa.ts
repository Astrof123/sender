import React, { useState, useEffect, useRef, useCallback } from 'react';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef(); // Для IntersectionObserver

  // Функция для получения данных из API
  const fetchData = useCallback(async (cursor = null) => {  // useCallback для мемоизации
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `/api/items?limit=10${cursor ? `&cursor=${cursor}` : ''}`; // Пример API endpoint

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setItems(prevItems => [...prevItems, ...data.items]); // Добавляем новые элементы к существующим
      setNextCursor(data.nextCursor); // Обновляем nextCursor
    } catch (e) {
      setError(e.message);
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  }, []); // Пустой массив зависимостей - fetchData создается только один раз

  // Обработчик для IntersectionObserver
  const lastItemElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect(); // Отключаем предыдущий observer

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextCursor) { // Если элемент пересекает viewport и есть nextCursor
        fetchData(nextCursor);
      }
    });

    if (node) observer.current.observe(node); // Наблюдаем за последним элементом
  }, [loading, nextCursor, fetchData]);

  // Загрузка начальных данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h1>Item List</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <ul>
        {items.map((item, index) => {
          if (index === items.length - 1) { // Последний элемент
            return (
              <li key={item.id} ref={lastItemElementRef}>
                {item.name} - ${item.price}
              </li>
            );
          } else {
            return (
              <li key={item.id}>
                {item.name} - ${item.price}
              </li>
            );
          }
        })}
      </ul>

      {loading && <div>Loading...</div>}
      {!loading && !nextCursor && <div>No more items to load.</div>}
    </div>
  );
};

export default ItemList;