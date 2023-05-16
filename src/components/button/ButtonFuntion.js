import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { EButtonType, EColor } from 'configs/enums'
import { makeStyles } from "@material-ui/core/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from '@mui/material/Box'
import { isHasPermissionForButton } from "helpers"
import _ from 'lodash'

const useStyles = props => makeStyles(theme => ({
    button: {
        marginLeft: theme.spacing(props.spacingLeft || 0),
        height: 36,
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
        height: 36,
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
        },
        [theme.breakpoints.down("sm")]: {
            minWidth: 32,
            paddingLeft: 8,
            paddingRight: 8,
            padding: '5px 15px',
            "& .MuiButton-startIcon": {
                margin: 0,
            },
            "& .MuiButton-endIcon": {
                margin: 0
            }
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
        label = '', style, refs, endIcon, onClickAway = null,
        isFloatLeft = false, className, disabled, isTextAndIcon = true, isCheckPermissionDefault = false } = props
    const [icon, setIcon] = useState('')
    const [text, setText] = useState('')
    const [show, setShow] = useState(true)
    const [isCheckPermission, setIsCheckPermission] = useState(isCheckPermissionDefault)
    const [float, setFloat] = useState(isFloatLeft ? ' float-left' : ' float-right')
    const [startIcon, setStartIcon] = useState(true)
    const [color, setColor] = useState(null)
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
                setText(t('Add new'))
                setIsCheckPermission(true)
                break
            case EButtonType.save:
                setIcon('far fa-save' + sizeDefault)
                setText(t('Save'))
                setFloat(' float-left')
                setIsCheckPermission(true)
                break
            case EButtonType.addFilter:
                setIcon('far fa-plus' + sizeDefault)
                setText(t('Add filter'))
                setFloat(' float-left')
                break
            case EButtonType.delete:
                setIcon('fas fa-trash-alt' + sizeDefault)
                setText(t('Delete'))
                setIsCheckPermission(true)
                break
            case EButtonType.columnConfig:
                setIcon('far fa-line-columns' + sizeDefault)
                setText(t('Hide / show column'))
                setFloat(' float-left')
                break
            case EButtonType.filter:
                if (open && open)
                    setIcon("far fa-angle-up" + sizeDefault)
                else
                    setIcon("far fa-angle-down" + sizeDefault)
                setText(t('Search'))
                setFloat(' float-left')
                setStartIcon(false)
                break
            case EButtonType.clearFilter:
                setIcon('far fa-undo' + sizeDefault)
                setText(t('Delete all'))
                setFloat(' float-left')
                setColor("neutral")
                break
            case EButtonType.function:
                setIcon('far fa-angle-down' + sizeDefault)
                setText(t('Action'))
                setFloat(' float-left')
                break
            case EButtonType.apply:
                setIcon('far fa-check' + sizeDefault)
                setText(t('Apply'))
                setFloat(' float-left')
                setIsCheckPermission(true)
                break
            case EButtonType.refresh:
                setIcon('far fa-sync-alt' + sizeDefault)
                setFloat(' float-left')
                setText(t('Reload'))
                break
            case EButtonType.addTag:
                setIcon('far fa-tags' + sizeDefault)
                setFloat(' float-left')
                setText(t('Add tags'))
                break
            case EButtonType.more:
                setIcon('far fa-ellipsis-h' + sizeDefault)
                setText(t('Function'))
                setFloat(' float-left')
                break
            case EButtonType.comment:
                setIcon('far fa-comment-alt' + sizeDefault)
                setText(t('Comment'))
                break
            case EButtonType.reply:
                setIcon('far fa-reply' + sizeDefault)
                setText(t('Reply'))
                break
            case EButtonType.cancel:
                setIcon('far fa-times' + sizeDefault)
                setText(t('Cancel'))
                setFloat(' float-left')
                setColor("neutral")
                break
            case EButtonType.full:
                setIcon('far fa-square-full' + sizeDefault)
                setText(t('Full frame'))
                setFloat(' float-left')
                break
            case EButtonType.split:
                setIcon('far fa-columns' + sizeDefault)
                setText(t('Half frame'))
                setFloat(' float-left')
                break
            case EButtonType.list:
                setIcon('far fa-list' + sizeDefault)
                setText(t('Grid view'))
                setFloat(' float-left')
                break
            case EButtonType.board:
                setIcon('far fa-table' + sizeDefault)
                setText(t('Tabular view'))
                setFloat(' float-left')
                break
            default:
                break
        }
    }

    useEffect(() => {
        if (isCheckPermission === true) {
            setShow(isHasPermissionForButton(type))
        }
    }, [isCheckPermission])

    useEffect(() => {
        setButton()
    }, [open])

    useEffect(() => {
        setButton()
    }, [type])

    let button = <Button
        ref={refs}
        variant="outlined"
        color={color != null ? color : "primary"}
        size="medium"
        style={style}
        disabled={disabled}
        onClick={onClick}
        disableTouchRipple
        className={`${isTextAndIcon === true ? classes.button : classes.buttonIcon} ${float} ${className}`}
        startIcon={startIcon ? <i className={icon} /> : ''}
        endIcon={endIcon ? endIcon : (!startIcon ? <i className={icon} /> : '')}
    >
        <span className={isTextAndIcon === true ? classes.buttonText : classes.buttonIconText}>{label ? label : text}</span>
    </Button>
    if (visible) {
        button = (
            <ThemeProvider theme={theme}>
                {!isTextAndIcon === true ? <Tooltip title={label ? label : text}>
                    {button}
                </Tooltip> : button}
            </ThemeProvider>
        )
    }
    else
        button = ''
    return show === true ? (!_.isNil(onClickAway) ? <ClickAwayListener onClickAway={onClickAway}>
        <Box sx={{ position: 'relative' }}> {button} </Box>
    </ClickAwayListener> : button) : ''
})
ButtonFuntion.propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    visible: PropTypes.bool,
    spacingLeft: PropTypes.number,
    open3: PropTypes.bool,
}
export default ButtonFuntion
