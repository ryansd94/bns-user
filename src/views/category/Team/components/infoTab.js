import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import SingleAddSelect from "components/select/SingleAddSelect";
import TextInput from "components/input/TextInput";
import { useTranslation } from "react-i18next";
import CustomTreeView from "components/treeview/customTreeView";

const InfoTab = (props) => {
  const { t } = useTranslation();
  const { control, dataTeam, onValueChange } = props;

  return (
    <Grid container gap={2}>
      <Grid item container gap={2}>
        <Grid item xs>
          <TextInput
            autoFocus={true}
            required={true}
            control={control}
            label={t("Team name")}
            name="name"
            onChange={onValueChange}
          />
        </Grid>
        <Grid item xs>
          <CustomTreeView
            name="parentId"
            control={control}
            options={dataTeam}
            label={t("Team parent")}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextInput
          control={control}
          label={t("Description")}
          name="description"
          onChange={onValueChange}
        />
      </Grid>
      {/* <Grid item xs={12}>
            <SingleAddSelect
                isAddWhenNoOption={false}
                data={dataTeam}
                control={control}
                name="parentId"
                label={t("Team parent")}
                onSelectChange={onValueChange}
            />
        </Grid> */}
    </Grid>
  );
};

export default InfoTab;
