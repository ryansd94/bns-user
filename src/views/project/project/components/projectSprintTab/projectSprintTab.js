import { useState, useEffect } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import { EButtonType, EButtonIconType, EControlType, ERowStatus } from "configs"
import ButtonFuntion from "components/button/ButtonFuntion"
import Popup from "components/popup/Popup"
import ProjectSprintTabPopup from "./projectSprintTabPopup"
import { formatDate, deepFind } from "helpers/commonFunction"
import ButtonIcon from "components/button/ButtonIcon"
import { Controller } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'

const ProjectSprintTab = (props) => {
    console.log('render ProjectSprintTab')
    const { control, getValues, setValue, name, onValueChange } = props
    const { t } = useTranslation()
    const [dataPopup, setDataPopup] = useState({ open: false })
    const [activeId, setActiveId] = useState('')

    const onEditClick = (item) => {
        setDataPopup({ open: true, ...item })
    }

    const onAddChildClick = (item) => {
        setActiveId(item.id)
        setDataPopup({ open: true })
    }

    const renderHeader = () => {
        return <Grid item container gap={2} className="sprint-item-header">
            <Grid item xs={6}>{t("Sprint name")}</Grid>
            <Grid item xs>{t("Start date")}</Grid>
            <Grid item xs>{t("End date")}</Grid>
        </Grid>
    }

    const renderSprintItem = (item, isChildItem, childLevel = 0) => {
        let style = {}
        if (isChildItem === true) {
            style = { paddingLeft: childLevel * 40 }
        }
        return <Grid key={item.id} item container gap={2} className="sprint-item-container">
            <Grid item xs={6} style={style}>{item.name}</Grid>
            <Grid item xs>{formatDate(item.startDate)}</Grid>
            <Grid item xs>{formatDate(item.endDate)}</Grid>
            <div className="sprint-item-action">
                <Grid item gap={2} container >
                    <Grid xs item>
                        <ButtonIcon title={t('Add child sprint')} onClick={() => onAddChildClick(item)} type={EButtonIconType.add} />
                    </Grid>
                    <Grid xs item>
                        <ButtonIcon onClick={() => onEditClick(item)} type={EButtonIconType.edit} />
                    </Grid>
                </Grid>
            </div>
        </Grid>
    }

    const renderItems = (items, isChildItem = false, childLevel = 0) => {
        if (isChildItem === true) {
            childLevel = childLevel + 1
        }
        return _.map(items, (item) => {
            return <Grid className="sprint-item-div" container direction={'column'} key={item.id}>{renderSprintItem(item, isChildItem, childLevel)}{!_.isNil(item.childs) && !_.isEmpty(item.childs) ? renderItems(item.childs, true, childLevel) : ''}</Grid>
            // return <>{renderSprintItem(item, isChildItem, childLevel)}{!_.isNil(item.childs) && !_.isEmpty(item.childs) ? renderItems(item.childs, true, childLevel) : ''}</>
        })
    }

    const onSubmit = (data) => {
        let items = _.cloneDeep(getValues(name))
        if (data.rowStatus === ERowStatus.addNew) {
            if (!_.isEmpty(activeId)) {
                var sprint = deepFind(items, function (obj) {
                    return obj.id === activeId
                }, 'childs')
                if (!_.isNil(sprint)) {
                    let childs = sprint.childs
                    if (_.isNil(childs)) {
                        sprint.childs = [{ ...data, id: uuidv4() }]
                    } else {
                        childs.push({ ...data, id: uuidv4() })
                    }
                }
            } else {
                items.push(data)
            }
        } else {
            var sprint = deepFind(items, function (obj) {
                return obj.id === data.id
            }, 'childs')
            if (!_.isNil(sprint)) {
                sprint.name = data.name
                sprint.startDate = data.startDate
                sprint.endDate = data.endDate
                sprint.rowStatus = data.rowStatus
            }
        }
        onValueChange && onValueChange([...items], name, EControlType.listObject)
        setValue(name, [...items])
        // setOpenPopup(false)
    }

    const onAddSprint = () => {
        setDataPopup({ open: true })
    }

    const handleClose = () => {
        setDataPopup({ open: false })
    }

    return <Controller
        render={({ field, fieldState: { error } }) =>
            <>
                <Grid container gap={2} direction='column'>
                    <Grid item xs>
                        <ButtonFuntion onClick={onAddSprint} isFloatLeft={true} type={EButtonType.add} label={t('Add sprint')} />
                    </Grid>
                    <Grid item container direction='column' className="sprint-list-content">
                        {renderHeader()}
                        {!_.isEmpty(field.value) ? <Grid item xs container className="sprint-container">
                            {renderItems(field.value)}
                        </Grid> : ''}
                    </Grid>
                </Grid>
                <ProjectSprintTabPopup
                    handleClose={handleClose}
                    data={dataPopup}
                    onSubmit={onSubmit}
                />
            </>
        }
        name={name}
        control={control}
    />
}

export default ProjectSprintTab