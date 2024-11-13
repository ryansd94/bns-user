import React, { useState, useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"
import queryString from "query-string"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { joinTeam } from "services"
import { ERROR_CODE } from "configs"
import Box from "@mui/material/Box"
import { message } from "configs"
import { yupResolver } from "@hookform/resolvers/yup"
import { setTokenLoginSucceeded } from "helpers"
import { AccountInfo } from "../Signup/components"
import * as Yup from "yup"

const JoinTeam = (props) => {
    const history = useHistory()
    const { search } = useLocation()
    const { t } = useTranslation()
    const { accountCompanyId } = queryString.parse(search)
    const [error, setError] = useState('')
    const [values, setValues] = React.useState({
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        image: "",
    })
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), "g"), replace)
    }

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        })
    }

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required(t(message.error.fieldNotEmpty)),
        lastName: Yup.string().required(t(message.error.fieldNotEmpty)),
        password: Yup.string().required(t(message.error.fieldNotEmpty)),
        confirmPassword: Yup.string().required(t(message.error.fieldNotEmpty))
    })

    const defaultValues = {
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        image: "",
    }

    const {
        control,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    })

    const onSubmit = async (data) => {
        data.accountCompanyId = accountCompanyId
        data.isHasAccount = false
        const res = await joinTeam(data)
        if (res.data.errorCode == ERROR_CODE.success) {
            const userInfo = res.data.data
            const token = {
                accessToken: userInfo.token,
                refreshToken: userInfo.token,
                shopIndex: userInfo.shopIndex,
            }
            const user = { ...userInfo, isAdmin: true, acceptScreen: [] }
            setTokenLoginSucceeded({ token, user })
            history.push(`/dashboard`)
        } else {
            setError({
                dirty: true,
                msg: res.data.title,
            })
        }
    }

    return (
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
                                        {/* <h3>{t("Tạo tài khoản BNS")}</h3> */}
                                    </Grid>
                                    <AccountInfo handleSubmit={handleSubmit} onSubmit={onSubmit} control={control} />
                                </Grid>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinTeam
