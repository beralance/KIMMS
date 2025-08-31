import TextField from "@mui/material/TextField";

export function TextFieldBasic ({id, label, variant, ...props}) {
    // variant = outlined, filled, standard
    return <TextField id={id} label={label} variant={variant}></TextField>
}
