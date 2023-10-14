import React, { useEffect, useState } from "react";
import SelectControl from "components/select/SelectControl";
import StatusItem from "views/category/status/statusItem";
import { useTranslation } from "react-i18next";

const StatusSelect = (props) => {
  const { options = [] } = props;
  const { t } = useTranslation();
  return (
    <SelectControl
      options={options}
      {...props}
      isSearchText={false}
      placeholder={t("Status")}
      renderOptions={(option) => {
        return <StatusItem status={option} />;
      }}
      renderValue={(value) => {
        const item = options.find((item) => {
          return item.id === value;
        });
        return <StatusItem status={item} />;
      }}
    />
  );
};

export default StatusSelect;
