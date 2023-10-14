import { useTranslation } from "react-i18next";

const EmptyRow = (props) => {
  const { t } = useTranslation();
  return <div>{t("No data to display")}</div>;
};

export default EmptyRow;
