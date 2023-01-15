import React from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs/constants'
import { PopoverControl } from 'components/popover'
import { IconExpand } from 'components/icon/icon'

const DropdownMenu = (props) => {
    const { genderDropdownItem, type = EButtonType.add, visible = false, 
        isShowEndIcon = true, label , isFloatLeft = false, spacingLeft = 1} = props
    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef(null)

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }

        setOpen(false)
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault()
            setOpen(false)
        } else if (event.key === 'Escape') {
            setOpen(false)
        }
    }

    const genderBody = () => {
        return <Paper>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                    autoFocusItem={open}
                    onClick={handleClose}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                >
                    {genderDropdownItem && genderDropdownItem()}
                </MenuList>
            </ClickAwayListener>
        </Paper>
    }
    const genderEndIcon = () => {
        return <IconExpand />
    }
    return (
        <div>
            <ButtonFuntion isFloatLeft={isFloatLeft} label={label} endIcon={isShowEndIcon ? genderEndIcon() : ''} visible={visible} spacingLeft={spacingLeft} refs={anchorRef} onClick={handleToggle} type={type} />
            <PopoverControl
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                anchorEl={open ? anchorRef.current : null}
                onClose={handleClose}
                genderBody={genderBody}
            >
            </PopoverControl>
        </div>
    )
}

export default DropdownMenu