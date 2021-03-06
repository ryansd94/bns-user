import React, { useState, useEffect } from "react";
import { useLocation,useHistory } from "react-router-dom";
import queryString from "query-string";
import TextInput from "components/input/TextInput";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import * as Yup from "yup";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { validateTokenSignup, signup } from "services";
import { ERROR_CODE, EUserValidate } from "configs";

import PasswordChecklist from "react-password-checklist";
import Spinner from "components/shared/Spinner";
import { message } from "configs";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setTokenLoginSucceeded } from "helpers";

const JoinTeamNoAccount = (props) =>  {
  const history = useHistory();
  const { search } = useLocation();
  const { t } = useTranslation();
  const { token } = queryString.parse(search);
  const dispatch = useDispatch();

  const [error, setError] = useState(t("Token không hợp lệ"));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMainAccount, setHasMainAccount] = useState(false);
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordIsvalid, setPasswordIsvalid] = useState(false);
  const [tokenIsvalid, setTokenIsvalid] = useState(false);
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
  useEffect(() => {
    if (token) {
      const data = replaceAll(token, " ", "+");
      validateToken(data);
    } else setLoading(false);
  }, []);
  const validateToken = async (token) => {
    const res = await validateTokenSignup({ token: token });
    if (res.errorCode == ERROR_CODE.success) {
      setTokenIsvalid(true);
      if (res.data && res.data.status == EUserValidate.IS_HAS_ACCOUNT)
        setHasMainAccount(true);
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
    if (!passwordIsvalid) return;

    const dataToken = replaceAll(token, " ", "+");
    data.token = dataToken;
    data.isHasAccount=false;
    const res = await signup(data);
    if (res.errorCode == ERROR_CODE.success) {
      const userInfo =  res.data;
      const token = {
        accessToken: userInfo.token,
        refreshToken: userInfo.token,
        shopIndex: userInfo.shopIndex,
      };
      const user = { ...userInfo, isAdmin: true, acceptScreen: [] };
      setTokenLoginSucceeded({ token, user });
      setTokenIsvalid(true);
      history.push(`/dashboard`);
    } else {
      setTokenIsvalid(false);
      setError({
        dirty: true,
        msg: res.title,
      });
    }
  };
  const onChangePasswordAgain = (text) => {
    setPasswordAgain(text.toLowerCase());
  };

  const onChangePassword = (text) => {
    setPassword(text.toLowerCase());
  };

  return (
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
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
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
          rules={["notEmpty", "minLength", "number", "lowercase", "match"]}
          minLength={6}
          value={password}
          valueAgain={passwordAgain}
          onChange={(isValid) => setPasswordIsvalid(isValid)}
          messages={{
            minLength: t("Mật khẩu tối thiểu 6 ký tự"),
            notEmpty: t("Mật khẩu và nhập lại mật khẩu không được trống"),
            number: t("Mật khẩu phải chứa 1 chữ số"),
            lowercase: t("Mật khẩu phải chứa 1 ký tự"),
            match: t("Nhập lại mật khẩu không trùng khớp"),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          {t("Tham gia")}
        </Button>
      </Grid>
    </Grid>
  );
}

export default JoinTeamNoAccount;