import * as React from "react"
import AlertDialog from "components/popup/AlertDialog"
import { useDispatch } from "react-redux"
import { loading as loadingButton } from "stores/components/button"
import { openMessage } from "stores/components/snackbar"
import { open as openAlert } from "stores/components/alert-dialog"
import {
    setReload,
} from "stores/views/master"
import { deleteData } from "services"
import { ERROR_CODE } from "configs"

const ConfirmDeleteDialog = (props) => {
    const { url, id } = props
    const dispatch = useDispatch()

    const onAcceptDelete = async () => {
        dispatch(loadingButton(true))
        const res = await deleteData(url, id)
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
        dispatch(openMessage({ ...res }))
        dispatch(openAlert({ open: false }))
        dispatch(loadingButton(false))
    }

    return <AlertDialog onSubmit={onAcceptDelete} />
}

export default ConfirmDeleteDialog