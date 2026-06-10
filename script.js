window.addEventListener("load",()=>{setTimeout(()=>{const e=document.getElementById("loader");if(e){e.style.opacity="0";setTimeout(()=>(e.style.display="none"),800)}},800);createStars()});
let allStars=[];
function createStars(){const e=document.getElementById("stars-container");for(let t=0;t<100;t++){const t=document.createElement("div");t.classList.add("star");const a=Math.random()*3+1;t.style.width=a+"px";t.style.height=a+"px";t.style.left=Math.random()*100+"vw";t.style.top=Math.random()*100+"vh";t.style.animationDuration=Math.random()*3+1+"s";t.style.animationDelay=Math.random()*2+"s";e.appendChild(t);allStars.push(t)}}
const btn=document.getElementById("blow-btn"),cake=document.getElementById("cake"),wishText=document.getElementById("wish-text"),bgMusic=document.getElementById("bg-music");
if(btn){btn.addEventListener("click",function(){if(cake)cake.classList.add("blown");btn.style.opacity="0";btn.style.pointerEvents="none";btn.style.position="absolute";if(wishText)wishText.classList.add("show");if(bgMusic){bgMusic.volume=0.3;bgMusic.play().catch((e)=>{console.log("Audio playback failed:",e)})}fireConfetti();setTimeout(()=>{const mc=document.getElementById("main-content");if(mc)mc.scrollIntoView({behavior:"smooth"})},2500)})}
function fireConfetti(){const e=["#ffb6c1","#ffd700","#fff5f7","#c8709a"];for(let t=0;t<150;t++){const t=document.createElement("div");t.className="confetti-piece";t.style.backgroundColor=e[Math.floor(Math.random()*e.length)];t.style.left=Math.random()*100+"vw";if(Math.random()>0.5){t.style.borderRadius="50%";t.style.width="8px";t.style.height="8px"}const a=Math.random()*3+2,n=Math.random()*0.5;t.style.animationDuration=a+"s";t.style.animationDelay=n+"s";document.body.appendChild(t);setTimeout(()=>{t.remove()},(a+n)*1000)}}
const observerOptions={threshold:0.1,rootMargin:"0px 0px -50px 0px"},observer=new IntersectionObserver((e)=>{e.forEach((e)=>{if(e.isIntersecting){e.target.classList.add("show");if(e.target.tagName==="H2"){e.target.style.opacity="1";e.target.style.transform="translateY(0)"}observer.unobserve(e.target)}})},observerOptions);
document.querySelectorAll(".observer-item").forEach((e)=>{observer.observe(e)});
const polaroids=document.querySelectorAll(".polaroid-item"),board=document.querySelector(".photo-board");
if(board){board.style.setProperty("--light-trail-x","0px");const slideOptions={threshold:0.8,root:board},slideObserver=new IntersectionObserver((e)=>{e.forEach((e)=>{const t=e.target;if(e.isIntersecting){t.classList.add("active-memory");updateLightAndStars(t)}else{t.classList.remove("active-memory")}})},slideOptions);polaroids.forEach((e)=>{slideObserver.observe(e)})}
function updateLightAndStars(e){if(board)board.style.setProperty("--light-trail-x",e.offsetLeft-board.scrollLeft+e.offsetWidth/2+"px");clusterStars(e)}
polaroids.forEach((e)=>{e.addEventListener("mousemove",(t)=>{if(window.innerWidth<768)return;const a=e.getBoundingClientRect(),n=t.clientX-a.left,o=t.clientY-a.top,r=a.width/2,s=a.height/2,c=((o-s)/s)*-5,i=((n-r)/r)*5;e.style.transform=`rotateX(${c}deg) rotateY(${i}deg) scale(1.05)`});e.addEventListener("mouseleave",()=>{e.style.transform="rotateX(0deg) rotateY(0deg) scale(1.05)"})});
function clusterStars(e){const t=e.getBoundingClientRect(),a=t.left+t.width/2,n=t.top+t.height/2;for(let e=0;e<20;e++){const e=allStars[Math.floor(Math.random()*allStars.length)],t=a+(Math.random()-0.5)*150,o=n+(Math.random()-0.5)*150;e.style.transition="all 1.5s cubic-bezier(0.16, 1, 0.3, 1)";e.style.left=t+"px";e.style.top=o+"px"}}

// New Swipeable Modal Logic
const modal=document.getElementById("image-modal"),modalImg=document.getElementById("modal-img"),modalText=document.getElementById("modal-text"),closeModalBtn=document.getElementById("close-modal"),prevBtn=document.getElementById("prev-btn"),nextBtn=document.getElementById("next-btn");
let currentImgIndex=0;
const imageData=Array.from(polaroids).map(p=>({src:p.querySelector("img").src,msg:p.getAttribute("data-message")}));

function updateModal(i){
    if(!modal||!modalImg||!modalText||!prevBtn||!nextBtn)return;
    currentImgIndex=i;
    modalImg.style.opacity="0"; // Fade out
    setTimeout(()=>{
        modalImg.src=imageData[i].src;
        modalText.textContent=imageData[i].msg;
        modalImg.style.opacity="1"; // Fade in
    },200);
    prevBtn.disabled=i===0;
    nextBtn.disabled=i===imageData.length-1;
}

document.querySelectorAll(".polaroid-item").forEach((e,index)=>{e.addEventListener("click",()=>{updateModal(index);modal.classList.add("active");document.body.style.overflow="hidden"})});
const closeM=()=>{if(modal){modal.classList.remove("active");document.body.style.overflow="auto"}};
if(closeModalBtn)closeModalBtn.addEventListener("click",closeM);
if(modal)modal.addEventListener("click",(e)=>{if(e.target===modal)closeM()});
window.addEventListener("keydown",(e)=>{if(modal&&modal.classList.contains("active")){if(e.key==="Escape")closeM();if(e.key==="ArrowLeft"&&currentImgIndex>0)updateModal(currentImgIndex-1);if(e.key==="ArrowRight"&&currentImgIndex<imageData.length-1)updateModal(currentImgIndex+1)}});
if(prevBtn)prevBtn.addEventListener("click",()=>currentImgIndex>0&&updateModal(currentImgIndex-1));
if(nextBtn)nextBtn.addEventListener("click",()=>currentImgIndex<imageData.length-1&&updateModal(currentImgIndex+1));

// Touch Swipe Handling for Modal
let touchStartX=0,touchEndX=0;
const modalContent=document.querySelector(".modal-content");
if(modalContent){
    modalContent.addEventListener("touchstart",e=>{touchStartX=e.changedTouches[0].screenX}, {passive:true});
    modalContent.addEventListener("touchend",e=>{
        touchEndX=e.changedTouches[0].screenX;
        const swipeDist=touchEndX-touchStartX;
        const threshold=50; // min distance for swipe
        if(Math.abs(swipeDist)>threshold){
            if(swipeDist>0 && currentImgIndex>0) updateModal(currentImgIndex-1); // swipe right
            else if(swipeDist<0 && currentImgIndex<imageData.length-1) updateModal(currentImgIndex+1); // swipe left
        }
    }, {passive:true});
}