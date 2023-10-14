import React, { useState, useEffect } from "react";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { EPlacement } from "configs";

const PopperControl = (props) => {
  const {
    children,
    anchorEl,
    style,
    onItemClick,
    placement = EPlacement.bottom,
    className,
  } = props;
  const open = Boolean(anchorEl);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      style={style}
      className={className}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350} onClick={onItemClick}>
          <Paper>{children}</Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default PopperControl;
