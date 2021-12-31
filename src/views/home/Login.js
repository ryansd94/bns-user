import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { resetUserToken, setTokenLoginSucceeded, getAccessToken } from '../../helpers';
import { login } from '../../services';
import httpStatus from 'http-status';
import Button from '@mui/material/Button';
import { ERROR_CODE} from '../../configs'
import { message, ROLE, routeUrls } from '../../configs';
export default function Login() {
    const history = useHistory();
    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        shopcode:'',
        username: '',
        weightRange: '',
        showPassword: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({
        dirty: false,
        msg: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function validate() {
        let valid = true;
        return valid;
    }
    async function handleSubmit() {
        const valid = validate();
        if (valid) {
            setIsSubmitting(true);
            const res = await login({
                userName: values.username,
                passWord: values.password,
                shopCode: values.shopcode,
                remember:true
            });
            setIsSubmitting(false);
            switch (res.status) {
                case httpStatus.OK: {
                    const { data, errors } = res && res;
                    if (data.errorCode != ERROR_CODE.success) {
                        setError({
                            dirty: true,
                            msg: 'tài hkoản hoặc mật khẩu sai',
                        });
                        break;
                    } else {
                        debugger
                        const { data } = res && res.data;
                        const token = {
                            accessToken: data.token,
                            refreshToken: data.token,
                            shopIndex: data.shopIndex
                        };
                        const user = { ...data, isAdmin: true, acceptScreen: [] };
                        setTokenLoginSucceeded({ token, user });
                        setError({
                            dirty: false,
                            msg: '',
                        });
                        history.push(`/dashboard`);
                        //let checkRole = jwt_decode(data.jwToken);
                        //if (Array.isArray(checkRole.roles) && checkRole.roles.length > 0) {
                        //    const token = {
                        //        accessToken: data.jwToken,
                        //        refreshToken: data.refreshToken,
                        //    };
                        //    const user = { ...data, isAdmin: true, acceptScreen: [] };
                        //    setTokenLoginSucceeded({ token, user });
                        //    setError({
                        //        dirty: false,
                        //        msg: '',
                        //    });
                        //    history.push(`/`);
                        //} else {
                        //    let acceptScreen = JSON.parse(checkRole.api_access);
                        //    const token = {
                        //        accessToken: data.jwToken,
                        //        refreshToken: data.refreshToken,
                        //    };
                        //    const user = { ...data, isAdmin: false, acceptScreen };
                        //    setTokenLoginSucceeded({ token, user });
                        //    setError({
                        //        dirty: false,
                        //        msg: '',
                        //    });
                        //    history.push(`/`);
                        //}

                    }
                    break;
                }
                default: {
                    setError({
                        dirty: true,
                        msg: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
                    });
                    resetUserToken();
                    break;
                }
            }
        }
    }

    return (
        <div>
            <div className="d-flex align-items-center auth px-0">
                <div className="row w-100 mx-0">
                    <div className="col-lg-4 mx-auto">
                        <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                            <div className="brand-logo">
                                <img src={require("../../assets/images/logo-dark.svg")} alt="logo" />
                            </div>
                            <h4>Hello! let's get started</h4>
                            <h6 className="font-weight-light">Sign in to continue.</h6>
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1 },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <FormControl fullWidth className="row">
                                    <InputLabel htmlFor="component-outlined">ShopCode</InputLabel>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={values.shopcode}
                                        onChange={handleChange('shopcode')}
                                        label="ShopCode"
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="component-outlined">UserName</InputLabel>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={values.username}
                                        onChange={handleChange('username')}
                                        label="UserName"
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        onChange={handleChange('password')}
                                        endAdornment={
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
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                                <Button variant="contained" onClick={handleSubmit}>Sign in</Button>
                            </Box>
                            <Form className="pt-3">
                                
                                <div className="my-2 d-flex justify-content-between align-items-center">
                                    <div className="form-check">
                                        <label className="form-check-label text-muted">
                                            <input type="checkbox" className="form-check-input" />
                                            <i className="input-helper"></i>
                        Keep me signed in
                      </label>
                                    </div>
                                    <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-black">Forgot password?</a>
                                </div>
                                <div className="mb-2">
                                    <button type="button" className="btn btn-block btn-facebook auth-form-btn">
                                        <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                    </button>
                                </div>
                                <div className="text-center mt-4 font-weight-light">
                                    Don't have an account? <Link to="/user-pages/register" className="text-primary">Create</Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

