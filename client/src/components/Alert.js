import { useAppContext } from "../context/appContext"

const Alert = () => {
  const { alertType, alertText } = useAppContext()
  return (
    // alert-${alertType} controls the alert's color
    <div className={`alert alert-${alertType}`}>
      {alertText}
    </div>
  )
}
export default Alert