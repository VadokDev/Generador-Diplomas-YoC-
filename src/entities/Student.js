export default class Student {
  constructor(name, email, course, section) {
    this.name = name;
    this.email = email;
    this.course = course;
    this.section = section;
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
}
