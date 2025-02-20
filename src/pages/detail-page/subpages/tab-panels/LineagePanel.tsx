import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";
import StatementList from "../../../../components/list/StatementList";

const LineagePanel = () => {
  const context = useDetailPageContext();
  const statement = context.collection?.getStatement();

  const [isLoading, setIsLoading] = useState(true);

  const lists: NavigatablePanelChild[] = useMemo(
    () => [
      {
        title: "Statement",
        component: <StatementList statement={statement ?? ""} />,
      },
    ],
    [statement]
  );

  useEffect(() => {
    if (!context.collection) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [context.collection]);
  return <NavigatablePanel childrenList={lists} isLoading={isLoading} />;
};

export default LineagePanel;
