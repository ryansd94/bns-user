import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { EButtonType, EColor } from 'configs/constants'
import { makeStyles } from "@material-ui/core/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from '@mui/material/Box'
import _ from 'lodash'

const useStyles = props => makeStyles(theme => ({
    button: {
        marginLeft: theme.spacing(props.spacingLeft || 0),
        // marginTop: theme.spacing(1),
        // marginBottom: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            minWidth: 32,
            paddingLeft: 8,
            paddingRight: 8,
            "& .MuiButton-startIcon": {
                margin: 0,
            },
            "& .MuiButton-endIcon": {
                margin: 0
            }
        },
        "& .MuiButton-startIcon>*:nth-of-type(1)": {
            fontSize: "1rem"
        },
        "& .MuiButton-endIcon>*:nth-of-type(1)": {
            fontSize: "1rem"
        }
    },
    buttonIcon: {
        marginLeft: theme.spacing(props.spacingLeft || 0),
        // marginTop: theme.spacing(1),
        // marginBottom: theme.spacing(1),
        minWidth: 32,
        padding: '11px 10px',
        margin: '0px !important',
        "& .MuiButton-startIcon": {
            margin: 0,
        },
        "& .MuiButton-endIcon": {
            margin: 0
        },
        "& .MuiButton-startIcon>*:nth-of-type(1)": {
            fontSize: "1rem"
        },
        "& .MuiButton-endIcon>*:nth-of-type(1)": {
            fontSize: "1rem"
        }
    },
    buttonIconText: {
        display: "none"
    },
    buttonText: {
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    }
}))
const ButtonFuntion = React.memo(props => {
    const classes = useStyles(props)()
    const { t } = useTranslation()
    const { type, onClick, visible = true, open,
        label = '', style, refs, endIcon, onClickAway = null, isFloatLeft = false } = props
    const [icon, setIcon] = useState('')
    const [text, setText] = useState('')
    const [float, setFloat] = useState(isFloatLeft ? ' float-left' : ' float-right')
    const [startIcon, setStartIcon] = useState(true)
    const [color, setColor] = useState(null)
    const [isButtonIcon, setIsButtonIcon] = useState(true)
    const theme = createTheme({
        palette: {
            neutral: {
                main: EColor.cancel,
                contrastText: "#fff",
            },
        },
    })
    const sizeDefault = " fa-xs"
    const setButton = () => {
        switch (type) {
            case EButtonType.add:
                setIcon('far fa-plus' + sizeDefault)
                setText(t('Thêm mới'))
                break
            case EButtonType.save:
                setIcon('far fa-save' + sizeDefault)
                setText(t('Lưu'))
                setFloat(' float-left')
                break
            case EButtonType.addFilter:
                setIcon('far fa-plus' + sizeDefault)
                setText(t('Thêm điều kiện lọc'))
                setFloat(' float-left')
                break
            case EButtonType.delete:
                setIcon('fas fa-trash-alt' + sizeDefault)
                setText(t('Xóa'))
                break
            case EButtonType.columnConfig:
                setIcon('far fa-line-columns' + sizeDefault)
                setText(t('Ẩn / hiện cột'))
                setFloat(' float-left')
                break
            case EButtonType.filter:
                if (open && open)
                    setIcon("far fa-angle-up" + sizeDefault)
                else
                    setIcon("far fa-angle-down" + sizeDefault)
                setText(t('Tìm kiếm'))
                setFloat(' float-left')
                setStartIcon(false)
                break
            case EButtonType.clearFilter:
                setIcon('far fa-undo' + sizeDefault)
                setText(t('Xóa hết'))
                setFloat(' float-left')
                setColor("neutral")
                break
            case EButtonType.function:
                setIcon('far fa-angle-down' + sizeDefault)
                setText(t('Thao tác'))
                setFloat(' float-left')
                break
            case EButtonType.apply:
                setIcon('far fa-check' + sizeDefault)
                setText(t('Áp dụng'))
                setFloat(' float-left')
                break
            case EButtonType.refresh:
                setIcon('far fa-sync-alt' + sizeDefault)
                setFloat(' float-left')
                setText(t('Tải lại'))
                break
            case EButtonType.addTag:
                setIcon('far fa-tags' + sizeDefault)
                setFloat(' float-left')
                setText(t('Thêm nhãn'))
                setIsButtonIcon(false)
                break
            case EButtonType.more:
                setIcon('far fa-ellipsis-h' + sizeDefault)
                setText(t('Chức năng'))
                setIsButtonIcon(false)
                break
            default:
                break
        }
    }
    useEffect(() => {
        setButton()
    }, [open])
    let button = <Button
        ref={refs}
        variant="outlined"
        color={color != null ? color : "primary"}
        size="medium"
        style={style}
        onClick={onClick}
        disableTouchRipple
        className={`${isButtonIcon ? classes.button : classes.buttonIcon} ${float}`}
        startIcon={startIcon ? <i className={icon} /> : ''}
        endIcon={endIcon ? endIcon : (!startIcon ? <i className={icon} /> : '')}
    >
        <span className={isButtonIcon ? classes.buttonText : classes.buttonIconText}>{label ? label : text}</span>
    </Button>
    if (visible) {
        button = (
            <ThemeProvider theme={theme}>
                {!isButtonIcon ? <Tooltip title={label ? label : text}>
                    {button}
                </Tooltip> : button}
            </ThemeProvider>
        )
    }
    else
        button = ''
    return !_.isNil(onClickAway) ? <ClickAwayListener onClickAway={onClickAway}>
        <Box sx={{ position: 'relative' }}> {button} </Box>
    </ClickAwayListener> : button
})
ButtonFuntion.propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    visible: PropTypes.bool,
    spacingLeft: PropTypes.number,
    open3: PropTypes.bool,
}
export default ButtonFuntion
