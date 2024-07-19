import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "../components/NavigatablePanel";
import PlainTextBlock from "../components/PlainTextBlock";

const LineagePanel = () => {
  const context = useDetailPageContext();
  const statement = context.collection?.getStatement();

  const [isLoading, setIsLoading] = useState(true);

  const blocks = useMemo(
    () => [
      {
        title: "Statement",
        component: (
          <PlainTextBlock
            title="Statement"
            texts={statement ? [statement] : []}
          />
        ),
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
  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default LineagePanel;
