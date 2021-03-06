import icon from './icon'
import properties from './properties'
import view from './view'
import options from './options'

export default register => {
  register({
    type: 'mosaic',
    name: 'Mosaic',
    graphic: icon,
    component: view,
    initial: properties,
    options,
  })
}
