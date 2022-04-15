import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import "bootstrap"

enum ColorType {
  hex,
  rgb,
  rgba,
}

function App() {

  const [hex, setHex] = useState<string>('');
  const [rgb, setRgb] = useState<string>('');
  const [rgba, setRgba] = useState<string>('');

  const [bgColor, setBGColor] = useState<string>('#FFFFFF')

  useEffect(() => {
    console.log('useEffect')
  }, [])

  useEffect(() => {
    console.log('useEffect_HEX')
    // setRgb('ASD')
    // setRgba('ASD')
  }, [hex])

  useEffect(() => {
    console.log('useEffect_RGB')
  }, [rgb])

  useEffect(() => {
    console.log('useEffect_RGBA')
  }, [rgba])

  function convert(color: string, from: ColorType, to: ColorType) {

  }

  return <div className='main' style={{ backgroundColor: bgColor }}>
    <input placeholder='#FFFFFF' value={hex} onChange={e => {
      setHex(e.target.value)
    }}></input>
    <input placeholder='rgb(255, 255, 255)' value={rgb} onChange={e => {
      setRgb(e.target.value)
    }}></input>
    <input placeholder='rgba(255, 255, 255, 1)' value={rgba} onChange={e => {
      setRgba(e.target.value)
    }}></input>
  </div>
}

export default App;
