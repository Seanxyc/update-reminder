import { unCheckVersion } from "../index";
import { CancelMode } from "../worker";
import './tip-dialog.css'

const defaultConfig = {
  title: '提示',
  description: '检测到新的版本',
  buttonText: '刷新'
}

export function TipDialog(params: {
  title?: string
  description?: string
  buttonText?: string
  cancelButtonText?: string
  cancelMode?: string
  buttonStyle?: string
  newVersion: string
  onRefresh?: (event: any) => void
  onCancel?: (event: any) => void
}) {
  const dialogElement = document.querySelector('#update-reminder')
  if (dialogElement) return
  const template = `
    <div id="update-reminder">
      <div class="version-content">
        <div class="version-title">${params.title || defaultConfig.title}</div>
        <div class="version-subtitle">${params.description || `${defaultConfig.description} V${params.newVersion}`}</div>
        <div class="button-container">
          <div class="refresh-button" style="${params.buttonStyle || ''}">${params.buttonText || defaultConfig.buttonText}</div>
          ${params.cancelButtonText ? ` <div class="cancel-button">${params.cancelButtonText}</div> ` : ''}
        </div>
      </div>
    </div>
  `

  const rootNode = document.createElement('div')
  rootNode.innerHTML = template
  document.body.appendChild(rootNode)

  const refreshBtnNode: HTMLElement | null = document.querySelector('#update-reminder .refresh-button')
  if (refreshBtnNode) {
    refreshBtnNode.onclick = () => {
      if (typeof params?.onRefresh === 'function') {
        params.onRefresh({ newVersion: params.newVersion })
      } else {
        window.location.reload()
      }
    }
  }

  const cancelBtnNode: HTMLElement | null = document.querySelector('#update-reminder .cancel-button')
  if (cancelBtnNode) {
    cancelBtnNode.onclick = () => {
      if (typeof params?.onCancel === 'function') {
        params.onCancel({ newVersion: params.newVersion })
        return
      }

      const cancelMode = params?.cancelMode || CancelMode.ignoreCurrentVersion
      switch (cancelMode) {
        case CancelMode.ignoreCurrentVersion:
          localStorage.setItem('update-reminder:canceled', params.newVersion)
          break
        case CancelMode.ignoreCurrentWindow:
          sessionStorage.setItem('update-reminder:canceled', 'true')
          break
        case CancelMode.ignoreToday:
          localStorage.setItem('update-reminder:canceled', new Date().toLocaleDateString())
          break
        default:
          break
      }
    }

    unCheckVersion({ closeDialog: true, closeWorker: false })
  }
}
