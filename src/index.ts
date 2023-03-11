import { TipDialog } from './components/TipDialog'
import { createWorker, createWorkerFunc, cancelUpdate } from './worker'

const defaultPollingTime = 5000
let worker: Worker | undefined = undefined

export function checkVersion(
  config: {
    originVersionFileUrl: string
    localPackageVersion: string
    pollingTime?: number
    immediate?: boolean
    onVersionUpdate?: (event: any) => void
    onRefresh?: (event: any) => void
    onCancel?: (event: any) => void
  },
  options?: {
    title?: string
    description?: string
    buttonText?: string
    cancelButtonText?: string
    cancelMode?: string
    cancelUpdateAndStopWorker?: boolean
    buttonStyle?: string
  }
) {
  if (!worker) {
    worker = createWorker(createWorkerFunc)
  }

  worker.postMessage({
    'version-key': config.localPackageVersion,
    'polling-time': config.pollingTime || defaultPollingTime,
    immediate: config.immediate || false,
    'origin-version-file-url': config.originVersionFileUrl
  })

  worker.onmessage = (event: any) => {
    const cancelUpdateLock = cancelUpdate(
      options?.cancelMode,
      event.data?.refreshPageVersion,
      options?.cancelUpdateAndStopWorker,
      worker
    )
    if (cancelUpdateLock) return
    localStorage.removeItem('update-reminder:cancel')
    sessionStorage.removeItem('update-reminder:cancel')

    if (typeof config.onVersionUpdate === 'function') {
      config.onVersionUpdate(event.data)
    } else {
      const {
        title,
        description,
        buttonText,
        cancelButtonText,
        cancelMode,
        buttonStyle,
      } = options || {}
      const { onRefresh, onCancel } = config || {}
      TipDialog({
        title,
        description,
        buttonText,
        cancelButtonText,
        cancelMode,
        buttonStyle,
        newVersion: event.data.refreshPageVersion,
        onRefresh,
        onCancel,
      })
    }
  }
}

export function unCheckVersion({ closeDialog = false, closeWorker = true }) {
  if (closeWorker) {
    worker?.terminate()
  }
  if (closeDialog) {
    const dialogElement = document.querySelector('#update-reminder')
    const dialogElementParent = dialogElement?.parentElement
    if (dialogElement && dialogElementParent) {
      dialogElementParent.removeChild(dialogElement)
    }
  }
}