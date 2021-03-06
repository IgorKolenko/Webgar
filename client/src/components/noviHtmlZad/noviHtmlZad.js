import React from 'react';
import '../mainElements.css';
import '../formElements.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faPen} from '@fortawesome/free-solid-svg-icons';

class NoviHtmlZad extends React.Component{
    //konstruktor za NoviJsZad
    constructor(props){
        super(props);
        this.state = {
            imeZadatak: "",
            opisZadatak: "",
            vrstaZadatak: 1,
            testcasesSvojstva: [],
            testcasesStrukture: [],
            prikazStranice: "zadatak",
            brojTestcaseSvojstava: 0,
            brojTestcaseStrukture: 0,
            imeElementa: "",
            svojstva: "",
            checkbox: false,
            imeRoditelja: "",
            imeDjeteta: "",
            brPojavljivanja: 0,
            imeTestcase: "",
            staroImeTestcase: ""
        }
        this.imeZadatkaChange = this.imeZadatkaChange.bind(this);
        this.opisZadatkaChange = this.opisZadatkaChange.bind(this);
        this.imeElementaChange = this.imeElementaChange.bind(this);
        this.svojstvaChange = this.svojstvaChange.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this);
        this.imeRoditeljaChange = this.imeRoditeljaChange.bind(this);
        this.imeDjetetaChange = this.imeDjetetaChange.bind(this);
        this.brPojavljivanjaChange = this.brPojavljivanjaChange.bind(this);
        this.stvoriNoviTestcaseSvojstava = this.stvoriNoviTestcaseSvojstava.bind(this);
        this.stvoriNoviTestcaseStrukture = this.stvoriNoviTestcaseStrukture.bind(this);
        this.spremiTestcaseSvojstava = this.spremiTestcaseSvojstava.bind(this);
        this.spremiTestcaseStrukture = this.spremiTestcaseStrukture.bind(this);
        this.izbrisiTestcaseStvojstva = this.izbrisiTestcaseStvojstva.bind(this);
        this.izbrisiTestcaseStrukture = this.izbrisiTestcaseStrukture.bind(this);
        this.saljiServeru = this.saljiServeru.bind(this);
        this.azurirajTestcaseSvojstva = this.azurirajTestcaseSvojstva.bind(this);
        this.azurirajTestcaseStrukture = this.azurirajTestcaseStrukture.bind(this);
        this.spremiPromjeneSvojstava = this.spremiPromjeneSvojstava.bind(this);
        this.spremiPromjeneStrukture = this.spremiPromjeneStrukture.bind(this);
        this.imeTestcaseChange = this.imeTestcaseChange.bind(this);
    }

    imeTestcaseChange(t){
        this.setState({
            imeTestcase: t.target.value
        })
    }

    //Funckija koja a??urira ime zadatka svaki put kada se promjeni vrijednost polja
    imeZadatkaChange(t){
        this.setState({
            imeZadatak: t.target.value
        })
    }

    //Funckija koja a??urira opis zadatka svaki put kada se promjeni vrijednost polja
    opisZadatkaChange(t){
        this.setState({
            opisZadatak: t.target.value
        })
    }

    //Funckija koja a??urira ime elementa testcase-a svojstva svaki put kada se promjeni vrijednost polja
    imeElementaChange(t){
        this.setState({
            imeElementa: t.target.value
        })
    }

    //Funckija koja a??urira svosjtva testcase-a svojstava svaki put kada se promjeni vrijednost polja
    svojstvaChange(t){
        this.setState({
            svojstva: t.target.value
        })
    }

    //Funckija koja a??urira checkbox vrijednost testcase-a svojstva svaki put kada se promjeni vrijednost polja
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

    //Funckija koja a??urira ime roditelja testcase-a strukture svaki put kada se promjeni vrijednost polja
    imeRoditeljaChange(t){
        this.setState({
            imeRoditelja: t.target.value
        })
    }

    //Funckija koja a??urira ime djeteta testcase-a strukture svaki put kada se promjeni vrijednost polja
    imeDjetetaChange(t){
        this.setState({
            imeDjeteta: t.target.value
        })
    }

    //Funckija koja a??urira broj pojavljivanja testcase-a strukture svaki put kada se promjeni vrijednost polja
    brPojavljivanjaChange(t){
        if(t.target.value < 0){
            this.setState({
                brPojavljivanja: 0
            })
        }else{
            this.setState({
                brPojavljivanja: t.target.value
            })
        }
    }

    //Funkcija za renderanje testcase svojstava stranice
    stvoriNoviTestcaseSvojstava(){
        this.setState(prevState => {
            return{
                prikazStranice: "testcaseSvojstava",
                brojTestcaseSvojstava: prevState.brojTestcaseSvojstava + 1
            }
        });
    }

    //Funkcija za renderanje testcase strukture stranice
    stvoriNoviTestcaseStrukture(){
        this.setState(prevState => {
            return{
                prikazStranice: "testcaseStrukture",
                brojTestcaseStrukture: prevState.brojTestcaseStrukture + 1
            }
        });
    }

    //Funckija za brisanje testcase-ova svojstava
    izbrisiTestcaseStvojstva(ime){
        let noviArr = this.state.testcasesSvojstva
        noviArr.splice(noviArr.findIndex(t => t.imeTestCase == ime), 1);
        console.log("Nakon brisanja "+ime+": "+JSON.stringify(noviArr));
        this.setState({
            testcasesSvojstva: noviArr
        });
    }

    //Funckija za brisanje testcase-ova strukture
    izbrisiTestcaseStrukture(ime){
        let noviArr = this.state.testcasesStrukture
        noviArr.splice(noviArr.findIndex(t => t.imeTestCase == ime), 1);
        console.log("Nakon brisanja "+ime+": "+JSON.stringify(noviArr));
        this.setState({
            testcasesStrukture: noviArr
        });
    }

    //Funckija za spremanje novog testcase-a svojstava u listu testcases u state-u
    spremiTestcaseSvojstava(){
        this.setState(prevState => {
            return{
                prikazStranice: "zadatak",
                testcasesSvojstva: prevState.testcasesSvojstva.concat({
                    imeTestCase: prevState.imeTestcase,
                    JSON: {imeElementa: prevState.imeElementa, svojstva: prevState.svojstva, checkbox: prevState.checkbox},
                    vrstaTestCase: "htmlSvojstva"
                }),
                imeElementa: "",
                svojstva: "",
                checkbox: false,
                imeTestcase: ""
            }
        });
    }

    //Funckija za spremanje novog testcase-a strukture u listu testcases u state-u
    spremiTestcaseStrukture(){
        this.setState(prevState => {
            return{
                prikazStranice: "zadatak",
                testcasesStrukture: prevState.testcasesStrukture.concat({
                    imeTestCase: prevState.imeTestcase,
                    JSON: {imeRoditelja: prevState.imeRoditelja, imeDjeteta: prevState.imeDjeteta, brPojavljivanja: prevState.brPojavljivanja},
                    vrstaTestCase: "htmlStrukture"
                }),
                imeRoditelja: "",
                imeDjeteta: "",
                brPojavljivanja: 0,
                imeTestcase: ""
            }
        });
    }

    //Funckija koja prebacuje stranicu u prozor za ure??ivanje testcase-a svojstva
    azurirajTestcaseSvojstva(ime){
        let ind = this.state.testcasesSvojstva.findIndex(t => t.imeTestCase == ime);
        this.setState({
            prikazStranice: "azurirajSvojstvo",
            imeTestcase: this.state.testcasesSvojstva[ind].imeTestCase,
            staroImeTestcase: this.state.testcasesSvojstva[ind].imeTestCase,
            imeElementa: this.state.testcasesSvojstva[ind].JSON.imeElementa,
            svojstva: this.state.testcasesSvojstva[ind].JSON.svojstva,
            checkbox: this.state.testcasesSvojstva[ind].JSON.checkbox
        });
    }

    //Funckija koja prebacuje stranicu u prozor za ure??ivanje testcase-a strukture
    azurirajTestcaseStrukture(ime){
        let ind = this.state.testcasesStrukture.findIndex(t => t.imeTestCase == ime);
        this.setState({
            prikazStranice: "azurirajStrukturu",
            imeTestcase: this.state.testcasesStrukture[ind].imeTestCase,
            staroImeTestcase: this.state.testcasesStrukture[ind].imeTestCase,
            imeRoditelja: this.state.testcasesStrukture[ind].JSON.imeRoditelja,
            imeDjeteta: this.state.testcasesStrukture[ind].JSON.imeDjeteta,
            brPojavljivanja: this.state.testcasesStrukture[ind].JSON.brPojavljivanja
        });
    }

    //Funckija koja ??alje serveru podatke o zadatku
    saljiServeru(e){
        e.preventDefault();
        fetch('/tasks/addTask', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                imeZadatak: this.state.imeZadatak,
                opisZadatak: this.state.opisZadatak,
                vrstaZadatak: 1,
                testcases: this.state.testcasesSvojstva.concat(this.state.testcasesStrukture)
            })
        })
        window.location.reload(false)
    }

    //Funckija za spremanje promjena koje su se desile za testcase svojstava
    spremiPromjeneSvojstava(e){
        e.preventDefault();
        let noviArr = this.state.testcasesSvojstva;
        console.log(JSON.stringify(noviArr));
        console.log(this.state.imeTestcase);
        let ind = noviArr.findIndex(t => t.imeTestCase == this.state.staroImeTestcase);
        console.log("Ind: "+ind);
        noviArr[ind].JSON.imeElementa = this.state.imeElementa;
        noviArr[ind].JSON.svojstva = this.state.svojstva;
        noviArr[ind].JSON.checkbox = this.state.checkbox;
        noviArr[ind].imeTestCase = this.state.imeTestcase;
        this.setState({
            prikazStranice: "zadatak",
            testcasesSvojstva: noviArr,
            imeElementa: "",
            svojstva: "",
            checkbox: false,
            imeTestcase: "",
            staroImeTestcase: ""
        });
    }

    //Funckija za spremanje promjena koje su se desile za testcase strukture
    spremiPromjeneStrukture(){
        let noviArr = this.state.testcasesStrukture;
        let ind = noviArr.findIndex(t => t.imeTestCase == this.state.staroImeTestcase);
        noviArr[ind].JSON.imeRoditelja = this.state.imeRoditelja;
        noviArr[ind].JSON.imeDjeteta = this.state.imeDjeteta;
        noviArr[ind].JSON.brPojavljivanja = this.state.brPojavljivanja;
        noviArr[ind].imeTestCase = this.state.imeTestcase;
        this.setState({
            prikazStranice: "zadatak",
            testcasesStrukture: noviArr,
            imeRoditelja: "",
            imeDjeteta: "",
            brPojavljivanja: 0,
            imeTestcase: "",
            staroImeTestcase: ""
        });
    }

    render(){
        if(this.state.prikazStranice == "zadatak"){
            console.log("Prikazivanje stranice zadatak");
            console.log("testcases: "+JSON.stringify(this.state.testcases));
            return(        
                <div className="body">
                    <h1 className="pageTitle">Novi HTML zadatak</h1>
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
                            <h2>Testni slu??ajevi svojstava</h2>
                            <table>
                                <thead>
                                    <tr className="titleTr">
                                        <th>Ime testnog slu??aja</th>
                                        <th>Ime klase/id-a</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.testcasesSvojstva.map((testcase) => {
                                    return(
                                        <tr>
                                            <th>{testcase.imeTestCase}</th>
                                            <th>{testcase.JSON.imeElementa}</th>
                                            <th className="buttonField">
                                                <button className="delBtn" onClick={() => this.izbrisiTestcaseStvojstva(testcase.imeTestCase)}><FontAwesomeIcon className="icon" icon={faTrash} /></button>
                                                <button className="editBtn" onClick={() => this.azurirajTestcaseSvojstva(testcase.imeTestCase)}><FontAwesomeIcon className="icon" icon={faPen} /></button>
                                            </th>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div className="formElement">
                            <h2>Testni slu??ajevi strukture</h2>
                            <table>
                                <thead>
                                    <tr className="titleTr">
                                        <th>Ime testnog slu??aja</th>
                                        <th>Roditelj element</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.testcasesStrukture.map((testcase) => {
                                    return(
                                        <tr>
                                            <th>{testcase.imeTestCase}</th>
                                            <th>{testcase.JSON.imeRoditelja}</th>
                                            <th className="buttonField">
                                                <button className="delBtn" onClick={() => this.izbrisiTestcaseStrukture(testcase.imeTestCase)}><FontAwesomeIcon className="icon" icon={faTrash} /></button>
                                                <button className="editBtn" onClick={() => this.azurirajTestcaseStrukture(testcase.imeTestCase)}><FontAwesomeIcon className="icon" icon={faPen} /></button>
                                            </th>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div class="formBtnContainer">
                            <div class="verticalBtnContainer">
                                <button className="customBtn" onClick={this.stvoriNoviTestcaseSvojstava}>Novi testni slu??aj svojstava</button>
                                <button className="customBtn" onClick={this.stvoriNoviTestcaseStrukture}>Novi testni slu??aj strukture</button>
                            </div>
                            <div class="verticalBtnContainer">
                                <button className="customBtn" onClick={(e) => this.saljiServeru(e)}>Objava</button>
                            </div>
                        </div>
                    </div>
                </div>);
        }else if(this.state.prikazStranice == "testcaseSvojstava"){
            return(
                <div className="body">
                    <h1 className="pageTitle">Novi HTML testni slu??aj svojstava</h1>
                    <form>
                        <div className="formElement">
                            <label for="imeTestcase">Ime testcase-a:</label>
                            <input type="text" className="customTextbox" name="imeTestcase" onChange={this.imeTestcaseChange} value={this.state.imeTestcase} />
                        </div>
                        <div className="formElement">
                            <label for="imeElementa">Element s klasom/id-om:</label>
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
                            <button className="customBtn" onClick={this.spremiTestcaseSvojstava}>Stvori testni slu??aj</button>
                        </div>
                    </form>
                </div>
            )
        }else if(this.state.prikazStranice == "testcaseStrukture"){
            return(
                <div className="body">
                    <h1 className="pageTitle">Novi HTML testni slu??aj strukture</h1>
                    <form>
                        <div className="formElement">
                            <label for="imeTestcase">Ime testcase-a:</label>
                            <input type="text" className="customTextbox" name="imeTestcase" onChange={this.imeTestcaseChange} value={this.state.imeTestcase} />
                        </div>
                        <div className="formElement">
                            <label for="imeRoditelja">Element roditelj:</label>
                            <input type="text" className="customTextbox" name="imeRoditelja" onChange={this.imeRoditeljaChange} value={this.state.imeRoditelja} />
                        </div>
                        <div className="formElement">
                            <label for="imeDjeteta">Element koji se prebrojava:</label>
                            <input type="text" className="customTextbox" name="imeDjeteta" onChange={this.imeDjetetaChange} value={this.state.imeDjeteta} />
                        </div>
                        <div className="formElement">
                            <label for="brPojavljivanja">Nu??an broj pojavljivanja:</label>
                            <input type="number" name="brPojavljivanja" className="customTextbox" onChange={this.brPojavljivanjaChange} value={this.state.brPojavljivanja} />
                        </div>
                        <div class="formBtnContainer2">
                            <button className="customBtn" onClick={this.spremiTestcaseStrukture}>Stvori testni slu??aj</button>
                        </div>
                    </form>
                </div>
            )
        }else if(this.state.prikazStranice == "azurirajSvojstvo"){
            return(
                <div className="body">
                    <h1 className="pageTitle">A??uriraj testni slu??aj svojstava</h1>
                    <form>
                        <div className="formElement">
                            <label for="imeTestcase">Ime testcase-a:</label>
                            <input type="text" className="customTextbox" name="imeTestcase" onChange={this.imeTestcaseChange} value={this.state.imeTestcase} />
                        </div>
                        <div className="formElement">
                            <label for="imeElementa">Element s klasom/id-om:</label>
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
                            <button className="customBtn" onClick={(e) => this.spremiPromjeneSvojstava(e)}>A??uriraj</button>
                        </div>
                    </form>
                </div>
            )
        }else if(this.state.prikazStranice == "azurirajStrukturu"){
            return(
                <div className="body">
                    <h1 className="pageTitle">A??uriraj testni slu??aj strukture</h1>
                    <form>
                        <div className="formElement">
                            <label for="imeTestcase">Ime testcase-a:</label>
                            <input type="text" className="customTextbox" name="imeTestcase" onChange={this.imeTestcaseChange} value={this.state.imeTestcase} />
                        </div>
                        <div className="formElement">
                            <label for="imeRoditelja">Element roditelj:</label>
                            <input type="text" className="customTextbox" name="imeRoditelja" onChange={this.imeRoditeljaChange} value={this.state.imeRoditelja} />
                        </div>
                        <div className="formElement">
                            <label for="imeDjeteta">Element koji se prebrojava:</label>
                            <input type="text" className="customTextbox" name="imeDjeteta" onChange={this.imeDjetetaChange} value={this.state.imeDjeteta} />
                        </div>
                        <div className="formElement">
                            <label for="brPojavljivanja">Nu??an broj pojavljivanja:</label>
                            <input type="number" name="brPojavljivanja" className="customTextbox" onChange={this.brPojavljivanjaChange} value={this.state.brPojavljivanja} />
                        </div>
                        <div class="formBtnContainer2">
                            <button className="customBtn" onClick={this.spremiPromjeneStrukture}>A??uriraj</button>
                        </div>
                    </form>
                </div>
            )
        }
    }
}

export default NoviHtmlZad;