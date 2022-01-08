import React, {
    useEffect, useState, useMemo, useCallback
} from 'react';

import Popup from 'components/popup/Popup';
import Grid from '@mui/material/Grid';
import SingleSelect from 'components/select/SingleSelect';
import PropTypes from 'prop-types';
 
import TextInput from 'components/input/TextInput';
import { useTranslation } from 'react-i18next';



const TeamPopup = React.memo(props => {
    console.log("render team popup");
    const { t } = useTranslation();

    const { onSubmit, control } = props;
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchDataBranch();
    }, []);
    const fetchDataBranch = async () => {
        //const res = await getBranch();
        //if (res.data)
        //setData([...res.data.data]);
    };
    
    function ModalBody() {
        return (
            <Grid container rowSpacing={2} >

                <Grid item xs={12}>
                    <TextInput autoFocus={true} required={true} control={control} label={t("Tên nhóm")} name="name" />
                </Grid>
                <Grid item xs={12}>
                    <TextInput control={control} label={t("Ghi chú")} name="description" />
                </Grid>
                <Grid item xs={12}>
                    <SingleSelect data={data} control={control} name="parentTeam" label={t("Nhóm cha")} />
                </Grid>


            </Grid>
        );
    }
    return (
        <div>
            <Popup ModalBody={ModalBody} onSave={onSubmit} />
        </div>
    );
});

TeamPopup.propTypes = {
    onSubmit: PropTypes.func,
    control: PropTypes.object
}

export default TeamPopup;