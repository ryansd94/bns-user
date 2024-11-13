import React, { useState, useEffect } from "react"
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import AccountCircle from "@mui/icons-material/AccountCircle"
import PasswordChecklist from "react-password-checklist"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { UploadAvatarControl } from "components/avatar"

const AccountInfo = (props) => {
    const { control, handleSubmit, onSubmit } = props
    const { t } = useTranslation()

    const [password, setPassword] = useState("")
    const [passwordAgain, setPasswordAgain] = useState("")
    const [passwordIsvalid, setPasswordIsvalid] = useState(false)
    const [values, setValues] = React.useState({
        password: "",
        confirmPassword: "",
        fullName: "",
        image: "",
    })

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        })
    }
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const onChangePasswordAgain = ({ value }) => {
        setPasswordAgain(value.toLowerCase())
    }

    const onChangePassword = ({ value }) => {
        setPassword(value.toLowerCase())
    }

    const onFileChange = (src) => {
        setValues("image", src)
    }

    const onClick = (data) => {
        if (!passwordIsvalid) return
        onSubmit(data)
    }

    return <Grid container gap={2}>
        <Grid item xs={12} className="flex-container">
            <UploadAvatarControl
                onFileChange={onFileChange}
                control={control}
                name="image"
            />
        </Grid>
        <Grid item xs={12} container gap={2}>
            <Grid item xs>
                <TextInput
                    autoFocus={true}
                    required={true}
                    control={control}
                    label={t("First name")}
                    name="firstName"
                />
            </Grid>
            <Grid item xs>
                <TextInput
                    control={control}
                    label={t("Last name")}
                    name="lastName"
                />
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <TextInput
                required={true}
                control={control}
                label={t("Password")}
                name="password"
                type={"password"}
                onChange={onChangePassword}
                inputProps={{
                    autoComplete: "new-password",
                    form: {
                        autoComplete: "off",
                    },
                    startadornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                    endadornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Grid>
        <Grid item xs={12}>
            <TextInput
                required={true}
                control={control}
                label={t("Re-enter password")}
                name="confirmPassword"
                type={"password"}
                onChange={onChangePasswordAgain}
                InputProps={{
                    autoComplete: "new-password",
                    form: {
                        autoComplete: "off",
                    },
                }}
            />
        </Grid>
        <Grid item xs={12}>
            <PasswordChecklist
                rules={["notEmpty", "minLength", "number", "lowercase", "match"]}
                minLength={6}
                value={password}
                valueAgain={passwordAgain}
                onChange={(isValid) => setPasswordIsvalid(isValid)}
                messages={{
                    minLength: t("Password minimum 6 characters"),
                    notEmpty: t("Password and re-enter password must not be empty"),
                    number: t("Password must contain at least 1 digit"),
                    lowercase: t("Password must contain at least 1 character"),
                    match: t("Re-enter password does not match"),
                }}
            />
        </Grid>
        <Grid item xs={12}>
            <Button onClick={handleSubmit(onClick)} variant="contained">
                {t("Join")}
            </Button>
        </Grid>
    </Grid>
}

export default AccountInfo