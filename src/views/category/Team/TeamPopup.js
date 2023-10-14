import React, { useEffect, useState } from "react";
import Popup from "components/popup/Popup";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { open, change_title } from "components/popup/popupSlice";
import { openMessage } from "stores/components/snackbar";
import { setLoadingPopup, setReload } from "stores/views/master";
import { getByID, save, get } from "services";
import { ERROR_CODE, baseUrl, message, EWidth, EControlType } from "configs";
import { loading as loadingButton } from "stores/components/button";
import { TabControl } from "components/tab";
import { InfoTab, MemberTab } from "./components";
import { getCustomResolverTab } from "helpers";
import eventEmitter from "helpers/eventEmitter";
import DiffTracker from "helpers/diffTracker";

const TeamPopup = React.memo((props) => {
  console.log("render TeamPopup");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const editData = useSelector((state) => state.master.editData);
  const isReload = useSelector((state) => state.master.isReload);
  const [dataTeam, setDataTeam] = useState([]);
  const id = "popup-team";

  const defaultValues = {
    name: "",
    description: "",
    parentId: null,
    id: "",
    members: [],
  };

  const fetchDataTeam = async () => {
    await get(baseUrl.jm_team, {
      draw: 0,
      start: 0,
      length: 10000,
      isParentChild: true,
    }).then((data) => {
      setDataTeam(data && data.data && data.data.items);
    });
  };

  useEffect(() => {
    if (isReload != null) {
      fetchDataTeam();
    }
  }, [isReload]);

  useEffect(() => {
    fetchDataTeam();
  }, []);

  useEffect(() => {
    if (editData) {
      onEditClick();
    }
  }, [editData]);

  const onEditClick = async () => {
    if (!editData) return;
    dispatch(change_title(t("Edit team")));
    dispatch(setLoadingPopup(true));
    dispatch(open());
    await getByID(baseUrl.jm_team, editData).then((res) => {
      //dispatch(setEditData(res.data))
      setValue("id", res.data.id || "");
      setValue("name", res.data.name || "");
      setValue("description", res.data.description || "");
      setValue("parentId", res.data.parentId);
      setValue("members", res.data.members);
      dispatch(setLoadingPopup(false));
    });
  };

  const validationSchemaTab = [
    {
      tabIndex: 0,
      validation: {
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
      },
    },
  ];

  const customResolver = async (values, context) => {
    const result = await getCustomResolverTab(
      values,
      context,
      validationSchemaTab,
    );
    if (!_.isEmpty(result.errorTab)) {
      eventEmitter.emit("errorTabs", {
        errors: result.errorTab,
        id: "teamTab",
      });
    }
    return result;
  };

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    resolver: customResolver,
    defaultValues: defaultValues,
  });

  const onSubmit = async (data) => {
    // alert(JSON.stringify(data))
    // return
    dispatch(loadingButton(true));
    var postData = _.cloneDeep(data);
    if (!editData) {
      postData.id = editData;
    }

    if (!_.isNil(editData)) {
      postData = {};
      postData.id = editData;
      postData.changeFields = data.changeFields;
    } else {
      if (!_.isEmpty(postData.members)) {
        postData.members = _.map(postData.members, (x) => {
          return x.userId;
        });
      }
    }
    const res = await save(baseUrl.jm_team, postData);
    dispatch(loadingButton(false));
    dispatch(openMessage({ ...res }));
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setReload());
    }
  };

  const renderModalBody = () => {
    return (
      <TabControl
        renderAllAtFirstLoad={true}
        id={"teamTab"}
        tabItems={getTabItems()}
      />
    );
  };

  const onValueChange = ({
    value,
    name,
    type = EControlType.textField,
    isDelete = false,
    isEntity = true,
  }) => {
    if (_.isNil(editData)) return;
    DiffTracker.onValueChange({
      buttonId: id,
      editData,
      value,
      name,
      type,
      isDelete,
      getValues,
      setValue,
      eventEmitter,
      isEntity,
    });
  };

  const getTabItems = () => {
    const data = [
      {
        label: t("Infomations"),
        Content: (
          <InfoTab
            dataTeam={dataTeam}
            control={control}
            onValueChange={onValueChange}
          />
        ),
      },
      {
        label: t("Members"),
        Content: (
          <MemberTab
            isAdd={_.isNil(editData)}
            getValues={getValues}
            setValue={setValue}
            onValueChange={onValueChange}
            name="members"
            control={control}
          />
        ),
      },
    ];
    return data;
  };

  return (
    <div>
      <Popup
        id={id}
        disabledSave={!_.isEmpty(editData) ? true : false}
        reset={reset}
        ModalBody={renderModalBody}
        widthSize={EWidth.xl}
        onSave={handleSubmit(onSubmit)}
      />
    </div>
  );
});

TeamPopup.propTypes = {
  dataTeam: PropTypes.array,
};

TeamPopup.defaultProps = {
  dataTeam: [],
};
export default TeamPopup;
