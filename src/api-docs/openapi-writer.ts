import fs from 'node:fs'
import path from 'node:path'
import { openApiDec } from './openapi-generator'

const scriptDir = path.resolve(__dirname)
const jsonDoc = JSON.stringify(openApiDec, null, 2)
fs.writeFileSync(`${scriptDir}/openapi.json`, jsonDoc)
console.log('Openapi documents has been generated in JSON format')
