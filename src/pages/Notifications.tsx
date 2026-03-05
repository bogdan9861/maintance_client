import { useState, useEffect } from "react";
import {
  List,
  Card,
  Tag,
  Typography,
  Button,
  Badge,
  Empty,
  message,
} from "antd";
import {
  CheckOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  BellOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  getNotifications,
  markAsReadAll,
  markAsReadById,
} from "../api/notifications";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "maintenance" | "warning" | "info";
  createdAt: string;
  isRead: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications()
      .then((res) => {
        console.log(res.data);

        setNotifications(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    markAsReadById(id)
      .then((res) => {
        message.success("Уведомление отмечено как прочитанное");
      })
      .catch((e) => {
        message.error("Произошла ошибка");
      });
  };

  const onReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    markAsReadAll()
      .then((res) => {
        message.success("Все уведомления прочитаны");
      })
      .catch((e) => {
        message.error("Произошла ошибка");
      });
  };

  const getTag = (type: string) => {
    switch (type) {
      case "maintenance":
        return (
          <Tag color="blue" icon={<ToolOutlined />} className="rounded-full">
            ТО
          </Tag>
        );
      case "warning":
        return (
          <Tag
            color="red"
            icon={<ExclamationCircleOutlined />}
            className="rounded-full"
          >
            Важно
          </Tag>
        );
      default:
        return (
          <Tag color="green" className="rounded-full">
            Инфо
          </Tag>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button onClick={() => navigate(-1)}>
        <ArrowLeftOutlined />
      </button>
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-3xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Badge count={unreadCount}>
                <BellOutlined className="text-2xl" />
              </Badge>
              <Title level={3} className="!mb-0">
                Уведомления
              </Title>
            </div>

            {unreadCount > 0 && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={onReadAll}
                className="rounded-2xl"
              >
                Прочитать все
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Empty description="Нет уведомлений" />
          ) : (
            <List
              dataSource={notifications}
              itemLayout="vertical"
              renderItem={(item) => (
                <List.Item>
                  <Card
                    className={`rounded-2xl transition-all ${
                      !item.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {getTag(item.type)}
                          <Text strong>{item.title}</Text>
                        </div>

                        <Text type="secondary">{item.message}</Text>

                        <div className="mt-3">
                          <Text
                            type="secondary"
                            style={{
                              color: "rgba(0,0,0,0.7)",
                              fontWeight: "500",
                            }}
                            className="text-xs"
                          >
                            {new Date(item.createdAt).toLocaleString()}
                          </Text>
                        </div>
                      </div>

                      {!item.isRead && (
                        <Button type="link" onClick={() => markAsRead(item.id)}>
                          Прочитать
                        </Button>
                      )}
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
