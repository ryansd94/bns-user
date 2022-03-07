import * as React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import { IconActive, IconEmail } from "components/icon/icon";
import { useTranslation } from "react-i18next";

import { EUserStatus } from "configs";
import { padding } from "@mui/system";
export default function UserStatus(props) {
  const { t } = useTranslation();
  // const { icon, setIcon } = React.useState("");
  let icon2 = <IconActive />;
  let userStatusClassName;
  let label ="Aaaa";
  const { status } = props;
  if (status == EUserStatus.ACTIVE) {
    icon2 = <IconActive />;
    userStatusClassName = "text-active";
    label = t("Kích hoạt");
  } else if (status == EUserStatus.WAILTING_CONFIRM_MAIL) {
    icon2 = <IconEmail />;
    userStatusClassName = "text-wait-confirm-mail";
    label = t("Chờ xác nhận");
  } else if (status == EUserStatus.BLOCK) {
    icon2 = <IconEmail />;
    userStatusClassName = "text-block";
  }
  return (
    <Stack direction="row" spacing={1}>
      <Chip
        style={{ padding: "10px" }}
        className={userStatusClassName}
        icon={icon2}
        label={label}
        variant="outlined"
      />
    </Stack>
  );
}
