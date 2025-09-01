window.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if(isLoggedIn !== "true"){
        window.location.href = "login.html";
    } else {
        const userEmail = localStorage.getItem("userEmail");
        console.log("Welcome back,", userEmail);
    }
});

const recognition = window.SpeechRecognition ? new window.SpeechRecognition() : new window.webkitSpeechRecognition();
const synth = window.speechSynthesis;

recognition.lang = "hi-IN";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const commands = {
  "en": { add: ["add","buy","i want","i need","put"], remove:["remove","delete","take off"] },
  "hi": { add:["जोड़ो","चाहिए","खरीद","लाओ"], remove:["हटाओ","निकालो","मिटाओ"] }
};

const categoryMap = {
  fruits:["apple","banana","orange","mango","grapes","सेब","केला","संतरा","आम","अंगूर"],
  vegetables:["carrot","tomato","onion","potato","spinach","गाजर","टमाटर","प्याज","आलू","पालक"],
  dairy:["milk","cheese","yogurt","butter","दूध","पनीर","दही","मक्खन"],
  snacks:["chips","cookies","chocolate","nuts","चिप्स","कुकी","चॉकलेट","मेवे"],
  beverages:["juice","tea","coffee","soda","water","जूस","चाय","कॉफ़ी","पानी","थम्स अप","कोक"],
  household:["detergent","soap","toothpaste","cleaner","साबुन","डिटर्जेंट","टूथपेस्ट","क्लीनर"]
};

const userShopping = {
  fruits: [], vegetables: [], dairy: [], snacks: [], beverages: [], household: []
};

function getCategory(item){
  const lower = item.toLowerCase();
  for(const [cat, items] of Object.entries(categoryMap)){
    if(items.includes(lower)) return cat;
  }
  return null;
}


function speak(text, lang="en-US"){ synth.speak(new SpeechSynthesisUtterance(text)); }


function logAction(msg){ const logDiv=document.getElementById("log-messages"); const p=document.createElement("p"); p.textContent=msg; logDiv.prepend(p); }


function updateShoppingDisplay(){
  const display = document.getElementById("shopping-items");
  display.innerHTML='';
  for(const [cat, items] of Object.entries(userShopping)){
    if(items.length>0){
      const p=document.createElement("p");
      p.innerHTML=`<strong>${cat.charAt(0).toUpperCase()+cat.slice(1)}:</strong> ${items.join(", ")}`;
      display.appendChild(p);
    }
  }
}


function addItem(item){
  const category = getCategory(item);
  if(!category){ logAction(`Item "${item}" does not match any category`); speak(`Item ${item} does not match any category`); return; }
  if(!userShopping[category].includes(item)){
    userShopping[category].push(item);
    const ul = document.getElementById(category+"-list");
    const li=document.createElement('li'); li.textContent=item.charAt(0).toUpperCase()+item.slice(1);
    const delBtn=document.createElement('button'); delBtn.textContent='×'; delBtn.classList.add('delete-btn'); delBtn.onclick=()=>removeItem(item);
    li.appendChild(delBtn); li.classList.add('new-item'); ul.appendChild(li); ul.classList.add('show'); setTimeout(()=>li.classList.remove('new-item'),500);
    logAction(`${item} added to ${category}`); speak(`${item} added to your ${category}`);
    updateShoppingDisplay(); updateSuggestions();
  }
}


function removeItem(item){
  const category = getCategory(item);
  if(!category || !userShopping[category].includes(item)){ logAction(`${item} not found in your list`); speak(`${item} not found in your list`); return; }
  const ul=document.getElementById(category+"-list");
  const li=Array.from(ul.children).find(l=>l.firstChild.textContent.toLowerCase()===item.toLowerCase());
  if(li){ li.style.backgroundColor="#c8e6c9"; setTimeout(()=>li.remove(),300); }
  userShopping[category]=userShopping[category].filter(i=>i!==item);
  logAction(`${item} removed from ${category}`); speak(`${item} removed from your ${category}`);
  updateShoppingDisplay(); updateSuggestions();
}


function updateSuggestions(){
  const logDiv=document.getElementById("log-messages");
  const oldSuggestions = logDiv.querySelectorAll(".suggestion");
  oldSuggestions.forEach(s=>s.remove());

  const suggestionItems=[];
  if(userShopping.fruits.length<3) suggestionItems.push("💡 Consider adding some fruits like apple or banana");
  if(userShopping.vegetables.length<3) suggestionItems.push("💡 Add some vegetables to stay healthy");
  if(!userShopping.dairy.includes("milk")) suggestionItems.push("💡 You might want to buy milk");
  if(!userShopping.beverages.includes("water")) suggestionItems.push("💡 Don't forget to stay hydrated with water");

  suggestionItems.forEach(s=>{ const p=document.createElement("p"); p.textContent=s; p.classList.add("suggestion"); logDiv.appendChild(p); });
}


document.getElementById("start-btn").addEventListener("click",()=>recognition.start());

document.querySelectorAll(".category-card").forEach(card=>{
  card.addEventListener("click",()=>{
    const list=card.querySelector(".shopping-list");
    const isOpen=list.classList.contains("show");
    document.querySelectorAll(".shopping-list").forEach(l=>l.classList.remove("show"));
    if(!isOpen) list.classList.add("show");
  });
});

recognition.addEventListener("result",(event)=>{
  const transcript=event.results[0][0].transcript.toLowerCase().trim();
  document.getElementById("recognized-text").textContent="🎙 You said: "+transcript;
  let action="add", item=null;
  const lang=/[अ-ह]/.test(transcript)?"hi":"en";
  for(let keyword of commands[lang].remove){ if(transcript.includes(keyword)){ action="remove"; item=transcript.replace(keyword,"").trim(); break; } }
  if(!item){ for(let keyword of commands[lang].add){ if(transcript.includes(keyword)){ item=transcript.replace(keyword,"").trim(); break; } } }
  if(!item) item=transcript;
  if(action==="add") addItem(item); else removeItem(item);
});

recognition.addEventListener("speechend",()=>recognition.stop());
recognition.addEventListener("error",(e)=>alert("Error: "+e.error));
document.getElementById("logoutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html"; 
});