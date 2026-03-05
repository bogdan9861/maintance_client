import { Avatar, Modal } from "antd";
import React from "react";
import { Link } from "react-router";
import { ArrowRightOutlined } from "@ant-design/icons";

const ProductModal = ({ open, onCancel, user, selectedProduct }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Информация об изделии"
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

          <div>
            <div className="font-medium">Описание:</div>
            <div className="text-gray-600">
              {selectedProduct.description || "Нет описания"}
            </div>
          </div>

          <div>
            <div className="font-medium">Серийный номер:</div>
            <div className="text-gray-600">{selectedProduct.serialNumber}</div>
          </div>

          <div>
            <div className="font-medium">Статус:</div>
            <div className="text-gray-600">{selectedProduct.status}</div>
          </div>

          <div>
            <div className="font-medium">Дата комиссии:</div>
            <div className="text-gray-600">
              {selectedProduct.commissionDate}
            </div>
          </div>

          <div>
            <div className="font-medium">Часов эксплуатации:</div>
            <div className="text-gray-600">
              {selectedProduct.totalUsageHours}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductModal;
