import React from 'react';
import '../mainElements.css';
import '../formElements.css';

class PogledRezultata extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imeStudent: "",
            prezimeStudent: "",
            uploadDate: "",
            fileName: "",
            results: []
        }
    }

    componentDidMount(){
        const {match: {params}} = this.props;
        fetch('/tasks/solutions/'+params.solutionId)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    imeStudent: res.solution.name,
                    prezimeStudent: res.solution.surname,
                    uploadDate: res.solution.uploaddate,
                    fileName: res.solution.filename,
                    results: res.results   
                })
            })
    }

    render(){
        console.log(this.state.results)
        let datum = (new Date(this.state.uploadDate)).toLocaleDateString()
        return(
            <div className='body'>
                <h1 className="pageTitle">{this.state.imeStudent + " " + this.state.prezimeStudent}</h1>
                <p>Datum uploada: {datum}</p>
                <p>
                    Datoteka: {this.state.fileName}
                    <button className='customBtn'>Preuzmite datoteku</button>
                </p>
                <br />
                <h2>Rezultati provjera</h2>
                {this.state.results.length > 0 ? (
                    <table className='testcaseTable'>
                        {this.state.results.map(res => {
                            return (
                                <tr>
                                    <th>{res.name}</th>
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

export default PogledRezultata;