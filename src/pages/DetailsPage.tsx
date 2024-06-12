import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  fetchResultByUuidNoStore,
  OGCCollection,
} from "../components/common/store/searchReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../components/common/store/store";
import DetailsPanel from "../components/details/DetailsPanel";
import Layout from "../components/layout/layout";

const DetailsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [collection, setCollection] = useState<OGCCollection | undefined>(
    undefined
  );

  useEffect(() => {
    const uuid: string | undefined = new URLSearchParams(location.search)
      .get("uuid")
      ?.toString();
    if (uuid) {
      dispatch(fetchResultByUuidNoStore(uuid))
        .unwrap()
        .then((collection) => {
          setCollection(collection);
        });
    } else {
      //TODO: Show error
    }
  }, [dispatch, location.search]);

  return (
    <Layout>
      <DetailsPanel collection={collection} />
    </Layout>
  );
};

export default DetailsPage;
