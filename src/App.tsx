import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import "bootstrap"

enum ColorType {
  hex,
  // hexA,
  rgb,
  rgba,
}

function App() {

  const hexRegEx = /^#[0-9A-F]{8}|^#[0-9A-F]{6}|^#[0-9A-F]{3,4}/
  const rgbRegEx = /^rgb\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1}\)/
  const rgbaRegEx = /^rgba\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(0\.[0-9]{1,2}|1\.[0]{1,2}|[0-1]{1}){1}\)/

  const [hex, setHex] = useState<string>('');
  // const [hexA, setHexA] = useState<string>('');
  const [rgb, setRgb] = useState<string>('');
  const [rgba, setRgba] = useState<string>('');

  const [bgColor, setBGColor] = useState<string>('#FFFFFF')

  useEffect(() => {

    console.log(`VALUE - ${hex}`)

    if (isValidHex()) { // Hex valid

      console.log("convert : "+convert(hex, ColorType.hex, ColorType.hex))
      setBGColor(convert(hex, ColorType.hex, ColorType.hex))
      setRgb(convert(hex, ColorType.hex, ColorType.rgb))
      setRgba(convert(hex, ColorType.hex, ColorType.rgba))
    }
    
  }, [hex])

  useEffect(() => {
    // console.log('useEffect_RGB')

    if (false) { // rgb valid
      setHex(convert(rgb, ColorType.rgb, ColorType.hex))
      setRgba(convert(rgb, ColorType.rgb, ColorType.rgba))
    }

  }, [rgb])

  useEffect(() => {

    // console.log('useEffect_RGBA')
    
    if (false) { // rgba valid
      setHex(convert(rgba, ColorType.rgba, ColorType.hex))
      setRgb(convert(rgba, ColorType.rgba, ColorType.rgb))
    }

  }, [rgba])

  const isValidHex: () => boolean = () => {
    let colorHex = hex

    return hexRegEx.test(colorHex)

    if (colorHex.charAt(0) != '#') return false

    colorHex = colorHex.replace('#','')

    const colorHexLength = colorHex.length
    if (colorHexLength != 3 &&
      colorHexLength != 4 &&
      colorHexLength != 6 &&
      colorHexLength != 8) {
        return false    
    }

    for (let index = 0; index < colorHexLength; index++) {
      const element = colorHex[index];
      const elementDecimal = parseInt(parseInt(element).toString(10))
      if (elementDecimal < 0 && elementDecimal > 16) {
        return false
      }
    }

    return true
  }

  function convertValueLimit(oldValue: number,
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number): number {

    return parseInt( `${(((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin}` )
  }

  function convert(color: string, from: ColorType, to: ColorType): string {
    if (color.length == 0) return ''

    let RR: number = 0xFF
    let GG: number = 0xFF
    let BB: number = 0xFF
    let AA: number = 0xFF

    switch (from) {

      case ColorType.hex:
        let value = color.replace('#', '')

        if (value.length == 3) { // #FFF
          RR = parseInt(`${value.charAt(0)}${value.charAt(0)}`, 16)
          GG = parseInt(`${value.charAt(1)}${value.charAt(1)}`, 16)
          BB = parseInt(`${value.charAt(2)}${value.charAt(2)}`, 16)
          AA = parseInt(`FF`, 16)
        } else if (value.length == 4) { // #FFFF
          RR = parseInt(`${value.charAt(0)}${value.charAt(0)}`, 16)
          GG = parseInt(`${value.charAt(1)}${value.charAt(1)}`, 16)
          BB = parseInt(`${value.charAt(2)}${value.charAt(2)}`, 16)
          AA = parseInt(`${value.charAt(3)}${value.charAt(3)}`, 16)
        } else if (value.length == 6) { // FFFFFF
          RR = parseInt(value.slice(0,2), 16)
          GG = parseInt(value.slice(2,4), 16)
          BB = parseInt(value.slice(4,6), 16)
          AA = parseInt(`FF`, 16)
        } else /*if (value.length == 8)*/ { // #FFFFFFFF
          RR = parseInt(value.slice(0,2), 16)
          GG = parseInt(value.slice(2,4), 16)
          BB = parseInt(value.slice(4,6), 16)
          AA = parseInt(value.slice(6,8), 16)
        }
        break;
      case ColorType.rgb: {
        const colorsDecimal = color.replace('rgb', '').replace('(', '').replace(')', '').replace(' ', '').split(',')
        RR = parseInt(colorsDecimal[0])
        GG = parseInt(colorsDecimal[1])
        BB = parseInt(colorsDecimal[2])
        AA = 0xFF
        break;
      }
      case ColorType.rgba: {
        const colorsDecimal = color.replace('rgba', '').replace('(', '').replace(')', '').replace(' ', '').split(',')
        const alphaValue = convertValueLimit(parseInt(colorsDecimal[3]), 0,1,0,255)
        console.log(`alphaValue : ${alphaValue}`)
        RR = parseInt(colorsDecimal[0])
        GG = parseInt(colorsDecimal[1])
        BB = parseInt(colorsDecimal[2])
        AA = alphaValue
        break;
      }
    }

    console.log(`RR : ${RR} GG : ${GG} BB : ${BB} AA : ${AA}`)

    switch (to) {
      case ColorType.hex:
        let strRR = RR.toString(16)
        if (strRR.length == 1) {
          strRR = `0${strRR}`
        }

        let strGG = GG.toString(16)
        if (strGG.length == 1) {
          strGG = `0${strGG}`
        }

        let strBB = BB.toString(16)
        if (strBB.length == 1) {
          strBB = `0${strBB}`
        }

        let strAA = AA.toString(16)
        if (strAA.length == 1) {
          strAA = `0${strAA}`
        }

        return (`#${strRR}${strGG}${strBB}${strAA}`)
      case ColorType.rgb: {
        return `rgb(${RR}, ${GG}, ${BB})`
      }
      case ColorType.rgba: {
        const alpha = convertValueLimit(AA, 0, 255, 0, 1)
        
        return `rgba(${RR}, ${GG}, ${BB}, ${alpha})`
      }
    }
    return ''
  }

  return <div className='main' style={{ backgroundColor: bgColor }}>
    <input style={{}} placeholder='#FFFFFF' value={hex} onChange={e => {
      setHex(e.target.value)
    }}></input>
    <input style={{}} placeholder='rgb(255, 255, 255)' value={rgb} onChange={e => {
      setRgb(e.target.value)
    }}></input>
    <input style={{}} placeholder='rgba(255, 255, 255, 1)' value={rgba} onChange={e => {
      setRgba(e.target.value)
    }}></input>
  </div>
}

export default App;
