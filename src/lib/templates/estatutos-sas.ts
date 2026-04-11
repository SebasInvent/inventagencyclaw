import { CompanyRegistrationWithFounders, Founder } from "@/lib/types/database";
import { formatCurrency, formatNumber, capitalToWords } from "@/lib/utils/capital-calculator";

function getIdTypeName(type: string): string {
  const map: Record<string, string> = {
    CC: "Cédula de Ciudadanía",
    CE: "Cédula de Extranjería",
    Pasaporte: "Pasaporte",
    NIT: "NIT",
  };
  return map[type] || type;
}

function getArbitrationTypeName(type: string): string {
  return type === "derecho" ? "en derecho" : "en equidad";
}

function getFoundersByRole(founders: Founder[], role: string): Founder | undefined {
  return founders.find((f) => f.roles.includes(role as Founder["roles"][number]));
}

function buildFoundersTable(founders: Founder[]): string {
  let table = "NOMBRE\t\t\t\tIDENTIFICACIÓN\t\t\t\tDOMICILIO\n";
  table += "\t\t\t\tTipo\t\tNúmero\t\tLugar de Expedición\n";
  founders.forEach((f) => {
    table += `${f.full_name}\t\t${getIdTypeName(f.id_type)}\t${f.id_number}\t${f.id_expedition_place}\t\t${f.domicile}\n`;
  });
  return table;
}

function buildShareDistribution(founders: Founder[], shareNominalValue: number): string {
  return founders
    .map((f) => {
      const count = f.share_count || 0;
      const value = count * shareNominalValue;
      return `- ${f.full_name}: ${formatNumber(count)} acciones (${f.share_percentage}%) - ${formatCurrency(value)}`;
    })
    .join("\n");
}

