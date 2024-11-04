// https://vike.dev/Head

import React from "react";
import { StyleRegistry,  createStyleRegistry } from 'styled-jsx'
import logoUrl from "../assets/logo.svg";

function Styles() {
  const registry = createStyleRegistry()
  //const styles = registry.styles()
  console.log(registry)
  return <> <link rel="icon" href={logoUrl} /></>
}

export default function HeadDefault() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
     {/* <Styles /> */}
    </>
  );
}
