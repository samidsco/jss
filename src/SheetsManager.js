/* @flow */
import warn from 'warning'
import type StyleSheet from './StyleSheet'

// 1. Use SheetsManager instance per createHoc
// 1. Use theme as a key
// 1. Handle dynamic styles
// 1. Remove support for StyleSheet instance from injectSheet
// 1. Use empty object as default for theme when used without styles creator

export default class SheetsManager {
  sheets: Array<StyleSheet> = []

  refs: Array<number> = []

  keys: Array<Object> = []

  get(key: Object): StyleSheet {
    const index = this.keys.indexOf(key)
    return this.sheets[index]
  }

  add(key: Object, sheet: StyleSheet): number {
    const {sheets, refs, keys} = this
    const index = sheets.indexOf(sheet)

    if (index !== -1) return index

    sheets.push(sheet)
    refs.push(0)
    keys.push(key)

    return sheets.length - 1
  }

  manage(key: Object): StyleSheet {
    const index = this.keys.indexOf(key)
    const sheet = this.sheets[index]
    if (this.refs[index] === 0) sheet.attach()
    this.refs[index]++
    if (!this.keys[index]) this.keys.splice(index, 0, key)
    return sheet
  }

  unmanage(key: Object): void {
    const index = this.keys.indexOf(key)
    if (index === -1) {
      // eslint-ignore-next-line no-console
      warn('SheetsManager: can\'t find sheet to unmanage')
      return
    }
    if (this.refs[index] > 0) {
      this.refs[index]--
      if (this.refs[index] === 0) this.sheets[index].detach()
    }
  }
}