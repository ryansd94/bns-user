import React from "react";
import ContentLoader from "react-content-loader";
import Grid from "@mui/material/Grid";
import { List } from "react-content-loader";
const SkeletonLoading = () => (
  <div style={{ width: "100%" ,height:"100%"}}>
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <ContentLoader
          speed={2}
          viewBox="0 0 400 160"
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
        >
          <rect
            x="0"
            y="0"
            rx="3"
            ry="3"
            width="600"
            height="56"
          />
          <rect x="0" y="3rem" rx="3" ry="3" width="600" height="56" />
          <rect x="0" y="6rem" rx="3" ry="3" width="600" height="56" />
        </ContentLoader>
      </Grid>
    </Grid>
  </div>
);

const SkeletonLoading2 = () => (
  <div style={{ width: "100%" }}>
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <List viewBox="0 0 400 160" />
      </Grid>
    </Grid>
  </div>
);
export default SkeletonLoading;
