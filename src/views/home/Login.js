import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  resetUserToken,
  setTokenLoginSucceeded,
  getAccessToken,
  getUserInfo,
  setKeepMeUser,
  getKeepMeUser,
} from "helpers";
import { login, loginGoogle } from "services";
import httpStatus from "http-status";
import Button from "@mui/material/Button";
import { ERROR_CODE, message } from "configs";
import firebase from "firebase/compat/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "firebase/compat/auth";
import _ from "lodash";
import { setUserSetting } from "stores/views/master";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { TextInput } from "components";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "components/alert";
import { CheckBoxControl } from "components/checkbox";

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    username: "",
    weightRange: "",
    showPassword: false,
    keepMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({
    dirty: false,
    msg: "",
  });

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t(message.error.fieldNotEmpty)),
    password: Yup.string().required(t(message.error.fieldNotEmpty)),
  });

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const { username, password } = getKeepMeUser();
    if (!_.isNil(username) && !_.isEmpty(username)) {
      setValue("username", username);
      setValue("password", password);
      setValue("keepMe", true);
      setValues({
        ...values,
        ["username"]: username,
        password: password,
        keepMe: true,
      });
    }
  }, []);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onLoginGoogleSuccess = () => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (!user) {
          return;
        }
        const googleToken = await user.getIdToken();
        const res = await loginGoogle({
          token: googleToken,
        });
        switch (res.status) {
          case httpStatus.OK: {
            const { data } = res && res;
            if (data.errorCode == ERROR_CODE.userNotRegister) {
              history.push(
                `/signup?token=${data.data.token}&googleToken=${googleToken}`,
              );
              break;
            } else if (data.errorCode != ERROR_CODE.success) {
              setError({
                dirty: true,
                msg: t("Invalid username or password"),
              });
              break;
            } else {
              const { data } = res && res.data;
              const token = {
                accessToken: data.token,
                refreshToken: data.token,
                shopIndex: data.shopIndex,
              };
              const user = { ...data, isAdmin: true, acceptScreen: [] };
              setError({
                dirty: false,
                msg: "",
              });
              dispatch(setUserSetting({ ...user }));
              setTokenLoginSucceeded({ token, user }, () => {
                history.push(`/${user.defaultOrganization?.code}/dashboard`);
              });
            }
            break;
          }
          default: {
            setError({
              dirty: true,
              msg: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
            });
            resetUserToken();
            break;
          }
        }
      });
    return () => unregisterAuthObserver();
  };

  useLayoutEffect(() => {
    const tokenWeb = getAccessToken();
    if (tokenWeb) {
      const user = getUserInfo();
      if (!_.isNil(user) && !_.isNil(user.defaultOrganization)) {
        history.push(`/${user.defaultOrganization?.code}/dashboard`);
      }
    }
  }, []);

  console.log(process.env.REACT_APP_FIREBASE_API_KEY)

  // Configure Firebase.
  const config = {
    apiKey: 'AIzaSyAVvoTuwb55beJbxkPexiu84pLn84IiJws',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  };
  firebase.initializeApp(config);
  const uiConfig = {
    signInFlow: "redirect",
    signInSuccessUrl: "/",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        onLoginGoogleSuccess();
      },
    },
  };

  async function onSignIn(data) {
    setIsSubmitting(true);
    const res = await login({
      userName: data.username,
      passWord: data.password,
      remember: true,
    });
    setIsSubmitting(false);
    switch (res.status) {
      case httpStatus.OK: {
        const { data, errors } = res && res;
        if (data.errorCode != ERROR_CODE.success) {
          setError({
            dirty: true,
            msg: t(data.errorCode),
          });
          break;
        } else {
          const { data } = res && res.data;
          const token = {
            accessToken: data.token,
            refreshToken: data.token,
            shopIndex: data.shopIndex,
          };
          const user = { ...data, isAdmin: true, acceptScreen: [] };
          if (getValues("keepMe") === true) {
            setKeepMeUser({
              user: getValues("username"),
              password: getValues("password"),
            });
          } else {
            setKeepMeUser({ user: "", password: "" });
          }
          setTokenLoginSucceeded({ token, user });
          dispatch(setUserSetting({ ...user }));
          setError({
            dirty: false,
            msg: "",
          });
          history.push(`${user.defaultOrganization?.code}/dashboard`);
        }
        break;
      }
      default: {
        setError({
          dirty: true,
          msg: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
        });
        resetUserToken();
        break;
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
              <Grid container gap={2} direction="column">
                <Grid item xs={12}>
                  {!_.isNil(error?.msg) ? <Alert message={error?.msg} /> : ""}
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    autoFocus={true}
                    required={true}
                    control={control}
                    label={t("Username")}
                    name="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    required={true}
                    control={control}
                    label={t("Password")}
                    name="password"
                    type={values.showPassword ? "text" : "password"}
                    inputProps={{
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
                  <Button variant="contained" onClick={handleSubmit(onSignIn)}>
                    {t("Sign in")}
                  </Button>
                </Grid>
              </Grid>

              <Form className="pt-3">
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <CheckBoxControl
                    control={control}
                    label={t("Keep me signed in")}
                    name="keepMe"
                  />
                  {/* <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input checked={values['keepMe']} onChange={handleChange("keepMe")} type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      {t('Keep me signed in')}
                    </label>
                  </div> */}
                  {/* <a
                    href="!#"
                    onClick={(event) => event.preventDefault()}
                    className="auth-link text-black"
                  >
                    Forgot password?
                  </a> */}
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
  );
}
