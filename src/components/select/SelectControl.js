import React, { useState, useMemo } from "react"
import {
    FormControl,
    Select,
    MenuItem,
    ListSubheader,
    TextField,
    InputAdornment
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from 'configs'
import { LabelControl } from 'components/label'
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { Controller } from "react-hook-form"

const containsText = (text, searchText) =>
    searchText ? text.toLowerCase().indexOf(searchText.toLowerCase()) > -1 : true


const SelectControl = React.memo((props) => {
    const { fullWidth, label, size, options = [], renderOptions,
        renderValue, onChange, defaultValue, disabled, control, name } = props
    const [selectedOption, setSelectedOption] = useState(defaultValue ? defaultValue : (options && options.length > 0 ? options[0].id : null))
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    const [searchText, setSearchText] = useState("")
    const displayedOptions = useMemo(
        () => options.filter((option) => containsText(option.name, searchText)),
        [searchText]
    )
    const onSelectedChange = (value) => {
        setSelectedOption(value)
        onChange && onChange(value)
    }
    const genderControlElement = () => {
        return <FormControl className={disabled ? "disabled" : "select-container"} size={size || "small"} fullWidth>
            {/* <InputLabel id="search-select-label">{label}</InputLabel> */}
            {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
            <Select
                MenuProps={{ autoFocus: false }}
                labelId="search-select-label"
                id="search-select"
                value={selectedOption || ""}
                label={_TemplateVariant === EVariant.outlined ? label : ''}
                onChange={(e) => onSelectedChange(e.target.value)}
                onClose={() => setSearchText("")}
                renderValue={() => { return renderValue ? renderValue(selectedOption) : selectedOption.name }}
            >
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
                            )
                        }}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== "Escape") {
                                e.stopPropagation()
                            }
                        }}
                    />
                </ListSubheader>
                {displayedOptions.map((option, i) => (
                    <MenuItem key={option.id} value={option.id}>
                        {
                            renderOptions ? renderOptions(option) :
                                option.name
                        }
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    }
    return (
        <Controller
            render={({ field, fieldState: { error } }) => loadingPopup ?
                (<Skeleton size={size ? size : _ControlSizeDefault} variant="text">{genderControlElement(field)}</Skeleton>)
                : genderControlElement(field)
            }
            name={name}
            control={control && control}
        />
    )
})
export default SelectControl

