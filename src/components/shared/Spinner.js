import * as React from "react"

const Spinner = (props) => {
  const { className } = props
  return (
    <div>
      <div className={className ? className : "spinnerWrapper"}>
        <div className="donut"></div>
      </div>
    </div>
  )
}

export default Spinner
