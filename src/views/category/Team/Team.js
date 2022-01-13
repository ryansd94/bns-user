import React, { useState, useEffect, useCallback } from "react";
import ToolBar from "../../../components/toolbar/ToolBar";
import TeamPopup from "./TeamPopup";
import TeamDataGrid from "./TeamDataGrid";
import { getShopIndex } from "helpers";
import { useTranslation } from "react-i18next";
import { open, change_title } from "components/popup/popupSlice";
import { getTeam, getTeamByID } from "services";
import { message } from "configs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { openMessage } from "stores/components/snackbar";
import {
  setData,
  setLoading,
  setReload,
  setLoadingPopup,
  setEditData,
} from "stores/views/master";
import { createInstance } from "services/base";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
const Team = React.memo(() => {
  console.log("render Team");
  const services = createInstance("/api");
  const baseUrl = "/jm_team";
  const { t } = useTranslation();
  const url = `${baseUrl}`;
  const data = useSelector((state) => state.master.data);
  const page = useSelector((state) => state.master.page);
  const sortModel = useSelector((state) => state.master.sortModel);
  const isReload = useSelector((state) => state.master.isReload);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  });
  const defaultValues = {
    name: "",
    note: "",
    parentId: null,
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
    var postData = data;
    alert(JSON.stringify(data));
    return;
    if (data.parentId) postData.parentId = data.parentId.id;
    const res = await services.post(baseUrl, postData);
    const action = openMessage({ ...res });
    dispatch(action);
    if (res.errorCode == "Success") {
      dispatch(setReload());
      reset();
    }
  };
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    reset();
    dispatch(change_title(t("Thêm mới Nhóm")));
    dispatch(setLoadingPopup(false));
    dispatch(setEditData(null));
    dispatch(open());
  };

  useEffect(() => {
    fetchData();
  }, [page, sortModel, isReload]);

  const fetchData = async () => {
    dispatch(setLoading(true));
    await getTeam({
      draw: page,
      start: page == 0 ? 0 : page * 10,
      length: 10,
      fieldSort:
        sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
      sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
    }).then((data) => {
      dispatch(setData(data));
      dispatch(setLoading(false));
    });
    //setData(res);
  };
  const onParentTeamChange = async (value) => {
    alert(JSON.stringify(value));
  };
  const onEditClick = async (params) => {
    if (!params) return;
    dispatch(change_title(t("Chỉnh sửa Nhóm")));
    dispatch(setLoadingPopup(true));
    dispatch(open());
    await getTeamByID(params).then((res) => {
      setValue("name", res.data.name);
      setValue("description", res.data.description);
      setValue("parentId",data && data.data && data.data.items.find((e) => e.id === res.data.parentId)
     );
      dispatch(setLoadingPopup(false));
    });
  };
  return (
    <div>
      <ToolBar onAddClick={handleClickOpen} />
      <TeamDataGrid onCellClick={onEditClick} />
      <TeamPopup
        control={control}
        onSubmit={handleSubmit(onSubmit)}
        dataTeam={data && data.data && data.data.items}
        onChange={onParentTeamChange}
      />{" "}
    </div>
  );
});

export default Team;
