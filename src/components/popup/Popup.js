import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { useSelector, useDispatch } from "react-redux";
import { close } from "components/popup/popupSlice";
import { setEditData } from "stores/views/master";
import { EButtonDetailType, EWidth } from "configs";
import eventEmitter from "helpers/eventEmitter";
import PopupContent from "./popupContent";
import _ from "lodash";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const Popup = React.memo((props) => {
  const dispatch = useDispatch();
  const {
    ModalBody,
    open = null,
    title = null,
    onSave,
    widthSize = EWidth.sm,
    reset,
    typeSave = EButtonDetailType.save,
    isShowFooter = true,
    handleClose = null,
    labelSave = "",
    disabledSave = false,
    removeOnChangeDisabled = true,
    id,
  } = props;
  const stateOpen = !_.isNil(open)
    ? open
    : useSelector((state) => state.popup.open);
  const [openPopup, setOpen] = useState(open);
  const [disabled, setDisabled] = useState(disabledSave);
  const stateTitle = !_.isNil(title)
    ? title
    : useSelector((state) => state.popup.title);
  const editData = useSelector((state) => state.master.editData);

  const onClose = () => {
    if (_.isNil(handleClose)) {
      if (openPopup === null) {
        dispatch(close());
      } else {
        setOpen(false);
      }
      if (!_.isNil(editData)) {
        dispatch(setEditData(null));
      }
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    setDisabled(disabledSave);
  }, [disabledSave]);

  useEffect(() => {
    setDisabled(disabledSave);
    if (!_.isNil(open)) {
      setOpen(open);
    }
  }, [open]);

  useEffect(() => {
    if (stateOpen === false) {
      onClose();
      reset && reset();
      setDisabled(disabledSave);
    }
  }, [stateOpen]);

  const handleSave = () => {
    onSave && onSave();
    // if (!_.isNil(editData)) {
    //   onClose()
    // }
  };

  useEffect(() => {
    eventEmitter.on("onChangeDisabled", onChangeDisabled);

    return () => {
      if (removeOnChangeDisabled === true) {
        eventEmitter.off("onChangeDisabled");
      }
    };
  }, []);

  const onChangeDisabled = (disabled) => {
    setDisabled(disabled);
  };

  return (!_.isNil(openPopup) ? openPopup === true : stateOpen === true) ===
    true ? (
    <div>
      <BootstrapDialog
        maxWidth={widthSize}
        fullWidth={true}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        open={!_.isNil(openPopup) ? openPopup : stateOpen}
        onClose={onClose}
      >
        <PopupContent
          ModalBody={ModalBody}
          isShowFooter={isShowFooter}
          title={stateTitle}
          onClose={onClose}
          handleSave={handleSave}
          typeSave={typeSave}
          disabled={disabled}
          labelSave={labelSave}
          id={id}
        />
      </BootstrapDialog>
    </div>
  ) : (
    ""
  );
});

Popup.propTypes = {
  onSave: PropTypes.func.isRequired,
  ModalBody: PropTypes.func.isRequired,
  widthSize: PropTypes.string,
};

export default Popup;
