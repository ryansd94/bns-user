import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { AvatarControl } from "components/avatar"
import { ESize } from 'configs'
import { EditorControl } from 'components/editor'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs'
import { v4 as uuidv4 } from 'uuid'
import { deepFind } from "helpers/commonFunction"
import { post } from "services"
import { baseUrl, ERROR_CODE } from "configs"

const CommentByUser = (props) => {
    const { label, name, user = {}, control, getValues, setValue,
        isShow = true, isReplyComment = false, onCancel, parentId = null, taskId } = props
    const [commentLocal, setCommentLocal] = useState(null)

    const onComment = async () => {
        if (_.isEmpty(commentLocal)) return
        let comments = getValues && getValues('comments') || []
        const newComment = { value: commentLocal, id: uuidv4(), user: user, isAddNew: true, childrens: [] }
        if (_.isNil(parentId)) { //case add new comment
            newComment.level = 0
            comments.unshift(newComment)
            if (_.isNil(taskId)) {
                setValue('comments', comments)
            }
        } else { //case reply comment
            var commentReply = deepFind(comments, function (obj) {
                return obj.id === parentId;
            })
            if (!_.isNil(commentReply)) {
                newComment.level = commentReply.level + 1
                if (!_.isEmpty(commentReply.childrens) && !_.isNil(commentReply.childrens)) {
                    commentReply.childrens.unshift(newComment)
                } else {
                    commentReply.childrens = [newComment]
                }
            }
            if (_.isNil(taskId)) {
                setValue('comments', comments)
            }
        }
        if (!_.isNil(taskId)) {
            newComment.parentId = parentId
            newComment.taskId = taskId
            const res = await post(`${baseUrl.jm_comment}`, newComment)
            if (res.errorCode == ERROR_CODE.success) {
                setValue('comments', comments)
            }
        }
        if (isReplyComment) {
            onCancel && onCancel()
        }
    }

    const onChange = (value) => {
        if (_.isEqual(value, '<p><br></p>')) {
            value = null
        }
        setCommentLocal(value)
    }

    return (isShow ? <Grid container gap={2} item>
        <Grid item container gap={2} direction='row'>
            <Grid item>
                <AvatarControl name={user.fullName}></AvatarControl>
            </Grid>
            <Grid item xs container gap={2} direction='column'>
                <Grid item xs>
                    <EditorControl value={commentLocal} onChange={onChange} label={label} name={parentId ? parentId : name} isShowAccordion={false} />
                </Grid>
                {
                    isReplyComment ? <Grid item xs>
                        <ButtonFuntion onClick={onCancel} type={EButtonType.cancel} />
                        <ButtonFuntion disabled={_.isEmpty(commentLocal) ? true : false} onClick={onComment} type={EButtonType.reply} />
                    </Grid> : ''
                }
            </Grid>
        </Grid>
        <Grid item xs>
            {
                isReplyComment ? '' : <ButtonFuntion disabled={_.isEmpty(commentLocal) ? true : false} onClick={onComment} type={EButtonType.comment} />
            }
        </Grid>
    </Grid> : ''
    )
}

export default CommentByUser