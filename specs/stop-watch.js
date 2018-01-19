// stop-watch.js
// potential performance library for node

// really dumb helper method to show number (with left padding) over number
const counterDisplay = (run, total) => (total).toString().split('')
  .map((_, index) => run.toString()[run.toString().length - 1 - index])
  .map((digit) => digit === undefined ? ' ' : digit)
  .reverse().join('') + `/${total}`

const joinProcessTime = (time) => (time[0] * 1e9) + time[1]

const setupLog = (name) => {
  process.stdout.write(`[SETUP   ] ${name}`)
  process.stdout.cursorTo(0)
}

const runningLog = (name, run, times) => {
  process.stdout.write(`[RUNNING ] ${name} ${counterDisplay(run, times)}`)
  process.stdout.cursorTo(0)
}

const finishLog = (name, times, percentileRun) => {
  process.stdout.write(`[FINISHED] ${name} ${counterDisplay(times, times)} \t ${percentileRun}ns`)
  process.stdout.cursorTo(0)
}

// test function that runs a function several times
module.exports = (name, test, times, percentile, presetup, setup, teardown) => {
  setupLog(name)
  presetup && presetup()
  const runTimes = Array(times).fill().map((_, index) => index)
    .map((run) => {
      setup && setup()
      const start = process.hrtime()
      test()
      const end = process.hrtime(start)
      runningLog(name, run, times)
      teardown && teardown()
      return end
    })

  const logPercentile = percentile || 90
  const percentileRun = joinProcessTime(runTimes.sort()[Math.floor((logPercentile / 100) * times)])
  finishLog(name, times, percentileRun)
  console.log('')

  if (percentile) {
    return joinProcessTime(runTimes.sort()[Math.floor((percentile / 100) * times)])
  }
  return runTimes.map((timeArray) => joinProcessTime(timeArray))
}
