import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "components/editor/EditorToolbar";
import Typography from '@mui/material/Typography'
import { AccordionControl } from 'components/accordion'
import './styles.scss'

const EditorControl = React.memo((props) => {
    const { label, name } = props
    return (
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

    )
})
export default EditorControl