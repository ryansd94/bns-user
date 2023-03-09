import Grid from "@mui/material/Grid"
import React from 'react'
import { OverflowTip } from 'components/tooltip'
import { LinkControl } from 'components/link'
import { IconDelete } from "components/icon/icon"
import { useTranslation } from "react-i18next"

const FileHeader = (props) => {
    const { file, onDelete } = props
    const { t } = useTranslation()

    const genderTooltipContent = () => {
        return <LinkControl title={file.file.name} href={file.url} />
    }

    const renderTooltipRemoveIcon = () => {
        return <IconDelete onClick={() => onDelete(file.id)} className='delete-icon' />
    }

    const renderDeleteIcon = () => {
        return <OverflowTip disableHoverListener={false} className='delete-icon-root' value={t('Xóa file')} genderTooltipContent={() => renderTooltipRemoveIcon()} />
    }

    return (
        <Grid container style={{ width: '100%' }} alignItems={'center'}>
            <Grid style={{ width: 'calc(100% - 15px)' }} item>
                <OverflowTip value={file.file.name} genderTooltipContent={() => genderTooltipContent()} />
            </Grid>
            {renderDeleteIcon()}
        </Grid>
    )

}
export default FileHeader