import React, { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import _, { cloneDeep } from "lodash";
import { TransferList } from "components/transferList";
import { OverflowTip } from "components/tooltip";
import GridData from "components/table/GridData";
import UserGrid from "views/user/UserGrid";
import ButtonFuntion from "components/button/ButtonFuntion";
import { EButtonType, baseUrl, EControlType } from "configs";
import GridSelect from "components/select/gridSelect";
import eventEmitter from "helpers/eventEmitter";
import { Controller } from "react-hook-form";

const MemberTab = React.memo((props) => {
  const { setValue, getValues, control, name, onValueChange } = props;
  const userHiddenColumns = ["teamName"];
  let [usersSelected, setUsersSelected] = useState([]);
  const [filterModels, setFilterModels] = useState("");

  const { t } = useTranslation();
  const columnModel = [
    {
      field: "email",
      isShow: true,
      label: t("Email"),
      type: EControlType.textField,
    },
    {
      field: "fullName",
      isShow: true,
      label: t("Full name"),
      type: EControlType.textField,
    },
    {
      field: "status",
      isShow: true,
      label: t("Status"),
      type: EControlType.select,
    },
    {
      field: "createdDate",
      isShow: true,
      label: t("Date created"),
      type: EControlType.datetime,
    },
  ];

  const onSelectedRow = (rows, id) => {
    eventEmitter.emit("onSelectedRowChange", { rows, gridId: id });
    if (id === "gridTeamUser") {
      usersSelected = [...rows];
      setUsersSelected([...usersSelected]);
    }
  };

  const customFilterData = (data) => {
    let users = _.cloneDeep(getValues(name));
    if (!_.isEmpty(users)) {
      const usersSelectedIds = _.map(users, (x) => {
        return x.userId;
      });
      data.data.items = _.filter(
        data && data.data && data.data.items,
        (x) => !_.includes(usersSelectedIds, x.userId),
      );
    }
    return data;
  };

  const onSelectedRowsChange = (rows) => {
    let users = _.cloneDeep(getValues(name));
    users = [...users, ...rows];
    onValueChange &&
      onValueChange({
        value: users,
        name,
        isEntity: false,
        type: EControlType.listId,
      });
    setValue(name, users);
    if (!_.isEmpty(users)) {
      eventEmitter.emit("onRowDataChange", {
        rows: users,
        gridId: "gridTeamUser",
      });
    }
  };

  const onDeleteClick = (id) => {
    let users = _.cloneDeep(getValues(name));
    _.remove(users, function (x) {
      return x.userId === id;
    });
    if (_.isEmpty(users)) {
      users = [];
    }
    onValueChange &&
      onValueChange({
        value: users,
        name,
        isEntity: false,
        type: EControlType.listId,
      });
    setValue(name, users);
    if (!_.isEmpty(users)) {
      eventEmitter.emit("onRowDataChange", {
        rows: users,
        gridId: "gridTeamUser",
      });
    }
  };

  const gridDataRender = () => {
    return (
      <UserGrid
        filterModels={filterModels}
        hiddenColumns={userHiddenColumns}
        customFilterData={customFilterData}
        dataUrl={`${baseUrl.jm_team}/users`}
        onSelectedRow={(rows) => onSelectedRow(rows, "gridTeamUserAdd")}
        isShowActionButton={false}
        id={"gridTeamUserAdd"}
      />
    );
  };

  const handleDeleteMulti = (dataSelect) => {
    if (!_.isEmpty(usersSelected)) {
      let currentData = getValues(name) || [];
      const result = _.differenceBy(currentData, dataSelect, "id");
      onValueChange &&
        onValueChange({
          value: result,
          name,
          isEntity: false,
          type: EControlType.listId,
        });
      setValue(name, result);
    }
  };

  const onApplyFilter = (filters) => {
    setFilterModels(JSON.stringify([...filters]));
  };

  const renderGridSelect = useCallback(
    (users) => {
      return (
        <GridSelect
          filterModels={filterModels}
          onApplyFilter={onApplyFilter}
          columnModel={columnModel}
          handleDeleteMulti={handleDeleteMulti}
          dataSelected={users}
          onConfirm={onSelectedRowsChange}
          gridDataId={"gridTeamUser"}
          id={"gridTeamUserAdd"}
          gridDataRender={gridDataRender}
        />
      );
    },
    [filterModels],
  );

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Grid container gap={2} direction="column">
          <Grid item>{renderGridSelect(field?.value || [])}</Grid>
          <Grid item>
            <UserGrid
              hiddenColumns={userHiddenColumns}
              onCustomDeleteClick={onDeleteClick}
              onSelectedRow={(rows) => onSelectedRow(rows, "gridTeamUser")}
              isShowListButton={false}
              localData={field?.value || []}
              isGetDataFromServer={false}
              id={"gridTeamUser"}
            />
          </Grid>
        </Grid>
      )}
      control={control}
    />
  );
});

export default MemberTab;
