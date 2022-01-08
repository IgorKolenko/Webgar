import React from 'react';
import '../mainElements.css';
import '../formElements.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import { read } from 'fs';

class PogledZadatka extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imeZadatak: "Test ime",
            opisZadatak: "Test opis",
            vrstaZadatak: 0,
            zadatakId: 1,
            file: [],
            isSelected: false,
            fileData: "",
            results: [],
            testcases: []
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.saljiServeru = this.saljiServeru.bind(this);
    }

    componentDidMount(){
        const {match: {params}} = this.props;
        fetch('/tasks/'+params.taskId)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    imeZadatak: res.imezadatak,
                    opisZadatak: res.opiszadatak,
                    vrstaZadatak: res.idvrsta,
                    zadatakId: res.idzadatak    
                })
            })
    }

    async changeHandler(event){
        const reader = new FileReader()
        let data = ""
        console.log("file: "+JSON.stringify(event.target.files[0]));
        let file = event.target.files[0];
        reader.onload = async (event) => {
            const text = event.target.result
            this.setState({
                isSelected: true,
                fileData: text,
                file: file
            })
            console.log(text)
            console.log(typeof(text))
        }
        await reader.readAsText(event.target.files[0])
    }

    saljiServeru(e){
        e.preventDefault();
        let params = {
            fileData: this.state.fileData,
            zadatakId: this.state.zadatakId,
            vrstaZadatak: this.state.vrstaZadatak,
            fileName: this.state.file.name
        }
        console.log(JSON.stringify(params));
        fetch('/tasks/newSolution', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(res => res.json()).then(res => {
            console.log(JSON.stringify(res));
            this.setState({
                results: res.results,
                testcases: res.testcases
            })
        });
    }
    
    render(){
        console.log("fileData: "+this.state.fileData);
        console.log("File: "+ JSON.stringify(this.state.file));
        console.log("Testcases: "+JSON.stringify(this.state.testcases));
        let count = 0;
        return(
            <div className='body'>
                <div className='onSameLine'>
                    <h1 className="pageTitle onSameLine">Ime zadatka: </h1>
                    <p className='onSameLine'>{this.state.imeZadatak}</p>
                </div>
                <br />
                <h1 className="pageTitle">Opis zadatka:</h1>
                <p>{this.state.opisZadatak}</p>
                <div className='fileDiv'>
                    <label className='customBtn'>
                        <input type='file' name='file' onChange={this.changeHandler} hidden="true" />
                        Izaberite datoteku
                    </label>
                    <button className='customBtn' onClick={(e) => this.saljiServeru(e)}>Predajte datoteku</button>
                </div>
                <div className='fileDiv'>
                    {this.state.isSelected ? (
                        <p className='fileName'>{this.state.file.name}</p>
                    ) : (
                        <p></p>
                    )}
                </div>
                <h2>Rezultati provjera</h2>
                {this.state.results.length > 0 ? (
                    <table className='testcaseTable'>
                        {this.state.results.map(res => {
                            let ind = this.state.testcases.findIndex(t => t.idtestcase == res.idtestcase)
                            return (
                                <tr>
                                    <th>{this.state.testcases[ind].imetestcase}</th>
                                    {res.prolaz == true ? (
                                        <th style={{backgroundColor: "green"}}>Prošao</th>
                                    ) : (
                                        <th style={{backgroundColor: "red"}}>Nije prošao</th>
                                    )}
                                </tr>
                            )
                        })}
                    </table>
                ) : (<div></div>)}
            </div>
        )
    }
}

export default PogledZadatka;