// В MyItem.tsx:
import React, { forwardRef } from 'react';

interface MyItemProps {
  item: { id: number; name: string; price: number };
}

const MyItem = forwardRef<HTMLDivElement, MyItemProps>((props, ref) => {
  const { item } = props;

  return (
    <div ref={ref}>  {/*  Оборачиваем в div и привязываем ref */}
      {item.name} - ${item.price}
    </div>
  );
});

MyItem.displayName = 'MyItem';

export default MyItem;

// В ItemList.tsx:
import MyItem from './MyItem';

<ul>
  {items.map((item, index) => {
    const isLastItem = index === items.length - 1;
    return (
      <React.Fragment key={item.id}>
        <MyItem item={item} ref={isLastItem ? lastItemElementRef : null} />
      </React.Fragment>
    );
  })}
</ul>