import React from 'react';
import '../mainElements.css';
import '../formElements.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

class ManageAktivni extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            zadaci: [],
            selectedOption: 0,
            wordEntered: ""
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount(){
        fetch('/tasks/activeTasks')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    zadaci: res   
                })
        })
    }

    handleSelect(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }

    handleInput(event) {
        this.setState({
            wordEntered: event.target.value
        })
    }

    filterTasks() {
        let zadaci = this.state.zadaci
        let word = this.state.wordEntered

        if(word == "") {
            return zadaci
        }

        return zadaci.filter((zadatak) => {
            const ime = zadatak.imezadatak.toLowerCase();
            return ime.includes(word);
        })
    }

    izbrisiZadatak(e, idzadatak) {
        e.stopPropagation()
        fetch('/tasks/deactivateTask/'+idzadatak)
        window.location.reload(true);
    }

    render(){
        console.log(this.state.zadaci)
        console.log(this.state.wordEntered)
        return(
            <div className='body'>
                <form className='filterContainer'>
                    <label for="searchBar">Pretraži: </label>
                    <input
                        type="text"
                        name="searchBar"
                        value={this.state.wordEntered}
                        onInput={this.handleInput}
                    />

                    <label for="selectList">Vrsta zadatka: </label>
                    <select name="selectList" onChange={this.handleSelect}>
                        <option value="" disabled selected hidden>Select</option>
                        <option value="1">HTML</option>
                        <option value="2">CSS</option>
                        <option value="3">Javascript</option>
                    </select>
                </form>

                <h1 className="pageTitle">Aktivni zadaci</h1>

                <div className='container-tasks'>
                    {this.filterTasks().map((zadatak) => {
                        let datum = (new Date(zadatak.datum)).toLocaleDateString()
                        let vrsta = this.state.selectedOption
                        
                        if(vrsta == 0 || zadatak.idvrsta == vrsta) {
                            return(
                                
                                <div className='container-task' onClick={() => window.location.href='../rezultati/'+zadatak.idzadatak}>
                                    <div className='taskname'>
                                        <h3>{zadatak.name + " " + zadatak.surname}</h3>
                                        <h2>{zadatak.imezadatak}</h2>
                                    </div>
                                    <div>
                                        <h3>Vrsta zadatka</h3>
                                        {zadatak.idvrsta == 1 ? (
                                            <h2>HTML</h2>
                                        ) : (
                                            zadatak.idvrsta == 2 ? (
                                                <h2>CSS</h2>
                                                ) : (
                                                <h2>JS</h2>
                                            )
                                        )}
                                    </div>
                                    <div>
                                        <h3>Datum nastanka</h3>
                                        <h2>{datum}</h2>
                                    </div>
                                    <button className="delBtn" onClick={(e) => this.izbrisiZadatak(e, zadatak.idzadatak)}><FontAwesomeIcon className="icon" icon={faTrash} /></button>
                                </div>
                                
                            )
                        }
                    })}
                </div>
                <button className="customBtn" onClick={() => window.location.href="../manageStari"}>Stari zadaci</button>
            </div>
        )
    }
}

export default ManageAktivni;