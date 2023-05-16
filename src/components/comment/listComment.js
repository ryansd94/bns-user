import React, { useEffect, useState } from "react"
import _ from "lodash"
import { CommentItem } from './commentItem'
import Grid from "@mui/material/Grid"
import { useLocation } from "react-router-dom"
import queryString from "query-string"

const ListComment = (props) => {
    const { comments = [] } = props
    const { search } = useLocation()
    const { viewId } = queryString.parse(search)

    useEffect(() => {
        if (!_.isNil(viewId)) {
            // Tìm phần tử có id tương ứng
            const targetElement = document.getElementById(viewId)

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [])
    
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