import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { AvatarControl } from "components/avatar"
import { ESize } from 'configs'
import { EditorControl } from 'components/editor'
import { LabelControl } from 'components/label'
import { CommentFooter } from './'

const CommentItem = (props) => {
    const { comment = {} } = props

    return (
        !_.isEmpty(comment) ? <Grid item container spacing={2} direction='row'>
                <Grid item>
                    <AvatarControl size={ESize.medium} name={comment.user?.fullName}></AvatarControl>
                </Grid>
                <Grid item xs container spacing={2} direction='column'>
                    <Grid item xs className="comment-root">
                        <LabelControl className='comment-header' label={`${comment.user?.fullName}, ${comment.updatedTime}`} />
                        <EditorControl className='editor-comment' readOnly={true} value={comment.value} name={`rte${comment.id}`} isShowAccordion={false} />
                        <CommentFooter {...props} id={comment.id} />
                    </Grid>
                    {
                        !_.isEmpty(comment.childrens) ? <Grid item>
                            {
                                _.map(comment.childrens, (child) => {
                                    return <CommentItem {...props} key={child.id} comment={child} />
                                })
                            } </Grid> : ''
                    }
                </Grid>
            </Grid> : ''
    )
}

export default CommentItem