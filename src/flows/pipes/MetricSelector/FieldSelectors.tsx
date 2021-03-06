// Libraries
import React, {FC, useContext, useCallback} from 'react'

// Components
import {List, Gradients} from '@influxdata/clockface'
import {PipeContext} from 'src/flows/context/pipe'
import {SchemaContext} from 'src/flows/pipes/MetricSelector/context'

// Utils
import {event} from 'src/cloud/utils/reporting'

type Props = {
  fields: string[]
}

const FieldSelectors: FC<Props> = ({fields}) => {
  const {data, update} = useContext(PipeContext)
  const {setSearchTerm} = useContext(SchemaContext)
  const selectedField = data?.field
  const updateFieldSelection = useCallback(
    (field: string): void => {
      let updated = field
      if (updated === selectedField) {
        event('metric_selector_add_filter')
        event('Deselecting Field in Flow Query Builder')
        updated = ''
      } else {
        setSearchTerm('')
        event('metric_selector_remove_filter')
        event('Selecting Field in Flow Query Builder', {field})
      }
      update({field: updated})
    },
    [update, selectedField]
  )

  return (
    <>
      {fields
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map(field => (
          <List.Item
            key={field}
            value={field}
            onClick={() => updateFieldSelection(field)}
            selected={field === selectedField}
            title={field}
            gradient={Gradients.GundamPilot}
            wrapText={true}
            testID={`field-selector ${field}`}
          >
            <List.Indicator type="dot" />
            <div className="selectors--item-value selectors--item__field">
              {field}
            </div>
            <div className="selectors--item-name">field</div>
          </List.Item>
        ))}
    </>
  )
}

export default FieldSelectors
