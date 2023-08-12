import { EControlType } from 'configs'
import { TextInput } from 'components'
import SelectControl from 'components/select/SelectControl'

export const renderControlByType = ({ type, control, name, required, isFormArray, options = [], isSelectedDefault = true }) => {
    switch (type) {
        case EControlType.textField:
            return <TextInput required={required} name={name} control={control} isFormArray={isFormArray} />
        case EControlType.select:
            return <SelectControl
                options={options}
                control={control}
                isSelectedDefault={isSelectedDefault}
                name={name} />
    }
    return ''
}