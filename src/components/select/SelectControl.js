import React, { useState, useMemo } from "react"
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    ListSubheader,
    TextField,
    InputAdornment
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { _TemplateVariant, EVariant } from 'configs'
import { LabelControl } from 'components/label'

const containsText = (text, searchText) =>
    text.toLowerCase().indexOf(searchText.toLowerCase()) > -1


const SelectControl = React.memo((props) => {
    const { fullWidth, label, size, options = [], renderOptions, renderValue } = props
    const [selectedOption, setSelectedOption] = useState(options ? options[0] : null)

    const [searchText, setSearchText] = useState("")
    const displayedOptions = useMemo(
        () => options.filter((option) => containsText(option.name, searchText)),
        [searchText]
    )

    const onSelectedChange = (value) => {
        setSelectedOption(value)
    }
    return (
        <FormControl className="select-container" size={size || "small"} fullWidth>
            {/* <InputLabel id="search-select-label">{label}</InputLabel> */}
            {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
            <Select
                // Disables auto focus on MenuItems and allows TextField to be in focus
                MenuProps={{ autoFocus: false }}
                labelId="search-select-label"
                id="search-select"
                value={selectedOption}
                label={_TemplateVariant === EVariant.outlined ? label : ''}
                onChange={(e) => onSelectedChange(e.target.value)}
                onClose={() => setSearchText("")}
                // This prevents rendering empty string in Select's value
                // if search text would exclude currently selected option.
                renderValue={() => { return renderValue ? renderValue(selectedOption) : selectedOption.name }}
            >
                {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
                <ListSubheader>
                    <TextField
                        size={size || "small"}
                        // Autofocus on textfield
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
                                // Prevents autoselecting item while typing (default Select behaviour)
                                e.stopPropagation()
                            }
                        }}
                    />
                </ListSubheader>
                {displayedOptions.map((option, i) => (
                    <MenuItem key={option.id} value={option}>
                        {
                            renderOptions ? renderOptions(option) :
                                option.name
                        }
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
})
export default SelectControl

