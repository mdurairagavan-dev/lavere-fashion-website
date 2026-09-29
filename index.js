const products = [
 {id:1,name:'Classic White Tee',category:'men',price:799,badge:'NEW',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85'},
 {id:2,name:'Minimal Summer Dress',category:'women',price:1499,badge:'SALE',image:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85'},
 {id:3,name:'Modern Formal Shirt',category:'men',price:1299,badge:'',image:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=85'},
 {id:4,name:'Everyday Streetwear',category:'women',price:1899,badge:'',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85'},
 {id:5,name:'Everyday Sneakers',category:'accessories',price:2499,badge:'BESTSELLER',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85'},
 {id:6,name:'Classic Handbag',category:'accessories',price:1799,badge:'',image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85'},
 {id:7,name:'Relaxed Linen Shirt',category:'men',price:1599,badge:'NEW',image:'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85'},
 {id:8,name:'Soft Knit Top',category:'women',price:1199,badge:'',image:'https://images.unsplash.com/photo-1564257577054-3e5d4c7a0b15?auto=format&fit=crop&w=700&q=85'}
];
const money = n => '₹' + n.toLocaleString('en-IN');
let activeCategory='all', searchTerm='', sortMode='default';
let cart = JSON.parse(localStorage.getItem('lavereCart') || '[]');
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const productGrid=$('#productGrid'), noResults=$('#noResults'), searchInput=$('#searchInput'), sortSelect=$('#sortSelect');
function saveCart(){localStorage.setItem('lavereCart',JSON.stringify(cart));}
function renderProducts(){
 let list=products.filter(p=>(activeCategory==='all'||p.category===activeCategory)&&p.name.toLowerCase().includes(searchTerm.toLowerCase()));
 if(sortMode==='low') list.sort((a,b)=>a.price-b.price); if(sortMode==='high') list.sort((a,b)=>b.price-a.price); if(sortMode==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
 productGrid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.badge?`<span>${p.badge}</span>`:''}<button class="quick-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart"><i class="fa-solid fa-plus"></i></button></div><div class="product-info"><p>${p.category}</p><h3>${p.name}</h3><div class="product-bottom"><strong>${money(p.price)}</strong><button class="add-btn" data-id="${p.id}">Add to Cart</button></div></div></article>`).join('');
 noResults.hidden=list.length!==0; $$('.add-btn, .quick-btn').forEach(btn=>btn.addEventListener('click',()=>addToCart(Number(btn.dataset.id))));
}
function addToCart(id){const existing=cart.find(i=>i.id===id); if(existing) existing.qty++; else cart.push({id,qty:1}); saveCart(); renderCart(); showToast('Added to your cart');}
function changeQty(id,amount){const item=cart.find(i=>i.id===id); if(!item)return; item.qty+=amount; if(item.qty<=0)cart=cart.filter(i=>i.id!==id); saveCart(); renderCart();}
function renderCart(){
 const items=$('#cartItems'); let count=0,subtotal=0; cart.forEach(i=>{const p=products.find(x=>x.id===i.id); if(p){count+=i.qty;subtotal+=p.price*i.qty;}}); $('#cartCount').textContent=count;
 if(!cart.length){items.innerHTML='<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><h3>Your cart is empty</h3><p>Add something you love.</p></div>';} else {items.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return p?`<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div class="cart-item-info"><strong>${p.name}</strong><span>${money(p.price)}</span><div class="qty"><button data-id="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-id="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-id="${p.id}" aria-label="Remove ${p.name}"><i class="fa-solid fa-trash"></i></button></div>`:''}).join('');}
 const delivery=subtotal===0?0:(subtotal>=1999?0:99); $('#cartSubtotal').textContent=money(subtotal); $('#cartDelivery').textContent=delivery?money(delivery):'FREE'; $('#cartTotal').textContent=money(subtotal+delivery);
 $$('.qty button').forEach(b=>b.addEventListener('click',()=>changeQty(Number(b.dataset.id),Number(b.dataset.change)))); $$('.remove-item').forEach(b=>b.addEventListener('click',()=>{cart=cart.filter(i=>i.id!==Number(b.dataset.id));saveCart();renderCart();showToast('Item removed');}));
}
function openCart(){ $('#cartOverlay').classList.add('active'); $('#cartOverlay').setAttribute('aria-hidden','false'); document.body.classList.add('locked'); }
function closeCart(){ $('#cartOverlay').classList.remove('active'); $('#cartOverlay').setAttribute('aria-hidden','true'); document.body.classList.remove('locked'); }
function openMenu(){ $('#sideNavbar').classList.add('active'); $('#backdrop').classList.add('active'); $('#menuBtn').setAttribute('aria-expanded','true'); $('#sideNavbar').setAttribute('aria-hidden','false'); document.body.classList.add('locked'); }
function closeMenu(){ $('#sideNavbar').classList.remove('active'); $('#backdrop').classList.remove('active'); $('#menuBtn').setAttribute('aria-expanded','false'); $('#sideNavbar').setAttribute('aria-hidden','true'); document.body.classList.remove('locked'); }
function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200);}

$$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeCategory=btn.dataset.category;renderProducts();}));
searchInput.addEventListener('input',e=>{searchTerm=e.target.value;renderProducts();}); sortSelect.addEventListener('change',e=>{sortMode=e.target.value;renderProducts();});
$('#menuBtn').addEventListener('click',openMenu); $('#closeBtn').addEventListener('click',closeMenu); $('#backdrop').addEventListener('click',closeMenu); $$('#sideNavbar a').forEach(a=>a.addEventListener('click',closeMenu));
$('#cartBtn').addEventListener('click',openCart); $('#closeCart').addEventListener('click',closeCart); $('#cartOverlay').addEventListener('click',e=>{if(e.target.id==='cartOverlay')closeCart();});
$('#checkoutBtn').addEventListener('click',()=>{if(!cart.length){showToast('Your cart is empty');return;}showToast('Demo checkout — order flow complete!');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeCart();}});
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const email=$('#email');const msg=$('#formMessage');if(!email.checkValidity()){msg.textContent='Please enter a valid email address.';msg.className='form-message error';email.focus();return;}msg.textContent='Thanks! You are subscribed.';msg.className='form-message success';e.target.reset();});
window.addEventListener('scroll',()=>$('#backTop').classList.toggle('show',window.scrollY>500));
renderProducts(); renderCart();
