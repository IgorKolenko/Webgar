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
        this.getFile = this.getFile.bind(this);
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

    async getFile(){
        console.log("Skidanje datoteke");
        const {match: {params}} = this.props;

        let filename = ""

        await fetch('/tasks/solutionName/'+params.solutionId, {
            method: 'GET'
        }).then(res => res.json()).then(res => filename = res.fileName);

        console.log('/tasks/solutionCode/'+params.solutionId);
        fetch('/tasks/solutionCode/'+params.solutionId, {
            method: 'GET',
        }).then((response) => response.blob())
        .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(
              new Blob([blob]),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
              'download',
              filename,
            );
        
            // Append to html link element page
            document.body.appendChild(link);
        
            // Start download
            link.click();
        
            // Clean up and remove the link
            link.parentNode.removeChild(link);
          });
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
                    <button className='customBtn' onClick={this.getFile}>Preuzmite datoteku</button>
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