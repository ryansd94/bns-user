import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { EButtonType, EColor } from 'configs/constants';
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
    buttonText: {
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    }
}));
const ButtonFuntion = React.memo(props => {
    const classes = useStyles(props)();
    const { t } = useTranslation();
    const { type, onClick, visible = true, open3, label, style } = props;
    const [icon, setIcon] = useState('');
    const [text, setText] = useState(t('Thêm mới'));
    const [float, setFloat] = useState(' float-right');
    const [startIcon, setStartIcon] = useState(true);
    const [open2] = useState(open3);
    const [color, setColor] = useState(null);
    const theme = createTheme({
        palette: {
            neutral: {
                main: EColor.cancel,
                contrastText: "#fff",
            },
        },
    });
    const sizeDefault = " fa-xs";
    const setButton = () => {
        switch (type) {
            case EButtonType.add:
                setIcon('far fa-plus' + sizeDefault);
                setText(t('Thêm mới'));
                break;
            case EButtonType.save:
                setIcon('far fa-save' + sizeDefault);
                setText(t('Lưu'));
                setFloat(' float-left');
                break;
            case EButtonType.addFilter:
                setIcon('far fa-plus' + sizeDefault);
                setText(t('Thêm điều kiện lọc'));
                setFloat(' float-left');
                break;
            case EButtonType.delete:
                setIcon('fas fa-trash-alt' + sizeDefault);
                setText(t('Xóa'));
                break;
            case EButtonType.columnConfig:
                setIcon('far fa-line-columns' + sizeDefault);
                setText(t('Ẩn / hiện cột'));
                setFloat(' float-left');
                break;
            case EButtonType.filter:
                if (open2 && open2)
                    setIcon("far fa-angle-up" + sizeDefault);
                else
                    setIcon("far fa-angle-down" + sizeDefault);
                setText(t('Tìm kiếm'));
                setFloat(' float-left');
                setStartIcon(false)
                break;
            case EButtonType.clearFilter:
                setIcon('far fa-undo' + sizeDefault);
                setText(t('Xóa hết'));
                setFloat(' float-left');
                setColor("neutral");
                break;
            case EButtonType.function:
                setIcon('far fa-angle-down' + sizeDefault);
                setText(t('Thao tác'));
                setFloat(' float-left');
                break;
            case EButtonType.apply:
                setIcon('far fa-check' + sizeDefault);
                setText(t('Áp dụng'));
                setFloat(' float-left');
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        setButton();
    }, [open2]);
    let button;
    if (visible) {
        button = (
            <ThemeProvider theme={theme}>
                <Button
                    variant="outlined"
                    color={color != null ? color : "primary"}
                    size="large"
                    style={style}
                    onClick={onClick}
                    className={classes.button + float}
                    startIcon={startIcon ? <i className={icon} /> : ''}
                    endIcon={!startIcon ? <i className={icon} /> : ''}
                >
                    <span className={classes.buttonText}>{label ? label : text}</span>
                </Button>
            </ThemeProvider>);
    }
    else
        button = '';
    return (button
    )
});
ButtonFuntion.propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    visible: PropTypes.bool,
    spacingLeft: PropTypes.number,
    open3: PropTypes.bool,
}
export default ButtonFuntion;
