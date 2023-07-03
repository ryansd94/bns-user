import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import { TabControl } from 'components/tab'
import { ProjectInfoTab, ProjectSprintTab, ProjectMemberTab } from "./components"
import { baseUrl, EProjectTypeOption } from "configs"

const ProjectCreateContent = (props) => {
    console.log('render ProjectCreateContent')
    const { control, setValue, getValues, reset, type, onValueChange, members, users, teams } = props
    const { t } = useTranslation()
    const [disabledTabSprint, setDisabledTabSprint] = useState(type === EProjectTypeOption.phase ? false : true)

    useEffect(() => {
        setTabItems(getTabItems())
    }, [disabledTabSprint])

    const onTypeChange = (value, name) => {
        if (value == EProjectTypeOption.basic) {
            setDisabledTabSprint(true)
        } else {
            setDisabledTabSprint(false)
        }
        onValueChange(value, name)
    }

    const getTabItems = () => {
        const data = [
            {
                label: t('Infomations'),
                Content: <ProjectInfoTab onValueChange={onValueChange} onTypeChange={onTypeChange} control={control} />
            },
            {
                label: t('Members'),
                Content: <ProjectMemberTab
                    members={members}
                    getValues={getValues}
                    setValue={setValue}
                    users={users}
                    teams={teams}
                    onValueChange={onValueChange}
                    control={control} />
            },
            {
                label: t('Sprint'),
                Content: <ProjectSprintTab onValueChange={onValueChange} name={'sprints'} reset={reset} control={control} getValues={getValues} setValue={setValue} />,
                disabled: disabledTabSprint
            }
        ]
        return data
    }
    const [tabItems, setTabItems] = useState(getTabItems())


    useEffect(() => {
        setTabItems(getTabItems())
    }, [users, teams])

    return <TabControl
        id={'projectTab'}
        tabItems={tabItems} />
}

export default ProjectCreateContent