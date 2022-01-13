import React, { useEffect, useState, useMemo, useCallback } from "react";

import Popup from "components/popup/Popup";
import SkeletonLoading from "components/loader/SkeletonLoading";
import Grid from "@mui/material/Grid";
import SingleSelect from "components/select/SingleSelect";
import PropTypes from "prop-types";

import TextInput from "components/input/TextInput";
import { useTranslation } from "react-i18next";

const TeamPopup = React.memo((props) => {
  console.log("render team popup");
  const { t } = useTranslation();

  const { onSubmit, control,dataTeam } = props;

  function ModalBody() {
    return (
      
      <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <TextInput
          autoFocus={true}
          required={true}
          control={control}
          label={t("Tên nhóm")}
          name="name"
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          control={control}
          label={t("Ghi chú")}
          name="description"
        />
      </Grid>
      <Grid item xs={12}>
        <SingleSelect
          data={dataTeam}
          control={control}
          name="parentId"
          label={t("Nhóm cha")}
        />
      </Grid>
    </Grid>
    );
  }
  return (
    <div>
      <Popup ModalBody={ModalBody} widthSize={"sm"} onSave={onSubmit} />
    </div>
  );
});

TeamPopup.propTypes = {
  onSubmit: PropTypes.func,
  control: PropTypes.object,
  dataTeam: PropTypes.array,
};

TeamPopup.defaultProps = {
  dataTeam: []
};
export default TeamPopup;
