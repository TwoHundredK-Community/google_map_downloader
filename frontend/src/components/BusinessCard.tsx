import { Card, Tag, Button } from 'antd';
import { HeartOutlined, MailOutlined, GlobalOutlined, PhoneOutlined } from '@ant-design/icons';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    email?: string;
    website?: string;
    phone?: string;
    image?: string;
    category: string;
    emailStatus: 'sent' | 'not_sent' | 'failed';
    address: string;
  };
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getEmailStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Email Sent';
      case 'failed':
        return 'Email Failed';
      default:
        return 'Not Sent';
    }
  };

  return (
    <Card
      className="w-full mb-4 hover:shadow-md transition-shadow"
      cover={
        business.image && (
          <div className="h-48 overflow-hidden">
            <img
              src={business.image}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
        )
      }
      actions={[
        <Button key="favorite" icon={<HeartOutlined />} type="text" />,
        <Button
          key="email"
          icon={<MailOutlined />}
          type="text"
          disabled={!business.email}
        />,
        <Button
          key="website"
          icon={<GlobalOutlined />}
          type="text"
          disabled={!business.website}
        />,
      ]}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{business.name}</h3>
        <Tag color={getEmailStatusColor(business.emailStatus)}>
          {getEmailStatusText(business.emailStatus)}
        </Tag>
      </div>

      <div className="space-y-2">
        {business.email && (
          <div className="flex items-center text-gray-600">
            <MailOutlined className="mr-2" />
            <span className="text-sm">{business.email}</span>
          </div>
        )}

        {business.website && (
          <div className="flex items-center text-gray-600">
            <GlobalOutlined className="mr-2" />
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-500 hover:underline"
            >
              {business.website}
            </a>
          </div>
        )}

        {business.phone && (
          <div className="flex items-center text-gray-600">
            <PhoneOutlined className="mr-2" />
            <span className="text-sm">{business.phone}</span>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <Tag color="blue">{business.category}</Tag>
          <span className="text-sm ml-2">{business.address}</span>
        </div>
      </div>
    </Card>
  );
};

export default BusinessCard; 