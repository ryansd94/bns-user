import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"

const DropDownItem = (props) => {
  const { onClick, title, icon = null } = props
  return (
    <MenuItem onClick={onClick}>
      <Grid container item gap={1}>
        {icon ? (
          <Grid item display="flex" alignItems={"center"}>
            {icon}
          </Grid>
        ) : (
          ""
        )}
        <Grid item>{title}</Grid>
      </Grid>
    </MenuItem>
  )
}

export default DropDownItem
