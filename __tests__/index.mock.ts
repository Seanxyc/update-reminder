export function mockUrl() {
  const windowMock = {
    URL: {
      createObjectURL: (blob: Blob) => 'fwlymyyw-htccsrgdk-rgemfpyt-cffydvvpc-ycgvno',
    },
  }
  vi.stubGlobal('window', windowMock)
}

export function mockWorker() {
  class Worker {
    url: string
    onmessage: (msg: string) => void
    constructor(url: string) {
      this.url = url
      this.onmessage = () => {}
    }

    postMessage(msg: string) {
      this.onmessage(msg)
    }
    terminate() {
      console.log('stop')
    }
  }

  window.Worker = Worker as any
}

export function mockSetInterval() {
  const windowMock = {
    setInterval: (cb: () => void) => {
      cb()
    },
  }
  vi.stubGlobal('window', windowMock)
}

export function mockFetch() {
  const windowMock = {
    fetch: (url: string) => {
      return new Promise(resolve => {
        resolve({
          json: () => {
            return Promise.resolve({ version: '1.2.0' })
          },
        })
      })
    },
  }
  vi.stubGlobal('window', windowMock)
}

export function mockDateToLocaleDateString() {}
