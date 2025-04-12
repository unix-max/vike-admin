import { ReactNode } from 'react'
import styles from './styles.module.css'

export const Flex: React.FC<{ children: ReactNode}> = ({children} ) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}