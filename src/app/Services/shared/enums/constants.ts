export class Constants {

  public static currencyBol = 'BOL';
  public static currencyUsd = 'USD';
  public static DOCUMENT_CI = 'Q';
  public static DOCUMENT_FISCALID = 'W';
  public static DOCUMENT_NIT = 'T';
  public static DOCUMENT_PASSPORT = 'P';
  public static DOCUMENT_RUN = 'U';
  public static DEFAULT_EXTENSION = '000';
  public static EMPTY_STRING = '';
  public static SALARIES_PAYMENT = 'HAB';
  public static PROVIDERS_PAYMENT = 'PROV';
  public static CASH_PAYMENT = 'EFE';
  public static ACH_PAYMENT = 'ACH';
  public static TYPEOFLOAD_MANUAL = 'MAN';
  public static TYPEOFLOAD_AUTOMATIC = 'ANT';
  public static TYPEOFLOAD_FILECHARGE = 'TXT';
  public static CIVIL_STATE = 'ESTCIV';
  public static OBJECT_BALLOT_OF_WARRANTY = 'BG_BOL';
  public static TYPE_WARRANTY = 'TIPGAR';
  public static AMOUNT_ROE = 'CODCOM';


  public static serviceRUAT = 'ruat';
  public static serviceAFP = 'afp';

  public static ruatVehicles = 'V';
  public static ruatProperties = 'I';


  public static currencies = [
    { name: 'BOLIVIANOS', value: Constants.currencyBol },
    { name: 'DOLARES', value: Constants.currencyUsd },
  ];

  public static civilStatus = [
    { name: 'CASADO', value: 'C' },
    { name: 'DIVORCIADO', value: 'D' },
    { name: 'SOLTERO', value: 'S' },
    { name: 'VIUDO(A)', value: 'V' },
  ];

  public static basicServices = [
    { name: 'CRE', value: 1 },
    { name: 'DELAPAZ', value: 2 },
    { name: 'SAGUAPAC', value: 11 },
    { name: 'TELEFONÍA FIJA', value: 3 },
    { name: 'TELEFONÍA MÓVIL', value: 4 },
  ];

  public static ruatServices = [
    { name: 'PAGO RUAT VEHÍCULOS', value: Constants.ruatVehicles },
    { name: 'PAGO RUAT INMUEBLES', value: Constants.ruatProperties }
  ];

  public static ruatDocumentExtensions = [
    { name: 'LP', value: '2', },
    { name: 'SC', value: '7' },
    { name: 'CO', value: '3' },
    { name: 'CH', value: '1' },
    { name: 'OR', value: '4' },
    { name: 'PO', value: '5' },
    { name: 'TA', value: '6' },
    { name: 'BE', value: '8' },
    { name: 'PA', value: '9' }
  ];

  public static description_funds = 'SIN INFORMACION';
  public static typeTransaction = 'LAVA';
  public static trace = 'SIN TRACE';
  public static branchOffice = '201204';

  public static rejectionOperation = 3;

  public static successfulTransactionMessage = "Su operación ha sido enviada satisfactoriamente a 'Lotes Pendientes de Confirmación' desde donde el(los) usuario(s) que cuente(n) con los permisos, podrán confirmar la transacción.Una vez aprobada su operación, es muy importante que pueda verificar en la pantalla de 'Seguimiento' hasta comprobar que su operación se procesó correctamente N° Lote";
  public creService = 'PAGO DE SERVICIOS CRE';
  public afpService = 'PAGO DE SERVICIOS APORTES A AFP';
  public saguapacService = 'PAGO DE SERVICIOS SAGUAPAC';
  public delapazService = 'PAGO DE SERVICIO DELAPAZ';
  public fixedTelephonyService = 'PAGO DE SERVICIOS TELEFONÍA FIJA';
  public mobileTelephonyService = 'PAGO DE SERVICIOS TELEFONÍA MÓVIL';
  public vehicleRuatService = 'PAGO DE SERVICIOS IMPUESTOS DE VEHÍCULOS';
  public propertyRuatService = 'PAGO DE SERVICIOS IMPUESTOS DE INMUEBLES';
  public elfecService = 'PAGO DE SERVICIOS ELFEC';
  public epsasService = 'PAGO DE SERVICIO EPSAS';
  public semapaService = 'PAGO DE SERVICIO SEMAPA';
  public telephonyService = 'PAGO DE SERVICIO TELEFONÍA';
  public telephonyServiceEntel = 'PAGO TELEFONIA ENTEL';
  public telephonyServiceTigo = 'PAGO TELEFONIA TIGO';
  public telephonyServiceCotas = 'PAGO DE SERVICIOS COTAS';
  public naturalGasService = 'PAGO DE SERVICIOS GAS NATURAL';
  public ypfbService = 'PAGO DE SERVICIOS YPFB';
  public serviceAxs = 'PAGO DE SERVICIOS AXS';
  public serviceComteco = 'PAGO DE SERVICIOS COMTECO';
  public serviceElfec = 'PAGO DE SERVICIOS ELFEC';
  public genericService = 'PAGO DE SERVICIOS ';

  documentTypes: Array<any> = [
    { name: 'C.I.', value: 'Q' },
    { name: 'I.D. FISCAL', value: 'W' },
    { name: 'NIT', value: 'T' },
    { name: 'PASAPORTE', value: 'P' },
    { name: 'RUN', value: 'U' },
  ];

  documentTypesCash: Array<any> = [
    { name: 'C.I.', value: 'Q' },
    { name: 'PASAPORTE', value: 'P' },
    { name: 'RUN', value: 'U' }
  ];

  public documentTypesMasivePayments = [
    { name: 'OTRO', value: 'O' },
    { name: 'C.I.', value: 'Q' },
    { name: 'I.D. FISCAL', value: 'W' },
    { name: 'NIT', value: 'T' },
    { name: 'RUC', value: 'R' },
    { name: 'PASAPORTE', value: 'P' },
    { name: 'RUN', value: 'U' },
    { name: 'COD. GEN. BANCO', value: 'Y' },
  ];

  public documentExtensionsMasivePayments = [
    { name: 'LA PAZ', value: 'LP' },
    { name: 'COCHABAMBA', value: 'CB' },
    { name: 'SANTA CRUZ', value: 'SC' },
    { name: 'ORURO', value: 'OR' },
    { name: 'CHUQUISACA', value: 'CH' },
    { name: 'POTOSI', value: 'PO' },
    { name: 'BENI', value: 'BE' },
    { name: 'PANDO', value: 'PA' },
    { name: 'TARIJA', value: 'TJ' },
    { name: 'PERSONA EXTRANJERA', value: 'PE' },
    { name: 'DESCONOCIDO', value: 'NN' },
    { name: 'SIN EXTENSION', value: 'SN' },
  ];

  public branchOffices = [
    { name: 'CHUQUISACA', value: '101' },
    { name: 'LA PAZ', value: '201' },
    { name: 'COCHABAMBA', value: '301' },
    { name: 'ORURO', value: '401' },
    { name: 'POTOSÍ', value: '501' },
    { name: 'TARIJA', value: '601' },
    { name: 'SANTA CRUZ', value: '701' },
    { name: 'BENI', value: '801' },
  ];

  public branchOfficesNational = [
    { name: 'CHUQUISACA', value: '101' },
    { name: 'LA PAZ', value: '201' },
    { name: 'COCHABAMBA', value: '301' },
    { name: 'ORURO', value: '401' },
    { name: 'POTOSÍ', value: '501' },
    { name: 'TARIJA', value: '601' },
    { name: 'SANTA CRUZ', value: '701' },
    { name: 'BENI', value: '801' },
    { name: 'PANDO', value: '901' },
  ];

  public branchOfficesPase = [
    { name: 'LA PAZ', value: '701' },
    { name: 'ORURO', value: '702' },
    { name: 'POTOSI', value: '703' },
    { name: 'CHUCHISACA', value: '704' },
    { name: 'SANTA CRUZ', value: '705' },
    { name: 'COCHABAMBA', value: '706' },
    { name: 'BENI', value: '707' },
    { name: 'PANDO', value: '708' },
    { name: 'TARIJA', value: '709' },
  ];

  public static  branchOfficesBallotOfWarranty = [
    { name: 'CHUQUISACA', value: '101' },
    { name: 'LA PAZ', value: '201' },
    { name: 'COCHABAMBA', value: '301' },
    { name: 'ORURO', value: '401' },
    { name: 'POTOSI', value: '501' },
    { name: 'TARIJA', value: '601' },
    { name: 'SANTA CRUZ', value: '701' },
    { name: 'BENI', value: '801' },
  ];
  public cities: string[] = ['LA PAZ', 'COCHABAMBA', 'SANTA CRUZ', 'ORURO',
    'CHUQUISACA', 'POTOSÍ', 'BENI', 'PANDO', 'TARIJA'];

  public streetTypes: string[] = ['Avenida', 'Calle'];

  public documentExtensions = [
    { name: 'LA PAZ', value: 'LP' },
    { name: 'COCHABAMBA', value: 'CB' },
    { name: 'SANTA CRUZ', value: 'SC' },
    { name: 'ORURO', value: 'OR' },
    { name: 'CHUQUISACA', value: 'CH' },
    { name: 'POTOSI', value: 'PO' },
    { name: 'BENI', value: 'BE' },
    { name: 'PANDO', value: 'PA' },
    { name: 'TARIJA', value: 'TJ' },
    { name: 'PERSONA EXTRANJERA', value: 'PE' },
  ];

  TYPE_NATURAL_PERSON = 'PN';
  TYPE_LEGAL_PERSON = 'PJ';
  DEPOSIT_PLACE = 'DPF';
  FUND_PLEDGE = 'PDF';
  CREDIT_LINE = 'LRC';

  public static messagePrePreparer = 'Estimado cliente, su operación será pre-guardado y enviado a la bandeja de pendientes.';

  public static messageQrPreparer = 'El tiempo de generación por cada QR es de aproximadamente 30 segundos, por favor no cierre ni actualice la pagina de Credinet.';


  public searchCodeEntel = [
    { nameCompany: 'TELÉFONO', serviceCode: '3' },
    { nameCompany: 'CUENTA', serviceCode: '2' },
    { nameCompany: 'CLIENTE', serviceCode: '1' }
  ];

  public branchOfficesDirection = [
    { name: 'CALLE PLAZA 25 DE MAYO (OFICINA CENTRAL CHUQUISACA AREA EXPEDICIÓN) Número. 28', value: '101' },
    { name: 'CALLE COLÓN ESQUINA MERCADO (OFICINA PRINCIPAL LA PAZ AREA EXPEDICIÓN) Número. 1308 Zona: CENTRAL', value: '201' },
    { name: 'CALLE NATANIEL AGUIRRE ESQUINA CALAMA (OFICINA CENTRAL COCHABAMBA AREA EXPEDICIÓN) Número. S-0498 Zona: CENTRAL', value: '301' },
    { name: 'CALLE PRESIDENTE MONTES ESQUINA BOLIVAR (OFICINA CENTRAL ORURO AREA EXPEDICIÓN) Número. Zona: PLAZA 10 DE FEBRERO', value: '401' },
    { name: 'CALLE SUCRE ESQUINA BOLIVAR (OFICINA CENTRAL POTOSI AREA EXPEDICIÓN) Número. 855', value: '501' },
    { name: 'CALLE GENERAL TRIGO (OFICINA CENTRAL TARIJA AREA EXPEDICIÓN) Número. 0784', value: '601' },
    { name: 'CALLE 24 DE SEPTIEMBRE (OFICINA CENTRAL SANTA CRUZ AREA EXPEDICIÓN) Número. 158', value: '701' },
    { name: 'CALLE SUCRE Y NICOLAS SUAREZ (OFICINA CENTRAL TRINIDAD AREA EXPEDICIÓN) Número. Zona: PLAZA MARISCAL J. BALLIVIAN', value: '801' },
  ];

  public searchCodeTigo = [
    { nameCompany: 'PREPAGO', serviceCode: '1' },
    { nameCompany: 'POSTPAGO', serviceCode: '2' }
  ];

  public documentTypesCashOnline = [
    { name: 'CI', value: '2' },
    { name: 'CE', value: '3' },
    { name: 'NIT', value: '6' },
    { name: 'PS', value: '4' },
  ];
  public expirationTime =[
    { time: '1 Mes', value: '1M'},
    { time: '3 Meses', value: '3M'},
    { time: '6 meses', value: '6M'},
    { time: '1 Año', value: '1A'}
  ]
  public docmentType =[
    { docTipe: 'CI', value: '02'},
    { docTipe: 'CE', value: '03'},
    { docTipe: 'PAS', value: '04'},
    { docTipe: 'RUC', value: '05'},
    { docTipe: 'NIT', value: '06'},
    { docTipe: 'RUN', value: '07'},
    { docTipe: 'SUP', value: '08'},
    { docTipe: 'TGN', value: '09'}
  ];
  public roleQr = [
    { name: 'Jefe De Agencia', value: '1' },
    { name: 'Cajero', value: '2' }
  ];
}
