function PasswordInput({ value, onChange }) {
    return (
      <input
        type="password"
        placeholder="Enter password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  
  export default PasswordInput