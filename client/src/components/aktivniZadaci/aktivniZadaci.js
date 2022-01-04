import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class AktivniZadaci extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            zadaci: [],
            profesori: [],
            selectedOption: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        Promise.all([fetch('/tasks/activeTasks'), fetch('/tasks/professors')])
            .then(([res1, res2]) => { 
                return Promise.all([res1.json(), res2.json()]) 
        })
            .then(([res1, res2]) => {
                this.setState({
                    zadaci: res1,
                    profesori: res2
                })
        });
    }

    vratiProfesora(idprofesor) {
        for(var profesor of this.state.profesori) {
            if(profesor.idprofesor == idprofesor) {
                return profesor
            }
        }
    }

    handleChange(event) {
        this.setState({
            selectedOption: event.target.value
        });
      }

    render(){
        console.log(this.state.zadaci)
        console.log(this.state.profesori)
        return(
            <div className='body'>
                <form>
                    <select onChange={this.handleChange}>
                        <option value="" disabled selected hidden>Select</option>
                        <option value="1">HTML</option>
                        <option value="2">CSS</option>
                        <option value="3">Javascript</option>
                    </select>
                </form>

                <div className='container-tasks'>
                    {this.state.zadaci.map((zadatak) => {
                        let date = new Date(zadatak.datum)
                        zadatak.datum = date.toLocaleDateString()

                        let profesor = this.vratiProfesora(zadatak.idprofesor)

                        let vrsta = this.state.selectedOption
                        
                        if(vrsta == 0) {
                            return(
                                <a href={'../zadatak/'+zadatak.idzadatak}>
                                <div className='container-task'>
                                    <div className='taskname'>
                                        <h3>{profesor.imeprofesor + " " + profesor.prezimeprofesor}</h3>
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
                                        <h2>{zadatak.datum}</h2>
                                    </div>
                                </div>
                                </a>
                            )
                        } else {
                            if(zadatak.idvrsta == vrsta) {
                                return(
                                <a href={'../zadatak/'+zadatak.idzadatak}>
                                <div className='container-task'>
                                    <div className='taskname'>
                                        <h3>{profesor.imeprofesor + " " + profesor.prezimeprofesor}</h3>
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
                                        <h2>{zadatak.datum}</h2>
                                    </div>
                                </div>
                                </a>
                            )
                            }
                        }
                    })}
                </div>
            </div>
        )
    }
}

export default AktivniZadaci;