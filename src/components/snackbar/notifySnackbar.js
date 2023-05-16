import { useEffect, useState, useContext } from "react"
import { SnackbarProvider, useSnackbar, closeSnackbar } from 'notistack'
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, ENotifyObjectType } from "configs"
import { TaskCommentNotify } from './'
import { SignalRContext } from 'helpers'
import _ from 'lodash'

function NotifySnackbarContent() {
  const { enqueueSnackbar } = useSnackbar()
  const [message, setMessage] = useState({})
  const connection = useContext(SignalRContext)
  const autoHideDuration = 3000

  useEffect(() => {
    if (connection) {
      connection.on('notify', (message) => {
        setMessage(message)
      })
    }

    return () => {
      if (connection) {
        connection.off('notify')
      }
    }
  }, [connection])

  useEffect(() => {
    if (!_.isNil(message.id)) {
      onNewNotify(message)
    }
  }, [message.id])

  const onNewNotify = (message) => {
    if (message.type === ENotifyObjectType.taskComment || message.type === ENotifyObjectType.taskAssigned) {
      enqueueSnackbar('', { data: message, variant: 'taskCommentNotify', autoHideDuration: autoHideDuration })
    }
  }

  return ''
}

export default function NotifySnackbar() {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      Components={{
        taskCommentNotify: TaskCommentNotify,
      }}
      maxSnack={3}
      action={(snackbarId) => (
        <ButtonIcon className='close-notify-icon' type={EButtonIconType.close} onClick={() => closeSnackbar(snackbarId)} />
      )}
    >
      <NotifySnackbarContent />
    </SnackbarProvider>
  )
}
