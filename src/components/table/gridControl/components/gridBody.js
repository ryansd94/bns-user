import React, { useEffect, useState, useMemo, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { renderControlByType } from "helpers/controlHelper"
import eventEmitter from 'helpers/eventEmitter'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'

const GridBody = (props) => {
    console.log('GridBody')
    const { columns = [], name, control } = props
    const [rows, setRows] = useState([{ id: uuidv4() }])

    const onAddNewRow = () => {
        let newData = rows
        newData.push({ id: uuidv4() })
        setRows([...newData])
    }

    useEffect(() => {
        eventEmitter.on('addNewRow', onAddNewRow)

        return () => {
            eventEmitter.off('addNewRow')
        }
    }, [])

    return rows.map((row, index) => {
        return <TableRow key={row.id}>
            {
                _.map(columns, (column) => {
                    return <TableCell key={`${row.id}-${column.name}`}>{renderControlByType({
                        type: column.type,
                        control: control,
                        name: `${name}[${index}].${column.name}`,
                        options: column.options,
                        isSelectedDefault: column.isSelectedDefault,
                        isFormArray: true
                    })}</TableCell>
                })
            }
        </TableRow>
    })
}

export default GridBody