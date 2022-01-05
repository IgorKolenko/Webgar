import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class PogledZadatkaProfesor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imeZadatak: "Test ime",
            opisZadatak: "Test opis",
            vrstaZadatak: 0,
            zadatakId: 1,
            solutions: []
        }
    }

    componentDidMount(){
        const {match: {params}} = this.props;
        Promise.all([fetch('/tasks/'+params.taskId), fetch('/tasks/solutions/task/'+params.taskId)])
            .then(([res1, res2]) => {
                return Promise.all([res1.json(), res2.json()])
            })
            .then(([res1, res2]) => {
                this.setState({
                    imeZadatak: res1.imezadatak,
                    opisZadatak: res1.opiszadatak,
                    vrstaZadatak: res1.idvrsta,
                    zadatakId: res1.idzadatak,
                    solutions: res2
                })
            })
    }

    render(){
        console.log(this.state.solutions)
        return(
            <div className='body'>
                <h1 className="pageTitle">Ime zadatka</h1>
                <p>{this.state.imeZadatak}</p>
                <br />
                <h1 className="pageTitle">Opis zadatka</h1>
                <p>{this.state.opisZadatak}</p>
                <br />
                <h2>Rezultati studenata</h2>

                <div className='container-tasks'>
                    {this.state.solutions.map((solution) => {
                        let datum = (new Date(solution.uploaddate)).toLocaleDateString()
                        
                        return(
                            <div className='container-task'>
                                <div className='taskname'>
                                    <h3>Ime i prezime</h3>
                                    <h2>{solution.name + " " + solution.surname}</h2>
                                </div>
                                <div>
                                    <h3>Ime datoteke</h3>
                                    <h2>{solution.filename}</h2>
                                </div>
                                <div>
                                    <h3>Datum uploada</h3>
                                    <h2>{datum}</h2>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default PogledZadatkaProfesor;