import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
const MultiSelect = React.memo(
  ({ control, required, data, label, name, placeholder }) => {
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
        render={({ field: { onChange, value }, fieldState: { error } }) =>
          loadingPopup ? (
            <Skeleton width={"100%"} height={"56px"} variant="text">
               <Autocomplete
              multiple={true}
              options={data}
              isOptionEqualToValue={(option, value) =>
                option != null && value != null ? option.id === value.id : ""
              }
              value={value != null ? value : []}
              filterSelectedOptions
              getOptionLabel={(option) => (option ? option.title : "")}
              onChange={(event, newValue) => {
                onChange(newValue);
              }}
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
                  ></TextField>
                );
              }}
            />
            </Skeleton>
          ) : (
            <Autocomplete
              multiple={true}
              options={data}
              isOptionEqualToValue={(option, value) =>
                option != null && value != null ? option.id === value.id : ""
              }
              value={value != null ? value : []}
              filterSelectedOptions
              getOptionLabel={(option) => (option ? option.title : "")}
              onChange={(event, newValue) => {
                onChange(newValue);
              }}
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
                  ></TextField>
                );
              }}
            />
          )
        }
        defaultValue={[]}
        control={control}
      />
    );
  }
);

export default MultiSelect;
