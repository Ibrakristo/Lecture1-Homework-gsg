import http from 'http';
let arr = [];

function newTask(id,name,priority){
    if(arr.findIndex((value)=>{
        if(value.id === id){
            return true;
        }
        return false;
    }) !== -1){
        throw new Error("This id is already used");
    }
    return {
        id,name,priority, toString(){
            return `Name of the Task is ${this.name}, its Priority is ${this.priority}, its ID is ${this.id}.`
        }
    }
}

//Tostring has been added for better readability

function check(data){
    if(!typeof(data.name) === "string"){
        return "name should be string";
    }
    if(!Number.isInteger(data.priority)){
        return "priority should be Integer";
    }
    if(!Number.isInteger(data.id)){
        return "id should be Integer";
    }
    if(data.priority >=1 && data.priority <=5 ){
            return "true";
    }
    
    return "priority should be between 1 and 5";
    
}

function updateTask(data){
    let value = arr.find((value)=>{
        if(value.id === data.id){
            return true;
        }
        return false;
    });
    if(!value)throw new Error("task does not exist");
    value.name = data.name;
    value.priority = data.priority;
}

http.createServer(function (req,res){
    let url = req.url;
    let id;
    url = url.split("/");
    id = url[2]?Number(url[2]):null;
    url = url[1];


    req.setEncoding("utf-8");
    switch(url){
        case "tasks":
        if(req.method === "GET"){
            if(id){
                res.end("Please go to the correct path");
                return;
            }
            let str = arr.join("\n");

            res.end(str?str:"There is no Tasks");
        }
        else if(req.method === "POST"){
            if(id){
                res.end("Please go to the correct path");
                return;
            }

            req.on("data",(data)=>{
                let task = JSON.parse(data);
                let str = check(task);
                if(str !== "true"){
                    res.end(str);
                    return;
                }
                try{
                task = newTask(task.id,task.name,task.priority);
                }
                catch (err){
                    res.end("Task already exists with this id")
                    return;
                }

                arr.push(task);
                res.end("Task has been Added successfully");
            })
        }
        else if(req.method === "PUT"){
            if(id === null){
                res.end("Please provide a correct Id");
                return;
            }

            req.on("data",(data)=>{
                let task = JSON.parse(data);
                task.id = id;
                let str = check(task);
                if(str !== "true"){
                    res.end(str);
                    return;
                }
                try{
                task = updateTask(task);
                }
                catch(err){
                    res.end("Task does not exist");
                    return;
                }
                res.end("Task has been Updated successfully");
            })
        }
        else if(req.method === "DELETE"){
            if(id === null){
                res.end("Please provide a correct Id");
                return;
            }
            let index = arr.findIndex((value)=>{
                if(value.id === id){
                    return true;
                }
                return false;
            });
            if(index == -1){
                res.end("Please provide a correct Id");
                return;
            }
            arr.splice(index,1);
            res.end("Task has been Deleted successfully");
        }
        break;
        default :res.end("Only tasks path exist for now.")
    }
    
}).listen(8080);   
