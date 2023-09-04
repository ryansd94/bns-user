import React, { useState, useEffect, useCallback } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import _, { cloneDeep } from 'lodash'
import { TransferList } from 'components/transferList'
import { OverflowTip } from 'components/tooltip'
import GridData from "components/table/GridData"
import UserGrid from "views/user/UserGrid"
import ButtonFuntion from "components/button/ButtonFuntion"
import { EButtonType, baseUrl } from "configs"
import GridSelect from "components/select/gridSelect"
import eventEmitter from 'helpers/eventEmitter'

const MemberTab = React.memo((props) => {
    console.log('render member tab')
    let [usersSelected, setUsersSelected] = useState([])
    const { t } = useTranslation()

    useEffect(() => {
        if (!_.isEmpty(usersSelected)) {
            eventEmitter.emit('onRowDataChange', { rows: usersSelected, gridId: 'gridTeamUser' })
        }
    }, [usersSelected])

    const onSelectedRow = (rows, id) => {
        eventEmitter.emit('onSelectedRowChange', { rows, gridId: id })
    }

    const customFilterData = (data) => {
        if (!_.isEmpty(usersSelected)) {
            const usersSelectedIds = _.map(usersSelected, (x) => { return x.userId })
            data.data.items = _.filter(data && data.data && data.data.items, (x) => !_.includes(usersSelectedIds, x.userId))
        }
        return data
    }

    const onSelectedRowsChange = (rows) => {
        usersSelected = [...usersSelected, ...rows]
        setUsersSelected([...usersSelected])
    }

    const onDeleteClick = (id) => {
        _.remove(usersSelected, function (x) {
            return x.userId === id
        })
        setUsersSelected([...usersSelected])
    }

    const gridDataRender = () => {
        return <UserGrid
            customFilterData={customFilterData}
            dataUrl={`${baseUrl.jm_team}/users`}
            onSelectedRow={(rows) => onSelectedRow(rows, 'gridTeamUserAdd')}
            isShowActionButton={false}
            id={'gridTeamUserAdd'}
        />
    }

    const handleDeleteAll = () => {
        setUsersSelected([])
    }

    const renderGridSelect = useCallback(() => {
        return <GridSelect
            handleDeleteAll={handleDeleteAll}
            dataSelected={usersSelected}
            onConfirm={onSelectedRowsChange}
            gridDataId={'gridTeamUser'}
            id={'gridTeamUserAdd'}
            gridDataRender={gridDataRender}
        />
    }, [usersSelected])

    return <Grid container gap={2} direction='column'>
        <Grid item>
            {renderGridSelect()}
        </Grid>
        <Grid item>
            <UserGrid
                onCustomDeleteClick={onDeleteClick}
                onSelectedRow={(rows) => onSelectedRow(rows, 'gridTeamUser')}
                isShowListButton={false}
                localData={usersSelected}
                isGetDataFromServer={false}
                id={'gridTeamUser'}
            />
        </Grid>
    </Grid>
})

export default MemberTab
