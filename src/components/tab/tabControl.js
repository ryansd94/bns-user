import * as React from 'react'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import SwipeableViews from 'react-swipeable-views'
import _ from 'lodash'
import './style.scss'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
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
  marginRight: theme.spacing(1),
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
}))



const TabControl = (props) => {
  const { tabItems = [] } = props
  const indexDefault = _.findIndex(tabItems, (x) => x.isActive)
  const [value, setValue] = React.useState(indexDefault != -1 ? indexDefault : 0)

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <div>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          {
            _.map(tabItems, (item, index) => {
              return <AntTab key={index} label={item.label} />
            })
          }
        </AntTabs>
      </div>
      <SwipeableViews
        animateTransitions={false}
        index={value}
        style={{ overflow: 'hidden' }}
        onChangeIndex={handleChangeIndex}
      >
        {
          _.map(tabItems, (item, index) => {
            return <TabPanel key={index} value={value} index={index}>
              <div className='tabpanel-content'>
                {item.Content}
              </div>
            </TabPanel>
          })
        }
      </SwipeableViews>

    </div>
  )
}
export default TabControl