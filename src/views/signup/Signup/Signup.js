import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import TextInput from "components/input/TextInput";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector, useDispatch } from "react-redux";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import * as Yup from "yup";
import { message } from "configs";
import { yupResolver } from "@hookform/resolvers/yup";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Alert from "@mui/material/Alert";
import { validateTokenSignup, registerGoogle } from "services";
import { ERROR_CODE } from "configs";

import {
  resetUserToken,
  setTokenLoginSucceeded,
  getAccessToken,
} from "helpers";
import PasswordChecklist from "react-password-checklist";
import Spinner from "components/shared/Spinner";
import { openMessage } from "stores/components/snackbar";

export default function Signup() {
  const { search } = useLocation();
  const { t } = useTranslation();
  const { token } = queryString.parse(search);
  const dispatch = useDispatch();
  const history = useHistory();

  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordIsvalid, setPasswordIsvalid] = useState(false);
  const [tokenIsvalid, setTokenIsvalid] = useState(true);
  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
  }
  //   useEffect(() => {
  //     if (token) {
  //       const data = replaceAll(token, " ", "+");
  //       validateToken(data);
  //     }
  //   }, []);
  const validateToken = async (token) => {
    const res = await validateTokenSignup({ token: token });
    if (res.errorCode == ERROR_CODE.success) {
      setTokenIsvalid(true);
    } else {
      setError(res.title);
    }
    setLoading(false);
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(t(message.error.fieldNotEmpty)),
  });
  const defaultValues = {
    fullName: "",
    password: "",
    confirmPassword: "",
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
  });
  const onSubmit = async (data) => {
    // alert(passwordIsvalid);
    // return;
    // console.log(passwordIsvalid);
    if (!passwordIsvalid) return;

    const dataToken = replaceAll(token, " ", "+");
    data.token = dataToken;
    const res = await registerGoogle(data);
    const dataResult = res && res.data;
    if (dataResult.errorCode == ERROR_CODE.success) {
      const userInfo = dataResult.data;
      const token = {
        accessToken: userInfo.token,
        refreshToken: userInfo.token,
        shopIndex: userInfo.shopIndex,
      };
      const user = { ...userInfo, isAdmin: true, acceptScreen: [] };
      setTokenLoginSucceeded({ token, user });
      history.push(`/dashboard`);
    }
    // dispatch(openMessage({ ...res }));
  };
  const onChangePasswordAgain = (text) => {
    setPasswordAgain(text.toLowerCase());
  };

  const onChangePassword = (text) => {
    setPassword(text.toLowerCase());
  };

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
                <Grid container rowSpacing={2}>
                      <Grid item xs={12}>
                        <span className="text-note">
                          {t("Nhập Họ và tên bạn muốn hiển thị")}
                        </span>
                        <TextInput
                          autoFocus={true}
                          required={true}
                          control={control}
                          label={t("Họ tên đầy đủ")}
                          name="fullName"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextInput
                          required={true}
                          control={control}
                          label={t("Mật khẩu")}
                          name="password"
                          type={"password"}
                          onChange={onChangePassword}
                          inputProps={{
                            autocomplete: "new-password",
                            form: {
                              autocomplete: "off",
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccountCircle />
                              </InputAdornment>
                            ),
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
                      <Grid item xs={12}>
                        <TextInput
                          required={true}
                          control={control}
                          label={t("Nhập lại mật khẩu")}
                          name="confirmPassword"
                          type={"password"}
                          onChange={onChangePasswordAgain}
                          InputProps={{
                            autocomplete: "new-password",
                            form: {
                              autocomplete: "off",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
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
                            minLength: t("Mật khẩu tối thiểu 6 ký tự"),
                            notEmpty: t(
                              "Mật khẩu và nhập lại mật khẩu không được trống"
                            ),
                            number: t("Mật khẩu phải chứa 1 chữ số"),
                            lowercase: t("Mật khẩu phải chứa 1 ký tự"),
                            match: t("Nhập lại mật khẩu không trùng khớp"),
                          }}
                        />
                      </Grid>
                      </Grid>
                  ) : (
                    <Alert severity="error">{error}</Alert>
                  )}
                </Grid>
                {tokenIsvalid ? (
                  <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    Sign in
                  </Button>
                ) : (
                  <div></div>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
