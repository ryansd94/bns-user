import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Collapse } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { getUserInfo } from "helpers"
import Grid from "@mui/material/Grid"
import { AvatarControl } from 'components/avatar'
import { Evariant } from "configs"
import _ from 'lodash'

const Sidebar = (props) => {
    const { location } = props
    const user = getUserInfo()
    const [state, setState] = useState({})

    useEffect(() => {
        onRouteChanged()
    }, [location])

    useEffect(() => {
        onRouteChanged()
        // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
        const body = document.querySelector('body')
        document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
            el.addEventListener('mouseover', function () {
                if (body.classList.contains('sidebar-icon-only')) {
                    el.classList.add('hover-open')
                }
            })
            el.addEventListener('mouseout', function () {
                if (body.classList.contains('sidebar-icon-only')) {
                    el.classList.remove('hover-open')
                }
            })
        })
    })

    const getProjectPath = (path) => {
        if (user) {
            const code = user?.setting?.projectSetting?.current
            return `/${code}${path}`
        }
        return path
    }

    const getPath = (path) => {
        if (user) {
            const defaultOrganization = user.defaultOrganization
            return !_.isNil(defaultOrganization) ? `/${user.defaultOrganization}${path}` : `${path}`
        }
        return path
    }

    const toggleMenuState = (menuState) => {
        if (state[menuState]) {
            setState({ [menuState]: false })
        } else if (Object.keys(state).length === 0) {
            setState({ [menuState]: true })
        } else {
            setState({ [menuState]: true })
        }
    }

    const onRouteChanged = () => {
        document.querySelector('#sidebar').classList.remove('active')
        // Object.keys(state).forEach(i => {
        //     setState({ [i]: false })
        // })

        const dropdownPaths = [
            { path: '/apps', state: 'appsMenuOpen' },
            { path: '/basic-ui', state: 'category' },
            { path: '/advanced-ui', state: 'advancedUiMenuOpen' },
            { path: '/form-elements', state: 'formElementsMenuOpen' },
            { path: '/tables', state: 'tablesMenuOpen' },
            { path: '/maps', state: 'mapsMenuOpen' },
            { path: '/icons', state: 'iconsMenuOpen' },
            { path: '/charts', state: 'chartsMenuOpen' },
            { path: '/user-pages', state: 'userPagesMenuOpen' },
            { path: '/error-pages', state: 'errorPagesMenuOpen' },
            { path: '/general-pages', state: 'generalPagesMenuOpen' },
            { path: '/ecommerce', state: 'ecommercePagesMenuOpen' },
            { path: '/template', state: 'templatePagesMenuOpen' },
        ]
    }

    const isPathActive = (path) => {
        return location.pathname.startsWith(path)
    }

    return <div className="flex-column">
        <Grid container item xs direction={'column'} className='no-wrap'>
            <Grid container item xs gap={2} alignItems={'center'} className='box-container'>
                <Grid item><AvatarControl variant={Evariant.rounded} name={user?.setting?.projectSetting?.current} /></Grid>
                <Grid item xs>{user?.setting?.projectSetting?.current}</Grid>
            </Grid>
        </Grid>
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className={isPathActive(getPath(getProjectPath('/overview/summary'))) || isPathActive(getPath(getProjectPath('/overview/dashboard'))) ? 'nav-item active' : 'nav-item'}>
                    <div className={state.overview ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => toggleMenuState('overview')} data-toggle="collapse">
                        <span className="icon-bg"><i className="mdi mdi-crosshairs-gps menu-icon"></i></span>
                        <span className="menu-title"><Trans>Tổng quan</Trans></span>
                        <i className="menu-arrow"></i>
                    </div>
                    <Collapse in={state.overview}>
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <Link className={isPathActive(getPath(getProjectPath('/overview/summary'))) ? 'nav-link active' : 'nav-link'} to={getPath(getProjectPath('/overview/summary'))}><Trans>Tóm tắt</Trans></Link></li>
                            <li className="nav-item"> <Link className={isPathActive(getPath(getProjectPath('/overview/dashboard'))) ? 'nav-link active' : 'nav-link'} to={getPath(getProjectPath("/overview/dashboard"))}><Trans>Tổng quan</Trans></Link></li>
                        </ul>
                    </Collapse>
                </li>
                <li className={isPathActive(getPath('/project')) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={getPath('/project')}>
                        <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                        <span className="menu-title"><Trans>Dự án</Trans></span>
                    </Link>
                </li>
                <li className="nav-item nav-category"><Trans>Main</Trans></li>
                <li className={isPathActive(getPath(getProjectPath('/dashboard'))) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={getPath(getProjectPath('/dashboard'))}>
                        <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                        <span className="menu-title"><Trans>Trang chủ</Trans></span>
                    </Link>
                </li>
                <li className="nav-item nav-category"><Trans>Danh mục</Trans></li>
                <li className={isPathActive(getPath('/category/team')) || isPathActive(getPath('/category/priority')) ? 'nav-item active' : 'nav-item'}>
                    <div className={state.category ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => toggleMenuState('category')} data-toggle="collapse">
                        <span className="icon-bg"><i className="mdi mdi-crosshairs-gps menu-icon"></i></span>
                        <span className="menu-title"><Trans>Danh mục</Trans></span>
                        <i className="menu-arrow"></i>
                    </div>
                    <Collapse in={state.category}>
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <Link className={isPathActive(getPath(getProjectPath('/category/team'))) ? 'nav-link active' : 'nav-link'} to={getPath('/category/team')}><Trans>Nhóm</Trans></Link></li>
                            <li className="nav-item"> <Link className={isPathActive(getPath(getProjectPath('/category/priority'))) ? 'nav-link active' : 'nav-link'} to={getPath("/category/priority")}><Trans>Độ ưu tiên</Trans></Link></li>
                        </ul>
                    </Collapse>
                </li>
                <li className="nav-item nav-category"><Trans>Người dùng</Trans></li>
                <li className={isPathActive('/user') ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={getPath("/user")}>
                        <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                        <span className="menu-title"><Trans>Người dùng</Trans></span>
                    </Link>
                </li>
                <li className="nav-item nav-category"><Trans>Dự án</Trans></li>
                <li className={isPathActive(getPath('/template')) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={getPath('/template')}>
                        <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                        <span className="menu-title"><Trans>Mẫu công việc</Trans></span>
                    </Link>
                </li>
                <li className={isPathActive('/category/status') ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={getPath("/category/status")}>
                        <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                        <span className="menu-title"><Trans>Trạng thái</Trans></span>
                    </Link>
                </li>
                <li className={isPathActive('/category/tasktype') ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={getPath("/category/tasktype")}>
                        <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                        <span className="menu-title"><Trans>Loại công việc</Trans></span>
                    </Link>
                </li>
                <li className={isPathActive(getPath(getProjectPath('/task'))) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={getPath(getProjectPath('/task'))}>
                        <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                        <span className="menu-title"><Trans>Công việc</Trans></span>
                    </Link>
                </li>
            </ul>
        </nav>
    </div>
}

export default withRouter(Sidebar)