import React, { Component } from 'react';
import Header from './components/Global/Header/Header';
import Body from './components/Global/Body';
import firebase from 'firebase';
import routes from './routes'
import Axios from 'axios'


class App extends Component {
  constructor () {
    super()
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.getRol = this.getRol.bind(this);
    this.routesFilter = this.routesFilter.bind(this);
  }
  //DEFAULT POR MIENTRAS
  state = {
    user: null,
    rol: "none",
    routes: routes,
    routesFiltered:[],
    id: -1
  }

  getRol(email){
    var rol;
    var id;
    Axios.get('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/users/'+email+'/role')
        .then( res => {          
            rol = res.data.nameRol;
            Axios.get('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/users/'+email+'/id')
            .then( res => {
                console.log("este es mi rol: ",rol)
                id = res.data
                if(rol === 'admin' || rol === 'teacher' || rol === 'student'){
                  this.routesFilter(rol);
                  this.setState({rol});
                  this.setState({id});
                }
                else{
                  this.setState({rol:'none'})
                }
            })
            .catch((err) => {
              this.setState({rol:'noRegister'})
            })
        })
        .catch((err) => {
          this.setState({rol:'noRegister'})
        })
        
  }

  routesFilter(rol){
    let newRoutesFiltered = this.state.routes.filter(function(route){
      return(route.rol === rol)
    });
    this.setState({
      routesFiltered: newRoutesFiltered,
    });
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
      if(user!==null){
        console.log(user.email);
        this.getRol(user.email);
      }
      else{
        
        this.setState({rol:'none'})
        this.setState({routesFiltered:[]})

      }
    })
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/plus.login')


    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.displayName} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleLogout () {
    firebase.auth().signOut()
      .then(result => console.log('Te has desconectado correctamente'))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }


  
  render() {
    return (
      <div className="App" >
        <Header
        user={this.state.user}
        onAuth={this.handleAuth}
        onLogout={this.handleLogout}
        routes={this.state.routesFiltered}
        />
        <Body id= {this.state.id} rol={this.state.rol} routes={this.state.routesFiltered}/>
      </div>
    
    );
  }
}

export default App;
