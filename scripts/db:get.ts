import {execSync} from 'child_process'
import * as fs from 'fs'

const tempDir = '../temp/'
const influxGit = 'https://github.com/influxdb/influxdb.git'

// TODO: remove whne UI is removed from https://github.com/influxdb/influxdb.git master
// ui build crashes when influx nested in ui.
const fakeBuildUi = () => {
  const changeFile = (file: string, fnc: (current: string) => string) => {
    const fileStr = fs.readFileSync(file).toString()
    const fileStrNew = fnc(fileStr)
    fs.writeFileSync(file, fileStrNew)
  }

  const makefile = '../temp/influxdb/Makefile'

  changeFile(makefile, x =>
    x
      .split('\n')
      .map(x => (x.startsWith('SUBDIRS') ? x.replace(/ ui /, ' ') : x))
      .join('\n')
  )

  fs.symlinkSync('../../../build', '../temp/influxdb/ui/build')
}

if (fs.existsSync(tempDir)) {
  ;(fs.rmdirSync as any)(tempDir, {recursive: true})
}

fs.mkdirSync(tempDir)

process.stdout.write(`Cloning influxdb from ${influxGit}`)
execSync(`git clone ${influxGit} --depth 1`, {cwd: tempDir, stdio: 'ignore'})

fakeBuildUi()

process.stdout.write(`building influxdb`)
execSync(`make`, {cwd: '../temp/influxdb', stdio: 'inherit'})
