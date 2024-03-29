import React from "react";
import UploadIconImage from "components/upload/uploadIcon/uploadIconImage";
import Grid from "@mui/material/Grid";
import { OverflowTip } from "components/tooltip";
import _ from "lodash";

const LabelIconControl = (props) => {
  const { icon, name = "", color } = props;

  const renderTooltipContent = () => {
    return <span style={{ textOverflow: "ellipsis" }}>{name}</span>;
  };

  return (
    <Grid className="label-icon-control-container" item container gap={0.5}>
      <Grid item>
        <UploadIconImage color={color} src={icon} />
      </Grid>
      {!_.isEmpty(name) ? (
        <Grid item xs={12} className="label-icon-control-text">
          <OverflowTip
            value={name}
            renderTooltipContent={renderTooltipContent}
          />
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default LabelIconControl;
