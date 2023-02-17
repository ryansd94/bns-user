import React, { useState, useEffect, useRef, useMemo } from "react"
import EditorToolbar, { modules, formats } from "components/editor/EditorToolbar"
import { AccordionControl } from 'components/accordion'
import './styles.scss'
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _ControlSizeDefault } from "configs"
import { Controller } from "react-hook-form"
import { uploadFile } from 'helpers'
import { RichTextEditor } from '@mantine/rte'
import _ from 'lodash'

const EditorControl = React.memo((props) => {
    const { label, name, control, size, isShowAccordion = true, onChange, value = null, readOnly, className } = props
    const quillRef = useRef();
    const loadingPopup = useSelector((state) => state.master.loadingPopup)

    const handleChange = (html) => {
        console.log(html)
    }

    async function insertImage() {
        const input = document.createElement('input')
        const editor = quillRef.current.getEditor();

        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
            var file = input.files[0]
            const xxx = await uploadFile(file)
            const cursorPosition = editor.getSelection().index
            editor.insertEmbed(cursorPosition, 'image', xxx)
            editor.setSelection(cursorPosition + 1)
        }
    }

    const modules = {
        toolbar: {
            container: [[{ 'header': [1, 2, false] }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']],
            handlers: {
                image: insertImage
            }
        }
    }
    /* 
     * Quill editor formats
     * See https://quilljs.com/docs/formats/
     */
    const formats = [
        'variable',
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]

    const people = [
        { id: 1, value: 'Bill Horsefighter', link: 'https://zingnews.vn/antony-la-thuong-vu-ho-cua-mu-post1400024.html' },
        { id: 2, value: 'Amanda Hijacker', link: 'https://zingnews.vn/antony-la-thuong-vu-ho-cua-mu-post1400024.html' },
        { id: 3, value: 'Leo Summerhalter', link: 'https://zingnews.vn/antony-la-thuong-vu-ho-cua-mu-post1400024.html' },
        { id: 4, value: 'Jane Sinkspitter', link: 'https://zingnews.vn/antony-la-thuong-vu-ho-cua-mu-post1400024.html' },
    ];

    const tags = [
        { id: 1, value: 'JavaScript' },
        { id: 2, value: 'TypeScript' },
        { id: 3, value: 'Ruby' },
        { id: 3, value: 'Python' },
    ];


    const renderEditor = (field) => {
        console.log(`${name}`)
        let id = name
        id = name.includes('.') ? _.split(name, '.')[1] : name
        return <div style={{ marginTop: isShowAccordion ? '1rem' : '0' }}>
            <RichTextEditor
                id={`rte${id}`}
                className={className}
                readOnly={readOnly}
                value={field?.value || value}
                onChange={(newValue) => {
                    field && field.onChange(newValue)
                    onChange && onChange(newValue)
                }}
                placeholder="Type @ or # to see mentions autocomplete"
                mentions={mentions} />
        </div>
    }

    const mentions = useMemo(
        () => ({
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            mentionDenotationChars: ['@', '#'],
            source: (searchTerm, renderList, mentionChar) => {
                const list = mentionChar === '@' ? people : tags;
                const includesSearchTerm = list.filter((item) =>
                    item.value.toLowerCase().includes(searchTerm.toLowerCase())
                );
                renderList(includesSearchTerm);
            },
        }),
        []
    );

    return (
        control ?
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
                                    renderEditor(field)
                                }
                            />
                        </Skeleton>
                    ) : (
                        isShowAccordion ? <AccordionControl
                            isExpand={true}
                            title={label}
                            name={name}
                            details={
                                renderEditor(field)
                            }
                        /> :
                            renderEditor(field)
                    )
                }
                control={control}
            /> : renderEditor(null)

    )
})
export default EditorControl