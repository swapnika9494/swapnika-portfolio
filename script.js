// typing animation

const words = [
"AI & ML Student",
"Full Stack Developer",
"Problem Solver",
"Tech Enthusiast"
]

let i = 0
let j = 0
let current = ""
let isDeleting = false

function type(){

current = words[i]

if(isDeleting){
document.getElementById("typed").textContent =
current.substring(0,j--)

}else{
document.getElementById("typed").textContent =
current.substring(0,j++)
}

if(!isDeleting && j === current.length){
isDeleting = true
setTimeout(type,1000)
return
}

if(isDeleting && j === 0){
isDeleting = false
i++
if(i===words.length) i=0
}

setTimeout(type,100)
}

type()



// scroll reveal animation

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show")
}
})
})

document.querySelectorAll(".section")
.forEach(el=>{
el.classList.add("fade")
observer.observe(el)
})


// navbar scroll shadow

window.addEventListener("scroll",function(){

const nav = document.querySelector(".navbar")

if(window.scrollY > 50){
nav.style.background="rgba(0,0,0,0.6)"
}else{
nav.style.background="rgba(0,0,0,0.3)"
}

})


// smooth nav scroll

document.querySelectorAll("nav a").forEach(anchor=>{
anchor.addEventListener("click",function(e){
e.preventDefault()
document.querySelector(this.getAttribute("href"))
.scrollIntoView({behavior:"smooth"})
})
})
