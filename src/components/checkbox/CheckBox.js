import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CheckBox = (props) => {
    const { name, label, checked, onChange } = props;
    return (
        <FormGroup style={{ width: "100%" }}>
            <FormControlLabel control={<Checkbox name={name} onChange={onChange} defaultChecked={checked} />} label={label} />
        </FormGroup>
    );
}
export default CheckBox;