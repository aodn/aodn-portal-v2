import React, { PropsWithChildren } from "react";

interface ControlsProps {
};

const Controls = (props : PropsWithChildren<ControlsProps>) => {
	return (<>{props.children}</>);
};

export default Controls;