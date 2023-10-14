import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import { EControlVariant, ESize } from "configs";
import _ from "lodash";

const NotifyLoading = (props) => {
  const renderItem = (key) => {
    return (
      <Grid container key={key} item gap={2} className="no-wrap">
        <Grid item>
          <Skeleton
            width={50}
            height={50}
            variant={EControlVariant.circular}
            size={ESize.small}
          />
        </Grid>
        <Grid item container gap={0.5} direction="column">
          <Skeleton variant={EControlVariant.text} size={ESize.small} />
          <Skeleton variant={EControlVariant.text} size={ESize.small} />
          <Skeleton
            width={"50%"}
            variant={EControlVariant.text}
            size={ESize.small}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid
      container
      item
      direction={"column"}
      xs
      gap={2}
      className="no-wrap body-content"
    >
      {renderItem(1)}
      {renderItem(2)}
      {renderItem(3)}
      {renderItem(4)}
      {renderItem(5)}
    </Grid>
  );
};

export default NotifyLoading;
