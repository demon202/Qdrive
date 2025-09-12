import { formatDateTime } from '@/lib/utils';
import React from 'react'

export const FormattedDateTime = ({date,className}: {date:string; className?: string}) => {
  return (
    <p className= 'body-1 text-bg-Dark'>{formatDateTime(date)}</p>
  )
}

export default FormattedDateTime