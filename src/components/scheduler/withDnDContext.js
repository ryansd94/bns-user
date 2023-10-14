import { DragDropContext } from "react-beautiful-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const withDragDropContext = (Component) => {
  return DragDropContext(HTML5Backend)(Component);
};

export default withDragDropContext;
