import { getUserInfo, getLastPathUrl } from "helpers";
import { constants } from "configs";
import _ from "lodash";

export const isHasPermissionForButton = (buttonType) => {
  const path = getLastPathUrl();
  const user = getUserInfo();
  const viewPermissions = user.viewPermissions;
  let isHasPermission = false;
  if (user.isMainAccount) {
    return true;
  }
  if (!_.isEmpty(path)) {
    const permission = _.find(viewPermissions, (x) =>
      _.isEqual(_.toLower(x.view), _.toLower(path)),
    );
    if (!_.isNil(permission)) {
      const actions = permission.actions || [];
      isHasPermission = _.some(
        actions,
        (x) => _.isEqual(x.key, buttonType) && x.value === true,
      );
    }
  }
  return isHasPermission;
};

export const isHasPermissionForAction = () => {
  return isHasPermissionForButton(constants.view);
};
