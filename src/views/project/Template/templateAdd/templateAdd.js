import React, { useEffect, useState, useMemo, useCallback } from "react"

import Popup from "components/popup/Popup"
import Grid from "@mui/material/Grid"
import ButtonDetail from "components/button/ButtonDetail"

import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import StatusTemplate from './statusTemplate'
import InfoTemplate from './info'
import Box from "@mui/material/Box"
import { v4 as uuidv4 } from 'uuid'
import { AccordionControl } from 'components/accordion'
import ContentTemplate from './contentTemplate'
import { save } from "services"
import { loading as loadingButton } from "stores/components/button"
import { openMessage } from "stores/components/snackbar"
import { baseUrl } from 'configs'
import { message } from "configs"

const TemplateAdd = React.memo((props) => {
  console.log("render TemplateAdd")
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [listStatus, setListStatus] = useState([])
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  })


  useEffect(() => {
    reset()
  }, [])


  useEffect(() => {
    const status = getListStatus()
    setListStatus([...status])
  }, [])

  const getListStatus = () => {
    return [{ id: uuidv4(), name: 'Mới', color: '#1976d2' }]
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: '', description: '' }
  })


  const onSubmit = async (data) => {
    //console.log(JSON.stringify(data))
    dispatch(loadingButton(true))
    data.content = JSON.stringify(data.content)
    const res = await save(baseUrl.jm_template, data)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
  }

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={6}  >
        <AccordionControl
          isExpand={true}
          title="Thông tin cơ bản"
          name="info"
          details={
            <Box className="box-container">
              <Grid container direction="column" >
                <Grid item xs={12}  >
                  <InfoTemplate control={control} />
                </Grid>
              </Grid>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={6}  >
        <AccordionControl
          isExpand={true}
          title="Danh sách trạng thái"
          name="status"
          details={
            <Box className="box-container">
              <Grid container direction="column" >
                <Grid item xs={12}  >
                  <StatusTemplate control={control} setValue={setValue} listStatus={listStatus} />
                </Grid>
              </Grid>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12}  >
        <AccordionControl
          isExpand={true}
          title="Giao diện"
          name="template"
          details={
            <Box className="box-container">
              <Grid container direction="column" >
                <Grid item xs={12}  >
                  <ContentTemplate control={control} setValue={setValue} />
                </Grid>
              </Grid>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12}  >
        <ButtonDetail
          onClick={handleSubmit(onSubmit)} type={"Save"} />
      </Grid>
    </Grid>
  )
})

export default TemplateAdd
