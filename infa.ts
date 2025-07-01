import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    Dispatch,
    SetStateAction
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clsx } from 'clsx';
import { fetchNotifications } from 'redux/notifications/thunks';
import { RootState } from 'redux/store';
import { clearNotifications } from 'redux/notifications/slice';
import { useLoast } from 'hooks'; // Замените на фактический путь к вашему хуку
import { MessageType } from 'components'; // Замените на фактический путь к вашему MessageType
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
    searchQuery: string | null; // Убедитесь, что тип соответствует вашему коду
}

const NotificationList: React.FC<NotificationListProps> = ({ searchQuery }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref для div со скроллом
    const [scrollPosition, setScrollPosition] = useState(0); // Состояние для сохранения позиции скролла
    const observer = useRef<IntersectionObserver | null>(null);

    const { cursor, hasMore, notifications, loading, error } = useSelector(
        (state: RootState) => state.notification
    );

    const dispatch = useDispatch();
    const notify = useLoast();

    useEffect(() => {
        dispatch(clearNotifications());
        dispatch(fetchNotifications({ cursor: null, query: null }));
        if (error != null) {
            notify(error, MessageType.Error, 'Понятно');
        }
    }, [dispatch, notify, error]);

    useEffect(() => {
        if (searchQuery !== null) {
            console.log("hello!!!!", searchQuery);
            // Сохраняем позицию прокрутки перед запросом
            if (scrollContainerRef.current) {
                setScrollPosition(scrollContainerRef.current.scrollTop);
            }
            dispatch(fetchNotifications({ cursor: null, query: searchQuery }));

            if (error != null) {
                notify(error, MessageType.Error, 'Понятно');
            }
        }
    }, [searchQuery, dispatch, notify, error]);

    const lastItemElementRef = useCallback(
        (node: HTMLTableRowElement | null) => {
            if (loading) {
                return;
            }

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {                    console.log("hello!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    // Сохраняем позицию прокрутки перед запросом следующих данных
                    if (scrollContainerRef.current) {
                        setScrollPosition(scrollContainerRef.current.scrollTop);
                    }
                    dispatch(fetchNotifications({ cursor: cursor, query: searchQuery }));

                    if (error != null) {
                        notify(error, MessageType.Error, 'Понятно');
                    }
                }
            });

            if (node) {
                observer.current.observe(node);

                //Восстанавливаем позицию скролла
                setTimeout(() => {
                    if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollTop = scrollPosition;
                    }
                }, 0);
            }
        },
        [loading, dispatch, cursor, searchQuery, hasMore, notify, error]
    );

    // Эффект для восстановления прокрутки после загрузки данных
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollPosition;
        }
    }, [scrollPosition, notifications]); // Зависимость от notifications
    return (
        <div className={clsx(['notifications-wrapper'])} ref={scrollContainerRef}
            style={{
                height: '500px',
                overflowY: 'scroll',
            }}>
            <div className={clsx(s.notifications)}>
                {loading ? (
                    <p className={clsx(['loading-text'])}>Загрузка уведомлений...</p>
                ) : error ? (
                    <p className={clsx(['error-text'])}>{error}</p>
                ) : notifications.length === 0 ? (
                    <p className={clsx(['empty-list-text'])}>
                        Уведомлений пока не добавлено.
                    </p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            {/* Ваши заголовки таблицы */}
                        </tr>
                        </thead>
                        <tbody>
                        {notifications.map((item, index) => {
                            const isLastItem = index === notifications.length - 1;
                            return (
                                <NotificationItem
                                    key={item.id}
                                    index={index + 1}
                                    item={item}
                                    ref={isLastItem ? lastItemElementRef : null}
                                />
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default NotificationList;