require('@babel/register')({
  presets: ['@babel/preset-env']
})
const fs = require('fs')
const { andThen, pipe } = require('ramda')
const { parkingAreaMapper } = require('./src/helpers/RDWData.js')
const { fetchAndParseMultipleJson } = require('./src/modules/fetch.js')

parseRDWData([
  "https://opendata.rdw.nl/resource/adw6-9hsg.json?$limit=10000&$where=usageid!='VERGUNP'", // parking areas
  "https://opendata.rdw.nl/resource/qidm-7mkf.json?$limit=10000&$where=usageid!='VERGUNP'", // usage goal
  'https://opendata.rdw.nl/resource/b3us-f26s.json?$limit=10000', // area specifications
  'https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=10000', // geometry parking area
  'https://opendata.rdw.nl/resource/edv8-qiyg.json?$limit=10000', // parking entrance
])

async function parseRDWData(uri) {
  const data = await pipe(
    fetchAndParseMultipleJson,
    andThen(parkingAreaMapper)
  )(uri)
  fs.writeFileSync('./src/rdw-data.json', JSON.stringify(data))
}
