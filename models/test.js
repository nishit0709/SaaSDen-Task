function check(){
    return new Promise((resolve, reject) => {
        a = 3;
        if(a==2)
            resolve("Success")
        else
            reject("Failed")
    })
}


async function test(){
    try{
        res = await check();
        console.log(res);
    } catch(err){
        console.log(err)
    }
   
}


console.log("First")
test()
console.log("second")