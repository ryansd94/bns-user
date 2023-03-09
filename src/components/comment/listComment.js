import React, { useEffect, useState } from "react"
import _ from "lodash"
import { CommentItem } from './commentItem'
import Grid from "@mui/material/Grid"

const ListComment = (props) => {
    const { comments = [] } = props

    return (
        <Grid direction='column'container gap={2} item>
            {
                _.map(comments, (comment) => {
                    return <Grid key={comment.id} item className="comment-container">
                        <CommentItem comment={comment} {...props} />
                    </Grid>
                })
            }
        </Grid>
    )
}

export default ListComment