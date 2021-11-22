import fs from "fs";
import fsPath from "fs-path";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import nodemailer from 'nodemailer';

export default class CertificateService {
  constructor(emailConfig) {
    this.emailConfig = emailConfig;
    this.transporter = nodemailer.createTransport(this.emailConfig);
  }

  async init(templateName, fontName, textSize = 35, marginHorizontal = 20) {
    this.templateName = templateName;
    this.fontName = fontName;
    this.textSize = textSize;
    this.marginHorizontal = marginHorizontal;

    return this.loadTemplateFile()
      .then((pdfDoc) => this.loadFont(pdfDoc))
      .then(([pdfDoc, font]) => {
        this.pdfDoc = pdfDoc;
        this.font = font;
      });
  }

  async loadTemplateFile() {
    const templateBytes = fs.readFileSync(`templates/${this.templateName}.pdf`);
    return PDFDocument.load(templateBytes).catch((error) => {
      console.log("[CertificateService] error reading template file");
      throw new Error(error);
    });
  }

  async loadFont(pdfDoc) {
    const fontBytes = fs.readFileSync(`fonts/${this.fontName}`);
    pdfDoc.registerFontkit(fontkit);

    return pdfDoc
      .embedFont(fontBytes)
      .then((font) => [pdfDoc, font])
      .catch((error) => {
        console.log("[CertificateService] error reading font file");
        throw new Error(error);
      });
  }

  writeInCertificate(text, textPosY) {
    const page = this.pdfDoc.getPages()[0];
    const textWidth = this.recalculateTextSizes(text);

    page.drawText(text, {
      x: page.getWidth() / 2 - textWidth / 2,
      y: textPosY,
      size: this.textSize,
      font: this.font,
      color: rgb(0.22, 0.23, 0.23),
    });
  }

  async saveCertificate(filePath) {
    return this.pdfDoc
      .save()
      .then((pdfBytes) => {
        fsPath.writeFileSync(
          filePath,
          pdfBytes
        );
      })
      .catch((error) => {
        console.log("[CertificateService] error storing the certificate");
        throw new Error(error);
      });
  }

  recalculateTextSizes(text) {
    const pageWidth = this.pdfDoc.getPages()[0].getWidth();
    let textWidth = this.font.widthOfTextAtSize(text, this.textSize);

    while (textWidth > pageWidth - this.marginHorizontal) {
      this.textSize--;
      textWidth = this.font.widthOfTextAtSize(text, this.textSize);
    }

    return textWidth;
  }

  async sendCertificateByEmail(email, emailText, certificatePath) {
    const mailOptions = {
        from: this.emailConfig.fromEmail,
        to: email,
        subject: this.emailConfig.subjectText,
        html: emailText,
        attachments: [
          {
              filename: 'diploma.pdf',
              path: certificatePath,
          },
        ],
    };
    
    return new Promise((resolve, reject) => this.transporter.sendMail(mailOptions, function (err, info) {
        if (err) { 
          console.log(err);
          setTimeout(reject, 7500);
        }
        else {
          console.log(info);
          setTimeout(resolve, 7500);
        }
    }));
  }
}
