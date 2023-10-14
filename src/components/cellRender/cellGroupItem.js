import React from "react";
import { IconExpand, IconCollapse } from "components/icon/icon";
import Grid from "@mui/material/Grid";
import eventEmitter from "helpers/eventEmitter";
import _ from "lodash";

const CellGroupItem = (props) => {
  const { item = {}, name, id, renderContent } = props;

  const onExpandCollapseClick = ({ isExpand = true }) => {
    eventEmitter.emit("onExpandCollapseGroupRow", {
      id: item.id,
      isExpand: isExpand,
    });
  };

  const renderCell = () => {
    let marginLeft =
      (item.level || 0) * 20 +
      (item.isExpand !== true &&
      _.isEmpty(item.childs) &&
      !_.isNil(item.parentId)
        ? 20
        : 0);
    return (
      <Grid
        className="no-wrap"
        item
        container
        gap={1}
        style={{ marginLeft: `${marginLeft}px` }}
      >
        {!_.isNil(item.childs) && !_.isEmpty(item.childs) ? (
          <Grid item>
            {item.isExpand === true ? (
              <IconExpand
                onClick={() => onExpandCollapseClick({ isExpand: false })}
                className="cell-group-icon"
              />
            ) : (
              <IconCollapse
                onClick={onExpandCollapseClick}
                className="cell-group-icon"
              />
            )}
          </Grid>
        ) : (
          ""
        )}
        <Grid item className="of-hidden">
          <span className="cell-group-item">
            {!_.isNil(renderContent) ? renderContent() : item[name]}
          </span>
        </Grid>
      </Grid>
    );
  };

  return renderCell();
};

export default CellGroupItem;
