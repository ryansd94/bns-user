import { EButtonType } from "configs"
import { DropdownMenu } from 'components/dropdown'
import { DropDownItem } from 'components/dropdown'
import { useTranslation } from 'react-i18next'
import { IconActive, IconDelete, IconSetting } from 'components/icon/icon'
import { put, deleteData } from 'services'
import { baseUrl } from "configs"
import { updateReadAllNotify, reloadNotify } from "stores/components/notify"
import { useDispatch } from "react-redux"
import _ from 'lodash'

const NotifyActionButton = (props) => {
    const { user } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const onMarkAllRead = async () => {
        await put(`${baseUrl.jm_notifyUser}/read-all`, { id: user.userId }).then((data) => {
            dispatch(updateReadAllNotify())
        })
    }

    const onDeleteRead = async () => {
        await deleteData(`${baseUrl.jm_notifyUser}/delete-read`, user.userId).then((data) => {
            dispatch(reloadNotify())
        })
    }

    const onSetting = () => {

    }

    const genderDropdownItem = () => {
        return <>
            <DropDownItem icon={<IconActive />} onClick={onMarkAllRead} title={t('Mark all read')} />
            <DropDownItem icon={<IconDelete />} onClick={onDeleteRead} title={t('Delete read notifications')} />
            <DropDownItem icon={<IconSetting />} onClick={onSetting} title={t('Notification settings')} />
        </>
    }

    return <>
        <DropdownMenu
            isCloseOnClick={true}
            isTextAndIcon={false}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            type={EButtonType.more}
            isShowEndIcon={false}
            visible={true}
            genderDropdownItem={genderDropdownItem} />
    </>
}

export default NotifyActionButton