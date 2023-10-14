import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import ButtonFuntion from "components/button/ButtonFuntion";
import { EButtonType } from "configs";
import { TextInput } from "components/input";
import { CheckBoxControl } from "components/checkbox";
import _ from "lodash";

const SettingControl = React.memo((props) => {
  const { index, onApply, prefix, item = {} } = props;
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    // title: Yup.string().required(t(message.error.fieldNotEmpty))
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!_.isNil(item)) {
      setValue("label", item.label);
      setValue("required", item.required);
    }
  }, [item]);

  const onSave = (data) => {
    onApply(data, index, prefix, item);
  };

  return (
    <Grid
      className="flex-container"
      container
      direction={"column"}
      style={{ padding: "1rem", gap: "1rem" }}
    >
      <Grid item>
        <TextInput
          required={true}
          label={t("Title")}
          control={control}
          name="label"
        />
      </Grid>
      {item.defaultReadonly === true ? (
        ""
      ) : (
        <Grid item>
          <CheckBoxControl
            label={t("Required")}
            control={control}
            name="required"
          />
        </Grid>
      )}
      <Grid item>
        <ButtonFuntion
          style={{ marginRight: "auto" }}
          onClick={handleSubmit(onSave)}
          type={EButtonType.apply}
        />
      </Grid>
    </Grid>
  );
});
export default SettingControl;
