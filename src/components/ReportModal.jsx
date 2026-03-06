import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Typography,
  Upload,
} from "antd";
import React, { useState } from "react";
import {
  ArrowRightOutlined,
  CloseCircleOutlined,
  FileFilled,
  FileOutlined,
  FileWordFilled,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { createReport } from "../api/reports";

const ReportModal = ({ open, onCancel, selectedProduct }) => {
  const [file, setFile] = useState();
  const [reportForm] = Form.useForm();

  const sendForm = () => {
    const { title } = reportForm.getFieldsValue();

    const formData = new FormData();

    formData.append("productId", selectedProduct?.id);
    formData.append("title", title);
    formData.append("file", file);

    createReport(formData)
      .then((res) => {
        onCancel();
        message.success("Отчёт создан");
      })
      .catch((e) => {
        message.error("Не удалось создать отчет");
      });
  };

  const handleFileUpload = (file) => {
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      message.error("Можно загружать только документы Word (.doc, .docx)");
      return Upload.LIST_IGNORE;
    }

    setFile(file);
    return false;
  };

  return (
    <Modal
      title="Добавление отчёта о проведении ТО"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <div className="space-y-4">
        <div
          className="flex items-center gap-4"
          style={{ justifyContent: "space-between" }}
        >
          <div className="flex items-center gap-4">
            <Avatar size={80} src={selectedProduct?.imageUrl} shape="square" />
            <div>
              <div className="text-lg font-semibold">
                {selectedProduct?.name}
              </div>
              <div className="text-gray-500">
                Код: {selectedProduct?.serialNumber}
              </div>
            </div>
          </div>
        </div>

        <Form form={reportForm} layout="vertical" onFinish={sendForm}>
          <Form.Item name="title" label="Название отчёта">
            <Input placeholder="Введите название" />
          </Form.Item>

          {file && (
            <div
              style={{ width: "100%" }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <FileFilled style={{ fontSize: 16, color: "#4096ff" }} />
                <Typography.Text
                  style={{ lineHeight: "18px", fontSize: 14, maxWidth: "100%" }}
                  type="secondary"
                >
                  {file?.name}
                </Typography.Text>
              </div>
              <button onClick={() => setFile(null)}>
                <CloseCircleOutlined
                  style={{ fontSize: 16, color: "rgba(0,0,0,0.7)" }}
                />
              </button>
            </div>
          )}
          <Form.Item name="file">
            <Upload
              accept=".doc,.docx"
              name="file"
              beforeUpload={handleFileUpload}
              showUploadList={false}
              onChange={({ file }) => {
                setFile(file);
              }}
            >
              <Button icon={<UploadOutlined />} className="rounded-xl">
                Загрузить отчет
              </Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="rounded-xl px-8">
            Отпавить
            <SendOutlined />
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default ReportModal;
