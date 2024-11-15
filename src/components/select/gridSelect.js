import React, { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import { PopoverControl } from "components/popover";
import { useTranslation } from "react-i18next";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ButtonDetail from "components/button/ButtonDetail";
import { EButtonDetailType, EButtonType } from "configs";
import eventEmitter from "helpers/eventEmitter";
import ButtonFuntion from "components/button/ButtonFuntion";
import GridSelectFilter from "./components/gridSelectFilter";
import _ from "lodash";

const GridSelect = React.memo((props) => {
  console.log("render GridSelect");
  const {
    id,
    gridDataId,
    isGetDataFromServer = false,
    gridDataRender,
    onConfirm,
    dataSelected = [],
    handleDeleteMulti,
    columnModel,
    onApplyFilter,
    filterModels,
  } = props;
  const [anchorOpen, setAnchorOpen] = React.useState(null);
  const [rowsSelected, setRowsSelected] = React.useState([]);
  const [rowsDataSelected, setRowsDataSelected] = React.useState([]);
  const { t } = useTranslation();

  const onAddClick = (event) => {
    setAnchorOpen(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorOpen(null);
  };

  const onSelectedRowChange = ({ rows, gridId }) => {
    if (_.isEqual(gridId, id)) {
      setRowsSelected(rows);
    }
    if (_.isEqual(gridId, gridDataId)) {
      setRowsDataSelected([...rows]);
    }
  };

  const onRowDataChange = ({ rows, gridId }) => {
    if (_.isEqual(gridId, gridDataId)) {
      if (_.isEmpty(rows)) {
        setRowsDataSelected([]);
      } else {
        const result = _.intersectionBy(rowsDataSelected, rows, "id");
        setRowsDataSelected(result);
      }
    }
  };

  useEffect(() => {
    eventEmitter.on("onSelectedRowChange", onSelectedRowChange);
    eventEmitter.on("onRowDataChange", onRowDataChange);

    return () => {
      setRowsSelected([]);
      eventEmitter.off("onSelectedRowChange");
      eventEmitter.off("onRowDataChange");
    };
  }, []);

  const onConfirmClick = () => {
    setAnchorOpen(null);
    setRowsSelected([]);
    onConfirm && onConfirm(rowsSelected);
  };

  const onDeleteAllClick = () => {
    // setRowsSelected([])
    handleDeleteMulti && handleDeleteMulti(rowsDataSelected);
    setRowsDataSelected([]);
  };

  const renderDeleteAllButton = () => {
    return !_.isEmpty(rowsDataSelected) && !_.isEmpty(dataSelected) ? (
      <ButtonFuntion
        onClick={onDeleteAllClick}
        isFloatLeft={true}
        type={EButtonType.delete}
      />
    ) : (
      ""
    );
  };

  const renderPopoverControl = useCallback(() => {
    return (
      <ClickAwayListener onClickAway={handleClose}>
        <Grid style={{ minWidth: "500px" }} container direction="column">
          <DialogContent className="border-bottom">
            <Grid item container gap={2} direction="column">
              <Grid item>
                <GridSelectFilter
                  filterModels={filterModels}
                  onApplyFilter={onApplyFilter}
                  columnModel={columnModel}
                />
              </Grid>
              <Grid item>{gridDataRender && gridDataRender()}</Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid item xs>
              <ButtonDetail
                disabled={_.isEmpty(rowsSelected)}
                isFloatRight={true}
                onClick={onConfirmClick}
                type={EButtonDetailType.accept}
              />
            </Grid>
          </DialogActions>
        </Grid>
      </ClickAwayListener>
    );
  });

  return (
    <Grid item container gap={2} direction="column">
      <Grid item container gap={2}>
        <ButtonFuntion
          onClick={onAddClick}
          isFloatLeft={true}
          type={EButtonType.add}
          label={t("Add members")}
        />
        {renderDeleteAllButton()}
      </Grid>
      <Grid item>
        <PopoverControl
          anchorEl={anchorOpen}
          onClose={handleClose}
          genderBody={renderPopoverControl}
        ></PopoverControl>
      </Grid>
    </Grid>
  );
});

export default GridSelect;
