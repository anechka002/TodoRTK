import TextField from "@mui/material/TextField"
import { ChangeEvent, useState } from "react"
import s from './EditableSpan.module.css'

type Props = {
  value: string
  onChange: (title: string) => void
  disabled: boolean
}

export const EditableSpan = ({ value, onChange, disabled }: Props) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(value)

  const onDoubleClickHandler = () => {
    if(disabled) {
      return
    }
    setEditMode(true)
  }

  const onBlurHandler = () => {
    setEditMode(false)
    onChange(title)
  }

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return (
    <>
      {editMode ? (
        <TextField
          variant={"standard"}
          value={title}
          size={"small"}
          onChange={changeTitle}
          onBlur={onBlurHandler}
          autoFocus
          color={"secondary"}
        />
      ) : (
        <span className={disabled ? s.disabled : '' } onDoubleClick={ onDoubleClickHandler }>{value}</span>
      )}
    </>
  )
}
