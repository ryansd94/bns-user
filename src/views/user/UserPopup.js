import React, { useEffect, useState, useMemo, useCallback } from "react";

import Popup from "components/popup/Popup";
import SkeletonLoading from "components/loader/SkeletonLoading";
import Grid from "@mui/material/Grid";
import MultiSelectText from "components/select/MultiSelectText";
import PropTypes from "prop-types";

import TextInput from "components/input/TextInput";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { open, change_title, close } from "components/popup/popupSlice";
import { openMessage } from "stores/components/snackbar";
import {
  setPage,
  setSort,
  setLoadingPopup,
  setReload,
  setEditData,
} from "stores/views/master";
import { sendMailUser } from "services";
import { ERROR_CODE } from "configs";
import { loading as loadingButton } from "stores/components/button";

import { message } from "configs";
const UserPopup = React.memo((props) => {
  console.log("render team popup");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const baseUrl = "/jm_team";

  const editData = useSelector((state) => state.master.editData);
  const openPopup = useSelector((state) => state.popup.open);

  const validationSchema = Yup.object().shape({
    // name: Yup.string().required(t(message.error.fieldNotEmpty)),
  });
  const defaultValues = {
    emails: [],
  };
  useEffect(() => {
    reset();
  }, [openPopup]);

  const {
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
    // alert(JSON.stringify(data));
    // return;
    dispatch(loadingButton(true));
    const res = await sendMailUser(data);
    dispatch(loadingButton(false));
    dispatch(openMessage({ ...res }));
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setEditData(null));
      dispatch(setReload());
      dispatch(close());
    }
  };
  function ModalBody() {
    return (
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <span className="text-note">
            {t(
              "Nhập Email người dùng bạn muốn thêm vào hệ thống. Hệ thống sẽ gửi email xác nhận đến email của người dùng"
            )}
          </span>
          <MultiSelectText
            control={control}
            name="emails"
            label={t("Email người dùng")}
            placeholder={t("Nhập Email người dùng")}
          />
        </Grid>
      </Grid>
    );
  }
  return (
    <div>
      <Popup
        ModalBody={ModalBody}
        widthSize={"sm"}
        onSave={handleSubmit(onSubmit)}
      />
    </div>
  );
});

export default UserPopup;
