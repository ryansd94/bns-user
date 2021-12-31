import React, { useState, useEffect, useStateIfMounted } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const ButtonDetail = props => {
    const { t } = useTranslation();
    const { type, onClick } = props;
    const [icon, setIcon] = useState('');
    const [text, setText] = useState('');
    console.log("render AREA BUTTON " + text);
    useEffect(() => {
        switch (type) {
            case 'Save':
                setIcon('fal fa-save');
                setText(t('Lưu'));
                break;
            case 'Undo':
                setIcon('far fa-ban');
                setText(t('Hủy'));
                break;
            default:
                break;
        }
    }, []);
    let button;
    button = <Button onClick={onClick}
        startIcon={
            <i className={icon} />
        } variant="contained" >{text}</Button >;

    return (button
    )
};
ButtonDetail.propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}
export default ButtonDetail;
