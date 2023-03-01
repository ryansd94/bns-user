import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { EButtonIconType, EButtonType } from 'configs'
import { CommentByUser } from 'components/comment'
import ButtonIcon from 'components/button/ButtonIcon'
import ButtonFuntion from 'components/button/ButtonFuntion'

const CommentFooter = (props) => {
    const { label, name, user = {}, control, getValues, setValue, id, isEditComment, comment, onCancelEdit, onConfrimChangeComment } = props
    const [isShowComment, setIsShowComment] = useState(false)
    const [isShowReply, setIsShowReply] = useState(true)

    const onReply = () => {
        setIsShowComment(true)
        setIsShowReply(false)
    }

    const onCancel = () => {
        setIsShowComment(false)
        setIsShowReply(true)
    }

    return <Grid container gap={2} item xs>
        {
            isShowComment ? <Grid item xs>
                <CommentByUser parentId={id} isReplyComment={true} onCancel={onCancel} isShow={isShowComment} {...props} />
            </Grid> : ''
        }
        {
            isEditComment ? <Grid item container justifyContent={'space-between'}>
                <ButtonFuntion onClick={onCancelEdit} type={EButtonType.cancel} />
                <ButtonFuntion onClick={onConfrimChangeComment} disabled={_.isEmpty(comment?.value) ? true : false} type={EButtonType.save} />
            </Grid> : ''
        }
        {isShowReply ? <Grid item xs container justifyContent={'flex-end'}>
            <ButtonIcon onClick={onReply} type={EButtonIconType.comment} />
        </Grid> : ''}

    </Grid>
}

export default CommentFooter