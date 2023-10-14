import TableCell from "@mui/material/TableCell";
import { LabelRequired } from "components/label";
import { IconRefresh } from "components/icon/icon";
import { EControlType, EButtonIconType, ESize } from "configs";
import ButtonIcon from "components/button/ButtonIcon";

const HeaderCell = (props) => {
  const { item = {} } = props;

  const renderHeaderIcon = () => {
    if (item.type === EControlType.select) {
      return (
        <ButtonIcon
          className="cell-icon"
          onClick={() => item.onRefersh && item.onRefersh()}
          size={ESize.small}
          type={EButtonIconType.refresh}
        />
      );
    }
    return "";
  };
  return (
    <TableCell
      className="cell-header"
      key={item.name}
      style={{ minWidth: item.width }}
    >
      {item.title}
      {item.required === true ? <LabelRequired /> : ""}
      {renderHeaderIcon()}
    </TableCell>
  );
};

export default HeaderCell;
