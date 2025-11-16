import { createContext } from "react";

type AdminScreenContextType = {
  enableGeoServerWhiteList?: boolean;
};

const AdminScreenContext = createContext<Partial<AdminScreenContextType>>({});

export default AdminScreenContext;
