import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Tabs,
  Table,
  message,
  Upload,
  Avatar,
  Spin,
  DatePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  DeleteFilled,
  DeleteOutlined,
  EditFilled,
  LoginOutlined,
  LogoutOutlined,
  PaperClipOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import useUser from "../hooks/useUser";
import { createProduct, getProducts, removeProduct } from "../api/products";
import { enums } from "../constants";
import EditProductModal from "../components/EditProductModal";
import ProductModal from "../components/ProductModal";
import ProductsTable from "../components/ProductsTable";

const { Title, Text } = Typography;

const mockUser = {
  id: "1",
  firstName: "Иван",
  lastName: "Петров",
  email: "ivan@mail.com",
  role: "ADMIN",
};

const ProfilePage = () => {
  const [products, setProducts] = useState([]);
  const [profileForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOpen, setProductOpen] = useState(false);

  const { user, isLoading } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    getProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleProfileUpdate = (values) => {
    message.success("Профиль обновлён");
  };

  const handleAddProduct = (values) => {
    setLoading(true);

    const newProduct = {
      id: Date.now().toString(),
      ...values,
      image: imagePreview || undefined,
    };

    const formData = new FormData();

    formData.append("name", values?.name);
    formData.append("description", values?.description);
    formData.append("serialNumber", values?.serialNumber);
    formData.append("standartUsageHours", values?.standartUsageHours);
    formData.append("image", image);
    formData.append(
      "commissionDate",
      new Date(values.commissionDate).toISOString()
    );

    createProduct(formData)
      .then((res) => {
        setProducts([...products, newProduct]);
        setImagePreview(null);
        productForm.resetFields();
        message.success("Изделие добавлено");
      })
      .catch((e) => {
        message.error("Не удалось добавить изделие");
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageUpload = (file) => {
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    return false; // предотвращаем авто-загрузку
  };

  const handleRemoveProduct = (product) => {
    setProducts((prev) => prev.filter((p) => p?.id !== product?.id));

    removeProduct({ id: product?.id })
      .then((res) => {
        message.success("Изделие удалено");
      })
      .catch((e) => {
        message.error("Не удалось удалить изделие");
      });
  };

  const productColumns = [
    {
      title: "Изображение",
      dataIndex: "imageUrl",
      render: (value) =>
        value ? (
          <Avatar src={value} size={48} shape="square" />
        ) : (
          <Avatar size={48} shape="square" />
        ),
    },
    { title: "Название", dataIndex: "name" },
    { title: "Инвентарный код", dataIndex: "serialNumber" },
    { title: "Описание", dataIndex: "description" },
    {
      title: "Часов использования",
      dataIndex: "totalUsageHours",
      render: (value) => <p>{value?.toFixed(1)}</p>,
    },
    { title: "Часов до ТО", dataIndex: "standartUsageHours" },
    {
      title: "Действия",
      render: (value) => (
        <>
          {user?.role === "ADMIN" && (
            <div className="flex items-center justify-center gap-5">
              <button onClick={() => handleRemoveProduct(value)}>
                <DeleteFilled style={{ color: "red", fontSize: 18 }} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditOpen(true);
                  setSelectedProduct(value);
                }}
              >
                <EditFilled
                  style={{ color: "rgba(0,0,0,0.8)", fontSize: 18 }}
                />
              </button>
            </div>
          )}

          <div className="flex items-center justify-center">
            {user?.role === "ENGINEER" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditOpen(true);
                  setSelectedProduct(value);
                }}
              >
                <PaperClipOutlined
                  style={{ color: "rgba(0,0,0,0.8)", fontSize: 18 }}
                />
              </button>
            )}
          </div>
        </>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem(enums.TOKEN);
    navigate("/login");
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <button onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
        </button>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Карточка профиля */}
          <Card
            style={{ marginBottom: 30, borderRadius: 15 }}
            className="rounded-3xl shadow-xl border-0 "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 mb-6">
                <Avatar
                  size={96}
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  className="shadow-lg"
                />
                <div>
                  <Title level={3} className="mb-1">
                    {user?.firstName} {user?.lastName}
                  </Title>
                  <Text type="secondary">{user?.email}</Text>
                  <div className="mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
              <button className="self-start" onClick={handleLogout}>
                <LoginOutlined style={{ color: "red", fontSize: 20 }} />
              </button>
            </div>

            <Form
              form={profileForm}
              layout="vertical"
              initialValues={user}
              onFinish={handleProfileUpdate}
            >
              <div className="grid grid-cols-2 gap-6">
                <Form.Item
                  label="Имя"
                  name="firstName"
                  rules={[{ required: true }]}
                >
                  <Input className="rounded-xl" />
                </Form.Item>

                <Form.Item
                  label="Фамилия"
                  name="lastName"
                  rules={[{ required: true }]}
                >
                  <Input className="rounded-xl" value={user?.lastName} />
                </Form.Item>
              </div>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input className="rounded-xl" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="rounded-xl px-8"
              >
                Сохранить
              </Button>
            </Form>
          </Card>

          {/* Ролевой блок */}

          <Card
            style={{ marginBottom: 30, borderRadius: 15 }}
            className="rounded-3xl shadow-xl border-0"
          >
            <Tabs
              items={[
                user?.role === "ADMIN"
                  ? {
                      key: "admin",
                      label: "Добавить изделие",
                      children: (
                        <Form
                          form={productForm}
                          layout="vertical"
                          onFinish={handleAddProduct}
                          className="space-y-4"
                        >
                          <Form.Item
                            label="Название"
                            name="name"
                            rules={[{ required: true }]}
                          >
                            <Input
                              className="rounded-xl"
                              placeholder="Ввведите название изделия"
                            />
                          </Form.Item>

                          <Form.Item
                            label="Серийный номер"
                            name="serialNumber"
                            rules={[{ required: true }]}
                          >
                            <Input
                              className="rounded-xl"
                              placeholder="Введите серийный номер"
                            />
                          </Form.Item>

                          <Form.Item
                            label="Норматив по использованию (ч.)"
                            name="standartUsageHours"
                          >
                            <Input
                              style={{ width: 230 }}
                              type="number"
                              className="rounded-xl"
                              placeholder="Введите часы"
                            />
                          </Form.Item>

                          <Form.Item
                            label="Описание"
                            name="description"
                            rules={[{ required: true }]}
                          >
                            <Input.TextArea
                              style={{ maxHeight: 150 }}
                              className="rounded-xl"
                              placeholder="Введите описание..."
                            />
                          </Form.Item>

                          <Form.Item
                            label="Дата технического обслуживания"
                            name="commissionDate"
                            rules={[{ required: true }]}
                          >
                            <Input
                              style={{ width: 150 }}
                              type={"datetime-local"}
                            />
                          </Form.Item>

                          <Form.Item name="image" label="Изображение">
                            <Upload
                              beforeUpload={handleImageUpload}
                              showUploadList={false}
                              onChange={({ file }) => {
                                setImage(file);
                              }}
                            >
                              <Button
                                icon={<UploadOutlined />}
                                className="rounded-xl"
                              >
                                Загрузить изображение
                              </Button>
                            </Upload>

                            {imagePreview && (
                              <div className="mt-4">
                                <Avatar
                                  src={imagePreview}
                                  size={80}
                                  shape="square"
                                  className="shadow-md"
                                />
                              </div>
                            )}
                          </Form.Item>

                          <Button
                            type="primary"
                            htmlType="submit"
                            className="rounded-xl px-8"
                            loading={loading}
                            disabled={loading}
                          >
                            Добавить изделие
                          </Button>
                        </Form>
                      ),
                    }
                  : {},
                {
                  key: "list",
                  label: "Все изделия",
                  children: <ProductsTable />,
                },
              ]}
            />
          </Card>
        </div>
      </div>
      <EditProductModal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        selectedProduct={selectedProduct}
        products={products}
        setProducts={setProducts}
      />
      <ProductModal
        open={productOpen}
        onCancel={() => setProductOpen(false)}
        selectedProduct={selectedProduct}
        user={user}
      />
    </>
  );
};

export default ProfilePage;
