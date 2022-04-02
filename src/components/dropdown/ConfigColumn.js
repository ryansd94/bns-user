import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { CheckBox } from 'components/checkbox';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        // color: theme.palette.text.secondary,
        // marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));
const ConfigColumn = (props) => {
  const { anchorEl, handleClose, columnModel,onColumnConfigChange } = props;
  const [state, setState] = React.useState(columnModel);
  const open = Boolean(anchorEl);
  const handleChange = (event) => {
    var item = state.find((element) => {
      return element.field === event.target.name;
    });
    item.value = event.target.checked;
    setState(state);
    console.log(state);
  };
  function findArrayElementByTitle(array, title) {
    return array.find((element) => {
      return element.field === title;
    })
  }
  return (
    <div>
      <StyledMenu
        id="column-config-menu"
        MenuListProps={{
          'aria-labelledby': 'column-config-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {
          columnModel && columnModel.map((item, index) => {
            return (<MenuItem key={item.field} disableRipple>
              <CheckBox name={item.field} onChange={onColumnConfigChange} checked={item.value} label={item.label} />
            </MenuItem>)
          })
        }
        {/* <MenuItem onClick={handleClose} disableRipple>
          <FileCopyIcon />
          Duplicate
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <ArchiveIcon />
          Archive
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          More
        </MenuItem> */}
      </StyledMenu>
    </div>
  );
}

ConfigColumn.propTypes = {
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func,
  onColumnConfigChange:PropTypes.func
}
export default ConfigColumn;