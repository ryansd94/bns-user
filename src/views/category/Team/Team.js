import React, { useState, useEffect, useCallback } from 'react';
import ToolBar from '../../../components/toolbar/ToolBar';
import TeamPopup from './TeamPopup';
import TeamDataGrid from './TeamDataGrid'
import { getShopIndex } from 'helpers'
import { createInstance } from 'services/base';
import { useTranslation } from 'react-i18next';
const services = createInstance('/api');
import { open, change_title } from 'components/popup/popupSlice';

import { useDispatch, useSelector } from 'react-redux';
const Team = React.memo(() => {
    console.log("render Team");
    const baseUrl = '/jm_team';
    const { t } = useTranslation();
    const url = `${baseUrl}/GetAllData`;
    const [data, setData] = useState(null);
     

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
        fetchDataBranch();
        return () => {
            setData(null); // This worked for me
        };
    }, []);
    const fetchDataBranch = async () => {
        const res = await services.post(url, {
            draw: 0,
            start: 0,
            length: 1000,
            shopIndex: getShopIndex(),
        });
        setData([...res.data.data]);
    };
    return (
        <div>
            <ToolBar onAddClick={handleClickOpen} />
            <TeamDataGrid />
            <TeamPopup   branchData={data}   />
        </div>
    );

})

export default Team;