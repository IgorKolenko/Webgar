import React from 'react';
import '../mainElements.css';
import '../formElements.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faPen} from '@fortawesome/free-solid-svg-icons';

class NoviJsZad extends React.Component{
    //konstruktor za NoviJsZad
    constructor(props){
        super(props);
        this.state = {
            imeZadatak: "",
            opisZadatak: "",
            vrstaZadatak: 1,
            testcases: [],
            prikazStranice: "zadatak",
            brojTestcase: 0,
            imeFunkcije: "",
            input: "",
            output: "",
            imeTestcase: ""
        }
        this.imeZadatkaChange = this.imeZadatkaChange.bind(this);
        this.opisZadatkaChange = this.opisZadatkaChange.bind(this);
        this.imeFunkcijeChange = this.imeFunkcijeChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.outputChange = this.outputChange.bind(this);
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

    //Funckija koja ažurira ime funckije testcase-a svaki put kada se promjeni vrijednost polja
    imeFunkcijeChange(t){
        this.setState({
            imeFunkcije: t.target.value
        })
    }

    //Funckija koja ažurira output testcase-a svaki put kada se promjeni vrijednost polja
    outputChange(t){
        this.setState({
            output: t.target.value
        })
    }

    //Funckija koja ažurira input testcase-a svaki put kada se promjeni vrijednost polja
    inputChange(t){
        this.setState({
            input: t.target.value
        })
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
                    JSON: {imeFunkcije: prevState.imeFunkcije, input: prevState.input, output: prevState.output},
                    vrstaTestCase: "javascript"
                }),
                imeFunkcije: "",
                input: "",
                output: "",
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
            imeFunkcije: this.state.testcases[ind].JSON.imeFunkcije,
            input: this.state.testcases[ind].JSON.input,
            output: this.state.testcases[ind].JSON.output
        });
        console.log("imeFunckije: "+this.state.testcases[ind].JSON.imeFunkcije);
        console.log("input: "+this.state.testcases[ind].JSON.input);
        console.log("output: "+this.state.testcases[ind].JSON.output);
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
                vrstaZadatak: 3,
                testcases: this.state.testcases
            })
        })
        window.location.reload(false)
    }

    //Funckija za spremanje promjena koje su se desile za testcase
    spremiPromjene(){
        let noviArr = this.state.testcases;
        let ind = noviArr.findIndex(t => t.imeTestCase == this.state.prikazStranice);
        noviArr[ind].JSON.imeFunkcije = this.state.imeFunkcije;
        noviArr[ind].JSON.input = this.state.input;
        noviArr[ind].JSON.output = this.state.output;
        noviArr[ind].imeTestCase = this.state.imeTestcase;
        this.setState({
            prikazStranice: "zadatak",
            testcases: noviArr,
            imeFunkcije: "",
            input: "",
            output: ""
        });
    }

    render(){
        if(this.state.prikazStranice == "zadatak"){
            console.log("Prikazivanje stranice zadatak");
            console.log("testcases: "+JSON.stringify(this.state.testcases));
            return(        
                <div className="body">
                    <h1 className="pageTitle">Novi javascript zadatak</h1>
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
                                        <th>Ime funckije</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.testcases.map((testcase) => {
                                    return(
                                        <tr>
                                            <th>{testcase.imeTestCase}</th>
                                            <th>{testcase.JSON.imeFunkcije}</th>
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
                    <h1 className="pageTitle">Novi javascript testni slučaj</h1>
                    <form>
                        <div className="formElement">
                            <label for="imeTestcase">Ime testcase-a:</label>
                            <input type="text" className="customTextbox" name="imeTestcase" onChange={this.imeTestcaseChange} value={this.state.imeTestcase} />
                        </div>
                        <div className="formElement">
                            <label for="ime">Ime funkcije:</label>
                            <input type="text" className="customTextbox" name="ime" onChange={this.imeFunkcijeChange} value={this.state.imeFunkcije} />
                        </div>
                        <div className="formElement">
                            <label for="input">Input:</label>
                            <textarea className="customTextarea" name="input" onChange={this.inputChange} value={this.state.input} />
                        </div>
                        <div className="formElement">
                            <label for="input">Output:</label>
                            <textarea className="customTextarea" name="output" onChange={this.outputChange} value={this.state.output} />
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
                            <label for="ime">Ime funkcije:</label>
                            <input type="text" className="customTextbox" name="ime" onChange={this.imeFunkcijeChange} value={this.state.imeFunkcije} />
                        </div>
                        <div className="formElement">
                            <label for="input">Input:</label>
                            <textarea className="customTextarea" name="input" onChange={this.inputChange} value={this.state.input} />
                        </div>
                        <div className="formElement">
                            <label for="input">Output:</label>
                            <textarea className="customTextarea" name="output" onChange={this.outputChange} value={this.state.output} />
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

export default NoviJsZad;