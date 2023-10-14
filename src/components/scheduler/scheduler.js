import React, { Component } from "react";
import PropTypes from "prop-types";
import EventItem from "./components/eventItem";
import DnDSource from "./components/dnDSource";
import DnDContext from "./components/dnDContext";
import ResourceView from "./components/resourceView";
import HeaderView from "./components/headerView";
import BodyView from "./components/bodyView";
import ResourceEvents from "./components/resourceEvents";
import AgendaView from "./components/agendaView";
import Grid from "@mui/material/Grid";
import { IconLeft, IconRight } from "components/icon/icon";
import ButtonFuntion from "components/button/ButtonFuntion";

class Scheduler extends Component {
  constructor(props) {
    super(props);

    const { schedulerData, dndSources } = props;
    let sources = [];
    sources.push(
      new DnDSource((props) => {
        return props.eventItem;
      }, EventItem),
    );
    if (dndSources != undefined && dndSources.length > 0) {
      sources = [...sources, ...dndSources];
    }
    let dndContext = new DnDContext(sources, ResourceEvents);

    this.currentArea = -1;
    schedulerData._setDocumentWidth(document.documentElement.clientWidth);
    this.state = {
      visible: false,
      dndContext: dndContext,
      contentHeight: schedulerData.getSchedulerContentDesiredHeight(),
      contentScrollbarHeight: 17,
      contentScrollbarWidth: 17,
      resourceScrollbarHeight: 17,
      resourceScrollbarWidth: 17,
      scrollLeft: 0,
      scrollTop: 0,
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
    };

    if (schedulerData.isSchedulerResponsive())
      window.onresize = this.onWindowResize;
  }

  onWindowResize = (e) => {
    const { schedulerData } = this.props;
    schedulerData._setDocumentWidth(document.documentElement.clientWidth);
    this.setState({
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
    });
  };

  static propTypes = {
    schedulerData: PropTypes.object.isRequired,
    prevClick: PropTypes.func.isRequired,
    nextClick: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    onSetAddMoreState: PropTypes.func,
    updateEventStart: PropTypes.func,
    updateEventEnd: PropTypes.func,
    moveEvent: PropTypes.func,
    movingEvent: PropTypes.func,
    leftCustomHeader: PropTypes.object,
    rightCustomHeader: PropTypes.object,
    newEvent: PropTypes.func,
    subtitleGetter: PropTypes.func,
    eventItemClick: PropTypes.func,
    viewEventClick: PropTypes.func,
    viewEventText: PropTypes.string,
    viewEvent2Click: PropTypes.func,
    viewEvent2Text: PropTypes.string,
    conflictOccurred: PropTypes.func,
    eventItemTemplateResolver: PropTypes.func,
    dndSources: PropTypes.array,
    slotClickedFunc: PropTypes.func,
    toggleExpandFunc: PropTypes.func,
    slotItemTemplateResolver: PropTypes.func,
    nonAgendaCellHeaderTemplateResolver: PropTypes.func,
    onScrollLeft: PropTypes.func,
    onScrollRight: PropTypes.func,
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func,
  };

  componentDidMount(props, state) {
    this.resolveScrollbarSize();
  }

  componentDidUpdate(props, state) {
    this.resolveScrollbarSize();

    const { schedulerData } = this.props;
    const { localeMoment, behaviors } = schedulerData;
    if (
      schedulerData.getScrollToSpecialMoment() &&
      !!behaviors.getScrollSpecialMomentFunc
    ) {
      if (
        !!this.schedulerContent &&
        this.schedulerContent.scrollWidth > this.schedulerContent.clientWidth
      ) {
        let start = localeMoment(schedulerData.startDate).startOf("day"),
          end = localeMoment(schedulerData.endDate).endOf("day"),
          specialMoment = behaviors.getScrollSpecialMomentFunc(
            schedulerData,
            start,
            end,
          );
        if (specialMoment >= start && specialMoment <= end) {
          let index = 0;
          schedulerData.headers.forEach((item) => {
            let header = localeMoment(item.time);
            if (specialMoment >= header) index++;
          });
          this.schedulerContent.scrollLeft =
            (index - 1) * schedulerData.getContentCellWidth();

          schedulerData.setScrollToSpecialMoment(false);
        }
      }
    }
  }

