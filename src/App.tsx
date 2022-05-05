import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import "bootstrap"

enum ColorType {
  hex,
  // hexA,
  rgb,
  rgba,
  uicolor,
}

function App() {

  const hexRegEx = /^#[0-9A-F]{8}|^#[0-9A-F]{6}|^#[0-9A-F]{3,4}/
  const rgbRegEx = /^rgb\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1}\)/
  const rgbaRegEx = /^rgba\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]){1},(0\.[0-9]{1,2}|1\.[0]{1,2}|[0-1]{1}){1}\)/
  const uicolorRegEx = ''

  const [hex, setHex] = useState<string>('');
  // const [hexA, setHexA] = useState<string>('');
  const [rgb, setRgb] = useState<string>('');
  const [rgba, setRgba] = useState<string>('');
  const [uicolor, setUIColor] = useState<string>('');

  const [bgColor, setBGColor] = useState<string>('#FFFFFF')

  function convertValueLimit(oldValue: number,
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number): number {

    let oV = parseFloat(`${oldValue}`)
    let oMin = parseFloat(`${oldMin}`)
    let oMax = parseFloat(`${oldMax}`)
    let nMin = parseFloat(`${newMin}`)
    let nMax = parseFloat(`${newMax}`)


    return parseFloat(parseFloat(`${(((oV - oMin) * (nMax - nMin)) / (oMax - oMin)) + nMin}`).toFixed(3))
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
          RR = parseInt(value.slice(0, 2), 16)
          GG = parseInt(value.slice(2, 4), 16)
          BB = parseInt(value.slice(4, 6), 16)
          AA = parseInt(`FF`, 16)
        } else /*if (value.length == 8)*/ { // #FFFFFFFF
          RR = parseInt(value.slice(0, 2), 16)
          GG = parseInt(value.slice(2, 4), 16)
          BB = parseInt(value.slice(4, 6), 16)
          AA = parseInt(value.slice(6, 8), 16)
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
        const alphaValue = convertValueLimit(parseFloat(colorsDecimal[3]), 0, 1, 0, 255)
        RR = parseInt(colorsDecimal[0])
        GG = parseInt(colorsDecimal[1])
        BB = parseInt(colorsDecimal[2])
        AA = alphaValue
        break;
      }
      case ColorType.uicolor: {
        const colorsDecimal = color.replace('UIColor', '')
          .replace('red', '')
          .replace('green', '')
          .replace('blue', '')
          .replace('alpha', '')
          .replace(':', '')
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .split(',')
          
        RR = convertValueLimit(parseFloat(colorsDecimal[0]), 0, 1, 0, 255)
        GG = convertValueLimit(parseFloat(colorsDecimal[1]), 0, 1, 0, 255)
        BB = convertValueLimit(parseFloat(colorsDecimal[2]), 0, 1, 0, 255)
        AA = convertValueLimit(parseFloat(colorsDecimal[3]), 0, 1, 0, 255)
        break;
      }

    }

    // console.log(`RR : ${RR} GG : ${GG} BB : ${BB} AA : ${AA}`)

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

        let strAA = parseInt(`${AA}`).toString(16)
        if (strAA.length == 1) {
          strAA = `0${strAA}`
        }
        return (`#${strRR}${strGG}${strBB}${strAA}`).toUpperCase()
      case ColorType.rgb: {
        return `rgb(${RR},${GG},${BB})`
      }
      case ColorType.rgba: {
        const alpha = convertValueLimit(AA, 0, 255, 0, 1)
        return `rgba(${RR},${GG},${BB},${alpha})`
      }
      case ColorType.uicolor: {
        const alpha = convertValueLimit(AA, 0, 255, 0, 1)
        const red = convertValueLimit(RR, 0, 255, 0, 1)
        const green = convertValueLimit(GG, 0, 255, 0, 1)
        const blue = convertValueLimit(BB, 0, 255, 0, 1)
        return `UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha})`
      }
    }
    return ''
  }

  function copyHEX() {
    navigator.clipboard.writeText(hex)
  }
  function copyRGB() {
    navigator.clipboard.writeText(rgb)
  }
  function copyRGBA() {
    navigator.clipboard.writeText(rgba)
  }

  return <div className='main' style={{ backgroundColor: bgColor }}>
    <div>
      <input type='text' style={{}} placeholder='#FFFFFF' value={hex} onChange={e => {
        const value = e.target.value
        setHex(value)
        if (hexRegEx.test(value)) { // Hex valid
          setBGColor(value)
          setRgb(convert(value, ColorType.hex, ColorType.rgb))
          setRgba(convert(value, ColorType.hex, ColorType.rgba))
          setUIColor(convert(value, ColorType.hex, ColorType.uicolor))
        }
      }}></input>
      <button type="button" className="btn btn-outline-secondary" onClick={copyHEX}>copy</button>
    </div>
    <div>
      <input style={{}} placeholder='rgb(255, 255, 255)' value={rgb} onChange={e => {
        const value = e.target.value
        setRgb(value)
        if (rgbRegEx.test(value)) { // rgb valid
          setBGColor(value)
          setHex(convert(value, ColorType.rgb, ColorType.hex))
          setRgba(convert(value, ColorType.rgb, ColorType.rgba))
          setUIColor(convert(value, ColorType.rgb, ColorType.uicolor))
        }
      }}></input>
      <button type="button" className="btn btn-outline-secondary" onClick={copyRGB}>copy</button>
    </div>
    <div>
      <input style={{}} placeholder='rgba(255, 255, 255, 1)' value={rgba} onChange={e => {
        const value = e.target.value
        setRgba(value)
        if (rgbaRegEx.test(value)) { // rgba valid
          setBGColor(value)
          setHex(convert(value, ColorType.rgba, ColorType.hex))
          setRgb(convert(value, ColorType.rgba, ColorType.rgb))
          setUIColor(convert(value, ColorType.rgba, ColorType.uicolor))
        }
      }}></input>
      <button type="button" className="btn btn-outline-secondary" onClick={copyRGBA}>copy</button>
    </div>

    <div>
      <input style={{}} placeholder='UIColor(red: 1, green: 1, blue: 1,alpha: 1)' value={uicolor} onChange={e => {
        // const value = e.target.value
        // setRgba(value)
        // if (rgbaRegEx.test(value)) { // rgba valid
        //   setBGColor(value)
        //   setHex(convert(value, ColorType.rgba, ColorType.hex))
        //   setRgb(convert(value, ColorType.rgba, ColorType.rgb))
        // }
      }}></input>
      <button type="button" className="btn btn-outline-secondary" onClick={copyRGBA}>copy</button>
    </div>
  </div>
}

export default App;
