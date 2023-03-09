import React from "react"
import Typography from '@mui/material/Typography'

const LabelControl = (props) => {
    const { label, required = false, className } = props
    return <Typography className={`label-title ${className}`}>{label}{required ? <span style={{ color: 'red' }}>*</span> : ''}</Typography>
}

export default LabelControl