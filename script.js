const words=["Coding","Photography","Exploring","Building Projects"]

let i=0
let j=0
let current=""
let isDeleting=false

function type(){

current=words[i]

if(isDeleting){
document.getElementById("typed").textContent=current.substring(0,j--)
}
else{
document.getElementById("typed").textContent=current.substring(0,j++)
}

if(!isDeleting && j===current.length){
isDeleting=true
setTimeout(type,1000)
return
}

if(isDeleting && j===0){
isDeleting=false
i++
if(i===words.length) i=0
}

setTimeout(type,100)
}

type()
