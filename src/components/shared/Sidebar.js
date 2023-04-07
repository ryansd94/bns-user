import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Collapse } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { getUserInfo } from "helpers"
import Grid from "@mui/material/Grid"
import { AvatarControl } from 'components/avatar'
import { ESize, Evariant } from "configs"
import _ from 'lodash'

class Sidebar extends Component {
    state = { user: getUserInfo() }

    getProjectPath(path) {
        if (this.state.user) {
            const code = this.state.user?.setting?.projectSetting?.current
            return `/${code}${path}`
        }
        return path
    }

    getPath(path) {
        if (this.state.user) {
            const defaultOrganization = this.state.user.defaultOrganization
            return !_.isNil(defaultOrganization) ? `/${this.state.user.defaultOrganization}${path}` : `${path}`
        }
        return path
    }

    toggleMenuState(menuState) {
        if (this.state[menuState]) {
            this.setState({ [menuState]: false })
        } else if (Object.keys(this.state).length === 0) {
            this.setState({ [menuState]: true })
        } else {
            // Object.keys(this.state).forEach(i => {
            //     this.setState({ [i]: false })
            // })
            this.setState({ [menuState]: true })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged()
        }
    }

    onRouteChanged() {
        document.querySelector('#sidebar').classList.remove('active')
        // Object.keys(this.state).forEach(i => {
        //     this.setState({ [i]: false })
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

        // dropdownPaths.forEach((obj => {
        //     if (this.isPathActive(obj.path)) {
        //         this.setState({ [obj.state]: true })
        //     } else {
        //         this.setState({ [obj.state]: false })
        //     }
        // }))

    }

