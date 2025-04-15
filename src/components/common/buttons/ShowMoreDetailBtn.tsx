import { Button, Grid, Typography, useTheme } from "@mui/material";
import { FC, memo } from "react";
import PlusIcon from "../../icon/PlusIcon";
import MinusIcon from "../../icon/MinusIcon";

interface ShowMoreDetailButtonProps {
  isShowingMore: boolean;
  setIsShowingMore: (isShowingMore: boolean) => void;
  title?: string;
}

const ShowMoreDetailBtn: FC<ShowMoreDetailButtonProps> = memo(
  ({ isShowingMore, setIsShowingMore, title }: ShowMoreDetailButtonProps) => {
    const theme = useTheme();

    const handleClick = () => setIsShowingMore(!isShowingMore);
    const buttonText = isShowingMore ? "Show Less" : "Show More";
    const IconComponent = isShowingMore ? MinusIcon : PlusIcon;

    return (
      <Grid
        item
        md={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: theme.mp.lg,
        }}
      >
        <Button
          data-testid={`show-${isShowingMore ? "less" : "more"}-detail-btn-${title ?? ""}`}
          onClick={handleClick}
          sx={{
            border: theme.border.detailBtnLight,
            borderRadius: theme.borderRadius.sm,
            "&:hover": {
              border: theme.border.detailSubtabBtn,
            },
            display: "flex",
            alignItems: "center",
            gap: "9px", // Replaces Box spacer
          }}
        >
          <Typography variant="detailContent" color="#54BCEB">
            {buttonText}
          </Typography>
          <IconComponent />
        </Button>
      </Grid>
    );
  }
);

ShowMoreDetailBtn.displayName = "ShowMoreDetailBtn";

export default ShowMoreDetailBtn;
