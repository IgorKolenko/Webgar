import React from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './navbar.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';

class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            menu: false,
            loggedIn: false,
            role: "",
            responded: false,
            dropdown: false
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
    }

    toggleMenu(){
        this.setState({
            menu: !this.state.menu
        });
    }

    toggleDropdown(){
        this.setState({
            dropdown: !this.state.dropdown
        })
    }

    checkLoginStatus(){
        fetch('/auth/logged-in', {
          method: "GET",
          credentials: 'include',
          headers: {'Content-Type': 'application/json'}
        }).then(res => res.json()).then(res => {
          console.log("Logged in: "+res.loggedIn);
          console.log("Role: "+res.role);
          this.setState({
            loggedIn: res.loggedIn,
            role: res.role,
            responded: true
          });
        });
    }
    
    componentDidMount(){
        this.checkLoginStatus();
    }

    render(){
        const show = (this.state.menu) ? "show" : "";
        const dropdown = (this.state.dropdown) ? "show" : "";
        if(this.state.responded){
            return(
                <nav className='navbar navbar-expand-md sticky-top'>
                    <button className='navbar-toggler ms-auto' type='button' onClick={this.toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {this.state.role == "profesor" ?
                    <div className={'collapse navbar-collapse '+show}>
                        <ul className='navbar-nav ms-auto'>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" onClick={this.toggleDropdown} href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Novi zadatak
                                </a>
                                <ul className={"dropdown-menu "+dropdown} aria-labelledby="dropdownMenuLink">
                                    <li><a className="dropdown-item" href="/noviJsZad">Javascript</a></li>
                                    <li><a className="dropdown-item" href="/noviHtmlZad">HTML</a></li>
                                    <li><a className="dropdown-item" href="/noviCssZad">CSS</a></li>
                                </ul>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='/manageStari'>Stari zadaci</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='/manageAktivni'>Aktivni zadaci</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Odjava</a>
                            </li>
                        </ul>
                    </div> : 
                    <div className={'collapse navbar-collapse '+show}>
                        <ul className='navbar-nav ms-auto'>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Odjava</a>
                            </li>
                        </ul>
                    </div>}
                </nav>
            );
        }else{
            return <div></div>
        }
    }
}

export default Navbar;