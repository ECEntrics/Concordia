import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { Link } from 'react-router';

const NavBar = (props) => {
    return (
        <div className="pure-u-1-1 navbar">
            <ul>
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
    );
};

const mapStateToProps = state => {
  return {
    hasSignedUp: state.user.hasSignedUp
  }
};

export default drizzleConnect(NavBar, mapStateToProps);