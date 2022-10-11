
window.addEventListener("load",iniciar,false);

//Flag para saber si ya se ha dado orden de lanzar, o no, la información al servidor
let lanzado = false;

/* 
 * Función de arranque, que intenta activar el NFC
 */
function iniciar() {
  //Llamo a la función para que active el NFC
  activaNFC();
  $("#contador").hide();
  $("#contador").removeClass("invisible"); //Lo hago visible después de haberlo "hideado".
}

/*
 * Función que intenta activar el NFC, y en caso de que esté activo o lo consiga, muestra los campos
 */
async function activaNFC() {
  const nfcPermissionStatus = await navigator.permissions.query({ name: "nfc" });
  //Si ya hay permisos, muestra los campos y llama a las funciones de lectura de NFC
  if (nfcPermissionStatus.state === "granted") {
    document.getElementById("boton1").style.display = 'none';
    $("#formulario").removeClass("visually-hidden");
    try{
      const ndef = new NDEFReader();
      console.log("antes del wait");
      await ndef.scan();
      console.log("after wait");
      ndef.addEventListener("readingerror", () => {
        alert("Argh! Cannot read data from the NFC tag. Try another one?");
      });

      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log(`> Serial Number: ${serialNumber}`);
        console.log(`> Records: (${message.records.length})`);
        for (const record of message.records){
          const textDecoder = new TextDecoder(record.encoding);
          console.log(`Contenido: ${textDecoder.decode(record.data)}`);
          //document.getElementById("input1").value = textDecoder.decode(record.data);
          leer(textDecoder.decode(record.data));
        }
      });
    } catch (error) {
      alert("Argh! " + error);
    }
  }else {
    //En el caso de que no esté activo el NFC, intento activarlo
    document.getElementById("boton1").style.display = 'inline'; 
    $("#formulario").addClass("visually-hidden");
    document.getElementById("boton1").addEventListener("click", async () => {
      try {
        const ndef2 = new NDEFReader();
        await ndef2.scan();
        document.getElementById("boton1").style.display = 'none';
        $("#formulario").removeClass("visually-hidden");
        //Meto aquí el código que se ejecutó arriba si estaba activo el permiso
        try{
          const ndef = new NDEFReader();
          console.log("antes del wait");
          await ndef.scan();
          console.log("after wait");
          ndef.addEventListener("readingerror", () => {
            alert("Argh! Cannot read data from the NFC tag. Try another one?");
          });
          ndef.addEventListener("reading", ({ message, serialNumber }) => {
            console.log(`> Serial Number: ${serialNumber}`);
            console.log(`> Records: (${message.records.length})`);
            for (const record of message.records){
              const textDecoder = new TextDecoder(record.encoding);
              console.log(`Contenido: ${textDecoder.decode(record.data)}`);
              //document.getElementById("input1").value = textDecoder.decode(record.data);
              leer(textDecoder.decode(record.data));
            }
          });
        } catch (error) {
          alert("Argh! " + error);
        }
      } catch (error) {
        alert("OJO! " + error);
      }
    },true);
  }
} 

/*
 * Función que comprueba que se cumplen las condiciones para lanzar la información al servidor
 */
function prelanzar() {
  if (($("#input1").val() != "")&&($("#input2").val() != "")&&($("#input3").val() != "") && (lanzado == false)) {
    
    lanzar(10000);
    lanzado = true;
  }
}

/*
 * Función para mostrar mensaje de lanzamiento de información al servidor.
 * Lanza la información al terminar el tiempo
 */
function lanzar(tiempo) {

  // Código que lanza cuenta atrás con un setInterval, cada segundo
  var countDownDate = new Date().getTime()+tiempo;
  var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
    // Muestra el mensaje en pantalla, apareciendo y desapareciendo no de golpe
    $('#contador').animate({opacity:"show"}); 
    document.getElementById("contador").innerHTML = "En "+seconds + " segundos se lanzará la información al servidor";
    if (distance < 0) {
      clearInterval(x);
      //mantenemos el último mensaje, antes de que desaparezca el cuadro
      document.getElementById("contador").innerHTML = "En 0 segundos se lanzará la información al servidor";
      $('#contador').animate({opacity:"hide"});
      //Esperamos 500ms antes de enviar los datos
      setTimeout(function () {
        enviarDatos();
        }, 500); 
    }
  }, 1000);
}

/*
 * Función que es llamada cuando se lee un dato por NFC, y lo ubica en su input correspondiente, además de pintar el input
 */
function leer (texto) {
  if (texto.substring(0,2) == "*B") {
    if ($("#input1").val() == "") {
      $("#input1").val(texto.substring(2,(texto.length-1)));
      $("#input1").removeClass("is-invalidalex");
      $("#input1").addClass("is-validalex");
    } else if ($("#input1").val() == texto.substring(2,(texto.length-1))) {
      alert("Batería ya leída!");
    } else {
      $("#input2").val(texto.substring(2,(texto.length-1)));
      $("#input2").removeClass("is-invalidalex");
      $("#input2").addClass("is-validalex");
      prelanzar();
    }
  } else if (texto.substring(0,2) == "*U") {
    $("#input4").val(texto.substring(2,(texto.length-1)));
    $("#input4").addClass("is-validalex");
    prelanzar();
  } else if (texto.substring(0,2) == "*C") {
    $("#input3").val(texto.substring(2,(texto.length-1)));
    $("#input3").removeClass("is-invalidalex");
    $("#input3").addClass("is-validalex");
    prelanzar();
  } else if (texto.substring(0,2) == "*X") {
    $("#input5").val(texto.substring(2,(texto.length-1)));
    $("#input5").addClass("is-validalex");
    prelanzar();
  } else {
    alert("Código no reconocido");
  }

}

/*
 * Función para mostrar mensajes temporales por pantalla (alertas)
 */
function alertafinal(tiempo, mensaje, color) {

  //Quitamos la clase "alert-warning" para poder dar cualquier otro color
  $("#contador").removeClass("alert-warning");
  $("#contador").addClass(color);
  // Código que lanza cuenta atrás con un setInterval, cada segundo
  var countDownDate = new Date().getTime()+tiempo;
  var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    $('#contador').animate({opacity:"show"});
    document.getElementById("contador").innerHTML = mensaje;
    if (distance < 0) {
      clearInterval(x);
      //mantenemos el último mensaje, antes de que desaparezca el cuadro
      document.getElementById("contador").innerHTML = mensaje;
      $('#contador').animate({opacity:"hide"});
      //Esperamos 1200ms antes de enviar los datos
      setTimeout(function () {
        $("#contador").addClass("alert-warning");
        $("#contador").removeClass(color);
      }, 1200);
    }
  }, 1000);
}



/*
 * Función que envía los datos vía formulario POST al servidor con la base de datos que está escuchando
 * 
 */
function enviarDatos() {

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
}


/* 
 * Función que limpia los campos de texto y resetea el coloreado de los inputs
 */
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

document.getElementById("input4").addEventListener("click",clickoper,false);

function clickoper() {
document.getElementById("inpu4").innerHTML ="";
}