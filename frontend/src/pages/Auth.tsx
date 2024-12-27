import { useState } from 'react';
import { Card, Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthService, { LoginCredentials, RegisterCredentials } from '../services/auth';

const { TabPane } = Tabs;

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      await AuthService.login(values);
      message.success('Login successful!');
      navigate('/', { replace: true });
    } catch (error: any) {
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail);
      } else if (error.response?.data) {
        // Handle validation errors
        const errors = Object.values(error.response.data).flat() as string[];
        message.error(errors[0] || 'Login failed. Please try again.');
      } else {
        message.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterCredentials) => {
    setLoading(true);
    try {
      await AuthService.register(values);
      message.success('Registration successful!');
      navigate('/', { replace: true });
    } catch (error: any) {
      if (error.response?.data) {
        // Handle validation errors
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join('\n');
        message.error(errors || 'Registration failed. Please try again.');
      } else {
        message.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthPage />
      <div className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm mx-auto shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-500 mb-2">
              Welcome to Google Map Downloader
            </h1>
            <p className="text-gray-600">
              Sign in to start downloading business data
            </p>
          </div>

          <Tabs defaultActiveKey="login" centered>
            <TabPane tab="Login" key="login">
              <Form
                name="login"
                onFinish={handleLogin}
                layout="vertical"
                requiredMark={false}
                className="px-2"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    size="large"
                    loading={loading}
                  >
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Register" key="register">
              <Form
                name="register"
                onFinish={handleRegister}
                layout="vertical"
                requiredMark={false}
                className="px-2"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: 'Please input your name!' },
                    { min: 2, message: 'Name must be at least 2 characters!' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Full Name"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 2, message: 'Password must be at least 2 characters!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password2"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    size="large"
                    loading={loading}
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Auth; 