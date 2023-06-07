const fs = require('fs');
const path = require('path');

class pathsetter {
  constructor(path)
  {
    this.set_path =  path;
    this.obj = {};
    this.allLines =[];
    this.operate();
    this.logger(this.obj);

  }
  operate()
  {
    this.allLines = this.readFilesRecursively(this.set_path);
    for(let i=0;i<this.allLines.length;i++)
    {
      this.Routes(this.allLines[i]);
    }
    console.log(this.obj);
  }
  findLink(str)
{ const first  =  str.indexOf("(");
  const last =  str.indexOf(",");
  const temp =  str.substr(first+1,last-first-1);
  return temp;

}
findResource(str){
  const last  = str.indexOf("Controller");
  const first = str.indexOf(",");
  const temp =  str.substr(first+1,last-first-1);
  const resource = temp.charAt(0).toUpperCase() + temp.slice(1);
 return resource;

}
  findfunction(str){
    const last = str.indexOf(")");
    const start = str.lastIndexOf(".");
    const callFunction = str.substr(start+1,last-start-1);
   return callFunction;
  }
  Routes(str){
    const get  = ".get(";
    const post =  ".post(";
    const  destroy  =  ".delete(";
    const  patch =  ".patch(";
    let resource =  this.findResource(str);
    let controller  = this.findfunction(str);
   
   if(str.includes(get))
   { 
     if(this.obj[resource]==undefined)
     this.obj[resource] ={};
     this.obj[resource]["get"] ={};
     this.obj[resource]["get"].link =  this.findLink(str);
     this.obj[resource]["get"].controller = controller;
    
     
   }
   if(str.includes(destroy))
   {
     if(this.obj[resource]==undefined)
     this.obj[resource] ={};
     this.obj[resource]["delete"] ={};
     this.obj[resource]["delete"].link = this.findLink(str);
     this.obj[resource]["delete"].controller = controller;
     
   }
   if(str.includes(patch))
   {
   
     if(this.obj[resource]==undefined)
     this.obj[resource] ={};
     this.obj[resource]["patch"] ={};
     this.obj[resource]["patch"].link =  this.findLink(str);
     this.obj[resource]["patch"].controller = controller;
     
   }
   if(str.includes(post))
   {
      if(this.obj[resource]==undefined)
     {this.obj[resource] ={};}
     this.obj[resource]["post"] ={};
     this.obj[resource]["post"].link =  this.findLink(str);
     this.obj[resource]["post"].controller = controller;
     
   }
   }
   readFilesRecursively(folderPath) {
    const lines = [];
  
    function readFiles(folderPath) {
      const files = fs.readdirSync(folderPath);
  
      files.forEach(file => {
        const filePath = path.join(folderPath, file);
  
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const fileLines = fileContent.split('\n');
  
          lines.push(...fileLines);
        } else if (stats.isDirectory()) {
          readFiles(path.join(folderPath, file));
        }
      });
    }
  
    readFiles(folderPath);
    return lines;
  }
  logger(routes) {
    for (let key in routes) {
      console.log(key + ':');
      for (let method in routes[key]) {
        const { link, controller } = routes[key][method];
        console.log(`  ${method.toUpperCase()}: ${link} (${controller})`);
      }
    }
  }

}


module.exports =  pathsetter;



