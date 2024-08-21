import {
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import TryIcon from "@mui/icons-material/Try";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import ActionButtonPaper from "./ActionButtonPaper";
import RelevancyIcon from "../../icon/RelevancyIcon";
import { FC, useCallback, useState } from "react";

enum SortResultEnum {
  RELEVANT = "RELEVANT",
  TITLE = "TITLE",
  POPULARITY = "POPULARITY",
  MODIFIED = "MODIFIED",
}

export interface SortButtonProps {
  onChangeSorting: (layout: SortResultEnum) => void;
}

const determineShowingIcon = (resultLayout: SortResultEnum) => {
  switch (resultLayout) {
    case SortResultEnum.RELEVANT:
      return <RelevancyIcon />;

    case SortResultEnum.TITLE:
      return <SubtitlesIcon />;

    case SortResultEnum.POPULARITY:
      return <ArrowDropDownSharpIcon />;

    case SortResultEnum.MODIFIED:
      return <ArrowDropDownSharpIcon />;

    default:
      return <ArrowDropDownSharpIcon />;
  }
};

const SortButton: FC<SortButtonProps> = ({ onChangeSorting }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resultLayout, setResultLayout] = useState<SortResultEnum>(
    SortResultEnum.RELEVANT
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <ActionButtonPaper>
      <Button
        id="sort-list-toggle-button"
        onClick={handleClick}
        aria-controls={anchorEl != null ? "sort-list-toggle-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl != null ? "true" : undefined}
        data-testid="sort-list-toggle-button"
        startIcon={determineShowingIcon(resultLayout)}
      >
        Sort
      </Button>
      <Menu
        open={anchorEl != null}
        onClose={handleClose}
        id="sort-list-toggle-menu"
        anchorEl={anchorEl}
        MenuListProps={{
          "aria-labelledby": "sort-list-toggle-button",
        }}
      >
        <MenuItem
          data-testid="sortlist-toggle-menu-relevant"
          onClick={() => {
            // No need to set layout because we want to
            // remember the last layout
            handleClose();
            onChangeSorting(SortResultEnum.RELEVANT);
          }}
        >
          <ListItemIcon>
            <RelevancyIcon />
          </ListItemIcon>
          Relevance
        </MenuItem>
        <MenuItem
          data-testid="sortlist-toggle-menu-title"
          onClick={() => {
            setResultLayout(SortResultEnum.TITLE);
            handleClose();
            onChangeSorting(SortResultEnum.TITLE);
          }}
        >
          <ListItemIcon>
            <SubtitlesIcon />
          </ListItemIcon>
          Title (A-Z)
        </MenuItem>
        <MenuItem
          data-testid="sortlist-toggle-menu-popularity"
          onClick={() => {
            setResultLayout(SortResultEnum.POPULARITY);
            handleClose();
            onChangeSorting(SortResultEnum.POPULARITY);
          }}
        >
          <ListItemIcon>
            <TryIcon />
          </ListItemIcon>
          Popularity
        </MenuItem>
        <MenuItem
          data-testid="sortlist-toggle-menu-modified"
          onClick={() => {
            setResultLayout(SortResultEnum.MODIFIED);
            handleClose();
            onChangeSorting(SortResultEnum.MODIFIED);
          }}
        >
          <ListItemIcon>
            <EditNoteIcon />
          </ListItemIcon>
          Modified
        </MenuItem>
      </Menu>
    </ActionButtonPaper>
  );
};

export { SortResultEnum };
export default SortButton;
