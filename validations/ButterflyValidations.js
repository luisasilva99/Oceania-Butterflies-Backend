// PASO 1: Función que revisa un campo por vez 
function revisarCampoTexto(valor, nombre, esObligatorio, minimo, maximo) {
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

// Esta es la funcion que verifica todos los campos que se encuentran en el modelo
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

  // Revisar region (CORREGIDO)
  console.log("Revisando región...");
  const regionesValidas = [
    "Islas del Pacífico",
    "Nueva Zelanda",
    "Australia",
  ];

  if(!datos.region || datos.region.trim() === ""){
    errores.push({
      campo: "region",
      mensaje: "Debe seleccionar una región"
    });
  } else if (!regionesValidas.includes(datos.region)){
    errores.push({
      campo: "region",
      mensaje: "La región debe ser: Islas del Pacífico, Nueva Zelanda, o Australia"
    });
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
  console.log("Revisando hábitat...");
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

    // Verificando que sea un numero
    if (isNaN(numeroMedidas)) {
      errores.push({
        campo: "wingspan",
        mensaje: "La medida debe ser un número",
      });
    } else {
      // ¿Es un número válido?
      if (numeroMedidas <= 0) {
        errores.push({
          campo: "wingspan",
          mensaje: "La medida debe ser mayor que 0",
        });
      }
      if (numeroMedidas > 999) {
        errores.push({
          campo: "wingspan",
          mensaje: "La medida no puede ser mayor que 999",
        });
      }
    }
  }

  // Para revisar la unidad de medida
  console.log("Revisando unidad de medida...");
  if (datos.wingspanUnit) {
    // Lista de unidades que aceptamos 
    const unidadesValidas = ["cm", "mm", "inch"];

    if (!unidadesValidas.includes(datos.wingspanUnit)) {
      errores.push({
        campo: "wingspanUnit",
        mensaje: "La unidad debe ser: cm, mm o inch",
      });
    }
  }

  // Revision del nivel de amenaza 
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
      "Critico"
    ];

    if (!nivelesValidos.includes(datos.threatLevel)) {
      errores.push({
        campo: "threatLevel",
        mensaje: "El nivel debe ser: Low, Medium, High, Critical, vulnerable, preocupacion menor, o Peligro Critico",
      });
    }
  }

  // revisar plantas 
  console.log("Revisando plantas hospederas...");
  const errorPlantas = revisarCampoTexto(
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

// Validación para obtener una mariposa por ID
export const validateOneButterfly= (req, res, next) => {
    try {
        console.log('Validando ID para obtener una mariposa...');
        
        const { id } = req.params;
        console.log('ID recibido:', id);
        
        // Validar que el ID esté presente
        if (!id) {
            console.log('Error: ID no proporcionado');
            return res.status(400).json({ 
                exito: false,
                mensaje: "El ID es requerido" 
            });
        }
        
        // Validar que el ID sea un número válido
        const numeroId = parseInt(id);
        if (isNaN(numeroId)) {
            console.log('Error: ID no es un número válido');
            return res.status(400).json({ 
                exito: false,
                mensaje: "El ID debe ser un número válido" 
            });
        }
        
        // Validar que el ID sea un número positivo
        if (numeroId <= 0) {
            console.log('Error: ID debe ser positivo');
            return res.status(400).json({ 
                exito: false,
                mensaje: "El ID debe ser un número positivo" 
            });
        }
        
        console.log('Validación de ID exitosa');
        next();
        
    } catch (error) {
        console.log('Error en validación:', error);
        return res.status(500).json({ 
            exito: false,
            mensaje: "Error en la validación", 
            error: error.message 
        });
    }
};

// Validación para obtener todas las mariposas
export const validateAllButterflies = (req, res, next) => {
    try {
        console.log('Validando parámetros para obtener todas las mariposas...');
        
        const { page, limit, sortBy, order } = req.query;
        console.log('Query parameters:', { page, limit, sortBy, order });
        
        // Validar paginación si se envía
        if (page) {
            const numeroPagina = parseInt(page);
            if (isNaN(numeroPagina) || numeroPagina <= 0) {
                console.log('Error: Número de página inválido');
                return res.status(400).json({ 
                    exito: false,
                    mensaje: "El número de página debe ser un número positivo" 
                });
            }
        }
        
        if (limit) {
            const numeroLimite = parseInt(limit);
            if (isNaN(numeroLimite) || numeroLimite <= 0) {
                console.log('Error: Límite inválido');
                return res.status(400).json({ 
                    exito: false,
                    mensaje: "El límite debe ser un número positivo" 
                });
            }
            
            // Opcional: validar límite máximo
            if (numeroLimite > 100) {
                console.log('Error: Límite muy alto');
                return res.status(400).json({ 
                    exito: false,
                    mensaje: "El límite no puede ser mayor que 100" 
                });
            }
        }
        
        // Validar orden si se envía
        if (order && !['ASC', 'DESC', 'asc', 'desc'].includes(order)) {
            console.log('Error: Orden inválido');
            return res.status(400).json({ 
                exito: false,
                mensaje: "El orden debe ser ASC o DESC" 
            });
        }
        
        // Validar campo de ordenamiento
        if (sortBy) {
            const camposValidos = ['id', 'commonName', 'scientificName', 'family', 'region', 'createdAt', 'updatedAt'];
            if (!camposValidos.includes(sortBy)) {
                console.log('Error: Campo de ordenamiento inválido');
                return res.status(400).json({
                    exito: false,
                    mensaje: "El campo de ordenamiento no es válido",
                    camposValidos: camposValidos
                });
            }
        }
        
        console.log('Validación de query parameters exitosa');
        next();
        
    } catch (error) {
        console.log('Error en validación:', error);
        return res.status(500).json({ 
            exito: false,
            mensaje: "Error en la validación", 
            error: error.message 
        });
    }
};

// Validación para eliminar una mariposa por ID
export const validateDeleteButterfly = (req, res, next) => {
    try {
        console.log('Validando ID para eliminar mariposa...');
        
        const { id } = req.params;
        console.log('ID para eliminar:', id);
        
        // Validar que el ID esté presente
        if (!id) {
            console.log('Error: ID no proporcionado para eliminación');
            return res.status(400).json({ 
                exito: false,
                mensaje: "El ID es requerido para eliminar la mariposa" 
            });
        }
        
        // Validar que el ID sea un número válido
        const numeroId = parseInt(id);
        if (isNaN(numeroId)) {
            console.log('Error: ID no es un número válido para eliminación');
            return res.status(400).json({ 
                exito: false,
                mensaje: "El ID debe ser un número válido" 
            });
        }
        
        // Validar que el ID sea un número positivo
        if (numeroId <= 0) {
            console.log('Error: ID debe ser positivo para eliminación');
            return res.status(400).json({ 
                exito: false,
                mensaje: "El ID debe ser un número positivo" 
            });
        }
        
        console.log('Validación de ID para eliminación exitosa');
        next();
        
    } catch (error) {
        console.log('Error en validación de eliminación:', error);
        return res.status(500).json({ 
            exito: false,
            mensaje: "Error en la validación", 
            error: error.message 
        });
    }
};

// Validaciones para el POST 
export const  validateCreateButterfly = (req, res, next) => {
    console.log('Rellenando los campos correspondientes...');
    
    // Obtenemos los datos que mandó el usuario
    const datosDelUsuario = req.body;
    console.log('Datos del usuario:', datosDelUsuario);
    
    // Los validamos usando nuestra función
    const errores = validarDatosMariposa(datosDelUsuario);
    
    // Si hay algun tipo de error, entonces se vera en la consola
    if (errores.length > 0) {
        console.log('Hay errores al crear la mariposa, intentalo de nuevo');
        console.log('Errores:', errores);
        
        // Mandamos respuesta de error al usuario
        return res.status(400).json({
            exito: false,
            mensaje: 'Los datos tienen errores',
            errores: errores
        });
    }
    
    console.log('Validación correcta para crear la mariposa');
    
    // Si no hay errores, continuamos al controlador
    next();
};

// Validaciones para el PUT 
export const validarUpdateButterfly = (req, res, next) => {
    console.log('Comenzando validación para actualizar...');
    
    const datosDelUsuario = req.body;
    console.log('Datos para actualizar:', datosDelUsuario);
    
    // Para actualizar, solo revisamos los campos que vengan
    // No exigimos que estén todos los obligatorios
    const errores = [];
    
    // Si viene nombre común, lo revisamos
    if (datosDelUsuario.commonName !== undefined) {
        const error = revisarCampoTexto(datosDelUsuario.commonName, 'nombre común', false, 2, 100);
        if (error) errores.push({ campo: 'commonName', mensaje: error });
    }
    
    // Si viene nombre científico, lo revisamos
    if (datosDelUsuario.scientificName !== undefined) {
        const error = revisarCampoTexto(datosDelUsuario.scientificName, 'nombre científico', false, 3, 100);
        if (error) errores.push({ campo: 'scientificName', mensaje: error });
    }
    
    // Si viene familia, la revisamos
    if (datosDelUsuario.family !== undefined) {
        const error = revisarCampoTexto(datosDelUsuario.family, 'familia', false, 2, 50);
        if (error) errores.push({ campo: 'family', mensaje: error });
    }
    
    // Si viene región, la revisamos
    if (datosDelUsuario.region !== undefined) {
        console.log('Revisando la región en actualización...');
        
        // Si viene algo (no null o vacío), validamos
        if (datosDelUsuario.region !== null && datosDelUsuario.region !== '') {
            const regionesValidas = [
                'Islas del Pacífico',
                'Nueva Zelanda', 
                'Australia'
            ];
            
            const regionLimpia = datosDelUsuario.region.trim();
            
            if (!regionesValidas.includes(regionLimpia)) {
                errores.push({ 
                    campo: 'region', 
                    mensaje: 'La región debe ser: Islas del Pacífico, Nueva Zelanda, o Australia' 
                });
            }
        }
    }
    
    // Si viene publicId, lo revisamos
    if (datosDelUsuario.publicId !== undefined) {
        console.log('Revisando publicId...');
        
        // Si viene algo (no null), validamos
        if (datosDelUsuario.publicId !== null && datosDelUsuario.publicId !== '') {
            const publicIdLimpio = datosDelUsuario.publicId.trim();
            
            // Verificar longitud
            if (publicIdLimpio.length < 10) {
                errores.push({ 
                    campo: 'publicId', 
                    mensaje: 'El ID de la imagen es demasiado corto (mínimo 10 caracteres)' 
                });
            }
            
            if (publicIdLimpio.length > 100) {
                errores.push({ 
                    campo: 'publicId', 
                    mensaje: 'El ID de la imagen es demasiado largo (máximo 100 caracteres)' 
                });
            }
            
            // Verificar formato
            const formatoValidoCloudinary = /^[a-zA-Z0-9_-]+$/;
            if (!formatoValidoCloudinary.test(publicIdLimpio)) {
                errores.push({ 
                    campo: 'publicId', 
                    mensaje: 'El ID de la imagen tiene formato inválido' 
                });
            }
        }
    }
    
    // ¿Hay errores?
    if (errores.length > 0) {
        console.log('Hay errores en algunos datos, revisa');
        return res.status(400).json({
            exito: false,
            mensaje: 'Los datos tienen errores',
            errores: errores
        });
    }
    
    console.log('Actualización validada correctamente!');
    next();
};