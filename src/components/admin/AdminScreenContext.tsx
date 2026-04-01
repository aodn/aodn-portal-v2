import { createContext } from "react";

type AdminScreenContextType = {
  enableGeoServerWhiteList: boolean;
  getMaxMapCentroids: () => number;
};

const AdminScreenContext = createContext<Partial<AdminScreenContextType>>({});

export default AdminScreenContext;
