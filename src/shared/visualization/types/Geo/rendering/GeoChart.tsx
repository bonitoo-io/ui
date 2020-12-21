// Libraries
import {Component} from 'react'
import {Table} from '@influxdata/giraffe'
import {connect} from 'react-redux'

// Types
import {GeoViewProperties} from 'src/types/dashboards'
import {AppState, Theme} from 'src/types'
import {VariableAssignment} from 'src/types'
import {Config} from '@influxdata/giraffe'
import {GeoQueryVariables} from '@influxdata/giraffe/dist'

// Utils
import {ErrorHandling} from 'src/shared/decorators/errors'
import {
  setViewport,
  setViewVariableAssignment,
} from 'src/shared/visualization/types/Geo/options/geoActions'
import {
  getTileServerConfigurations,
  loadTileServerSecret,
  TileServerConfigurations,
} from 'src/shared/visualization/types/Geo/rendering/tileServer'
import {getOrg} from 'src/organizations/selectors'
import {calculateVariableAssignment} from './geoVisualizationVars'

interface OwnProps {
  table: Table
  properties: GeoViewProperties
  children: (config: Config) => JSX.Element
  isInConfigurationMode: boolean
  onViewVariablesReady: (variables: VariableAssignment[]) => void
  theme: Theme
}

interface StateProps {
  orgID: string
}

interface DispatchProps {
  onUpdateViewport: (lat: number, lon: number, zoom: number) => void
  onUpdateVariableAssignment: (assignment: VariableAssignment[]) => void
}

interface State {
  tileServerConfiguration: TileServerConfigurations
}

@ErrorHandling
class GeoChart extends Component<OwnProps & DispatchProps & StateProps, State> {
  private skipNextRender = false

  constructor(props) {
    super(props)
    const configuration = getTileServerConfigurations(props.properties.mapStyle)
    this.state = {tileServerConfiguration: configuration}
    if (!configuration) {
      loadTileServerSecret(props.orgID, props.properties.mapStyle).then(
        configuration => {
          this.setState({tileServerConfiguration: configuration})
        }
      )
    }
  }

  shouldComponentUpdate(): boolean {
    const {skipNextRender} = this
    if (skipNextRender) {
      this.skipNextRender = false
      return false
    }
    return true
  }

  private onUpdateViewport = (lat: number, lon: number, zoom: number) => {
    const {properties, isInConfigurationMode} = this.props
    if (isInConfigurationMode) this.skipNextRender = true
    if (isInConfigurationMode || properties.allowPanAndZoom) {
      this.props.onUpdateViewport(lat, lon, zoom)
    }
  }

  private onUpdateQuery = (variables: GeoQueryVariables) => {
    const {onViewVariablesReady} = this.props

    const variableAssignment = calculateVariableAssignment(variables)
    onViewVariablesReady && onViewVariablesReady(variableAssignment)
  }

  public render() {
    const {properties, table, isInConfigurationMode} = this.props
    const {
      layers,
      zoom,
      allowPanAndZoom,
      detectCoordinateFields,
      mapStyle,
    } = properties
    const tileServerConfiguration = getTileServerConfigurations(mapStyle)
    if (!tileServerConfiguration) return null
    const {lat, lon} = properties.center
    const {onUpdateQuery, onUpdateViewport} = this
    const config: Config = {
      table,
      showAxes: false,
      layers: [
        {
          type: 'geo',
          lat,
          lon,
          zoom,
          allowPanAndZoom: isInConfigurationMode || allowPanAndZoom,
          detectCoordinateFields,
          mapStyle,
          layers,
          onUpdateQuery,
          onUpdateViewport,
          tileServerConfiguration: {
            tileServerUrl: tileServerConfiguration.tileServerUrl,
            bingKey: tileServerConfiguration.bingKey,
          },
        },
      ],
    }
    return this.props.children(config)
  }
}

const mapDispatchToProps: DispatchProps = {
  onUpdateViewport: setViewport,
  onUpdateVariableAssignment: setViewVariableAssignment,
}

const mapStateToProps = (state: AppState): StateProps => {
  const orgID = getOrg(state).id
  return {
    orgID,
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(GeoChart)
