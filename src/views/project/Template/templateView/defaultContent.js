import { EControlType } from "configs";

export const getListContent = (t) => {
  return {
    column1: [
      {
        id: `item-1`,
        prefix: "column1",
        type: EControlType.editor,
        name: "description",
        label: t("Description"),
        required: true,
        default: true,
      },
      {
        id: `item-2`,
        prefix: "column1",
        type: EControlType.editor,
        name: "note",
        label: t("Note"),
        default: true,
      },
      {
        id: `item-16`,
        prefix: "column1",
        type: EControlType.comment,
        name: "comment",
        label: t("Comment"),
        default: true,
      },
    ],
    column2: [
      {
        id: `item-3`,
        prefix: "item-3@column2",
        type: EControlType.group,
        label: t("Detail"),
        name: "detail",
        default: true,
        items: [
          {
            id: `item-4@item-3`,
            type: EControlType.userItem,
            label: t("User created"),
            name: "createdUser",
            default: true,
            defaultReadonly: true,
            isHidenWhenCreate: true,
          },
          {
            id: `item-11@item-3`,
            type: EControlType.dateTimePicker,
            label: t("Date created"),
            name: "createdDate",
            default: true,
            defaultReadonly: true,
            isHidenWhenCreate: true,
          },
          {
            id: `item-5@item-3`,
            type: EControlType.select,
            label: t("Priority"),
            name: "priority",
            default: true,
          },
        ],
      },
      {
        id: `item-8`,
        prefix: "item-8@column2",
        type: EControlType.group,
        label: t("Plan"),
        default: true,
        items: [
          {
            id: `item-9@item-8`,
            type: EControlType.datePicker,
            label: t("Start date"),
            name: "startDate",
            default: true,
          },
          {
            id: `item-10@item-8`,
            type: EControlType.datePicker,
            label: t("Expiration date"),
            name: "dueDate",
            default: true,
          },
          {
            id: `item-12@item-8`,
            type: EControlType.number,
            label: t("Estimated time"),
            name: "estimatedhour",
            default: true,
          },
        ],
      },
      {
        id: `item-14`,
        prefix: "item-14@column2",
        type: EControlType.parentTask,
        label: t("Parent task"),
        name: "taskParent",
        default: true,
      },
      {
        id: `item-13`,
        prefix: "item-13@column2",
        type: EControlType.childTask,
        label: t("Child task"),
        name: "taskChilds",
        default: true,
      },
      {
        id: `item-15`,
        prefix: "item-15@column2",
        type: EControlType.upload,
        label: t("Attachments"),
        name: "files",
        default: true,
      },
    ],
  };
};
