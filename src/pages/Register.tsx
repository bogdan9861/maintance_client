import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { register } from "../api/users";
import { enums } from "../constants/index";

const { Title } = Typography;

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const onFinish = async (values: RegisterForm) => {
    try {
      console.log("Register:", values);

      register(values)
        .then((res) => {
          localStorage.setItem(enums.TOKEN, res.data.token);

          navigate("/");
        })
        .catch((e) => {
          console.log(e);
        });

      message.success("Регистрация успешна");
      message.success("Перенаправление...");
    } catch (error) {
      message.error("Ошибка регистрации");
    }
  };

  return (
    <AuthLayout>
      <Title level={3} className="text-center mb-6">
        Регистрация
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Иван" />
          </Form.Item>

          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[{ required: true, message: "Введите фамилию" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Иванов" />
          </Form.Item>
        </div>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Некорректный email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="example@mail.ru" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 6, message: "Минимум 6 символов" },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="******" />
        </Form.Item>

        <Form.Item
          label="Подтверждение пароля"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="******" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="rounded-lg"
          >
            Зарегистрироваться
          </Button>
        </Form.Item>

        <div className="text-center">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-600">
            Войти
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Register;
