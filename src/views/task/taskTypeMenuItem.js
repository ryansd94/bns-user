import React from "react";
import UploadIconImage from "components/upload/uploadIcon/uploadIconImage";
import Grid from "@mui/material/Grid";

const TaskTypeMenuItem = (props) => {
  const { icon, name, color } = props;

  return (
    <Grid container columnSpacing={2}>
      <Grid item display="flex" alignItems={"center"}>
        <UploadIconImage color={color} src={icon} />
      </Grid>
      <Grid item>{name}</Grid>
    </Grid>
  );
};

export default TaskTypeMenuItem;
