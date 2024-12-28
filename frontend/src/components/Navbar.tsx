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
          {/* Search Bar and Navigation - Only show when not on auth page */}
          {!isAuthPage && (
            <>
              <div className="flex items-center space-x-4">
                <Dropdown menu={profileMenu} placement="bottomRight">
                  <Avatar 
                    icon={<UserOutlined />} 
                    className="cursor-pointer hover:opacity-80 bg-white/20 border-2 border-white/30"
                  />
                </Dropdown>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 