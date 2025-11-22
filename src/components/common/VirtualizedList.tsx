import { memo, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  width?: number | string;
  className?: string;
}

function VirtualizedListComponent<T>({
  items,
  height,
  itemHeight,
  renderItem,
  width = '100%',
  className,
}: VirtualizedListProps<T>) {
  const Row = useMemo(
    () =>
      memo(({ index, style }: ListChildComponentProps) => (
        <div style={style} className="px-4 py-2">
          {renderItem(items[index], index)}
        </div>
      )),
    [items, renderItem]
  );

  Row.displayName = 'Row';

  return (
    <div className={className}>
      <FixedSizeList
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width={width}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}

export const VirtualizedList = memo(VirtualizedListComponent) as <T>(
  props: VirtualizedListProps<T>
) => JSX.Element;


