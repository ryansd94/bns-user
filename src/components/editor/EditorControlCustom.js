import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "components/editor/EditorToolbar";

const EditorControlCustom = React.memo((props) => {
    console.log("render EditorControl")
    const [hideToolbar, setHideToolbar] = useState(true)
    // const [state, setState] = React.useState({ value: null });
    // const handleChange = value => {
    //     setState({ value });
    // };


    const onClickToolbar = () => {
        setHideToolbar(false)
    }

    const onBlurToolbar = () => {
        setHideToolbar(true)
    }


    const concernedElement = document.querySelector("#abc");
    useEffect(() => {
        // window.addEventListener('click', function(e){   
        //     if (document.getElementById('abc').contains(e.target)){
        //         onClickToolbar()
        //     } else{
        //         onBlurToolbar()
        //     }
        //   });

        // document.addEventListener("mousedown", (event) => {
        //     if (document.getElementById('abc').contains(event.target)) {
        //         onClickToolbar()
        //     } else {
        //         onBlurToolbar()
        //     }
        // });
    });
    // useEffect(() => {
    //     if (!clickContent && !clickToolbar)
    //         setHideToolbar(true)
    //     else
    //         setHideToolbar(false)

    // }, [clickContent])

    // useEffect(() => {
    //     if (!clickContent && !clickToolbar)
    //         setHideToolbar(true)
    //     else
    //         setHideToolbar(false)

    // }, [clickToolbar])

    return (
        <div id="abc"
        // onFocus={onClickToolbar}
        // onBlur={onBlurToolbar}
        >
            <EditorToolbar
                hide={hideToolbar} />
            <ReactQuill
                theme="snow"
                // value={state.value}
                // onChange={handleChange}
                placeholder={"Write something awesome..."}
                modules={modules}
                formats={formats}
            />
        </div>
    )
})
export default EditorControlCustom