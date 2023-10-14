import { IconBell } from "components/icon/icon";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";

const NotifyEmpty = () => {
  const { t } = useTranslation();

  return (
    <Grid container direction={"column"} alignItems="center" item gap={2}>
      <Grid item>
        <IconBell className={"notify-icon-empty"} />
      </Grid>
      <Grid>
        <h3>{t("You don't have any notifications")}</h3>
      </Grid>
    </Grid>
  );
};

export default NotifyEmpty;
