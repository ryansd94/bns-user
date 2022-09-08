import React, { useState } from "react"
import StatusPopup from "./statusPopup"
import StatusGrid from "./statusGrid"
import { useTranslation } from "react-i18next"
import { Resizable } from 'components/resizable'
import StatusToolbar from "./statusToolbar"

const Status = React.memo(() => {
  const { t } = useTranslation()
  const [filterModels, setFilterModels] = useState(null)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <StatusGrid filterModels={filterModels} />
  }

  return (
    <div>
      <StatusToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
      <StatusPopup />
    </div>
  )
})

export default Status
