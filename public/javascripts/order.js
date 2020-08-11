function updateSubtotal(dish) {
    const price = Number(dish.querySelector('.price').innerText);
    const units = Number (dish.querySelector('.quantity').value);
    let subtotal = dish.querySelector('.subtotal span')
    subtotal.innerText = Number(price*units).toFixed(2);
  }
  
  function calculateAll() {
    let dishList = document.querySelectorAll('.dish')
    dishList.forEach(dish=> {updateSubtotal(dish)})
    let subtotals= document.querySelectorAll('.subtotal span')
    let total=0;
    subtotals.forEach(subtotal=>{total+=Number(subtotal.innerText)})
    document.getElementById('order-total').value=total;
  }

  function add(btn){
    btn.parentNode.parentNode.childNodes[1].childNodes[1].value++
  }
  function take(btn){
    if(btn.parentNode.parentNode.childNodes[1].childNodes[1].value>0){
       btn.parentNode.parentNode.childNodes[1].childNodes[1].value--  
    }
  }


setInterval(calculateAll, 1)

window.addEventListener('load', ()=>{
  let btnArr = document.querySelectorAll('.more-btn');
  btnArr.forEach((addBtn)=>{
    addBtn.addEventListener('click', ()=>add(addBtn));
  })
  let btnArr2 = document.querySelectorAll('.take-btn');
  btnArr2.forEach((takeBtn)=>{
    takeBtn.addEventListener('click', ()=>take(takeBtn));
  })     
})
