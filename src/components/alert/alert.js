import * as React from 'react'
import MuiAlert from '@mui/material/Alert'
import { EAlertType } from 'configs/enums'
import _ from 'lodash'

const Alert = (props) => {
    const { type = EAlertType.error, message } = props
    return (
        !_.isEmpty(message) ? <MuiAlert severity={type}>{message}</MuiAlert> : ''
    )
}
export default Alert