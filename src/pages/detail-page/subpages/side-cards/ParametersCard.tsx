import { FC, useCallback, useEffect, useMemo } from "react";
import { Chip, Stack } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import SideCardContainer from "./SideCardContainer";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../components/common/store/hooks";
import {
  clearComponentParam,
  updateParameterVocabs,
} from "../../../../components/common/store/componentParamReducer";
import { fetchParameterVocabsWithStore } from "../../../../components/common/store/searchReducer";
import useRedirectSearch from "../../../../hooks/useRedirectSearch";
import { pageReferer } from "../../../../components/common/constants";
import { portalTheme } from "../../../../styles";

const PARAMETER_VOCAB_TITLE = "AODN Discovery Parameter Vocabulary";

const ParametersCard: FC = () => {
  const { collection } = useDetailPageContext();
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();

  const parameterVocabs = useAppSelector(
    (state) => state.searcher.parameterVocabsResult
  );

  // Ensure parameter vocabs hierarchy is loaded
  useEffect(() => {
    if (parameterVocabs.length === 0) {
      dispatch(fetchParameterVocabsWithStore(null));
    }
  }, [dispatch, parameterVocabs.length]);

  // Build reverse lookup: concept label (level 3) → category label (level 2)
  // e.g. "Practical salinity of the water body" → "Salinity"
  const conceptToCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const root of parameterVocabs) {
      for (const category of root.narrower ?? []) {
        if (!category.narrower?.length) {
          map.set(category.label, category.label);
          continue;
        }
        for (const concept of category.narrower) {
          map.set(concept.label, category.label);
        }
      }
    }
    return map;
  }, [parameterVocabs]);

  // Resolve this collection's parameter concepts to category labels
  const categoryLabels = useMemo(() => {
    const themes = collection?.getThemes() ?? [];
    const categories = new Set<string>();

    themes
      .filter(
        (theme) =>
          theme.concepts?.length > 0 &&
          theme.concepts[0].title === PARAMETER_VOCAB_TITLE
      )
      .flatMap((theme) => theme.concepts)
      .forEach((concept) => {
        const category = conceptToCategoryMap.get(concept.id);
        if (category) categories.add(category);
      });

    return [...categories].sort((a, b) => a.localeCompare(b));
  }, [collection, conceptToCategoryMap]);

  // Navigate to search page with the clicked parameter as filter
  const handleChipClick = useCallback(
    (label: string) => {
      dispatch(clearComponentParam());
      dispatch(updateParameterVocabs([{ label }]));
      redirectSearch(pageReferer.DETAIL_PAGE_REFERER);
    },
    [dispatch, redirectSearch]
  );

  return (
    <SideCardContainer title="Parameters">
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {categoryLabels.map((label) => (
          <Chip
            key={label}
            label={label}
            size="small"
            clickable
            onClick={() => handleChipClick(label)}
            sx={{
              borderRadius: "6px",
              height: "auto",
              bgcolor: portalTheme.palette.primary6,
              ...portalTheme.typography.body1Medium,
              "& .MuiChip-label": {
                px: "12px",
                py: "6px",
              },
            }}
          />
        ))}
      </Stack>
    </SideCardContainer>
  );
};

export default ParametersCard;
