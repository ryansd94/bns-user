
import Grid from "@mui/material/Grid"
import MenuItem from '@mui/material/MenuItem'

const DropDownItem = (props) => {
    const { onClick, title, icon = null } = props
    return <MenuItem onClick={onClick}>
        <Grid container columnSpacing={2}>
            {icon ? <Grid width={'30px'} item display='flex' alignItems={'center'}>
                {icon}
            </Grid> : ''}
            <Grid item>{title}</Grid>
        </Grid>
    </MenuItem>
}

export default DropDownItem