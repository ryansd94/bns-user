import { useEffect, useState, useContext } from "react"
import { SnackbarProvider, useSnackbar, closeSnackbar } from 'notistack'
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, ENotifyObjectType } from "configs"
import { TaskCommentNotify } from './'
import { CustomizedSnackbar } from 'components/snackbar'
import { SignalRContext } from 'helpers'
import _ from 'lodash'

function NotifySnackbarContent() {
  const { enqueueSnackbar } = useSnackbar()
  const [message, setMessage] = useState({})
  const connection = useContext(SignalRContext)
  const autoHideDuration = 30000

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

  const handleBeforeUnload = () => {
    if (connection) {
      connection.stop()
        .catch((error) => {
          console.log('Failed to disconnect from SignalR server:', error)
        })
    }
  }

  window.onbeforeunload = function (event) {
    return handleBeforeUnload()
  }

  useEffect(() => {
    if (!_.isNil(message.id)) {
      onNewNotify(message)
    }
  }, [message.id])

  const onNewNotify = (message) => {
    if (message.type === ENotifyObjectType.taskComment) {
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
