import './index.css';
import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import api from '@/app/lib/api';

const LoginPage: React.FC = () => {
  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    // 在这里执行登录逻辑，例如发送请求验证用户名和密码
    const loginRes = await api('/api/admin/login', values);
    console.log(loginRes, "loginResloginResloginResloginRes");
    if(loginRes?.code === 0){
      message.success("登录成功！");
      location.href = "/admin/codeList";
    }
  };

  return (
    <div className="login-container">
      <h2>登录</h2>
      <Form
        name="login"
        className="login-form"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          label="管理员账号"
          rules={[
            { required: true, message: 'Please input your username!' },
            { whitespace: true },
          ]}
        >
          <Input
            prefix={<UserOutlined className="prefix-icon" />}
            placeholder="Your username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: 'Please input your password!' },
            { whitespace: true },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="prefix-icon" />}
            type="password"
            placeholder="Your password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-btn">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;


//@ts-ignore
export async function getServerSideProps(context) {
  // 将用户信息作为 prop 传递给页面
  return {
    props: {
      user: {}
    }
  };
}