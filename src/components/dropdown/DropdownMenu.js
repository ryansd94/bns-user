import React from 'react'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Stack from '@mui/material/Stack'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs/constants'
import { PopoverControl } from 'components/popover'
import { IconExpand } from 'components/icon/icon'

const DropdownMenu = (props) => {
    const { genderDropdownItem, type = EButtonType.add, visible = false, isShowEndIcon = true } = props
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
            <ButtonFuntion endIcon={isShowEndIcon ? genderEndIcon() : ''} visible={visible} spacingLeft={1} refs={anchorRef} onClick={handleToggle} type={type} />
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
            {/* <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >

                    </Grow>
                )}
            </Popper> */}
        </div>
    )
}

export default DropdownMenu