import React, { useState, useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"
import queryString from "query-string"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import Button from "@mui/material/Button"
import { useForm } from "react-hook-form"
import {  useDispatch } from "react-redux"
import { signup } from "services"
import { ERROR_CODE } from "configs"
import { setTokenLoginSucceeded } from "helpers"

const JointeamHasAccount = (props) => {
  const history = useHistory()
  const { search } = useLocation()
  const { t } = useTranslation()
  const { token } = queryString.parse(search)
  const dispatch = useDispatch()

  const [error, setError] = useState(t("Invalid token"))
  const [tokenIsvalid, setTokenIsvalid] = useState(false)

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace)
  }

  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
  })

  const onSubmit = async (data) => {
    const dataToken = replaceAll(token, " ", "+")
    data.token = dataToken
    data.isHasAccount = true
    const res = await signup(data)
    if (res.errorCode == ERROR_CODE.success) {
      const userInfo = res.data
      const token = {
        accessToken: userInfo.token,
        refreshToken: userInfo.token,
        shopIndex: userInfo.shopIndex,
      }
      const user = { ...userInfo, isAdmin: true, acceptScreen: [] }
      setTokenLoginSucceeded({ token, user })
      setTokenIsvalid(true)
      history.push(`/dashboard`)
    } else {
      setTokenIsvalid(false)
      setError({
        dirty: true,
        msg: res.title,
      })
    }
  }
  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <soan>
          {t(
            "You received an invitation to join, click the button below to join",
          )}
        </soan>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          {t("Join")}
        </Button>
      </Grid>
    </Grid>
  )
}
export default JointeamHasAccount
