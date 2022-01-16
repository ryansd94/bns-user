import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Resizable.scss";
import PropTypes from "prop-types";

const Resizable = React.memo((props) => {
  const { LeftContent, RightContent, IsShowRight } = props;
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  const startResizing = React.useCallback((mouseDownEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        // console.log(
        //   sidebarRef.current.getBoundingClientRect().right +
        //     ", " +
        //     mouseMoveEvent.clientX
        // );
        setSidebarWidth(
          sidebarRef.current.getBoundingClientRect().right -
            mouseMoveEvent.clientX
        );
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="app-container">
          <div className="app-frame">
            <LeftContent />
          </div>
          {IsShowRight ? (
            <div
              ref={sidebarRef}
              className="app-sidebar"
              style={{ width: sidebarWidth }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div
                className="app-sidebar-resizer"
                onMouseDown={startResizing}
              />
              <div className="app-sidebar-content">
                <RightContent />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
});
Resizable.propTypes = {
  LeftContent: PropTypes.func,
  RightContent: PropTypes.func,
  IsShowRight: PropTypes.bool,
};

Resizable.defaultProps = {
  LeftContent: () => {
    return <div></div>;
  },
  RightContent: () => {
    return <div></div>;
  },
  IsShowRight: false,
};
export default Resizable;
