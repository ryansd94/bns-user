import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import Popup from "components/popup/Popup"
import Grid from "@mui/material/Grid"
import MultiSelectText from "components/select/MultiSelectText"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { close } from "components/popup/popupSlice"
import { openMessage } from "stores/components/snackbar"
import {
  setReload,
  setEditData,
} from "stores/views/master"
import { post } from "services"
import { ERROR_CODE, baseUrl, EControlType, EWidth, message } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { GridControl } from "components/table"
import { getCustomResolverFormArray } from "helpers"
import { v4 as uuidv4 } from 'uuid'
import eventEmitter from "helpers/eventEmitter"
import axios from 'axios'
import { get } from "services"

const UserPopup = React.memo((props) => {
  console.log('UserPopup')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cancelToken = useRef(null)
  const [dataTeam, setDataTeam] = useState([])


  const fetchDataTeam = async (cancelToken) => {
    await get(baseUrl.jm_team, {
      draw: 0,
      start: 0,
      length: 10000,
    }, cancelToken).then((data) => {
      setDataTeam(data && data.data && data.data.items)
    })
  }

  useEffect(async () => {
    cancelToken.current = new axios.CancelToken.source()
    fetchDataTeam(cancelToken)

    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel()
      }
    }
  }, [])
  // const validationSchema = Yup.object().shape({
  //   users: Yup.array().of(
  //     Yup.object().shape({
  //       email: Yup.string().required(t(message.error.fieldNotEmpty)),
  //       firstName: Yup.string().required(t(message.error.fieldNotEmpty)),
  //       lastName: Yup.string().required(t(message.error.fieldNotEmpty))
  //     }))
  // })

  const validationSchema = {
    users: Yup.array().of(
      Yup.object().shape({
        email: Yup.string().required(t(message.error.fieldNotEmpty)),
        firstName: Yup.string().required(t(message.error.fieldNotEmpty)),
        lastName: Yup.string().required(t(message.error.fieldNotEmpty))
      }))
  }

  const customResolver = async (values, context) => {
    const result = await getCustomResolverFormArray(values, validationSchema)
    if (!_.isEmpty(result?.errors)) {
      eventEmitter.emit('onErrorFormArray', result?.errors)
    } else {
      eventEmitter.emit('onErrorFormArray', null)
    }
    return result
  }

  const defaultValues = {
    users: [{ id: uuidv4() }]
  }

  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: defaultValues,
    resolver: customResolver
    // resolver: yupResolver(validationSchema)
  })

  const columns = [
    {
      title: t('Email'),
      name: 'email',
      type: EControlType.textField,
      required: true,
      width: 200
    },
    {
      title: t('First name'),
      name: 'firstName',
      type: EControlType.textField,
      required: true,
      width: 100
    },
    {
      title: t('Last name'),
      name: 'lastName',
      type: EControlType.textField,
      required: true,
      width: 100
    },
    {
      title: t('Team'),
      name: 'team',
      type: EControlType.select,
      width: 100,
      options: dataTeam,
      isSelectedDefault: false,
      onRefersh: async () => {
        await fetchDataTeam()
      }
    },
    // {
    //   title: t('Position'),
    //   name: 'position',
    //   type: EControlType.select,
    //   width: 100,
    //   options: []
    // }
  ]

  const onSubmit = async (data) => {
    // alert(JSON.stringify(data))
    // return
    dispatch(loadingButton(true))
    const res = await post(`${baseUrl.jm_user}/add-user`, data)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setEditData(null))
      dispatch(setReload())
      dispatch(close())
    }
  }

  function ModalBody() {
    return <GridControl id='gridUser' addButtonLabel={t('Add new user')} columns={columns} control={control} name="users" />
  }
  return (
    <div>
      <Popup
        reset={reset}
        ModalBody={ModalBody}
        widthSize={EWidth.md}
        onSave={handleSubmit(onSubmit)}
      />
    </div>
  )
})

export default UserPopup
