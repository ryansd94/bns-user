import React, { useState, useEffect, useCallback } from "react";
import TemplateToolbar from "./TemplateToolbar";
import TemplateGrid from "./templateGrid";
import { Resizable } from "components/resizable";

const Template = React.memo(() => {
  console.log("render Template");
  const [filterModels, setFilterModels] = useState(null);

  const onApplyFilter = (value) => {
    setFilterModels(value);
  };

  const renderLeftComponent = () => {
    return <TemplateGrid filterModels={filterModels} />;
  };

  return (
    <div className="body-content">
      <TemplateToolbar onApplyFilter={onApplyFilter} />
      <Resizable renderLeftComponent={renderLeftComponent} />
    </div>
  );
});

export default Template;
