import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../components/common/store/hooks";
import { OGCCollection } from "../components/common/store/OGCCollectionDefinitions";
import {
  setOpen,
  setTemporaryItem,
  setExpandedItem,
  addItem,
  removeItem,
  selectBookmarkItems,
  selectTemporaryItem,
  selectExpandedItem,
  selectIsOpen,
  fetchAndInsertTemporary,
} from "../components/common/store/bookmarkListReducer";

export const useBookmarkList = () => {
  const dispatch = useAppDispatch();

  // Use selectors for state access
  const items = useSelector(selectBookmarkItems);
  const temporaryItem = useSelector(selectTemporaryItem);
  const expandedItem = useSelector(selectExpandedItem);
  const isOpen = useSelector(selectIsOpen);

  // Actions
  const toggleOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setOpen(isOpen));
    },
    [dispatch]
  );

  const insertTemporaryItem = useCallback(
    (item: OGCCollection) => {
      console.log("call insertTemporaryItem");
      dispatch(setTemporaryItem(item));
    },
    [dispatch]
  );

  const insertItem = useCallback(
    (item: OGCCollection) => {
      dispatch(addItem(item));
    },
    [dispatch]
  );

  const handleRemoveItem = useCallback(
    (item: OGCCollection) => {
      dispatch(removeItem(item.id));
    },
    [dispatch]
  );

  const checkIsBookmarked = useCallback(
    (uuid: string): boolean => {
      return items?.some((item) => item.id === uuid) ?? false;
    },
    [items]
  );

  const updateExpandedItem = useCallback(
    (item: OGCCollection | undefined) => {
      dispatch(setExpandedItem(item));
    },
    [dispatch]
  );

  const collapseAllAccordions = useCallback(() => {
    dispatch(setExpandedItem(undefined));
  }, [dispatch]);

  // Optional: Add a fetch and insert function if needed
  const fetchAndAddTemporary = useCallback(
    (id: string) => {
      dispatch(fetchAndInsertTemporary(id));
    },
    [dispatch]
  );

  return {
    items,
    temporaryItem,
    expandedItem,
    isOpen,
    setOpen,
    insertTemporaryItem,
    insertItem,
    removeItem,
    checkIsBookmarked,
    setExpandedItem,
    collapseAllAccordions,
    fetchAndAddTemporary,
  };
};
