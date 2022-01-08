import React, { useState, useEffect, useCallback } from 'react';
import ToolBar from '../../../components/toolbar/ToolBar';
import TeamPopup from './TeamPopup';
import TeamDataGrid from './TeamDataGrid'
import { getShopIndex } from 'helpers'
import { useTranslation } from 'react-i18next';
import { open, change_title } from 'components/popup/popupSlice';
import { getTeam } from 'services'
import { message } from 'configs'
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { openMessage } from 'stores/snackbar';
import { createInstance } from 'services/base';
import * as Yup from 'yup';
const Team = React.memo(() => {
    console.log("render Team");
    const services = createInstance('/api');
    const baseUrl = '/jm_team';
    const { t } = useTranslation();
    const url = `${baseUrl}`;
    const [data, setData] = useState({});
    const [page, setPage] = useState(0);
     
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
    });
    const defaultValues = {
        name: "",
        note: "",
        parentTeam: null
    };
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema), defaultValues: defaultValues
    });
    const onSubmit = async (data) => {

        const res = await services.post(baseUrl, data);
        const action = openMessage({ ...res });
        dispatch(action);
        //if (res.errorCode == 'Success')
            await   fetchData();
        //reset();
    };
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        const action = open();
        dispatch(action);
    }

    useEffect(() => {
        const actionTitle = change_title(t('Thêm mới Nhóm'));
        dispatch(actionTitle);
    }, []);
    useEffect(() => {
        fetchData();
         
    }, []);
    const fetchData = async () => {
        const res = await getTeam(  {
            draw: page,
                start: page == 0 ? 0 : (page * 10),
                length: 10,
        });
        setData(res);
    };
    return (
        <div>
            <ToolBar onAddClick={handleClickOpen} />
            <TeamDataGrid data={data && data} />
            <TeamPopup control={control} onSubmit={handleSubmit(onSubmit)} branchData={data && data.items} />
        </div>
    );

})

export default Team;