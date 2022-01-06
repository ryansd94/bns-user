import React, {
    useEffect, useState, useMemo, useCallback
} from 'react';

import Popup from '../../../components/popup/Popup';
import Grid from '@mui/material/Grid';
import SingleSelect from '../../../components/select/SingleSelect';
import { createInstance } from 'services/base';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import TextInput from '../../../components/input/TextInput';
import { message } from '../../../configs'
import { useTranslation } from 'react-i18next';
import { get as getBranch } from 'services/category/branch'

import { useSelector, useDispatch } from 'react-redux';
const services = createInstance('/api');

import { openMessage } from 'components/snackbar/CustomizedSnackbarSlice';

const TeamPopup = React.memo(props => {
    console.log("render AREA popup");
    const dispatch = useDispatch();
    //const [openSnackbar, closeSnackbar] = useSnackbar()
    const { t } = useTranslation();
    const baseUrl = '/jm_team';
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
    });
    const defaultValues = {
        name: "",
        note: "",
        parentTeam: null
    };
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchDataBranch();
    }, []);
    const fetchDataBranch = async () => {
        const res = await getBranch();
        setData([...res.data.data]);
    };
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema), defaultValues: defaultValues
    });
    const onSubmit = async (data) => {

        const res = await services.post(baseUrl, data);
        console.log(res.data);
        const action = openMessage({ ...res.data });
        dispatch(action);
        //openSnackbar('This is the content of the Snackbar.')
        //HandleError(res);
        //reset();
    };
    function ModalBody() {
        return (
            <Grid container rowSpacing={2} >

                <Grid item xs={12}>
                    <TextInput autoFocus={true} required={true} control={control} label={t("Tên nhóm")} name="name" />
                </Grid>
                <Grid item xs={12}>
                    <TextInput control={control} label={t("Ghi chú")} name="note" />
                </Grid>
                <Grid item xs={12}>
                    <SingleSelect data={data} control={control} name="parentTeam" label={t("Nhóm cha")} />
                </Grid>


            </Grid>
        );
    }
    return (
        <div>
            <Popup ModalBody={ModalBody} onSave={handleSubmit(onSubmit)} />
        </div>
    );
});


export default TeamPopup;