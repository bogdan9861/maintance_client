import React, { useEffect, useState } from "react";
import { getReports, getReportsById } from "../api/reports";
import { Avatar, message, Table, Typography } from "antd";

import { DownloadOutlined, FileFilled } from "@ant-design/icons";

const ReportsTable = ({ productId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (productId) {
      getReportsById({ productId })
        .then((res) => setReports(res.data))
        .finally(setLoading(false));
    } else {
      getReports()
        .then((res) => {
          setReports(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId]);

  const columns = [
    { title: "Название", dataIndex: "title" },
    {
      title: "Отчёт",
      dataIndex: "fileUrl",
      render: (value) => (
        <div className="flex items-center gap-3 mb-3">
          <DownloadOutlined style={{ fontSize: 16, color: "#4096ff" }} />
          <Typography.Text
            style={{ lineHeight: "18px", fontSize: 14, maxWidth: "100%" }}
            type="secondary"
          >
            <a href={value}>скачать отчёт</a>
          </Typography.Text>
        </div>
      ),
    },
  ];

  const handleRowClick = () => {};

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={reports}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
      className="cursor-pointer"
    />
  );
};

export default ReportsTable;
