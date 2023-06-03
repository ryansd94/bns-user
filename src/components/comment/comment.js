import _ from "lodash"
import Grid from "@mui/material/Grid"
import { AccordionControl } from 'components/accordion'
import { CommentByUser, ListComment } from './'
import { Controller } from "react-hook-form"
import { getUserName } from "helpers"

const Comment = (props) => {
    const { label, name, control } = props
    const user = getUserName()

    const renderItem = (comments = []) => {
        return <Grid container spacing={2} item direction='column'>
            <Grid item>
                <CommentByUser {...props} name='commentByUser' user={user} />
            </Grid>
            <Grid item>
                <ListComment {...props} comments={comments} user={user} />
            </Grid>
        </Grid>
    }
    return (
        <Controller
            name={name}
            render={({ field, fieldState: { error } }) =>
                <AccordionControl
                    isExpand={true}
                    title={label}
                    className="task-group-container"
                    name={name}
                    details={
                        <div>
                            {
                                renderItem(field?.value)
                            }
                        </div>
                    }
                />
            }
            control={control}
        />
    )
}

export default Comment