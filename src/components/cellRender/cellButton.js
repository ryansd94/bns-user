import Grid from "@mui/material/Grid";
import ButtonIcon from "components/button/ButtonIcon";
import _ from "lodash";
import { EButtonIconType } from "configs";
import { open as openAlert } from "stores/components/alert-dialog";
import { setDeleteData, setEditData } from "stores/views/master";
import { useDispatch } from "react-redux";
import { open } from "components/popup/popupSlice";

const CellButton = (props) => {
  const {
    listButton = [],
    isEditShow = true,
    isDeleteShow = true,
    url,
    id,
    onCustomDeleteClick,
  } = props;
  const dispatch = useDispatch();

  const onEditClick = (e) => {
    e.stopPropagation();
    if (_.isNil(id)) return;
    dispatch(open());
    dispatch(setEditData(id));
  };

  const onDeleteClick = (e) => {
    e.stopPropagation();
    if (_.isNil(id)) return;
    if (!_.isNil(onCustomDeleteClick)) {
      onCustomDeleteClick(id);
    } else {
      dispatch(setDeleteData({ id: [id], url: url }));
      dispatch(openAlert({ open: true }));
    }
  };

  const renderButtonItems = () => {
    return (
      <>
        {isEditShow ? (
          <Grid key={EButtonIconType.edit} item>
            <ButtonIcon onClick={onEditClick} type={EButtonIconType.edit} />
          </Grid>
        ) : (
          ""
        )}
        {isDeleteShow ? (
          <Grid key={EButtonIconType.delete} item>
            <ButtonIcon onClick={onDeleteClick} type={EButtonIconType.delete} />
          </Grid>
        ) : (
          ""
        )}
        {_.map(listButton, (item) => {
          return (
            <Grid key={item.type} item>
              <ButtonIcon
                disabled={!_.isNil(item.disabled) ? item.disabled : false}
                onClick={item.onClick}
                type={item.type}
              />
            </Grid>
          );
        })}
      </>
    );
  };

  return (
    <strong>
      <Grid container gap={1} direction="row">
        {renderButtonItems()}
      </Grid>
    </strong>
  );
};

export default CellButton;
