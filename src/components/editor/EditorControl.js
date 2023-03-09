import React, { useState, useEffect, useRef, useMemo } from "react"
import { AccordionControl } from 'components/accordion'
import './styles.scss'
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _ControlSizeDefault } from "configs"
import { Controller } from "react-hook-form"
import { uploadFile } from 'helpers'
import _ from 'lodash'
import { getUserInfo } from "helpers"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"
import "quill-mention"
import ImageResize from 'quill-image-resize-module-react'

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size")
Size.whitelist = ["extra-small", "small", "medium", "large"]
Quill.register(Size, true)

Quill.register('modules/imageResize', ImageResize)

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font")
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
]
Quill.register(Font, true)

const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path
            className="ql-stroke"
            d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
        />
    </svg>
)

// Redo button icon component for Quill editor
const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path
            className="ql-stroke"
            d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
        />
    </svg>
)

// Undo and redo functions for Custom Toolbar
function undoChange() {
    this.quill.history.undo()
}
function redoChange() {
    this.quill.history.redo()
}

async function insertImage() {
    const input = document.createElement('input')

    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
        var file = input.files[0]
        const xxx = await uploadFile(file)
        const cursorPosition = this.quill.getSelection().index
        this.quill.insertEmbed(cursorPosition, 'image', xxx)
        this.quill.setSelection(cursorPosition + 1)
    }
}

// Quill Toolbar component
export const EditorToolbar = ({ hide, id }) => {
    return <div style={{ display: hide ? 'none' : 'block' }} id={id}>
        <span className="ql-formats">
            <select className="ql-font" defaultValue="arial">
                <option value="arial">Arial</option>
                <option value="comic-sans">Comic Sans</option>
                <option value="courier-new">Courier New</option>
                <option value="georgia">Georgia</option>
                <option value="helvetica">Helvetica</option>
                <option value="lucida">Lucida</option>
            </select>
            <select className="ql-size" defaultValue="medium">
                <option value="extra-small">Size 1</option>
                <option value="small">Size 2</option>
                <option value="medium">Size 3</option>
                <option value="large">Size 4</option>
            </select>
            <select className="ql-header" defaultValue="3">
                <option value="1">Heading</option>
                <option value="2">Subheading</option>
                <option value="3">Normal</option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            <button className="ql-script" value="super" />
            <button className="ql-script" value="sub" />
            <button className="ql-blockquote" />
            <button className="ql-direction" />
        </span>
        <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
        </span>
    </div>
}

const EditorControl = (props) => {
    const { label, name, control, size, isShowAccordion = true, onChange, value = null,
        readOnly, className, userSuggest = [], isFullScreen = false } = props
    const quillRef = useRef()
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    const user = getUserInfo()
    const id = name.includes('.') ? _.split(name, '.')[1] : name
    const [hideToolbar, setHideToolbar] = useState(true)

    async function insertImage() {
        const input = document.createElement('input')
        const editor = quillRef.current.getEditor()

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

    const tags = [
        { id: 1, value: 'JavaScript' },
        { id: 2, value: 'TypeScript' },
        { id: 3, value: 'Ruby' },
        { id: 3, value: 'Python' },
    ]

    const modules = {
        toolbar: {
            container: `#rte${id}`,
        },
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        },
        mention: useMemo(
            () => ({
                allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                mentionDenotationChars: ['@', '#'],
                source: (searchTerm, renderList, mentionChar) => {
                    const list = mentionChar === '@' ? userSuggest : tags
                    const includesSearchTerm = list.filter((item) =>
                        item.value.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    renderList(includesSearchTerm)
                },
                onSelect: (item, insertItem) => {
                    let link = document.createElement("a")
                    let editor = quillRef.current.getEditor()
                    const rootItem = _.find(userSuggest, (x) => x.id === item.id)
                    let linkText = document.createTextNode(rootItem && rootItem.value)
                    link.appendChild(linkText)
                    link.title = rootItem && rootItem.value
                    link.href = item.link
                    item.value = link.innerHTML
                    insertItem(item)
                }
            }),
            []
        )
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
        'link', 'image', 'video',
        'mention'
    ]

    const formatMention = (value) => {
        if (_.isNil(value))
            return
        if (_.includes(value, `data-id="${user.userId}"`)) {
            var el = document.createElement('p')
            el.innerHTML = value
            let u = getElementByAttribute('data-id', `${user.userId}`, el)
            if (!_.isNil(u)) {
                u.setAttribute('data-me', 'true')
            }
            return el.innerHTML
        }
        return value
    }

    const getElementByAttribute = (attr, value, root) => {
        root = root || document.body
        if (root.hasAttribute(attr) && root.getAttribute(attr) == value) {
            return root
        }
        var children = root.children,
            element
        for (var i = children.length; i--;) {
            element = getElementByAttribute(attr, value, children[i])
            if (element) {
                return element
            }
        }
        return null
    }

    const onBlur = (previousRange, source, editor) => {
        setHideToolbar(true)
    }

    const onFocus = (range, source, editor) => {
        if (!readOnly) {
            setHideToolbar(false)
        }
    }

    const renderEditor = (field) => {

        return <div style={{ marginTop: isShowAccordion ? '1rem' : '0' }}>
            <EditorToolbar hide={hideToolbar} id={`rte${id}`} />
            <ReactQuill
                id={`rte${id}`}
                ref={quillRef}
                theme='snow'
                onBlur={onBlur}
                onFocus={onFocus}
                readOnly={readOnly}
                value={formatMention(field?.value || value)}
                onChange={(newValue, a, b, d) => {
                    let valueFormat = formatMention(newValue)
                    field && field.onChange(valueFormat)
                    onChange && onChange(valueFormat)
                }}
                placeholder={"Write something awesome..."}
                modules={modules}
                formats={formats}
            />
        </div>
    }

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
                                isFullScreen={isFullScreen}
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
                            isFullScreen={isFullScreen}
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
}

export default EditorControl