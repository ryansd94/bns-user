import React, { useState, useRef } from "react"
import TreeItem from "@mui/lab/TreeItem"
import { Typography } from "@mui/material"
import clsx from "clsx"
import { TreeView, useTreeItem } from "@mui/lab"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { BaseTextField } from "components/input"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { LabelControl } from 'components/label'
import Grid from "@mui/material/Grid"
import { PopperControl } from "components/popover"
import Box from '@mui/material/Box'
import { SvgIcon } from '@mui/material'
import InputAdornment from "@mui/material/InputAdornment"
import Skeleton from "@mui/material/Skeleton"
import { Controller } from "react-hook-form"
import IconButton from '@mui/material/IconButton'
import { useSelector } from "react-redux"
import { deepFind } from "helpers"
import _ from 'lodash'

const ExpandIcon = () => {
  return <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        d="M7 10l5 5 5-5z"
      />
    </svg>
  </SvgIcon>
}

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon
  } = props

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection
  } = useTreeItem(nodeId)

  const icon = iconProp || expansionIcon || displayIcon

  const handleMouseDown = (event) => {
    preventSelection(event)
  }

  const handleExpansionClick = (event) => {
    handleExpansion(event)
  }

  const handleSelectionClick = (event) => {
    handleSelection(event)
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
      style={{ padding: "3px 0" }}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  )
})
const CustomTreeItem = (props) => (
  <TreeItem ContentComponent={CustomContent} {...props} />
)

export default function CustomTreeView({ label, required, options = [], name, control, onSelectChange, isMultiSelect = false }) {
  const textRef = useRef('')
  const contentRef = useRef('')
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [equipmentItem, setEquipmentItem] = useState("")
  const loadingPopup = useSelector((state) => state.master.loadingPopup)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleIconClick = (event) => {
    event.stopPropagation()
    if (anchorEl) {
      handleClose()
    } else {
      textRef?.current?.click()
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const renderTree = (nodes) => (
    <CustomTreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.childs)
        ? nodes.childs.map((node) => renderTree(node))
        : null}
    </CustomTreeItem>
  )

  const renderComponent = (field) => {
    let textValue = ''
    if (field) {
      const item = deepFind(options, function (obj) {
        return obj.id === field?.value
      }, 'childs')
      textValue = item?.name
    }
    return <>
      <ClickAwayListener onClickAway={handleClose}>
        <Box>
          <Grid item container direction='column'>
            <Grid item xs ref={contentRef}>
              <BaseTextField
                inputRef={textRef}
                required={required}
                value={textValue || ''}
                onClick={handleClick}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleIconClick} style={{ padding: '2px' }}>
                        <ExpandIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {
              open ? <Grid item xs>
                <PopperControl
                  id={id}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  style={{
                    width: contentRef?.current?.clientWidth
                  }}
                >
                  <TreeView
                    aria-label="icon expansion"
                    defaultSelected={field?.value}
                    selected={field?.value}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    onNodeSelect={(e, id) => {
                      if (!isMultiSelect) {
                        handleClose()
                      }
                      setEquipmentItem(e.target.innerText)
                      onSelectChange && onSelectChange({ value: id, name })
                      field.onChange(id)
                    }}
                    sx={{
                      height: 200,
                      flexGrow: 1,
                      minWidth: "200px",
                      overflowY: "auto"
                    }}
                  >
                    {options.map((item, i) => renderTree(item))}
                  </TreeView>
                </PopperControl>
              </Grid> : ''
            }
          </Grid>
        </Box>
      </ClickAwayListener>
    </>
  }

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) =>
        loadingPopup ? (
          <>
            {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
            <Skeleton width={"100%"} variant="text" height={'40px'}>
              {renderComponent(field)}
            </Skeleton>
          </>) : (
          <>
            {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
            {renderComponent(field)}
          </>
        )
      }
      control={control}
    />

  )
}