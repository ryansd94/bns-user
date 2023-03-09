import React from "react"
import TextInput from './TextInput'

const NumberInput = (props) => {

    return (
        <TextInput {...props} type={'number'} />
    )
}

export default NumberInput