  render() {
    console.log("render scheduler");
    const { schedulerData, leftCustomHeader, rightCustomHeader } = this.props;
    const { renderData, viewType, showAgenda, isEventPerspective, config } =
      schedulerData;
    const width = schedulerData.getSchedulerWidth();
    const calendarPopoverEnabled = config.calendarPopoverEnabled;

    let dateLabel = schedulerData.getDateLabel();
    let radioButtonList = config.views.map((item) => {
      return (
        <button
          onClick={() =>
            this.onViewChange(
              item.viewType,
              item.showAgenda ? 1 : 0,
              item.isEventPerspective ? 1 : 0,
            )
          }
          key={`${item.viewType}${item.showAgenda ? 1 : 0}${
            item.isEventPerspective ? 1 : 0
          }`}
        >
          {item.viewName}
        </button>
      );
    });

    let tbodyContent = <tr />;
    if (showAgenda) {
      tbodyContent = <AgendaView {...this.props} />;
    } else {
      let resourceTableWidth = schedulerData.getResourceTableWidth();
      let schedulerContainerWidth = width - resourceTableWidth + 1;
      let schedulerWidth = schedulerData.getContentTableWidth() - 1;
      let DndResourceEvents = this.state.dndContext.getDropTarget();
      let eventDndSource = this.state.dndContext.getDndSource();

      let displayRenderData = renderData.filter((o) => o.render);
      let resourceEventsList = displayRenderData.map((item) => {
        return (
          <DndResourceEvents
            {...this.props}
            key={item.slotId}
            resourceEvents={item}
            dndSource={eventDndSource}
          />
        );
      });

      let contentScrollbarHeight = this.state.contentScrollbarHeight,
        contentScrollbarWidth = this.state.contentScrollbarWidth,
        resourceScrollbarHeight = this.state.resourceScrollbarHeight,
        resourceScrollbarWidth = this.state.resourceScrollbarWidth,
        contentHeight = this.state.contentHeight;
      let resourcePaddingBottom =
        resourceScrollbarHeight === 0 ? contentScrollbarHeight : 0;
      let contentPaddingBottom =
        contentScrollbarHeight === 0 ? resourceScrollbarHeight : 0;
      let schedulerContentStyle = {
        overflow: "auto",
        margin: "0px",
        position: "relative",
        paddingBottom: contentPaddingBottom,
      };
      let resourceContentStyle = {
        overflowX: "auto",
        overflowY: "auto",
        width: resourceTableWidth + resourceScrollbarWidth - 2,
        margin: `0px -${contentScrollbarWidth}px 0px 0px`,
      };
      if (config.schedulerMaxHeight > 0) {
        schedulerContentStyle = {
          ...schedulerContentStyle,
          maxHeight: config.schedulerMaxHeight - config.tableHeaderHeight,
        };
        resourceContentStyle = {
          ...resourceContentStyle,
          maxHeight: config.schedulerMaxHeight - config.tableHeaderHeight,
        };
      }

      let resourceName = schedulerData.isEventPerspective
        ? config.taskName
        : config.resourceName;
      tbodyContent = (
        <tr>
          <td style={{ width: resourceTableWidth, verticalAlign: "top" }}>
            <div className="resource-view">
              <div
                style={{
                  overflow: "hidden",
                  borderBottom: "1px solid #e9e9e9",
                  height: config.tableHeaderHeight,
                }}
              >
                <div
                  style={{
                    overflowX: "scroll",
                    overflowY: "hidden",
                    margin: `0px 0px -${contentScrollbarHeight}px`,
                  }}
                >
                  <table className="resource-table">
                    <thead>
                      <tr style={{ height: config.tableHeaderHeight }}>
                        <th className="header3-text">{resourceName}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
              <div
                style={resourceContentStyle}
                ref={this.schedulerResourceRef}
                onMouseOver={this.onSchedulerResourceMouseOver}
                onMouseOut={this.onSchedulerResourceMouseOut}
                onScroll={this.onSchedulerResourceScroll}
              >
                <ResourceView
                  {...this.props}
                  contentScrollbarHeight={resourcePaddingBottom}
                />
              </div>
            </div>
          </td>
          <td>
            <div
              className="scheduler-view"
              style={{ width: schedulerContainerWidth, verticalAlign: "top" }}
            >
              <div
                style={{
                  overflow: "hidden",
                  borderBottom: "1px solid #e9e9e9",
                  height: config.tableHeaderHeight,
                }}
              >
                <div
                  style={{
                    overflowX: "scroll",
                    overflowY: "hidden",
                    margin: `0px 0px -${contentScrollbarHeight}px`,
                  }}
                  ref={this.schedulerHeadRef}
                  onMouseOver={this.onSchedulerHeadMouseOver}
                  onMouseOut={this.onSchedulerHeadMouseOut}
                  onScroll={this.onSchedulerHeadScroll}
                >
                  <div
                    style={{
                      paddingRight: `${contentScrollbarWidth}px`,
                      width: schedulerWidth + contentScrollbarWidth,
                    }}
                  >
                    <table className="scheduler-bg-table">
                      <HeaderView {...this.props} />
                    </table>
                  </div>
                </div>
              </div>
              <div
                style={schedulerContentStyle}
                ref={this.schedulerContentRef}
                onMouseOver={this.onSchedulerContentMouseOver}
                onMouseOut={this.onSchedulerContentMouseOut}
                onScroll={this.onSchedulerContentScroll}
              >
                <div style={{ width: schedulerWidth, height: contentHeight }}>
                  <div className="scheduler-content">
                    <table className="scheduler-content-table">
                      <tbody>{resourceEventsList}</tbody>
                    </table>
                  </div>
                  <div className="scheduler-bg">
                    <table
                      className="scheduler-bg-table"
                      style={{ width: schedulerWidth }}
                      ref={this.schedulerContentBgTableRef}
                    >
                      <BodyView {...this.props} />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    // let popover = <div className="popover-calendar"><Calendar fullscreen={false} onSelect={this.onSelect} /></div>;
    let schedulerHeader = <div />;
    if (config.headerEnabled) {
      schedulerHeader = (
        <Grid
          item
          container
          alignItems={"center"}
          justifyContent="space-between"
          style={{ marginBottom: "24px" }}
        >
          {leftCustomHeader}
          <Grid item>
            <div className="header2-text">
              <IconLeft
                style={{ marginRight: "8px" }}
                className="icon-nav"
                onClick={this.goBack}
              />
              <span className={"header2-text-label"}>{dateLabel}</span>
              <IconRight
                style={{ marginLeft: "8px" }}
                className="icon-nav"
                onClick={this.goNext}
              />
            </div>
          </Grid>
          <Grid item>{radioButtonList}</Grid>
          {rightCustomHeader}
        </Grid>
      );
    }

    return (
      <table className="scheduler" style={{ width: `${width}px` }}>
        <thead>
          <tr>
            <td colSpan="2">{schedulerHeader}</td>
          </tr>
        </thead>
        <tbody>{tbodyContent}</tbody>
      </table>
    );
  }

  resolveScrollbarSize = () => {
    const { schedulerData } = this.props;
    let contentScrollbarHeight = 17,
      contentScrollbarWidth = 17,
      resourceScrollbarHeight = 17,
      resourceScrollbarWidth = 17,
      contentHeight = schedulerData.getSchedulerContentDesiredHeight();
    if (!!this.schedulerContent) {
      contentScrollbarHeight =
        this.schedulerContent.offsetHeight - this.schedulerContent.clientHeight;
      contentScrollbarWidth =
        this.schedulerContent.offsetWidth - this.schedulerContent.clientWidth;
    }
    if (!!this.schedulerResource) {
      resourceScrollbarHeight =
        this.schedulerResource.offsetHeight -
        this.schedulerResource.clientHeight;
      resourceScrollbarWidth =
        this.schedulerResource.offsetWidth - this.schedulerResource.clientWidth;
    }
    if (
      !!this.schedulerContentBgTable &&
      !!this.schedulerContentBgTable.offsetHeight
    ) {
      contentHeight = this.schedulerContentBgTable.offsetHeight;
    }

    let tmpState = {};
    let needSet = false;
    if (contentScrollbarHeight != this.state.contentScrollbarHeight) {
      tmpState = {
        ...tmpState,
        contentScrollbarHeight: contentScrollbarHeight,
      };
      needSet = true;
    }
    if (contentScrollbarWidth != this.state.contentScrollbarWidth) {
      tmpState = { ...tmpState, contentScrollbarWidth: contentScrollbarWidth };
      needSet = true;
    }
    if (contentHeight != this.state.contentHeight) {
      tmpState = { ...tmpState, contentHeight: contentHeight };
      needSet = true;
    }
    if (resourceScrollbarHeight != this.state.resourceScrollbarHeight) {
      tmpState = {
        ...tmpState,
        resourceScrollbarHeight: resourceScrollbarHeight,
      };
      needSet = true;
    }
    if (resourceScrollbarWidth != this.state.resourceScrollbarWidth) {
      tmpState = {
        ...tmpState,
        resourceScrollbarWidth: resourceScrollbarWidth,
      };
      needSet = true;
    }
    if (needSet) this.setState(tmpState);
  };

  schedulerHeadRef = (element) => {
    this.schedulerHead = element;
  };

  onSchedulerHeadMouseOver = () => {
    this.currentArea = 2;
  };

  onSchedulerHeadMouseOut = () => {
    this.currentArea = -1;
  };

  onSchedulerHeadScroll = (proxy, event) => {
    if (
      (this.currentArea === 2 || this.currentArea === -1) &&
      this.schedulerContent.scrollLeft != this.schedulerHead.scrollLeft
    )
      this.schedulerContent.scrollLeft = this.schedulerHead.scrollLeft;
  };

  schedulerResourceRef = (element) => {
    this.schedulerResource = element;
  };

  onSchedulerResourceMouseOver = () => {
    this.currentArea = 1;
  };

  onSchedulerResourceMouseOut = () => {
    this.currentArea = -1;
  };

  onSchedulerResourceScroll = (proxy, event) => {
    if (
      (this.currentArea === 1 || this.currentArea === -1) &&
      this.schedulerContent.scrollTop != this.schedulerResource.scrollTop
    )
      this.schedulerContent.scrollTop = this.schedulerResource.scrollTop;
  };

  schedulerContentRef = (element) => {
    this.schedulerContent = element;
  };

  schedulerContentBgTableRef = (element) => {
    this.schedulerContentBgTable = element;
  };

  onSchedulerContentMouseOver = () => {
    this.currentArea = 0;
  };

  onSchedulerContentMouseOut = () => {
    this.currentArea = -1;
  };

  onSchedulerContentScroll = (proxy, event) => {
    if (this.currentArea === 0 || this.currentArea === -1) {
      if (this.schedulerHead.scrollLeft != this.schedulerContent.scrollLeft)
        this.schedulerHead.scrollLeft = this.schedulerContent.scrollLeft;
      if (this.schedulerResource.scrollTop != this.schedulerContent.scrollTop)
        this.schedulerResource.scrollTop = this.schedulerContent.scrollTop;
    }

    const {
      schedulerData,
      onScrollLeft,
      onScrollRight,
      onScrollTop,
      onScrollBottom,
    } = this.props;
    const { scrollLeft, scrollTop } = this.state;
    if (this.schedulerContent.scrollLeft !== scrollLeft) {
      if (this.schedulerContent.scrollLeft === 0 && onScrollLeft != undefined) {
        onScrollLeft(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollWidth - this.schedulerContent.clientWidth,
        );
      }
      if (
        this.schedulerContent.scrollLeft ===
          this.schedulerContent.scrollWidth -
            this.schedulerContent.clientWidth &&
        onScrollRight != undefined
      ) {
        onScrollRight(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollWidth - this.schedulerContent.clientWidth,
        );
      }
    } else if (this.schedulerContent.scrollTop !== scrollTop) {
      if (this.schedulerContent.scrollTop === 0 && onScrollTop != undefined) {
        onScrollTop(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollHeight -
            this.schedulerContent.clientHeight,
        );
      }
      if (
        this.schedulerContent.scrollTop ===
          this.schedulerContent.scrollHeight -
            this.schedulerContent.clientHeight &&
        onScrollBottom != undefined
      ) {
        onScrollBottom(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollHeight -
            this.schedulerContent.clientHeight,
        );
      }
    }
    this.setState({
      scrollLeft: this.schedulerContent.scrollLeft,
      scrollTop: this.schedulerContent.scrollTop,
    });
  };

  onViewChange = (viewType, showAgenda, isEventPerspective) => {
    const { onViewChange, schedulerData } = this.props;
    onViewChange(schedulerData, {
      viewType: viewType,
      showAgenda: showAgenda,
      isEventPerspective: isEventPerspective,
    });
  };

  goNext = () => {
    const { nextClick, schedulerData } = this.props;
    nextClick(schedulerData);
  };

  goBack = () => {
    const { prevClick, schedulerData } = this.props;
    prevClick(schedulerData);
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  onSelect = (date) => {
    this.setState({
      visible: false,
    });

    const { onSelectDate, schedulerData } = this.props;
    onSelectDate(schedulerData, date);
  };
}

export default Scheduler;
