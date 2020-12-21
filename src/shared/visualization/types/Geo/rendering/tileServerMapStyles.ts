import {invert} from 'lodash'

export enum MapProvider {
  BING,
  MAP_BOX,
  UNKNOWN,
}

export enum MAPBOX_STYLES {
  STREETS = 'streets-v11',
  OUTDOORS = 'outdoors-v11',
  LIGHT = 'light-v10',
  DARK = 'dark-v10',
  SATELLITE = 'satellite-v9',
  SATELLITE_STREETS = 'satellite-streets-v11',
}

const MAPBOX_MAP_STYLES = {
  Roads: MAPBOX_STYLES.STREETS,
  Outdoors: MAPBOX_STYLES.OUTDOORS,
  Satellite: MAPBOX_STYLES.SATELLITE_STREETS,
  'Satellite (plain)': MAPBOX_STYLES.SATELLITE,
  Dark: MAPBOX_STYLES.DARK,
  Light: MAPBOX_STYLES.LIGHT,
}

enum BING_STYLES {
  ROADS = 'roads',
  SATELLITE = 'satellite',
  SATELLITE_PLAIN = 'satellite_plain',
  DARK = 'dark',
}

const BING_MAP_STYLES = {
  Roads: BING_STYLES.ROADS,
  Satellite: BING_STYLES.SATELLITE,
  'Satellite (plain)': BING_STYLES.SATELLITE_PLAIN,
  Dark: BING_STYLES.DARK,
}

export const MAP_STYLES = {
  [MapProvider.BING]: {
    styles: BING_MAP_STYLES,
    default: BING_STYLES.ROADS,
    validate(style) {
      if (!BING_STYLES[style]) return BING_STYLES.ROADS
      return style
    },
  },
  [MapProvider.MAP_BOX]: {
    styles: MAPBOX_MAP_STYLES,
    default: MAPBOX_STYLES.STREETS,
    validate(style) {
      if (!invert(MAPBOX_STYLES)[style]) return MAPBOX_STYLES.STREETS
      return style
    },
  },
}
