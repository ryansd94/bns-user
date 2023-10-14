import React, { useEffect, useState } from "react"
import ButtonFuntion from "components/button/ButtonFuntion"
import { EButtonType, EButtonIconType, ESize } from "configs/enums"
import { PopperControl } from "components/popover"
import PopupContent from "components/popup/popupContent"
import { useTranslation } from "react-i18next"
import StatusItem from "views/category/status/statusItem"
import Grid from "@mui/material/Grid"
import ButtonIcon from "components/button/ButtonIcon"
import { saveUserSetting } from "services"
import { getUserInfo, setUserInfo } from "helpers"
import eventEmitter from "helpers/eventEmitter"
import GroupContent from "components/group/groupContent"
import _ from "lodash"

const TaskButtonSetting = (props) => {
  const { listStatus = [] } = props
  const [anchorEl, setAnchorEl] = React.useState(null)
  let userInfo = getUserInfo()
  const getListStatusHideIds = () => {
    const hideStatusIds = userInfo?.setting?.taskSetting?.hideStatusIds || ''
    return !_.isEmpty(hideStatusIds) ? JSON.parse(hideStatusIds) : []
  }
  let [hideStatusIds, setHideStatusIds] = useState(getListStatusHideIds())
  const open = Boolean(anchorEl)
  const { t } = useTranslation()

  const onClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const onClose = () => {
    setAnchorEl(null)
  }

  const onHideUnhideClick = (id, isHide) => {
    if (isHide) {
      hideStatusIds.push(id)
    } else {
      hideStatusIds = _.filter(hideStatusIds, (x) => x !== id)
    }
    setHideStatusIds([...hideStatusIds])
  }

  const renderListStatus = () => {
    return (
      <GroupContent label={t("Status list")}>
        <Grid container item gap={2} xs direction="column">
          {_.map(listStatus, (item) => {
            const iconType = _.includes(hideStatusIds, item.id) ? EButtonIconType.hide : EButtonIconType.unhide
            const isHide = _.includes(hideStatusIds, item.id) ? false : true
            return (
              <Grid
                item
                justifyContent={"space-between"}
                key={item.id}
                xs
                container
              >
                <Grid item>
                  <StatusItem status={item} />
                </Grid>
                <Grid item>
                  <ButtonIcon size={ESize.small} onClick={() => onHideUnhideClick(item.id, isHide)} type={iconType} />
                </Grid>
              </Grid>
            )
          })}
        </Grid>
      </GroupContent>
    )
  }

  const renderPopupContent = () => {
    return <div>{renderListStatus()}</div>
  }

  const handleSave = async () => {
    eventEmitter.emit('onChangeHiddenStatusIds', hideStatusIds)
    onClose()
    const value = JSON.stringify(hideStatusIds)
    await saveUserSetting([
      { key: "TaskSetting.HideStatusIds", value: value }
    ])
    userInfo.setting.taskSetting.hideStatusIds = value
    setUserInfo({ user: userInfo })
  }

  return (
    <>
      <ButtonFuntion
        onClick={onClick}
        isTextAndIcon={false}
        spacingLeft={1}
        type={EButtonType.setting}
      />
      {open ? (
        <PopperControl anchorEl={anchorEl} className="popper-task-settings">
          <PopupContent
            handleSave={handleSave}
            onClose={onClose}
            id="popper-task-settings"
            title={t("Setting")}
            isShowFooter={true}
            labelSave={t("Apply")}
            ModalBody={renderPopupContent}
          />
        </PopperControl>
      ) : (
        ""
      )}
    </>
  )
}

export default TaskButtonSetting
