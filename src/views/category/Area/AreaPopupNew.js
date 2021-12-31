import React, {
    useEffect, useState, useMemo, useCallback
} from 'react';

import PropTypes from 'prop-types';
import Popup from '../../../components/popup/Popup';
import PopupNew from 'components/popup/Popup';


import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { message } from '../../../configs'
import { useTranslation } from 'react-i18next';
import { get as getBranch } from 'services/category/branch'
import { InputField } from 'components/input'
import { FastField, Form, Formik } from 'formik';

const AreaPopupNew = React.memo(props => {
    console.log("render AREA popup");
    const { t } = useTranslation();
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
    });
    const { values, errors, touched, isSubmitting } = props;
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchDataBranch();
    }, []);
    const fetchDataBranch = async () => {
        const res = await getBranch();
        setData([...res.data.data]);
    };

    const handleSubmit = (values) => {
        console.log(values);

    };
    const onSubmit2 = () => {
        alert('abc');

    };
    const initialValues = {
        title: '',
        categoryId: null,
        photo: '',
    };
    function ModalBody() {



        return (
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {formikProps => {
                    console.log({ values, errors, touched });

                    return (
                        <Form>
                            <FastField
                                name="name"
                                component={InputField}

                                label="name"
                                placeholder="Eg: Wow nature ..."
                            />

                            <Button type="submit"  color='primary'>
                                Add to album
                    </Button>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
    return (
        <div>
            <PopupNew initialValues={initialValues} validationSchema={validationSchema}
                ModalBody={ModalBody} onSave={ handleSubmit} />
        </div>
    );
});



export default AreaPopupNew;