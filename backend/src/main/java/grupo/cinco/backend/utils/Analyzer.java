package grupo.cinco.backend.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.lang3.StringUtils;

import static org.apache.commons.lang3.StringUtils.countMatches;
import static org.apache.commons.lang3.StringUtils.deleteWhitespace;
import static org.apache.commons.lang3.StringUtils.substringBefore;

public class Analyzer {

    public boolean verifyIndentation(String code)
    {
        List<String> codeList = Arrays.asList(code.split("\n"));
        int nlines = codeList.size();
        int counterTabs = 0;
        for(String line:codeList)
        {
            if (line.contains("    "))
            {
                counterTabs+=1;
            }
        }

        //Si del código completo, solo el 30% o menos, esta indentando...
        //Se le manda un mensaje de que se preocupe de la indentación.
        if(counterTabs <= 0.3*nlines)
        {
            return false;
        }
        else return true;

    }

    //Este método es para encontrar los comentarios, de ENTRADA, PROCESAMIENTO y SALIDA dentro del codigo.
    public boolean detectOrganization(String code, String language)
    {
        List<String> codeList = Arrays.asList(code.split("\n"));
        boolean answer = false;
        int flagEntry = 0;
        int flagProcess = 0;
        if(language.equals("python"))
        {
            for(String line: codeList)
            {
                if(line.equals("#ENTRADA"))
                {
                    flagEntry = 1;
                }

                else if (flagEntry == 1 && line.equals("#PROCESAMIENTO"))
                {
                    flagProcess = 1;
                }

                else if (flagProcess == 1 && line.equals("#SALIDA"))
                {
                    answer = true;
                }
            }
        }

        else if(language.equals("c") || language.equals("java"))
        {
            for(String line: codeList)
            {
                if(line.equals("//ENTRADA"))
                {
                    flagEntry = 1;
                }

                else if (flagEntry == 1 && line.equals("//PROCESAMIENTO"))
                {
                    flagProcess = 1;
                }

                else if (flagProcess == 1 && line.equals("//SALIDA"))
                {
                    answer = true;
                }
            }
        }

        return answer;
    }

    public List<String> representativeVariables(String code, String language)
    {
        List<String> codeList = Arrays.asList(code.split("\n"));
        boolean answer = false;
        ArrayList<String> invalid = new ArrayList<>();
        if(language.equals("python"))
        {
            for(String line: codeList)
            {
                if(line.contains("="))
                {
                    String variable = substringBefore(deleteWhitespace(line),"=");
                    if(variable.length() < 4)
                    {
                        invalid.add(variable);
                    }
                }
            }
        }
        else
        {
            for(String line:codeList)
            {
                if (line.contains("int ") || line.contains("float ") || line.contains("double ") || line.contains("char ") && line.endsWith(";"))
                {
                    String variable = substringBefore(deleteWhitespace(line.replace("int","").replace(";","")),"=");
                    if(variable.length() < 4)
                    {
                        invalid.add(variable);
                    }
                }
            }
        }
        return invalid;
    }

    //Esta función verifica que cada función definida tenga sus comentarios respectivos (entrada,salida,descripción)
    public boolean functionsComments(String code, String language)
    {
        int totalFunctions = 0;
        int totalEntries = 0;
        int totalDescription = 0;
        int totalOutputs = 0;
        if (language.equals("python"))
        {
            totalFunctions = countMatches(code,"def");
            totalEntries = countMatches(code,"#entrada");
            totalDescription = countMatches(code,"#descripcion");
            totalOutputs = countMatches(code,"#salida");
        }
        else if (language.equals("c"))
        {
            List<String> codeList = Arrays.asList(code.split("\n"));
            totalEntries = countMatches(code,"//entrada");
            totalDescription = countMatches(code,"//descripcion");
            totalOutputs = countMatches(code,"//salida");
            for(String line:codeList)
            {
                if(line.contains("int ") || line.contains("float ") || line.contains("double") || line.contains("char "))
                {
                    //La función al definirla puede terminar en parentesis o en llave
                    //Ej: int suma()(la llave en la otra linea) o int suma(){
                    if (line.endsWith(")") || line.endsWith("}"))
                    {
                        totalFunctions+=1;
                    }
                }
            }
        }

        else if (language.equals("java"))
        {
            int totalPrivated = 0;
            int totalPublic = 0;
            int totalProtected = 0;
            totalPrivated = countMatches(code,"private");
            totalProtected = countMatches(code,"protected");
            totalPublic = countMatches(code,"public");
            totalEntries = countMatches(code,"//entrada");
            totalDescription = countMatches(code,"//descripcion");
            totalOutputs = countMatches(code,"//salida");
            totalFunctions = totalPrivated + totalPublic + totalProtected;

        }

        if (totalFunctions*3 == totalDescription + totalEntries + totalOutputs)
        {
            return true;
        }
        else return false;
    }


}
