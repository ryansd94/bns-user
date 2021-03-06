import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import ButtonDetail from '../../components/button/ButtonDetail';
import { useSelector, useDispatch } from 'react-redux';
import { FastField, Form, Formik } from 'formik';
import { close } from 'components/popup/popupSlice';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
};
function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
const PopupNew = React.memo(props => {
    const dispatch = useDispatch();
    const { ModalBody, onSave, widthSize, initialValues, validationSchema } = props;
    const handleClose = () => {
        const action = close();
        dispatch(action);
    };
    const open = useSelector(state => state.popup.open);
    const title = useSelector(state => state.popup.title);
    const style = {
    };

    return (

        <div>
            <BootstrapDialog
                fullWidth={widthSize}
                aria-labelledby="draggable-dialog-title"
                PaperComponent={PaperComponent}
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title}
                </BootstrapDialogTitle>

                <DialogContent sx={style} dividers>

                    <Form>
                        <ModalBody />
                    </Form>
                </DialogContent>
                <DialogActions>
                    <ButtonDetail onClick={onSave} type={'Save'} />
                </DialogActions>

            </BootstrapDialog>
        </div>
    );
});

PopupNew.propTypes = {
    onSave: PropTypes.func.isRequired,
    ModalBody: PropTypes.func.isRequired,
    widthSize: PropTypes.string,
    initialValues: PropTypes.object,
    validationSchema: PropTypes.object
}
PopupNew.defaultProps = {
    widthSize: "sm",
};
export default PopupNew;