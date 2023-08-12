import Typography from '@mui/material/Typography'
import LabelRequired from './labelRequired'

const LabelControl = (props) => {
    const { label, required = false, className } = props
    return <Typography className={`label-title ${className}`}>{label}{required ? <LabelRequired /> : ''}</Typography>
}

export default LabelControl