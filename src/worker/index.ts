export function createWorker(func: () => void): Worker {
  const blob = new Blob(['(' + func.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}

export function createWorkerFunc() {
  let oldVersion = ''
  let intervalTime = 5000
  let immediate = false
  let originFileUrl = ''
  self.onmessage = (event: any) => {
    oldVersion = event.data['version-key']
    intervalTime = event.data['polling-time']
    immediate = event.data['immediate']
    originFileUrl = event.data['origin-version-file-url']

    // fetch version json file 
    const doFetch = () => {
      fetch(`${originFileUrl}?${+new Date()}`).then(res => {
        return res.json()
      }).then((versionJsonFile) => {
        if (oldVersion !== versionJsonFile.version) {
          // remind to update
          self.postMessage({
            refreshPageVersion: `${versionJsonFile.version}`,
            external: versionJsonFile.external
          })
        }
      }).catch(() => { })
    }

    if (immediate) doFetch()
    setInterval(doFetch, intervalTime)
  }
  return self
}

export enum CancelMode {
  ignoreCurrentVersion = 'ignore-current-version',
  ignoreToday = 'ignore-today',
  ignoreCurrentWindow = 'ignore-current-window'
}

export function cancelUpdate(
  cancelMode: string | undefined,
  newVersion: string,
  cancelUpdateAndStopWorker: boolean | undefined,
  worker: Worker | undefined
) {
  const cancelModeType = cancelMode || CancelMode.ignoreCurrentVersion
  const cancelModeTypeValue = localStorage.getItem('update-reminder:canceled') || ''
  const todayDate = new Date().toLocaleDateString()
  const cancelModeTypeValueInSession = sessionStorage.getItem('update-reminder:canceled') || ''
  const isStopWorker = cancelUpdateAndStopWorker || false

  switch (cancelModeType) {
    case CancelMode.ignoreCurrentVersion:
      if (cancelModeTypeValue === newVersion) {
        isStopWorker && worker?.terminate()
        return true
      }
      break
    case CancelMode.ignoreCurrentWindow:
      if (cancelModeTypeValueInSession) {
        isStopWorker && worker?.terminate()
        return true
      }
      break
    case CancelMode.ignoreToday:
      if (cancelModeTypeValue === todayDate) {
        isStopWorker && worker?.terminate()
        return true
      }
      break

    default:
      break
  }

  return false
}
