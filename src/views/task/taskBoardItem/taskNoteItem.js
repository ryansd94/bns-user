import React, { useEffect, useState } from "react";
import { OverflowTip } from "components/tooltip";
import { IconDescription } from "components/icon/icon";
import { PopoverControl, PopperControl } from "components/popover";
import { EditorControl } from "components/editor";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";

const TaskNoteItem = (props) => {
  const { item, title } = props;

  const [openPopover, setOpenPopover] = useState(null);
  const handlePopoverClose = () => {
    setOpenPopover(null);
  };

  const renderPopoverControl = () => {
    return (
      <EditorControl
        isShowPlaceholder={false}
        className="editor-popover"
        readOnly={true}
        isFullScreen={true}
        value={item?.description}
        name={"description"}
        isShowAccordion={false}
      />
    );
  };

  const handlePopperClick = (event) => {
    if (!openPopover) {
      setOpenPopover(event.currentTarget);
    } else {
      setOpenPopover(null);
    }
  };

  const genderTooltip = (item) => {
    return (
      <div>
        <ClickAwayListener onClickAway={handlePopoverClose}>
          <Box>
            <IconDescription
              className={"cursor-pointer"}
              onClick={handlePopperClick}
            />
            <PopperControl anchorEl={openPopover}>
              {renderPopoverControl()}
            </PopperControl>
          </Box>
        </ClickAwayListener>
      </div>
    );
  };
  return (
    <OverflowTip
      disableHoverListener={false}
      value={title}
      renderTooltipContent={() => genderTooltip(item)}
    />
  );
};

export default TaskNoteItem;
