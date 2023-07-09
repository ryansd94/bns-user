import MuiAlert from '@mui/material/Alert'
import { EAlertType } from 'configs/enums'
import _ from 'lodash'

const Alert = (props) => {
    const { type = EAlertType.error, message, className } = props
    return (
        !_.isEmpty(message) ? <MuiAlert className={className} severity={type}>{message}</MuiAlert> : ''
    )
}
export default Alert