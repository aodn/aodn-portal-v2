import React, { PropsWithChildren } from "react";

interface LayersProps {}

const Layers = (props: PropsWithChildren<LayersProps>) => {
  return <>{props.children}</>;
};

export default Layers;
