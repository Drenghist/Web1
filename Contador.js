function lanzar(contador, tiempo) {

  // Número de milisegundos para iniciar la cuenta atrás
  var countDownDate = new Date().getTime()+tiempo;

  // Actualiza la cuenta atrás cada segundo
  var x = setInterval(function() {

  var now = new Date().getTime();
  var distance = countDownDate - now;
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  //$("#contador").removeClass("invisible"); -- Si lo hago por clases, no vale la pena
  //$('#contador').show(); -- Muestra de golpe
  $('#contador').animate({opacity:"show"}); // Muestra a los pocos
  document.getElementById(contador).innerHTML = "En "+seconds + " segundos se lanzará la información al servidor";
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById(contador).innerHTML = "En 0 segundos se lanzará la información al servidor";
    //$("#contador").addClass("invisible"); //oculto con clases
    //$('#contador').hide(); //oculta a saco
    $('#contador').animate({opacity:"hide"});
    setTimeout(function () {
      enviarDatos();
      }, 500);
    //$("#contador").alert("close"); -- Para que desaparezca "fadeando"
    
  }
}, 1000);
 
}

function alertafinal(tiempo, mensaje, color) {

  var countDownDate = new Date().getTime()+tiempo;
  $("#contador").removeClass("alert-warning");
  $("#contador").addClass(color);
  var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("contador").innerHTML = mensaje;
    $('#contador').animate({opacity:"show"});
    
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("contador").innerHTML = mensaje;
      $('#contador').animate({opacity:"hide"});
      setTimeout(function () {
        $("#contador").addClass("alert-warning");
        $("#contador").removeClass(color);
      }, 1200);
      
      
    }
  }, 1000);
  
}




function enviarDatos() {
  //instrucción para enviar los datos
  /*$.post('https://drenghist.sytes.net/server2.php', `origen=${$("#input1").val()}&destino=${$("#input2").val()}&carretilla=${$("#input3").val()}&usuario=${$("#input4").val()}&obs=${$("#input5").val()}`, function(data, status){
    //Aquí irá el código de que funcionó OK
    
    if (data == "respuestacorrecta"){
      alertafinal(2000, "¡Enviado correctamente!", "alert-success");
    } else {
      alertafinal(2000, "Error de envío", "alert-danger");
    }

  });*/

  $.ajax({
    url: 'https://drenghist.ddns.net/registros.php',
    type: 'POST',
    data: `origen=${$("#input1").val()}&destino=${$("#input2").val()}&carretilla=${$("#input3").val()}&usuario=${$("#input4").val()}&obs=${$("#input5").val()}`,
    async: true,
    success: () => {
      alertafinal(2000, "¡Enviado correctamente!", "alert-success");
    },
    error: () => {
      alertafinal(2000, "Error de envío", "alert-danger");
    }
  });
  wipe();
  //alert(`hola ${$("#input1").val()}`)
  
  
}

function wipe() {
  document.getElementById("formulario").reset();
  $("#input1").removeClass("is-validalex");
  $("#input1").addClass("is-invalidalex");
  $("#input2").removeClass("is-validalex");
  $("#input2").addClass("is-invalidalex");
  $("#input3").removeClass("is-validalex");
  $("#input3").addClass("is-invalidalex");
  $("#input4").removeClass("is-validalex");
  $("#input5").removeClass("is-validalex");
  lanzado = false;
}