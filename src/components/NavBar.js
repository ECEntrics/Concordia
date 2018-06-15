import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { Link } from 'react-router';

class NavBar extends Component {
    constructor(props){
        super(props);

        this.handleScroll = this.handleScroll.bind(this);

        this.navRef = React.createRef();
    }

    render() {
        return (
            <nav ref={this.navRef}>
                <div className="nav-wrapper navColor">
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {this.props.hasSignedUp &&
                        <li>
                          <Link to="/profile">Profile</Link>
                        </li>
                    }
                </ul>
              </div>
          </nav>
        );
    }

    componentDidMount(){
        this.headerHeight = this.navRef.current.offsetTop;
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(){
        if (window.pageYOffset >= this.headerHeight) {
            this.navRef.current.classList.add("stick")
        } else {
            this.navRef.current.classList.remove("stick");
        }
    }
};

const mapStateToProps = state => {
  return {
    hasSignedUp: state.user.hasSignedUp
  }
};

export default drizzleConnect(NavBar, mapStateToProps);