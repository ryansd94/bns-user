import React, { useEffect, useState, useMemo, useCallback, useLayoutEffect } from "react"
import Grid from "@mui/material/Grid"
import ButtonDetail from "components/button/ButtonDetail"
import { TabControl } from 'components/tab'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import StatusTemplate from './statusTemplate'
import InfoTemplate from './info'
import Box from "@mui/material/Box"
import ContentTemplate from './contentTemplate'
import { save, getByID, get } from "services"
import { loading as loadingButton } from "stores/components/button"
import { openMessage } from "stores/components/snackbar"
import { baseUrl, message } from 'configs'
import { useParams } from 'react-router'
import {
  setLoadingPopup,
} from "stores/views/master"
import _ from 'lodash'

const TemplateAdd = React.memo((props) => {
  console.log("render TemplateAdd")
  const { id } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [dataTemplate, setDataTemplate] = useState(null)
  const [statusData, setStatusData] = useState([])
  const [templateColumnData, setTemplateColumnData] = useState([])
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  })
  const [disabled, setDisabled] = useState(true)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      id: id,
      assign: [1]
      // status: [{ id: uuidv4(), name: 'Mới', color: '#1976d2', isNew: true }]e 
    }
  })

  useEffect(() => {
    if (id) {
      fetchData()
    }
    fetchStatus()
    fetchTemplateColumn()
  }, [])

  useEffect(() => {
    if (id) {
      if (!_.isNil(formState) && !_.isEmpty(formState.dirtyFields)) {
        setDisabled(false)
      } else {
        setDisabled(true)
      }
    }
  }, [formState])

  const fetchStatus = async () => {
    await get(baseUrl.jm_status, {
      isGetAll: true
    }).then((data) => {
      if (data) {
        setStatusData(data.data.items)
      }
    })
  }

  const fetchTemplateColumn = async () => {
    await get(baseUrl.jm_taskcolumn, {
      isGetAll: true
    }).then((data) => {
      if (data) {
        setTemplateColumnData(data.data.items)
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
      setValue("content", JSON.parse(data.data.content))
      setValue("description", data.data.description)
      // setValue('status', data.data.status)
      // setListStatus(data.data.status)
    })
  }

  const onSubmit = async (data) => {
    // alert(JSON.stringify(data))
    // return
    dispatch(loadingButton(true))
    data.content = data.content
    const res = await save(baseUrl.jm_template, data)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
  }

  const renderTabInfo = () => {
    return <InfoTemplate dataTemplate={dataTemplate} control={control} />
  }

  const onTemplateChange = (isChange) => {
    if (isChange === true) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  const renderTabStatus = () => {
    return <StatusTemplate statusData={statusData} id={id} control={control} getValues={getValues} handleSubmit={handleSubmit} setValue={setValue} listStatus={(dataTemplate && dataTemplate.status) || []} />
  }

  const renderView = () => {
    return <ContentTemplate name={'content'} onTemplateChange={onTemplateChange} formState={formState} templateColumnData={templateColumnData} statusData={statusData} dataTemplate={dataTemplate} control={control} setValue={setValue} />
  }

  const getTabItems = () => {
    const data = [
      {
        label: t('Basic information'),
        Content: renderTabInfo()
      },
      {
        label: t('Status list'),
        Content: renderTabStatus()
      },
      {
        label: t('Display'),
        Content: renderView()
      }
    ]
    return data
  }

  return (
    <div className="body-content">
      <div className="body-content-item of-hidden flex-container ">
        <Grid className="of-hidden flex-column no-wrap" container gap={2}>
          <Grid item xs={12} className='flex-basis-auto'>
            <ButtonDetail
              disabled={!_.isNil(id) ? disabled : false}
              onClick={handleSubmit(onSubmit)} type={"Save"} />
          </Grid>
          <div className="containerNew">
            <Grid item container direction='column' xs={12} className="flex-basis-auto of-hidden">
              <TabControl tabItems={getTabItems()} />
            </Grid>
          </div>
        </Grid>
      </div>
    </div>
  )
})

export default TemplateAdd
