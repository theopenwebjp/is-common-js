const IsCommonJS = require('../index.js')
const fs = require('fs-extra')
const { expect } = require('chai')

const fsOptions = {
    encoding: 'utf-8'
}

describe('isCommonJS for commonJS file', function() {
    it('Should return true', async function(){
        const file = await fs.readFile(`${__dirname}/files/common.js`, fsOptions)
        const boolean = IsCommonJS.isCommonJS(file)
        expect(boolean).to.equal(true)
    })
})

describe('isCommonJS for es6 imports file', function() {
    it('Should return false', async function(){
        const file = await fs.readFile(`${__dirname}/files/es6.js`, fsOptions)
        const boolean = IsCommonJS.isCommonJS(file)
        expect(boolean).to.equal(false)
    })
})
