import { Avatar, message, Table } from "antd";
import React, { useState, useEffect } from "react";

import {
  DeleteFilled,
  EditFilled,
  FileImageFilled,
  FileImageOutlined,
  FileImageTwoTone,
} from "@ant-design/icons";
import useUser from "../hooks/useUser";
import { getProducts, removeProduct } from "../api/products";
import ProductModal from "./ProductModal";
import EditProductModal from "./EditProductModal";
import ReportModal from "./ReportModal";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    setLoading(true);

    getProducts()
      .then((res) => setProducts(res?.data))
      .catch((e) => message.error("При получении изделий произошла ошибка"))
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  console.log(user?.role);

  const handleRowClick = (record) => {
    setSelectedProduct(record);
    setIsModalOpen(true);
  };

  const columns = [
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
        <div className="flex items-center justify-center gap-5">
          {user?.role === "ADMIN" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveProduct(value);
                }}
              >
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
            </>
          )}

          {user?.role === "ENGINEER" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReportOpen(true);
                setSelectedProduct(value);
              }}
            >
              <FileImageTwoTone
                style={{ color: "rgba(0,0,0,0.8)", fontSize: 18 }}
              />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        className="cursor-pointer"
      />
      <ProductModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        user={user}
        selectedProduct={selectedProduct}
      />
      <EditProductModal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        selectedProduct={selectedProduct}
        user={user}
        products={products}
        setProducts={setProducts}
      />
      <ReportModal
        open={reportOpen}
        onCancel={() => setReportOpen(false)}
        selectedProduct={selectedProduct}
      />
    </>
  );
};

export default ProductsTable;
