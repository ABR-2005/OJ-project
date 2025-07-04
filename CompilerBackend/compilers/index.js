const {runPython}=require("./pythonCompiler");
const {runCpp}= require("./cppCompiler");
const {runJava}=require("./javaCompiler");

exports.compileCode =(language,code,input,timeLimit,callback) =>{
   switch(language.toLowerCase()){
     case "python":
      return runPython(code,input,timeLimit,callback);
     case "cpp":
      return runCpp(code,input,timeLimit,callback);
     case "java":
      return runJava(code,input,timeLimit,callback);
      default:
        return callback("Unsupported language");
   }
};