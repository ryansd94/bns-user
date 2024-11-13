import { useTranslation } from "react-i18next"
import { IconActive, IconEmail, IconBlock } from "components/icon/icon"
import { EUserStatus } from "configs"
import Grid from "@mui/material/Grid"
import { OverflowTip } from "components/tooltip"

const UserStatus = (props) => {
  const { t } = useTranslation()
  const { status } = props

  let icon2 = <IconActive />
  let userStatusClassName
  let label = ""

  if (status == EUserStatus.ACTIVE) {
    userStatusClassName = "text-active"
    icon2 = <IconActive className={userStatusClassName} />
    label = t("Active")
  } else if (status == EUserStatus.WAILTING_CONFIRM_MAIL) {
    userStatusClassName = "text-wait-confirm-mail"
    icon2 = <IconEmail className={userStatusClassName} />
    label = t("Waiting for confirm")
  } else if (status == EUserStatus.BLOCK) {
    userStatusClassName = "text-block"
    icon2 = <IconBlock className={userStatusClassName} />
    label = t("Temporarily locked")
  }

  const renderTooltipContent = () => {
    return <span style={{ textOverflow: "ellipsis" }}>{label}</span>
  }

  return (
    <Grid container item gap={2} direction="row" flexWrap={"nowrap"}>
      <Grid item>{icon2}</Grid>
      <Grid item xs className="of-hidden">
        <OverflowTip
          value={label}
          renderTooltipContent={renderTooltipContent}
        />
      </Grid>
    </Grid>
  )
}
export default UserStatus
