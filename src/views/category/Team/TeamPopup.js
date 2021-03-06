import React, { useEffect, useState, useMemo, useCallback } from "react";

import Popup from "components/popup/Popup";
import SkeletonLoading from "components/loader/SkeletonLoading";
import Grid from "@mui/material/Grid";
import SingleSelect from "components/select/SingleSelect";
import PropTypes from "prop-types";
import MultiSelect from "components/select/MultiSelect";

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
import { getTeam, getTeamByID, save, getUser } from "services";
import { ERROR_CODE } from "configs";
import { loading as loadingButton } from "stores/components/button";

import { message } from "configs";
const TeamPopup = React.memo((props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const baseUrl = "/jm_team";

  const { dataTeam } = props;
  const editData = useSelector((state) => state.master.editData);
  const openPopup = useSelector((state) => state.popup.open);

  const [dataUser, setDataUser] = React.useState([]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  });
  const defaultValues = {
    name: "",
    description: "",
    parentId: null,
    id: "",
    members: [],
  };
  useEffect(() => {
    reset();
    onEditClick();
  }, [openPopup]);

  const fetchDataUser = async () => {
    await getUser({
      draw: 0,
      start: 0,
      length: 10000,
    }).then((data) => {
      const users =
        data &&
        data.data &&
        data.data.items.map((item, index) => ({
          title: item.fullName,
          id: item.userId,
        }));
      setDataUser(users);
    });
  };
  useEffect(() => {
    fetchDataUser();
  }, []);

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
      if (res.data.teamMembers != null) {
        var teamMembers = [];
        res.data.teamMembers.map((item, index) => {
          teamMembers.push(dataUser.find((d) => d.id == item));
        });
        setValue("members", teamMembers );
        //setValue("members2", teamMembers );
      }
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
    dispatch(loadingButton(true));
    var postData = data;
    if (!editData) postData.id = editData;
    if (data.parentId) postData.parentId = data.parentId.id;
    if (data.members)
      postData.members = data.members.map((item, index) => item.id);
    // alert(JSON.stringify(postData));
    // return;
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
        <Grid item xs={12}>
          <span className="text-note">
            {t(
              "Nhập Email người dùng bạn muốn thêm vào nhóm, bấm Enter để thêm nhiều người dùng"
            )}
          </span>
          <MultiSelect
            control={control}
            name="members"
            data={dataUser}
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

TeamPopup.propTypes = {
  dataTeam: PropTypes.array,
};

TeamPopup.defaultProps = {
  dataTeam: [],
};
export default TeamPopup;
