import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class Login extends React.Component{
    render(){
        return(
            <div className='body loginBody'>
                <div className='loginDiv'>
                    <h2>PRIJAVA</h2>
                    <input type="email" placeholder='Email adresa' />
                    <input type="password" placeholder='Lozinka' />
                    <button className='customBtn'>Prijavite se</button>
                </div>
            </div>
        );
    }
}

export default Login;