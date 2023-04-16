import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _TemplateVariant, _ControlSizeDefault } from "configs"
import _ from 'lodash'
import { CheckBox } from 'components/checkbox'

const CheckBoxControl = ({ size, onChange, disabled, control, name, label, isViewMode = false }) => {
    const loadingPopup = useSelector((state) => state.master.loadingPopup)

    return (
        <Controller
            name={name}
            render={({ field, fieldState: { error } }) =>
                loadingPopup ? (
                    <Skeleton
                        width={"100%"}
                        variant="text"
                        size={size ? size : _ControlSizeDefault}
                    >
                        <div className="containerControl">
                            <CheckBox name={name}
                                disabled={disabled}
                                onChange={(newValue) => {
                                    field.onChange(newValue.target.checked)
                                    onChange && onChange(newValue.target.checked)
                                }}
                                label={label}
                                checked={field?.value || false} />
                        </div>
                    </Skeleton>

                ) : (
                    <div className="containerControl">
                        {
                            <CheckBox name={name}
                                disabled={disabled}
                                onChange={(newValue) => {
                                    field.onChange(newValue.target.checked)
                                    onChange && onChange(newValue.target.checked)
                                }}
                                label={label}
                                checked={field?.value || false} />
                        }
                    </div>
                )
            }
            control={control}
        />
    )
}

export default CheckBoxControl