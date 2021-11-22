export default class Student {
  constructor(name, email, course, section) {
    this.name = name;
    this.email = email;
    this.course = course;
    this.section = section.toString();
  }

  getNameForFile() {
    return this.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }

  getNameForCertificate() {
    return this.name.toUpperCase();
  }

  getCertificatePath(pathModule, folder) {
    return pathModule.join(
      "diplomas", folder, this.course, this.section, `${this.getNameForCertificate()}.pdf`
    );
  }

  getCourseName(course) {
      return {
        'basico': 'Taller Básico',
        'intermedio': 'Taller Intermedio',
        'avanzado': 'Taller Avanzado',
      }[this.course] ?? '';
  }

  emailText() {
    const mensaje = `Hola ${this.name.split(' ')[0]}!<br></br>A nombre del equipo de coordinación de los <b>Talleres OCI Labs</b>, me alegra mucho entregarte este <b>Diploma de Participación</b> por formar parte del <b>Equipo de Tutores</b> del <b>${this.getCourseName()}</b>, que comprendió un total de 12 sesiones modalidad no presencial.<br></br>Sin tu esfuerzo y dedicación no habría sido posible llevar a cabo esta gran labor.<br>¡Muchas gracias! 😄`;

    return mensaje;
  }
}
