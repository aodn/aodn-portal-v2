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
  const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [collection, setCollection] = useState<OGCCollection | undefined>(
    undefined
  );
  const uuid = state?.uuid;

  useEffect(() => {
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
        setCollection(collection);
      });
  }, [dispatch, uuid]);

  return (
    <Layout>
      <DetailsPanel collection={collection} />
    </Layout>
  );
};

export default DetailsPage;
