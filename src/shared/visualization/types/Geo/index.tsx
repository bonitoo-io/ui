import icon from './icon'
import GeoOptions from '../../../../timeMachine/components/view_options/GeoOptions'
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
