import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { AvatarControl } from "components/avatar"
import { ESize } from 'configs'
import { EditorControl } from 'components/editor'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs'
import { v4 as uuidv4 } from 'uuid'

const CommentByUser = (props) => {
    const { label, name, user = {}, control, getValues, setValue,
        isShow = true, isReplyComment = false, onCancel, parentId = null } = props
    const [comment, setComment] = useState(null)

    const onComment = () => {
        let comments = getValues && getValues('comments') || []
        if (_.isNil(parentId)) { //case add new comment
            comments.unshift({ value: comment, id: uuidv4(), user: user, isAddNew: true, childrens: [] })
            setValue('comments', comments)
        } else { //case reply comment
            var commentReply = _(comments)
                .thru(function (coll) {
                    return _.union(coll, _.map(coll, 'childrens') || []);
                })
                .flatten()
                .find({ id: parentId })
            if (!_.isNil(commentReply)) {
                if (!_.isEmpty(commentReply.childrens) && !_.isNil(commentReply.childrens)) {
                    commentReply.childrens.unshift({ value: comment, id: uuidv4(), user: user, isAddNew: true })
                } else {
                    commentReply.childrens = [{ value: comment, id: uuidv4(), user: user, isAddNew: true }]
                }
            }
            setValue('comments', comments)
        }
        if (isReplyComment) onCancel && onCancel()
    }

    const onChange = (value) => {
        setComment(value)
    }

    return (isShow ? <Grid container spacing={2} item>
        <Grid item container spacing={2} direction='row'>
            <Grid item>
                <AvatarControl size={ESize.medium} name={user.fullName}></AvatarControl>
            </Grid>
            <Grid item xs container spacing={2} direction='column'>
                <Grid item xs>
                    <EditorControl value={comment} onChange={onChange} label={label} name={name} isShowAccordion={false} />
                </Grid>
                {
                    isReplyComment ? <Grid item xs>
                        <ButtonFuntion onClick={onCancel} type={EButtonType.cancel} />
                        <ButtonFuntion onClick={onComment} type={EButtonType.reply} />
                    </Grid> : ''
                }
            </Grid>
        </Grid>
        <Grid item xs>
            {
                isReplyComment ? '' : <ButtonFuntion onClick={onComment} type={EButtonType.comment} />
            }
        </Grid>
    </Grid> : ''
    )
}

export default CommentByUser