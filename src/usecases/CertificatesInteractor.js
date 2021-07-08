import Certificate from "../entities/Certificate.js";
import Student from "../entities/Student.js";

export default class CertificatesInteractor {
  constructor(pdfService) {
    this.pdfService = pdfService;
  }

  processCertificates(certificatesData) {
    return certificatesData.reduce(
      (res, cert) => ({
        ...res,
        [cert.course]: new Certificate(
          cert.templateName,
          cert.fontSize,
          cert.fontName,
          cert.textPosY,
          cert.hMargin
        ),
      }),
      {}
    );
  }

  processStudents(studentsData) {
    return studentsData.reduce(
      (res, stu) => [
        ...res,
        new Student(stu.name, stu.email, stu.course, stu.section),
      ],
      []
    );
  }

  generateCertificate(student, certificate) {
    this.pdfService
      .init(
        certificate.templateName,
        certificate.fontName,
        certificate.fontSize,
        certificate.hMargin
      )
      .then(() => {
        this.pdfService.writeInCertificate(
          student.getNameForCertificate(),
          certificate.textPosY
        );
        this.pdfService.saveCertificate(
          "2021-01",
          student.course,
          student.section,
          student.getNameForFile()
        );
      });
  }

  generateAllCertificates(students, certificates) {
    students.forEach((student) =>
      this.generateCertificate(student, certificates[student.course])
    );
  }
}
