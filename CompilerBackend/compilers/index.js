const {runPython}=require("./pythonCompiler");
const {runCpp}= require("./cppCompiler");
const {runJava}=require("./javaCompiler");

exports.compileCode =(language,code,input,callback) =>{
   switch(language.toLowerCase()){
     case "python":
      return runPython(code,input,callback);
     case "cpp":
      return runCpp(code,input,callback);
     case "java":
      return runJava(code,input,callback);
      default:
        return callback("Unsupported language");
   }
};