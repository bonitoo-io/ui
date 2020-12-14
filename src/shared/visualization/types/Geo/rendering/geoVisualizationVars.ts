import {RemoteDataState, VariableAssignment} from 'src/types'
import {GeoQueryVariables} from '@influxdata/giraffe/dist'

export enum GEO_VARIABLES {
  LON = 'lon',
  LAT = 'lat',
  RADIUS = 'radius',
}

enum VisualizationVariableNames {
  GEO_VIEW_LON = 'geo-view-lon',
  GEO_VIEW_LAT = 'geo-view-lat',
  GEO_VIEW_RADIUS = 'radius',
}

export const GEO_VARIABLE_NAMES = [
  VisualizationVariableNames.GEO_VIEW_LON,
  VisualizationVariableNames.GEO_VIEW_LAT,
  VisualizationVariableNames.GEO_VIEW_RADIUS,
]

const buildVisualizationVariable = (id, name) => ({
  orgID: '',
  id: id,
  name: name,
  status: RemoteDataState.Done,
  labels: [],
  arguments: {type: 'system'},
})

export const GEO_VISUALIZATION_VARIABLES = {
  [VisualizationVariableNames.GEO_VIEW_LON]: buildVisualizationVariable(
    VisualizationVariableNames.GEO_VIEW_LON,
    GEO_VARIABLES.LON
  ),
  [VisualizationVariableNames.GEO_VIEW_LAT]: buildVisualizationVariable(
    VisualizationVariableNames.GEO_VIEW_LAT,
    GEO_VARIABLES.LAT
  ),
  [VisualizationVariableNames.GEO_VIEW_RADIUS]: buildVisualizationVariable(
    VisualizationVariableNames.GEO_VIEW_RADIUS,
    GEO_VARIABLES.RADIUS
  ),
}

export const calculateVariableAssignment = (
  variables: GeoQueryVariables
): VariableAssignment[] => {
  return [
    {
      type: 'VariableAssignment',
      id: {type: 'Identifier', name: GEO_VARIABLES.LON},
      init: {type: 'FloatLiteral', value: variables.lon},
    },
    {
      type: 'VariableAssignment',
      id: {type: 'Identifier', name: GEO_VARIABLES.LAT},
      init: {type: 'FloatLiteral', value: variables.lat},
    },
    {
      type: 'VariableAssignment',
      id: {type: 'Identifier', name: GEO_VARIABLES.RADIUS},
      init: {
        type: 'FloatLiteral',
        value: variables.radius,
      },
    },
  ]
}
