import { FC, useCallback, useMemo } from "react";
import { Chip, Stack } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import SideCardContainer from "./SideCardContainer";
import { useAppDispatch } from "../../../../components/common/store/hooks";
import {
  clearComponentParam,
  updateParameterVocabs,
} from "../../../../components/common/store/componentParamReducer";
import useRedirectSearch from "../../../../hooks/useRedirectSearch";
import { pageReferer } from "../../../../components/common/constants";
import { capitalizeFirstLetter } from "../../../../utils/StringUtils";
import { portalTheme } from "../../../../styles";

const ParametersCard: FC = () => {
  const { collection } = useDetailPageContext();
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();

  const parameterVocabs = useMemo(
    () =>
      (collection?.getParameterVocabs() ?? []).map((v) =>
        capitalizeFirstLetter(v)
      ),
    [collection]
  );

  const handleChipClick = useCallback(
    (label: string) => {
      dispatch(clearComponentParam());
      dispatch(updateParameterVocabs([{ label }]));
      redirectSearch(pageReferer.DETAIL_PAGE_REFERER);
    },
    [dispatch, redirectSearch]
  );

  if (parameterVocabs.length === 0) return null;

  return (
    <SideCardContainer title="Parameters">
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {parameterVocabs.map((label) => (
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