    render() {
        return (
            <Grid container item xs direction={'column'} className='no-wrap'>
                <Grid container item xs gap={2} alignItems={'center'} className='box-container'>
                    <Grid item><AvatarControl variant={Evariant.rounded} name={this.state.user?.setting?.projectSetting?.current} /></Grid>
                    <Grid item xs>{this.state.user?.setting?.projectSetting?.current}</Grid>
                </Grid>
                <Grid item>
                    <nav className="sidebar sidebar-offcanvas ofy-auto" id="sidebar">
                        <ul className="nav">
                            <li className={this.isPathActive(this.getPath(this.getProjectPath('/overview/summary'))) || this.isPathActive(this.getPath(this.getProjectPath('/overview/dashboard'))) ? 'nav-item active' : 'nav-item'}>
                                <div className={this.state.overview ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('overview')} data-toggle="collapse">
                                    <span className="icon-bg"><i className="mdi mdi-crosshairs-gps menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Tổng quan</Trans></span>
                                    <i className="menu-arrow"></i>
                                </div>
                                <Collapse in={this.state.overview}>
                                    <ul className="nav flex-column sub-menu">
                                        <li className="nav-item"> <Link className={this.isPathActive(this.getPath(this.getProjectPath('/overview/summary'))) ? 'nav-link active' : 'nav-link'} to={this.getPath(this.getProjectPath('/overview/summary'))}><Trans>Tóm tắt</Trans></Link></li>
                                        <li className="nav-item"> <Link className={this.isPathActive(this.getPath(this.getProjectPath('/overview/dashboard'))) ? 'nav-link active' : 'nav-link'} to={this.getPath(this.getProjectPath("/overview/dashboard"))}><Trans>Tổng quan</Trans></Link></li>
                                    </ul>
                                </Collapse>
                            </li>
                            <li className={this.isPathActive(this.getPath('/project')) ? 'nav-item active' : 'nav-item'}>
                                <Link className="nav-link" to={this.getPath('/project')}>
                                    <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Dự án</Trans></span>
                                </Link>
                            </li>
                            <li className="nav-item nav-category"><Trans>Main</Trans></li>
                            <li className={this.isPathActive(this.getPath(this.getProjectPath('/dashboard'))) ? 'nav-item active' : 'nav-item'}>
                                <Link className="nav-link" to={this.getPath(this.getProjectPath('/dashboard'))}>
                                    <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Trang chủ</Trans></span>
                                </Link>
                            </li>
                            <li className="nav-item nav-category"><Trans>Danh mục</Trans></li>
                            <li className={this.isPathActive(this.getPath('/category/team')) || this.isPathActive(this.getPath('/category/priority')) ? 'nav-item active' : 'nav-item'}>
                                <div className={this.state.category ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('category')} data-toggle="collapse">
                                    <span className="icon-bg"><i className="mdi mdi-crosshairs-gps menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Danh mục</Trans></span>
                                    <i className="menu-arrow"></i>
                                </div>
                                <Collapse in={this.state.category}>
                                    <ul className="nav flex-column sub-menu">
                                        <li className="nav-item"> <Link className={this.isPathActive(this.getPath(this.getProjectPath('/category/team'))) ? 'nav-link active' : 'nav-link'} to={this.getPath('/category/team')}><Trans>Nhóm</Trans></Link></li>
                                        <li className="nav-item"> <Link className={this.isPathActive(this.getPath(this.getProjectPath('/category/priority'))) ? 'nav-link active' : 'nav-link'} to={this.getPath("/category/priority")}><Trans>Độ ưu tiên</Trans></Link></li>
                                    </ul>
                                </Collapse>
                            </li>
                            <li className="nav-item nav-category"><Trans>Người dùng</Trans></li>
                            <li className={this.isPathActive('/user') ? 'nav-item active' : 'nav-item'}>
                                <Link className="nav-link" to={this.getPath("/user")}>
                                    <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Người dùng</Trans></span>
                                </Link>
                            </li>
                            <li className="nav-item nav-category"><Trans>Dự án</Trans></li>
                            <li className={this.isPathActive(this.getPath('/template')) ? 'nav-item active' : 'nav-item'}>
                                <Link className="nav-link" to={this.getPath('/template')}>
                                    <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Mẫu công việc</Trans></span>
                                </Link>
                            </li>
                            <li className={this.isPathActive('/category/status') ? 'nav-item active' : 'nav-item'}>
                                <Link className="nav-link" to={this.getPath("/category/status")}>
                                    <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Trạng thái</Trans></span>
                                </Link>
                            </li>
                            <li className={this.isPathActive('/category/tasktype') ? 'nav-item active' : 'nav-item'}>
                                <Link className="nav-link" to={this.getPath("/category/tasktype")}>
                                    <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Loại công việc</Trans></span>
                                </Link>
                            </li>
                            <li className={this.isPathActive(this.getPath(this.getProjectPath('/task'))) ? 'nav-item active' : 'nav-item'}>
                                <Link className="nav-link" to={this.getPath(this.getProjectPath('/task'))}>
                                    <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
                                    <span className="menu-title"><Trans>Công việc</Trans></span>
                                </Link>
                            </li>
                            {/* <li className={this.isPathActive('/error-pages') ? 'nav-item active' : 'nav-item'}>
                        <div className={this.state.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('errorPagesMenuOpen')} data-toggle="collapse">
                            <span className="icon-bg"><i className="mdi mdi-security menu-icon"></i></span>
                            <span className="menu-title"><Trans>Error pages</Trans></span>
                            <i className="menu-arrow"></i>
                        </div>
                        <Collapse in={this.state.errorPagesMenuOpen}>
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item"> <Link className={this.isPathActive('/error-pages/error-404') ? 'nav-link active' : 'nav-link'} to="/error-pages/error-404"><Trans>404</Trans></Link></li>
                                <li className="nav-item"> <Link className={this.isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link'} to="/error-pages/error-500"><Trans>500</Trans></Link></li>
                            </ul>
                        </Collapse>
                    </li>
                    <li className="nav-item documentation-link">
                        <a className="nav-link" href="http://bootstrapdash.com/demo/connect-plus-react-free/documentation/documentation.html">
                            <span className="icon-bg">
                                <i className="mdi mdi-file-document-box menu-icon"></i>
                            </span>
                            <span className="menu-title"><Trans>Documentation</Trans></span>
                        </a>
                    </li> */}
                            {/* <li className="nav-item sidebar-user-actions">
                        <div className="user-details">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="d-flex align-items-center">
                                        <div className="sidebar-profile-img">
                                            <img src={require("../../assets/images/faces/face28.png")} alt="profile" />
                                        </div>
                                        <div className="sidebar-profile-text">
                                            <p className="mb-1"><Trans>Henry Klein</Trans></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="badge badge-danger">3</div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item sidebar-user-actions">
                        <div className="sidebar-user-menu">
                            <a href="!#" onClick={event => event.preventDefault()} className="nav-link"><i className="mdi mdi-settings menu-icon"></i>
                                <span className="menu-title"><Trans>Settings</Trans></span>
                            </a>
                        </div>
                    </li>
                    <li className="nav-item sidebar-user-actions">
                        <div className="sidebar-user-menu">
                            <a href="!#" onClick={event => event.preventDefault()} className="nav-link"><i className="mdi mdi-speedometer menu-icon"></i>
                                <span className="menu-title"><Trans>Take Tour</Trans></span></a>
                        </div>
                    </li>
                    <li className="nav-item sidebar-user-actions">
                        <div className="sidebar-user-menu">
                            <a href="!#" onClick={event => event.preventDefault()} className="nav-link"><i className="mdi mdi-logout menu-icon"></i>
                                <span className="menu-title"><Trans>Log Out</Trans></span></a>
                        </div>
                    </li> */}
                        </ul>
                    </nav>
                </Grid>
            </Grid>
        )
    }

    isPathActive(path) {
        return this.props.location.pathname.startsWith(path)
    }

    componentDidMount() {
        this.onRouteChanged()
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
    }

}

export default withRouter(Sidebar)