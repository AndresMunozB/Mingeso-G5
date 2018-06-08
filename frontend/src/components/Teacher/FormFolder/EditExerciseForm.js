import React ,{Component} from 'react';
import { Form, TextArea,Button,Divider} from 'semantic-ui-react'
import Axios from 'axios'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ThemeDefault from '../ThemeList';
import Paper from 'material-ui/Paper';
import {Link} from 'react-router-dom';
import {Modal} from 'react-bootstrap'
const background = {
    mediumFrame:{
      width: 600,
      height: 660,
      padding: 30,
      position:'relative',
      left:'30%'
    },
    textAreaStyle:{
        minHeight: 400,
        maxHeight: 400

    }
}
class EditExerciseForm extends Component{
       constructor(props) {
        super(props);
        this.state = {
          exercise: props.location.state,
          id:null,
          title: null,
          description: null,
          published: null,
          modalPublish:false,
          isSafeToRender: false


        }
        this.editExercise = this.editExercise.bind(this);
        this.publishExercise = this.publishExercise.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.emptyFields = this.emptyFields.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);

      }

      componentWillMount () {
        console.log(this.state.exercise)
        if(this.state.exercise === undefined){
            console.log(this.props.history);
            this.props.history.goBack();
        }
        else{
            this.setState({  
              id: this.state.exercise.editAExercise.id,
              title:this.state.exercise.editAExercise.title,
              description: this.state.exercise.editAExercise.description,
              published: this.state.exercise.editAExercise.published,
              isSafeToRender: true

            })
        }
      }
      

        handleShow() {
          this.setState({ modalPublish: true });
        }

        handleHide() {
          this.setState({ modalPublish: false });
        }


      editExercise(){
        if(this.state.title !== undefined && this.state.description !== undefined){

              if(this.state.title.length !== 0 &&
                this.state.description.length !== 0){          
                  let jsonAgregar = {
                    title:this.state.title,
                    description: this.state.description
                  }
                  
                  Axios.put('http://165.227.189.25:8080/backend-0.0.1-SNAPSHOT/exercises/'+this.state.id+'/edit', jsonAgregar)
                  .then((res) => {
                    console.log("RESPONSE RECEIVED: ", res);
                      alert('Se ha modificado sadisfactoriamente el enunciado');


                  })
                  .catch((err) => {
                    console.log("AXIOS ERROR: ", err);

                  })
              }
              else{
                alert('Debes completar todos los campos');
              }
          }
        else{
            alert('Debes completar todos los campos');
        }
      }


      publishExercise =  () => {
        let jsonAgregarPublish = {
          published:true
        }
        let jsonAgregarEdit = {
          title:this.state.title,
          description: this.state.description
        }
        if(this.state.title.length !== 0 &&
          this.state.description.length !== 0){  
            Axios.put('http://165.227.189.25:8080/backend-0.0.1-SNAPSHOT/exercises/'+this.state.id+'/edit', jsonAgregarEdit)
            .then((res) => {
              console.log("RESPONSE RECEIVED: ", res);
            })
            .catch((err) => {
              console.log("AXIOS ERROR: ", err);
            })
    
    
            Axios.put('http://165.227.189.25:8080/backend-0.0.1-SNAPSHOT/exercises/'+this.state.id+'/publish',jsonAgregarPublish)
            .then((res) => {
              console.log("RESPONSE RECEIVED: ", res);
              this.props.history.push('/published_exercises_teacher')
    
            })
            .catch((err) => {
              console.log("AXIOS ERROR: ", err);
            });

        }
        else{
          this.handleHide();
          alert("Porfavor complete los campos antes de publicar algo")

        }
       
       
      }

      updateTitle(event){
          console.log(this.state.title)
          this.setState({ title: event.target.value })
      }
      updateDescription(event){
          console.log(this.state.description)
          this.setState({ description: event.target.value })

      }

      emptyFields () {
        this.setState({ 
          title: "",
          description: ""
        })
      }
    
    
      render() {
        return (
          <div className= 'WholeComponent'>

          {this.state.isSafeToRender &&
              <div className = 'SafeComponent'>

                  <div className= "Form">
                  
                      <MuiThemeProvider muiTheme={ThemeDefault}>  
                          <Paper style={background.mediumFrame}>

                              <Form style={{textAlign:"center"}}>
                                  <h1>Edicion Enunciado</h1>
                                  <Form.Field>
                                    <label>Titulo del enunciado</label>
                                    <input  placeholder='Title' 
                                            value= {this.state.title} 
                                            onChange={this.updateTitle} 
                                            />
                                  </Form.Field>

                                  <label>Descripcion</label>
                                  <TextArea   placeholder='Descripcion'
                                              style={background.textAreaStyle}
                                              value= {this.state.description} 
                                              onChange={this.updateDescription}
                                              />  

                                  <Divider />

                                  <Button  floated= {'left'} 
                                          color='red' 
                                          type='Empty'
                                          onClick={this.emptyFields}
                                          >

                                          Vaciar
                                </Button>
                                <Link to={{
                                      pathname: '/unpublished_exercises_teacher'
                                  }}>
                                      <Button floated= {'left'}
                                              primary={true} 
                                              type='Back'>
                                              Volver
                                      </Button>
                                  </Link>
                                  <Button floated= {'right'} 
                                          primary={true} 
                                          type='Editar'
                                          onClick={this.editExercise}
                                          >
                                          Modificar
                                  </Button>
                                  <Button  floated= {'right'} 
                                            color='yellow' 
                                            type='Publish'
                                            onClick= {this.handleShow}
                                            >
                                            Publicar
                                  </Button>
                              </Form>
                          </Paper>
                        
                        </MuiThemeProvider>
                      
                    </div>
                    <div className= "UsedModals"> 
                         <Modal show={this.state.modalPublish}
                            bsSize="small">  

                                  <Modal.Header >
                                    <Modal.Title>Precaución</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body >
                                        <p >
                                          Esta seguro de publicar este enunciado?
                                        </p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button  floated= {'left'} 
                                                  color='red' 
                                                  type='Negation'
                                                  onClick= {this.handleHide}
                                                  >
                                                  No
                                        </Button>
                                          <Button  floated= {'right'} 
                                                  color='blue' 
                                                  type='Positive'
                                                  onClick={this.publishExercise}
                                                  >
                                                  Si
                                          </Button>
                                    </Modal.Footer>

                        </Modal>
                     </div>

              </div>
          
          
          
          }

             
        </div>
          
          
  
        );
        
      }
}

export default EditExerciseForm;

