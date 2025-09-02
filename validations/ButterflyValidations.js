
// PASO 1: Crear una función que revise un campo por vez
function revisarCampoTexto(valor, nombre, esObligatorio, minimo, maximo) {
    // Esta función revisa si un texto está bien o mal
    
    console.log(`Revision de: ${nombre}`); // Para ver qué estamos revisando
    
    if (!valor || valor.trim() === '') { // Si el valor es diferente y se limpia algun espacio del texto es igual a nada, vacio entonces pasa a la condicion de pasar el mensaje
        if (esObligatorio) {
            return `El campo ${nombre} es obligatorio`; // Se devuelve el mensaje
        } else {
            return null; // No hay error porque no es obligatorio
        }
    }
    
    // Limpiamos el texto (quitamos espacios al inicio y final)
    const textoLimpio = valor.trim();
    
    // ¿El texto es muy corto?
    if (textoLimpio.length < minimo) {
        return `${nombre} debe tener al menos ${minimo} caracteres`;
    }
    
    // ¿El texto es muy largo?
    if (textoLimpio.length > maximo) {
        return `${nombre} no puede tener más de ${maximo} caracteres`;
    }
    //Everything esta bien
    return null; // no retorna nada porque esta bien
}

// PASO 2: Función principal que revisa TODOS los campos
export const validarDatosMariposa = (datos) => {
    console.log('🔍 EMPEZANDO A VALIDAR DATOS DE MARIPOSA');
    console.log('Datos recibidos:', datos);
    
    // Creamos una lista para guardar los errores
    const errores = [];
    
    // REVISAR NOMBRE COMÚN (obligatorio)
    console.log('Revisando nombre común...');
    const errorNombreComun = revisarCampoTexto(
        datos.commonName,  // El valor que queremos revisar
        'nombre común',    // Nombre para mostrar en error
        true,             // ¿Es obligatorio? Sí
        2,                // Mínimo 2 caracteres
        100               // Máximo 100 caracteres
    );
    if (errorNombreComun) {
        errores.push({ campo: 'commonName', mensaje: errorNombreComun });
    }
    
    // REVISAR NOMBRE CIENTÍFICO (obligatorio)
    console.log('Revisando nombre científico...');
    const errorNombreCientifico = revisarCampoTexto(
        datos.scientificName,
        'nombre científico',
        true,  // Obligatorio
        3,     // Mínimo 3 caracteres
        100    // Máximo 100 caracteres
    );
    if (errorNombreCientifico) {
        errores.push({ campo: 'scientificName', mensaje: errorNombreCientifico });
    }
    
    // REVISAR FAMILIA (obligatorio)
    console.log('Revisando familia...');
    const errorFamilia = revisarCampoTexto(
        datos.family,
        'familia',
        true,  // Obligatorio
        2,     // Mínimo 2 caracteres
        50     // Máximo 50 caracteres
    );
    if (errorFamilia) {
        errores.push({ campo: 'family', mensaje: errorFamilia });
    }
    
    // REVISAR REGIÓN (opcional)
    console.log('Revisando región...');
    if (datos.region) { // Solo la revisamos si viene algo
        const errorRegion = revisarCampoTexto(
            datos.region,
            'región',
            false, // NO es obligatorio
            0,     // Mínimo 0 (no importa)
            100    // Máximo 100 caracteres
        );
        if (errorRegion) {
            errores.push({ campo: 'region', mensaje: errorRegion });
        }
    }
    
    // REVISAR UBICACIÓN ESPECÍFICA (opcional)
    console.log( 'Revisando ubicación específica...');
    if (datos.specificLocation) {
        const errorUbicacion = revisarCampoTexto(
            datos.specificLocation,
            'ubicación específica',
            false,
            0,
            200
        );
        if (errorUbicacion) {
            errores.push({ campo: 'specificLocation', mensaje: errorUbicacion });
        }
    }
    
    // REVISAR HÁBITAT (opcional)
    console.log(' Revisando hábitat...');
    if (datos.habitat) {
        const errorHabitat = revisarCampoTexto(
            datos.habitat,
            'hábitat',
            false,
            0,
            200
        );
        if (errorHabitat) {
            errores.push({ campo: 'habitat', mensaje: errorHabitat });
        }
    }
    
    // Revisar medida(opcional, pero si viene debe ser un número)
    console.log('Revisando envergadura...');
    if (datos.wingspan) {
        // Intentamos convertir a número
        const numeroEnvergadura = parseFloat(datos.wingspan);
        
        // ¿Se pudo convertir a número?
        if (isNaN(numeroEnvergadura)) {
            errores.push({ 
                campo: 'wingspan', 
                mensaje: 'La envergadura debe ser un número' 
            });
        } else {
            // ¿Es un número válido?
            if (numeroEnvergadura <= 0) {
                errores.push({ 
                    campo: 'wingspan', 
                    mensaje: 'La envergadura debe ser mayor que 0' 
                });
            }
            if (numeroEnvergadura > 999) {
                errores.push({ 
                    campo: 'wingspan', 
                    mensaje: 'La envergadura no puede ser mayor que 999' 
                });
            }
        }
    }
    
    // Para revisar la unidad de medida
    console.log('Revisando unidad de medida...');
    if (datos.wingspanUnit) {
        // Lista de unidades que aceptamos
        const unidadesValidas = ['mm', 'cm', 'm', 'in'];
        
        // ¿La unidad está en nuestra lista?
        if (!unidadesValidas.includes(datos.wingspanUnit)) {
            errores.push({ 
                campo: 'wingspanUnit', 
                mensaje: 'La unidad debe ser: mm, cm, m, o in' 
            });
        }
    }
    
    // REVISAR NIVEL DE AMENAZA (obligatorio)
    console.log('Revisando nivel de amenaza...');
    if (!datos.threatLevel || datos.threatLevel.trim() === '') {
        errores.push({ 
            campo: 'threatLevel', 
            mensaje: 'El nivel de amenaza es obligatorio' 
        });
    } else {
        // Lista de niveles válidos
        const nivelesValidos = ['Low', 'Medium', 'High', 'Critical'];
        
        if (!nivelesValidos.includes(datos.threatLevel)) {
            errores.push({ 
                campo: 'threatLevel', 
                mensaje: 'El nivel debe ser: Low, Medium, High, o Critical' 
            });
        }
    }
    
    // REVISAR PLANTAS HOSPEDERAS (obligatorio)
    console.log('Revisando plantas hospederas...');
    const errorPlantas = revisarCampoTexto(
        datos.hostPlants,
        'plantas hospederas',
        true,  // Obligatorio
        2,     // Mínimo 2 caracteres
        300    // Máximo 300 caracteres
    );
    if (errorPlantas) {
        errores.push({ campo: 'hostPlants', mensaje: errorPlantas });
    }
    
    console.log('Revision terminada');
    console.log(`Total de errores encontrados: ${errores.length}`);
    
    // Devolvemos la lista de errores
    return errores;
};

