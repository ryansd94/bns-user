import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
const SingleSelect = React.memo(
  ({ control, field, required, data, label, name }) => {
    const loadingPopup = useSelector((state) => state.master.loadingPopup);
    const getOpObj = (option) => {
      return option.id;
    };
    return (
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) =>
          loadingPopup ? (
            <Skeleton width={"100%"} height={"56px"} variant="text">
              <Autocomplete
                {...field}
                options={data}
                isOptionEqualToValue={(option, value) => option != null && value != null? option.id === value.id:""}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
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
            </Skeleton>
          ) : (
            <Autocomplete
              {...field}
              options={data}
              isOptionEqualToValue={(option, value) => option != null && value != null? option.id === value.id:""}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => {
                field.onChange(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={required}
                  error={!!error}
                  helperText={error?.message}
                  label={label}
                  variant="outlined"
                />
              )}
            />
          )
        }
        control={control}
      />
    );
  }
);

export default SingleSelect;
