import React from "react"
import Typography from '@mui/material/Typography'

const LabelControl = (props) => {
    const { label, required = false } = props
    return <Typography className="label-title">{label}{required ? <span style={{ color: 'red' }}>*</span> : ''}</Typography>
}

export default LabelControl