import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from './actions'; // Замените на ваш путь к actions
import NotificationItem from './NotificationItem'; // Замените на ваш путь к компоненту
import clsx from 'clsx';
import s from './NotificationList.module.scss'; // Замените на ваш путь к стилям
import { FixedSizeList } from 'react-window';
import IntersectionObserver from 'intersection-observer';

interface NotificationListProps {
    searchQuery: string | null;
}

const NotificationList = ({ searchQuery }: NotificationListProps) => {
    const observer = useRef<IntersectionObserver | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const { cursor, hasMore, notifications, loading, error } = useSelector(
        (state: any) => state.notification
    ); // Замените any на правильный тип state
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const listRef = React.useRef<FixedSizeList>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY || document.documentElement.scrollTop);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        dispatch(fetchNotifications({ cursor: null, query: null }));
    }, [dispatch]);

    useEffect(() => {
        if (searchQuery) {
            dispatch(fetchNotifications({ cursor: cursor, query: searchQuery }));
        }
    }, [searchQuery, cursor, dispatch]);

    const loadMore = useCallback(() => {
        if (isFetching || !hasMore) {
            return;
        }
        setIsFetching(true);
        dispatch(fetchNotifications({ cursor, query: searchQuery }))
            .then(() => setIsFetching(false));
    }, [dispatch, cursor, searchQuery, hasMore, isFetching]);


    const Row = ({ index, style }) => {
        const item = notifications[index];

        // Условие для определения последнего элемента (для загрузки новых данных)
        const isLastItem = index === notifications.length - 1;

        useEffect(() => {
            if (isLastItem && hasMore && !loading) {
                loadMore();
            }
        }, [isLastItem, hasMore, loading, loadMore]);

        return (
            <div style={style}>
                <NotificationItem
                    index={index + 1}
                    key={item.id}
                    notification={item}
                />
            </div>
        );
    };

    return (
        <div className={clsx('notifications-wrapper')}>
            <div className={clsx(s.notifications)}>
                {loading && !notifications.length ? (
                    <p className={clsx('loading-text')}>Загрузка уведомлений...</p>
                ) : error ? (
                    <p className={clsx('error-text')}>{error}</p>
                ) : notifications.length === 0 ? (
                    <p className={clsx('empty-list-text')}>Уведомлений пока не добавлено.</p>
                ) : (
                    <FixedSizeList
                        height={window.innerHeight}
                        itemCount={notifications.length}
                        itemSize={100}  // Замените на фактическую высоту элемента
                        width="100%"
                        ref={listRef}
                    >
                        {Row}
                    </FixedSizeList>
                )}
            </div>
        </div>
    );
};

export default NotificationList;