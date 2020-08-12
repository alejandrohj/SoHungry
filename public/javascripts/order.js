
//Calculate logic for the order's subtotals and total
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

//Logic for the buttons to increase or decrease the number of dishes ordered
function add(btn){
  btn.parentNode.parentNode.childNodes[1].childNodes[1].value++
}
function take(btn){
  if(btn.parentNode.parentNode.childNodes[1].childNodes[1].value>0){
    btn.parentNode.parentNode.childNodes[1].childNodes[1].value--  
  }
}


//Sets an interval and event listeners to set all the script in action
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
