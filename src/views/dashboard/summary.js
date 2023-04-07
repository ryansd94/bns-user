import React, { useState, useEffect, useCallback } from "react"
import { getByID } from "services"
import _ from "lodash"
import { baseUrl } from "configs"
import { getUserInfo } from "helpers"
import Grid from "@mui/material/Grid"
import { AvatarControl } from 'components/avatar'
import { Evariant } from "configs"
import { EditorControl } from 'components/editor'
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

const Summary = () => {
    const [project, setProject] = useState({})
    const user = getUserInfo()
    const { t } = useTranslation()

    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm({
    })

    useEffect(() => {
        let mounted = true
        const fetchProject = async () => {
            await getByID(baseUrl.jm_project, user?.setting?.projectSetting?.currentId).then((data) => {
                setProject(data && data.data)
            })
        }

        fetchProject()
        return () => { mounted = false }
    }, [])

    return <Grid container item xs className='no-wrap body-content' direction={'column'}>
        <Grid item container gap={2} alignItems={'center'} className='box-container containerNew'>
            <Grid item>
                <AvatarControl variant={Evariant.rounded} name={project?.name} />
            </Grid>
            <Grid item>
                {project?.name}
            </Grid>
        </Grid>
        <Grid item className="containerNew">
            <EditorControl label={t('Mô tả')} isShowAccordion={false} isBorder={false} control={control} isShowPlaceholder={false} name={'description'} readOnly={true} value={project?.description}/>
        </Grid>
    </Grid>

}
export default Summary