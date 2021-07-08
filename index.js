import PdfService from "./src/services/PdfService.js";
import CertificatesInteractor from "./src/usecases/CertificatesInteractor.js";
import studentsData from "./students.js";
import certificatesData from "./certificates.js";

const pdfService = new PdfService();
const certificatesInteractor = new CertificatesInteractor(pdfService);

const certificates = certificatesInteractor.processCertificates(
  certificatesData
);
const students = certificatesInteractor.processStudents(studentsData);

console.log(certificates);
console.log(students);

//certificatesInteractor.generateCertificate(students[0], certificates[students[0].course]);
certificatesInteractor.generateAllCertificates(students, certificates);
