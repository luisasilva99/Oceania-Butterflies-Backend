// PASO 1: Crear una función que revise un campo por vez
function checkTestField(valor, nombre, esObligatorio, minimo, maximo) {
  // Esta función revisa si un texto está bien o mal

  console.log(`Revision de: ${nombre}`); // Para ver qué estamos revisando

  if (!valor || valor.trim() === "") {
    // Si el valor es diferente y se limpia algun espacio del texto es igual a nada, vacio entonces pasa a la condicion de pasar el mensaje
    if (esObligatorio) {
      return `El campo ${nombre} es obligatorio`; // Se devuelve el mensaje
    } else {
      return null; // No hay error porque no es obligatorio
    }
  }

  // Limpiamos el texto (quitamos espacios al inicio y final)
  const textoLimpio = valor.trim();

  // Para cuando el texto es muy corto
  if (textoLimpio.length < minimo) {
    return `${nombre} debe tener al menos ${minimo} caracteres`;
  }

  // Si el texto es muy largo, te manda una señal
  if (textoLimpio.length > maximo) {
    return `${nombre} no puede tener más de ${maximo} caracteres`;
  }
  //Everything esta bien
  return null; // no retorna nada porque esta bien
}

// Esta es la funcion que verifica todos los campos que e encuentran en el
export const validarDatosMariposa = (datos) => {
  console.log("Empezamos a validar los campos...");
  console.log("Datos recibidos:", datos);

  // Creamos un array vacio para guardar los errores
  const errores = [];

  // REVISAR NOMBRE COMÚN (obligatorio)
  console.log("Revisando nombre común...");
  const errorNombreComun = revisarCampoTexto(
    datos.commonName, // El valor que queremos revisar
    "nombre común", // Nombre para mostrar en error
    true, // ¿Es obligatorio? Sí
    2, // Mínimo 2 caracteres
    100 // Máximo 100 caracteres
  );
  if (errorNombreComun) {
    errores.push({ campo: "commonName", mensaje: errorNombreComun });
  }

  // revisando el nombre cientifico (obligatorio)
  console.log("Revisando nombre científico...");
  const errorNombreCientifico = revisarCampoTexto(
    datos.scientificName,
    "nombre científico",
    true, // Obligatorio
    3, // Mínimo 3 caracteres
    100 // Máximo 100 caracteres
  );
  if (errorNombreCientifico) {
    errores.push({ campo: "scientificName", mensaje: errorNombreCientifico });
  }

  // Revisa la familia (campo obligatorio)
  console.log("Revisando familia...");
  const errorFamilia = revisarCampoTexto(
    datos.family,
    "familia",
    true, // Obligatorio
    2, // Mínimo 2 caracteres
    50 // Máximo 50 caracteres
  );
  if (errorFamilia) {
    errores.push({ campo: "family", mensaje: errorFamilia });
  }

  // Revisar region
  console.log("Revisando región...");
    const regionesValidas = [
      "Islas del Pacífico",
      "Nueva Zelanda",
      "Australia",
    ];
  
    if(!datos.region || datos.region.trim() === ""){
      errores.push({
        campo: "region",
        mensaje: "Debe seleccionar una region"
      });
    } else if (!regionesValidas.includes(datos.region)){
      errores.push({
        campo: "region",
        mensaje: "La region seleccionada no es valida"
      })
    }
  

  // Revision ubicacion especifica
  console.log("Revisando ubicación específica...");
  if (datos.specificLocation) {
    const errorUbicacion = revisarCampoTexto(
      datos.specificLocation,
      "ubicación específica",
      false,
      0,
      200
    );
    if (errorUbicacion) {
      errores.push({ campo: "specificLocation", mensaje: errorUbicacion });
    }
  }

  // Revision del dato habitat
  console.log(" Revisando hábitat...");
  if (datos.habitat) {
    const errorHabitat = revisarCampoTexto(
      datos.habitat,
      "hábitat",
      false,
      0,
      200
    );
    if (errorHabitat) {
      errores.push({ campo: "habitat", mensaje: errorHabitat });
    }
  }

  // Revisar medida
  console.log("Revisando medidas...");
  if (datos.wingspan) {
    // Intentamos convertir a número
    const numeroMedidas = parseFloat(datos.wingspan);

    // Verificando de que sea un numero
    if (isNaN(numeroMedidas)) {
      errores.push({
        campo: "wingspan",
        mensaje: "La medidas debe ser un número",
      });
    } else {
      // ¿Es un número válido?
      if (numeroMedidas <= 0) {
        errores.push({
          // Se agregan al arrays errores para contarlos
          campo: "wingspan",
          mensaje: "La medidas debe ser mayor que 0",
        });
      }
      if (numeroMedidas > 999) {
        errores.push({
          campo: "wingspan",
          mensaje: "La medidas no puede ser mayor que 999",
        });
      }
    }
  }

  // Para revisar la unidad de medida
  console.log("Revisando unidad de medida...");
  if (datos.wingspanUnit) {
    // Lista de unidades que aceptamos
    const unidadesValidas = "cm";

    if (!unidadesValidas.includes(datos.wingspanUnit)) {
      errores.push({
        campo: "wingspanUnit",
        mensaje: "La unidad debe ser en cm ",
      });
    }
  }

  // Revision del nivel de amenaza (el campo es obligatorio)
  console.log("Revisando nivel de amenaza...");
  if (!datos.threatLevel || datos.threatLevel.trim() === "") {
    errores.push({
      campo: "threatLevel",
      mensaje: "El nivel de amenaza es obligatorio",
    });
  } else {
    // Lista de niveles válidos
    const nivelesValidos = [
      "vulnerable",
      "preocupacion menor",
      "Peligro Critico",
    ];

    if (!nivelesValidos.includes(datos.threatLevel)) {
      errores.push({
        campo: "threatLevel",
        mensaje: "El nivel debe ser: Low, Medium, High, o Critical",
      });
    }
  }

  // revisar plantas
  console.log("Revisando plantas ...");
  const errorPlantas = checkTestField(
    datos.hostPlants,
    "plantas hospederas",
    true, // Obligatorio
    2, // Mínimo 2 caracteres
    300 // Máximo 300 caracteres
  );
  if (errorPlantas) {
    errores.push({ campo: "hostPlants", mensaje: errorPlantas });
  }

  console.log("Revision terminada");
  console.log(`Total de errores encontrados: ${errores.length}`);

  // Devolvemos la lista de errores
  return errores;
};

// Validaciones para el POST
export const validarCrearMariposa = (req, res, next) => {
    console.log('Rellene los campos correspondientes');
    
    // Obtenemos los datos que mandó el usuario
    const datosDelUsuario = req.body;
    console.log('Datos del usuario:', datosDelUsuario);
    
    // Los validamos usando nuestra función
    const errores = validarDatosMariposa(datosDelUsuario);
    
    // ¿Hay errores?
    if (errores.length > 0) {
        console.log('Hay algun error al crear la mariposa, intentalo de nuevo');
        console.log('Errores:', errores);
        
        // Mandamos respuesta de error al usuario
        return res.status(400).json({
            exito: false,
            mensaje: 'Los datos tienen errores',
            errores: errores
        });
    }
    
    console.log('Proceso correcto para crear la mariposa');
    
    // Si no hay errores, continuamos al controlador
    next();
};