import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { EMenuType } from "configs";
import { buttonKey, constants } from "configs";
import Grid from "@mui/material/Grid";
import _ from "lodash";
import { CheckBoxControl } from "components/checkbox";
import { deepFind } from "helpers/commonFunction";

const ViewPermissionFunction = (props) => {
  const { setValue, getValues, control } = props;
  const { t } = useTranslation();
  const menu = useSelector((state) => state.menu.menu);

  const renderMenuTitle = (item) => {
    return (
      <Grid item container gap={2} direction={"row"}>
        <Grid item>
          <CheckBoxControl
            control={control}
            onChange={(value) => onChangeValueAction(value, item)}
            label={item.title}
            name={`permission.${item.key}.All`}
          />
        </Grid>
      </Grid>
    );
  };

  const renderMenuChild = (item) => {
    return (
      <Grid direction={"column"} container gap={2}>
        {_.map(item.childs, (child) => {
          return (
            <Grid
              className="permission-child-item"
              key={child.key}
              direction={"column"}
              container
              gap={2}
            >
              {renderMenuTitle(child)}
              {child.type === EMenuType.action ? renderMenuButton(child) : ""}
              {child.childs ? renderMenuChild(child) : ""}
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const setParentPermissionValue = (value, item) => {
    let parent = deepFind(
      menu,
      function (obj) {
        return _.isEqual(_.toLower(obj.key), _.toLower(item.parent));
      },
      "childs",
    );
    if (!_.isNil(parent)) {
      if (value === false) {
        setValue(`permission.${parent.key}.All`, value);
      } else {
      }
    }
  };

  const changePermissionValue = (value, item) => {
    setValue(`permission.${item.key}.All`, value);
    let buttons = [constants.view];
    const buttonsInclude = _.difference(
      buttonKey.defaultKeys,
      item.button?.notInclude,
    );
    buttons.push(...buttonsInclude);
    _.map(buttons, (btn) => {
      setValue(`permission.${item.key}.${btn}`, value);
    });
    if (!_.isEmpty(item.childs)) {
      _.map(item.childs, (child) => {
        changePermissionValue(value, child);
      });
    }
    if (!_.isNil(item.parent)) {
      setParentPermissionValue(value, item);
    }
  };

  const onChangeValueAction = (value, item) => {
    var permission = deepFind(
      menu,
      function (obj) {
        return obj.key === item.key;
      },
      "childs",
    );
    if (!_.isNil(permission)) {
      changePermissionValue(value, permission);
    }
  };

  const onChangeValueButton = (value, btnKey, item) => {
    setValue(`permission.${item.key}.${btnKey}`, value);
    var permission = deepFind(
      menu,
      function (obj) {
        return obj.key === item.key;
      },
      "childs",
    );
    if (!_.isNil(permission)) {
      if (value === false) {
        setValue(`permission.${item.key}.All`, false);
      } else {
        let isAllCheck = true;
        let buttons = [constants.view];
        let buttonNotIncludes = item.button?.notInclude || [];
        buttonNotIncludes.push(btnKey);
        const buttonIncludes = _.difference(
          buttonKey.defaultKeys,
          buttonNotIncludes,
        );
        buttons.push(...buttonIncludes);
        _.map(buttons, (btn) => {
          const btnCheckValue = getValues(`permission.${item.key}.${btn}`);
          if (btnCheckValue !== true) {
            isAllCheck = false;
            return;
          }
        });

        if (isAllCheck === true) {
          setValue(`permission.${item.key}.All`, true);
        }
      }
      if (!_.isNil(item.parent)) {
        setParentPermissionValue(value, item);
      }
    }
  };

  const renderMenuButton = (item) => {
    let buttons = [constants.view];
    const buttonsInclude = _.difference(
      buttonKey.defaultKeys,
      item.button?.notInclude,
    );
    buttons.push(...buttonsInclude);
    return !_.isEmpty(buttons) ? (
      <Grid
        className="permission-button-content"
        direction={"row"}
        container
        gap={2}
      >
        {_.map(buttons, (key) => {
          return (
            <Grid key={key} item>
              <CheckBoxControl
                control={control}
                onChange={(value) => onChangeValueButton(value, key, item)}
                label={t(key)}
                name={`permission.${item.key}.${key}`}
              />
            </Grid>
          );
        })}
      </Grid>
    ) : (
      ""
    );
  };

  return (
    <Grid container direction={"column"} gap={2}>
      {_.map(menu, (item) => {
        return (
          <Grid key={item.key} direction={"column"} container gap={2}>
            {renderMenuTitle(item)}
            {item.type === EMenuType.action ? renderMenuButton(item) : ""}
            {renderMenuChild(item)}
          </Grid>
        );
      })}
    </Grid>
  );
};
export default ViewPermissionFunction;
