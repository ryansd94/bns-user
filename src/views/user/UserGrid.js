import React, { useState } from "react"
import GridData from "components/table/GridData"
import { useTranslation } from "react-i18next"
import { sendMailUser } from "services"
import { useSelector, useDispatch } from "react-redux"
import { openMessage } from "stores/components/snackbar"
import { ERROR_CODE, EUserStatus, baseUrl } from "configs"
import { open as openAlert } from "stores/components/alert-dialog"
import { formatDate } from "helpers/commonFunction"
import { UserProfile, UserStatus } from './userGridComponents'
import { CellButton } from 'components/cellRender'
import { EButtonIconType } from "configs"

const UserGrid = React.memo((props) => {
  console.log("render user grid")
  const { filterModels } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const columnVisibility = { ...useSelector((state) => state.user.columnVisibility) }
  const [id, setId] = useState(null)
  const [status, setStatus] = useState(null)

  const onSendMail = async (email) => {
    const res = await sendMailUser({ emails: [email] })
    if (res.errorCode == ERROR_CODE.success) {
    }
    dispatch(openMessage({ ...res }))
  }

  const [columns, setColumn] = useState([
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
        const onBlockClick = (sta) => {
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

        const listButton = [
          { type: EButtonIconType.email, onClick: onSendMailClick, disabled: _status == EUserStatus.WAILTING_CONFIRM_MAIL ? false : true }
        ]

        if (_status == EUserStatus.ACTIVE) {
          listButton.push({ type: EButtonIconType.lock, onClick: () => onBlockClick(EUserStatus.BLOCK), disabled: _isMainAccount ? _isMainAccount : (_status == EUserStatus.WAILTING_CONFIRM_MAIL ? true : false) })
        } else {
          listButton.push({ type: EButtonIconType.unLock, onClick: () => onBlockClick(EUserStatus.ACTIVE), disabled: _isMainAccount ? _isMainAccount : (_status == EUserStatus.WAILTING_CONFIRM_MAIL ? true : false) })
        }

        return <strong>
          <CellButton isDeleteShow={!_isMainAccount} listButton={listButton} id={params.data.id} isEditShow={false} url={baseUrl.jm_template} />
        </strong>
      },
      sortable: false,
    },
  ])

  return (
    <>
      <GridData
        url={baseUrl.jm_user}
        columnVisibility={columnVisibility}
        columns={columns}
        filterModels={filterModels}></GridData>
    </>
  )
})

export default UserGrid
