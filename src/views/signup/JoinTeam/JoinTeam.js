import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import queryString from "query-string"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { validateTokenSignup, signup } from "services"
import { ERROR_CODE, EUserValidate } from "configs"
import Alert from "@mui/material/Alert"

import Spinner from "components/shared/Spinner"
import { message } from "configs"
import { yupResolver } from "@hookform/resolvers/yup"
import JointeamHasAccount from "./components/JointeamHasAccount"
import JoinTeamNoAccount from "./components/JoinTeamNoAccount"

export default function JoinTeam() {
  const { search } = useLocation()
  const { t } = useTranslation()
  const { token } = queryString.parse(search)

  const [error, setError] = useState(t(""))
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [hasMainAccount, setHasMainAccount] = useState(false)
  const [passwordAgain, setPasswordAgain] = useState("")
  const [passwordIsvalid, setPasswordIsvalid] = useState(false)
  const [tokenIsvalid, setTokenIsvalid] = useState(false)
  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace)
  }
  useEffect(() => {
    if (token) {
      const data = replaceAll(token, " ", "+")
      validateToken(data)
    } else setLoading(false)
  }, [])
  const validateToken = async (token) => {
    const res = await validateTokenSignup({ token: token })
    if (res.errorCode == ERROR_CODE.success) {
      setTokenIsvalid(true)
      if (res.data && res.data.status == EUserValidate.IS_HAS_ACCOUNT)
        setHasMainAccount(true)
    } else {
      setError(res.title)
    }
    setLoading(false)
  }
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    })
  }

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(t(message.error.fieldNotEmpty)),
    // password: Yup.string()
    //   .required(t(message.error.fieldNotEmpty))
    //   .min(6, t("Mật khẩu tối thiểu 6 ký tự"))
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/,
    //     t("Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm cả chữ và số")
    //   ),
    // confirmPassword: Yup.string()
    //   .required(t(message.error.fieldNotEmpty))
    //   .oneOf([Yup.ref("password")], t("Nhập lại mật khẩu không đúng")),
  })
  const defaultValues = {
    fullName: "",
    password: "",
    confirmPassword: "",
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  })
  const onSubmit = async (data) => {
    // alert(passwordIsvalid)
    // return
    if (!passwordIsvalid) return

    const dataToken = replaceAll(token, " ", "+")
    data.token = dataToken
    const res = await signup(data)
    if (res.errorCode == ERROR_CODE.success) {
      setTokenIsvalid(true)
      history.push(`/dashboard`)
    } else {
      setTokenIsvalid(false)
      setError({
        dirty: true,
        msg: res.title,
      })
    }
    // dispatch(openMessage({ ...res }))
  }
  const onChangePasswordAgain = (text) => {
    setPasswordAgain(text.toLowerCase())
  }

  const onChangePassword = (text) => {
    setPassword(text.toLowerCase())
  }

  return loading ? (
    <Spinner className={"spinnerWrapperMaster"}></Spinner>
  ) : (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <Grid container rowSpacing={2}>
                  <Grid item xs={12}>
                    <h3>{t("Tạo tài khoản BNS")}</h3>
                  </Grid>
                  {tokenIsvalid ? (
                    !hasMainAccount ? (
                      <JoinTeamNoAccount></JoinTeamNoAccount>
                    ) : (
                      <JointeamHasAccount />
                    )
                  ) : (
                    <Alert severity="error">{error}</Alert>
                  )}
                </Grid>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
