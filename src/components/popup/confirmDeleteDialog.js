import * as React from "react";
import AlertDialog from "components/popup/AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import { loading as loadingButton } from "stores/components/button";
import { openMessage } from "stores/components/snackbar";
import { open as openAlert } from "stores/components/alert-dialog";
import { setReload } from "stores/views/master";
import { deleteData } from "services";
import { ERROR_CODE } from "configs";
import { setDeleteData } from "stores/views/master";

const ConfirmDeleteDialog = (props) => {
  const dispatch = useDispatch();
  const deleteItem = useSelector((state) => state.master.deleteData);

  const onAcceptDelete = async () => {
    if (!deleteItem || !deleteItem.id) return;
    dispatch(loadingButton(true));
    let res = await deleteData(deleteItem?.url, deleteItem?.id);
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setDeleteData({ id: null, url: null }));
      dispatch(setReload());
    }
    dispatch(openMessage({ ...res }));
    dispatch(openAlert({ open: false }));
    dispatch(loadingButton(false));
  };

  return <AlertDialog onSubmit={onAcceptDelete} />;
};

export default ConfirmDeleteDialog;
