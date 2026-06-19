import { Ipynb } from "@jupyter-kit/react";
import axios from "axios";

// TODO: Return some default ipnb with error message
export const getNotebook = async (url: string): Promise<Ipynb> => {
  return await axios.get<Ipynb>(url).then((value) => {
    return new Promise<Ipynb>((resolve, reject) => {
      resolve(value.data);
      reject("Cannot fetch ipython notebook");
    });
  });
};
