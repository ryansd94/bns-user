import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import queryString from "query-string"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useTranslation } from "react-i18next"
import { validateTokenJoinTeam } from "services"
import { ERROR_CODE, EUserValidate } from "configs"
import Alert from "@mui/material/Alert"
import Spinner from "components/shared/Spinner"
import JointeamHasAccount from "./components/JointeamHasAccount"
import JoinTeamNoAccount from "./components/JoinTeamNoAccount"

export default function JoinTeamWithoutEmail() {
  const { search } = useLocation()
  const { t } = useTranslation()
  const { token } = queryString.parse(search)
  const [error, setError] = useState(t(""))
  const [loading, setLoading] = useState(true)
  const [hasMainAccount, setHasMainAccount] = useState(false)
  const [tokenIsvalid, setTokenIsvalid] = useState(false)

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace)
  }

  useEffect(() => {
    if (token) {
      const data = replaceAll(token, " ", "+")
      validateToken(data)
    } else setLoading(false)
  }, [])

  const validateToken = async (token) => {
    const res = await validateTokenJoinTeam({ token: token })
    if (res.errorCode == ERROR_CODE.success) {
      setTokenIsvalid(true)
      if (res.data && res.data.status == EUserValidate.IS_HAS_ACCOUNT)
        setHasMainAccount(true)
    } else {
      setError(res.title)
    }
    setLoading(false)
  }

  return loading ? (
    <Spinner className={"spinnerWrapperMaster"}></Spinner>
  ) : (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <Grid container rowSpacing={2}>
                  <Grid item xs={12}>
                    <h3>{t("Tạo tài khoản BNS")}</h3>
                  </Grid>
                  {tokenIsvalid ? (
                    !hasMainAccount ? (
                      <JoinTeamNoAccount></JoinTeamNoAccount>
                    ) : (
                      <JointeamHasAccount />
                    )
                  ) : (
                    <Alert severity="error">{error}</Alert>
                  )}
                </Grid>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
