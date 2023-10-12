import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import queryString from "query-string"
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import InputAdornment from "@mui/material/InputAdornment"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import IconButton from "@mui/material/IconButton"
import * as Yup from "yup"
import Alert from "@mui/material/Alert"
import { validateTokenSignup, registerGoogle, checkOrganization } from "services"
import { ERROR_CODE, message } from "configs"
import {
  setTokenLoginSucceeded,
} from "helpers"
import PasswordChecklist from "react-password-checklist"
import Spinner from "components/shared/Spinner"
import SelectControl from "components/select/SelectControl"
import { setUserSetting } from "stores/views/master"
import { useDispatch } from "react-redux"
import { Finish } from "./components"
import { StepperControl } from "components/stepper"
import eventEmitter from 'helpers/eventEmitter'

export default function Signup() {
  const { search } = useLocation()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { token, googleToken } = queryString.parse(search)
  const steps = [{ label: t('Informations'), name: 'tabInformation' }, { label: t('Account'), name: 'tabAccount' }, { label: t('Finish'), name: 'tabFinish' }]
  const [error, setErrorToken] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpenScaleSelect, setIsOpenScaleSelect] = useState(false)
  const [passwordAgain, setPasswordAgain] = useState("")
  const [companyName, setCompanyName] = useState(t("Personal name"))
  const [passwordIsvalid, setPasswordIsvalid] = useState(false)
  const [tokenIsvalid, setTokenIsvalid] = useState(true)
  const id = 'signup'
  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [activeStep, setActiveStep] = React.useState(0)
  const optionUserType = [
    { id: 1, name: t('Individual') },
    { id: 2, name: t('Team') },
    { id: 3, name: t('Company') },
    { id: 4, name: t('Organization') }
  ]

  const optionScale = [
    { id: 1, name: t('1 - 50 persons') },
    { id: 2, name: t('50 - 200 persons') },
    { id: 3, name: t('200 - 1000 persons') },
    { id: 4, name: t('1000+ persons') }
  ]

  const validationSchema = (context) => {
    if (context.activeStep === 0) {
      return Yup.object().shape({
        companyName: Yup.string().required(t(message.error.fieldNotEmpty)),
        organization: Yup.string()
          .required(t(message.error.fieldNotEmpty))
          .min(3, 'Domain name must contain at least 3 characters')
          .max(30, 'Domain names can only contain up to 30 characters')
          .matches(/^[a-zA-Z0-9_]*$/, 'Domain names contain only lowercase letters, uppercase letters, or numbers'),
      })
    } else if (context.activeStep === 1) {
      return Yup.object().shape({
        fullName: Yup.string().required('Full name is required'),
      })
    }
  }

  const customResolver = async (values, context) => {
    const rs = await validationSchema(context).validate(values, { abortEarly: false })
      .then(() => {
        return {
          values,
          errors: {},
        }
      })
      .catch((validationErrors) => {
        // Dữ liệu không hợp lệ, cập nhật danh sách lỗi
        const formattedErrors = validationErrors.inner.reduce((acc, error) => {
          acc[error.path] = { message: error.message }
          return acc
        }, {})

        return {
          values,
          errors: formattedErrors,
        }
      })

    return rs
  }

  const defaultValues = {
    fullName: "",
    password: "",
    confirmPassword: "",
    organization: "",
    userType: 1
  }

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: customResolver,
    context: { activeStep },
    mode: 'onChange',
    defaultValues: defaultValues,
  })

  const handleNext = async (data, activeStep) => {
    if (activeStep === 0) {
      eventEmitter.emit('onChangeButtonLoading', { buttonId: id, loading: true })
      const res = await checkOrganization({ domain: getValues('organization') })
      eventEmitter.emit('onChangeButtonLoading', { buttonId: id, loading: false })
      if (res.data.errorCode == ERROR_CODE.success) {
        if (res.data.data.isValid === true) {
          setActiveStep(activeStep + 1)
          return true
        } else {
          setError('organization', {
            type: 'manual',
            message: t('The domain name already exists'),
          })
        }
      }
    } else if (activeStep === 1) {
      if (passwordIsvalid === true) {
        await onSubmit(data)
        return true
      }
    }
  }

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace)
  }

  const validateToken = async (token) => {
    const res = await validateTokenSignup({ token: token })
    if (res.data.errorCode === ERROR_CODE.tokenNotValid) {
      setErrorToken(t('Invalid token'))
      setTokenIsvalid(false)
    }
    setLoading(false)
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  useEffect(() => {
    if (token) {
      const data = replaceAll(token, " ", "+")
      validateToken(data)
    }
  }, [])

  useEffect(() => {
  }, [activeStep])

  const onSubmit = async (data) => {
    // alert(passwordIsvalid)
    // return
    if (!passwordIsvalid) return

    eventEmitter.emit('onChangeButtonLoading', { buttonId: id, loading: true })
    data.token = token
    data.googleToken = replaceAll(googleToken, " ", "+")
    const res = await registerGoogle(data)
    const dataResult = res && res.data
    if (dataResult.errorCode == ERROR_CODE.success) {
      const userInfo = dataResult.data
      const token = {
        accessToken: userInfo.token,
        refreshToken: userInfo.token,
        shopIndex: userInfo.shopIndex,
      }
      const user = { ...userInfo, isAdmin: true, acceptScreen: [] }
      dispatch(setUserSetting({ ...user }))
      setTokenLoginSucceeded({ token, user })
      eventEmitter.emit('onChangeButtonLoading', { buttonId: id, loading: false })
    }
  }

  const onChangePasswordAgain = ({ value }) => {
    setPasswordAgain(value)
  }

  const onChangePassword = ({ value }) => {
    setPassword(value)
  }

  const onUserTypeChange = (value) => {
    switch (value) {
      case 1:
        setCompanyName(t('Personal name'))
        setIsOpenScaleSelect(false)
        break
      case 2:
        setCompanyName(t('Team name'))
        setIsOpenScaleSelect(true)
        break
      case 3:
        setCompanyName(t('Company name'))
        setIsOpenScaleSelect(true)
        break
      case 4:
        setCompanyName(t('Organization name'))
        setIsOpenScaleSelect(true)
        break
    }
  }

  const handleFormSubmit = async (activeStep) => {
    setActiveStep(activeStep)
    let returnValue
    await handleSubmit(async (data) => { returnValue = await handleNext(data, activeStep) })()
    return returnValue
  }

  const renderTabAccount = () => {
    return <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container rowSpacing={2}>
        <Grid container gap={2} direction='column'>
          <Grid item xs>
            <span className="text-note">
              {t("Enter the first and last name you want to display")}
            </span>
            <TextInput
              autoFocus={true}
              required={true}
              control={control}
              label={t("First name")}
              name="firstName"
            />
            <TextInput
              autoFocus={true}
              required={true}
              control={control}
              label={t("First name")}
              name="lastName"
            />
          </Grid>
          <Grid item xs>
            <TextInput
              required={true}
              control={control}
              label={t("Password")}
              name="password"
              type={values.showPassword === true ? "text" : "password"}
              onChange={onChangePassword}
              inputProps={{
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs>
            <TextInput
              required={true}
              control={control}
              label={t("Re-enter password")}
              name="confirmPassword"
              type={"password"}
              inputProps={{
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                }
              }}
              onChange={onChangePasswordAgain}
            />
          </Grid>
          <Grid item xs>
            <PasswordChecklist
              rules={[
                "notEmpty",
                "minLength",
                "number",
                "lowercase",
                "match",
              ]}
              minLength={6}
              value={password}
              valueAgain={passwordAgain}
              onChange={(isValid) => setPasswordIsvalid(isValid)}
              messages={{
                minLength: t("Password minimum 6 characters"),
                notEmpty: t("Password and re-enter password must not be empty"),
                number: t("Password must contain at least 1 digit"),
                lowercase: t("Password must contain at least 1 character"),
                match: t("Re-enter password does not match"),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  }

  const renderTabInfo = () => {
    return <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container rowSpacing={2}>
        <Grid container gap={2} direction='column'>
          <Grid item gap={2} container xs direction={'column'}>
            {/* <Grid item xs>
                <span className="text-note">
                  {`${t("organization domain name")}, Ex: ${process.env.REACT_APP_DOMAIN}/abc`}
                </span>
              </Grid> */}
            <Grid item xs>
              <TextInput
                inputProps={{
                  startAdornment: <InputAdornment position="start">{`${process.env.REACT_APP_DOMAIN}/`}</InputAdornment>,
                }}
                autoFocus={true}
                label={`${t("organization domain name")}, Ex: ${process.env.REACT_APP_DOMAIN}/abc`}
                required={true}
                control={control}
                name="organization"
              />
            </Grid>
          </Grid>
          <Grid item xs>
            <SelectControl
              onChange={onUserTypeChange}
              required={true}
              label={t('User Type')}
              isSearchText={false}
              options={optionUserType}
              control={control}
              name='userType'
            />
          </Grid>
          <Grid item xs>
            <TextInput
              required={true}
              control={control}
              label={companyName}
              name="companyName"
            />
          </Grid>
          {isOpenScaleSelect === true ? <Grid item xs>
            <SelectControl
              label={t('Scale')}
              isSearchText={false}
              options={optionScale}
              control={control}
              name='scale'
            />
          </Grid> : ''}
        </Grid>
      </Grid>
    </Box>
  }

  const renderTabFinish = () => {
    return <Finish />
  }

  const renderSteps = [renderTabInfo(), renderTabAccount(), renderTabFinish()]

  const renderContent = () => {
    return <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              {tokenIsvalid === true ?
                <Grid container gap={2} direction='column'>
                  <Grid item>
                    <h3>{t("Create account")}</h3>
                  </Grid>
                  <Grid item>
                    <Box sx={{ width: '100%' }}>
                      <StepperControl id={id} renderSteps={renderSteps} handleSubmit={handleFormSubmit} errors={errors} steps={steps} />
                    </Box>
                  </Grid>
                </Grid> : <Alert severity="error">{error}</Alert>}
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  return loading ? (
    <Spinner className={"spinnerWrapperMaster"}></Spinner>
  ) : renderContent()
}
