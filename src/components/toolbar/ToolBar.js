import React from 'react';
import ButtonFuntion from '../../components/button/ButtonFuntion';
import PropTypes from 'prop-types';

const ToolBar = React.memo(props => {

    const { onAddClick, addVisible, onDeleteClick, deleteVisible } = props;
    return (
        <div>
            <div className="row">
                <div className="col-md-12 grid-margin stretch-card  justify-content-end">
                    <ButtonFuntion visible={addVisible} onClick={onAddClick} type='Add' />
                    <ButtonFuntion visible={deleteVisible} onClick={onDeleteClick} type='Delete' />
                </div>
            </div>
        </div>
    );

});
ToolBar.propTypes = {
    onAddClick: PropTypes.func,
    addVisible: PropTypes.bool,
    onDeleteClick: PropTypes.func,
    deleteVisible: PropTypes.bool
}
ToolBar.defaultProps = {
    addVisible: true,
    deleteVisible:false
};
export default ToolBar;