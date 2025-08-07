import { Button, Grid, Typography } from "@mui/material";
import { FC, memo } from "react";
import PlusIcon from "../../icon/PlusIcon";
import MinusIcon from "../../icon/MinusIcon";
import rc8Theme from "../../../styles/themeRC8";

interface ShowMoreDetailButtonProps {
  isShowingMore: boolean;
  setIsShowingMore: (isShowingMore: boolean) => void;
  title?: string;
}

const ShowMoreDetailBtn: FC<ShowMoreDetailButtonProps> = memo(
  ({ isShowingMore, setIsShowingMore, title }: ShowMoreDetailButtonProps) => {
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
          my: "12px",
        }}
      >
        <Button
          data-testid={`show-${isShowingMore ? "less" : "more"}-detail-btn-${title ?? ""}`}
          onClick={handleClick}
          sx={{
            width: "160px",
            border: `1px solid ${rc8Theme.palette.primary1}`,
            borderRadius: "10px",
            "&:hover": {
              border: `2px solid ${rc8Theme.palette.primary1}`,
            },
          }}
        >
          <IconComponent />
          <Typography
            variant="title1Medium"
            color={rc8Theme.palette.primary1}
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
