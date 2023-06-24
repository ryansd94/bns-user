import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconPlus } from 'components/icon/icon'
import Grid from "@mui/material/Grid"
import EventItem from './eventItem'
import DnDSource from './dnDSource'

class AddMorePopover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dndSource: new DnDSource((props) => { return props.eventItem; }, EventItem),
        }
    }

    static propTypes = {
        schedulerData: PropTypes.object.isRequired,
        headerItem: PropTypes.object.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        closeAction: PropTypes.func.isRequired,
        subtitleGetter: PropTypes.func,
        moveEvent: PropTypes.func,
        eventItemClick: PropTypes.func,
        viewEventClick: PropTypes.func,
        viewEventText: PropTypes.string,
        viewEvent2Click: PropTypes.func,
        viewEvent2Text: PropTypes.string,
        eventItemTemplateResolver: PropTypes.func,
    }

    render() {
        const { headerItem, left, top, height, closeAction, schedulerData } = this.props;
        const { config, localeMoment } = schedulerData;
        const { time, start, end, events } = headerItem;
        let header = localeMoment(time).format(config.addMorePopoverHeaderFormat);
        let durationStart = localeMoment(start);
        let durationEnd = localeMoment(end);
        let eventList = [];
        let i = 0;
        let DnDEventItem = this.state.dndSource.getDragSource();
        events.forEach((evt) => {
            if (evt !== undefined) {
                i++;
                let eventStart = localeMoment(evt.eventItem.start);
                let eventEnd = localeMoment(evt.eventItem.end);
                let isStart = eventStart >= durationStart;
                let isEnd = eventEnd < durationEnd;
                let eventItemLeft = 10;
                let eventItemWidth = 138;
                let eventItemTop = 12 + i * config.eventItemLineHeight;
                let eventItem = <DnDEventItem
                    {...this.props}
                    key={evt.eventItem.id}
                    eventItem={evt.eventItem}
                    leftIndex={0}
                    isInPopover={true}
                    isStart={isStart}
                    isEnd={isEnd}
                    rightIndex={1}
                    left={eventItemLeft}
                    width={eventItemWidth}
                    top={eventItemTop}
                />
                eventList.push(eventItem);
            }
        });

        return (
            <div className="add-more-popover-overlay" style={{ left: left, top: top, height: height, width: '170px' }}>
                <Grid item container alignItems={'center'} justifyContent='space-between'>
                    <Grid item xs>
                        <span className="base-text">{header}</span>
                    </Grid>
                    <Grid item>
                        <span onClick={() => { closeAction(undefined); }}><IconPlus /></span>
                    </Grid>
                </Grid>
                {eventList}
            </div>
        );
    }
}

export default AddMorePopover