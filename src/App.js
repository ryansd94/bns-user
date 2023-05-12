import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import './App.scss'
import Footer from './components/shared/Footer'
import Navbar from './components/shared/Navbar'
import Sidebar from './components/shared/Sidebar'
import SettingsPanel from './components/shared/SettingsPanel'
import { withTranslation } from "react-i18next"
import AppRoutes from './AppRoutes'
import Progress from "react-progress-2"
import { CustomizedSnackbar, NotifySnackbar } from 'components/snackbar'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { isHasPermissionForAction, getLastPathUrl } from "helpers"
import { useParams } from 'react-router'
import { SignalRProvider } from 'helpers'
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

const App = ({ location, history }) => {
    const isFullPageLayoutRoutes = ['/login', '/signup/jointeam', '/signup']
    const pathname = location.pathname
    console.log('render app')

    useEffect(() => {
        onRouteChanged()

        // Progress.hide()
        return () => {
            Progress.hide()
        }
    }, [location])

    const onRouteChanged = () => {
        const taskEditId = null
        if (!_.includes(isFullPageLayoutRoutes, pathname)) {
            Progress.show()
        }
        window.scrollTo(0, 0)
        const currentPath = getLastPathUrl()
        const notCheckPermissions = ['login', 'jointeam', 'signup', 'access-denied']

        for (let i = 0; i < isFullPageLayoutRoutes.length; i++) {
            if (location.pathname === isFullPageLayoutRoutes[i]) {
                document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper')
                return
            } else {
                document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper')
            }
        }

        if (_.isNil(taskEditId)) {
            if (!_.includes(notCheckPermissions, currentPath)) {
                const isHasPermission = isHasPermissionForAction()
                if (isHasPermission === false) {
                    history.push('/access-denied')
                    return
                }
            }
        }
        if (!_.includes(isFullPageLayoutRoutes, pathname)) {
            Progress.hide()
        }
    }

    const isFullPageLayout = _.includes(isFullPageLayoutRoutes, pathname)
    const isNotify = !_.includes(isFullPageLayoutRoutes, pathname)

    return (
        <div className="container-scroller">
            <MuiThemeProvider theme={theme}>
                <Progress.Component />
                {!isFullPageLayout ? (
                    <SignalRProvider>
                        {isNotify ? <NotifySnackbar /> : ''}
                    </SignalRProvider>
                ) : ''}
                <CustomizedSnackbar />
                <ConfirmDeleteDialog />
                {isFullPageLayout ? '' : <Navbar />}
                <div className="container-fluid page-body-wrapper">
                    {isFullPageLayout ? '' : <Sidebar />}
                    <div className="main-panel">
                        <div className="content-wrapper flex-column flex-grow">
                            <AppRoutes />
                            {isFullPageLayout ? '' : <SettingsPanel />}
                        </div>
                        {/* {footerComponent} */}
                    </div>
                </div>
            </MuiThemeProvider>
        </div>
    )
}

export default withTranslation()(withRouter(App))