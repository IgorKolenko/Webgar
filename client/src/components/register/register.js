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
            jmbag: "",
            errorMsg: ""
        }
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onImeChange = this.onImeChange.bind(this);
        this.onPrezimeChange = this.onPrezimeChange.bind(this);
        this.onConfirmPassChange = this.onConfirmPassChange.bind(this);
        this.onJmbagChange = this.onJmbagChange.bind(this);
        this.sendRegister = this.sendRegister.bind(this);
    }

    componentDidMount(){
        fetch('/auth/register-msg', {
            method: "GET",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json()).then(res => {
            this.setState({
                errorMsg: res.msg
            });
        });
    }

    onJmbagChange(t){
        this.setState({
            jmbag: t.target.value
        })
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

    sendRegister(){
        if(this.state.jmbag.length == 10){
            if(this.state.password == this.state.confirmPass){
                fetch('/auth/register', {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                        firstName: this.state.ime,
                        lastName: this.state.prezime,
                        jmbag: this.state.jmbag
                    })
                })
                window.location.reload(true);
            }else{
                this.setState({
                    errorMsg: "Lozinke nisu iste"
                });
            }
        }else{
            this.setState({
                errorMsg: "JMBAG mora biti duljine 10"
            });
        }
    }

    render(){
        return(
            <div className='body loginBody'>
                <div className='loginDiv'>
                    <h2>REGISTRACIJA</h2>
                    <p className='errorMsg'>{this.state.errorMsg}</p>
                    <input type="text" onChange={this.onImeChange} placeholder='Ime' required/>
                    <input type="text" onChange={this.onPrezimeChange} placeholder='Prezime' required/>
                    <input type="email" onChange={this.onEmailChange} placeholder='Email adresa' required/>
                    <input type="number" onChange={this.onJmbagChange} min="10" max="10" placeholder='JMBAG' required/>
                    <input type="password" onChange={this.onPasswordChange} placeholder='Lozinka' required/>
                    <input type="password" onChange={this.onConfirmPassChange} placeholder='Potvrda Lozinke' required/>
                    <button className='customBtn' onClick={this.sendRegister}>Registrirajte se</button>
                </div>
            </div>
        );
    }
}

export default Register;