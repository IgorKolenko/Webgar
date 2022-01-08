import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: ""
        }
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.sendLogin = this.sendLogin.bind(this);
    }

    onEmailChange(t){
        this.setState({
            email: t.target.value
        })
    }

    onPasswordChange(t){
        this.setState({
            password: t.target.value
        })
    }

    sendLogin(){
        fetch('/auth/login', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        window.location.reload(true);
    }

    render(){
        return(
            <div className='body loginBody'>
                <div className='loginDiv'>
                    <h2>PRIJAVA</h2>
                    <input type="email" onChange={this.onEmailChange} placeholder='Email adresa' required/>
                    <input type="password" onChange={this.onPasswordChange} placeholder='Lozinka' required/>
                    <button className='customBtn' onClick={this.sendLogin}>Prijavite se</button>
                    <a href="/register" className='customLink'>Registracija</a>
                </div>
            </div>
        );
    }
}

export default Login;