import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { Link } from 'react-router';

const NavBar = (props) => {
    return (
        <nav>
            <div className="nav-wrapper navColor">
            {/*<a href="#" className="brand-logo right">Logo</a>*/}
            <ul id="nav-mobile" className="left hide-on-med-and-down">
                <li>
                    <Link to="/">Home</Link>
                </li>
                {props.hasSignedUp &&
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                }
            </ul>
          </div>
      </nav>
    );
};

const mapStateToProps = state => {
  return {
    hasSignedUp: state.user.hasSignedUp
  }
};

export default drizzleConnect(NavBar, mapStateToProps);