import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import ButtonDetail from "components/button/ButtonDetail"
import { TabControl } from 'components/tab'
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import StatusTemplate from './statusTemplate'
import InfoTemplate from './info'
import ContentTemplate from './contentTemplate'
import { save2, getByID, get } from "services"
import { loading as loadingButton } from "stores/components/button"
import { openMessage } from "stores/components/snackbar"
import { baseUrl, message, EControlType, ERROR_CODE } from 'configs'
import { useParams } from 'react-router'
import {
  setLoadingPopup,
} from "stores/views/master"
import eventEmitter from 'helpers/eventEmitter'
import DiffTracker from "helpers/diffTracker"
import { getCustomResolverTab } from "helpers"
import _ from 'lodash'

const TemplateAdd = React.memo((props) => {
  console.log("render TemplateAdd")
  const { id } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [dataTemplate, setDataTemplate] = useState(null)
  const [statusData, setStatusData] = useState([])
  const [templateColumnData, setTemplateColumnData] = useState([])
  const tabId = 'templateInfoTab'

  const validationSchemaTab = [{
    tabIndex: 0,
    validation: {
      name: Yup.string().required(t(message.error.fieldNotEmpty))
    },
  }]

  const customResolver = async (values, context) => {
    const result = await getCustomResolverTab(values, context, validationSchemaTab)
    if (!_.isEmpty(result.errorTab)) {
      eventEmitter.emit('errorTabs', { errors: result.errorTab, id: tabId })
    }
    return result
  }

  const [disabled, setDisabled] = useState(true)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState,
  } = useForm({
    resolver: customResolver,
    defaultValues: {
      name: '',
      description: '',
      id: id,
      assign: [1],
      statusId: 0
    }
  })

  useEffect(() => {
    if (id) {
      fetchData()
    }
    fetchStatus()
    fetchTemplateColumn()
  }, [])

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
      setValue('status', [...data.data.status])
      // setListStatus(data.data.status)
    })
  }

  const onSubmit = async (data) => {
    // alert(JSON.stringify(data.status))
    // return
    let saveData = _.cloneDeep({ ...data })
    dispatch(loadingButton(true))
    if (!_.isNil(id)) {
      saveData = {}
      saveData.id = id
      saveData.changeFields = data.changeFields
    }
    const res = await save2(baseUrl.jm_template, saveData)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
    if (!_.isNil(id) && res.errorCode !== ERROR_CODE.error) {
      eventEmitter.emit('onChangeButtonDisabled', { buttonId: 'btn-template-save', disabled: true })
    }
  }

  const onValueChange = ({ value, name, type = EControlType.textField, isEntity = true }) => {
    DiffTracker.onValueChange({
      editData: id, value, name, type, getValues,
      setValue, eventEmitter, buttonId: 'btn-template-save', isEntity
    })
  }

  const renderTabInfo = () => {
    return <InfoTemplate onValueChange={onValueChange} id={id} dataTemplate={dataTemplate} control={control} />
  }

  const renderTabStatus = () => {
    return <StatusTemplate
      onValueChange={onValueChange}
      name={'status'}
      statusData={statusData}
      id={id}
      control={control}
      getValues={getValues}
      handleSubmit={handleSubmit}
      setValue={setValue} />
  }

  const renderView = () => {
    return <ContentTemplate
      onValueChange={(value, name) => onValueChange(value, name, EControlType.other, false)}
      name={'content'}
      id={id}
      formState={formState}
      templateColumnData={templateColumnData}
      statusData={statusData}
      dataTemplate={dataTemplate}
      control={control}
      setValue={setValue} />
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
              id='btn-template-save'
              disabled={!_.isNil(id) ? true : false}
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
