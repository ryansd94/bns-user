import { createStyles, withStyles } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import { FileHeader } from "./";
import Grid from "@mui/material/Grid";

const ErrorLinearProgress = withStyles((theme) =>
  createStyles({
    bar: {
      backgroundColor: theme.palette.error.main,
    },
  }),
)(LinearProgress);

const UploadError = (props) => {
  const { file, onDelete, errors, url } = props;
  return (
    <Grid className="file-item" item style={{ width: "100%" }}>
      <FileHeader url={url} file={file} onDelete={onDelete} />
      <ErrorLinearProgress variant="determinate" value={100} />
      {errors.map((error) => (
        <div key={error.code}>
          <Typography color="error">{error.message}</Typography>
        </div>
      ))}
    </Grid>
  );
};

export default UploadError;
