import React, { useState, useEffect } from "react";
import { currentUser } from "../api/users";

const useUser = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    setLoading(true);

    currentUser()
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  return { user, isLoading: loading };
};

export default useUser;
