import path from "path";
import Certificate from "../entities/Certificate.js";
import Student from "../entities/Student.js";
import Tutor from "../entities/Tutor.js";

export default class CertificatesInteractor {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }

  processCertificates(certificatesData) {
    return certificatesData.reduce(
      (res, cert) => ({
        ...res,
        [cert.course]: new Certificate(
          cert.templates,
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

  processTutors(tutorsData) {
    return tutorsData.reduce(
      (res, tutor) => [
        ...res,
        new Tutor(tutor.name, tutor.email, tutor.course, tutor.section),
      ],
      []
    );
  }

  generateCertificate(user, certificate, type) {
    this.certificateService
      .init(
        certificate.getTemplateName(type),
        certificate.fontName,
        certificate.fontSize,
        certificate.hMargin
      )
      .then(() => {
        this.certificateService.writeInCertificate(
          user.getNameForCertificate(),
          certificate.textPosY
        );
        this.certificateService.saveCertificate(
          user.getCertificatePath(path, "2021-01")
        );
      });
  }

  generateAllCertificates(users, certificates, type) {
    const promises = users.reduce((res, user) =>
      [this.generateCertificate(user, certificates[user.course], type), ...res], []
    );

    return Promise.all(promises);
  }

  async sendCertificatesByEmail(users) {
    let i = 0;
    const promises = users.reduce((res, user) => [
      ...res,
      new Promise((resolve) => {
        setTimeout(() => {
          this.certificateService.sendCertificateByEmail(
            user.email,
            user.emailText(),
            user.getCertificatePath(path, "2021-01")
          ).then(resolve);
          console.log("Hola", user.email);
        }, i+=15345);
      })], []);
    return Promise.all(promises);
  }
}
