export default 
    [
      {
        title: 'Dashboard',
        path: '/dashboard_admin',
        exact: true,
        component: "DashboardAdmin",
        rol:"admin",
        enable:true,
      },
      {
        title: 'Cursos',
        path: '/class_panel',
        exact: true,
        component:"EditExerciseForm",
        rol:"admin",
        enable:true,
      },
      {
        title: 'Carreras',
        path: '/career_panel',
        exact: true,
        component:"EditExerciseForm",
        rol:"admin",
        enable:true,
      },
      {
        title: 'Usuarios',
        path: '/user_panel',
        exact: true,
        component:"EditExerciseForm",
        rol:"admin",
        enable:true,
      },
      {
        title: 'Enunciados',
        path: '/exercises_student',
        exact: true,
        component:"ExerciseListStudent",
        rol:"student",
        enable:true,
      },
      {
        title: 'Solucion',
        path: '/solution',
        exact: true,
        component:"Solution",
        rol:"student",
        enable:false,
      },
      {
        title: 'Dashboard',
        path: '/dashboard_teacher',
        exact: true,
        component:"HomeTeacher",
        rol:"teacher",
        enable:true,
      },
     
      {
        title: 'Crear Enunciado',
        path: '/create_exercise',
        exact: true,
        component:"CreateExerciseForm",
        rol:"teacher",
        enable:true,
      },
      {
        title: 'Editar Enunciado',
        path: '/edit_exercise',
        exact: true,
        component:"EditExerciseForm",
        rol:"teacher",
        enable:false,
      },
      {
        title: 'Mis Enunciados',
        path: '/exercises_teacher',
        exact: true,
        component:"ExerciseListTeacher",
        rol:"teacher",
        enable:true,
        routes:[
          {
            title: 'Publicados',
            path: '/published_exercises_teacher',
            exact: true,
            component:"ExerciseListPublishedTeacher",
            rol:"teacher",
            enable:true,
          },
          {
            title: 'No Publicados',
            path: '/unpublished_exercises_teacher',
            exact: true,
            component:"ExerciseItemUnpublishedTeacher",
            rol:"teacher",
            enable:true,
          },
        ]
      },
      

     
      
    ]
  ;
  