'use strict'

const path = require('path')
const fs = require('fs')
const coveralls = require('@sourceallies/coveralls-merge')

fs.readdir(path.join(__dirname, 'packages'), (err, files) => {
  if (err) {
    throw err
  }

  const reports = files
    .filter(dir => dir.startsWith('it-'))
    .map(dir => {
      return {
        type: 'lcov',
        reportFile: path.join('packages', dir, 'coverage', 'lcov.info'),
        workingDirectory: path.join('packages', dir)
      }
    })

  coveralls.sendReports(reports)
})
