import React, { useState, useEffect } from "react"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import EditorToolbar, { modules, formats } from "components/editor/EditorToolbar"
import { AccordionControl } from 'components/accordion'
import './styles.scss'
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _ControlSizeDefault } from "configs"
import { Controller } from "react-hook-form"

const EditorControl = React.memo((props) => {
    const { label, name, control, size } = props
    const loadingPopup = useSelector((state) => state.master.loadingPopup)

    const handleChange = (html) => {
        console.log(html)
    }

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
                        <AccordionControl
                            isExpand={true}
                            title={label}
                            name={name}
                            details={
                                <ReactQuill
                                    style={{ marginTop: '1rem' }}
                                    {...props}
                                    theme="snow"
                                    placeholder={"Write something awesome..."}
                                />
                            }
                        />
                    </Skeleton>
                ) : (
                    <AccordionControl
                        isExpand={true}
                        title={label}
                        name={name}
                        className='editor-container'
                        details={
                            <ReactQuill
                                style={{ marginTop: '1rem' }}
                                theme="snow"
                                value={field.value}
                                // placeholder={field.value ? '' : "Write something awesome..."}
                                onChange={(newValue) => {
                                    field.onChange(newValue)
                                }}
                            />
                        }
                    />
                )
            }
            control={control}
        />

    )
})
export default EditorControl