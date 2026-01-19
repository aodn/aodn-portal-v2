import { Button, Grid, Typography } from "@mui/material";
import { FC, memo } from "react";
import PlusIcon from "../../icon/PlusIcon";
import MinusIcon from "../../icon/MinusIcon";
import { portalTheme } from "../../../styles";

interface ShowMoreDetailButtonProps {
  id: string;
  isShowingMore: boolean;
  setIsShowingMore: (isShowingMore: boolean) => void;
  title?: string;
}

const ShowMoreDetailBtn: FC<ShowMoreDetailButtonProps> = memo(
  ({
    id,
    isShowingMore,
    setIsShowingMore,
    title,
  }: ShowMoreDetailButtonProps) => {
    const handleClick = () => setIsShowingMore(!isShowingMore);
    const buttonText = isShowingMore ? "Show Less" : "Show More";
    const IconComponent = isShowingMore ? MinusIcon : PlusIcon;

    return (
      <Grid
        item
        md={12}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: `${id ? "4px" : "12px"}`,
        }}
      >
        <Button
          id={id}
          data-testid={
            id ??
            `show-${isShowingMore ? "less" : "more"}-detail-btn-${title ?? ""}`
          }
          onClick={handleClick}
          sx={{
            width: "160px",
            bgcolor: id ? portalTheme.palette.neutral2 : "",
            border: `1px solid ${id ? portalTheme.palette.grey500 : portalTheme.palette.primary1}`,
            borderRadius: "10px",
            "&:hover": {
              border: `2px solid ${portalTheme.palette.primary1}`,
            },
          }}
        >
          <IconComponent />
          <Typography
            variant="title1Medium"
            color={portalTheme.palette.primary1}
            marginLeft={"10px"}
          >
            {buttonText}
          </Typography>
        </Button>
      </Grid>
    );
  }
);

ShowMoreDetailBtn.displayName = "ShowMoreDetailBtn";

export default ShowMoreDetailBtn;
