import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ButtonFuntion from "components/button/ButtonFuntion";
import { EButtonType } from "configs";
import { v4 as uuidv4 } from "uuid";
import { GridBody, GridHeader, GridValidation } from "./components";
import eventEmitter from "helpers/eventEmitter";

const GridControl = (props) => {
  console.log("GridControl");
  const { control, columns = [], name, addButtonLabel, id } = props;

  const renderHeader = useCallback(() => {
    return <GridHeader columns={columns} />;
  }, []);

  const renderBody = () => {
    return <GridBody columns={columns} control={control} name="users" />;
  };

  const onAddRow = () => {
    eventEmitter.emit("addNewRow", { id: id });
  };

  const renderButton = useCallback(() => {
    return (
      <ButtonFuntion
        onClick={onAddRow}
        type={EButtonType.add}
        label={addButtonLabel}
      />
    );
  });

  return (
    <Grid container gap={2} direction="column" className="no-wrap">
      <Grid item>{renderButton()}</Grid>
      <GridValidation />
      <Grid
        item
        container
        direction="column"
        className="no-wrap of-hidden bs-grid"
      >
        <Paper sx={{ width: "100%", overflow: "hidden", display: "flex" }}>
          <TableContainer component={Paper}>
            <Table
              id={id}
              stickyHeader
              sx={{ minWidth: 650 }}
              aria-label="sticky table"
            >
              <TableHead>{renderHeader()}</TableHead>
              <TableBody>{renderBody()}</TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GridControl;
