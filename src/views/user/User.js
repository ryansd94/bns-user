import React, { useState, useEffect, useCallback } from "react";
import ToolBar from "components/toolbar/ToolBar";
import UserPopup from "./UserPopup";
import UserGrid from "./UserGrid";
import UserToolbar from "./UserToolbar";
import { getShopIndex } from "helpers";
import { useTranslation } from "react-i18next";
import { open, change_title } from "components/popup/popupSlice";
import { getUser, getTeamByID, save } from "services";
import { message } from "configs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { openMessage } from "stores/components/snackbar";
import {
  setConfig,
} from "stores/views/new";
import {
  setColumnVisibility,
} from "stores/views/user";
import { createInstance } from "services/base";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

import style from "components/resizable/ResizableNew.scss";
import ResizePanel from "react-resize-panel";
import classNames from "classnames/bind";
let cx = classNames.bind(style);

const User = React.memo(() => {
  console.log("render user");
  return (
    <div>
      <UserToolbar />
      <UserGrid />
      {/* <div className={cx("containerNew")}>
        <div className={cx("body")}>
          <div className={cx("content", "panelNew")}>
            <UserGrid />
          </div>
          <div hidden={false}>
            <ResizePanel
              direction="w"
              style={{ width: "400px", height: "100%" }}
              handleClass={style.customHandle}
              borderClass={style.customResizeBorder}
            >
              <div className={cx("sidebarNew", "panelNew")}></div>
            </ResizePanel>
          </div>
        </div>
      </div> */}

    </div>
  );
});

export default User;
