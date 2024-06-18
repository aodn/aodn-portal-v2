import SideCardContainer from "./SideCardContainer";
import { Card, Stack, Typography, useTheme } from "@mui/material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import {
  border,
  borderRadius,
  color,
  padding,
} from "../../../../styles/constants";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useDetailPageContext } from "../../context/detail-page-context";
import dayjs from "dayjs";

enum Status {
  onGoing = "onGoing",
  completed = "completed",
}

const TemporalExtentCard = () => {
  const theme = useTheme();
  const { collection } = useDetailPageContext();
  if (!collection) return;
  const period: (string | null)[][] | undefined = collection.extent?.temporal
    .interval ?? [
    ["", ""],
    ["", ""],
  ];
  const startDate = dayjs(period[0][0]).format("DD/MM/YYYY");

  const status = collection.getStatus();

  const renderOnGoingStatus = () => (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `${border.xs} ${theme.palette.success.main}`,
        borderRadius: borderRadius.medium,
        padding: padding.small,
      }}
    >
      <DataUsageIcon
        sx={{ fontSize: "16px", paddingRight: padding.medium }}
        color="success"
      />
      <Typography padding={0} color={theme.palette.success.main}>
        On going
      </Typography>
    </Card>
  );

  const renderCompletedStatus = () => (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `${border.xs} ${color.gray.extraLight}`,
        borderRadius: borderRadius.medium,
        backgroundColor: color.blue.extraLight,
        padding: padding.small,
      }}
    >
      <DoneAllIcon
        sx={{ fontSize: "18px", paddingRight: padding.medium }}
        color="primary"
      />
      <Typography padding={0} color={color.blue.dark}>
        Completed
      </Typography>
    </Card>
  );

  return (
    <SideCardContainer title="Temporal Extent">
      <Stack direction="column" sx={{ width: "100%" }}>
        <Stack
          direction="row"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: padding.medium,
          }}
        >
          <Typography paddingTop={padding.extraSmall}>Status:</Typography>
          {status === Status.completed
            ? renderCompletedStatus()
            : renderOnGoingStatus()}
        </Stack>
        <Stack
          direction="row"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: padding.small,
          }}
        >
          <Typography paddingTop={padding.extraSmall}>Period:</Typography>
          <Card
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: `${border.xs} ${color.gray.extraLight}`,
              borderRadius: borderRadius.medium,
              backgroundColor: color.blue.extraLight,
              padding: padding.small,
            }}
          >
            <Typography padding={0}>{startDate}</Typography>
            <KeyboardDoubleArrowRightIcon
              sx={{ fontSize: "18px", paddingLeft: padding.small }}
            />
          </Card>
        </Stack>
      </Stack>
    </SideCardContainer>
  );
};

export default TemporalExtentCard;
