import icon from './icon'
import GeoOptions from 'src/shared/visualization/types/Geo/options/GeoOptions'
import {defaultGeoViewProperties} from '../../../../views/helpers'

export default register => {
  register({
    type: 'geo',
    name: 'Map',
    graphic: icon,
    initial: defaultGeoViewProperties(),
    // featureFlag: 'geoVisualizationType',
    options: GeoOptions,
  })
}
