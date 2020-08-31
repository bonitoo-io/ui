import {mocked} from 'ts-jest/utils'
jest.mock('src/client')

import {
  postTemplatesApply as postTemplatesApplyMock,
  getStacks as getStacksMock,
  deleteStack as deleteStackMock,
  patchStack as patchStackMock,
} from 'src/client'

import {
  reviewTemplate,
  installTemplate,
  fetchStacks,
  deleteStack,
  updateStackName,
  fetchReadMe,
} from 'src/templates/api/'

describe('templates api calls', () => {
  beforeEach(() => {
    mocked(postTemplatesApplyMock).mockReset()
  })

  it('reviews a template successfully', async () => {
    const orgID = '1234'
    const templateUrl = 'http://example.com'

    mocked(postTemplatesApplyMock).mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {},
      })
    })

    await reviewTemplate(orgID, templateUrl)
    const [mockArguments] = mocked(postTemplatesApplyMock).mock.calls[0]

    expect(mockArguments.data.dryRun).toBeTruthy()
    expect(mockArguments.data.orgID).toBe(orgID)
    expect(mockArguments.data.remotes[0].url).toBe(templateUrl)
  })

  it('reviews a template unsuccessfully', async () => {
    const orgID = '1234'
    const templateUrl = 'http://example.com'

    mocked(postTemplatesApplyMock).mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        data: {
          message: 'whoops',
        },
      })
    })

    try {
      await reviewTemplate(orgID, templateUrl)
    } catch (error) {
      expect(error.message).toBe('whoops')
    }
  })

  it('can install template succsefully', async () => {
    const orgID = '1234'
    const templateUrl = 'http://example.com'
    mocked(postTemplatesApplyMock).mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {},
      })
    })

    await installTemplate(orgID, templateUrl, {})
    const [mockArguments] = mocked(postTemplatesApplyMock).mock.calls[0]

    expect(mockArguments.data.dryRun).toBeFalsy()
    expect(mockArguments.data.orgID).toBe(orgID)
    expect(mockArguments.data.remotes[0].url).toBe(templateUrl)
  })

  it('installs a template unsuccessfully', async () => {
    const orgID = '1234'
    const templateUrl = 'http://example.com'

    mocked(postTemplatesApplyMock).mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        data: {
          message: 'whoops',
        },
      })
    })

    try {
      await installTemplate(orgID, templateUrl, {})
    } catch (error) {
      expect(error.message).toBe('whoops')
    }
  })

  it('fetchStacks pass', async () => {
    const orgID = '1234'
    mocked(getStacksMock).mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {},
      })
    })

    await fetchStacks(orgID)
    const [mockArguments] = mocked(getStacksMock).mock.calls[0]

    expect(mockArguments.query.orgID).toBe(orgID)
  })

  it('fetchStack Fail', async () => {
    const orgID = '1234'
    mocked(getStacksMock).mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        data: {
          message: 'whoops',
        },
      })
    })

    try {
      await fetchStacks(orgID)
    } catch (error) {
      expect(error.message).toBe('whoops')
    }
  })

  it('deleteStack pass', async () => {
    const orgID = '1234'
    const stackID = '63728'
    mocked(deleteStackMock).mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {},
      })
    })

    await deleteStack(stackID, orgID)
    const [mockArguments] = mocked(deleteStackMock).mock.calls[0]

    expect(mockArguments.query.orgID).toBe(orgID)
    expect(mockArguments.stack_id).toBe(stackID)
  })

  it('deleteStack Fail', async () => {
    const orgID = '1234'
    const stackID = '63728'
    mocked(deleteStackMock).mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        data: {
          message: 'whoops',
        },
      })
    })

    try {
      await deleteStack(orgID, stackID)
    } catch (error) {
      expect(error.message).toBe('whoops')
    }
  })

  it('updateStackName', async () => {
    const name = 'test rule'
    const stackID = '63728'
    mocked(patchStackMock).mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {},
      })
    })

    await updateStackName(stackID, name)
    const [mockArguments] = mocked(patchStackMock).mock.calls[0]

    expect(mockArguments.data.name).toBe(name)
    expect(mockArguments.stack_id).toBe(stackID)
  })

  it('updateStackName Fail', async () => {
    const name = 'test rule'
    const stackID = '63728'
    mocked(patchStackMock).mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        data: {
          message: 'whoops',
        },
      })
    })

    try {
      await updateStackName(stackID, name)
    } catch (error) {
      expect(error.message).toBe('whoops')
    }
  })

  it('fetchReadMe pass', async () => {
    const name = 'docker'
    fetchMock.enableMocks()

    await fetchReadMe(name)

    expect(fetchMock).toHaveReturned()
    expect(mocked(fetchMock).mock.calls[0][0]).toBe(
      'https://raw.githubusercontent.com/influxdata/community-templates/master/docker/README.md'
    )
  })

  it('fetchReadMe fail', async () => {
    const name = 'imABadName'
    fetchMock.mockReject(new Error('foo'))

    try {
      await fetchReadMe(name)
    } catch (error) {
      expect(error.message).toBe('foo')
    }
  })
})
