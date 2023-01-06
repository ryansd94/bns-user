import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { IconActive, IconEmail, IconBlock } from "components/icon/icon"
import { EUserStatus } from "configs"
import Grid from "@mui/material/Grid"

const UserStatus = (props) => {
    const { t } = useTranslation()
    const { status } = props

    let icon2 = <IconActive />
    let userStatusClassName
    let label = ""

    if (status == EUserStatus.ACTIVE) {
        userStatusClassName = "text-active"
        icon2 = <IconActive className={userStatusClassName} />
        label = t("Kích hoạt")
    } else if (status == EUserStatus.WAILTING_CONFIRM_MAIL) {
        userStatusClassName = "text-wait-confirm-mail"
        icon2 = <IconEmail className={userStatusClassName} />
        label = t("Chờ xác nhận")
    } else if (status == EUserStatus.BLOCK) {
        userStatusClassName = "text-block"
        icon2 = <IconBlock className={userStatusClassName} />
        label = t("Tạm khóa")
    }
    return (
        <Grid container item spacing={2} direction="row" >
            <Grid item>
                {icon2}
            </Grid>
            <Grid item xs>
                {label}
            </Grid>
        </Grid>)
}
export default UserStatus