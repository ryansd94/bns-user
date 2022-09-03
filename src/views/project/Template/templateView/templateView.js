import React, { useEffect, useState, useMemo, useCallback, useLayoutEffect } from "react"

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
import { save, getByID, get } from "services"
import { loading as loadingButton } from "stores/components/button"
import { openMessage } from "stores/components/snackbar"
import { baseUrl, message } from 'configs'
import { useParams } from 'react-router'
import TextInput from "components/input/TextInput"
import {
  setLoadingPopup,
} from "stores/views/master"

const TemplateAdd = React.memo((props) => {
  console.log("render TemplateAdd")
  const { id } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [dataTemplate, setDataTemplate] = useState([])
  const [statusData, setStatusData] = useState([])
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      id: '',
      // status: [{ id: uuidv4(), name: 'Mới', color: '#1976d2', isNew: true }]e 
    }
  })

  useEffect(() => {
    // reset()
    if (id) {
      fetchData()
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    await get(baseUrl.jm_status, {
      draw: 0,
      start: 0,
      length: 100,
    }).then((data) => {
      if (data) {
        setStatusData(data.data.items)
      }
    })
  }


  const fetchData = async () => {
    dispatch(setLoadingPopup(true))
    // return
    await getByID(baseUrl.jm_template, id).then((data) => {
      dispatch(setLoadingPopup(false))
      setDataTemplate(data.data)
      setValue("name", data.data.name)
      setValue("id", data.data.id)
      setValue("description", data.data.description)
      // setValue('status', data.data.status)
      // setListStatus(data.data.status)
    })
  }

  const onSubmit = async (data) => {
    // alert(JSON.stringify(data))
    // return
    dispatch(loadingButton(true))
    data.content = JSON.stringify(data.content)
    const res = await save(baseUrl.jm_template, data)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
  }

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={12}  >
        <ButtonDetail
          onClick={handleSubmit(onSubmit)} type={"Save"} />
      </Grid>
      <Grid item xs={6}  >
        <AccordionControl
          isExpand={true}
          title="Thông tin cơ bản"
          name="info"
          details={
            <Box className="box-container">
              <Grid container direction="column" >
                <Grid item xs={12}  >
                  <InfoTemplate dataTemplate={dataTemplate} control={control} />
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
                  <StatusTemplate statusData={statusData} id={id} control={control} getValues={getValues} handleSubmit={handleSubmit} setValue={setValue} listStatus={(dataTemplate && dataTemplate.status) || []} />
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
                  <ContentTemplate statusData={statusData} dataTemplate={dataTemplate} control={control} setValue={setValue} />
                </Grid>
              </Grid>
            </Box>
          }
        />
      </Grid>
    </Grid>
  )
})

export default TemplateAdd
