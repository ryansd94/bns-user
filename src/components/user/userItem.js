import React from "react"
import MultiSelect from 'components/select/MultiSelect'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { AvatarControl } from "components/avatar"
import { ChipControl } from "components/chip"
import { ESize } from 'configs'
import { useTranslation } from "react-i18next"

const UserItem = (props) => {

    return <Box className="select-item">
        <AvatarControl className="" size={ESize.miniSmall} name={props.name}></AvatarControl>
        <span key={props.id}>{props.name}</span>
    </Box>
}

export default UserItem