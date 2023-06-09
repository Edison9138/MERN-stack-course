const FormRow = ({type, name, value, handleChange, labelText}) => {
    // labelText will only be used if it's passed in
  return (
    <div className="form-row">
        {/* <label> tag is used to specify a label for an <input> element of a form */}
        <label htmlFor={name} className="form-label">
            {/* if labelText not passed in, use name */}
            {labelText || name}
        </label>
        <input
            type = {type}
            // value attribute is what is going to get sent back to the server
            value = {value}
            // name is how you reference the input, once the value from the input gets sent back to the server
            name = {name}
            onChange={handleChange}
            className="form-input"
        />
    </div>
  )
}

export default FormRow