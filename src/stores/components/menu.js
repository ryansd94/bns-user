import { createSlice } from '@reduxjs/toolkit'
import { EMenuType } from "configs"
import { buttonKey } from "configs"

const initialState = {
    menu: [
        {
            key: 'Overview',
            title: 'Tổng quan',
            icon: 'mdi mdi-crosshairs-gps',
            type: EMenuType.collapse,
            childs: [
                {
                    key: 'Summary',
                    parent: 'Overview',
                    title: 'Tóm tắt',
                    path: '/overview/summary',
                    icon: 'mdi mdi-crosshairs-gps',
                    isHasProjectPath: true,
                    type: EMenuType.action,
                    button: {
                        notInclude: buttonKey.defaultKeys
                    }
                },
                {
                    key: 'dashboard',
                    parent: 'Overview',
                    title: 'Tổng quan',
                    path: '/overview/dashboard',
                    icon: 'mdi mdi-crosshairs-gps',
                    isHasProjectPath: true,
                    type: EMenuType.action,
                    button: {
                        notInclude: buttonKey.defaultKeys
                    }
                }
            ]
        },
        {
            key: 'Project',
            title: 'Dự án',
            path: '/project',
            icon: 'far fa-project-diagram',
            type: EMenuType.action
        },
        {
            key: 'Category',
            type: EMenuType.collapse,
            icon: 'mdi mdi-crosshairs-gps',
            title: 'Danh mục',
            childs: [
                {
                    key: 'Team',
                    parent: 'Category',
                    title: 'Nhóm',
                    path: '/category/team',
                    type: EMenuType.action
                },
                {
                    key: 'Priority',
                    parent: 'Category',
                    title: 'Độ ưu tiên',
                    path: '/category/priority',
                    type: EMenuType.action
                }
            ]
        },
        {
            key: 'User',
            title: 'Người dùng',
            icon: 'far fa-users',
            path: '/user',
            type: EMenuType.action
        },
        {
            key: 'TaskGroup',
            title: 'Công việc',
            type: EMenuType.group,
            childs: [
                {
                    key: 'Template',
                    parent: 'TaskGroup',
                    title: 'Mẫu công việc',
                    path: '/template',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'Status',
                    parent: 'TaskGroup',
                    title: 'Trạng thái',
                    path: '/category/status',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'Tasktype',
                    parent: 'TaskGroup',
                    title: 'Loại công việc',
                    path: '/category/tasktype',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'Task',
                    parent: 'TaskGroup',
                    title: 'Công việc',
                    path: '/task',
                    icon: 'far fa-tasks',
                    isHasProjectPath: true,
                    type: EMenuType.action
                }
            ]
        },
        {
            key: 'PermissionGroup',
            title: 'Phân quyền',
            type: EMenuType.group,
            childs: [
                {
                    key: 'Permission',
                    parent: 'PermissionGroup',
                    title: 'Phân quyền',
                    path: '/viewPermission',
                    icon: 'far fa-shield',
                    type: EMenuType.action
                }
            ]
        }
    ]
}

const slice = createSlice({
    name: 'menu',
    initialState: initialState,
    reducers: {
        setMenu: (state, action) => {
            state.menu = action.payload
        }
    }
})

const { reducer, actions } = slice
export const { setMenu } = actions
export default reducer