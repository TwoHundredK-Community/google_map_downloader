import { Drawer, List, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';

const { Text } = Typography;

interface SearchHistoryItem {
  id: number;
  query: string;
  location: string;
  timestamp: string;
  resultCount: number;
}

interface SearchHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchHistory: SearchHistoryItem[];
  onHistoryItemClick: (query: string, location: string) => void;
}

export const SearchHistoryDrawer = ({
  isOpen,
  onClose,
  searchHistory,
  onHistoryItemClick,
}: SearchHistoryDrawerProps) => {
  return (
    <Drawer
      title="Search History"
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={400}
    >
      <List
        dataSource={searchHistory}
        renderItem={(item) => (
          <List.Item
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onHistoryItemClick(item.query, item.location)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onHistoryItemClick(item.query, item.location);
              }
            }}
          >
            <div className="w-full">
              <div className="flex justify-between items-start">
                <div>
                  <Text strong>{item.query}</Text>
                  <br />
                  <Text type="secondary">{item.location}</Text>
                </div>
                <div className="text-right">
                  <Text type="secondary">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </Text>
                  <br />
                  <Text type="secondary">{item.resultCount} results</Text>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Drawer>
  );
}; 