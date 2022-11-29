import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <ul className="header-container">
        <Link to="/" className="page-link">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-logo"
            />
          </li>
        </Link>

        <div className="pages">
          <Link to="/" className="page-links">
            <li>
              <p className="page-name">Home</p>
            </li>
          </Link>
          <Link to="/jobs" className="page-links">
            <li>
              <p className="page-name">Jobs</p>
            </li>
          </Link>
        </div>
        <button type="button" className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </ul>
    </>
  )
}

export default withRouter(Header)
