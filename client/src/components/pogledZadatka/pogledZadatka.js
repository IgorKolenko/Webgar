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
            results: []
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
            vrstaZadatak: this.state.vrstaZadatak
        }
        console.log(JSON.stringify(params));
        fetch('/tasks/newSolution', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        }).then(res => res.json()).then(res => {
            this.setState({
                results: res
            })
        });
    }
    
    render(){
        console.log("fileData: "+this.state.fileData);
        console.log("File: "+ JSON.stringify(this.state.file));
        let count = 0;
        return(
            <div className='body'>
                <h1 className="pageTitle">{this.state.imeZadatak}</h1>
                <br />
                <p>{this.state.opisZadatak}</p>
                <div className='fileDiv'>
                    <label className='customBtn'>
                        <input type='file' name='file' onChange={this.changeHandler} hidden="true" />
                        Izaberite datoteku
                    </label>
                    {this.state.isSelected ? (
                        <p className='fileName'>{this.state.file.name}</p>
                    ) : (
                        <p></p>
                    )}
                </div>
                <div className='fileDiv'>
                    <button className='customBtn' onClick={(e) => this.saljiServeru(e)}>Predajte datoteku</button>
                </div>
                <h2>Rezultati provjera</h2>
                {this.state.results.length > 0 ? (
                    <table>
                        {this.state.results.map(res => {
                            count++;
                            return (
                                <tr>
                                    <th>Testcase{count}</th>
                                    {res.prolaz == 1 ? (
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