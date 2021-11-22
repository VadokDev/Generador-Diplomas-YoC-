import CertificateService from "./src/services/CertificateService.js";
import CertificatesInteractor from "./src/usecases/CertificatesInteractor.js";
import studentsData from "./students.js";
import tutorsData from "./tutors.js";
import certificatesData from "./certificates.js";
import config from "./config.js";

const certificateService = new CertificateService(config.email);
const certificatesInteractor = new CertificatesInteractor(certificateService);

const certificates = certificatesInteractor.processCertificates(
  certificatesData
);

//const students = studentsData.filter(({email}) => !studentsData.includes(email));
//console.log(students);

const students = certificatesInteractor.processStudents(studentsData);
const tutors = certificatesInteractor.processTutors(tutorsData);

certificatesInteractor
  .generateAllCertificates(students, certificates, "student")
  .then(() =>
    certificatesInteractor
      .sendCertificatesByEmail(students)
      .then(() =>
        certificatesInteractor
          .generateAllCertificates(tutors, certificates, "tutor")
          .then(() => certificatesInteractor.sendCertificatesByEmail(tutors))
      )
  );
