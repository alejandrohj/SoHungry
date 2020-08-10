function updateSubtotal(dish) {
    const price = Number(dish.querySelector('.price').innerText);
    const units = Number (dish.querySelector('.quantity').value);
    let subtotal = dish.querySelector('.subtotal span')
    subtotal.innerText = price*units;
  }
  
  function calculateAll() {
    console.log('function activated')
    let dishList = document.querySelectorAll('.dish')
    dishList.forEach(dish=> {updateSubtotal(dish)})
    let subtotals= document.querySelectorAll('.subtotal span')
    let total=0;
    subtotals.forEach(subtotal=>{total+=Number(subtotal.innerText)})
    document.getElementById('order-total').value=total;
  }

  // function add(){
  //   let 
  // }
setInterval(calculateAll, 1)
