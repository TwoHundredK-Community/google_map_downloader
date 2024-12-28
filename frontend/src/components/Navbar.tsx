import { Button, Input, Avatar, Dropdown } from 'antd';
import { SearchOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAuthPage?: boolean;
}

const Navbar = ({ isAuthPage = false }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const profileMenu = {
    items: [
      // {
      //   key: 'profile',
      //   label: 'Profile',
      //   icon: <UserOutlined />,
      // },
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-white/90 transition">
              Google Map Downloader
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 