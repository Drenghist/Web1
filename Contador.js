function lanzar(contador) {

  // Número de milisegundos para iniciar la cuenta atrás
  var countDownDate = new Date().getTime()+32000;

  // Actualiza la cuenta atrás cada segundo
  var x = setInterval(function() {

  var now = new Date().getTime();
  var distance = countDownDate - now;
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById(contador).innerHTML = "En "+seconds + " segundos se lanzará la información al servidor";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById(contador).innerHTML = "";
    enviarDatos();
  }
}, 1000);
 
}

function enviarDatos() {
  alert("hola");
}
