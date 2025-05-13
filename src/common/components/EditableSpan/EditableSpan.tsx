import TextField from "@mui/material/TextField"
import { ChangeEvent, useState } from "react"

type Props = {
  value: string
  onChange: (title: string) => void
}

export const EditableSpan = ({ value, onChange }: Props) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(value)

  const onDoubleClickHandler = () => {
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
        <span onDoubleClick={ onDoubleClickHandler }>{value}</span>
      )}
    </>
  )
}
