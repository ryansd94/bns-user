import Grid from "@mui/material/Grid"
import ButtonIcon from "components/button/ButtonIcon"
import _ from 'lodash'
import { EButtonIconType } from "configs"
import { open as openAlert } from "stores/components/alert-dialog"
import { useSelector, useDispatch } from "react-redux"

const CellButton = (props) => {
    const { listButton = [], isEditShow = true, isDeleteShow = true, onEditClick, onDeleteClick } = props
    const [id, setId] = useState(null)

    const dispatch = useDispatch()
    // const onEditClick = (e) => {
    //     e.stopPropagation()
    //     if (!params) return
    //     dispatch(open())
    //     dispatch(setEditData(params.data.id))
    // }

    // const onDeleteClick = (e) => {
    //     e.stopPropagation()
    //     dispatch(openAlert({ open: true }))
    //     setId(params.data.id)
    // }


    const renderButtonItems = () => {
        return <>
            {
                isEditShow ? <Grid key={EButtonIconType.edit} item xs>
                    <ButtonIcon onClick={onEditClick} type={EButtonIconType.edit} />
                </Grid> : ''
            }
            {
                isDeleteShow ? <Grid key={EButtonIconType.delete} item xs>
                    <ButtonIcon onClick={onDeleteClick} type={EButtonIconType.delete} />
                </Grid> : ''
            }
            {
                _.map(listButton, (item) => {
                    return <Grid key={item.type} item xs>
                        <ButtonIcon onClick={item.onClick} type={item.type} />
                    </Grid>
                })
            }
        </>
    }

    return <strong>
        <Grid container gap={1} direction='row'>
            {renderButtonItems()}
        </Grid>
    </strong>
}

export default CellButton