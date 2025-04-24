import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getRoles } from "../services/roleService";

const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData); 
      } catch (error) {
        toast.error(error.message || "Failed to load roles");
      }
    };

    fetchRoles();
  }, []);

  return (
    <RolesContext.Provider value={{ roles }}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => useContext(RolesContext);
