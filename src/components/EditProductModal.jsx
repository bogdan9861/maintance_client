import { Avatar, Button, Form, Input, message, Modal, Upload } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRightOutlined, UploadOutlined } from "@ant-design/icons";
import { editProduct } from "../api/products";

const EditProductModal = ({
  open,
  onCancel,
  selectedProduct,
  user,
  products,
  setProducts,
}) => {
  const [editForm] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (values) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("id", selectedProduct?.id);
    formData.append("name", values?.name);
    formData.append("description", values?.description);
    if (values?.serialNumber) {
      formData.append("serialNumber", values?.serialNumber);
    }
    formData.append("standartUsageHours", values?.standartUsageHours);
    formData.append("image", image);
    formData.append(
      "commissionDate",
      new Date(values.commissionDate).toISOString()
    );

    editProduct(formData)
      .then((res) => {
        message.success("Данные успешно обновлены");
        const oldArr = products;
        oldArr[products.findIndex((e) => e.id === selectedProduct.id)] =
          res.data;

        setProducts(oldArr);
        editForm.resetFields();
        onCancel();
      })
      .catch((e) => {
        console.log(e);

        message.error("Произошла ошибка");
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
    return false;
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Редактировать изделие"
    >
      {selectedProduct && (
        <div className="space-y-4">
          <div
            className="flex items-center gap-4"
            style={{ justifyContent: "space-between" }}
          >
            <div className="flex items-center gap-4">
              <Avatar size={80} src={selectedProduct.imageUrl} shape="square" />
              <div>
                <div className="text-lg font-semibold">
                  {selectedProduct.name}
                </div>
                <div className="text-gray-500">
                  Код: {selectedProduct.serialNumber}
                </div>
              </div>
            </div>
            {user?.role === "MANAGER" && (
              <Link to={`/product/${selectedProduct?.id}`}>
                Перейти <ArrowRightOutlined />
              </Link>
            )}
          </div>

          <Form
            form={editForm}
            initialValues={selectedProduct}
            layout="vertical"
            onFinish={handleEdit}
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
              <Input style={{ width: 150 }} type={"datetime-local"} />
            </Form.Item>

            <Form.Item name="image" label="Изображение">
              <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
                onChange={({ file }) => {
                  setImage(file);
                }}
              >
                <Button icon={<UploadOutlined />} className="rounded-xl">
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
              Сохранить
            </Button>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default EditProductModal;
