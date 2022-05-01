import React, { CSSProperties } from 'react'

interface PROPS {
    regex?: string | undefined,
    placeholder?: string | undefined,
    value?: string | undefined,
    style?: CSSProperties | undefined;
}

function TextField(props: PROPS) {
    return (<input ></input>)
}

export default TextField