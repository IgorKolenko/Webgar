import React from 'react';
import '../mainElements.css';
import '../formElements.css';
import { faBaby } from '@fortawesome/free-solid-svg-icons';

class AktivniZadaci extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            zadaci: [],
            profesori: []
        }
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

    render(){
        console.log(this.state.zadaci)
        console.log(this.state.profesori)
        return(
            <div className='body'>
                <div className='container-tasks'>
                    {this.state.zadaci.map((zadatak) => {
                        let date = new Date(zadatak.datum)
                        zadatak.datum = date.toLocaleDateString()

                        let profesor = this.vratiProfesora(zadatak.idprofesor)

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
                    })}
                </div>
            </div>
        )
    }
}

export default AktivniZadaci;