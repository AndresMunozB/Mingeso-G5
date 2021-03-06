package grupo.cinco.backend.services;

import grupo.cinco.backend.entities.Class;
import grupo.cinco.backend.entities.Exercise;
import grupo.cinco.backend.entities.Solution;
import grupo.cinco.backend.entities.Statistic;
import grupo.cinco.backend.entities.User;
import grupo.cinco.backend.repositories.*;
import grupo.cinco.backend.utils.Analyzer;
import grupo.cinco.backend.utils.Context;
import grupo.cinco.backend.utils.DTO;
import grupo.cinco.backend.utils.Factory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import java.util.Date;

@CrossOrigin
@RestController
@RequestMapping("/solutions")
public class SolutionService {

    @Autowired
    private SolutionRepository solutionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private StatisticRepository statisticRepository;

    @Autowired
    private ClassRepository classRepository;

    @RequestMapping(value = "/",method = RequestMethod.GET)
    @ResponseBody
    public Iterable<Solution> getAllProducts() {
        return solutionRepository.findAll();
    }

    @RequestMapping(value = "/{id_exercise}/{id_clase}", method = RequestMethod.GET)
    @ResponseBody
    public Iterable<Solution> getAllSolutionsByExercise(@PathVariable("id_exercise") Integer idExercise, @PathVariable("id_clase") Integer idClass)
    {
        Class clase = classRepository.findById(idClass).get();
        return solutionRepository.findAllByExercise_IdAndUserClase(idExercise,clase);
    }

    @RequestMapping(value = "/create/{id_user}/{id_exercise}", method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    public Solution create(@PathVariable("id_user") Integer idUser,@PathVariable("id_exercise") Integer idExercise,@RequestBody DTO resource) {
        User user = userRepository.findById(idUser).get();
        Exercise exercise = exerciseRepository.findById(idExercise).get();
        resource.getSolution().setExercise(exercise);
        resource.getSolution().setUser(user);
        Date date = new Date();
        Statistic statistic = statisticRepository.findStatisticByUserAndDate(user,date);

        if(statistic == null){
            statistic = new Statistic();
            statistic.setSpendTime(resource.getSpendTime());
            statistic.setDate(date);
            statistic.setSolutions(1);
            statistic.setUser(user);
            statisticRepository.save(statistic);
        }
        else{
            statistic.setSpendTime(resource.getSpendTime()+statistic.getSpendTime());
            statistic.setSolutions(statistic.getSolutions()+1);
            statisticRepository.save(statistic);
        }
        return solutionRepository.save(resource.getSolution());
    }


    @RequestMapping(value = "/{id}/edit", method = RequestMethod.PUT)
    @ResponseBody
    public void update(@PathVariable("id") Integer id, @RequestBody Solution resource)
    {
        Solution solution = solutionRepository.findById(id).get();
        solution.setScript(resource.getScript());
        solution.setLanguage(resource.getLanguage());
        solutionRepository.save(solution);
    }

    @DeleteMapping(value = "{id}/delete")
    @ResponseBody
    public void delete(@PathVariable Integer id)
    {
        Solution solution = solutionRepository.findById(id).get();
        solutionRepository.delete(solution);
    }

    @RequestMapping(value = "/execute", method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    public JSONObject execute(@RequestBody Solution resource) {
        JSONParser parser = new JSONParser();
        JSONObject json = null;
        Factory  factory = new Factory();
        Context context = new Context(factory.getStrategy(resource.getLanguage()));
        String output = context.executeCode(resource.getScript());
        try {
            json = (JSONObject) parser.parse(output);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return json;
    }

    @RequestMapping(value = "/analyze", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> analyzeCode(@RequestBody Solution resource)
    {
        Analyzer analyzer = Analyzer.getInstance();
        return analyzer.totalAnalyze(resource.getScript(),resource.getLanguage());
    }

    @RequestMapping(value = "/count", method = RequestMethod.GET)
    @ResponseBody
    public long countSolutions()
    {
        return solutionRepository.count();
    }
}
