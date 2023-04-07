import React from 'react'

import './loading.scss'

const Loading = props => {
    return (
        <div className='loading-container'>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            <span>Vui lòng chờ trong giây lát</span>
        </div>
    )

}


export default Loading