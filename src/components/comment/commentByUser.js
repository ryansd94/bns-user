import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { AvatarControl } from "components/avatar"
import { EditorControl } from "components/editor"
import ButtonFuntion from "components/button/ButtonFuntion"
import { EButtonType } from "configs"
import { v4 as uuidv4 } from "uuid"
import { deepFind } from "helpers/commonFunction"
import { post } from "services"
import { baseUrl, ERROR_CODE, message } from "configs"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"

const CommentByUser = (props) => {
  console.log("render CommentByUser")
  const {
    label,
    name,
    user = {},
    getValues,
    setValue,
    isShow = true,
    isReplyComment = false,
    onCancel,
    parentId = null,
    taskId,
    userSuggest,
  } = props
  const { t } = useTranslation()
  const controlId = parentId ? parentId : name
  let validateObject = {}
  validateObject[controlId] = Yup.string().required(
    t(message.error.fieldNotEmpty),
  )
  const [commentLocal, setCommentLocal] = useState(null)
  const validationSchema = Yup.object().shape({ ...validateObject })
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  })

  useEffect(() => {
    setError(controlId, { message: t(message.error.fieldNotEmpty) })

    return () => {
      setError(controlId, null)
    }
  }, [])

  const onComment = async (value) => {
    if (_.isEmpty(value[controlId])) return
    let comments = (getValues && getValues("comments")) || []
    const newComment = {
      value: value[controlId],
      id: uuidv4(),
      user: user,
      isAddNew: true,
      childrens: [],
      createdDate: new Date(),
    }
    if (_.isNil(parentId)) {
      //case add new comment
      newComment.level = 0
      comments.unshift(newComment)
      if (_.isNil(taskId)) {
        setValue("comments", comments)
      }
    } else {
      //case reply comment
      var commentReply = deepFind(comments, function (obj) {
        return obj.id === parentId
      })
      if (!_.isNil(commentReply)) {
        newComment.level = commentReply.level + 1
        if (
          !_.isEmpty(commentReply.childrens) &&
          !_.isNil(commentReply.childrens)
        ) {
          commentReply.childrens.unshift(newComment)
        } else {
          commentReply.childrens = [newComment]
        }
      }
      if (_.isNil(taskId)) {
        setValue("comments", comments)
      }
    }
    if (!_.isNil(taskId)) {
      newComment.parentId = parentId
      newComment.taskId = taskId
      const res = await post(`${baseUrl.jm_comment}`, newComment)
      if (res.errorCode == ERROR_CODE.success) {
        setValue("comments", comments)
        setCommentLocal(null)
      }
    }
    if (isReplyComment) {
      onCancel && onCancel()
    }
  }

  return isShow ? (
    <Grid container gap={2} item>
      <Grid item container gap={2} direction="row">
        <Grid item>
          <AvatarControl name={user.fullName}></AvatarControl>
        </Grid>
        <Grid item xs container gap={2} direction="column">
          <Grid item xs>
            <EditorControl
              isShowError={false}
              control={control}
              isFullScreen={true}
              userSuggest={userSuggest}
              label={label}
              name={controlId}
              isShowAccordion={false}
            />
          </Grid>
          {isReplyComment === true ? (
            <Grid item xs>
              <ButtonFuntion onClick={onCancel} type={EButtonType.cancel} />
              <ButtonFuntion
                disabled={errors[controlId] ? true : false}
                onClick={handleSubmit(onComment)}
                type={EButtonType.reply}
              />
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
      <Grid item xs>
        {isReplyComment === true ? (
          ""
        ) : (
          <ButtonFuntion
            disabled={errors[controlId] ? true : false}
            onClick={handleSubmit(onComment)}
            type={EButtonType.comment}
          />
        )}
      </Grid>
    </Grid>
  ) : (
    ""
  )
}

export default CommentByUser
