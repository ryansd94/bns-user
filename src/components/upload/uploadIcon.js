import React, { useState, useEffect } from "react"
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { AvatarControl } from 'components/avatar'
import IconButton from "@mui/material/IconButton"
import { ESize } from "configs"
import { styled } from '@mui/material/styles'
import './style.scss'
import { Controller } from "react-hook-form"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"
import { LabelControl } from 'components/label'

const Input = styled('input')({
    display: 'none',
})

const UploadIcon = (props) => {
    const { name, control, label, required } = props
    const [selectedFile, setSelectedFile] = useState(null)

    const handleUploadClick = (event, field) => {
        var file = event.target.files[0]
        const reader = new FileReader()
        var url = reader.readAsDataURL(file)

        reader.onloadend = function (e) {
            setSelectedFile(reader.result)
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
                        <img className="upload-icon-image" src={selectedFile ? selectedFile : field.value} ></img>
                        <Input onChange={(e) => handleUploadClick(e, field)} accept="image/*" id="upload-icon-button-file" type="file" />

                    </label>
                </div>
            )
            }
            name={name}
            control={control && control}
        />
    )
}

export default UploadIcon