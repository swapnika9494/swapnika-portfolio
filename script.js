const typing = document.querySelector(".typing");

const words = [
"AIML Student",
"ML Developer",
"Web Developer",
"DSA Enthusiast"
];

let wordIndex = 0;
let letterIndex = 0;

function type(){
if(letterIndex < words[wordIndex].length){
typing.textContent += words[wordIndex].charAt(letterIndex);
letterIndex++;
setTimeout(type,100);
}
else{
setTimeout(erase,1500);
}
}

function erase(){
if(letterIndex>0){
typing.textContent =
words[wordIndex].substring(0,letterIndex-1);
letterIndex--;
setTimeout(erase,50);
}
else{
wordIndex++;
if(wordIndex>=words.length){
wordIndex=0;
}
setTimeout(type,200);
}
}

document.addEventListener("DOMContentLoaded",()=>{
type();
});
