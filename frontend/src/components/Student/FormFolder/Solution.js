import React ,{Component} from 'react';
import { Form, TextArea,Button,Divider,Dropdown,Icon, Dimmer,Loader,Segment } from 'semantic-ui-react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Drawer,AppBar} from 'material-ui'
import ThemeDefault from '../ThemeList';
import Paper from 'material-ui/Paper';
import {Modal,Row,Col,Popover,OverlayTrigger} from 'react-bootstrap'
import AceEditor from 'react-ace';
import {Link} from 'react-router-dom';

import Axios from 'axios'
import 'brace/theme/monokai';
import 'brace/mode/python';
import 'brace/mode/java';
import 'brace/mode/c_cpp';
import 'brace/ext/language_tools';


const background = {
  bigFrame:{
    padding: 15,
    position:'relative'
  },
  mediumFrame:{
    width: "40%",
    height: "60%",
    padding:"2%",
    position:'relative',
    left:"30%",
    border: "1px solid lightblue"
  },

  textAreaStyle:{
    height: 300,
    border: "1px solid lightblue"

  },
  textAreaStyle2:{
    minHeight: 500,
    minWidth:520,
    color:"black"
  },
  titleStyle:{
    textAlign:"center"
  }
}
class Solution extends Component {
    constructor(props) {
      super(props); 
      this.keys = 0;
      console.log("estos son mis props de id: ", this.props.idUser )

      console.log("Esto es lo que tengo en estado ", this.props.location.state )
      this.state = {    
        exercise: props.location.state,
        initialTime: null,   
        idExercise:null,
        title: null,
        description: null,
        functionName: null,
        isSafeToRender: false,
        showDetailsExercise: true,
        sideMenu:false,
        nameButton: "Ocultar",
        code:"",
        reply: "",
        results: null,
        itemsRendered: 0,
        renderedThings: [],
        disableButton:false,
        testCases: null,
        showPerformance: false,
        successCases:0,
        modalCongrats:false,
        modalError: false,
        format: null,
        message: "",
        loader: false,
        type:0,
        popUpAreYouSure: false,
        languageOptions: [
            
              { key: 'python', value: 'python', text: 'Python' },
              { key: 'java', value: 'java', text: 'Java' },
              { key: 'c', value: 'c_cpp', text: 'C' }
           
         ],  
         languageEditor: "",
         languageCode: ""
  
        
      }
      //EXECUTE CODE
      this.executeCode = this.executeCode.bind(this)
     
      //SHOW TESTING
      this.scheduleNextUpdate = this.scheduleNextUpdate.bind(this)
      this.updateRenderedThings = this.updateRenderedThings.bind(this)      
      //PERFORMANCE
      this.countSuccessCases = this.countSuccessCases.bind(this)
      //SHOW TESTING

      //FORMAT FOR CODE
      this.popoverHoverFocus = this.popoverHoverFocus.bind(this)
      //FORMAT FOR CODE


      //SEND CODE FOR TESTING 
      this.sendCodeRevision = this.sendCodeRevision.bind(this)
      this.sendCodeGoodPractices = this.sendCodeGoodPractices.bind(this)
      this.testTestCases = this.testTestCases.bind(this)     
      this.replaceInput = this.replaceInput.bind(this)
      this.codesToTest = this.codesToTest.bind(this)      
      this.testingResults = this.testingResults.bind(this)
      //SEND CODE FOR TESTING 

      //SEND SOLUTION
      this.sendSolution = this.sendSolution.bind(this)

      //FIELD UPDATES
      this.updateCode = this.updateCode.bind(this)
      this.selectLanguages = this.selectLanguages.bind(this)
      //FIELD UPDATES


      //SIDE MENU TESTCASES
      this.handleSideBar = this.handleSideBar.bind(this)

      //LOADING SCREEN
      this.handleLoader = this.handleLoader.bind(this)


      //MODALS
      this.handleShowDetailsExercise = this.handleShowDetailsExercise.bind(this)
      this.handleHideDetailsExercise = this.handleHideDetailsExercise.bind(this)

      this.handleHideModalError = this.handleHideModalError.bind(this)
      this.handleShowModalError = this.handleShowModalError.bind(this)


      this.handleShowAreYouSure = this.handleShowAreYouSure.bind(this);
      this.handleHideAreYouSure = this.handleHideAreYouSure.bind(this);

      //MODALS


    }

