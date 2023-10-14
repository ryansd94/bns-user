import React, { useEffect, useState } from "react";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import { Controller } from "react-hook-form";
import TaskItem from "./../taskItem";
import TaskParentAddButton from "./taskParentAddButton";

const TaskParentItem = (props) => {
  const { control, name, setValue, onChange } = props;

  const onRemoveTaskParent = () => {
    onChange && onChange({ value: null, name });
    setValue(name, null);
  };

  const renderParentItem = (item) => {
    return <TaskItem item={item} onRemoveTaskItem={onRemoveTaskParent} />;
  };

  return (
    <Controller
      render={({ field, fieldState: { error } }) =>
        !_.isNil(field?.value) ? (
          <Grid
            container
            xs={12}
            className="child-task-root"
            item
            direction="column"
          >
            {renderParentItem(field?.value)}
          </Grid>
        ) : (
          <Grid item style={{ width: "100%" }}>
            <TaskParentAddButton {...props} />
          </Grid>
        )
      }
      name={name}
      control={control && control}
    />
  );
};

export default TaskParentItem;
