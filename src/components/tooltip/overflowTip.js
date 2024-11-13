import React, { useRef, useEffect, useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import _ from "lodash"

const OverflowTip = (props) => {
  const { disableHoverListener = null, className, webkitLineClamp = 1, isShowTooltip = true } = props
  const textElementRef = useRef()

  const compareSize = () => {
    if (!isShowTooltip) return
    console.log(`${textElementRef.current.scrollHeight}_${textElementRef.current.clientHeight}`)
    const compare =
      textElementRef.current.scrollHeight > textElementRef.current.clientHeight
    setHover(compare)
  }

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize()
    window.addEventListener("resize", compareSize)
  }, [])

  // remove resize listener again on "componentWillUnmount"
  useEffect(
    () => () => {
      window.removeEventListener("resize", compareSize)
    },
    [],
  )

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false)

  return (
    <Tooltip
      className={className}
      title={props.value}
      disableHoverListener={
        !_.isNil(disableHoverListener) ? disableHoverListener : !hoverStatus
      }
      style={{ fontSize: "2em" }}
    >
      <div
        ref={textElementRef}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: webkitLineClamp,
          whiteSpace: "break-spaces",
          wordWrap: "break-word",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical"
        }}
      >
        {props.renderTooltipContent()}
      </div>
    </Tooltip>
  )
}

export default OverflowTip
