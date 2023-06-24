import React, { useState, useEffect } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import project from 'assets/images/project-manager.jpg'
import ProjectCreateContent from './projectCreateContent'
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { message } from "configs"
import ButtonDetail from "components/button/ButtonDetail"
import { EButtonDetailType } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { useDispatch } from "react-redux"
import { ERROR_CODE, baseUrl } from "configs"
import { openMessage } from "stores/components/snackbar"
import {
    setReload,
} from "stores/views/master"
import { save } from "services"
import _ from 'lodash'
import { getCustomResolverTab } from "helpers"

const ProjectEmptyView = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [errorTabs, setErrorTabs] = useState([])
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
            setErrorTabs(result.errorTab)
        }
        return result
    }

    const {
        control,
        handleSubmit,
        getValues,
        setValue
    } = useForm({
        resolver: customResolver
    })

    const onSubmit = async (data) => {
        dispatch(loadingButton(true))
        var postData = data
        const res = await save(baseUrl.jm_project, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }

    return <Grid container item xs={12} gap={2} direction='row' className="no-wrap">
        <Grid item xs={6}><img style={{ width: '100%' }} src={project}></img></Grid>
        <Grid item xs container className="containerNew no-wrap" direction={'column'}>
            <Grid item className="of-overlay">
                <Grid item xs className="box-container">
                    <h1>{t('To get started, create your first project!')}</h1>
                    <Grid item xs>
                        <ProjectCreateContent getValues={getValues} setValue={setValue} errorTabs={errorTabs} control={control} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className="box-container">
                <ButtonDetail onClick={handleSubmit(onSubmit)} isFloatRight={true} type={EButtonDetailType.save} />
            </Grid>
        </Grid>
    </Grid >
}

export default ProjectEmptyView