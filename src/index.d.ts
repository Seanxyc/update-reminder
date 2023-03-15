export declare const checkVersion: (
  config: {
    originVersionFileUrl: string
    localPackageVersion: string
    pollingTime?: number | undefined
    immediate?: boolean | undefined
    onVersionUpdate?: ((event: any) => void) | undefined
    onRefresh?: ((event: any) => void) | undefined
    onCancel?: ((event: any) => void) | undefined
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
) => void

export declare const unCheckVersion: ({
  closeDialog,
  closeWorker,
}: {
  closeDialog?: boolean | undefined
  closeWorker?: boolean | undefined
}) => void
