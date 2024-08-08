import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "./NavigatablePanel";
import TextList from "../../../../components/list/TextList";

const LineagePanel = () => {
  const context = useDetailPageContext();
  const statement = context.collection?.getStatement();

  const [isLoading, setIsLoading] = useState(true);

  const lists = useMemo(
    () => [
      {
        title: "Statement",
        component: <TextList texts={statement ? [statement] : []} />,
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
