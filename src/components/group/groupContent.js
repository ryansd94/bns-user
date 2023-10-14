import "./styles.scss"
import { LabelControl } from "components/label"

const GroupContent = (props) => {
    const { children, label } = props
    return <div className="group-content">
        <LabelControl className="label" label={label}></LabelControl>
        {children}
    </div>
}

export default GroupContent