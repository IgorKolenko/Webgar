import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class AktivniZadaci extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            zadaci: []
        }
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

    render(){
        console.log(this.state.zadaci)
        return(
            <div className='body'>
                <div className='container-tasks'>
                    {this.state.zadaci.map((zadatak) => {
                        let date = new Date(zadatak.datum)
                        zadatak.datum = date.toLocaleDateString()
                        
                        return(
                            <a href={'../zadatak/'+zadatak.idzadatak}>
                            <div className='container-task'>
                                <div className='taskname'>
                                    <h3>{zadatak.idprofesor}</h3>
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