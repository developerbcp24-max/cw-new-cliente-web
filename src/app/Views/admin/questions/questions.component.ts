import { Component } from '@angular/core';

@Component({
	selector: 'app-questions',
	standalone: false,
	templateUrl: './questions.component.html',
	styleUrl: './questions.component.css'
})
export class QuestionsComponent {
faqs = [
	{
		pregunta: '¿Cuáles son los requisitos para afiliarme a los servicios de Credinet Web?',
		respuesta: 'Ser cliente del banco, mantener cuentas de ahorro o cuentas corrientes. Enviar al ejecutivo comercial o funcionario de negocios la cartilla de instructivo para la elaboración del contrato y posterior firma del mismo por parte de los representantes legales de la empresa.',
		abierto: false,
	},
	{
		pregunta: '¿Cuál es la línea gratuita de soporte para Credinet Web?',
		respuesta: 'Puede contactase al número 800-10-2244.',
		abierto: false,
	},
	{
		pregunta: '¿Cuál es el buzon de correo para soporte Credinet Web de solicitudes y consultas?',
		respuesta: 'Puede contactarse a la dirección de correo BolHdSpE@bancred.com.bo',
		abierto: false,
	},
	{
		pregunta: '¿Cuál es el teléfono de Mesa de dinero para ticket de cambio y comisiones preferenciales?',
		respuesta: 'Puede contactarse al número 800-10-9995.',
		abierto: false,
	},
	{
	pregunta: '¿Quién es el ejecutivo comercial asignado a mi empresa?',
	respuestaHtml: `

		<p>Puede contactarse con nuestra línea gratuita de Help Desk 800-10-2244 o al área de Servicio para Empresas.</p>
		<p>Para contactarte con nosotros puedes llamar a los siguientes números:</p>
		<ul class="list-disc list-inside ml-4">
			<li>La Paz 211-4141</li>
			<li>Santa Cruz 311-4141</li>
			<li>Cochabamba 411-4141</li>
			<li>Resto de Departamentos 211-4141</li>
		</ul>
		<p>También puedes escribir a <a href="mailto:BxT@bcp.com.bo" class="text-blue-600 underline">BxT@bcp.com.bo</a></p>
	`,
	abierto: false,
	},
		{
			pregunta: '¿Qué horarios tienen las operaciones manuales en Credinet Web?',
			respuesta: 'Puede acceder a nuestros horarios en la página de ingreso al Credinet Web “Funciones y Características” / Horarios y Oficinas.',
			abierto: false,
		},
		{
			pregunta: '¿Dónde obtengo los macros de Pagos Masivos?',
			respuesta: 'Puede acceder a los macros en la sección de “Manuales”, ubicada en la parte superior de esta pantalla',
			abierto: false,
		},
		{
			pregunta: 'Códigos Swift de bancos en el extranjero:',
			respuesta: 'Puede contactarse con el área de Negocios Internacionales para realizar la consulta del código Swift del banco en el exterior al 217500 int. 2367 o al buzón de correo: NegociosInternacionalesBol@bancred.com.bo',
			abierto: false,
		},
		{
			pregunta: '¿Qué hacer cuando mi número de acceso se bloquea?',
			respuesta: 'Puede solicitar el desbloqueo mediante nuestro chat de OlivIA, siguiendo los parametros de seguridad, vía WhatsApp. en este link....',
			abierto: false,
		},
		{
			pregunta: '¿Qué hacer cuando mi Token en la aplicación Credinet Móvil se bloquea? ',
			respuesta: 'Puede contactarse con nuestra línea gratuita de Help Desk 800-10-2244 para realizar un desbloqueo en línea de su Token VU.',
			abierto: false,
		},
		{
			pregunta: 'Como incluir o quitar a usuarios autorizadores en Credinet Web?',
			respuesta: 'Contactar a su ejecutivo comercial para solicitar el Anexo de Autorizadores donde podrá incluir a nuevos autorizadores. En caso de necesitar retirar un usuario autorizador, debe enviar una carta con firmas autorizadas con las respectivas instrucciones.',
			abierto: false,
		},
		{
			pregunta: '¿Dónde obtengo los anexos para modificaciones en Credinet Web?',
			respuesta: 'Contactar a su ejecutivo comercial y solicitar el Anexo correspondiente.',
			abierto: false,
		},
		{
			pregunta: '¿Cómo adicionar una cuenta al sistema Credinet Web?',
			respuesta: 'En caso de necesitar retirar un usuario debe enviar una carta con firmas autorizadas con las respectivas instrucciones. Otra alternativa es ingresar a solicitud de modificaciones y realizar la operación de cambios en su Credinet Web.',
			abierto: false,
		},
		{
	pregunta: '¿Cuáles son los requisitos para incrementar el límite de operaciones de empresa?',
	respuestaHtml: `
		<p>Contactanos:</p>

		<div class="mt-4 border border-gray-200 rounded-lg overflow-hidden">
			<div class="grid grid-cols-2 bg-gray-100 p-3 text-sm font-semibold text-gray-600">
				<div>Ciudad</div>
				<div>Teléfono</div>
			</div>
			<div class="divide-y divide-gray-200">
				<div class="grid grid-cols-2 p-3 text-sm text-gray-800">
					<div>La Paz</div>
					<div>2175000 Int. 5111 ó 5116</div>
				</div>
				<div class="grid grid-cols-2 p-3 text-sm text-gray-800">
					<div>Santa Cruz</div>
					<div>3175000 Int. 3434 ó 3408</div>
				</div>
				<div class="grid grid-cols-2 p-3 text-sm text-gray-800">
					<div>Cochabamba</div>
					<div>4175000 Int. 4325</div>
				</div>

			</div>
		</div>
		<p class="mt-4">También puedes escribir a <a href="mailto:BxT@bcp.com.bo" class="text-blue-600 underline">BxT@bcp.com.bo</a></p>
	`,
	abierto: false,
}
	];

	toggle(index: number) {
		this.faqs[index].abierto = !this.faqs[index].abierto;
	}
}
