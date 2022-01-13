import React from "react";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";

export default function TextInput({
  control,
  required,
  label,
  name,
  autoFocus,
}) {
  const loadingPopup = useSelector((state) => state.master.loadingPopup);
  return (
    <Controller
      render={({ field, fieldState: { error } }) =>
        loadingPopup ? (
          <Skeleton width={"100%"} height={"56px"} variant="text">
            <TextField
              fullWidth
              required={required}
              error={!!error}
              helperText={error?.message}
              label={label}
              autoFocus={autoFocus}
              {...field}
            />
          </Skeleton>
        ) : (
          <TextField
            fullWidth
            required={required}
            error={!!error}
            helperText={error?.message}
            label={label}
            autoFocus={autoFocus}
            {...field}
          />
        )
      }
      name={name}
      control={control}
    />
  );
}
