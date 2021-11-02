import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class JsTestcase extends React.Component{
    render(){
        return(
            <div className="body">
                <h1 className="pageTitle">Novi javascript testni slučaj</h1>
                <form>
                    <h2>Testcase1</h2>
                    <div className="formElement">
                        <label for="ime">Ime funkcije:</label>
                        <input type="text" className="customTextbox" name="ime" />
                    </div>
                    <div className="formElement">
                        <label for="input">Input:</label>
                        <textarea className="customTextarea" name="input" />
                    </div>
                    <div className="formElement">
                        <label for="input">Output:</label>
                        <textarea className="customTextarea" name="output" />
                    </div>
                    <div class="formBtnContainer2">
                        <button className="customBtn">Stvori testni slučaj</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default JsTestcase;