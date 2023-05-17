import { createSlice } from '@reduxjs/toolkit'
import { EMenuType } from "configs"
import { buttonKey } from "configs"

const initialState = {
    menu: [
        {
            key: 'Overview',
            title: 'Dashboard',
            icon: 'mdi mdi-crosshairs-gps',
            type: EMenuType.collapse,
            childs: [
                {
                    key: 'Summary',
                    parent: 'Overview',
                    title: 'Summary',
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
                    title: 'Dashboard',
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
            title: 'Project',
            path: '/project',
            icon: 'far fa-project-diagram',
            type: EMenuType.action
        },
        {
            key: 'Category',
            type: EMenuType.collapse,
            icon: 'mdi mdi-crosshairs-gps',
            title: 'Category',
            childs: [
                {
                    key: 'Team',
                    parent: 'Category',
                    title: 'Team',
                    path: '/category/team',
                    type: EMenuType.action
                },
                {
                    key: 'Priority',
                    parent: 'Category',
                    title: 'Priority',
                    path: '/category/priority',
                    type: EMenuType.action
                }
            ]
        },
        {
            key: 'User',
            title: 'Users',
            icon: 'far fa-users',
            path: '/user',
            type: EMenuType.action
        },
        {
            key: 'TaskGroup',
            title: 'Task',
            type: EMenuType.group,
            childs: [
                {
                    key: 'Template',
                    parent: 'TaskGroup',
                    title: 'Task template',
                    path: '/template',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'Status',
                    parent: 'TaskGroup',
                    title: 'Status',
                    path: '/category/status',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'Tasktype',
                    parent: 'TaskGroup',
                    title: 'Task type',
                    path: '/category/tasktype',
                    icon: 'mdi mdi-crosshairs-gps',
                    type: EMenuType.action
                },
                {
                    key: 'Task',
                    parent: 'TaskGroup',
                    title: 'Task',
                    path: '/task',
                    icon: 'far fa-tasks',
                    isHasProjectPath: true,
                    type: EMenuType.action
                }
            ]
        },
        {
            key: 'PermissionGroup',
            title: 'Permission',
            type: EMenuType.group,
            childs: [
                {
                    key: 'Permission',
                    parent: 'PermissionGroup',
                    title: 'Permission',
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