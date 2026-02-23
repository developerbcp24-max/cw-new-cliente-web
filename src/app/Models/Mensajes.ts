interface Mensajes {
  [clave: string]: string;
}

export const mensajes: Mensajes = {
  'banquero': 'Selecciona el numero de cuenta del banquero',
  'banqueroError': 'No se encontraron registros o tiene problemas relacionados con los banqueros.',
  'Rango_fechas': 'El rango de fechas no es correcto',
  'Cuentas': 'Selecciona un numero de cuenta',
  'Monto': 'El monto no es válido, verifícalo e inténtalo nuevamente',
  'Cambio': 'El tipo de cambio no es válido, verifícalo e inténtalo nuevamente',
  'ValidatTerminos': 'Por favor, acepta los términos y condiciones para poder continuar',
  'fondoOrigen': "El campo 'Origen de los Fondos' debe contener más de 20 caracteres, no incluir caracteres especiales y es obligatorio. Por favor, proporcione una descripción válida.",
  'fondoDestino': "El campo 'Destino de los Fondos' debe contener más de 20 caracteres, no incluir caracteres especiales y es obligatorio. Por favor, proporcione una descripción válida.",
  'Autorizador': 'Por favor, seleccione al menos un aprobador para continuar.',
  'MontoValid': 'El monto ingresado no puede ser mayor al monto ofertado.',
  'Ok': 'La solicitud de venta se registró correctamente. Ahora esperamos que los aprobadores seleccionados la aprueben.',
  'RangoFecha': 'Rango de fechas incorrecto. Asegúrese de que la fecha de inicio sea anterior a la fecha final.',
  // Respuestas informativas (100-199)
  '100': 'Continuar: El servidor ha recibido la solicitud y el cliente debe continuar con la solicitud o ignorarla si ya está terminada.',
  '101': 'Cambiando protocolos: El servidor acepta el cambio de protocolo propuesto por el cliente.',
  '102': 'Procesando: El servidor ha recibido la solicitud y está procesándola.',
  '103': 'Primeros indicios: El servidor está preparando una respuesta.',
  // Respuestas satisfactorias (200-299)
  '200': 'OK: La solicitud ha tenido éxito.',
  '201': 'Creado: La solicitud ha tenido éxito y se ha creado un nuevo recurso.',
  '202': 'Aceptado: La solicitud ha sido aceptada para procesamiento, pero no se ha completado.',
  '203': 'Información no autorizada: La solicitud ha tenido éxito, pero la información puede ser de otra fuente.',
  '204': 'Sin contenido: La solicitud ha tenido éxito, pero no hay contenido para enviar.',
  '205': 'Restablecer contenido: La solicitud ha tenido éxito y el agente de usuario debe restablecer la vista.',
  '206': 'Contenido parcial: El servidor está entregando solo parte del recurso.',
  // Redirecciones (300-399)
  '300': 'Múltiples opciones: Hay varias opciones para el recurso solicitado.',
  '301': 'Movido permanentemente: El recurso solicitado ha sido movido permanentemente a una nueva URL.',
  '302': 'Encontrado: El recurso solicitado se encuentra temporalmente en una URL diferente.',
  '303': 'Ver otro: El cliente debe usar una URL diferente para acceder al recurso.',
  '304': 'No modificado: El recurso no ha sido modificado desde la última solicitud.',
  '307': 'Redirección temporal: El recurso solicitado se encuentra temporalmente en una URL diferente.',
  '308': 'Redirección permanente: El recurso solicitado ha sido movido permanentemente a una nueva URL.',
  // Errores del cliente (400-499)
  '400': 'Solicitud incorrecta: El servidor no puede procesar la solicitud debido a un error del cliente.',
  '401': 'No autorizado: La solicitud requiere autenticación del usuario.',
  '403': 'Prohibido: El servidor entiende la solicitud, pero se niega a autorizarla.',
  '404': 'No encontrado: El servidor no puede encontrar el recurso solicitado.',
  '405': 'Método no permitido: El método de solicitud no está permitido para el recurso solicitado.',
  '408': 'Tiempo de espera agotado: El servidor agotó el tiempo de espera para la solicitud.',
  '409': 'Conflicto: La solicitud no se puede completar debido a un conflicto con el estado actual del recurso.',
  '410': 'Gone: El recurso solicitado ya no está disponible y no lo estará nuevamente.',
  '429': 'Demasiadas solicitudes: El cliente ha enviado demasiadas solicitudes en un tiempo determinado.',
  // Errores del servidor (500-599)
  '500': 'Error interno del servidor: El servidor encontró una condición inesperada que le impide completar la solicitud.',
  '501': 'No implementado: El servidor no reconoce el método de solicitud o no tiene la capacidad para completarlo.',
  '502': 'Bad Gateway: El servidor recibió una respuesta inválida del servidor ascendente.',
  '503': 'Servicio no disponible: El servidor no está listo para manejar la solicitud.',
  '504': 'Gateway Timeout: El servidor no recibió una respuesta a tiempo del servidor ascendente.',
  '505': 'Versión HTTP no soportada: El servidor no soporta la versión del protocolo HTTP utilizada en la solicitud.'
};
