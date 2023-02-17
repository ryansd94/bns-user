import React from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import ButtonFuntion from 'components/button/ButtonFuntion'
import ButtonIcon from 'components/button/ButtonIcon'
import { EButtonType } from 'configs/constants'
import { PopoverControl } from 'components/popover'
import { IconExpand } from 'components/icon/icon'
import Menu from '@mui/material/Menu'

const DropdownMenu = (props) => {
    const { genderDropdownItem, type = EButtonType.add, visible = false,
        isShowEndIcon = true, label, isFloatLeft = false, spacingLeft = 1, isButtonIcon = false } = props
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

    const renderEndIcon = () => {
        return <IconExpand />
    }

    const renderButtonFunction = () => {
        return <ButtonFuntion
            isFloatLeft={isFloatLeft}
            label={label}
            className='button-detail'
            endIcon={isShowEndIcon ? renderEndIcon() : ''}
            visible={visible}
            spacingLeft={spacingLeft}
            refs={anchorRef}
            onClick={handleToggle}
            type={type} />
    }

    const renderButtonIcon = () => {
        return <ButtonIcon refs={anchorRef} type={type} onClick={handleToggle} />
    }
    return (
        <div>
            {isButtonIcon ? renderButtonIcon() : renderButtonFunction()}
            <Menu
                anchorEl={open ? anchorRef.current : null}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            // transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {genderDropdownItem()}
            </Menu>
            {/* <PopoverControl
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
            </PopoverControl> */}
        </div>
    )
}

export default DropdownMenu