function buildSignatures(founders: Founder[]): string {
  return founders
    .map(
      (f) =>
        `______________________________\n${f.full_name}\n${getIdTypeName(f.id_type)} ${f.id_number} de ${f.id_expedition_place}`
    )
    .join("\n\n\n");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

export function generateEstatutosSAS(reg: CompanyRegistrationWithFounders): string {
  const founders = reg.founders.sort((a, b) => a.display_order - b.display_order);
  const repPrincipal = getFoundersByRole(founders, "rep_legal_principal");
  const repSuplente = getFoundersByRole(founders, "rep_legal_suplente");
  const juntaPresidente = getFoundersByRole(founders, "junta_presidente");
  const juntaVice = getFoundersByRole(founders, "junta_vicepresidente");
  const juntaMiembros = founders.filter((f) => f.roles.includes("junta_miembro"));
  const hasJunta = juntaPresidente || juntaVice || juntaMiembros.length > 0;

  const totalShares = reg.total_shares;
  const nominalValue = reg.share_nominal_value;

  const doc = `Estatutos Básicos Sociedad por Acciones Simplificada


${reg.city.toUpperCase()}, ${formatDate(reg.constitution_date)}

Por medio del presente documento privado, los suscritos:

${buildFoundersTable(founders)}

Con la firma de este documento manifestamos nuestra voluntad de constituir una sociedad comercial del tipo: Sociedad por Acciones Simplificada (SAS), la cual se regirá por los siguientes estatutos:

Capítulo I
Nombre, Nacionalidad, Domicilio, Objeto y Duración de la Sociedad

Artículo 1. Nombre, nacionalidad y domicilio.

La sociedad se denomina ${reg.company_name}. Es una sociedad comercial por acciones simplificada, de nacionalidad colombiana. El domicilio principal de la sociedad es la ciudad de ${reg.city}. La sociedad podrá crear sucursales, agencias y establecimientos por decisión de su Asamblea General de Accionistas.

Artículo 2. Objeto:

${reg.object_description || "La sociedad puede realizar, en Colombia y en el exterior cualquier actividad lícita, comercial o civil."}

La sociedad puede realizar, en Colombia y en el exterior cualquier actividad lícita, comercial o civil.

Artículo 3. Duración.

La sociedad tendrá vigencia ${reg.duration}.


Capítulo II
Capital y Acciones

Artículo 4. Capital Autorizado, Suscrito y Pagado

VALOR NOMINAL DE LAS ACCIONES    ${formatCurrency(nominalValue)} (${capitalToWords(nominalValue)})
CLASE DE ACCIONES                Nominativas y Ordinarias

CAPITAL AUTORIZADO
No. DE ACCIONES         VALOR TOTAL
${formatNumber(totalShares)}                 ${formatCurrency(reg.authorized_capital)}

CAPITAL SUSCRITO
No. DE ACCIONES         VALOR TOTAL
${formatNumber(totalShares)}                 ${formatCurrency(reg.subscribed_capital)}

CAPITAL PAGADO
No. DE ACCIONES         VALOR TOTAL
${formatNumber(totalShares)}                 ${formatCurrency(reg.paid_capital)}

DISTRIBUCIÓN DE ACCIONES:
${buildShareDistribution(founders, nominalValue)}

Artículo 5. Derechos derivados de cada acción. 

Cada acción nominativa confiere los siguientes derechos a su propietario: a) El de deliberar y votar en la Asamblea de Accionistas de la Sociedad; b) El de percibir una parte proporcional a su participación en el capital de la sociedad de los beneficios sociales establecidos por los balances de fin de ejercicio; c) El de negociar las acciones con sujeción a la ley y a los estatutos; d) El de inspeccionar libremente los libros y papeles sociales, dentro de los cinco (5) días hábiles anteriores a la fecha en que deban aprobarse los balances de fin de ejercicio, en los eventos previstos en el artículo 20 de la ley 1258 de 2008; y e) El de recibir, en caso de liquidación de la sociedad, una parte proporcional a su participación en el capital de la sociedad de los activos sociales, una vez pagado el pasivo externo de la sociedad.


Capítulo III.
Dirección, Administración, Representación y Revisoría Fiscal de la Sociedad

Artículo 6. Órganos Sociales: 

La dirección de la sociedad es ejercida por la Asamblea General de Accionistas o, de modificarse su composición accionaria en tal sentido y de conformidad con la ley, lo será por su único accionista. La administración y representación legal está a cargo del Representante Legal. 

Artículo 7. Dirección de la Sociedad: Asamblea General de Accionistas. 

La Asamblea se compone de los accionistas inscritos en el Libro de Registro de Acciones, o de sus representantes o mandatarios reunidos en el domicilio social o fuera de él, con el quórum y en las condiciones previstas en estos estatutos y en la ley. La asamblea ejerce las funciones previstas en el artículo 420 del Código de Comercio. La asamblea será convocada por el representante legal mediante comunicación escrita que incluirá el orden del día correspondiente a la reunión convocada, dirigida a cada accionista con una antelación mínima de cinco (5) días hábiles. Para deliberar en cualquier tipo de reunión, se requerirá de uno o varios accionistas que representen cuando menos la mitad más una de las acciones suscritas. En cualquier tipo de reunión, la mayoría decisoria estará conformada por el voto favorable de un número singular o plural de accionistas que represente al menos la mitad más una de las acciones presentes. Se podrán realizar reuniones por comunicación simultánea o sucesiva y por consentimiento escrito.

Artículo 8. Administración y Representación Legal de la Sociedad 

La administración y representación legal de la sociedad está en cabeza del representante legal, quien tendrá un suplente que podrá reemplazarlo en sus faltas absolutas, temporales o accidentales.

La representación legal puede ser ejercida por personas naturales o jurídicas, la Asamblea General de Accionistas, designará a los representantes legales por el período que libremente determine o en forma indefinida, si así lo dispone, y sin perjuicio de que los nombramientos sean revocados libremente en cualquier tiempo.
${hasJunta ? `
Artículo 8-A. Junta Directiva.

La sociedad tendrá una Junta Directiva compuesta por ${juntaPresidente && juntaVice && juntaMiembros.length > 0 ? "tres (3)" : "los"} miembros, designados por la Asamblea General de Accionistas, así:
${juntaPresidente ? `\n- Presidente: ${juntaPresidente.full_name}` : ""}${juntaVice ? `\n- Vicepresidente: ${juntaVice.full_name}` : ""}${juntaMiembros.map((m) => `\n- Miembro: ${m.full_name}`).join("")}

Funciones de la Junta Directiva:
- Definir estrategia corporativa
- Aprobar presupuestos
- Autorizar inversiones
- Supervisar al representante legal
- Aprobar contratos relevantes
` : ""}
Artículo 9. Facultades de los representantes legales

Los representantes legales pueden celebrar o ejecutar todos los actos y contratos comprendidos en el objeto social o que se relacionen directamente con la existencia y funcionamiento de la sociedad.

Artículo 10. Revisoría Fiscal. 

La sociedad no tendrá Revisor Fiscal mientras no esté obligada por la Ley. De llegar a encontrarse en los supuestos legales que hacen obligatoria la provisión de dicho cargo, se procederá a la designación por parte de la asamblea general de accionistas, y su nombramiento se efectuará con posterioridad a la constitución de la sociedad.


CAPÍTULO IV
Estados Financieros, Reservas y Distribución de Utilidades

Artículo 11. Estados Financieros y Derecho de Inspección. 

La sociedad tendrá ejercicios anuales y al fin de cada ejercicio social, el 31 de diciembre, la Sociedad deberá cortar sus cuentas y preparar y difundir estados financieros de propósito general de conformidad con las prescripciones legales y las normas de contabilidad establecidas, los cuales se someterán a la consideración de la Asamblea de Accionistas en su reunión ordinaria junto con los informes, proyectos y demás documentos exigidos por estos estatutos y la ley. 

Tales estados, los libros y demás piezas justificativas de los informes del respectivo ejercicio, así como éstos, serán depositados en las oficinas de la sede principal de la administración, con una antelación mínima de cinco (5) días hábiles al señalado para su aprobación. 

Artículo 12. Reserva Legal: 

De las utilidades líquidas de cada ejercicio la sociedad destinará anualmente un diez por ciento (10%) para formar la reserva legal de la sociedad hasta completar por lo menos el cincuenta por ciento (50%) del capital suscrito. 

Artículo 13. Utilidades, Reservas y Dividendos. 

Aprobados los estados financieros de fin de ejercicio, la Asamblea de Accionistas procederá a distribuir las utilidades, disponiendo lo pertinente a reservas y dividendos. La repartición de dividendos se hará en proporción a la parte pagada del valor nominal de las acciones. El pago del dividendo se hará en efectivo, en las épocas que defina la Asamblea de Accionistas al decretarlo sin exceder de un año para el pago total; si así lo deciden los accionistas en Asamblea, podrá pagarse el dividendo en forma de acciones liberadas de la misma sociedad. En este último caso, no serán aplicables los artículos 155 y 455 del Código de Comercio.


Capítulo V
Disolución y Liquidación

Artículo 14. Causales de Disolución. 

La sociedad se disolverá ante la ocurrencia de cualquiera de las siguientes causales:
 
1. Por vencimiento del término previsto en los estatutos, si lo hubiere, a menos que fuera prorrogado mediante documento inscrito en el registro mercantil antes de su expiración.
2. Por imposibilidad de desarrollar las actividades previstas en su objeto social.
3. Por la iniciación del trámite de liquidación judicial.
4. Por las causales previstas en los estatutos.
5. Por la voluntad de los accionistas adoptada en la asamblea o por decisión del accionista único.
6. Por orden de autoridad competente.

Artículo 15. Liquidación. 

Llegado el caso de disolución de la sociedad, se procederá a la liquidación y distribución de los bienes de acuerdo con lo prescrito en la ley en relación con las sociedades de responsabilidad limitada.

Artículo 16. Liquidador. 

Hará la liquidación la persona o personas designadas por la Asamblea de Accionistas. Si no se nombrara liquidador, tendrá carácter de tal del Representante Legal. 

Artículo 17. Sujeción a las Normas Legales. 

En cuanto al desarrollo y término de la liquidación, el liquidador o los liquidadores se sujetarán a las normas legales vigentes en el momento de efectuarse la liquidación.


Capítulo VI
Resolución de Conflictos

Artículo 18. Arbitramento. 

Todas las diferencias que ocurran a los accionistas entre sí, o con la sociedad o sus administradores, en desarrollo del contrato social o del acto unilateral, incluida la impugnación de determinaciones de asamblea o junta directiva con fundamento en cualquiera de las causas legales, será resuelta por un tribunal arbitral compuesto por ${reg.arbitration_count === 1 ? "un (1) árbitro" : "tres (3) árbitros"} ${getArbitrationTypeName(reg.arbitration_type)}, designados por el Centro de Arbitraje y Conciliación de la Cámara de Comercio de Bogotá. El tribunal sesionará en el Centro antes mencionado y se sujetará a las tarifas y reglas de procedimiento vigentes en él para el momento en que la solicitud de arbitraje sea presentada.
 

Capítulo VII
Remisión

Artículo 19. Remisión Normativa. 

De conformidad con lo dispuesto en los artículos 4 del Código de Comercio y 45 de la ley 1258 de 2008, en lo no previsto en estos estatutos la sociedad se regirá por lo dispuesto en la ley 1258 de 2008; en su defecto, por lo dispuesto en las normas legales aplicables a las sociedades anónimas; y en defecto de éstas, en cuanto no resulten contradictorias, por las disposiciones generales previstas en el Título I del libro Segundo del Código de Comercio. 


Capítulo VIII
Disposiciones Transitorias

Artículo 1. Transitorio. Nombramientos.

Hasta cuando la Asamblea disponga lo contrario, sin perjuicio de las facultades de elección y remoción consagradas es estos estatutos, se hacen los siguientes nombramientos:

Representante Legal Principal:
Se designa en este cargo a: ${repPrincipal?.full_name || "[PENDIENTE]"}, identificado con la ${repPrincipal ? getIdTypeName(repPrincipal.id_type) : "[TIPO ID]"} No. ${repPrincipal?.id_number || "[NÚMERO]"} de ${repPrincipal?.id_expedition_place || "[LUGAR]"}.
La persona designada como Representante Legal Principal, estando presente, acepta el cargo.
${repSuplente ? `
Representante Legal Suplente:
Se designa en este cargo a: ${repSuplente.full_name}, identificado con la ${getIdTypeName(repSuplente.id_type)} No. ${repSuplente.id_number} de ${repSuplente.id_expedition_place}.
La persona designada como Representante Legal Suplente, estando presente, acepta el cargo.
` : ""}

Firmas:


${buildSignatures(founders)}
`;

  return doc;
}
