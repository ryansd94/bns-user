import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { EButtonType } from 'configs/constants';
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = props => makeStyles(theme => ({
    button: {
        marginLeft: theme.spacing(props.spacingLeft || 0),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            minWidth: 32,
            paddingLeft: 8,
            paddingRight: 8,
            "& .MuiButton-startIcon": {
                margin: 0
            }
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
    const { type, onClick, visible } = props;
    const [icon, setIcon] = useState('far fa-plus');
    const [text, setText] = useState(t('Thêm mới'));
    const [float, setFloat] = useState(' float-right');

    const setButton = () => {
        switch (type) {
            case EButtonType.add:
                setIcon('far fa-plus');
                setText(t('Thêm mới'));
                break;
            case EButtonType.delete:
                setIcon('fas fa-trash-alt');
                setText(t('Xóa'));
                break;
            case EButtonType.columnConfig:
                setIcon('far fa-line-columns');
                setText(t('Ẩn / hiện cột'));
                setFloat(' float-left');
                break;
            case EButtonType.function:
                setIcon('far fa-angle-down');
                setText(t('Thao tác'));
                setFloat(' float-left');
                break;

            default:
                break;
        }
    }
    useEffect(() => {
        setButton();
    }, []);
    let button;
    if (visible) {
        // button = (<Tooltip title={text}><Button onClick={onClick}
        //     startIcon={
        //         <i className={icon} />
        //     } variant="contained" ></Button></Tooltip>);
        button = (<Button
            variant="contained"
            color="primary"
            onClick={onClick}
            className={classes.button + float}
            startIcon={<i className={icon} />}
        >
            <span className={classes.buttonText}>{text}</span>
        </Button>);
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
    spacingLeft: PropTypes.number
}
export default ButtonFuntion;
