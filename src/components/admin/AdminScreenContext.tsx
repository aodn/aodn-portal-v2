import { createContext } from "react";

export interface ApplicationInfo {
  name?: string;
  description?: string;
  version?: string;
}

export interface GitCommitInfo {
  id?: string;
}

export interface GitInfo {
  commit?: GitCommitInfo;
}

export interface DepServiceItem {
  version?: string;
  description?: string;
}

export interface OgcInfo {
  application?: ApplicationInfo;
  git?: GitInfo;
  depService?: Record<string, DepServiceItem>;
}

export type AdminScreenContextType = {
  enableGeoServerWhiteList: boolean;
  getMaxMapCentroids: () => number;
  info?: OgcInfo | null;
  infoLoading?: boolean;
  infoError?: string | null;
};

const AdminScreenContext = createContext<Partial<AdminScreenContextType>>({});

export default AdminScreenContext;
