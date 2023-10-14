import React, { useEffect, useState } from "react";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import { Controller } from "react-hook-form";
import TaskItem from "./../taskItem";

const TaskChildListItem = (props) => {
  const { control, name, setValue, getValues, onChange } = props;

  const onRemoveTaskChild = (item) => {
    const originTaskChild = getValues(name);
    let listRemoveTaskChild = getValues("defaultData.taskChildDelete") || [];
    const lstTaskChild = _.filter(originTaskChild, (x) => x.id !== item.id);
    onChange && onChange({ value: lstTaskChild });
    setValue(name, lstTaskChild);
    listRemoveTaskChild.push(item.id);
    // setValue('defaultData.taskChildDelete', listRemoveTaskChild)
  };

  const renderChildItem = (item) => {
    return (
      <TaskItem
        key={item.id}
        item={item}
        onRemoveTaskItem={onRemoveTaskChild}
      />
    );
  };

  return (
    <Controller
      render={({ field, fieldState: { error } }) =>
        !_.isEmpty(field?.value) ? (
          <Grid
            container
            xs={12}
            className="child-task-root"
            item
            gap={2}
            direction="column"
          >
            {_.map(field?.value, (item) => {
              return !_.isNil(item) && !_.isEmpty(item)
                ? renderChildItem(item)
                : "";
            })}
          </Grid>
        ) : (
          ""
        )
      }
      name={name}
      control={control && control}
    />
  );
};

export default TaskChildListItem;
