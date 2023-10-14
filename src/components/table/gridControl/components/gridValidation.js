import React, { useState, useEffect } from "react";
import { Alert } from "components/alert";
import eventEmitter from "helpers/eventEmitter";
import { useTranslation } from "react-i18next";
import { message } from "configs";
import _ from "lodash";

const GridValidation = (props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    eventEmitter.on("onErrorFormArray", onErrorFormArray);

    return () => {
      eventEmitter.off("onErrorFormArray");
    };
  }, []);

  const onErrorFormArray = (errors) => {
    if (!_.isEmpty(errors) && !_.isNil(errors)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return open === true ? (
    <Alert message={t(message.error.fieldNotEmpty)} />
  ) : (
    ""
  );
};

export default GridValidation;
