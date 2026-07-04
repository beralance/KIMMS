import TextField from "@mui/material/TextField";

export function TextFieldBasic ({id, label, variant, ...props}) {
    return <TextField id={id} label={label} variant={variant}></TextField>
}
