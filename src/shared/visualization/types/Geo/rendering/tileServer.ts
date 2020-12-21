import {runQuery} from 'src/shared/apis/query'
import fromFlux from 'src/shared/utils/fromFlux'
import _ from 'lodash'
import {MAP_STYLES, MapProvider} from './tileServerMapStyles'

const OPEN_STREET_MAPS = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export interface TileServerConfigurations {
  mapProvider: MapProvider
  tileServerUrl?: string
  bingKey?: string
}

const DEFAULT_TILE_SERVER_CONFIGURATION = {
  mapProvider: MapProvider.UNKNOWN,
  tileServerUrl: OPEN_STREET_MAPS,
}

let tileServerConfigurations: TileServerConfigurations = null

export const getTileServerConfigurations = (
  mapStyle: string
): TileServerConfigurations => {
  return updateTileServerURLWithMapStyle(tileServerConfigurations, mapStyle)
}

const buildQuery = (secretName: string): string => {
  return (
    `import "influxdata/influxdb/secrets"\n` +
    `buckets() |> limit(n:1) |> map(fn: (r) => ({property: secrets.get(key: "${secretName}")}))`
  )
}

const getValue = result => {
  if (result.type === 'SUCCESS') {
    const parsed = fromFlux(result.csv)
    return _.get(parsed, 'table.columns.property.data[0]')
  }
}

const MAPBOX_STYLE_VARIABLE = '{mapBoxStyle}'

export const updateTileServerURLWithMapStyle = (
  configuration: TileServerConfigurations,
  mapStyle: string
): TileServerConfigurations => {
  if (!configuration) return configuration
  const tileServerUrl = configuration.tileServerUrl
  if (tileServerUrl) {
    return {
      mapProvider: configuration.mapProvider,
      tileServerUrl: tileServerUrl.replace(
        MAPBOX_STYLE_VARIABLE,
        MAP_STYLES[MapProvider.MAP_BOX].validate(mapStyle)
      ),
    }
  }
  return configuration
}

export const loadTileServerSecret = async (
  orgID: string,
  mapStyle: string
): Promise<TileServerConfigurations> => {
  if (tileServerConfigurations) return tileServerConfigurations
  try {
    const results = await Promise.all(
      ['geo.tile.server.url', 'geo.bing-maps.key'].map(
        p => runQuery(orgID, buildQuery(p)).promise
      )
    )
    const [generic, bing] = results
    const bingKey = getValue(bing)
    if (bingKey) {
      tileServerConfigurations = {mapProvider: MapProvider.BING, bingKey}
      return tileServerConfigurations
    }
    const tileServerUrl = getValue(generic)
    if (tileServerUrl) {
      tileServerConfigurations = {
        mapProvider:
          tileServerUrl.indexOf(MAPBOX_STYLE_VARIABLE) >= 0
            ? MapProvider.MAP_BOX
            : MapProvider.UNKNOWN,
        tileServerUrl,
      }
      return updateTileServerURLWithMapStyle(tileServerConfigurations, mapStyle)
    }
  } catch (e) {
    console.error('Unable to load geo widget tile server configuration', e)
  }
  return DEFAULT_TILE_SERVER_CONFIGURATION
}
