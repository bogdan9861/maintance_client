import React, { useState, useEffect } from "react";
import { Badge, Button } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router";
import { getNotifications } from "../api/notifications";

const AppHeader = ({ user }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnredCount] = useState([]);

  useEffect(() => {
    getNotifications()
      .then((res) => {
        const unreadedMessages = res?.data?.filter((n) => !n.isRead);
        setUnredCount(unreadedMessages?.length);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
      {/* Логотип */}
      <div className="flex items-center gap-2">
        <Logo />
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-4">
        <Badge count={unreadCount || 0}>
          <Button
            onClick={() => navigate("/notifications")}
            type="text"
            icon={<BellOutlined style={{ fontSize: 18 }} />}
          />
        </Badge>

        <Button
          type="text"
          icon={<UserOutlined style={{ fontSize: 18 }} />}
          onClick={() => navigate("/profile", { state: { user } })}
        >
          <span>{user?.firstName}</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
