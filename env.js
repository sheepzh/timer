/**
 * Resolve environment 
 * 
 * @since 1.0.0
 */
const path = require('path')
const fs = require('fs')
module.exports = __dirname => {
  // Get the env
  const argv = process.argv
  let env = 'production'
  argv.filter(a => a.startsWith('--mode=')).map(a => a.substring(7)).forEach(a => env = a)

  // Read env variables 
  const envVariableFileName = path.join(__dirname, `.env.${env}`)
  const data = ''
  try {
    data = fs.readFileSync(envVariableFileName, { encoding: 'utf8' }).replace(/\r\n/g, ',').replace(/\r/g, ',').replace(/\n/g, ',')
  } catch (e) {
    console.log('Environment variable file not found: ' + envVariableFileName)
  }
  const variables = {}
  data.split(',').filter(a => !!a.trim() && !a.startsWith('#')).map(item => { return item.split('=') }).forEach(item => { variables[item[0]] = item[1] })
  return { env, variables }
}
