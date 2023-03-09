import React from "react"
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import Grid from "@mui/material/Grid"
import { OverflowTip } from 'components/tooltip'
import { LabelControl } from 'components/label'
import { useTranslation } from "react-i18next"
import { IconDelete } from "components/icon/icon"

const CommentDeleteLabel = (props) => {
    const { icon, name, color, id } = props
    const { t } = useTranslation()

    const genderTooltipContent = () => {
        return <span style={{ textOverflow: 'ellipsis' }}>{name}</span>
    }

    return (
        <Grid className="label-icon-control-container" item container columnSpacing={2}>
            <Grid item>
                <IconDelete className="label-title" />
            </Grid>
            <Grid item xs={12}>
                <LabelControl label={t('Bình luận đã xóa')} />
            </Grid>
        </Grid>
    )
}

export default CommentDeleteLabel