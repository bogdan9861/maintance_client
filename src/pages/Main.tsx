import { useEffect, useState } from "react";
import { Table, Modal, Avatar, Badge, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import Header from "../components/Header";
import useUser from "../hooks/useUser";
import { getProducts, removeProduct } from "../api/products";
import { getNotifications } from "../api/notifications";
import ProductModal from "../components/ProductModal";
import EditProductModal from "../components/EditProductModal";
import ProductsTable from "../components/ProductsTable";

interface Product {
  id: string;
  name: string;
  inventoryCode: string;
  imageUrl?: string;
  description?: string;
}

const Main = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Список изделий</h1>

        <div className="bg-white rounded-2xl shadow p-4">
          <ProductsTable />
        </div>
      </div>
    </div>
  );
};

export default Main;
