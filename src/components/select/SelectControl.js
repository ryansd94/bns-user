import React, { useState, useMemo, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs";
import { LabelControl } from "components/label";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const containsText = (text, searchText) =>
  searchText ? text.toLowerCase().indexOf(searchText.toLowerCase()) > -1 : true;

const SelectControl = React.memo((props) => {
  const {
    fullWidth,
    label,
    size,
    options = [],
    renderOptions,
    renderValue,
    onChange,
    defaultValue,
    disabled,
    control,
    name,
    isSearchText = true,
    required = false,
    isSelectedDefault = true,
  } = props;
  const [selectedOption, setSelectedOption] = useState(null);
  const { t } = useTranslation();
  const loadingPopup = useSelector((state) => state.master.loadingPopup);
  const [searchText, setSearchText] = useState("");

  const displayedOptions =
    isSearchText == true
      ? useMemo(
          () =>
            options.filter((option) => containsText(option.name, searchText)),
          [searchText],
        )
      : options;

  const onSelectedChange = (value, field) => {
    setSelectedOption(value);
    onChange && onChange({ value, name });
    field.onChange(value);
  };

  const getSelectOptionName = (value) => {
    const option = _.find(options, (x) => x.id === value);
    return option?.name;
  };

  useEffect(() => {
    setSelectedOption(
      !_.isNil(defaultValue)
        ? defaultValue
        : options && options.length > 0 && isSelectedDefault === true
        ? options[0].id
        : null,
    );
  }, [options]);

  const genderControlElement = (field) => {
    return (
      <FormControl
        className={disabled ? "disabled" : "select-container"}
        size={size || "small"}
        fullWidth
      >
        {/* <InputLabel id="search-select-label">{label}</InputLabel> */}
        {_TemplateVariant === EVariant.normal ? (
          label ? (
            <LabelControl required={required} label={label} />
          ) : (
            ""
          )
        ) : (
          ""
        )}
        <Select
          MenuProps={{ autoFocus: false }}
          labelId="search-select-label"
          id="search-select"
          value={!_.isNil(field?.value) ? field.value : selectedOption || ""}
          label={_TemplateVariant === EVariant.outlined ? label : ""}
          onChange={(e) => onSelectedChange(e.target.value, field)}
          onClose={() => setSearchText("")}
          renderValue={() => {
            return renderValue
              ? renderValue(
                  !_.isNil(field?.value) ? field.value : selectedOption,
                )
              : !_.isNil(field?.value)
              ? getSelectOptionName(field.value)
              : getSelectOptionName(selectedOption);
          }}
        >
          {isSearchText ? (
            <ListSubheader>
              <TextField
                size={size || "small"}
                autoFocus
                placeholder="Type to search..."
                fullWidth={fullWidth || true}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
          ) : (
            <ListSubheader></ListSubheader>
          )}
          {!_.isEmpty(displayedOptions) ? (
            displayedOptions.map((option, i) => (
              <MenuItem key={option.id} value={option.id}>
                {renderOptions ? renderOptions(option) : option.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled className="italic">
              {t("No data displayed")}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    );
  };
  return (
    <Controller
      render={({ field, fieldState: { error } }) =>
        loadingPopup ? (
          <Skeleton size={size ? size : _ControlSizeDefault} variant="text">
            {genderControlElement(field)}
          </Skeleton>
        ) : (
          genderControlElement(field)
        )
      }
      name={name}
      control={control && control}
    />
  );
});
export default SelectControl;
