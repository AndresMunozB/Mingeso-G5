import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { Switch, Route,Redirect} from 'react-router-dom';


//Admin
import Dashboard from '../Admin/Dashboard'
import ClassPanel from '../Admin/ClassPanel'
import CareerPanel from '../Admin/CareerPanel'
import UserPanel from '../Admin/UserPanel'

//Student
import Solution from '../Student/FormFolder/Solution';
import ViewExerciseFormStudent from '../Student/FormFolder/ViewExerciseFormStudent'

import ExerciseListStudent from '../Student/ExerciseListFolder/ExerciseListStudent'

//Teacher

import CreateExerciseForm from '../Teacher/FormFolder/CreateExerciseForm'
import AddTestCasesForm from '../Teacher/FormFolder/AddTestCasesForm'
import EditExerciseForm from '../Teacher/FormFolder/EditExerciseForm'
import ViewExerciseFormTeacher from '../Teacher/FormFolder/ViewExerciseFormTeacher'
import ExerciseListPublishedTeacher from '../Teacher/ExerciseListFolder/ExerciseListPublishedTeacher'
import ExerciseItemUnpublishedTeacher from '../Teacher/ExerciseListFolder/ExerciseListUnpublishedTeacher'


//Admin y Teacher





//Home (no logeado)
import Home from '../Global/Home'
import NoRegister from '../Global/NoRegister'



class Body extends Component{
    
    
    render(){
        return(
        <div className="Body" >
              
            {this.props.rol === 'student' && 
              <Switch>
                    <Route path='/solution' exact={true} render={props => (<Solution idUser= {this.props.id} {...props} />)}></Route>
                    <Route path='/exercises_student' exact={true} render={props => (<ExerciseListStudent {...props} />)}></Route>            
                    <Route path='/view_exercise_student' exact={true} render={props => (<ViewExerciseFormStudent {...props} />)}></Route>
                    <Redirect to='/exercises_student' from= '/'/>

               </Switch>
        
        
            }

            {this.props.rol === 'teacher' && 
              <Switch>
                    <Route path='/dashboard_teacher' exact={true} render={props => (<Dashboard {...props} />)}></Route>
                    <Route path='/create_exercise' exact={true} render={props => (<CreateExerciseForm idUser= {this.props.id} {...props} />)}></Route>
                    <Route path='/create_exercise_testcases' exact={true} render={props => (<AddTestCasesForm  {...props} />)}></Route>
                    <Route path='/view_exercise_teacher' exact={true} render={props => (<ViewExerciseFormTeacher {...props} />)}></Route>
                    <Route path='/published_exercises_teacher' exact={true} render={props => (<ExerciseListPublishedTeacher idUser= {this.props.id} {...props} />)}></Route>
                    <Route path='/unpublished_exercises_teacher' exact={true} render={props => (<ExerciseItemUnpublishedTeacher idUser= {this.props.id} {...props} />)}></Route>
                    <Route path='/edit_exercise' exact={true} render={props => (<EditExerciseForm {...props} />)}></Route>
                    <Redirect to='/dashboard_teacher' from= '/' />
                    
             </Switch>
        
        
              }

            {this.props.rol === 'admin' && 
              <Switch>
                    <Route path='/dashboard_admin' exact={true} render={props => (<Dashboard {...props} />)}></Route>

                    <Route path='/class_panel' exact={true} render={props => (<ClassPanel {...props} />)}></Route>
                    <Route path='/career_panel' exact={true} render={props => (<CareerPanel {...props} />)}></Route>
                    <Route path='/user_panel' exact={true} render={props => (<UserPanel {...props} />)}></Route>
                    <Redirect to='/dashboard_admin' from= '/' />


            </Switch>
            }
            {this.props.rol === 'none' && 
              <Switch>
                    <Route path='/home' exact={true} render={props => (<Home {...props} />)}></Route>
                    <Redirect to='/home' from= '/' />
            </Switch>
            }
            {this.props.rol === 'noRegister' && 
              <Switch>
                    <Route path='/NoRegister' exact={true} render={props => (<NoRegister {...props} />)}></Route>
                    <Redirect to='/NoRegister' from= '/' />
            </Switch>
            }
        </div>
            

        );
    }
}
Body.propTypes = {
    user: PropTypes.string,
    routes:PropTypes.array.isRequired
}

export default Body;

