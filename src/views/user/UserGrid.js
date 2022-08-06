import React, { useEffect, useState, useRef, useCallback } from "react"
import GridData from "components/table/GridData"

import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { sendMailUser, updateUserStatus, deleteUser, getUser } from "services"
import { useSelector, useDispatch } from "react-redux"
import AlertDialog from "components/popup/AlertDialog"
import { ChipControl } from "components/chip"
import { openMessage } from "stores/components/snackbar"
import { ERROR_CODE, EUserStatus, EAlertPopupType } from "configs"
import {
  setLoading,
  setReload,
  setPage,
} from "stores/views/master"
import { open as openAlert } from "stores/components/alert-dialog"
import { loading as loadingButton } from "stores/components/button"
import { formatDate } from "helpers/commonFunction"
import {
  setToolbarVisibility,
} from "stores/views/user"
import { UserProfile, UserStatus } from './userGridComponents'


const UserGrid = React.memo((props) => {
  console.log("render user grid")
  const { filterModels } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const columnVisibility = { ...useSelector((state) => state.user.columnVisibility) }
  const toolbarVisible = { ...useSelector((state) => state.user.toolbarVisible) }
  const [alertType, setAlertType] = useState(0)
  const [id, setId] = useState(null)
  const [status, setStatus] = useState(null)

  const [data, setData] = React.useState({})
  const page = useSelector((state) => state.master.page)
  const pageSize = useSelector((state) => state.master.pageSize)
  const loading = useSelector((state) => state.master.loading)
  const sortModel = useSelector((state) => state.master.sortModel)
  const filterModel = useSelector((state) => state.user.filters)

  const gridRef = useRef()
  const isReload = useSelector((state) => state.master.isReload)
  useEffect(() => {
    fetchData()
  }, [page, sortModel, isReload, filterModels])



  const fetchData = async () => {
    dispatch(setLoading(true))
    await getUser({
      draw: page,
      start: page == 0 ? 0 : page * pageSize,
      length: pageSize,
      fieldSort:
        sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
      sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
      filters: JSON.stringify(filterModels)
    }).then((data) => {
      dispatch(setLoading(false))
      setData(data)
    })
  }
  const onAcceptDelete = async () => {
    dispatch(loadingButton(true))
    var res = null
    if (alertType == 1)
      res = await deleteUser(id)
    else if (alertType == EAlertPopupType.UPDATE_STATUS)
      res = await updateUserStatus({ id: id, status: status })

    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setReload())
    }
    dispatch(openMessage({ ...res }))
    dispatch(openAlert({ open: false }))
    dispatch(loadingButton(false))
  }
  const onSendMail = async (email) => {
    const res = await sendMailUser({ emails: [email] })
    if (res.errorCode == ERROR_CODE.success) {
    }
    dispatch(openMessage({ ...res }))
  }

  const onSelectionChange = (newSelection) => {
    let selectedNodes = newSelection.api.getSelectedNodes()
    let selectedData = selectedNodes.map(node => node.data)
    if (selectedData.length > 0) {
      toolbarVisible.function = true
    }
    else {
      toolbarVisible.function = false
    }
    dispatch(setToolbarVisibility({ ...toolbarVisible }))
  }


  const [column3, setColumn] = useState([
    {
      checkboxSelection: true,
      resizable: false, width: 40, headerCheckboxSelection: true, pinned: 'left'
    },
    {
      field: "email",
      headerName: t("Email"),
      pinned: 'left',
      flex: 1,
      cellRenderer: (params) => {
        return <UserProfile
          user={params.data} >
        </UserProfile >
      },
    },
    {
      field: "fullName", headerName: t("Họ tên"),
      flex: 1
    },
    {
      field: "teamName", headerName: t("Nhóm"),
      width: 170,
    },
    {
      field: "status",
      width: 170,
      headerName: t("Trạng thái"),
      cellRenderer: (params) => {
        return <UserStatus status={params.data.status} />
      },
    },
    {
      field: "createdDate",
      width: 150,
      headerName: t("Ngày tạo"),
      cellRenderer: (params) => {
        return formatDate(params.data.createdDate)
      },
    },
    {
      field: "edit",
      width: 150,
      headerName: "",
      resizable: false,
      cellRenderer: (params) => {
        const onSendMailClick = (e) => {
          if (!params) return
          onSendMail(params.data.email)
        }
        const onDeleteClick = (e) => {
          setAlertType(EAlertPopupType.DELETE)
          setId(params.data.id)
          dispatch(openAlert({ open: true }))
        }
        const onBlockClick = (sta) => {
          setAlertType(EAlertPopupType.UPDATE_STATUS)
          setId(params.data.id)
          setStatus(sta)
          dispatch(
            openAlert({
              open: true,
              title: sta == EUserStatus.BLOCK ? t("Bạn có chắc khóa người dùng này?") : t("Bạn có chắc mở khóa người dùng này?"),
            })
          )
        }
        const _status = params.data.status
        const _isMainAccount = params.data.isMainAccount
        const deleteElement = (
          <ButtonIcon
            disabled={_isMainAccount}
            onClick={onDeleteClick}
            type="Delete"
          ></ButtonIcon>
        )
        const emailElement = (
          <ButtonIcon
            onClick={onSendMailClick}
            disabled={
              _status == EUserStatus.WAILTING_CONFIRM_MAIL ? false : true
            }
            title={t("Gửi mail xác nhận")}
            type="Email"
          />
        )

        const blockElement = (
          <ButtonIcon
            onClick={() => onBlockClick(EUserStatus.BLOCK)}
            disabled={_isMainAccount ? _isMainAccount : (_status == EUserStatus.WAILTING_CONFIRM_MAIL ? true : false)}
            type="Lock"
            title={t("Khóa")}
          />
        )
        const unBlockElement = (
          <ButtonIcon
            onClick={() => onBlockClick(EUserStatus.ACTIVE)}
            disabled={_isMainAccount ? _isMainAccount : (_status == EUserStatus.WAILTING_CONFIRM_MAIL ? true : false)}
            type="UnLock"
            title={t("Mở khóa")}
          />
        )
        return React.createElement(
          "div",
          {},
          deleteElement,
          emailElement,
          _status == EUserStatus.ACTIVE ? blockElement : unBlockElement
        )
      },
      sortable: false,
    },
  ])

  useEffect(() => {
    column3.map((item) => {
      if (item.field) {
        gridRef.current.columnApi && gridRef.current.columnApi.setColumnVisible(item.field, columnVisibility[item.field])
      }
    })
    setColumn(column3)
  }, [columnVisibility])

  const onPageChange = (param) => {
    dispatch(setPage(param - 1))
  }
  return (
    <div style={{ width: "100%" }}>
      <AlertDialog onSubmit={onAcceptDelete} />
      <GridData
        gridRef={gridRef}
        loading={loading}
        filters={filterModel}
        columns={column3}
        onSelectionChanged={onSelectionChange}
        onPageChange={onPageChange}
        currentPage={page}
        pageSize={pageSize}
        totalCount={data && data.recordsTotal}
        rows={data && data.data && data.data.items}></GridData>
    </div>
  )
})

export default UserGrid
