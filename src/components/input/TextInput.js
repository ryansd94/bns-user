import React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from "react-hook-form";
export default function TextInput({ control, required, label, name, autoFocus}) {
    return (
        <Controller
            render={({ field, fieldState: { error } }) => (
                <TextField fullWidth
                    required={required}
                    error={!!error}
                    helperText={error?.message}
                    label={label}
                    autoFocus={autoFocus}
                    {...field}
                />
            )}
            name={name}
            control={control}
        />
    );
}