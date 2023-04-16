import { createSlice } from '@reduxjs/toolkit'
import { EMenuType } from "configs"
import { buttonKey } from "configs"

const initialState = {
    menu: [
        {
            key: 'overview',
            title: 'Tổng quan',
            icon: 'mdi mdi-crosshairs-gps',
            type: EMenuType.collapse,
            childs: [
                {
                    key: 'summary',
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
            key: 'project',
            title: 'Dự án',
            path: '/project',
            icon: 'mdi mdi-crosshairs-gps',
            type: EMenuType.action
        },
        {
            key: 'category',
            type: EMenuType.collapse,
            icon: 'mdi mdi-crosshairs-gps',
            title: 'Danh mục',
            childs: [
                {
                    key: 'team',
                    title: 'Nhóm',
                    path: '/category/team',
                    type: EMenuType.action
                },
                {
                    key: 'priority',
                    title: 'Độ ưu tiên',
                    path: '/category/priority',
                    type: EMenuType.action
                }
            ]
        },
        {
            key: 'user',
            title: 'Người dùng',
            icon: 'mdi mdi-crosshairs-gps',
            path: '/user',
            type: EMenuType.action
        },
        {
            key: 'task-group',
            title: 'Công việc',
            type: EMenuType.group,
            childs: [
                {
                    key: 'template',
                    title: 'Mẫu công việc',
                    path: '/template',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'status',
                    title: 'Trạng thái',
                    path: '/category/status',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'tasktype',
                    title: 'Loại công việc',
                    path: '/category/tasktype',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'task',
                    title: 'Công việc',
                    path: '/task',
                    icon: 'mdi mdi-crosshairs-gps',
                    isHasProjectPath: true,
                    type: EMenuType.action
                }
            ]
        },
        {
            key: 'permission-group',
            title: 'Phân quyền',
            type: EMenuType.group,
            childs: [
                {
                    key: 'permission',
                    title: 'Phân quyền',
                    path: '/permission',
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