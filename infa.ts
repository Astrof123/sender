import React, { useState, useEffect, useRef, useCallback } from 'react';
import MyItem, { MyItemRef } from './MyItem';

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
  const lastItemRef = useRef<HTMLDivElement | null>(null); // Ref для MyItem

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
  );

  // Обработчик для IntersectionObserver
  const lastItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {  // Тип - HTMLDivElement
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
      <div>  {/* Изменили с ul на div, т.к. MyItem уже оборачивает в div */}
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <MyItem
              item={item}
              key={item.id}
              ref={isLastItem ? lastItemElementRef : null}  // Передаем ref
            />
          );
        })}
      </div>
      {loading && <div>Loading...</div>}
      {!loading && !nextCursor && <div>No more items to load.</div>}
    </div>
  );
};

export default ItemList;


















import React, { forwardRef } from 'react';

interface MyItemProps {
  item: { id: number; name: string; price: number };
}

// Экспортируем интерфейс для типа Ref
export interface MyItemRef {
  focus: () => void;
  // Можно добавить другие методы или свойства, если нужно
}

// Передаем тип для ref в forwardRef
const MyItem = forwardRef<HTMLDivElement, MyItemProps>((props, ref) => {
  const { item } = props;

  return (
    <div ref={ref} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '5px' }}> {/* привязываем ref к корневому div */}
      {item.name} - ${item.price}
    </div>
  );
});

MyItem.displayName = 'MyItem'; // Для лучшей отладки в React DevTools

export default MyItem;