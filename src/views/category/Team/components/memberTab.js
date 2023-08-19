import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import { TransferList } from 'components/transferList'
import { OverflowTip } from 'components/tooltip'
import GridData from "components/table/GridData"

const MemberTab = (props) => {
    const { control, setValue, getValues, users, onValueChange } = props
    const { t } = useTranslation()

    const renderTooltipContent = (data) => {
        return <Grid key={data.id} item container gap={1} direction='column'>
            <Grid item>
                <span>{data.fullName}</span>
            </Grid>
            <Grid item style={{ width: '100%' }} className='italic of-hidden ellipsis'>
                <span>{data.email}</span>
            </Grid>
        </Grid>
    }

    const renderUserItem = (data) => {
        return <OverflowTip key={data.id} renderTooltipContent={() => renderTooltipContent(data)} value={data.fullName} />
    }

    return <Grid container gap={2} direction='column' className='no-wrap'>
        <Grid item xs>
            {/* <TransferList
                renderItem={(data) => renderUserItem(data)}
                items={users}
                control={control}
                leftTitle={t('Users do not have group')}
                rightTitle={t('Users in group')}
                setValueData={setValue}
                onChange={onValueChange}
                getValueData={getValues}
                name={'members'} /> */}
            <GridData
                isGetDataFromServer={false}
            />
        </Grid>
    </Grid>
}

export default MemberTab
