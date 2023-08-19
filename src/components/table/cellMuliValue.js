import React from "react"
import _ from 'lodash'
import { OverflowTip } from 'components/tooltip'

const CellMuliValue = (props) => {
    const { values = [] } = props

    const valueText = _.map(values, (x) => {
        return x.name
    })

    const renderTooltipContent = () => {
        return <div className="cell-multi-root">
            {
                _.map(values, (x) => {
                    return <span key={x.id} className="cell-multi-item">{x.name}</span>
                })
            }
        </div>
    }

    return <OverflowTip renderTooltipContent={renderTooltipContent} value={valueText.join(', ')} />
}

export default CellMuliValue