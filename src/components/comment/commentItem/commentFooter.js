import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { EButtonIconType } from 'configs'
import { CommentByUser } from 'components/comment'
import ButtonIcon from 'components/button/ButtonIcon'

const CommentFooter = (props) => {
    const { label, name, user = {}, control, getValues, setValue, id } = props
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

    return <Grid container spacing={2} item>
        {isShowReply ? <Grid item container direction='row-reverse'>
            <ButtonIcon onClick={onReply} type={EButtonIconType.comment} />
        </Grid> : ''}
        <Grid item xs>
            <CommentByUser parentId={id} isReplyComment={true} onCancel={onCancel} isShow={isShowComment} {...props} />
        </Grid>
    </Grid>
}

export default CommentFooter