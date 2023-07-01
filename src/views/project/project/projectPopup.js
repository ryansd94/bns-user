import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { open, change_title } from "components/popup/popupSlice"
import { openMessage } from "stores/components/snackbar"
import {
    setLoadingPopup,
    setReload,
} from "stores/views/master"
import { getByID, save2 } from "services"
import { ERROR_CODE, baseUrl, EProjectTypeOption, EControlType } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message, EWidth } from "configs"
import _ from 'lodash'
import ProjectCreateContent from './projectCreateContent'
import { getCustomResolverTab } from "helpers"
import eventEmitter from 'helpers/eventEmitter'
import { get } from "services"

const ProjectPopup = React.memo((props) => {
    console.log('render ProjectPopup')
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const editData = useSelector((state) => state.master.editData)
    const [members, setMembers] = useState({})
    const [users, setUsers] = useState([])
    const [teams, setTeams] = useState([])
    const [type, setType] = useState(EProjectTypeOption.basic)

    useEffect(() => {
        let mounted = true
        const getUsers = async () => {
            await get(`${baseUrl.sys_viewPermission}/users`, { isGetAll: true }).then((data) => {
                setUsers(data && data.data && data.data.items)
            })
        }
        const getTeams = async () => {
            await get(`${baseUrl.sys_viewPermission}/teams`, { isGetAll: true }).then((data) => {
                setTeams(data && data.data && data.data.items)
            })
        }
        getUsers()
        getTeams()
        return () => { mounted = false }
    }, [])

    const validationSchemaTab = [{
        tabIndex: 0,
        validation: {
            name: Yup.string().required(t(message.error.fieldNotEmpty)),
            code: Yup.string().required(t(message.error.fieldNotEmpty))
        },
    }]

    const customResolver = async (values, context) => {
        const result = await getCustomResolverTab(values, context, validationSchemaTab)
        if (!_.isEmpty(result.errorTab)) {
            eventEmitter.emit('errorTabs', result.errorTab)
        }
        return result
    }

    const defaultValues = {
        name: "",
        description: "",
        type: EProjectTypeOption.basic,
        sprints: []
    }

    useEffect(() => {
        if (editData) {
            onEditClick()
        }
    }, [editData])

    const onEditClick = async () => {
        if (!editData) return
        dispatch(change_title(t("Edit project")))
        dispatch(setLoadingPopup(true))
        await getByID(baseUrl.jm_project, editData).then((res) => {
            for (let key in res.data) {
                setValue(key, res.data[key])
            }
            setMembers({ teamsApplyIds: res.data.teams, usersApplyIds: res.data.members })
            setType(res.data.type)
            dispatch(setLoadingPopup(false))
            dispatch(open())
        })
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        register
    } = useForm({
        resolver: customResolver,
        defaultValues: defaultValues,
    })

    const onSubmit = async (data) => {
        console.log(data)
        dispatch(loadingButton(true))
        var postData = data
        if (!_.isEmpty(editData)) postData.id = editData
        const res = await save2(baseUrl.jm_project, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }

    const onValueChange = (value, name, type = EControlType.textField) => {
        if (_.isNil(editData)) return
        let changeFields = getValues('changeFields') || []
        let field = _.find(changeFields, (x) => x.key === name)
        let originValue = null
        let isDiffernt = false

        if (_.isNil(field)) {
            originValue = _.sortBy(getValues(name))
        } else {
            originValue = _.sortBy(field.originValue)
        }

        if (_.isNumber(originValue) || _.isNumber(value)) {
            if (originValue != value) {
                isDiffernt = true
            }
        } else if (type === EControlType.transferList) {
            if (_.isNil(value)) {
                value = []
            }
            if (_.isNil(originValue)) {
                originValue = []
            }
            if (!_.isEqual(originValue, _.sortBy(value))) {
                isDiffernt = true
            }
        } else if (!_.isEqual(originValue, value)) {
            isDiffernt = true
        }

        if (isDiffernt === true) {
            let newValue = value
            if (type === EControlType.transferList) {
                let deleteValues = _.difference(originValue, value)
                let addValues = _.difference(value, originValue)
                newValue = { deleteValues, addValues }
            }
            if (_.isNil(field)) {
                changeFields.push({ key: name, value: newValue, originValue, type })
            } else {
                field.value = newValue
            }
        } else {
            if (!_.isNil(field)) {
                changeFields = _.filter(changeFields, (x) => x.key !== name)
            }
        }
        setValue('changeFields', changeFields)
        console.log(changeFields)
        eventEmitter.emit('onChangeDisabled', !_.isEmpty(changeFields) ? false : true)
    }

    function ModalBody() {
        return <ProjectCreateContent
            members={members}
            onValueChange={onValueChange}
            register={register}
            type={_.isNil(editData) ? EProjectTypeOption.basic : type}
            control={control}
            getValues={getValues}
            users={users}
            teams={teams}
            setValue={setValue} />
    }

    return (
        <div>
            <Popup
                disabledSave={!_.isEmpty(editData) ? true : false}
                widthSize={EWidth.lg}
                reset={reset}
                ModalBody={ModalBody}
                onSave={handleSubmit(onSubmit)}
            />
        </div>
    )
})

export default ProjectPopup
