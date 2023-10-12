import React, { useState, useEffect, useCallback } from "react"
import style from "./ResizableNew.scss"
import classNames from "classnames/bind"
import ResizePanel from "react-resize-panel"
let cx = classNames.bind(style)

const Resizable = React.memo((props) => {
    const { renderLeftComponent, renderRightComponent, hidenRight = true, className = "body-content-item" } = props
    const display = hidenRight ? 'none' : 'flex'
    return (
        // <div className={cx("containerNew")} style={{ flexFlow: "column" }}>
        //     <div className={cx("body")}>
        //         <div className={cx("content", "panelNew")}>
        //             {renderLeftComponent()}
        //         </div>
        //         <div hidden={hidenRight}>
        //             <ResizePanel
        //                 direction="w"
        //                 style={{ minWidth: "40%", height: "100%" }}
        //                 handleClass={style.customHandle}
        //                 borderClass={style.customResizeBorder}
        //             >
        //                 <div className={cx("sidebarNew", "panelNew")}>{renderRightComponent && renderRightComponent()}</div>
        //             </ResizePanel>
        //         </div>
        //     </div>
        // </div>

        <div className={`body ${className}`}>
            <div className={cx("content", "panelNew")}>
                {renderLeftComponent()}
            </div>
            <ResizePanel
                direction="w"
                style={{ width: "400px", display: display }}
                handleClass="customHandle"
                borderClass="customResizeBorder"
            >
                <div className="right-bar panel">
                    {renderRightComponent && renderRightComponent()}
                </div>
            </ResizePanel>
        </div>
    )
})

export default Resizable
