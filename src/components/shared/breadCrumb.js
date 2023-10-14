import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getLastPathUrl, deepFind } from "helpers";
import _ from "lodash";

const BreadCrumb = (props) => {
  const {} = props;
  const currentPath = getLastPathUrl();
  const [title, setTitle] = useState("");
  const menu = useSelector((state) => state.menu.menu);

  useEffect(() => {
    const actionActive = deepFind(
      menu,
      function (obj) {
        return _.isEqual(_.toLower(obj.key), _.toLower(currentPath));
      },
      "childs",
    );
    if (!_.isNil(actionActive)) {
      setTitle(actionActive.title);
    }
  }, [currentPath]);

  return (
    <nav aria-label="breadcrumb" className="flex align-items-center">
      <ol className="breadcrumb">
        <li className="breadcrumb-item active" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
};
export default BreadCrumb;
