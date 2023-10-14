import React from "react"
import { EButtonType } from "configs/enums"
import { DropdownMenu } from "components/dropdown"

const ActionButton = (props) => {
  const { renderDropdownItem } = props

  return (
    <DropdownMenu
      isTextAndIcon={false}
      type={EButtonType.more}
      isShowEndIcon={false}
      visible={true}
      renderDropdownItem={renderDropdownItem}
    />
  )
}

export default ActionButton
