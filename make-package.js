const rootPackage = require('./package.json')
const dndPackage = require('./dnd/package.json')
const { writeFileSync } = require('fs')

delete rootPackage.scripts
delete rootPackage.workspaces

rootPackage.dependencies = dndPackage.dependencies
rootPackage.main = dndPackage.main.replace('dist/', '')
rootPackage.module = dndPackage.module.replace('dist/', '')
rootPackage.types = dndPackage.types.replace('dist/', '')

writeFileSync('./dnd/dist/package.json', JSON.stringify(rootPackage, null, 2))
