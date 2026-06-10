window.addEventListener("load",()=>{setTimeout(()=>{const e=document.getElementById("loader");if(e){e.style.opacity="0";setTimeout(()=>(e.style.display="none"),800)}},800);createStars()});
let allStars=[];

function createStars(){
    const e=document.getElementById("stars-container");
    if(!e) return;
    const fragment=document.createDocumentFragment();
    for(let t=0;t<100;t++){
        const star=document.createElement("div");
        star.classList.add("star");
        const a=Math.random()*3+1;
        star.style.cssText=`width:${a}px;height:${a}px;left:${Math.random()*100}vw;top:${Math.random()*100}vh;animation-duration:${Math.random()*3+1}s;animation-delay:${Math.random()*2}s`;
        fragment.appendChild(star);
        allStars.push(star);
    }
    e.appendChild(fragment);
}

const btn=document.getElementById("blow-btn"),cake=document.getElementById("cake"),wishText=document.getElementById("wish-text"),bgMusic=document.getElementById("bg-music");
if(btn){btn.addEventListener("click",function(){if(cake)cake.classList.add("blown");btn.style.opacity="0";btn.style.pointerEvents="none";btn.style.position="absolute";if(wishText)wishText.classList.add("show");if(bgMusic){bgMusic.volume=0.3;bgMusic.play().catch((e)=>{console.log("Audio playback failed:",e)})}fireConfetti();setTimeout(()=>{const mc=document.getElementById("main-content");if(mc)mc.scrollIntoView({behavior:"smooth"})},2500)})}

function fireConfetti(){
    const colors=["#ffb6c1","#ffd700","#fff5f7","#c8709a"];
    const fragment=document.createDocumentFragment();
    for(let t=0;t<150;t++){
        const conf=document.createElement("div");
        conf.className="confetti-piece";
        let inlineStyle = `background-color:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}vw;`;
        if(Math.random()>0.5){inlineStyle += "border-radius:50%;width:8px;height:8px;";}
        const duration=Math.random()*3+2, delay=Math.random()*0.5;
        inlineStyle += `animation-duration:${duration}s;animation-delay:${delay}s;`;
        conf.style.cssText = inlineStyle;
        fragment.appendChild(conf);
        setTimeout(()=>{conf.remove()},(duration+delay)*1000);
    }
    document.body.appendChild(fragment);
}

const observerOptions={threshold:0.1,rootMargin:"0px 0px -50px 0px"},observer=new IntersectionObserver((e)=>{e.forEach((e)=>{if(e.isIntersecting){e.target.classList.add("show");if(e.target.tagName==="H2"){e.target.style.opacity="1";e.target.style.transform="translateY(0)"}observer.unobserve(e.target)}})},observerOptions);
document.querySelectorAll(".observer-item").forEach((e)=>{observer.observe(e)});

const polaroids=document.querySelectorAll(".polaroid-item"),board=document.querySelector(".photo-board");
if(board){
    board.style.setProperty("--light-trail-x","0px");
    const slideOptions={threshold:0.8,root:board},slideObserver=new IntersectionObserver((e)=>{e.forEach((e)=>{const t=e.target;if(e.isIntersecting){t.classList.add("active-memory");updateLightAndStars(t)}else{t.classList.remove("active-memory")}})},slideOptions);
    polaroids.forEach((e)=>{slideObserver.observe(e)});
}

function updateLightAndStars(e){if(board)board.style.setProperty("--light-trail-x",e.offsetLeft-board.scrollLeft+e.offsetWidth/2+"px");clusterStars(e)}

polaroids.forEach((e)=>{
    let ticking = false;
    e.addEventListener("mousemove",(t)=>{
        if(window.innerWidth<768)return;
        if(!ticking) {
            window.requestAnimationFrame(()=>{
                const a=e.getBoundingClientRect(),n=t.clientX-a.left,o=t.clientY-a.top,r=a.width/2,s=a.height/2,c=((o-s)/s)*-5,i=((n-r)/r)*5;
                e.style.transform=`rotateX(${c}deg) rotateY(${i}deg) scale(1.05)`;
                ticking = false;
            });
            ticking = true;
        }
    }, {passive: true});
    e.addEventListener("mouseleave",()=>{e.style.transform="rotateX(0deg) rotateY(0deg) scale(1.05)"});
});

function clusterStars(e){
    const t=e.getBoundingClientRect(),a=t.left+t.width/2,n=t.top+t.height/2;
    for(let i=0;i<20;i++){
        const star=allStars[Math.floor(Math.random()*allStars.length)];
        const posX=a+(Math.random()-0.5)*150, posY=n+(Math.random()-0.5)*150;
        star.style.cssText += `transition:all 1.5s cubic-bezier(0.16, 1, 0.3, 1);left:${posX}px;top:${posY}px;`;
    }
}

const modal=document.getElementById("image-modal"),modalImg=document.getElementById("modal-img"),modalText=document.getElementById("modal-text"),closeModalBtn=document.getElementById("close-modal"),prevBtn=document.getElementById("prev-btn"),nextBtn=document.getElementById("next-btn");
let currentImgIndex=0;
const imageData=Array.from(polaroids).map(p=>({src:p.querySelector("img").src,msg:p.getAttribute("data-message")}));

function updateModal(i){
    if(!modal||!modalImg||!modalText||!prevBtn||!nextBtn)return;
    currentImgIndex=i;
    modalImg.style.opacity="0"; 
    setTimeout(()=>{
        modalImg.src=imageData[i].src;
        modalText.textContent=imageData[i].msg;
        modalImg.style.opacity="1"; 
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

let touchStartX=0,touchEndX=0;
const modalContent=document.querySelector(".modal-content");
if(modalContent){
    modalContent.addEventListener("touchstart",e=>{touchStartX=e.changedTouches[0].screenX}, {passive:true});
    modalContent.addEventListener("touchend",e=>{
        touchEndX=e.changedTouches[0].screenX;
        const swipeDist=touchEndX-touchStartX;
        if(Math.abs(swipeDist)>50){
            if(swipeDist>0 && currentImgIndex>0) updateModal(currentImgIndex-1);
            else if(swipeDist<0 && currentImgIndex<imageData.length-1) updateModal(currentImgIndex+1);
        }
    }, {passive:true});
}