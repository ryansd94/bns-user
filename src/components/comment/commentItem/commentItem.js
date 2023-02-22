import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { AvatarControl } from "components/avatar"
import { ESize } from 'configs'
import { EditorControl } from 'components/editor'
import { LabelControl } from 'components/label'
import { CommentFooter, CommentDeleteLabel } from './'
import { LinkControl } from 'components/link'
import { get, deleteData } from "services"
import { baseUrl, EButtonIconType, ERROR_CODE } from "configs"
import ButtonIcon from 'components/button/ButtonIcon'
import { PopoverControl } from 'components/popover'

const CommentItem = (props) => {
    const { comment = {}, taskId } = props
    const [commentLocal, setComment] = useState(comment)
    const [openPopover, setOpenPopover] = useState(null)

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
        return <Grid item xs>
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
                Bạn có muốn xóa bình luận này
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

    const renderRootComment = () => {
        if (!comment.isDelete) {
            return <Grid item xs className="comment-root">
                <LabelControl className='comment-header' label={`${commentLocal.user?.fullName}, ${commentLocal.updatedTime}`} />
                <EditorControl className='editor-comment' readOnly={true} value={commentLocal.value} name={`rte${commentLocal.id}`} isShowAccordion={false} />
                <CommentFooter {...props} id={commentLocal.id} />
            </Grid>
        }
        return <CommentDeleteLabel />
    }

    const handlePopoverClose = () => {
        setOpenPopover(null)
    }

    return !_.isEmpty(commentLocal) ? <div>
        <Grid className="comment-component" style={{ position: 'relative', paddingLeft: `${commentLocal.level * 60}px` }} item container spacing={2} direction='row'>
            <Grid item>
                <AvatarControl size={ESize.medium} name={commentLocal.user?.fullName} />
            </Grid>
            <Grid item xs container gap={2} direction='column'>
                {
                    renderRootComment()
                }
            </Grid>
            {
                !commentLocal.isDelete ? <ButtonIcon
                    onClick={onDeleteComment}
                    className={`icon-delete-comment ${!_.isNil(openPopover) ? 'icon-delete-comment-show' : ''}`}
                    color='delete' style={{ position: 'absolute', top: 0, right: 0 }}
                    type={EButtonIconType.delete} /> : ''
            }
            <PopoverControl className='pop-delete-comment' isHideWhenWithOutFocus={false} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} />
        </Grid>
        {
            renderListComment()
        }
    </div> : ''

}

export default CommentItem