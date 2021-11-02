import React from 'react';
import '../mainElements.css';
import '../formElements.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faPen} from '@fortawesome/free-solid-svg-icons';

class NoviJsZad extends React.Component{
    render(){
        return(        
        <div className="body">
            <h1 className="pageTitle">Novi javascript zadatak</h1>
            <br />
            <form>
                <div className="formElement">
                    <h2>Ime zadatka</h2>
                    <input type="text" className="customTextbox" name="ime" />
                </div>
                <div className="formElement">
                    <h2>Opis zadatka</h2>
                    <textarea className="customTextarea" name="opis" />
                </div>
                <div className="formElement">
                    <h2>Testni slučajevi</h2>
                    <table>
                        <tr className="titleTr">
                            <th>Ime testnog slučaja</th>
                            <th>Ime funckije</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Testcase1</th>
                            <th>add.js</th>
                            <th className="buttonField">
                                <button className="delBtn"><FontAwesomeIcon className="icon" icon={faTrash} /></button>
                                <button className="editBtn"><FontAwesomeIcon className="icon" icon={faPen} /></button>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="formBtnContainer">
                    <button className="customBtn">Novi testni slučaj</button>
                    <button className="customBtn">Objava</button>
                </div>
            </form>
        </div>);
    }
}

export default NoviJsZad;