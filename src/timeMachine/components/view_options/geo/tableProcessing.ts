// Libraries
import {keys, indexOf} from 'lodash'
import {Table} from '@influxdata/giraffe'

// Constants
export const FIELD_COLUMN = '_field'
export const VALUE_COLUMN = '_value'
export const TABLE_COLUMN = 'table'
export const QUERY_META_COLUMNS = [
  FIELD_COLUMN,
  VALUE_COLUMN,
  TABLE_COLUMN,
  '_start',
  '_stop',
]

export const getColumnNames = (
  table: Table,
  autoPivoting: boolean
): string[] => {
  if (autoPivoting) {
    return getFieldColumnValues(table)
  }
  return getNumericColumns(table)
}

const getFieldColumnValues = (table: Table): string[] => {
  const fieldColumn = table.getColumn(FIELD_COLUMN, 'string')
  const valueColumn = table.getColumn(VALUE_COLUMN)
  if (!fieldColumn) {
    return []
  }
  const entriesCount = fieldColumn.length
  const fieldNames = {}
  for (let i = 0; i < entriesCount; i++) {
    const fieldName = fieldColumn[i]
    if (typeof valueColumn[i] === 'number') {
      fieldNames[fieldName] = true
    }
  }
  return filterMetaColumns(keys(fieldNames))
}

const filterMetaColumns = (fieldNames: string[]) => {
  return fieldNames.filter(name => indexOf(QUERY_META_COLUMNS, name) < 0)
}

const getNumericColumns = (table: Table): string[] => {
  return table.columnKeys.filter(k => {
    if (k === 'result' || k === 'table') {
      return false
    }
    const columnType = table.getColumnType(k)
    return columnType === 'time' || columnType === 'number'
  })
}
