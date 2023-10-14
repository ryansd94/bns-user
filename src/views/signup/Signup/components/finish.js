import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { getUserInfo } from "helpers";
import { useHistory } from "react-router-dom";

const Finish = () => {
  const [countdown, setCountdown] = useState(3);
  const { t } = useTranslation();
  const user = getUserInfo();
  const history = useHistory();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      history.push(`/${user.defaultOrganization?.code}/project`);
    }
  }, [countdown]);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container rowSpacing={2}>
        <Grid container gap={2} direction="column">
          <Grid item>
            <h1>{t("Sign up success")}</h1>
          </Grid>
          <Grid item>
            {countdown > 0 ? (
              <span>
                {t(
                  "The system will automatically log in after seconds",
                ).replace("{0}", countdown)}
              </span>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Finish;
