import MenuItem from "@mui/material/MenuItem"
import { DropdownMenu } from "components/dropdown"
import TaskTypeMenuItem from "./taskTypeMenuItem"
import { getUserInfo } from "helpers"
import { EPlacement } from "configs"
import _ from "lodash"

const TaskTypeMenu = (props) => {
  const { taskTypes = [] } = props
  const user = getUserInfo()

  const openTaskView = (item) => {
    const projectCode = user.setting?.projectSetting?.current
    if (!_.isNil(projectCode)) {
      window.open(
        `/${user.defaultOrganization?.code}/${projectCode}/task/create/${item.id}`,
      )
    } else {
      window.open(`/${user.defaultOrganization?.code}/task/create/${item.id}`)
    }
  }

  const renderDropdownItem = () => {
    return (
      <div>
        {taskTypes &&
          taskTypes.map((item) => {
            return (
              <MenuItem
                key={item.id}
                id={item.id}
                onClick={() => openTaskView(item)}
              >
                <TaskTypeMenuItem {...item} />
              </MenuItem>
            )
          })}
      </div>
    )
  }

  return (
    <div>
      <DropdownMenu
        placement={EPlacement.leftStart}
        isShowEndIcon={false}
        visible={true}
        renderDropdownItem={renderDropdownItem}
      />
    </div>
  )
}

export default TaskTypeMenu
