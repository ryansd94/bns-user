import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { AvatarControl } from "components/avatar"
import { ESize } from 'configs'
import { EditorControl } from 'components/editor'
import { LabelControl } from 'components/label'
import { CommentFooter, CommentDeleteLabel } from './'
import { LinkControl } from 'components/link'
import { get, deleteData, save } from "services"
import { baseUrl, EButtonIconType, ERROR_CODE } from "configs"
import ButtonIcon from 'components/button/ButtonIcon'
import { PopoverControl } from 'components/popover'
import { useTranslation } from "react-i18next"
import { DropdownMenu, DropDownItem } from 'components/dropdown'
import { IconDelete, IconEdit } from 'components/icon/icon'
import {
    getUserInfo
} from "helpers"

const CommentItem = (props) => {
    const { comment = {}, taskId } = props
    const [commentLocal, setComment] = useState(comment)
    const [openPopover, setOpenPopover] = useState(null)
    const [isEditComment, setIsEditComment] = useState(false)
    const { t } = useTranslation()
    const user = getUserInfo()

    const onShowMoreComment = async () => {
        await get(`${baseUrl.jm_comment}/children`, {
            parentId: comment.id,
            isGetAll: true
        }).then((data) => {
            commentLocal.countReply = 0
            if (_.isEmpty(commentLocal.children)) {
                commentLocal.childrens = data && data.data && data.data.items
            } else {
                commentLocal.childrens.push(data && data.data && data.data.items)
            }
            setComment({ ...commentLocal })
        })
    }

    useEffect(() => {
        setComment(comment)
    }, [comment])

    useEffect(() => {
        renderListComment()
    }, [commentLocal])

    const renderChildComment = (comment) => {
        if (!_.isEmpty(comment.childrens)) {
            return <Grid item container gap={2} direction='column'>
                {
                    _.map(comment.childrens, (child) => {
                        return <CommentItem {...props} key={child.id} comment={child} />
                    })
                } </Grid>
        }
        return ''
    }

    const renderMoreChildLink = () => {
        return <Grid item xs style={{ paddingLeft: `${commentLocal.level * 60}px` }}>
            <LinkControl underline='none' onClick={onShowMoreComment} title={`Hiển thị ${commentLocal.countReply} trả lời`} />
        </Grid>
    }

    const renderListComment = () => {
        if (!_.isNil(taskId)) {
            if (commentLocal.countReply > 0) {
                return <div>{renderChildComment(commentLocal)}{renderMoreChildLink()}</div>
            } else {
                return renderChildComment(commentLocal)
            }
        } else {
            return renderChildComment(commentLocal)
        }
    }

    const onConfrimDeleteComment = async () => {
        const res = await deleteData(baseUrl.jm_comment, comment.id)
        if (res.errorCode == ERROR_CODE.success) {
            handlePopoverClose()
            commentLocal.isDelete = true
            setComment({ ...commentLocal })
        }
    }

    const genderPopoverControl = () => {
        return <Grid item container gap={2} className='box-container'>
            <Grid item>
                {t('Bạn có muốn xóa bình luận này?')}
            </Grid>
            <Grid item container justifyContent='space-between'>
                <Grid item>
                    <ButtonIcon
                        onClick={handlePopoverClose}
                        type={EButtonIconType.cancel}
                        color="neutral"
                    />
                </Grid>
                <Grid item>
                    <ButtonIcon
                        onClick={onConfrimDeleteComment}
                        type={EButtonIconType.apply}
                        color="primary"
                    />
                </Grid>
            </Grid>
        </Grid>
    }

    const onDeleteComment = (event) => {
        setOpenPopover(event.currentTarget)
    }

    const onEditComment = () => {
        setIsEditComment(true)
    }

    const onCancelEdit = () => {
        setIsEditComment(false)
    }

    const onChangeComment = (value) => {
        commentLocal.value = value
        setComment({ ...commentLocal })
    }

    const onConfrimChangeComment = async () => {
        const res = await save(`${baseUrl.jm_comment}`, commentLocal)
        if (res.errorCode == ERROR_CODE.success) {
            // setValue('comments', comments)
            setIsEditComment(false)
        }
    }

    const renderRootComment = () => {
        if (!comment.isDelete) {
            return <Grid item xs className="comment-root" container flexDirection={'column'} gap={2}>
                <Grid item>
                    <LabelControl className='comment-header' label={`${commentLocal.user?.fullName}, ${commentLocal.updatedTime}`} />
                </Grid>
                <Grid item>
                    <EditorControl onChange={onChangeComment} className={!isEditComment ? 'editor-comment' : ''} readOnly={!isEditComment} value={commentLocal.value} name={`rte${commentLocal.id}`} isShowAccordion={false} />
                </Grid>
                <Grid item>
                    <CommentFooter onCancelEdit={onCancelEdit} {...props} id={commentLocal.id} onConfrimChangeComment={onConfrimChangeComment} isEditComment={isEditComment} />
                </Grid>
            </Grid>
        }
        return <CommentDeleteLabel />
    }

    const handlePopoverClose = () => {
        setOpenPopover(null)
    }

    const genderDropdownItem = () => {
        return <div>
            <DropDownItem
                icon={<IconDelete className="icon-dropdown-menu" />}
                onClick={onDeleteComment}
                title={t('Xóa bình luận')} />
            <DropDownItem
                icon={<IconEdit className="icon-dropdown-menu" />}
                onClick={onEditComment}
                title={t('Chỉnh sửa bình luận')} />
        </div>
    }

    return !_.isEmpty(commentLocal) ? <Grid item xs container gap={2}>
        <Grid className="comment-component" style={{ position: 'relative', paddingLeft: `${commentLocal.level * 60}px` }} item container spacing={2} direction='row'>
            <Grid item>
                <AvatarControl name={commentLocal.user?.fullName} />
            </Grid>
            <Grid item xs container gap={2} direction='column'>
                {
                    renderRootComment()
                }
            </Grid>
            {
                !commentLocal.isDelete && user.userId === comment.createdUserId ? <DropdownMenu
                    classNameIcon='icon-more-comment'
                    genderDropdownItem={genderDropdownItem}
                    className={`dropdown-more-comment ${!_.isNil(openPopover) ? 'dropdown-more-comment-show' : ''}`}
                    isButtonIcon={true}
                    type={EButtonIconType.more} />
                    : ''
            }
            <PopoverControl className='pop-delete-comment' isHideWhenWithOutFocus={false} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} />
        </Grid>
        {
            renderListComment()
        }
    </Grid> : ''

}

export default CommentItem