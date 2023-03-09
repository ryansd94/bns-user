import React from "react"
import Box from '@mui/material/Box'
import { AvatarControl } from "components/avatar"
import { ESize } from 'configs'

const UserItem = (props) => {

    return <Box className="select-item">
        <div>
            <AvatarControl size={ESize.miniSmall} {...props} name={props.fullName}></AvatarControl>
        </div>
        <span key={props.id}>{props.fullName}</span>
    </Box>
}

export default UserItem