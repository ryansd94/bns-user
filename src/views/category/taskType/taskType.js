import React, { useState } from "react";
import TaskTypeGrid from "./taskTypeGrid";
import TaskTypeToolbar from "./taskTypeToolbar";
import { Resizable } from "components/resizable";

const TaskType = React.memo(() => {
  const [filterModels, setFilterModels] = useState(null);

  const onApplyFilter = (value) => {
    setFilterModels(value);
  };

  const renderLeftComponent = () => {
    return <TaskTypeGrid filterModels={filterModels} />;
  };

  return (
    <div className="body-content">
      <TaskTypeToolbar onApplyFilter={onApplyFilter} />
      <Resizable renderLeftComponent={renderLeftComponent} />
    </div>
  );
});

export default TaskType;
