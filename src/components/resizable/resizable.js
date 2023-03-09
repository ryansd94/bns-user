import React, { useState, useEffect, useCallback } from "react"
import style from "./ResizableNew.scss"
import ResizePanel from "react-resize-panel"
import classNames from "classnames/bind"
let cx = classNames.bind(style)

const Resizable = React.memo((props) => {
    const { genderLeftComponent, genderRightComponent, hidenRight = true } = props
    return (
        // <div className={cx("containerNew")} style={{ flexFlow: "column" }}>
        //     <div className={cx("body")}>
        //         <div className={cx("content", "panelNew")}>
        //             {genderLeftComponent()}
        //         </div>
        //         <div hidden={hidenRight}>
        //             <ResizePanel
        //                 direction="w"
        //                 style={{ minWidth: "40%", height: "100%" }}
        //                 handleClass={style.customHandle}
        //                 borderClass={style.customResizeBorder}
        //             >
        //                 <div className={cx("sidebarNew", "panelNew")}>{genderRightComponent && genderRightComponent()}</div>
        //             </ResizePanel>
        //         </div>
        //     </div>
        // </div>

        <div className="body">
            <div className={cx("content", "panelNew")}>
                {genderLeftComponent()}
            </div>
            <ResizePanel
                direction="w"
                style={{ width: "400px", display: hidenRight ? 'none' : 'flex' }}
                handleClass="customHandle"
                borderClass="customResizeBorder"
            >
                <div className="right-bar panel">
                    {genderRightComponent && genderRightComponent()}
                </div>
            </ResizePanel>
        </div>
    )
})

export default Resizable
