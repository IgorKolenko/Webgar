import React from 'react';
import '../mainElements.css';
import '../formElements.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faPen} from '@fortawesome/free-solid-svg-icons';

class NoviCssZad extends React.Component{
    //konstruktor za NoviCssZad
    constructor(props){
        super(props);
        this.state = {
            imeZadatak: "",
            opisZadatak: "",
            vrstaZadatak: 1,
            testcases: [],
            prikazStranice: "zadatak",
            brojTestcase: 0,
            imeElementa: "",
            svojstva: "",
            checkbox: false,
            imeTestcase: ""
        }
        this.imeZadatkaChange = this.imeZadatkaChange.bind(this);
        this.opisZadatkaChange = this.opisZadatkaChange.bind(this);
        this.imeElementaChange = this.imeElementaChange.bind(this);
        this.svojstvaChange = this.svojstvaChange.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this);
        this.stvoriNoviTestcase = this.stvoriNoviTestcase.bind(this);
        this.spremiTestcase = this.spremiTestcase.bind(this);
        this.izbrisiTestcase = this.izbrisiTestcase.bind(this);
        this.saljiServeru = this.saljiServeru.bind(this);
        this.azurirajTestcase = this.azurirajTestcase.bind(this);
        this.spremiPromjene = this.spremiPromjene.bind(this);
        this.imeTestcaseChange = this.imeTestcaseChange.bind(this);
    }

    imeTestcaseChange(t){
        this.setState({
            imeTestcase: t.target.value
        })
    }

    //Funckija koja ažurira ime zadatka svaki put kada se promjeni vrijednost polja
    imeZadatkaChange(t){
        this.setState({
            imeZadatak: t.target.value
        })
    }

    //Funckija koja ažurira opis zadatka svaki put kada se promjeni vrijednost polja
    opisZadatkaChange(t){
        this.setState({
            opisZadatak: t.target.value
        })
    }

    //Funckija koja ažurira ime elementa testcase-a svojstva svaki put kada se promjeni vrijednost polja
    imeElementaChange(t){
        this.setState({
            imeElementa: t.target.value
        })
    }

    //Funckija koja ažurira svosjtva testcase-a svojstava svaki put kada se promjeni vrijednost polja
    svojstvaChange(t){
        this.setState({
            svojstva: t.target.value
        })
    }

    //Funckija koja ažurira checkbox vrijednost testcase-a svojstva svaki put kada se promjeni vrijednost polja
    checkboxChange(t){
        if(t.target.checked){
            this.setState({
                checkbox: true
            })
        }else{
            this.setState({
                checkbox: false
            })
        }
    }

    //Funkcija za renderanje testcase stranice
    stvoriNoviTestcase(){
        this.setState(prevState => {
            return{
                prikazStranice: "testcase",
                brojTestcase: prevState.brojTestcase + 1
            }
        });
    }

    //Funckija za brisanje testcase-ova
    izbrisiTestcase(ime){
        let noviArr = this.state.testcases
        noviArr.splice(noviArr.findIndex(t => t.imeTestCase == ime), 1);
        console.log("Nakon brisanja "+ime+": "+JSON.stringify(noviArr));
        this.setState({
            testcases: noviArr
        });
    }

    //Funckija za spremanje novog testcase-a u listu testcases u state-u
    spremiTestcase(){
        this.setState(prevState => {
            return{
                prikazStranice: "zadatak",
                testcases: prevState.testcases.concat({
                    imeTestCase: prevState.imeTestcase,
                    JSON: {imeElementa: prevState.imeElementa, svojstva: prevState.svojstva, checkbox: prevState.checkbox},
                    vrstaTestCase: "css"
                }),
                imeElementa: "",
                svojstva: "",
                checkbox: false,
                imeTestcase: ""
            }
        });
    }

    //Funckija koja prebacuje stranicu u prozor za uređivanje testcase-a
    azurirajTestcase(ime){
        let ind = this.state.testcases.findIndex(t => t.imeTestCase == ime);
        this.setState({
            prikazStranice: ime,
            imeTestcase: this.state.testcases[ind].imeTestCase,
            imeElementa: this.state.testcases[ind].JSON.imeElementa,
            svojstva: this.state.testcases[ind].JSON.svojstva,
            checkbox: this.state.testcases[ind].JSON.checkbox
        });
    }

    //Funckija koja šalje serveru podatke o zadatku
    saljiServeru(e){
        e.preventDefault();
        fetch('/tasks/addTask', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                imeZadatak: this.state.imeZadatak,
                opisZadatak: this.state.opisZadatak,
                vrstaZadatak: 2,
                testcases: this.state.testcases
            })
        })
        window.location.reload(false)
    }

    //Funckija za spremanje promjena koje su se desile za testcase
    spremiPromjene(){
        let noviArr = this.state.testcases;
        let ind = noviArr.findIndex(t => t.imeTestCase == this.state.prikazStranice);
        noviArr[ind].JSON.imeElementa = this.state.imeElementa;
        noviArr[ind].JSON.svojstva = this.state.svojstva;
        noviArr[ind].JSON.checkbox = this.state.checkbox;
        noviArr[ind].imeTestCase = this.state.imeTestcase;
        this.setState({
            prikazStranice: "zadatak",
            testcases: noviArr,
            imeElementa: "",
            svojstva: "",
            checkbox: false,
            imeTestcase: ""
        });
    }

    render(){
        if(this.state.prikazStranice == "zadatak"){
            console.log("Prikazivanje stranice zadatak");
            console.log("testcases: "+JSON.stringify(this.state.testcases));
            return(        
                <div className="body">
                    <h1 className="pageTitle">Novi CSS zadatak</h1>
                    <br />
                    <div>
                        <div className="formElement">
                            <h2>Ime zadatka</h2>
                            <input type="text" className="customTextbox" name="ime" onChange={this.imeZadatkaChange} value={this.state.imeZadatak} required />
                        </div>
                        <div className="formElement">
                            <h2>Opis zadatka</h2>
                            <textarea className="customTextarea" name="opis" onChange={this.opisZadatkaChange} value={this.state.opisZadatak} required />
                        </div>
                        <div className="formElement">
                            <h2>Testni slučajevi</h2>
                            <table>
                                <thead>
                                    <tr className="titleTr">
                                        <th>Ime testnog slučaja</th>
                                        <th>Element</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.testcases.map((testcase) => {
                                    return(
                                        <tr>
                                            <th>{testcase.imeTestCase}</th>
                                            <th>{testcase.JSON.imeElementa}</th>
                                            <th className="buttonField">
                                                <button className="delBtn" onClick={() => this.izbrisiTestcase(testcase.imeTestCase)}><FontAwesomeIcon className="icon" icon={faTrash} /></button>
                                                <button className="editBtn" onClick={() => this.azurirajTestcase(testcase.imeTestCase)}><FontAwesomeIcon className="icon" icon={faPen} /></button>
                                            </th>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div class="formBtnContainer">
                            <button className="customBtn" onClick={this.stvoriNoviTestcase}>Novi testni slučaj</button>
                            <button className="customBtn" onClick={(e) => this.saljiServeru(e)}>Objava</button>
                        </div>
                    </div>
                </div>);
        }else if(this.state.prikazStranice == "testcase"){
            return(
                <div className="body">
                    <h1 className="pageTitle">Novi CSS testni slučaj</h1>
                    <form>
                        <div className="formElement">
                            <label for="imeTestcase">Ime testcase-a:</label>
                            <input type="text" className="customTextbox" name="imeTestcase" onChange={this.imeTestcaseChange} value={this.state.imeTestcase} />
                        </div>
                        <div className="formElement">
                            <label for="imeElementa">Element:</label>
                            <input type="text" className="customTextbox" name="imeElementa" onChange={this.imeElementaChange} value={this.state.imeElementa} />
                        </div>
                        <div className="formElement">
                            <label for="svojstva">Svojstva:</label>
                            <textarea className="customTextarea" name="svojstva" onChange={this.svojstvaChange} value={this.state.svojstva} />
                        </div>
                        <div className="formElement">
                            <label for="checkbox">Element smije imati samo navedena svojstva</label>
                            <input type="checkbox" className="customCheckbox" name="checkbox" onChange={this.checkboxChange} />
                        </div>
                        <div class="formBtnContainer2">
                            <button className="customBtn" onClick={this.spremiTestcase}>Stvori testni slučaj</button>
                        </div>
                    </form>
                </div>
            )
        }else{
            return(
                <div className="body">
                    <h1 className="pageTitle">Ažuriraj testni slučaj</h1>
                    <form>
                        <div className="formElement">
                            <label for="imeTestcase">Ime testcase-a:</label>
                            <input type="text" className="customTextbox" name="imeTestcase" onChange={this.imeTestcaseChange} value={this.state.imeTestcase} />
                        </div>
                        <div className="formElement">
                            <label for="imeElementa">Element:</label>
                            <input type="text" className="customTextbox" name="imeElementa" onChange={this.imeElementaChange} value={this.state.imeElementa} />
                        </div>
                        <div className="formElement">
                            <label for="svojstva">Svojstva:</label>
                            <textarea className="customTextarea" name="svojstva" onChange={this.svojstvaChange} value={this.state.svojstva} />
                        </div>
                        <div className="formElement">
                            <label for="checkbox">Element smije imati samo navedena svojstva</label>
                            <input type="checkbox" className="customCheckbox" name="checkbox" onChange={this.checkboxChange} checked={this.state.checkbox} />
                        </div>
                        <div class="formBtnContainer2">
                            <button className="customBtn" onClick={this.spremiPromjene}>Ažuriraj</button>
                        </div>
                    </form>
                </div>
            )
        }
    }
}

export default NoviCssZad;