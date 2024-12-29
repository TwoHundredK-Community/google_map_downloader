import { useState } from 'react';
import { Button, Input, Table, message } from 'antd';
import { SearchOutlined, DownloadOutlined, HistoryOutlined } from '@ant-design/icons';
import api from '../services/api';
import { SearchHistoryDrawer } from "../components/SearchHistoryDrawer"

interface Business {
  id: string;
  name: string;
  email: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
}

interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Business[];
}

interface SearchHistoryItem {
  id: number;
  query: string;
  location: string;
  timestamp: string;
  resultCount: number;
}

const columns = [
  {
    title: 'Business Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Website',
    dataIndex: 'website',
    key: 'website',
    render: (text: string) => text ? (
      <a href={text.startsWith('http') ? text : `https://${text}`} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ) : null,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const pageSize = 50;
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])

  const handleSearch = async (query: string, location: string) => {
    try {
      setLoading(true)
      const response = await api.post<SearchResponse>('/scraper/searches/', {
        query,
        location,
        page: currentPage,
        page_size: pageSize
      });

      if (response.data.results) {
        setBusinesses(response.data.results);
        setTotal(response.data.count);
        message.success(`Found ${response.data.count} businesses`);

        // Add to search history
        const historyItem = {
          id: Date.now(),
          query,
          location,
          timestamp: new Date().toISOString(),
          resultCount: response.data.results.length,
        }
        setSearchHistory((prev) => [historyItem, ...prev].slice(0, 10)) // Keep last 10 searches
      }
    } catch (error: any) {
      console.error('Search error:', error);
      message.error(error.response?.data?.detail || 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(searchQuery, '');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(1); // Reset to first page on new search
      handleSearch(searchQuery, '');
    }
  };

  const handleHistoryItemClick = async (query: string, location: string) => {
    setSearchQuery(query)
    setIsHistoryDrawerOpen(false)
    // Trigger the search
    await handleSearch(query, location)
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            Search Google Maps Businesses
          </h2>
          <div className="flex gap-4">
            <Input
              size="large"
              placeholder="Enter location or google maps link..."
              prefix={<SearchOutlined />}
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              className="bg-primary-500"
              onClick={() => {
                setCurrentPage(1);
                handleSearch(searchQuery, '');
              }}
              loading={loading}
            >
              Search
            </Button>
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setIsHistoryDrawerOpen(true)}
              aria-label="Search History"
            >
              History
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Search Results {total > 0 && `(${total})`}
          </h3>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            className="bg-primary-500"
            disabled={businesses.length === 0}
          >
            Download Results
          </Button>
        </div>

        <Table
          dataSource={businesses}
          columns={columns}
          pagination={{
            current: currentPage,
            total: total,
            onChange: handlePageChange,
            pageSize: pageSize,
            showSizeChanger: false,
          }}
          rowKey="id"
          loading={loading}
        />
      </div>

      <SearchHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        searchHistory={searchHistory}
        onHistoryItemClick={handleHistoryItemClick}
      />
    </div>
  );
} 