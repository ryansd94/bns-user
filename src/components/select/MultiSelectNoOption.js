import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import Email from "react-email-autocomplete";
const MultiSelectNoOption = React.memo(
  ({ control, field, required, data, label, name, placeholder, freeSolo }) => {
    const loadingPopup = useSelector((state) => state.master.loadingPopup);
    const [value, setValue] = React.useState([]);
    const [text, setText] = React.useState("");
    const inputRef = useRef(null);
    const handleKeyDown = (event) => {
      switch (event.key) {
        case ",":
        case " ": {
          event.preventDefault();
          event.stopPropagation();
          if (event.target.value.length > 0) {
            setValue([...value, event.target.value]);
          }
          break;
        }
        default:
      }
    };

    const onTextChange = (e) => {
      if (e.target.value.indexOf("@") >= 0) {
        let bbbbb = e.target.value + "aaaaaaaa";

        setText(bbbbb);
      }
      setText(e.target.value);
    };

    const onTextKeypress = (e) => {
      if (e.key == "@" && e.target.value.indexOf("@") < 0) {
        e.target.value = e.target.value + "@gmail.com";
        // e.select();
        setText(e.target.value + "aaaaaaaa");
        e.preventDefault();
      }
    };
    const handleFocus = (e) => {
      inputRef.target.select();
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
                isOptionEqualToValue={(option, value) =>
                  option != null && value != null ? option.id === value.id : ""
                }
                // getOptionLabel={(option) => option.title}
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
              multiple
              freeSolo={freeSolo ? freeSolo : false}
              options={data ? data : []}
              getOptionLabel={(option) => option.title || option}
              onChange={(event, newValue) => {
                field.onChange(newValue);
              }}
              filterSelectedOptions
              renderInput={(params) => {
                params.inputProps.onKeyDown = handleKeyDown;
                return (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    placeholder={placeholder}
                    margin="normal"
                    fullWidth
                    // value={text}
                    // onFocus={handleFocus}
                    // ref={inputRef}
                    // onKeyDown={onTextKeypress}
                  ></TextField>
                );
              }}
            />
          )
        }
        control={control}
      />
    );
  }
);

export default MultiSelectNoOption;
