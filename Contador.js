function lanzar(contador) {

  // Número de milisegundos para iniciar la cuenta atrás
  var countDownDate = new Date().getTime()+3200;

  // Actualiza la cuenta atrás cada segundo
  var x = setInterval(function() {

  var now = new Date().getTime();
  var distance = countDownDate - now;
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  $("#contador").removeClass("invisible");
  document.getElementById(contador).innerHTML = "En "+seconds + " segundos se lanzará la información al servidor";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById(contador).innerHTML = "";
    $("#contador").addClass("invisible");
    //$("#contador").alert("close"); -- Para que desaparezca "fadeando"
    enviarDatos();
  }
}, 1000);
 
}

function enviarDatos() {
  //instrucción para enviar los datos
  wipe();
}

function wipe() {
  document.getElementById("formulario").reset();
  $("#input1").removeClass("is-validalex");
  $("#input1").addClass("is-invalidalex");
  $("#input2").removeClass("is-validalex");
  $("#input2").addClass("is-invalidalex");
  $("#input3").removeClass("is-validalex");
  $("#input3").addClass("is-invalidalex");
}