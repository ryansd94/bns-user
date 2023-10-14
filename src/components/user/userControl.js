import React from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs";
import { LabelControl } from "components/label";
import { UserItem } from "components/user";
import _ from "lodash";

const UserControl = ({ size, onChange, disabled, control, name, label }) => {
  const loadingPopup = useSelector((state) => state.master.loadingPopup);

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) =>
        loadingPopup ? (
          <Skeleton
            width={"100%"}
            variant="text"
            size={size ? size : _ControlSizeDefault}
          >
            <div className="containerControl">
              {_TemplateVariant === EVariant.normal ? (
                label ? (
                  <LabelControl label={label} />
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <UserItem {...field?.value} />
            </div>
          </Skeleton>
        ) : (
          <div className="containerControl">
            {_TemplateVariant === EVariant.normal ? (
              label ? (
                <LabelControl label={label} />
              ) : (
                ""
              )
            ) : (
              ""
            )}
            <UserItem {...field?.value} />
          </div>
        )
      }
      control={control}
    />
  );
};

export default UserControl;
