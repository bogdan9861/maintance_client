import { Form, Input, Button, Typography, message, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { login } from "../api/users";
import { enums } from "../constants";

const { Title } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    try {
      console.log("Login:", values);

      login(values)
        .then((res) => {
          localStorage.setItem(enums.TOKEN, res.data.token);

          navigate("/");
          message.success("Успешный вход");
        })
        .catch((e) => {
          message.error("Не удалось войти");
        });
    } catch (error) {
      message.error("Ошибка входа");
    }
  };

  return (
    <AuthLayout>
      <Title level={3} className="text-center mb-6">
        Вход
      </Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Некорректный email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 6, message: "Минимум 6 символов" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Введите пароль"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="rounded-lg"
          >
            Войти
          </Button>
        </Form.Item>

        <div className="text-center">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-blue-600">
            Зарегистрироваться
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login;
