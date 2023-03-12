import {
  createWorker,
  createWorkerFunc,
  cancelUpdate
} from '../src/worker'
import {
  mockFetch,
  mockSetInterval,
  mockUrl,
  mockWorker,
} from './index.mock'

test('create web worker', () => {
  mockUrl()
  mockWorker()
  expect(createWorker(() => console.log(1)) instanceof Worker).toBeTruthy()
})

test('create worker function', () => {
  mockSetInterval()
  mockFetch()
  const self: any = createWorkerFunc()
  self.onmessage({
    data: {
      'version-key': '1.1.0',
      'polling-time': 0,
      immediate: true,
      'origin-version0file-url': 'https://www.example.com'
    }
  })
  // self.postMessage = (obj: { refreshPageVersion: string }) =>{ 
  //   expect(typeof obj === 'object' && obj.refreshPageVersion).toBeTruthy()
  // }
})

test('cancel update function', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers
  })
  mockWorker()
  const worker = new Worker('https://test.com')

  localStorage.setItem('update-reminder:canceled', '1.0.0')
  expect(cancelUpdate('ignore-current-version', '1.0.0', true, worker)).toBeTruthy()
  expect(cancelUpdate('ignore-current-version', '1.0.0', true, undefined)).toBeTruthy()

  localStorage.setItem('update-reminder:canceled', '1.1.0')
  expect(cancelUpdate('ignore-current-version', '1.0.0', false, worker)).toBeFalsy()

  const date = new Date(2023, 2, 10)
  vi.setSystemTime(date)
  localStorage.setItem('update-reminder:canceled', '3/10/2023')
  expect(cancelUpdate('ignore-today', '1.0.0', true, worker)).toBeTruthy()
  expect(cancelUpdate('ignore-today', '1.0.0', true, undefined),).toBeTruthy()

  localStorage.setItem('update-reminder:canceled', '3/11/2023')
  expect(cancelUpdate('ignore-today', '1.0.0', false, worker)).toBeFalsy()

  sessionStorage.setItem('update-reminder:canceled', 'true')
  expect(cancelUpdate('ignore-current-window', '1.0.0', true, worker),).toBeTruthy()
  expect(cancelUpdate('ignore-current-window', '1.0.0', true, undefined),).toBeTruthy()

  sessionStorage.setItem('update-reminder:canceled', '')
  expect(cancelUpdate('ignore-current-window', '1.0.0', false, worker),).toBeFalsy()

  expect(cancelUpdate('ignore-test', '1.0.0', false, worker)).toBeFalsy()

  localStorage.setItem('update-reminder:canceled', '1.1.0')
  expect(cancelUpdate(undefined, '', undefined, undefined)).toBeFalsy()

  localStorage.setItem('update-reminder:canceled', '')
  expect(cancelUpdate('ignore-today', '', undefined, undefined)).toBeFalsy()

  sessionStorage.setItem('update-reminder:canceled', '')
  expect(cancelUpdate('ignore-today', '', undefined, undefined)).toBeFalsy()
})

test('check version', () => {

})