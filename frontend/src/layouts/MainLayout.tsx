import { Layout } from 'antd';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout; 