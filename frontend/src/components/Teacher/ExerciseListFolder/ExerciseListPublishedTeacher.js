
import React, { Component } from 'react';
import ExerciseIterator from './ExerciseIterator'
import Axios from 'axios'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ThemeDefault from '../ThemeList';
import Paper from 'material-ui/Paper';
import { Form,Divider } from 'semantic-ui-react'
import ReactPaginate from 'react-paginate';

const background = {
    bigFrame:{
      padding: 30,
      position:'relative'
    }



}
class ExerciseListPublishedTeacher extends Component {
    constructor(props) {
      super(props);
      this.state = {
        publishedItems: [],
        currentPage:0,
        pageCount:0,
        offers :{},
        filterOffers: {},
        currentPageItems: [],
        jsons: [{
                    "title": "Chela",
                    "description": "ojala nunca",
                    "published": true,"id":451
                },
                {
                    "title": "jugo",
                    "description": "ojala nuncax4 ",
                    "published": true, "id":452

                },
                {
                    "title": "vidrio",
                    "description": "ojala nuncax2",
                    "published": true, "id":464

                },
                {
                    "title": "jugo",
                    "description": "ojala nuncax4 ",
                    "published": true, "id":478
                },
                  {
                    "title": "vidrio",
                    "description": "ojala nuncax2",
                    "published": true, "id":479
                },
                {
                  "title": "vidrio",
                  "description": "ojala nuncax2",
                  "published": true, "id":480

                },
                  {
                    "title": "Chela",
                    "description": "ojala nunca",
                    "published": true, "id":490
                },
                {
                    "title": "jugo",
                    "description": "ojala nuncax4 ",
                    "published": true, "id":495

                },
                {
                    "title": "vidrio",
                    "description": "ojala nuncax2",
                    "published": true, "id":496

                },
                {
                    "title": "jugo",
                    "description": "ojala nuncax4 ",
                    "published": true, "id":498
                },
                  {
                    "title": "vidrio",
                    "description": "ojala nuncax2",
                    "published": true, "id":500
                },
                {
                  "title": "vidrio",
                  "description": "ojala nuncax2",
                  "published": true, "id":501

                  },
                  {
                    "title": "Chela",
                    "description": "ojala nunca",
                    "published": true, "id":502
                },
                {
                    "title": "jugo",
                    "description": "ojala nuncax4 ",
                    "published": true, "id":503

                },
                {
                    "title": "vidrio",
                    "description": "ojala nuncax2",
                    "published": true, "id":504

                }
            ],
            
        }
      this.getExercises = this.getExercises.bind(this);
      this.getPagination = this.getPagination.bind(this);
      this.updateData = this.updateData.bind(this);
      this.handlePageClick = this.handlePageClick.bind(this);
      this.isValid = this.isValid.bind(this);
      this.viewExercise = this.viewExercise.bind(this);

    }
    getExercises(){
      var _this = this;

      //GET formal es con id del usuario
     //Axios.get('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/exercises/'+this.props.id.toString()+'/published')
     //Get por ahora es con id 1 
     Axios.get('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/exercises/'+this.props.idUser+'/published')
      .then(response => {
            console.log("soy los ejercicios")
            console.log(response.data)
            _this.setState({ publishedItems: response.data });
            setTimeout(() => {
              _this.getPagination(null)
            }, 5);
            })
      .catch(function(error) {
           console.log(error)
      })
    }
    componentWillMount () {
      this.getExercises();

    }
    viewExercise(exercise){
      var testcases;
      Axios.get('http://206.189.220.236:8080/backend-0.0.1-SNAPSHOT/exercises/'+exercise.id+'/testcases')
      .then(response => {
            console.log("soy los testcases")
            testcases = response.data
            this.props.history.push('view_exercise_teacher',{ viewAExercise: exercise, getTestCases: testcases })
      })
      .catch(function(error) {
           console.log(error)
      })
    }
  
