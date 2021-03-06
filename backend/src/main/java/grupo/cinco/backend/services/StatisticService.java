package grupo.cinco.backend.services;

import grupo.cinco.backend.entities.Career;
import grupo.cinco.backend.entities.Class;
import grupo.cinco.backend.entities.Statistic;
import grupo.cinco.backend.entities.User;
import grupo.cinco.backend.repositories.CareerRepository;
import grupo.cinco.backend.repositories.ClassRepository;
import grupo.cinco.backend.repositories.StatisticRepository;
import grupo.cinco.backend.repositories.UserRepository;
import grupo.cinco.backend.utils.DTO2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/statistics")
public class StatisticService {

    @Autowired
    private StatisticRepository statisticRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CareerRepository careerRepository;

    @Autowired
    private ClassRepository classRepository;
    
    @RequestMapping(value = "/class/{id}", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    public Iterable<Statistic> classs(@PathVariable("id") Integer id,@RequestBody DTO2 resource) {
        Date desde = Statistic.toDate(resource.getDesde());
        Date hasta = Statistic.toDate(resource.getHasta());
        Class clase = classRepository.findById(id).get();
        Iterable<Statistic> statistics = statisticRepository.findStatisticsByDateBetweenAndUser_Clase(desde,hasta,clase);
        statistics = Statistic.groupByDate(statistics,desde,hasta);
        return statistics;
    }
    @RequestMapping(value = "/user/{id}", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    public Iterable<Statistic> user(@PathVariable("id") Integer id,@RequestBody DTO2 resource) {
        Date desde = Statistic.toDate(resource.getDesde());
        Date hasta = Statistic.toDate(resource.getHasta());
        User user = userRepository.findById(id).get();
        Iterable<Statistic> statistics = statisticRepository.findStatisticsByDateBetweenAndUser(desde,hasta,user);
        statistics = Statistic.groupByDate(statistics,desde,hasta);
        return statistics;
    }
    @RequestMapping(value = "/career/{id}", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    public Iterable<Statistic> career(@PathVariable("id") Integer id,@RequestBody DTO2 resource) {
        Date desde = Statistic.toDate(resource.getDesde());
        Date hasta = Statistic.toDate(resource.getHasta());
        Career career = careerRepository.findById(id).get();
        Iterable<Statistic> statistics = statisticRepository.findStatisticsByDateBetweenAndUser_Career( desde,hasta,career);
        statistics = Statistic.groupByDate(statistics,desde,hasta);
        return statistics;
    }

    @RequestMapping(value = "/coordination", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    public Iterable<Statistic> coordination(@RequestBody DTO2 resource) {
        Date desde = Statistic.toDate(resource.getDesde());
        Date hasta = Statistic.toDate(resource.getHasta());
        Iterable<Statistic> statistics = statisticRepository.findStatisticsByDateBetween( desde,hasta);
        statistics = Statistic.groupByDate(statistics,desde,hasta);
        return statistics;
    }

    @RequestMapping(value = "/countTime", method = RequestMethod.GET)
    @ResponseBody
    public long countTime()
    {
        long totalTime = 0;
        Iterable<Statistic> statistics = statisticRepository.findAll();
        Iterator statisticsIterator = statistics.iterator();
        while(statisticsIterator.hasNext())
        {
            Statistic stat = (Statistic) statisticsIterator.next();
            totalTime += stat.getSpendTime();
        }
        return totalTime/3600;
    }

}
