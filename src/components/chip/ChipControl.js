import * as React from "react"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
  },
  stackRoot: {
  }
}))

const ChipControl = (props) => {
  const classes = useStyles()
  const { parentClassName, classNameContent } = props
  return (
    <Stack className={parentClassName ? parentClassName : classes.stackRoot} direction="row">
      <Chip
        {...props}
        className={classNameContent ? classNameContent : "chip-container"}
        variant="outlined">
      </Chip>
    </Stack>
  )
}

export default ChipControl