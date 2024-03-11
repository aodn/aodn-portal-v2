import { IpynbType } from "react-ipynb-renderer";
import axios from "axios";

// TODO: Return some default ipnb with error message
export const getNotebook = async (url: string): Promise<IpynbType> => {
  return await axios.get<IpynbType>(url).then((value) => {
    return new Promise<IpynbType>((resolve, reject) => {
      resolve(value.data);
      reject("Cannot fetch ipython notebook");
    });
  });
};
