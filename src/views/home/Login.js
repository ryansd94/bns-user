import React, { useState, useEffect, useLayoutEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import { Form } from "react-bootstrap"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import InputAdornment from "@mui/material/InputAdornment"
import FormControl from "@mui/material/FormControl"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import {
  resetUserToken,
  setTokenLoginSucceeded,
  getAccessToken,
  getUserInfo,
  setKeepMeUser,
  getKeepMeUser
} from "helpers"
import { login, loginGoogle } from "services"
import httpStatus from "http-status"
import Button from "@mui/material/Button"
import { ERROR_CODE } from "configs"
import firebase from "firebase/compat/app"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import "firebase/compat/auth"
import _ from 'lodash'
import { setUserSetting } from "stores/views/master"
import { useDispatch } from "react-redux"

export default function Login() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    username: "",
    weightRange: "",
    showPassword: false,
    keepMe: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState({
    dirty: false,
    msg: "",
  })

  useEffect(() => {
    const { username, password } = getKeepMeUser()
    if (!_.isNil(username)) {
      setValues({ ...values, ['username']: username, password: password, keepMe: true })
    }
  }, [])

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
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

  const onLoginGoogleSuccess = () => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (!user) {
          return
        }
        const token = await user.getIdToken()
        const res = await loginGoogle({
          token: token,
        })
        switch (res.status) {
          case httpStatus.OK: {
            const { data } = res && res
            if (data.errorCode == ERROR_CODE.userNotRegister) {
              history.push(`/signup?token=${token}`)
              break
            } else if (data.errorCode != ERROR_CODE.success) {
              setError({
                dirty: true,
                msg: "tài hkoản hoặc mật khẩu sai",
              })
              break
            } else {
              const { data } = res && res.data
              const token = {
                accessToken: data.token,
                refreshToken: data.token,
                shopIndex: data.shopIndex,
              }
              const user = { ...data, isAdmin: true, acceptScreen: [] }
              setTokenLoginSucceeded({ token, user })
              setError({
                dirty: false,
                msg: "",
              })
              dispatch(setUserSetting({ ...user }))
              history.push(`/${user.defaultOrganization}/dashboard`)
            }
            break
          }
          default: {
            setError({
              dirty: true,
              msg: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
            })
            resetUserToken()
            break
          }
        }
      })
    return () => unregisterAuthObserver()
  }

  function validate() {
    let valid = true
    return valid
  }
  useLayoutEffect(() => {
    const tokenWeb = getAccessToken()
    if (tokenWeb) {
      const user = getUserInfo()
      history.push(`/${user.defaultOrganization}/dashboard`)
    }
  }, [])
  // Configure Firebase.
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  }
  firebase.initializeApp(config)
  const uiConfig = {
    signInFlow: "redirect",
    signInSuccessUrl: "/",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        onLoginGoogleSuccess()
      },
    },
  }
  
  async function handleSubmit() {
    const valid = validate()
    if (valid) {
      setIsSubmitting(true)
      const res = await login({
        userName: values.username,
        passWord: values.password,
        remember: true,
      })
      setIsSubmitting(false)
      switch (res.status) {
        case httpStatus.OK: {
          const { data, errors } = res && res
          if (data.errorCode != ERROR_CODE.success) {
            setError({
              dirty: true,
              msg: "tài hkoản hoặc mật khẩu sai",
            })
            break
          } else {
            const { data } = res && res.data
            const token = {
              accessToken: data.token,
              refreshToken: data.token,
              shopIndex: data.shopIndex,
            }
            const user = { ...data, isAdmin: true, acceptScreen: [] }
            if (values.keepMe) {
              setKeepMeUser({ user: values.username, password: values.password })
            } else {
              setKeepMeUser({ user: null, password: null })
            }
            setTokenLoginSucceeded({ token, user })
            dispatch(setUserSetting({ ...user }))
            setError({
              dirty: false,
              msg: "",
            })
            history.push(`${user.defaultOrganization}/dashboard`)
          }
          break
        }
        default: {
          setError({
            dirty: true,
            msg: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
          })
          resetUserToken()
          break
        }
      }
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img
                  src={require("../../assets/images/logo-dark.svg")}
                  alt="logo"
                />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <FormControl fullWidth>
                  <InputLabel htmlFor="component-outlined">UserName</InputLabel>
                  <OutlinedInput
                    autoComplete="new-password"
                    id="component-outlined"
                    value={values.username}
                    onChange={handleChange("username")}
                    label="UserName"
                  />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    autoComplete="new-password"
                    id="outlined-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    endAdornment={
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
                    }
                    label="Password"
                  />
                </FormControl>
                <Button variant="contained" onClick={handleSubmit}>
                  Sign in
                </Button>
              </Box>
              <Form className="pt-3">
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input checked={values['keepMe']} onChange={handleChange("keepMe")} type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      Keep me signed in
                    </label>
                  </div>
                  <a
                    href="!#"
                    onClick={(event) => event.preventDefault()}
                    className="auth-link text-black"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="mb-2">
                  <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                  />
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account?{" "}
                  <Link to="/user-pages/register" className="text-primary">
                    Create
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
