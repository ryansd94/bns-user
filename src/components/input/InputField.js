import PropTypes from 'prop-types';
import React from 'react';
import { ErrorMessage } from 'formik';
import TextField from '@mui/material/TextField';
InputField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

InputField.defaultProps = {
    type: 'text',
    label: '',
    placeholder: '',
    disabled: false,
}


function InputField(props) {
    const {
        field, form,
        type, label, placeholder, disabled,
    } = props;
    const { name } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    return (
            <TextField
                {...field}

                type={type}
                disabled={disabled}
                placeholder={placeholder}
                label={label}

                error={showError}
            />
             
    );
}

export default InputField;