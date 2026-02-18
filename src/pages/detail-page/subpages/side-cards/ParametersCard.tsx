import { FC, useMemo } from "react";
import { Chip, Stack } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import SideCardContainer from "./SideCardContainer";
import { formatToUrlParam } from "../../../../components/common/store/componentParamReducer";
import { pageDefault } from "../../../../components/common/constants";
import { portalTheme } from "../../../../styles";
import { Link } from "react-router-dom";

const ParametersCard: FC = () => {
  const { collection } = useDetailPageContext();

  const parameterVocabs = useMemo(
    () => collection?.getParameterVocabs() ?? [],
    [collection]
  );

  if (parameterVocabs.length === 0) return null;

  return (
    <SideCardContainer title="Parameters">
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {parameterVocabs.map((label) => (
          <Link
            key={label}
            to={`${pageDefault.search}?${formatToUrlParam({ parameterVocabs: [{ label }] })}`}
            style={{ textDecoration: "none" }}
          >
            <Chip
              label={label}
              size="small"
              clickable
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
          </Link>
        ))}
      </Stack>
    </SideCardContainer>
  );
};

export default ParametersCard;
