import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import TextInput from "components/input/TextInput";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
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
import Stack from "@mui/material/Stack";

import PasswordChecklist from "react-password-checklist";
export default function User() {
  const { search } = useLocation();
  const { t } = useTranslation();
  const { token } = queryString.parse(search);

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordIsvalid, setPasswordIsvalid] = useState(false);
  const [tokenIsvalid, setTokenIsvalid] = useState(false);
  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
    username: "",
  });

  useEffect(() => {
    if (!token) {
      setTokenIsvalid(false);
      return;
    }
    
  }, []);
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
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
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
  });
  const defaultValues = {
    name: "",
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
    alert(passwordIsvalid);
    return;
  };
  const onChangePasswordAgain = (text) => {
    setPasswordAgain(text.toLowerCase());
  };

  const onChangePassword = (text) => {
    setPassword(text.toLowerCase());
  };

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <h3>{t("Tạo tài khoản BNS")}</h3>
              {tokenIsvalid ? (
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
                      <span className="text-note">
                        {t("Nhập Họ và tên bạn muốn hiển thị")}
                      </span>
                      <TextInput
                        autoFocus={true}
                        required={true}
                        control={control}
                        label={t("Họ tên đầy đủ")}
                        name="name"
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
                  <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    Sign in
                  </Button>
                </Box>
              ) : (
                <Alert severity="error">{t("Token không hợp lệ")}</Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
