import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ toggleSidebar }) => {
  return (
    <div className = "nav-links">
    {links.map((link) => {
      const { text, path, id, icon } = link

      return (
        <NavLink
          to={path}
          key = {id}
          onClick={toggleSidebar}
          // isActive is built in. It sees if a link is active or not
          className = {({isActive}) => isActive ? "nav-link active":"nav-link"}
          end
        >
          <span className='icon'>{icon}</span>
          {text}
        </NavLink>
      )
    })}
  </div>
  )
}
export default NavLinks