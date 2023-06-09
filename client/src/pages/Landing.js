import main from "../assets/images/main.svg"
// styled components are in a different folder, import them
import Wrapper from "../assets/wrappers/LandingPage"
// set up an index.js in the components folder and import like this so don't need a line for each component
import { Logo } from "../components"
import { Link } from "react-router-dom"

const Landing = () => {
  return (
    /**<main> is the container */
    <Wrapper>
      <nav>
        <Logo/>
      </nav>
      <div className = "container page">
        {/* landing page's info */}
        <div className = "info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
          </p>
          <Link to="/register" className="btn btn-hero">
              Login/Register
          </Link>
        </div>
        {/*main-img is for displaying or not the image based on screen's size */}
        <img src = {main} alt = "job hunt" className = "img main-img"></img>
      </div>
    </Wrapper>
  ) 
}


export default Landing