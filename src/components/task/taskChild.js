import React from "react"
import ButtonFuntion from 'components/button/ButtonFuntion'
import Grid from "@mui/material/Grid"
import { EButtonType } from 'configs/constants'
import { useTranslation } from "react-i18next"
import TaskChildListItem from './taskChildListItem'

const TaskChild = (props) => {
    const { t } = useTranslation()
    const { control, name } = props
    const onClick = () => {

    }

    return <Grid container xs={12} item spacing={2} direction="column">
        <Grid item style={{ width: '100%' }}>
            <ButtonFuntion label={t('Thêm công việc con')} isFloatLeft onClick={onClick} type={EButtonType.add} />
        </Grid>
        <Grid item style={{ width: '100%' }}>
            <TaskChildListItem control={control} name={name} />
        </Grid>
    </Grid>
}

export default TaskChild