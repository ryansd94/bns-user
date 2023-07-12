import React, { useState, useEffect, useRef } from "react"
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import IconButton from "@mui/material/IconButton"
import { styled } from '@mui/material/styles'
import './style.scss'
import { Controller } from "react-hook-form"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"
import { LabelControl } from 'components/label'
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'

const Input = styled('input')({
    display: 'none',
})

const UploadIcon = (props) => {
    const { name, control, label, required, color = '', onChange } = props
    const [selectedFile, setSelectedFile] = useState(null)
    const imgRef = useRef()
    const handleUploadClick = (event, field) => {
        var file = event.target.files[0]
        const reader = new FileReader()
        var url = reader.readAsDataURL(file)

        reader.onloadend = function (e) {
            setSelectedFile(reader.result)
            onChange && onChange({ value: reader.result, name })
            field.onChange(reader.result)
        }.bind(this)
    }

    return (
        <Controller
            render={({ field, fieldState: { error } }) =>
            (
                <div>
                    {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
                    <label className="upload-icon-button-file" htmlFor="upload-icon-button-file">
                        <div className="">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                        </div>
                        <UploadIconImage color={color} src={selectedFile ? selectedFile : field.value} />
                        <Input onChange={(e) => handleUploadClick(e, field)} accept="image/*" id="upload-icon-button-file" type="file" />
                    </label>
                </div >
            )
            }
            name={name}
            control={control && control}
        />
    )
}

export default UploadIcon