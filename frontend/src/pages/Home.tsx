import { useState } from 'react';
import { Row, Col, Pagination, Button, Input, Table } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';

// Mock data for demonstration
const mockBusinesses = [
  {
    id: '1',
    name: 'Ambarukmo Square',
    email: 'info@ambarukmo.com',
    website: 'www.ambarukmo.com',
    phone: '+1 234-567-8900',
    address: '329 Ambarukmo St, Brooklyn, NY',
  },
  {
    id: '2',
    name: 'Northwest Village',
    email: 'contact@northwestvillage.com',
    website: 'www.northwestvillage.com',
    phone: '+1 234-567-8901',
    address: '482 Northwest Ave, Brooklyn, NY',
  },
];

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
    render: (text: string) => (
      <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ),
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

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

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
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              className="bg-primary-500"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Search Results
          </h3>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            className="bg-primary-500"
          >
            Download Results
          </Button>
        </div>

        <Table
          dataSource={mockBusinesses}
          columns={columns}
          pagination={{
            current: currentPage,
            total: 100,
            onChange: setCurrentPage,
            pageSize: 10,
          }}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default Home; 