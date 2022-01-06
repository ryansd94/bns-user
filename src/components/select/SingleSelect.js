import React, { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller } from "react-hook-form";
const SingleSelect = React.memo(({ control, field,required, data, label,name }) => {

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
                            required={required}
                            error={!!error}
                            helperText={error?.message}
                            label={label}
                            variant="outlined"
                        />
                    )}
                    onChange={(event, value) => field.onChange(value)}
                />
            )}
            name={name}
            control={control}
        />
    );


})

export default SingleSelect;
