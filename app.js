"use strict";
const PRODUCTS=[
 {id:1,icon:"🎧",name:"Wireless Headphones",price:59,category:"Tech",rating:"4.8",reviews:124},
 {id:2,icon:"⌚",name:"Smart Watch",price:129,category:"Wearables",rating:"4.7",reviews:98},
 {id:3,icon:"📱",name:"Phone Case",price:12,category:"Tech",rating:"4.5",reviews:210},
 {id:4,icon:"👟",name:"Running Shoes",price:75,category:"Lifestyle",rating:"4.6",reviews:76},
 {id:5,icon:"🎒",name:"Everyday Backpack",price:39,category:"Lifestyle",rating:"4.8",reviews:143},
 {id:6,icon:"💡",name:"Desk Lamp",price:24,category:"Lifestyle",rating:"4.4",reviews:62},
 {id:7,icon:"🔋",name:"Power Bank",price:29,category:"Tech",rating:"4.7",reviews:187},
 {id:8,icon:"📷",name:"Action Camera",price:149,category:"Tech",rating:"4.6",reviews:54}
];
const $=s=>document.querySelector(s);
const grid=$("#productGrid"),fab=$("#fab"),radial=$("#radialMenu"),panel=$("#panel"),overlay=$("#overlay");
let cart=[],query="",category="All",currentProduct=null,menuOpen=false,zoom=1,toastTimer;
const money=n=>"$"+n.toFixed(2);
function vibrate(pattern=18){try{if(navigator.vibrate)navigator.vibrate(pattern)}catch(_){}}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1750)}
function renderProducts(){
 const visible=PRODUCTS.filter(p=>(category==="All"||p.category===category)&&p.name.toLowerCase().includes(query));
 $("#resultCount").textContent=visible.length+" items";
 grid.innerHTML=visible.length?visible.map(p=>`<article class="product-card" data-product-id="${p.id}" tabindex="0">
  <div class="product-art" aria-hidden="true">${p.icon}</div><div class="product-category">${p.category}</div>
  <h3>${p.name}</h3><div class="rating">★★★★★ <span>${p.rating} · ${p.reviews} reviews</span></div>
  <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">Add +</button></div></article>`).join(""):'<p class="empty">No products found. Try another search.</p>';
}
function updateCartCount(){$("#cartCount").textContent=cart.reduce((n,item)=>n+item.qty,0)}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===Number(id));if(!p)return;const item=cart.find(x=>x.id===p.id);if(item)item.qty++;else cart.push({...p,qty:1});updateCartCount();toast(p.name+" added to cart");vibrate(20)}
function closeMenu(){radial.innerHTML="";menuOpen=false}
function closePanel(){panel.hidden=true;overlay.hidden=true}
function closeAll(){closeMenu();closePanel()}
function openPanel(title,html){closeMenu();$("#panelTitle").textContent=title;$("#panelContent").innerHTML=html;panel.hidden=false;overlay.hidden=false}
function openCart(){
 const total=cart.reduce((s,p)=>s+p.price*p.qty,0);
 const lines=cart.length?cart.map(p=>`<div class="cart-line"><span>${p.icon} ${p.name} × ${p.qty}</span><b>${money(p.price*p.qty)}</b></div>`).join(""):'<p class="empty">Your cart is empty. Add something you like.</p>';
 openPanel("Your cart",lines+(cart.length?`<div class="cart-total"><span>Total</span><span>${money(total)}</span></div><button class="primary-button" id="checkoutButton" style="width:100%;padding:14px">Continue to checkout</button><p class="panel-note">Demo checkout only. No payment will be taken.</p>`:""));
}
function openProduct(id){
 const p=PRODUCTS.find(x=>x.id===Number(id));if(!p)return;currentProduct=p;
 document.querySelectorAll(".product-card.highlight").forEach(x=>x.classList.remove("highlight"));
 const card=document.querySelector(`[data-product-id="${p.id}"]`);if(card)card.classList.add("highlight");
 openPanel(p.icon+" "+p.name,`<div class="detail-row"><span>Price</span><b>${money(p.price)}</b></div><div class="detail-row"><span>Rating</span><b>★ ${p.rating} (${p.reviews})</b></div><div class="detail-row"><span>Category</span><b>${p.category}</b></div><div class="product-detail-actions"><button class="primary-button" id="detailAdd">🛒 Add to cart</button><button class="secondary-button" id="detailBuy">⚡ Buy now</button><button class="secondary-button" id="detailSave">♡ Save</button><button class="secondary-button" id="detailShare">↗ Share</button></div><p class="panel-note">Product actions are demo interactions; checkout and payment are not connected.</p>`);
}
function showCart(){openCart()}
function setZoom(next){zoom=Math.max(.75,Math.min(1.35,next));document.documentElement.style.zoom=String(zoom);toast("Page size "+Math.round(zoom*100)+"%")}
function openSettings(){openPanel("Settings",`<p>Adjust page size with the slider, or use the hold-and-rotate gesture on the floating button.</p><label for="zoomRange">Page size: <b id="zoomLabel">${Math.round(zoom*100)}%</b></label><input class="range" id="zoomRange" type="range" min="75" max="135" value="${Math.round(zoom*100)}"><p class="panel-note">Tip: hold the floating button and move your finger in a circle. Clockwise zooms in; counterclockwise zooms out.</p>`)}
function radialItems(){
 const actions=[["⌂","Home",()=>{closeMenu();window.scrollTo({top:0,behavior:"smooth"})}],["⌕","Search",()=>{closeMenu();$("#searchInput").focus();window.scrollTo({top:0,behavior:"smooth"})}],["🛒","Cart",showCart],["♡","Saved",()=>{closeMenu();toast("Your saved list is empty") }],["⚙","Settings",openSettings]];
 const r=fab.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
 const base=Math.atan2(innerHeight/2-cy,innerWidth/2-cx);
 actions.forEach((a,i)=>{const angle=base+(i-2)*.55,dist=93,x=Math.max(8,Math.min(innerWidth-58,cx+Math.cos(angle)*dist-25)),y=Math.max(8,Math.min(innerHeight-58,cy+Math.sin(angle)*dist-25));const b=document.createElement("button");b.className="radial-item";b.type="button";b.textContent=a[0];b.setAttribute("aria-label",a[1]);b.title=a[1];b.style.left=x+"px";b.style.top=y+"px";b.addEventListener("click",a[2]);radial.appendChild(b)});
}
function toggleMenu(){if(menuOpen){closeMenu();return}closePanel();menuOpen=true;radialItems()}
function smartDetect(){
 closeMenu();const cards=[...document.querySelectorAll(".product-card")];if(!cards.length){toast("No visible product to detect");return}
 const center=innerHeight/2;let best=cards[0],bestDistance=Infinity;
 cards.forEach(card=>{const rect=card.getBoundingClientRect(),distance=Math.abs(rect.top+rect.height/2-center);if(distance<bestDistance){best=card;bestDistance=distance}});
 const id=Number(best.dataset.productId);openProduct(id);vibrate([25,35,25]);
}
function snapFab(){const x=fab.offsetLeft+fab.offsetWidth/2<innerWidth/2?8:innerWidth-fab.offsetWidth-8;const y=Math.max(8,Math.min(innerHeight-fab.offsetHeight-8,fab.offsetTop));fab.style.left=x+"px";fab.style.top=y+"px"}
function positionFab(){const x=Math.max(8,innerWidth-fab.offsetWidth-18),y=Math.round(innerHeight*.62);fab.style.left=x+"px";fab.style.top=y+"px"}
let pointer=null,holdTimer=null,gestureMode=null,lastAngle=0,rotation=0,tapCount=0,tapTimer=null;
const angleAt=(x,y)=>Math.atan2(y-pointer.cy,x-pointer.cx);
fab.addEventListener("pointerdown",e=>{
 if(e.button!==undefined&&e.button!==0)return;
 e.preventDefault();fab.setPointerCapture(e.pointerId);
 const r=fab.getBoundingClientRect();pointer={x:e.clientX,y:e.clientY,cx:r.left+r.width/2,cy:r.top+r.height/2,ox:r.left,oy:r.top};
 gestureMode=null;rotation=0;
 holdTimer=setTimeout(()=>{if(!pointer)return;gestureMode="rotate";lastAngle=angleAt(pointer.x,pointer.y);fab.classList.add("dialing");closeMenu();vibrate(22)},420);
});
fab.addEventListener("pointermove",e=>{
 if(!pointer)return;
 const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
 if(gestureMode==="rotate"){
  const a=angleAt(e.clientX,e.clientY);let delta=a-lastAngle;
  if(delta>Math.PI)delta-=Math.PI*2;if(delta< -Math.PI)delta+=Math.PI*2;
  lastAngle=a;rotation+=delta;setZoom(zoom+delta*.13);return;
 }
 if(!gestureMode&&Math.hypot(dx,dy)>9){clearTimeout(holdTimer);gestureMode="drag";fab.classList.add("dragging");closeMenu()}
 if(gestureMode==="drag"){
  const x=Math.max(0,Math.min(innerWidth-fab.offsetWidth,pointer.ox+dx)),y=Math.max(0,Math.min(innerHeight-fab.offsetHeight,pointer.oy+dy));
  fab.style.left=x+"px";fab.style.top=y+"px";
 }
});
function finishPointer(){
 if(!pointer)return;clearTimeout(holdTimer);fab.classList.remove("dragging","dialing");
 if(gestureMode==="drag")snapFab();
 else if(gestureMode==="rotate")vibrate(12);
 else if(!gestureMode){tapCount++;clearTimeout(tapTimer);tapTimer=setTimeout(()=>{if(tapCount>=3)smartDetect();else if(tapCount===1)toggleMenu();else if(tapCount===2){closeMenu();toast("One more tap to detect a product")}tapCount=0},330)}
 pointer=null;gestureMode=null;
}
fab.addEventListener("pointerup",finishPointer);fab.addEventListener("pointercancel",finishPointer);fab.addEventListener("lostpointercapture",finishPointer);
grid.addEventListener("click",e=>{const add=e.target.closest("[data-add]");if(add){e.stopPropagation();addToCart(add.dataset.add);return}const card=e.target.closest("[data-product-id]");if(card)openProduct(card.dataset.productId)});
grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-product-id]")){e.preventDefault();openProduct(e.target.dataset.productId)}});
$("#searchInput").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();renderProducts()});
document.querySelector(".categories").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
$("#cartShortcut").addEventListener("click",showCart);$("#homeLink").addEventListener("click",e=>{e.preventDefault();closeAll();window.scrollTo({top:0,behavior:"smooth"})});
$("#closePanel").addEventListener("click",closePanel);overlay.addEventListener("click",closePanel);
$("#panelContent").addEventListener("click",e=>{
 if(e.target.id==="checkoutButton")toast("Demo only — checkout is not connected");
 if(e.target.id==="detailAdd"&&currentProduct)addToCart(currentProduct.id);
 if(e.target.id==="detailBuy"&&currentProduct){addToCart(currentProduct.id);toast("Added — demo checkout only")}
 if(e.target.id==="detailSave")toast("Saved to your demo list ♡");
 if(e.target.id==="detailShare"&&currentProduct){const data={title:currentProduct.name,text:"Check out "+currentProduct.name};if(navigator.share)navigator.share(data).catch(()=>{});else toast("Sharing isn't available on this device")}
});
$("#panelContent").addEventListener("input",e=>{if(e.target.id==="zoomRange"){setZoom(Number(e.target.value)/100);const label=$("#zoomLabel");if(label)label.textContent=e.target.value+"%"}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
window.addEventListener("resize",()=>{const x=Math.max(8,Math.min(innerWidth-fab.offsetWidth-8,fab.offsetLeft)),y=Math.max(8,Math.min(innerHeight-fab.offsetHeight-8,fab.offsetTop));fab.style.left=x+"px";fab.style.top=y+"px";if(menuOpen){closeMenu();toggleMenu()}});
renderProducts();updateCartCount();positionFab();