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
import IconButton from "@mui/material/IconButton";
import * as Yup from "yup";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { validateTokenSignup, signup } from "services";
import { ERROR_CODE, EUserValidate } from "configs";
import { setTokenLoginSucceeded } from "helpers";

import PasswordChecklist from "react-password-checklist";
import Spinner from "components/shared/Spinner";
import { message } from "configs";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const JointeamHasAccount = (props) => {
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

  const validationSchema = Yup.object().shape({});
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
  });
  const onSubmit = async (data) => {
    const dataToken = replaceAll(token, " ", "+");
    data.token = dataToken;
    data.isHasAccount=true;
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
  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <soan>
          Bạn nhận được lời mời gia nhập, nhấn vào nút bên dưới để tham gia
        </soan>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          {t("Tham gia")}
        </Button>
      </Grid>
    </Grid>
  );
};
export default JointeamHasAccount;
