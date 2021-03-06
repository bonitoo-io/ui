// Libraries
import React, {FC} from 'react'
import {useSelector} from 'react-redux'
import {Panel, ComponentSize, InfluxColors} from '@influxdata/clockface'

// Components
import {View} from 'src/visualization'

// Utils
import {getTimeRangeWithTimezone} from 'src/dashboards/selectors'

// Types
import {
  SingleStatViewProperties,
  RemoteDataState,
  XYViewProperties,
  InternalFromFluxResult,
  UsageVector,
} from 'src/types'

interface OwnProps {
  usageVector: UsageVector
  fromFluxResult: InternalFromFluxResult
  type: 'xy' | 'stat'
  length?: number
}

const GENERIC_PROPERTY_DEFAULTS = {
  colors: [],
  queries: [],
  note: '',
  showNoteWhenEmpty: true,
  prefix: '',
  suffix: '',
  tickPrefix: '',
  tickSuffix: '',
}

const GraphTypeSwitcher: FC<OwnProps> = ({
  usageVector,
  fromFluxResult,
  type,
  length = 1,
}) => {
  const timeRange = useSelector(getTimeRangeWithTimezone)

  const singleStatProperties: SingleStatViewProperties = {
    ...GENERIC_PROPERTY_DEFAULTS,
    type: 'single-stat',
    shape: 'chronograf-v2',
    suffix: ` ${usageVector?.unit ?? ''}`,
    decimalPlaces: {isEnforced: false, digits: 0},
  }

  const xyProperties: XYViewProperties = {
    ...GENERIC_PROPERTY_DEFAULTS,
    type: 'xy',
    shape: 'chronograf-v2',
    axes: {
      x: {},
      y: {},
    },
    position: 'overlaid',
    yColumn: usageVector.fluxKey,
    geom: 'line',
  }

  const isXy = type === 'xy'

  const error = fromFluxResult?.table?.columns?.error?.data?.[0]

  return (
    <Panel
      backgroundColor={InfluxColors.Raven}
      className="graph-type--panel"
      testID="graph-type--panel"
    >
      <Panel.Header size={ComponentSize.ExtraSmall}>
        <h5>{`${usageVector.name} ${
          usageVector.unit !== '' ? `(${usageVector.unit})` : ''
        }`}</h5>
      </Panel.Header>
      <Panel.Body
        className="panel-body--size"
        style={{height: isXy ? 250 : 300 / length}}
      >
        <View
          loading={error ? RemoteDataState.Error : RemoteDataState.Done}
          error={`${error ?? ''}`}
          isInitial={false}
          properties={isXy ? xyProperties : singleStatProperties}
          result={fromFluxResult}
          timeRange={timeRange}
        />
      </Panel.Body>
    </Panel>
  )
}

export default GraphTypeSwitcher
