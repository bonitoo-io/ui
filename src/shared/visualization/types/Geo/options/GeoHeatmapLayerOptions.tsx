// Libraries
import React, {FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Form, Input, InputType} from '@influxdata/clockface'

// Components
import FieldSelector from 'src/shared/visualization/types/Geo/options/GeoFieldSelector'
import ColorSchemeDropdown from 'src/shared/components/ColorSchemeDropdown'
import AutoDomainInput from 'src/shared/components/AutoDomainInput'

// Actions
import {
  setDimensionProperty,
  setField,
  setLayerColors,
  setRadius,
} from 'src/shared/visualization/types/Geo/options/geoActions'

// Types
import {Color} from 'src/types'
import {Axis, GeoHeatMapViewLayer} from 'src/client'

// Utils
import {nameOf} from 'src/shared/visualization/types/Geo/rendering/utils'
import {parseYBounds as parseBounds} from 'src/shared/utils/vis'

const MIN_CIRCLE_RADIUS = 1
const MAX_CIRCLE_RADIUS = 100
const MIN_BLUR_FACTOR = 0
const MAX_BLUR_FACTOR = 100

interface OwnProps {
  id: number
  layer: GeoHeatMapViewLayer
  columns: string[]
}

interface DispatchProps {
  onUpdateColors: (colors: Color[], layer: number) => void
  onUpdateRadius: (radius: number, layer: number) => void
  onUpdateField: (
    fieldName: string,
    field: string | number,
    layer: number
  ) => void
  onUpdateDimensionProperty: (
    layerId: number,
    dimensionProperty: string,
    property,
    value
  ) => void
}

type Props = OwnProps & DispatchProps

const GeoHeatmapLayerOptions: FunctionComponent<Props> = props => {
  const {columns, layer, id} = props
  const {intensityDimension, colors} = layer
  const bounds = intensityDimension ? intensityDimension.bounds : null

  return (
    <>
      <h5 className="view-options--header">Rendering Parameters</h5>
      <Form.Element label="Single point radius (pixels)">
        <Input
          style={{flex: '1 0 0'}}
          testID={`geo-radius-input`}
          value={layer.radius}
          min={MIN_CIRCLE_RADIUS}
          placeholder="Radius in px"
          max={MAX_CIRCLE_RADIUS}
          type={InputType.Number}
          onChange={e => {
            props.onUpdateRadius(Number(e.target.value), id)
          }}
        />
      </Form.Element>
      <Form.Element label="Blur factor">
        <Input
          style={{flex: '1 0 0'}}
          testID={`geo-radius-input`}
          value={layer.blur}
          placeholder="Blur factor 0-100"
          min={MIN_BLUR_FACTOR}
          max={MAX_BLUR_FACTOR}
          type={InputType.Number}
          onChange={e => {
            props.onUpdateField(
              nameOf<GeoHeatMapViewLayer>('blur'),
              Number(e.target.value),
              id
            )
          }}
        />
      </Form.Element>
      <h5 className="view-options--header">Color Intensity</h5>
      <Form.Element label="Intensity column">
        <FieldSelector
          selectedColumn={layer.intensityField}
          onSelectColumn={field => {
            props.onUpdateField(
              nameOf<GeoHeatMapViewLayer>('intensityField'),
              field,
              id
            )
          }}
          availableColumns={columns}
        />
      </Form.Element>
      <Form.Element label="Line Colors">
        <ColorSchemeDropdown
          value={colors}
          onChange={colors => {
            props.onUpdateColors(colors, id)
          }}
        />
      </Form.Element>
      <AutoDomainInput
        minLabel={'Value for minimum intensity'}
        maxLabel={`Value for maximum intensity`}
        domain={parseBounds(bounds)}
        onSetDomain={bounds => handleSetIntensityDomain(props, bounds, id)}
        label="Value to intensity mapping"
      />
      {/* User won't get any value due to filling these values. It will make sense
          once tooltips are available for the heatmap.
      <DimensionValueDisplayProperties
        dimension={layer.intensityDimension}
        onChange={(property, value) => {
          props.onUpdateDimensionProperty(
            id,
            nameOf<GeoHeatMapViewLayer>('intensityDimension'),
            property,
            value
          )
        }}
      />
      */}
    </>
  )
}

const handleSetIntensityDomain = (
  props: Props,
  intensityDomain: [number, number],
  layer: number
): void => {
  let bounds: [string, string] | [null, null]
  if (intensityDomain) {
    bounds = [String(intensityDomain[0]), String(intensityDomain[1])]
  } else {
    bounds = [null, null]
  }
  props.onUpdateDimensionProperty(
    layer,
    nameOf<GeoHeatMapViewLayer>('intensityDimension'),
    nameOf<Axis>('bounds'),
    bounds
  )
}

const mapDispatchToProps: DispatchProps = {
  onUpdateColors: setLayerColors,
  onUpdateField: setField,
  onUpdateRadius: setRadius,
  onUpdateDimensionProperty: setDimensionProperty,
}

export default connect<{}, DispatchProps, OwnProps>(
  null,
  mapDispatchToProps
)(GeoHeatmapLayerOptions)
