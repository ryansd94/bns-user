import React, { Component } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import './App.scss'
import Footer from './components/shared/Footer'
import Navbar from './components/shared/Navbar'
import Sidebar from './components/shared/Sidebar'
import SettingsPanel from './components/shared/SettingsPanel'
import { withTranslation } from "react-i18next"
import AppRoutes from './AppRoutes'
import Progress from "react-progress-2"
import CustomizedSnackbar from 'components/snackbar/CustomizedSnackbar'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { isHasPermissionForAction, getLastPathUrl } from "helpers"
import _ from 'lodash'

const theme = createTheme({
    palette: {
        primary: {
            main: '#c4c4c4',
            border_color: '#c4c4c4'
        },
        secondary: {
            main: '#351436'
        }
    }
})

class App extends Component {
    state = { isFullPageLayout: true }
    componentDidMount() {
        //Progress.hide()
        this.onRouteChanged()
    }
    render() {
        console.log('render app')
        let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : ''
        let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : ''
        let SettingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel /> : ''
        let footerComponent = !this.state.isFullPageLayout ? <Footer /> : ''
        return (
            <div className="container-scroller">
                <MuiThemeProvider theme={theme}>
                    <Progress.Component />
                    <CustomizedSnackbar />
                    <ConfirmDeleteDialog />
                    {navbarComponent}
                    <div className="container-fluid page-body-wrapper">
                        {sidebarComponent}
                        <div className="main-panel">
                            <div className="content-wrapper flex-column flex-grow">
                                <AppRoutes />
                                {SettingsPanelComponent}
                            </div>
                            {/* {footerComponent} */}
                        </div>
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }

    componentDidUpdate(prevProps) {
        Progress.hide()
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged()
        }
    }

    onRouteChanged() {
        const { history } = this.props
        Progress.show()
        window.scrollTo(0, 0)
        const fullPageLayoutRoutes = ['/login', '/signup/jointeam', '/signup']
        const notCheckPermissions = ['login', 'jointeam', 'signup', 'access-denied']
        for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
            if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
                this.setState({
                    isFullPageLayout: true
                })
                document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper')
                break
            } else {
                this.setState({
                    isFullPageLayout: false
                })
                document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper')
            }
        }
        const currentPath = getLastPathUrl()
        if (!_.includes(notCheckPermissions, currentPath)) {
            const isHasPermission = isHasPermissionForAction()
            if (isHasPermission === false) {
                history.push('/access-denied')
                return
            }
        }
    }

}

export default withTranslation()(withRouter(App))
