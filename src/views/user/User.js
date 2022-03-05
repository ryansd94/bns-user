import React, { useState, useEffect, useCallback } from "react";
import ToolBar from "components/toolbar/ToolBar";
// import TeamPopup from "./TeamPopup";
import UserGrid from "./UserGrid";
import { getShopIndex } from "helpers";
import { useTranslation } from "react-i18next";
import { open, change_title } from "components/popup/popupSlice";
import { getUser, getTeamByID, save } from "services";
import { message } from "configs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { openMessage } from "stores/components/snackbar";
import {
  setData,
  setLoading,
  setReload,
  setLoadingPopup,
} from "stores/views/master";
import { createInstance } from "services/base";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

import style from "components/resizable/ResizableNew.scss";
import ResizePanel from "react-resize-panel";
import classNames from "classnames/bind";
let cx = classNames.bind(style);

const User = React.memo(() => {
  console.log("render User");
  const services = createInstance("/api");
  const baseUrl = "/jm_team";
  const { t } = useTranslation();
  const url = `${baseUrl}`;
  const [data, setData] = React.useState({});
  const page = useSelector((state) => state.master.page);
  const sortModel = useSelector((state) => state.master.sortModel);
  const isReload = useSelector((state) => state.master.isReload);
  const [dataTeam, setDataTeam] = React.useState([]);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    //reset();
    dispatch(change_title(t("Thêm mới Nhóm")));
    dispatch(setLoadingPopup(false));
    //dispatch(setEditData(null));
    dispatch(open());
  };

  // const fetchDataTeam = async () => {
  //   await getUser({
  //     draw: 0,
  //     start: 0,
  //     length: 10000,
  //   }).then((data) => {
  //     setDataTeam(data && data.data && data.data.items);
  //   });
  // };
  useEffect(() => {
    fetchData();
  }, [page, sortModel, isReload]);

  // useEffect(() => {
  //   fetchDataTeam();
  // }, [isReload]);

  const fetchData = async () => {
    dispatch(setLoading(true));
    await getUser({
      draw: page,
      start: page == 0 ? 0 : page * 10,
      length: 10,
      fieldSort:
        sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
      sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
    }).then((data) => {
      setData(data);
      dispatch(setLoading(false));
    });
    //setData(res);
  };
  function GenderLeftContent() {
    return <UserGrid />;
  }
  return (
    <div>
      <ToolBar onAddClick={handleClickOpen} />

      <div className={cx("containerNew")}>
        <div className={cx("body")}>
          <div className={cx("content", "panelNew")}>
            <UserGrid data={data} />
          </div>
          <div hidden={true}>
            <ResizePanel
              direction="w"
              style={{ width: "400px" }}
              handleClass={style.customHandle}
              borderClass={style.customResizeBorder}
            >
              <div className={cx("sidebarNew", "panelNew")}></div>
            </ResizePanel>
          </div>
        </div>
      </div>
{/* 
      <TeamPopup dataTeam={dataTeam} /> */}
    </div>
  );
});

export default User;
