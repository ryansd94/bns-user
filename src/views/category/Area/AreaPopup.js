import React, {
    useEffect, useState, useMemo, useCallback
} from 'react';

import PropTypes from 'prop-types';
import Popup from '../../../components/popup/Popup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import BranchSelect from '../../../components/select/BranchSelect';
import CountrySelect from '../../../components/select/CountrySelect';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextInput from '../../../components/input/TextInput';
import { Controller } from "react-hook-form";
import { message } from '../../../configs'
import { useTranslation } from 'react-i18next';
import { get as getBranch}  from 'services/category/branch'

const AreaPopup = React.memo(props => {
    const { t } = useTranslation();
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
        branch: Yup.object().nullable().required(t(message.error.fieldNotEmpty))
    });
    const defaultValues = {
        name: "",
        note: "",
        branch:null
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
    const onSubmit = data => {
        alert(JSON.stringify(data));


        //const res = await services.post(url, {
        //    draw: 0,
        //    start: 0,
        //    length: 1000,
        //    shopIndex: getShopIndex(),
        //});
        reset();
    };
    function ModalBody() {
        return (
            <Grid container rowSpacing={2} >

                <Grid item xs={12}>
                    <TextInput autoFocus={true} required={true} control={control} label={t("Tên khu vực")} name="name" />
                </Grid>
                <Grid item xs={12}>
                    <TextInput   control={control} label={t("Ghi chú")} name="note" />
                </Grid>
                <Grid item xs={12}>
                    <BranchSelect data={ data} control={control} />
                </Grid>


            </Grid>
        );
    }
    return (
        <div>
            <Popup   ModalBody={ModalBody}  onSave={handleSubmit(onSubmit)}  />
        </div>
    );
});

 
export default AreaPopup;