import React, { useState, useEffect } from "react"
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { AvatarControl } from 'components/avatar'
import IconButton from "@mui/material/IconButton"
import { ESize } from "configs"
import { styled } from '@mui/material/styles'
import './style.scss'
import { Controller } from "react-hook-form"

const Input = styled('input')({
    display: 'none',
})

const UploadAvatarControl = (props) => {
    const { name, control,onFileChange } = props
    const [selectedFile, setSelectedFile] = useState(null)

    const handleUploadClick = (event) => {
        var file = event.target.files[0]
        const reader = new FileReader()
        var url = reader.readAsDataURL(file)

        reader.onloadend = function (e) {
            setSelectedFile(reader.result)
            onFileChange(reader.result)
        }.bind(this)

        //setSelectedFile(url)
    }

    return (
        <Controller
            render={({ fieldState: { error } }) =>
            (<div className="avatar-container">
                <label className="icon-button-file" htmlFor="icon-button-file">
                    <AvatarControl size={ESize.large} className="avatar-image" image={selectedFile} ></AvatarControl>
                    <Input onChange={(e) => handleUploadClick(e)} accept="image/*" id="icon-button-file" type="file" />
                    <div className="avatar-middle">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera />
                        </IconButton>
                    </div>
                </label>
            </div>)
            }
            name={name}
            control={control && control}
        />
    )
}

export default UploadAvatarControl