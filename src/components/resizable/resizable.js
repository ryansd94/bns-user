import React, { useState, useEffect, useCallback } from "react"
import style from "./ResizableNew.scss"
import ResizePanel from "react-resize-panel"
import classNames from "classnames/bind"
let cx = classNames.bind(style)

const Resizable = React.memo((props) => {
    const { genderLeftComponent, hidenRight = true } = props
    return (
        <div className={cx("containerNew")}>
            <div className={cx("body")}>
                <div className={cx("content", "panelNew")}>
                    {genderLeftComponent()}
                </div>
                <div hidden={hidenRight}>
                    <ResizePanel
                        direction="w"
                        style={{ minWidth: "40%", height: "100%" }}
                        handleClass={style.customHandle}
                        borderClass={style.customResizeBorder}
                    >
                        <div className={cx("sidebarNew", "panelNew")}></div>
                    </ResizePanel>
                </div>
            </div>
        </div>
    )
})

export default Resizable
