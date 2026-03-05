import { useEffect, useState } from "react";
import { Card, Button, Descriptions, Tag, Typography, message } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { editProduct, getProductById, updateUsage } from "../api/products";

const { Title, Text } = Typography;

const ProductScreen = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [product, setProduct] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    getProductById({ id })
      .then((res) => {
        console.log(res.data);

        setProduct(res.data);
        setSeconds(res.data.totalUsageHours * 60 * 60);
      })
      .catch((e) => {
        message.error("Не удалось получить изделие");
      });
  }, []);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    message.success("Таймер запущен");
  };

  const handleStop = () => {
    setIsRunning(false);

    const formData = new FormData();

    formData.append("id", product?.id);
    formData.append("totalUsageHours", seconds / 60 / 60);

    editProduct(formData)
      .then((res) => {
        message.success("Время использования обновлено");
      })
      .catch((e) => {
        message.error("Не удалось обновить время использования");
      });

    message.info("Таймер остановлен");
  };

  const formatTime = (total) => {
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toFixed(0).toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-100">
      <button style={{ padding: 20 }} onClick={() => navigate(-1)}>
        <ArrowLeftOutlined style={{ fontSize: 21 }} />
      </button>
      <div className="min-h-screen p-8 flex justify-center items-center">
        <div className="w-full max-w-4xl rounded-3xl">
          <div className="flex flex-col md:flex-row gap-20">
            {/* Image */}
            <div className="flex justify-center items-center">
              {product?.imageUrl ? (
                <img
                  src={product?.imageUrl}
                  alt={product?.name}
                  className="w-80 h-80 object-cover rounded-3xl shadow-md"
                />
              ) : (
                <div className="w-80 h-80 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <Text type="secondary">Нет изображения</Text>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <Title level={2}>{product?.name}</Title>

              <Tag color="blue" className="mb-4 text-sm px-4 py-1 rounded-full">
                {product?.inventoryCode}
              </Tag>

              <Descriptions column={1} className="mb-6">
                <Descriptions.Item label="Описание">
                  {product?.description || "—"}
                </Descriptions.Item>

                <Descriptions.Item label="Дата ввода в эксплуатацию">
                  {new Date(product?.createdAt).toLocaleDateString()}
                </Descriptions.Item>

                <Descriptions.Item label="Рекомендованная дата ТО">
                  {new Date(product?.commissionDate).toLocaleDateString()}
                </Descriptions.Item>

                <Descriptions.Item label="Рекомендованное время использования">
                  <span className="font-mono text-lg">
                    {product?.standartUsageHourse}ч.
                  </span>
                </Descriptions.Item>

                <Descriptions.Item label="Общее время использования">
                  <span className="font-mono text-lg">
                    {formatTime(seconds)}
                  </span>
                </Descriptions.Item>
              </Descriptions>

              {/* Timer */}
              <div className="flex gap-4 mt-6">
                {!isRunning ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    className="rounded-2xl"
                    onClick={handleStart}
                  >
                    Запустить
                  </Button>
                ) : (
                  <Button
                    danger
                    size="large"
                    icon={<PauseCircleOutlined />}
                    className="rounded-2xl"
                    onClick={handleStop}
                  >
                    Остановить
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
