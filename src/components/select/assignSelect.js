import React from "react"
import MultiSelect from 'components/select/MultiSelect'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { AvatarControl } from "components/avatar"
import { ChipControl } from "components/chip"
import { ESize } from 'configs'
import { useTranslation } from "react-i18next"
import { UserItem } from 'components/user'
import Grid from "@mui/material/Grid"

const AssignSelect = (props) => {
    const { t } = useTranslation()
    const { } = props
    return <MultiSelect multiple={true}
        fullWidth={false}
        placeholder={t('Người nhận')}
        {...props}
        renderOption=
        {
            (props, option) => {
                return <Box {...props} ><UserItem {...option} /></Box>
            }
        }
        renderTags=
        {
            (option, props) => {
                return (<ChipControl
                    {...props}
                    variant="outlined"
                    label={option.fullName}
                    avatar={<AvatarControl size={ESize.miniSmall} name={option.fullName} />}
                />)
            }
        }>
    </MultiSelect>
}

export default AssignSelect