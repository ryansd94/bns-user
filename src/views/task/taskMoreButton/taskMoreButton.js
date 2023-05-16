import React, { useEffect, useState } from "react"
import { DropdownMenu, DropDownItem } from 'components/dropdown'
import { useTranslation } from "react-i18next"
import { EButtonIconType } from 'configs'
import { IconChange, IconCopy } from "components/icon/icon"
import { ChangeTaskTypePopup, CopyTaskPopup } from './'
import { useDispatch } from "react-redux"
import _ from 'lodash'

const TaskMoreButton = (props) => {
    const { taskId } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [openTaskTypePopup, setOpenTaskTypePopup] = useState(false)
    const [openCopyTaskPopup, setOpenCopyTaskPopup] = useState(false)

    const onOpenTaskTypePopup = () => {
        setOpenTaskTypePopup(true)
    }

    const onOpenCopyTaskPopup = () => {
        setOpenCopyTaskPopup(true)
    }

    const onCloseTaskTypePopup = () => {
        setOpenTaskTypePopup(false)
    }

    const onCloseCopyTaskPopup = () => {
        setOpenCopyTaskPopup(false)
    }

    const genderDropdownItem = () => {
        return <div>
            {
                !_.isNil(taskId) ?
                    (
                        <div>
                            <DropDownItem
                                onClick={onOpenTaskTypePopup}
                                icon={<IconChange />}
                                title={t('Change task type')} />
                            <DropDownItem
                                onClick={onOpenCopyTaskPopup}
                                icon={<IconCopy />}
                                title={t('Copy task')} />
                        </div>
                    )
                    : ''
            }
        </div>
    }

    return (
        <div>
            <DropdownMenu spacingLeft={0} isTextAndIcon={false} type={EButtonIconType.more} isShowEndIcon={false} visible={true} genderDropdownItem={genderDropdownItem} />
            <ChangeTaskTypePopup handleClose={onCloseTaskTypePopup} open={openTaskTypePopup} {...props} />
            <CopyTaskPopup handleClose={onCloseCopyTaskPopup} open={openCopyTaskPopup} {...props} />
        </div>
    )
}

export default TaskMoreButton