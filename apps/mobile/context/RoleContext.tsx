import React, { createContext, ReactNode, useContext, useState } from "react";

type RoleType = "Guardian" | "Athlete";

interface RoleContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
}

// Provide default values to prevent errors during pre-render
const defaultContext: RoleContextType = {
  role: "Guardian",
  setRole: () => {},
};

const RoleContext = createContext<RoleContextType>(defaultContext);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<RoleType>("Guardian");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  return useContext(RoleContext);
};
