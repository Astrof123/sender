import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "./actions"; // Замените на ваш action
import { useToast } from "./toast"; // Замените на ваш toast
import NotificationItem from "./NotificationItem"; // Замените на ваш компонент
import s from "./NotificationList.module.scss";
import { clsx } from "clsx";

interface NotificationListProps {
  searchQuery: string | null;
}

const NotificationList: React.FC<NotificationListProps> = ({
  searchQuery,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0); // Состояние для хранения позиции скролла
  const [loadingMore, setLoadingMore] = useState(false); // Состояние для предотвращения одновременных запросов
  const observer = useRef<IntersectionObserver | null>(null);
  const { cursor, hasMore, notifications, loading, error } = useSelector(
    (state: any) => state.notification // Замените any на правильный тип состояния
  );
  const dispatch = useDispatch();
  const notify = useToast();
  const [isFirstLoading, setIsFirstLoading] = useState(true); //Отслеживание первоначальной загрузки

  useEffect(() => {
    //Сохраняем позицию скролла перед перерендером
    const handleBeforeUnload = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Восстанавливаем позицию скролла после первой загрузки
    if (!isFirstLoading && notifications && notifications.length > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [notifications, scrollPosition, isFirstLoading]);

  useEffect(() => {
    dispatch(fetchNotifications({ cursor: null, query: searchQuery }));
    setIsFirstLoading(false);
  }, [dispatch, searchQuery]);

  const lastItemElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loadingMore) return; // Предотвращаем запуск нового запроса, если предыдущий еще в процессе
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          dispatch(fetchNotifications({ cursor: cursor, query: searchQuery }))
            .then(() => setLoadingMore(false))
                        .catch((err) => {
              setLoadingMore(false);
              notify(err, "error");
            });
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loadingMore, hasMore, cursor, searchQuery, dispatch, notify]
  );

  return (
    <div className={clsx(s["notifications-wrapper"])}>
      <div className={clsx(s.notifications)}>
        {loading && isFirstLoading ? (
          <p className={clsx("loading-text")}>Загрузка уведомлений...</p>
        ) : error ? (
          <p className={clsx("error-text")}>{error}</p>
        ) : notifications.length === 0 ? (
          <p className={clsx("empty-list-text")}>Уведомлений пока не добавлено.</p>
        ) : (
          <table>
            <thead>
              <tr>
                {/* Ваши заголовки таблицы */}
                <th>ID</th>
                <th>Дата</th>
                <th>Сообщение</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item, index) => {
                const isLastItem = index === notifications.length - 1;

                return (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    ref={isLastItem ? lastItemElementRef : null}
                  />
                );
              })}
              {loadingMore && (
                <tr>
                  <td colSpan={3}>Загрузка...</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default NotificationList;