import './loading.scss'
import { useTranslation } from "react-i18next"

const Loading = (props) => {
    const { t } = useTranslation()
    const { isShowTitle = true } = props
    return (
        <div className='loading-container'>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            {isShowTitle === false ? '' : <span>{t('Please wait a moment')}</span>}
        </div>
    )

}

export default Loading