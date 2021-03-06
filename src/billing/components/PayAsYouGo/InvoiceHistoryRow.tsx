import React, {FC} from 'react'
import classnames from 'classnames'

import {FlexBox, FlexDirection, JustifyContent} from '@influxdata/clockface'

import {Invoice} from 'src/types/billing'

interface Props {
  invoice: Invoice
}

const getPreviousMonth = date => {
  const currentMonth = date.getUTCMonth()
  date.setMonth(currentMonth - 1)
  return date.toLocaleString('default', {month: 'long'})
}

const InvoiceHistoryRow: FC<Props> = ({
  invoice: {status, amount, targetDate, id},
}) => {
  const invoiceName = `${getPreviousMonth(new Date(targetDate))} ${new Date(
    targetDate
  ).getFullYear()} Invoice`
  const link = `/api/v2/quartz/billing/invoices/${id}`
  const statusClassName = classnames('invoice-details invoice-status', {
    ['paid']: status === 'Paid',
  })

  return (
    <FlexBox
      className="list-item"
      direction={FlexDirection.Row}
      justifyContent={JustifyContent.SpaceBetween}
      stretchToFitWidth={true}
    >
      <a href={link} target="_blank" rel="noreferrer">
        {invoiceName}
      </a>
      <FlexBox direction={FlexDirection.Row}>
        <strong className="invoice-details">${amount.toFixed(2)}</strong>
        <strong className={statusClassName}>{status}</strong>
      </FlexBox>
    </FlexBox>
  )
}

export default InvoiceHistoryRow
