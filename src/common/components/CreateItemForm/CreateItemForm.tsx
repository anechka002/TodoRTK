import TextField from "@mui/material/TextField"
import { KeyboardEvent, ChangeEvent, useState } from "react"
import AddBoxIcon from "@mui/icons-material/AddBox"
import IconButton from "@mui/material/IconButton"

type Props = {
  onCreateItem: (title: string) => void
  disabled?: boolean
}

export const CreateItemForm = ({ onCreateItem, disabled }: Props) => {
  const [newTitle, setNewTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const addTaskHandler = () => {
    const trimmedTitle = newTitle.trim()
    if (trimmedTitle !== "") {
      onCreateItem(trimmedTitle)
    } else {
      setError("Title is required")
    }
    setNewTitle("")
  }

  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.currentTarget.value
    setNewTitle(title)
    setError(null)
  }

  const onEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addTaskHandler()
    }
  }

  return (
    <div>
      <TextField
        label="Enter a title"
        variant="outlined"
        value={newTitle}
        error={!!error}
        helperText={error}
        size={"small"}
        onChange={onChangeTitleHandler}
        onKeyDown={onEnterHandler}
        color="secondary"
        disabled={disabled}
      />
      <IconButton disabled={disabled} onClick={addTaskHandler} color="secondary">
        <AddBoxIcon />
      </IconButton>
    </div>
  )
}
