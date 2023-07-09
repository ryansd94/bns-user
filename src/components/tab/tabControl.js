import React, { useState, useCallback, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SwipeableViews from 'react-swipeable-views'
import _ from 'lodash'
import './style.scss'
import Grid from "@mui/material/Grid"
import { IconRequire, IconBlock } from 'components/icon/icon'
import eventEmitter from 'helpers/eventEmitter'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      className='tab-content'
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          {children}
        </div>
      )}
      {/* <div>
        {children}
      </div> */}
    </div>
  )
}

const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
})

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#1890ff',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
  '&.MuiButtonBase-root': {
    minHeight: '42px'
  }
}))

const TabControl = (props) => {
  const { tabItems = [], classNameSwipeableView, id } = props
  const indexDefault = _.findIndex(tabItems, (x) => x.isActive)
  const [value, setValue] = React.useState(indexDefault != -1 ? indexDefault : 0)
  const [errorTabs, setErrorTabs] = useState([])

  const onHasErrors = ({ errors }) => {
    setErrorTabs(errors)
  }

  useEffect(() => {
    eventEmitter.on('errorTabs', onHasErrors)

    return () => {
      eventEmitter.off('errorTabs')
    }
  }, [])

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Grid container item flexWrap="nowrap" className="overflow-hidden" direction="column">
      <AntTabs value={value} onChange={handleChange} aria-label="ant example">
        {
          _.map(tabItems, (item, index) => {
            if (item.disabled === true) {
              return <AntTab disabled={true} icon={<IconBlock />} iconPosition="start" key={index} label={item.label} />
            }
            if (_.includes(errorTabs, index)) {
              return <AntTab icon={<IconRequire className='icon-require-tab' />} iconPosition="end" key={index} label={item.label} />
            }
            return <AntTab key={index} label={item.label} />
          })
        }
      </AntTabs>
      <SwipeableViews
        className={`flex-column ofx-hiden ${classNameSwipeableView}`}
        animateTransitions={false}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {
          _.map(tabItems, (item, index) => {
            return <TabPanel key={index} value={value} index={index}>
              {item.Content}
            </TabPanel>
          })
        }
      </SwipeableViews>

    </Grid>
  )
}
export default TabControl