import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
}

interface ApiResponse {
  items: Item[];
  nextCursor: string | null;
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Функция для получения данных из API
  const fetchData = useCallback(
    async (cursor: string | null = null) => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `/api/items?limit=10${cursor ? `&cursor=${cursor}` : ''}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        setItems((prevItems) => [...prevItems, ...data.items]);
        setNextCursor(data.nextCursor);
      } catch (e: any) {
        setError(e.message);
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    },
    []
  ); // Пустой массив зависимостей - fetchData создается только один раз

  // Обработчик для IntersectionObserver
  const lastItemElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          fetchData(nextCursor);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, nextCursor, fetchData]
  );

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
          if (index === items.length - 1) {
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