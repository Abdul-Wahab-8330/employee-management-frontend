import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees/all");
      setAllUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ allUsers, setAllUsers, loading, setLoading, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserProvider