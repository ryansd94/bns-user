import './loading.scss'

const Loading = (props) => {
    const { isShowTitle = true } = props
    return (
        <div className='loading-container'>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            {isShowTitle === false ? '' : <span>Vui lòng chờ trong giây lát</span>}
        </div>
    )

}

export default Loading