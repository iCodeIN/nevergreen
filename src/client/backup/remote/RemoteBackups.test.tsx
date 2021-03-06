import React from 'react'
import userEvent from '@testing-library/user-event'
import {waitFor, within} from '@testing-library/react'
import {render, setupReactModal} from '../../testHelpers'
import {RemoteBackups} from './RemoteBackups'
import {DEFAULT_GITHUB_URL} from './RemoteLocationOptions'
import * as SecurityGateway from '../../gateways/SecurityGateway'
import {fakeRequest} from '../../gateways/Gateway'

beforeEach(setupReactModal)

beforeEach(() => {
  jest.spyOn(SecurityGateway, 'encrypt').mockResolvedValue(fakeRequest(''))
})

it('should not be able to add a remote backup with a blank URL', async () => {
  const {getByText, getByLabelText, queryByText, getByTestId} = render(<RemoteBackups/>)

  userEvent.click(getByText('Add location'))

  userEvent.selectOptions(getByLabelText('Where'), 'custom')
  userEvent.click(within(getByTestId('modal')).getByText('Add location'))

  await waitFor(() => {
    expect(queryByText('Please enter the URL')).toBeInTheDocument()
  })
})

it('should not be able to add a remote backup with a non http(s) URL', async () => {
  const {getByText, getByLabelText, queryByText, getByTestId} = render(<RemoteBackups/>)

  userEvent.click(getByText('Add location'))

  userEvent.selectOptions(getByLabelText('Where'), 'custom')
  userEvent.type(getByLabelText('URL'), 'file://example')
  userEvent.click(within(getByTestId('modal')).getByText('Add location'))

  await waitFor(() => {
    expect(queryByText('Only http and https URLs are supported')).toBeInTheDocument()
  })
})

it('should be able to add and remove a remote custom server backup', async () => {
  const {getByText, getByLabelText, queryByText, queryByTestId, getByTestId} = render(<RemoteBackups/>)

  userEvent.click(getByText('Add location'))

  userEvent.selectOptions(getByLabelText('Where'), 'custom')
  userEvent.type(getByLabelText('URL'), 'http://example.com')
  userEvent.click(within(getByTestId('modal')).getByText('Add location'))

  await waitFor(() => {
    expect(queryByTestId('modal')).not.toBeInTheDocument()
    expect(queryByText('http://example.com')).toBeInTheDocument()
  })

  userEvent.click(getByText('Remove location'))

  await waitFor(() => {
    expect(queryByText('http://example.com')).not.toBeInTheDocument()
  })
})

it('should be able to add and remove a remote GitHub gist backup', async () => {
  const {getByText, getByLabelText, queryByText, queryByTestId, getByTestId} = render(<RemoteBackups/>)

  userEvent.click(getByText('Add location'))

  userEvent.selectOptions(getByLabelText('Where'), 'github')

  expect(getByLabelText('URL')).toHaveValue(DEFAULT_GITHUB_URL)

  userEvent.type(getByLabelText('Access token'), 'some-token')
  userEvent.click(within(getByTestId('modal')).getByText('Add location'))

  await waitFor(() => {
    expect(queryByTestId('modal')).not.toBeInTheDocument()
    expect(queryByText('GitHub gist')).toBeInTheDocument()
  })

  userEvent.click(getByText('Remove location'))

  await waitFor(() => {
    expect(queryByText('GitHub gist')).not.toBeInTheDocument()
  })
})

it('should not be able to add a remote GitHub gist backup with a blank access token', async () => {
  const {getByText, getByLabelText, queryByText, getByTestId} = render(<RemoteBackups/>)

  userEvent.click(getByText('Add location'))

  userEvent.selectOptions(getByLabelText('Where'), 'github')
  userEvent.click(within(getByTestId('modal')).getByText('Add location'))

  await waitFor(() => {
    expect(queryByText('Please enter an access token')).toBeInTheDocument()
  })
})

it('should only clear errors for the changed field on type', async () => {
  const {getByText, getByLabelText, queryByText, getByTestId} = render(<RemoteBackups/>)

  userEvent.click(getByText('Add location'))

  userEvent.selectOptions(getByLabelText('Where'), 'github')
  userEvent.clear(getByLabelText('URL'))
  userEvent.click(within(getByTestId('modal')).getByText('Add location'))

  await waitFor(() => {
    expect(queryByText('Please enter the URL')).toBeInTheDocument()
    expect(queryByText('Please enter an access token')).toBeInTheDocument()
  })

  userEvent.type(getByLabelText('URL'), 'h')

  await waitFor(() => {
    expect(queryByText('Please enter the URL')).not.toBeInTheDocument()
    expect(queryByText('Please enter an access token')).toBeInTheDocument()
  })
})
