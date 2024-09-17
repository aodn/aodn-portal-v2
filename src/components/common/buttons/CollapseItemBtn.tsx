import React from "react";
import { ButtonBase, Grid, Link, Tooltip } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AssociatedRecordIcon from "../../icon/AssociatedRecordIcon";

interface CollapseItemBtnProps {
  onClick: () => null | undefined;
  isContact: boolean;
  isAssociatedRecord?: boolean;
  expanded: boolean;
  email: string | undefined;
  element: React.JSX.Element;
}

const CollapseItemBtn: React.FC<CollapseItemBtnProps> = ({
  onClick,
  isContact,
  isAssociatedRecord,
  expanded,
  email,
  element,
}) => {
  const generateIcon = () => {
    if (isContact && expanded) {
      return (
        <Grid item md={1}>
          <MailOutlineIcon />
        </Grid>
      );
    }
    if (isAssociatedRecord) {
      return (
        <Grid item md={1}>
          <AssociatedRecordIcon />
        </Grid>
      );
    }
    return null;
  };

  return (
    <ButtonBase onClick={onClick} sx={{ width: "100%" }}>
      <Grid item container md={12}>
        {generateIcon()}

        <Grid
          item
          md={11}
          sx={{
            textAlign: "left",
            whiteSpace: "normal",
          }}
        >
          {expanded && isContact ? (
            <Tooltip
              title={email ? `mail to: ${email}` : "[NO EMAIL PROVIDED]"}
              placement="top"
            >
              <Link href={`mailto:${email}`}>{element}</Link>
            </Tooltip>
          ) : (
            element
          )}
        </Grid>
      </Grid>
    </ButtonBase>
  );
};

export default CollapseItemBtn;
