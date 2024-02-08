const express = require("express")
const app = express();
const fs = require("fs")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/status", (req, res) =>{
    res.status(200).json({msg:`Yes! Welcome to Note Manager API`})
})

app.post("/account", (req, res) =>{
    const {firstname, lastname, username} = req.body; //destructure
    if(!firstname) res.status(400).json({error: "first name is required"});
    if(!lastname) res.status(400).json({error: "last name is required"});
    if(!username) res.status(400).json({error: "user name is required"});
    
    const user ={
        firstname,
        lastname,
        username,
    }
    const create = new Date();
    user.createdAt = create;
    user.updatedAt = create;

    if(fs.existsSync("account.json")){
        let users;
        fs.readFile("./account.json", "utf-8", (err, data)  => {
            if(err) res.status(500).json({msg: "Oops! an error occurred, try again"});
            users = JSON.parse(data);
            let lastUser = users[users.length -1];
            user.id = lastUser.id++;
            users.unshift(user);

            fs.writeFileSync("./account.json", JSON.stringify(users), "utf-8", (err)=>{
                if(err) res.status(500).json({error:err});
            })
            res.status(201).json({msg:"Account created successfully"})
    
        })
}else{
user.id = 1;

const users = [user]
fs.writeFileSync("./account.json", JSON.stringify(users), "utf-8", (err)=>{
    if(err) res.status(500).json({error:err});
})
res.status(201).json({msg:"Account created successfully"})
}
});

app.get("/account", (reg, res) => {
    if(fs.existsSync("./account.json")){
        fs.readFile("./account.json", "utf-8", (err, data) => {
            if(err) res.status(500).json({msg: "Oops! an error occured, try again"});
            const users = JSON.parse(data);
            res.status(200).json({
                success:true,
                msg: "Found",
                account: users,
            })
        })

    }else res.status(404).json({
        msg: "No record found"
    });
})

//     app.delete("/:", (req, res) => {
//         const {id} = req.query;
//         if(!id) res.status(400).json({error:"User ID is required"});

//         if (fs.existsSync("./account.json")){

//             fs.readFile("./account","utf-8", (err, data) => {
//                 if(err)res.status(500).json(err);

//                 const users = JSON.parse(data);
//                 const userExist = users.find( x => parseInt(x.id) === parseInt(id))
//                 if(!userExist) res.status(404).json({error:"User not found"});
//                 const otherUsers = users.filter( x => parseInt(x.id) !== parseInt(id));
//                 console.log(otherUsers)
//                 fs.writeFile("./account.json", JSON.stringify(otherUsers), "utf-8", (err)=> {
//                     if(err)res.status(400).json(err);
//                 })
//             })
//             res.status(200).json({success: true, msg:"User deleted successfully"});
//         }else res.status(404).json({error:"No record found"});
//     })

// const PORT = 3001;
// app.listen(PORT, () =>{
//     console.log(`server is running on local host:${PORT}`);
// })




app.delete("/:", (req, res) =>{
    // const { id} = reg.params;
    const { id} = req.query;
    if(!id) res.status(400).json({error:"User ID is required"});
    if(fs.existsSync("./account.json")){
        fs.readFile("./account.json", "utf-8", (err, data) => {
            if(err)res.status(500).json(err);
            const users = JSON.parse(data);

            const userExist = users.find(x => parseInt(x.id) === parseInt(id))
            if(!userExist) res.status(404).json({error: "User not found"});
            const otherUsers = users.filter(x => parseInt(x.id) !== parseInt(id));
            console.log(otherUsers);
            fs.writeFile("./account.json", JSON.stringify(otherUsers), "utf-8", (err)=> {
                if(err)res.status(400).json(err);
            }) 
        })
    }else res.status(404).json({error: "No record found"});
    res.status(200).json({success: true, msg: "user deleted succcefully"});
    })


    app.put("/account/:", (req, res) =>{
        const {id} = req.body;
        if(!id) res.status(400).json({error:"User ID required"});
        const userInfo = {};

        for(const key in req.body){
            if(req.body[key] !== "id")
            userInfo[key] = req.body[key];
        }
        if(fs.existsSync("./account.json")){
            fs.readFile("./account.json", "utf-8", (err, data) =>{
                if(err) res.status(400).json(err);
                const users = JSON.parse(data);
                const user = users.find(x => parseInt(x.id) === parseInt(id))
                if(!user) res.status(404).json({error: "user does not exist"});
                for(const key in userInfo){
                    user[key] === userInfo[key];
                }
                user.updatedAt = new Date();
                const otherUsers = users.filter(x => parseInt(x.id) !== parseInt(id));
                otherUsers.push(user)
                
                fs.writeFile("./account.json", JSON.stringify(otherUsers), "utf-8", (err) =>{
                    if(err) res.status(400).json(err);
                    res.status(200).json({msg: "User updated successfully"})
                })
            })
        }else res.status(404).json({error: "No record found"});
    })

    app.get("/account/:", (req, res) => {
        const { id} = req.query;
        if(fs.existsSync("./account.json")){
            fs.readFile("./account.json", "utf-8", (err, data) => {
                if(err) res.status(500).json({msg: "Oops! an error occured, try again"});

                const user = JSON.parse(data);
                const userExist = user.find(x => parseInt(x.id) === parseInt(id))
            if(!userExist) res.status(404).json({error: "User not found"});

                res.status(200).json({
                    success:true,
                    msg: "Found",
                    account: userExist,
                })
            })
    
        }else{ res.status(404).json({
            msg: "No record found"
        });}
    })
    // create an express server
const PORT = 3001;
app.listen(PORT, () =>{
    console.log(`server is runining on local host:${PORT}`)
})