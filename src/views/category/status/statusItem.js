
import Typography from '@mui/material/Typography'
import { IconCricle } from "components/icon/icon"
import Box from "@mui/material/Box"
import React, { useEffect, useState } from "react"

const StatusItem = React.memo((props) => {
    const { status } = props
    return <Box className="select-item">
        <IconCricle style={{ color: status && status.color }} />
        <Typography key={status && status.id}>{status && status.name}</Typography>
    </Box>
})
export default StatusItem