    isValid(str){
      //Si hay alguno de estos caracteres, retornar falso
      return /[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(str);
    }
  
    filterList(event) {
      let obj = this.state.publishedItems;
      let filteredArray = [];
      Object.keys(obj).forEach(function (key) {
        filteredArray.push(obj[key]);
      });
      
      filteredArray = filteredArray.filter((item) => {
        if(this.isValid(event.target.value)){
          var cons = '\\'.concat(event.target.value);
          return  item.title.search(cons) !== -1;
        }
        else{
          return item.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1;

        }
      
      });
      this.getPagination(filteredArray);
      
    }
    getPagination(data){
      let _this = this;
      var keys;
      if(data === null){
        keys = Object.keys(this.state.publishedItems)
        //keys = Object.keys(this.state.jsons);
      }
      else{
       // keys = this.getKeys(data)
       keys = Object.keys(data);

      }
       let pageLength = 8;
       let pageCount = Math.ceil(keys.length / pageLength);
       let pages = [];
       let query;
      // this.setState({pageCount:pageCount});
       if(data == null){
        for (let i = 0; i < pageCount; i++) {
          let key = keys[i * pageLength];
             if(this.state.publishedItems.length>=1) {
                 query = this.state.publishedItems.slice(key, (i+1)*pageLength);
                 pages.push(query);
             }
         }
       }
       else{
        for (let i = 0; i < pageCount; i++) {
          let key = keys[i * pageLength];
             if(data.length >=1) {
                 query = data.slice(key, (i+1)*pageLength);
                 pages.push(query);
             }
         }
       }
       
       console.log("SOy el query")
       console.log(query)
   
       _this.setState({offers: pages, pageCount: pageCount, filterOffers: pages}, this.updateData);
   
   
    }
    updateData(){
      let {filterOffers} = this.state;
      var currentPage = this.state.currentPage;
      
     if(currentPage >= this.state.pageCount){
          currentPage = this.state.pageCount-1;
      }
      let currentDataNow = {};
       for (let i = 0; i < filterOffers.length; i++) {
         if(currentPage === i){
            currentDataNow = filterOffers[i];
         }
       
       }
       this.setState({
        currentPageItems: currentDataNow
        });
    }

    handlePageClick = (data) => {
      let selected = data.selected;
      this.setState({currentPage:selected},this.updateData);
    }
   
  
    
    
    render() {

      return (
        <MuiThemeProvider muiTheme={ThemeDefault}>  
           <Paper style={background.bigFrame}>
               <Form style={{textAlign:"center"}} >

            
                    <h1>Enunciados publicados</h1>
                    <div className="tableElm" >
                        <Form.Field>
                            <label>Campo de busqueda</label>
                            <input  placeholder='Buscar ...' 
                                    onChange={this.filterList.bind(this)} 
                                    style={{width: 300}}   
                                    onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                    />
                        </Form.Field>
                    </div>
                    <Divider/>
                    <ExerciseIterator 
                                      published= {true} 
                                      /*exercises = { this.state.unpublishedItems }*/
                                      exercises = { this.state.currentPageItems } 
                                       viewExercise = {this.viewExercise}
                                       />

                    <div className="commentBox" id="react-paginate">
                          <ReactPaginate previousLabel={"Anterior"}
                                      nextLabel={"Siguiente"}
                                      breakLabel={<a href="">...</a>}
                                      breakClassName={"break-me"}
                                      pageCount={this.state.pageCount}
                                      marginPagesDisplayed={2}
                                      pageRangeDisplayed={3}
                                      onPageChange={this.handlePageClick}
                                      containerClassName={"pagination"}
                                      subContainerClassName={"pages pagination"}
                                      activeClassName={"active"} 
                                      onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}

                                      />
                        </div>

                  </Form>

        </Paper>

      </MuiThemeProvider>

      );
      
    }
  }
  /*
 }*/
  export default ExerciseListPublishedTeacher;
  