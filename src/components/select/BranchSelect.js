import React, { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller } from "react-hook-form";
import { createInstance } from '../../services/base';
import { getShopIndex } from '../../helpers'
import { getArea, getBranch } from '../../services'
const services = createInstance('/api');
const BranchSelect = React.memo(({ control, field ,data}) => {
    const baseUrl = '/cf_branch';
    const url = `${baseUrl}/GetAllData`;
    
    return (
        <Controller
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    options={data}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                        <TextField
                            {...params}
                            required
                            error={!!error}
                            helperText={error?.message}
                            label="Chọn khu vực"
                            variant="outlined"
                        />
                    )}
                    onChange={(event, value) => field.onChange(value)}
                />
            )}
            name="branch"
            control={control}
        />
    );


})

export default BranchSelect;
