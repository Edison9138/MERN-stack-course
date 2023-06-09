import { Outlet, Link } from "react-router-dom"
import Wrapper from "../../assets/wrappers/SharedLayout"
import { Navbar, BigSidebar, SmallSidebar } from "../../components"

const SharedLayout = () => {
    return (
      // two-column layout
      <Wrapper>
        <main className="dashboard">
          {/* First column */}
          {/* the code of rendering SmallSidebar or BigSidebar is in CSS */}
          <SmallSidebar />
          <BigSidebar />
          {/* Second column */}
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    )
  }

export default SharedLayout