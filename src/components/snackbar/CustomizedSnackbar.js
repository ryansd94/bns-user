import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { close } from 'stores/components/snackbar';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbar() {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const open = useSelector(state => state.snackbar.open);
    const severity = useSelector(state => state.snackbar.severity);
    const title = useSelector(state => state.snackbar.title);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const action = close();
        dispatch(action);
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>{severity == "success" ? t('Cập nhật thành công') : title}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
