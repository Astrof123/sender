const NotificationList = ({searchQuery}: NotificationListProps) => {
  const [scrollPosition, setScrollPosition] = React.useState(0); // Состояние для хранения позиции скролла

  const notificationListRef = React.useRef(null); // Референс для обертки уведомлений

  // Другие ваши хуки и переменные (observer, cursor, notifications, loading, error, dispatch, notify, lastItemElementRef) ...

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


  useEffect(() => {
    if (loading === false) { // Только после загрузки данных
      window.scrollTo(0, scrollPosition); // Восстановление позиции
    }
  }, [loading, scrollPosition]);


  const lastItemElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchNotifications({ cursor: cursor, query: searchQuery }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, dispatch, hasMore, searchQuery, cursor]
  );

  return (
    <div className={clsx('notifications-wrapper')} ref={notificationListRef}>
      <div className={clsx(s.notifications)}>
        {loading ? (
          <p className={clsx('loading-text')}>Загрузка уведомлений...</p>
        ) : error ? (
          <p className={clsx('error-text')}>{error}</p>
        ) : notifications.length === 0 ? (
          <p className={clsx('empty-list-text')}>Уведомлений пока не добавлено.</p>
        ) : (
          <table>
            <thead>
              <tr>{/* ... */}</tr>
            </thead>
            <tbody>
              {notifications.map((item, index) => {
                const isLastItem = index === notifications.length - 1;
                return (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    index={index + 1}
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