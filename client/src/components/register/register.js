import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            ime: "",
            prezime: "",
            confirmPass: "",
            errorMsg: ""
        }
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onImeChange = this.onImeChange.bind(this);
        this.onPrezimeChange = this.onPrezimeChange.bind(this);
        this.onConfirmPassChange = this.onConfirmPassChange.bind(this);
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

    onConfirmPassChange(t){
        this.setState({
            confirmPass: t.target.value
        })
    }

    onImeChange(t){
        this.setState({
            ime: t.target.value
        })
    }

    onPrezimeChange(t){
        this.setState({
            prezime: t.target.value
        })
    }

    sendLogin(){
        if(this.state.password == this.state.confirmPass){
            fetch('/auth/login', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })
            window.location.reload(true);
        }else{
            this.setState({
                errorMsg: "Lozinke nisu iste"
            })
        }
    }

    render(){
        return(
            <div className='body loginBody'>
                <div className='loginDiv'>
                    <h2>REGISTRACIJA</h2>
                    <p className='errorMsg'>{this.state.errorMsg}</p>
                    <input type="text" onChange={this.onEmailChange} placeholder='Ime' required/>
                    <input type="text" onChange={this.onEmailChange} placeholder='Prezime' required/>
                    <input type="email" onChange={this.onEmailChange} placeholder='Email adresa' required/>
                    <input type="password" onChange={this.onPasswordChange} placeholder='Lozinka' required/>
                    <input type="password" onChange={this.onPasswordChange} placeholder='Potvrda Lozinke' required/>
                    <button className='customBtn' onClick={this.sendLogin}>Registrirajte se</button>
                </div>
            </div>
        );
    }
}

export default Register;