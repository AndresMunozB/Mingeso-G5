import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/mode/c_cpp';

import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/terminal';

import 'brace/snippets/python';
import 'brace/ext/language_tools';
//onChange={this.updateLenguaje.bind(this)}
//{this.state.lenjuajeSelect} 
// alert('El lenguaje elegido es: ' + this.state.value);
/*<TextField
                  hintText="enunciado"
                  floatingLabelText="Enunciado"
                  value = value={this.state.enunciado}
    
                  fullWidth={true}
                  multiLine={true}
                  rows={10}
                  rowsMax={14}
                  cols={180}
                /> 
*/

class Solution extends Component{
    constructor(props){
        super(props)
        console.log(props)
        this.state = { lenguajeElegido: "", codigoAlumno: "", //view:"",
       
        };//1

    }

    updateLenguaje(event){
        this.setState(
            {lenguajeElegido:event.target.value}); 
            event.preventDefault();
    }
    //updateCodigoA(event){this.setState({codigoAlumno: event.target.value});}//como actualizar lo que escribe el alumno

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.codigoAlumno !== nextState.codigoAlumno) {
          return false
        } else {
          return true;
        }
    }
    onChange=(NewValue)=>{
        console.log('Change',NewValue);
        this.setState({
            codigoAlumno:NewValue
        });
        
    }
    loadCancelar = () => {
        this.setState({view: "Cancelar"});
    }




    render(){
       //  console.log(this.props)
            if (this.state.view === "Cancelar") 
                alert('Cancel'); 
               // return  <"/listaEnunciados"/> ;
        return(
        <div class="container">
            <div className="row">
                
                <textarea rows="10" cols="180" 
                />  
            </div>
             <div className="row">
                <div className="col-sm-2">
                    <select onClick={this.updateLenguaje.bind(this)} >
                        <option hidden>Lenguaje</option>
                        <option value="python">Python</option>
                        <option value="c_cpp">C</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <div className="col-sm-1 ">
                    <button  onClick={this.runCode.bind(this)} 
                    className="btn btn-primary">Ejecutar</button>
                </div>
                <div className="col-sm-6 "></div>
                <div className="col-sm-1">
                <button onClick={this.sendSolution.bind(this)} 
                className="btn btn-success">Enviar</button>
                </div>   
                <div className="col-sm-1">
                <button onClick = {this.loadCancelar}
                className="btn btn-danger" >Cancelar</button>
                </div> 
            </div><br></br>
            <div className="row" >
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                    <AceEditor
                    mode= {this.state.lenguajeElegido} //escoger lenguaje
                    theme="terminal"
                    name="blah2"
                    //onChange={this.updateCodigoA.bind(this)}
                    onChange={this.onChange}
                    fontSize={18}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value = ""
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}/>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                    <textarea rows="25" cols="81">
                    </textarea>
                </div>
            </div>
        </div>
        );
    } 
    
    runCode(){
        if(this.state.lenguajeElegido!= ''){
            //ejecutar codigo

        }else{
            alert('seleccione un lenguaje');

        }
    }

    sendSolution(){

        if(this.state.codigoAlumno!= '' ){
            alert('Tarea enviada ' + this.state.codigoAlumno);//ojala agregar fecha
            }
        else{
            alert('Fallo el envio');
        }
    } 
                      
         
}

export default Solution;