import React, {  useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const ButtonFuntion = React.memo(props => {
    const { t } = useTranslation();
    const { type, onClick, visible } = props;
    const [icon, setIcon] = useState('far fa-plus');
    const [text, setText] = useState(t('Thêm mới'));
    const setButton = async () => {
        switch (type) {
            case 'Add':
                setIcon('far fa-plus');
                setText(t('Thêm mới'));
                break;
            case 'Delete':
                setIcon('fas fa-trash-alt');
                setText(t('Xóa'));
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
        button = <Button onClick={onClick} button-title={text} className="btn-circle"
            startIcon={
                <i className={icon} />
            } variant="contained" ></Button >;
    }
    else
        button = '';
    return (button
    )
});
ButtonFuntion.propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    visible: PropTypes.bool
}
export default ButtonFuntion;
