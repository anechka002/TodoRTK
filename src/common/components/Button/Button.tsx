import { ComponentProps } from "react"

type Props = ComponentProps<"button">

export const Button = ({ children, onClick, disabled, ...rest }: Props) => {
  return (
    <button onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
