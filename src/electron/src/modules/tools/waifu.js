// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isNil, isString } from 'lodash'
import { spawn } from 'child_process'
import EventBus from 'js-event-bus'
import semverRegex from 'semver-regex'
import * as fs from 'fs-extra'
import { getWaifuPath } from './paths'
import { settings } from '../settings'

const logger = require('@dreamnet/logplease').create('waifu')

let version

export function exec(args, options = {}) {
  options = {
    cwd: getWaifuPath(),
    ...options,
  }

  if (settings.processing.usePython) {
    // Python Script
    args.unshift('waifu2x.py')

    logger.debug('[Python] Running:', {
      args,
      options,
    })

    // FIXME: Anaconda Support.
    // return spawn('C:\\Users\\koles\\Anaconda3\\envs\\waifu\\python', args, options)

    return spawn('python', args, options)
  }

  logger.debug('Running:', args)

  return spawn(getWaifuPath('waifu2x'), args, options)
}

/**
 *
 * @param {Array} args
 * @param {EventBus} events
 */
export async function run(args, events) {
  const process = exec(args)
  let cancelled = false

  process.on('error', (error) => {
    logger.error(error)
    events.emit('error', null, error)
  })

  process.stdout.on('data', (output) => {
    logger.info(output.toString())
    const stdout = output.toString().trim().split('\n')
    events.emit('stdout', null, stdout)
  })

  process.stderr.on('data', (output) => {
    logger.warn(output.toString())
    events.emit('stderr', null, output)
  })

  process.on('close', (code) => {
    logger.info(`Waifu2X exited with code ${code}`)
    events.emit('close', null, code)

    if (cancelled) {
      events.emit('cancelled')
    } else if (code === 0 || isNil(code)) {
      events.emit('success')
    } else {
      events.emit('fail', null, false)
    }
  })

  events.on('cancel', () => {
    cancelled = true
    process.stdin.pause()
    process.kill()
  })
}

/**
 *
 * @param {PhotoRun} run
 */
export const transform = (photoPreferences, input, output) => {
  if (!output) {
    output = input
  }

  const { waifu: preferences } = photoPreferences.advanced

  // CLI Args
  const args = ['--input', input, '--output', output]

  // Upscale ratio.
  args.push('--scale_ratio', preferences.scale)

  // TTA
  if (preferences.tta > 0) {
    args.push('--tta', '--tta_level', preferences.tta)
  }

  // Arch
  args.push('--arch', preferences.arch)

  // Denoise level.
  args.push('--noise_level', preferences.denoise)

  // Method
  if (preferences.denoise > 0) {
    args.push('--method', 'noise_scale')
  } else {
    args.push('--method', 'scale')
  }

  // GPU
  if (settings.processing.device === 'GPU') {
    for (const id of settings.processing.gpus) {
      args.push('--gpu', id)
    }
  }

  const events = new EventBus()

  run(args, events)

  return events
}

/**
 * @return {boolean}
 */
export function isInstalled() {
  const dirpath = getWaifuPath()

  if (!isString(dirpath)) {
    return false
  }

  if (!fs.existsSync(dirpath)) {
    return false
  }

  const binaries = [
    'waifu2x.py',
    'waifu2x.exe',
    'waifu2x',
  ]

  for (const bin of binaries) {
    if (fs.existsSync(getWaifuPath(bin))) {
      return true
    }
  }

  return false
}

/**
 * @return {Promise}
 */
export const getVersion = () => new Promise((resolve, reject) => {
  if (version) {
    resolve(version)
    return
  }

  const process = exec(['--version'])

  let response = ''

  process.on('error', (error) => {
    logger.warn(error)
    reject(error)
  })

  process.stdout.on('data', (data) => {
    response += data
  })

  process.stderr.on('data', (data) => {
    response += data
  })

  process.on('close', (code) => {
    if (code === 0 || isNil(code)) {
      try {
        response = semverRegex().exec(response)
        response = `v${response[0]}`

        version = response
        resolve(response)
      } catch (err) {
        logger.warn(err)
        reject(err)
      }
    } else {
      reject(new Error(response))
    }
  })
})
