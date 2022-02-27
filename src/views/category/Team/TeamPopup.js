import React, { useEffect, useState, useMemo, useCallback } from "react";

import Popup from "components/popup/Popup";
import SkeletonLoading from "components/loader/SkeletonLoading";
import Grid from "@mui/material/Grid";
import SingleSelect from "components/select/SingleSelect";
import PropTypes from "prop-types";

import TextInput from "components/input/TextInput";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { open, change_title ,close} from "components/popup/popupSlice";
import { openMessage } from "stores/components/snackbar";
import {
  setPage,
  setSort,
  setLoadingPopup,
  setReload,
  setEditData,
} from "stores/views/master";
import { getTeam, getTeamByID, save } from "services";
import { ERROR_CODE } from "configs";
import { loading as loadingButton} from "stores/components/button";

import { message } from "configs";
const TeamPopup = React.memo((props) => {
  console.log("render team popup");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const baseUrl = "/jm_team";

  const { dataTeam } = props;
  const editData = useSelector((state) => state.master.editData);
  const openPopup = useSelector((state) => state.popup.open);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  });
  const defaultValues = {
    name: "",
    description: "",
    parentId: null,
    id:""
  };
  useEffect(() => {
    reset();
    onEditClick();
  }, [openPopup]);

  const onEditClick = async () => {
    if (!editData) return;
    dispatch(change_title(t("Chỉnh sửa Nhóm")));
    dispatch(setLoadingPopup(true));
    dispatch(open());
    await getTeamByID(editData).then((res) => {
      //dispatch(setEditData(res.data));
      setValue("id", res.data.id || "");
      setValue("name", res.data.name || "");
      setValue("description", res.data.description || "");
      setValue(
        "parentId",
        res.data.parentId != null
          ? dataTeam && dataTeam.find((e) => e.id === res.data.parentId)
          : null
      );
      dispatch(setLoadingPopup(false));
    });
  };

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
    // alert (JSON.stringify( data))
    // return
    dispatch(loadingButton(true));
    var postData = data;
    if (!editData) postData.id = editData;
    if (data.parentId) postData.parentId = data.parentId.id;
    const res = await save(postData);
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
          <TextInput
            autoFocus={true}
            required={true}
            control={control}
            label={t("Tên nhóm")}
            name="name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            control={control}
            label={t("Ghi chú")}
            name="description"
          />
        </Grid>
        <Grid item xs={12}>
          <SingleSelect
            data={dataTeam}
            control={control}
            name="parentId"
            label={t("Nhóm cha")}
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

TeamPopup.propTypes = {
  dataTeam: PropTypes.array,
};

TeamPopup.defaultProps = {
  dataTeam: [],
};
export default TeamPopup;
