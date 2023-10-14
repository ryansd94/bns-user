import React, { useState, useEffect, useRef } from "react";
import { convertFilterColor } from "helpers/convertHexColor";

const UploadIconImage = (props) => {
  const { src, color } = props;
  const imgRef = useRef();

  useEffect(() => {
    setColorFilter();
  }, []);

  useEffect(() => {
    setColorFilter();
  }, [color]);

  const setColorFilter = () => {
    if (color) {
      const colorFilter = convertFilterColor(color);
      imgRef.current.style.setProperty("filter", colorFilter.filter);
    }
  };
  return <img ref={imgRef} className="upload-icon-image" src={src}></img>;
};

export default UploadIconImage;
