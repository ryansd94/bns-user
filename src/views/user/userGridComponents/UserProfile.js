import React, { useState } from "react";
import { CardHeaderControl } from "components/cardHeader";
import { PopoverControl } from "components/popover";
import UserProfilePopover from "./UserProfilePopover";
import { LinkControl } from "components/link";

const UserProfile = (props) => {
  const { user } = props;

  const [openPopover, setOpenPopover] = useState(null);
  const onAvatarClick = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setOpenPopover(null);
  };
  function renderUserProfilePopover() {
    return (
      <UserProfilePopover
        onBack={handlePopoverClose}
        {...props}
      ></UserProfilePopover>
    );
  }
  return (
    <div onClick={onAvatarClick} onMouseLeave={handlePopoverClose}>
      <LinkControl title={user?.email} />
      <PopoverControl
        genderBody={renderUserProfilePopover}
        onClose={handlePopoverClose}
        anchorEl={openPopover}
      ></PopoverControl>
    </div>
  );
};
export default UserProfile;
