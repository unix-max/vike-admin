import React from "react";
import { Counter } from "./Counter.js";
import styles from './styles.module.css'

export default function Page() {
  return (
    <>
      <h1 className={styles.win} >My Vike app</h1>
      <p>This is new paragraph</p>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <style jsx>{`
      p {
        color: green;
      }
    `}</style>
    </>
  );
}
