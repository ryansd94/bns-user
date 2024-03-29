import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

class EventItemPopover extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    schedulerData: PropTypes.object.isRequired,
    eventItem: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    statusColor: PropTypes.string.isRequired,
    subtitleGetter: PropTypes.func,
    viewEventClick: PropTypes.func,
    viewEventText: PropTypes.string,
    viewEvent2Click: PropTypes.func,
    viewEvent2Text: PropTypes.string,
    eventItemPopoverTemplateResolver: PropTypes.func,
  };

  render() {
    const {
      schedulerData,
      eventItem,
      title,
      startTime,
      endTime,
      statusColor,
      subtitleGetter,
      viewEventClick,
      viewEventText,
      viewEvent2Click,
      viewEvent2Text,
      eventItemPopoverTemplateResolver,
    } = this.props;
    const { localeMoment, config } = schedulerData;
    let start = localeMoment(startTime),
      end = localeMoment(endTime);

    if (eventItemPopoverTemplateResolver != undefined) {
      return eventItemPopoverTemplateResolver(
        schedulerData,
        eventItem,
        title,
        start,
        end,
        statusColor,
      );
    } else {
      let subtitleRow = <div />;
      if (subtitleGetter !== undefined) {
        let subtitle = subtitleGetter(schedulerData, eventItem);
        if (subtitle != undefined) {
          subtitleRow = (
            <Grid item container alignItems={"center"}>
              <Grid item>
                <div />
              </Grid>
              <Grid item xs className="overflow-text">
                <span className="header2-text" title={subtitle}>
                  {subtitle}
                </span>
              </Grid>
            </Grid>
          );
        }
      }

      let opsRow = <div />;
      if (
        viewEventText !== undefined &&
        viewEventClick !== undefined &&
        (eventItem.clickable1 == undefined || eventItem.clickable1)
      ) {
        let col = (
          <Grid item xs>
            <span
              className="header2-text"
              style={{ color: "#108EE9", cursor: "pointer" }}
              onClick={() => {
                viewEventClick(schedulerData, eventItem);
              }}
            >
              {viewEventText}
            </span>
          </Grid>
        );
        if (
          viewEvent2Text !== undefined &&
          viewEvent2Click !== undefined &&
          (eventItem.clickable2 == undefined || eventItem.clickable2)
        ) {
          col = (
            <Grid item xs>
              <span
                className="header2-text"
                style={{ color: "#108EE9", cursor: "pointer" }}
                onClick={() => {
                  viewEventClick(schedulerData, eventItem);
                }}
              >
                {viewEventText}
              </span>
              <span
                className="header2-text"
                style={{
                  color: "#108EE9",
                  cursor: "pointer",
                  marginLeft: "16px",
                }}
                onClick={() => {
                  viewEvent2Click(schedulerData, eventItem);
                }}
              >
                {viewEvent2Text}
              </span>
            </Grid>
          );
        }
        opsRow = (
          <Grid item container alignItems={"center"}>
            <Grid item>
              <div />
            </Grid>
            {col}
          </Grid>
        );
      } else if (
        viewEvent2Text !== undefined &&
        viewEvent2Click !== undefined &&
        (eventItem.clickable2 == undefined || eventItem.clickable2)
      ) {
        let col = (
          <Grid item xs>
            <span
              className="header2-text"
              style={{ color: "#108EE9", cursor: "pointer" }}
              onClick={() => {
                viewEvent2Click(schedulerData, eventItem);
              }}
            >
              {viewEvent2Text}
            </span>
          </Grid>
        );
        opsRow = (
          <Grid item container alignItems={"center"}>
            <Grid item>
              <div />
            </Grid>
            {col}
          </Grid>
        );
      }

      let dateFormat = config.eventItemPopoverDateFormat;
      return (
        <div style={{ width: "300px" }}>
          <Grid item container alignItems={"center"}>
            <Grid item>
              <div
                className="status-dot"
                style={{ backgroundColor: statusColor }}
              />
            </Grid>
            <Grid item xs className="overflow-text">
              <span className="header2-text" title={title}>
                {title}
              </span>
            </Grid>
          </Grid>
          {subtitleRow}
          <Grid item container alignItems={"center"}>
            <Grid item>
              <div />
            </Grid>
            <Grid item xs>
              <span className="header1-text">{start.format("HH:mm")}</span>
              <span className="help-text" style={{ marginLeft: "8px" }}>
                {start.format(dateFormat)}
              </span>
              <span className="header2-text" style={{ marginLeft: "8px" }}>
                -
              </span>
              <span className="header1-text" style={{ marginLeft: "8px" }}>
                {end.format("HH:mm")}
              </span>
              <span className="help-text" style={{ marginLeft: "8px" }}>
                {end.format(dateFormat)}
              </span>
            </Grid>
          </Grid>
          {opsRow}
        </div>
      );
    }
  }
}

export default EventItemPopover;