  handleShowAreYouSure() {
      this.setState({ popUpAreYouSure: true });
  }

  handleHideAreYouSure() {
      this.setState({ popUpAreYouSure: false });
  }


  sendSolution(){
      

      if(this.state.code === "" || this.state.code === null){

        this.handleLoader();
        this.setState({type:1,message: "No se encuentra codigo en el editor, porfavor envie una solucion no vacia"})
        setTimeout(() => {    
              this.handleShowModalError();
              this.handleHideAreYouSure();
        }, 5);
      }
      else if(this.state.languageEditor === ""){

        this.handleLoader();
        this.setState({type:1,message: "Se debe seleccionar un lenguaje de programacion antes de enviar una solucion"})
        setTimeout(() => {    
              this.handleShowModalError();

              this.handleHideAreYouSure();
        }, 5);

      }
      else{
            var timeElapsed = new Date();
            var milisecondsElapsed = timeElapsed.getTime();
            var timeSpent = milisecondsElapsed - this.state.initialTime
            console.log("esto me demore en milisegundos")
            console.log(timeSpent)
            timeSpent = Math.round(timeSpent/1000);
          
            let subSolution = {                
                  script: this.state.code,
                  language:this.state.languageCode
            };
            let completeSolution = {
                  spendTime: timeSpent,
                  solution: subSolution
            }
            let axiosConfig = {
                  headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
                      "Access-Control-Allow-Origin": "@crossorigin",
                  }
            };

            Axios.post('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/solutions/create/'+this.props.idUser+'/'+this.state.idExercise,completeSolution,axiosConfig)
            .then((response) => {
                console.log("RESPONSE RECEIVED: ", response);
                this.handleLoader()
                  setTimeout(() => {            
                    this.setState({modalCongrats:true})
                  }, 50);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
                this.handleLoader();
                this.setState({type:1,message: "No se pudo crear la solucion respectiva, porfavor envie a revision de nuevo su codigo"})
                setTimeout(() => {    
                      this.handleShowModalError();
                }, 5);
            })

      }
      
     
  }

  
  scheduleNextUpdate() {
      this.timer = setTimeout(this.updateRenderedThings, 800)
  }
  updateRenderedThings() {
    const itemsRendered = this.state.itemsRendered
    const updatedState = {
        renderedThings: this.state.renderedThings.concat(this.state.results[this.state.itemsRendered]),
        itemsRendered: itemsRendered+1
    }
    this.setState(updatedState)
    if (updatedState.itemsRendered < this.state.results.length) {
        this.scheduleNextUpdate()
    }
    else{
        var successCases = 0
        for(let i = 0; i<this.state.results.length;i++){
            console.log(this.state.results)
            if(this.state.results[i].props.children[2].props.children[1].props.name === "check"){
              successCases++;
            }
        }
        console.log("aquivas bueno")
        console.log(successCases/this.state.testCases.length)

        console.log(this.state.languageCode)

        console.log(this.state.code)
        this.setState({successCases})
        setTimeout(() => {
              this.setState({showPerformance:true})


              setTimeout(() => {

                this.sendCodeGoodPractices()
                
              }, 10);
        }, 500);
    }
  }

  componentWillUnmount() {
      clearTimeout(this.timer)
  }

  countSuccessCases(){
    this.handleLoader();
    this.handleSideBar();
    setTimeout(() => {      
      this.scheduleNextUpdate()
      this.setState({disableButton: true})
    }, 2);
  }





  handleSideBar(){
    this.setState({sideMenu: !this.state.sideMenu});
  }
  handleLoader(){
    this.setState({loader: !this.state.loader});
  }

  handleShowDetailsExercise(){
    this.setState({showDetailsExercise: true});
  }
  handleHideDetailsExercise(){
    this.setState({showDetailsExercise: false, nameButton:"Mostrar"});
  }
  handleShowModalError(){
    this.setState({modalError: true});
  }
  handleHideModalError(){
    this.setState({modalError: false});
  }
  executeCode(){
    console.log(this.state.code)
    if(this.state.languageCode.length !== 0){
        let codeToExecute = {
          language:this.state.languageCode,
          script: this.state.code
        };
        let axiosConfig = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "@crossorigin",
          }
        };

        Axios.post('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/solutions/execute',codeToExecute,axiosConfig)
        .then((response) => {
            console.log("RESPONSE RECEIVED: ", response);

            this.handleLoader();
            if(response.data.stderr !== ""){
              this.refs.result.props.style.color = "red"
              this.setState({reply: response.data.stderr})
            }
            else{
              this.refs.result.props.style.color = "blue"
              this.setState({reply: response.data.stdout})
            }
        })
        .catch((err) => {
          this.setState({type:1,message: "No se pudo ejecutar el codigo, intente nuevamente"})
          setTimeout(() => {    
                this.handleLoader();
                this.handleShowModalError();
          }, 1);
        })
    }
    else{
      this.setState({type:1,message: "Debe elegir un lenguaje de programacion para poder ejecutar su codigo"})
      setTimeout(() => {    
            this.handleLoader();
            this.handleShowModalError();
      }, 1);
    }

  }
  replaceInput(input){
    var codeToTest = this.state.code;
    var functionNameFormat = this.state.functionName.concat("()")
    var readyCode;
    if(codeToTest.includes(functionNameFormat)){
      readyCode = codeToTest.replace(functionNameFormat,this.state.functionName.concat("(").concat(input).concat(")"))
    }
    else if(!codeToTest.includes(this.state.functionName)){
      readyCode = "no function name seen"
    }
    else{
      readyCode = "bad format"
    }
    return readyCode
  }
  codesToTest(){
    var codesInputReplaced = []
    var functionNameFormat = this.state.functionName.concat("()")
    var codeToTest = this.state.code;
    var input;
    for(let i= 0; i<this.state.testCases.length;i++){
        input = this.state.testCases[i].input
        codesInputReplaced.push(codeToTest.replace(functionNameFormat,this.state.functionName.concat("(").concat(input).concat(")")))
    }
    return codesInputReplaced

  }

  testingResults(codeToTest,divs,index){
          
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "@crossorigin",
      }
    };

    Axios.post('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/solutions/execute',codeToTest,axiosConfig)
    .then((response) => {
        console.log("RESPONSE RECEIVED: ", response);
        console.log("este deberia ser el resultado")
        console.log(this.state.testCases[index].output)
        console.log("y esto es lo que me salio")
        console.log(response.data.stdout)
        if(response.data.stdout === this.state.testCases[index].output.concat("\n") ||
           response.data.stdout === this.state.testCases[index].output){
             //ACA ESTA EL INPUT 
             //{this.state.testCases[index].input}
              divs.push( <div   
                                style= {{textAlign: 'center'}}>
    
                              <div style={{padding:10}}></div>
                              <p style={{color:"white"}}>Input:  <Icon name='check' color='blue' size='small' />  </p>
                              <p style={{color:"white"}}>Output:  <Icon name='check' color='blue' size='small' /></p>
                            
                          </div>);
        }
        else{
              divs.push( <div  
                              style= {{textAlign: 'center'}}>
    
                              <div style={{padding:10}}></div>
                              <p style={{color:"white"}} >Input: <Icon name='check' color='blue' size='small' /></p>
                              <p style={{color:"white"}}>Output:  <Icon name='cancel' color='red' size='small' /></p>
                          </div>);
        }
        if(index === this.state.testCases.length -1){               
          this.setState({results: divs});                
          setTimeout(() => {      
            this.countSuccessCases()
          }, 2);
        }
    })
    .catch((err) => {
      this.setState({type:1,message: "No se pudieron probar los casos de prueba, intente nuevamente"})
      setTimeout(() => {    
            this.handleLoader();
            this.handleShowModalError();
            return
      }, 1);
    })

  }

  testTestCases(){
    var divs = []
    var codes = [];
    codes = this.codesToTest();
      for(let i = 0; i<this.state.testCases.length;i++){
          //codeReady = this.replaceInput( this.state.testCases[i].input)
          console.log("Este es el codigo")
          console.log(codes[i])
          let codeToTest = {
            language:this.state.languageCode,
            script:codes[i]
          };
          
          this.testingResults(codeToTest,divs,i)
          
          
        
        }
  }

  sendCodeGoodPractices(){

    let codeToExecute = {
      language:this.state.languageCode,
      script: this.state.code
    };
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "@crossorigin",
      }
    };
    /*ACA SE PONE LO DE LAS BUENAS PRACTICAS*/
    Axios.post('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/solutions/analyze',codeToExecute,axiosConfig)
          .then((res) => {
            console.log("RESPONSE RECEIVED: ", res);
            console.log(res.data.verifyIndentation)
            console.log(res.data.invalidVariables === "")
            console.log(res.data.detectOrganization === "Tu codigo está bien organizado, con los comentarios de ENTRADA, PROCESAMIENTO y SALIDA")
            console.log(res.data.verifyIndentation === "Cumples con el porcentaje de indentación")
            console.log(res.data.verifyIndentation)

            console.log(res.data.functionComments === "La definición de tus funciones están bien comentadas")
            
            this.setState({type:3,message: 
                     <div>
                           <p><strong>Funciones comentadas:</strong> {res.data.functionComments}  
                                {res.data.functionComments === "Todas tus funciones deben estar comentadas con su entrada, salida y descripción" &&
                                                            <p>
                                                                <br/>
                                                                <p><strong>Formato:</strong> </p>

                                                                <p><strong>#entrada <br/> #salida <br/> #descripcion</strong><br/> *Inserte funcion</p>

                                                            </p>
                                                        
                                 }
                                                      
                                                      
                                                      
                            </p>
                            {res.data.invalidVariables === "" && 
                                       <p><strong>Variables no representativas:</strong> No se encuentran variables no representativas</p>
                            }
                            {res.data.invalidVariables !== "" &&
                                        <p><strong>Variables no representativas:</strong> <strong> <font color="red">{res.data.invalidVariables}</font> </strong>  </p>
                            }
                                                      
                            {res.data.verifyIndentation !== "Cumples con el porcentaje de indentación" &&
                               <p><strong>Identación:</strong> {res.data.verifyIndentation}

                                        <br/> Tip: Compactar el codigo (reducir el numero de lineas utilizadas)

                                </p>
                                                        
                            }
                            {res.data.verifyIndentation === "Cumples con el porcentaje de indentación" &&
                                    <p><strong>Identación:</strong> {res.data.verifyIndentation} 
                                    </p>

                            }
                                        

                            <p><strong>Organización:</strong> {res.data.detectOrganization} 
                                {res.data.detectOrganization === "Debes comentar la organización de tu codigo (ENTRADA, PROCESAMIENTO y SALIDA" &&
                                      <p>
                                              <br/>
                                              <p><strong>Formato:</strong> </p>

                                              <p><strong>#ENTRADA</strong> </p>

                                              <p><strong>#PROCESAMIENTO</strong> </p>
                                                                
                                              <p><strong>#SALIDA</strong> </p>
                                      </p>
                                                        
                               }
                                                      
                             </p>
                   </div>
          })

          setTimeout(() => {    
                  this.handleShowModalError();
          }, 1);
                              
                               
         })
         .catch((err) => {
           console.log("AXIOS ERROR: ", err);
           this.setState({type: 1, message: "No se ha podido revisar las buenas practicas de la programacion, intente nuevamente porfavor para la retroalimentacion"})

            setTimeout(() => {    
                      this.handleLoader();
                      this.handleShowModalError();
         }, 1);
       })
                                    
                      

  }

  
  sendCodeRevision(){
    console.log(this.state.code)
    var codeReady;
    console.log("estas son las variables")
    console.log(this.state.code)
    console.log(this.state.languageEditor)
    if(this.state.code.length === 0 || this.state.code === null){

      this.handleLoader();
      this.setState({type:1,message: "No se encuentra codigo en el editor para poder probar los casos de prueba"})
      setTimeout(() => {    
            this.handleShowModalError();
      }, 5);
    }
    else if(this.state.languageEditor === ""){

      this.handleLoader();
      this.setState({type:1,message: "Se debe seleccionar un lenguaje de programacion antes de probar los casos de prueba"})
      setTimeout(() => {    
            this.handleShowModalError();
      }, 5);

    }

    else{
      codeReady = this.replaceInput( this.state.testCases[0].input)
      //No se esta usando el nombre de funcion que esta puesto en el enunciado
      console.log(codeReady)
      if(codeReady === "bad format"){
          this.setState({type: 0,message: "No esta utilizando el formato propuesto, puede consularlo en el icono:  "})
          setTimeout(() => {    
                this.handleLoader();
                this.handleShowModalError();
          }, 1);
      }
      else if(codeReady === "no function name seen"){
        this.setState({type: 1, message: "No esta utilizando el nombre de funcion propuesto, porfavor utilicelo"})
        setTimeout(() => {    
              this.handleLoader();
              this.handleShowModalError();
        }, 1);

      }

      else{
              let codeToExecute = {
                language:this.state.languageCode,
                script: codeReady
              };
              let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "@crossorigin",
                }
              };

              Axios.post('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/solutions/execute',codeToExecute,axiosConfig)
              .then((response) => {
                  console.log("RESPONSE RECEIVED: ", response);
                  if(response.data.stderr !== ""){
                    this.handleLoader();
                    this.setState({reply: response.data.stderr, type:1,
                                    message: "Se ha encontrado errores en su codigo, porfavor resuelvalos antes de enviar su codigo a revision"})
                    setTimeout(() => {    
                      this.handleShowModalError();
                    }, 10);
                  }
                  else{          
                      this.testTestCases();

                  }
              })
              .catch((err) => {
                  console.log("AXIOS ERROR: ", err);
                  this.handleLoader();
                    this.setState({type:1,message: "No se pudo mandar su codigo a revision, porfavor intente nuevamente"})
                    setTimeout(() => {    
                      this.handleShowModalError();
                    }, 1);
              })
      }
    }

    
  }


  componentWillMount () {
    console.log(this.state.exercise)
    if(this.state.exercise === undefined){
        console.log(this.props.history);
        this.props.history.goBack();
    }
    else{
        var testcases;

        var timer = new Date();
        var initialTime = timer.getTime();
        console.log("se supone que este es el initial time")
        console.log(initialTime)
        Axios.get('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/exercises/'+this.state.exercise.viewAExercise.id+'/testcases')
        .then(response => {
              console.log("soy los testcases")
              testcases = response.data
              console.log(testcases)
              this.setState({
                idExercise: this.state.exercise.viewAExercise.id,  
                title:this.state.exercise.viewAExercise.title,
                description: this.state.exercise.viewAExercise.description,
                functionName: this.state.exercise.viewAExercise.functionName,
                code: "",
                testCases: testcases,
                isSafeToRender: true,
                initialTime
      
              })
        })
        .catch(function(error) {
            this.setState({type:1,message: "No se pudo extraer los casos de prueba para este enunciado, intente mas tarde"})
            setTimeout(() => {    
                  this.handleShowModalError();
            }, 1);
        })
       
    }
  }
  selectLanguages = (e, { value}) => {
    var actualLenguage;
    for(let i = 0; i<this.state.languageOptions.length; i++){
      if(this.state.languageOptions[i].value === value){
       actualLenguage = this.state.languageOptions[i].key; 
      }
    }
    switch(actualLenguage) {
      case "c":
          this.setState({ languageEditor: value, 
                          languageCode: actualLenguage,
                          format: <div>
                                      <p><strong>type</strong> resultado = <strong>{this.state.functionName}();</strong></p>
                                      <p><strong>printf</strong>("%...", resultado);</p>
                                 </div> 
                          })
          break;
          
      case "python": 
          this.setState({ languageEditor: value, 
                          languageCode: actualLenguage,
                          format: <div>
                                    <p>resultado = <strong>{this.state.functionName}()</strong></p>
                                    <p><strong>print</strong>(resultado)                 </p>
                                 </div> 
                          })       
          break;   
      case "java":
          this.setState({ languageEditor: value, 
                          languageCode: actualLenguage,
                          format: <div>
                                      <p><strong>type</strong>  resultado =  <strong>{this.state.functionName}();</strong></p>
                                      <p><strong>System.out.println</strong>(resultado);</p>
                                  </div> 
                          })    
          break;
      default: break;  
    }
   

  }

  updateCode(event){
    this.setState({ code: event })
  }
  popoverHoverFocus(){
    if(this.state.format !== null ){
      return <Popover id="popover-trigger-focus">
         {this.state.format}
       </Popover>
    }
    else{
      return <Popover id="popover-trigger-focus">
        
       </Popover>
    }
    
  }


  render() {
    let { title, description,functionName} = this.state
        return (
          <div>
             <Modal show={this.state.popUpAreYouSure}
                            bsSize="small">  

                                  <Modal.Header >
                                    <Modal.Title>Precaución</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body >
                                        <p >
                                          Esta seguro de enviar esta solucion? 
                                        </p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button  floated= {'left'} 
                                                  color='red' 
                                                  type='Negation'
                                                  onClick= {this.handleHideAreYouSure}
                                                  onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                  >
                                                  No
                                        </Button>
                                          <Button  floated= {'right'} 
                                                  color='blue' 
                                                  type='Positive'
                                                  onClick={() => {
                                                    this.handleLoader();      
                                                    setTimeout(() => {                                                                                                       
                                                         this.sendSolution();
                                                    }, 5); 
                                                  }}
                                                  onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                  >
                                                  Si
                                          </Button>
                                    </Modal.Footer>

            </Modal>


            {this.state.isSafeToRender &&
                  <Segment>

                      <Dimmer active={this.state.loader} inverted>
                        <Loader inverted content='Cargando...' />
                      </Dimmer>
                      
                


                  <MuiThemeProvider muiTheme={ThemeDefault}>  
                      <Paper style={background.bigFrame}>

                        <Form style={{textAlign:"center"}}>
                              <h1>Area de practica</h1>

                              {!this.state.showDetailsExercise &&
                                  <div className= "Button">            
                                        <Button primary={true} 
                                                type='Back'
                                                onClick={this.handleShowDetailsExercise}
                                                onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                >

                                                  Mostrar Enunciado

                                        </Button>
                                  </div>
                              }
                              {this.state.showDetailsExercise && 
                                  <div style ={{width: '40%', position: 'relative', left:'30%'}}>
                                        <Form.Field>
                                          <label>Titulo del enunciado</label>
                                              <input  placeholder='Title' 
                                                      readOnly={true}
                                                      value= {title} 
                                                      style={{  textAlign:"center",border: "1px solid lightblue"}}
                                                      onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                  />
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Nombre de la funcion principal</label>
                                              <input  placeholder='Function' 
                                                      readOnly={true}
                                                      value= {functionName} 
                                                      style={{  textAlign:"center",border: "1px solid lightblue"}}
                                                      onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                  />
                                          </Form.Field>
                                        <label>Descripcion</label>
                                      
                                          <TextArea placeholder='Descripcion'
                                                    style={background.textAreaStyle}  
                                                    value= {description} 
                                                    readOnly={true}
                                                    onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                  />  
                                </div>
                                }
                                {this.state.showDetailsExercise &&
                                    <div className= "Button">
                                        <div style={{padding:15}}></div>
                                        <Button primary={true} 
                                                type='Back'
                                                onClick={this.handleHideDetailsExercise}
                                                onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                >

                                                Ocultar enunciado

                                        </Button>
                                    </div>
                                }

                  
                              
                              <Divider />
                          </Form>
                          
                          <Row className="show-grid" style={{position:"relative", left: "6%"}}>
                                <Col  xs={5} sm={5} md={2} style={{position:"relative", left: "5%"}}>
                                  <label  style={{textAlign:"center"}}>Lenguaje:</label>

                                  <Dropdown placeholder='Seleccionar...' 
                                            fluid selection options={this.state.languageOptions} 
                                            onChange = {this.selectLanguages}
                                            onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                            />
                  
                              </Col>
                              <Col  xs={7} sm={7} md={5} lg={3} style={{position:"relative", left: "10%"}}>
                                  <label  style={{textAlign:"center"}}>Formato de envio:</label>
                                  <Row className="show-grid" style={{position:"relative", left: "17%"}}>
                                        <div style={{padding:2}}></div>
                                        <OverlayTrigger
                                          trigger={['hover', 'focus']}
                                          placement="bottom"
                                          overlay={this.popoverHoverFocus()}
                                          >
                                          <Icon name='help circle' color='blue' size='big' />
                                        </OverlayTrigger>

                                    </Row>

                  
                              </Col>

                          </Row>
                          <Row className="show-grid" style={{position:"relative", left: "5%"}}>
                          
                            <Col  xs={12} sm={12} md={6} lg={5}>
                                  <label>Editor:</label>
                                  <AceEditor
                                        //style = {background.textAreaStyle2}
                                        mode={this.state.languageEditor}
                                        theme={'monokai'}
                                        ref = "editor"
                                        name="blah2"
                                        fontSize={17}
                                        showPrintMargin={true}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        value={this.state.code}
                                        onChange={this.updateCode}
                                        setOptions={{
                                          enableBasicAutocompletion: false,
                                          enableLiveAutocompletion: false,
                                          enableSnippets: false,
                                          showLineNumbers: true,
                                          tabSize: 2,
                                        }}/>
                  
                            </Col>
                            <Col  xs={5} sm={5} md={4} lg={1} >
                                <Row className="show-grid">
                                <div style={{padding:30}}></div>
                                      <Button   primary={true} 
                                                type='Back'
                                                onClick={() => {
                                                  this.setState({reply:""})
                                                  this.handleLoader();
                                                  setTimeout(() => {                                                        
                                                    this.executeCode()
                                                  }, 1);
                                                }}
                                                onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                disabled= {this.state.disableButton}>
                                                
                                                Ejecutar codigo
                                        </Button>
                                </Row>
                                

                                <Row className="show-grid" >

                                <div style={{padding:30}}></div>
                              
                                      <Button primary={true} type='Send'
                                              onClick={() => {
                                                this.setState({reply:""})
                                                setTimeout(() => {
                                                    this.handleLoader();                                   
                                                    this.sendCodeRevision();
                                                }, 1);
                                              
                                              }}
                                              onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                              disabled= {this.state.disableButton}
                                              >
                                                Probar casos
                                        </Button>
                                </Row>
                                <Row className="show-grid">

                                <div style={{padding:30}}></div>
                              
                                      <Button primary={true} type='Send'
                                              onClick={() => {
                                                this.setState({reply:""})
                                                setTimeout(() => {                                                  
                                                    this.handleShowAreYouSure()
                                                }, 5);
                                              }}
                                              onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}
                                              disabled= {this.state.disableButton}

                                              >
                                                Enviar solución
                                        </Button>
                                </Row>


                            </Col>
                            <Col  xs={12} sm={12} md={6} lg={5}>
                            <label>Resultado:</label>
                                    <TextArea   
                                                value= {this.state.reply} 
                                                ref = "result"
                                                readOnly= {true}
                                                style={background.textAreaStyle2}  
                                                autoHeight= {true}
                                                onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                                />  
                            </Col>
                          
                            </Row>
                            <Drawer width={"22%"} openSecondary={true} open={this.state.sideMenu} >
                                        <AppBar style= {{textAlign:'center'}}title="Probando Casos" />
                                              {this.state.disableButton &&
                                                  <div>
                                                    {this.state.renderedThings.map((result) =>(
                                                      <div key = {this.keys++} style={{padding:10}}> {result}</div>
                                                    ))}
                                                    {this.state.showPerformance &&
                                                          <div>
                                                            <div style={{padding:15}}></div>
                                                            <p style={{color:"white",position:'relative', left:"20%"}} >
                                                                  Resultado: {this.state.successCases}/ {this.state.testCases.length} pruebas exitosas
                                                                  
                                                            </p>
                                                                 

                                                              
                                                          </div>
                                                      
                                                    }
                                                  </div>
                                              }
        
                                </Drawer>
                            
                         
                

                          <Modal show={this.state.modalCongrats}
                              bsSize="small">  

                                    <Modal.Header >
                                      <Modal.Title style= {{textAlign: "center"}}>Exito!</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body >
                                          <p style= {{textAlign:'center'}} >
                                          Ha realizado sadisfactoriamente el enunciado
                                          </p>
                                      </Modal.Body>
                                      <Modal.Footer>
                                          <Link to={{
                                                  pathname: '/exercises_student'
                                              }}>
                                                <Button  fluid= {true}
                                                        color='blue' 
                                                        type='Positive'
                                                        >
                                                        Volver enunciados publicados
                                                </Button>
                                              </Link>
                                            
                                      </Modal.Footer>

                          </Modal>
                          <Modal show={this.state.modalError}
                              bsSize="small">  

                                    <Modal.Header >
                                      <Modal.Title style= {{textAlign: "center"}}>
                                      {(this.state.type === 0 || this.state.type === 1) &&
                                      <p> Error en envio!</p>
                                      }
                                      {this.state.type === 2 &&
                                      <p> Felicitaciones!</p>
                                      }
                                      {this.state.type === 3 &&
                                       <p> Buenas practicas de la programación</p>
                                      }
                                      
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body >
                                          {this.state.type === 3 &&
                                            this.state.message                                        
                                          }
                                          {this.state.type !== 3 &&                                          
                                            <p style= {{textAlign:'center'}} >
                                              {this.state.message} {this.state.type === 0 && <Icon name='help circle' color='blue' size='big' />}
                                            </p>
                                          }
                                      </Modal.Body>
                                      <Modal.Footer>                                        
                                                <Button  style={{position:'relative', right: '35%'}}
                                                        color='blue' 
                                                        type='Positive'
                                                        onClick={() => {
                                                          this.handleHideModalError();
                                                          if(this.state.type === 2 || this.state.type === 3){
                                                            setTimeout(() => {                                                        
                                                              this.handleSideBar()
                                                              this.setState({disableButton:false,renderedThings: [], 
                                                                itemsRendered: 0, results: null, successCases: 0,
                                                                showPerformance:false})
                                                            }, 5);
                                                          }
                                                        }}
                                                        >
                                                        OK
                                                </Button>
                                      </Modal.Footer>

                          </Modal>
                      </Paper>
                      
                    

                  </MuiThemeProvider>
        
              
              </Segment>

            }


          </div>

    );
        
    }
  }
  
  export default Solution;