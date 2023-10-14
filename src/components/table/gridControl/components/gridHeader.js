import TableRow from "@mui/material/TableRow";
import HeaderCell from "./headerCell";

const GridHeader = (props) => {
  const { columns = [] } = props;

  return (
    <TableRow>
      {_.map(columns, (item) => {
        return <HeaderCell key={item.name} item={item} />;
      })}
    </TableRow>
  );
};

export default GridHeader;
