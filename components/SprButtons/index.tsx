import React, { ReactComponentElement, useState } from 'react'

import styles from './index.module.css'

interface ISprButtton {
  onNewFolder?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onNewElm?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onOpen?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onCopy?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  //
}

export function SprButtons (props: ISprButtton ) {
 
  return (
    <div>
        <button className="newFolder"
          onClick={props.onNewFolder}
          disabled={props.onNewFolder ? false: true}
        > NF </button>
        
        <button className="newElm"
        onClick={props.onNewElm}
        disabled={props.onNewElm ? false: true}
        > NE </button>

        <button className="Edit"
          onClick={props.onEdit}
          disabled={props.onEdit ? false: true}
        > Edit </button>

        <button className="Open"
          onClick={props.onOpen}
          disabled={props.onOpen ? false: true}
        > Open </button>

        <button className="Copy"
          onClick={props.onCopy}
          disabled={props.onCopy ? false: true}
        > Copy </button>

        <button className="Del"
          onClick={props.onDelete}
          disabled={props.onDelete ? false: true}
        > Del </button>
    
    </div>

  )
}


