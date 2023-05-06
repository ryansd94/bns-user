import { AccordionControl } from 'components/accordion'
import { useTranslation } from "react-i18next"
import ViewPermissionApplyUser from './viewPermissionApply/viewPermissionApplyUser'
import ViewPermissionApplyTeam from './viewPermissionApply/viewPermissionApplyTeam'
import Grid from "@mui/material/Grid"

const ViewPermissionApply = (props) => {
    console.log("render ViewPermissionApply")
    const { users = [], teams = [], control, setValue, getValues } = props
    const { t } = useTranslation()

    return <>
        <Grid container gap={2} className='no-wrap' direction='column'>
            <Grid item>
                <AccordionControl
                    isExpand={true}
                    title={t('Người dùng')}
                    name={'users'}
                    details={
                        <ViewPermissionApplyUser users={users} control={control} setValue={setValue} getValues={getValues} />
                    }
                />
            </Grid>
            <Grid item>
                <AccordionControl
                    isExpand={true}
                    title={t('Nhóm')}
                    name={'users'}
                    details={
                        <ViewPermissionApplyTeam teams={teams} control={control} setValue={setValue} getValues={getValues} />
                    }
                />
            </Grid>
        </Grid>
    </>
}
export default ViewPermissionApply