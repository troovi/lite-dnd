const rootPackage = require('./package.json')
const dndPackage = require('./dnd/package.json')
const { writeFileSync } = require('fs')

delete rootPackage.scripts
delete rootPackage.workspaces

rootPackage.dependencies = dndPackage.dependencies

writeFileSync('./dnd/dist/package.json', JSON.stringify(rootPackage))
