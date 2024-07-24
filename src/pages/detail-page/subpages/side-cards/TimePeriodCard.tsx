import SideCardContainer from "./SideCardContainer";
import { Card, Stack, SxProps, Typography, useTheme } from "@mui/material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import {
  border,
  borderRadius,
  color,
  margin,
  padding,
} from "../../../../styles/constants";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useDetailPageContext } from "../../context/detail-page-context";
import dayjs from "dayjs";
import { FC, ReactNode, useCallback } from "react";

enum Status {
  onGoing = "onGoing",
  completed = "completed",
}

const RoundCard = ({
  children,
  sxProps,
}: {
  children: ReactNode;
  sxProps: SxProps;
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: border.xs,
        borderRadius: borderRadius.medium,
        padding: padding.small,
        ...sxProps,
      }}
    >
      {children}
    </Card>
  );
};

const TimePeriodCard: FC = () => {
  const theme = useTheme();
  const { collection } = useDetailPageContext();

  const period: (string | null)[][] | undefined = collection?.extent?.temporal
    .interval ?? [
    ["", ""],
    ["", ""],
  ];

  let startDate: string | undefined;
  let endDate: string | undefined;
  if (period && period[0][0]) {
    startDate = dayjs(period[0][0]).format("DD/MM/YYYY");
  }
  if (period && period[0][1]) {
    endDate = dayjs(period[0][1]).format("DD/MM/YYYY");
  }

  const status = collection?.getStatus();

  const renderOnGoingStatus = useCallback(
    () => (
      <RoundCard
        sxProps={{ border: `${border.xs} ${theme.palette.success.main}` }}
      >
        <DataUsageIcon
          sx={{ fontSize: "16px", paddingRight: padding.medium }}
          color="success"
        />
        <Typography padding={0} color={theme.palette.success.main}>
          On Going
        </Typography>
      </RoundCard>
    ),
    [theme.palette.success.main]
  );

  const renderCompletedStatus = useCallback(
    () => (
      <RoundCard
        sxProps={{
          border: `${border.xs} ${color.gray.extraLight}`,
          backgroundColor: color.blue.extraLightSemiTransparent,
        }}
      >
        <DoneAllIcon
          sx={{ fontSize: "18px", paddingRight: padding.medium }}
          color="primary"
        />
        <Typography padding={0} color={color.blue.dark}>
          Completed
        </Typography>
      </RoundCard>
    ),
    []
  );

  const renderPeriod = useCallback(() => {
    return (
      <Stack direction="column" justifyContent="center" alignItems="center">
        <RoundCard
          sxProps={{
            border: `${border.xs} ${color.gray.extraLight}`,
            backgroundColor: color.blue.extraLightSemiTransparent,
          }}
        >
          <Typography padding={0}>{startDate}</Typography>
          <KeyboardDoubleArrowRightIcon
            sx={{
              fontSize: "18px",
              paddingLeft: padding.small,
              color: color.gray.light,
            }}
          />
        </RoundCard>

        {endDate && (
          <RoundCard
            sxProps={{
              marginTop: margin.md,
              border: `${border.xs} ${color.gray.extraLight}`,
              backgroundColor: color.blue.extraLightSemiTransparent,
            }}
          >
            <KeyboardDoubleArrowRightIcon
              sx={{
                fontSize: "18px",
                paddingRight: padding.small,
                color: color.gray.light,
              }}
            />
            <Typography padding={0}>{endDate}</Typography>
          </RoundCard>
        )}
      </Stack>
    );
  }, [endDate, startDate]);

  if (!collection?.extent?.temporal) return;

  return (
    <SideCardContainer title="Time Period">
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
        {startDate && (
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: padding.medium,
            }}
          >
            <Typography paddingTop={padding.extraSmall}>Period:</Typography>
            {renderPeriod()}
          </Stack>
        )}
      </Stack>
    </SideCardContainer>
  );
};

export default TimePeriodCard;
