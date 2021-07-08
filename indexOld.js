const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const students = require("./data.js");
const lugares = ["primer", "segundo", "tercer", "participacion"];
const nodemailer = require("nodemailer");
const config = require('./config.js');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function genDiplomaBytes(template, text, fontBytes) {
    const pdfDoc = await PDFDocument.load(
        fs.readFileSync(`templates/${template}.pdf`)
    );
    pdfDoc.registerFontkit(fontkit);

    const customFont = await pdfDoc.embedFont(fontBytes);
    const page = pdfDoc.getPages()[0];
    const pageWidth = page.getWidth();
    const marginHorizontal = 20;

    let textSize = 35;
    let textWidth = customFont.widthOfTextAtSize(text, textSize);

    while (textWidth > pageWidth - marginHorizontal) {
        textSize--;
        textWidth = customFont.widthOfTextAtSize(text, textSize);

        console.log("Achicando el texto:", text);
    }

    page.drawText(text, {
        x: page.getWidth() / 2 - textWidth / 2,
        y: lugares.includes(template) ? 310 : 280,
        size: textSize,
        font: customFont,
        color: rgb(0.22, 0.23, 0.23),
    });

    return await pdfDoc.save();
}

const genTallerDiplomas = (fontBytes) => {
    students.forEach(async (student) => {
        const diplomaDir = path.join(__dirname, "diplomas");
        const tallerDir = path.join(diplomaDir, student.taller);
        const paraleloDir = path.join(tallerDir, student.paralelo);

        fs.mkdir(diplomaDir, (err) => console.error(err));
        fs.mkdir(tallerDir, (err) => console.error(err));
        fs.mkdir(paraleloDir, (err) => console.error(err));

        console.log(
            `Taller: ${student.taller} - Paralelo: ${
                student.paralelo
            } - Nombre: ${student.nombre.toUpperCase()} - Email: ${
                student.email
            }`
        );

        const diplomaBytes = await genDiplomaBytes(
            student.taller,
            student.nombre.toUpperCase(),
            fontBytes
        );

        fs.writeFileSync(
            path.join(paraleloDir, `${student.nombre.toUpperCase()}.pdf`),
            diplomaBytes
        );
    });
};

const genCompetitionPlacesDiplomas = (fontBytes, taller) => {
    const competitionDir = path.join(__dirname, "diplomas", "competencia");
    fs.mkdir(competitionDir, (err) => console.error(err));

    lugares.forEach((lugar) => {
        const placeDir = path.join(competitionDir, lugar);
        fs.mkdir(placeDir, (err) => console.error(err));

        for (const course in students[taller]) {
            students[taller][course].forEach(async (studentName) => {
                console.log(
                    `Lugar: ${lugar} - Paralelo: ${course} - Nombre: ${studentName.toUpperCase()}`
                );
                const diplomaDir = path.join(
                    placeDir,
                    `${studentName.toUpperCase()}.pdf`
                );

                const diplomaBytes = await genDiplomaBytes(
                    lugar,
                    studentName.toUpperCase(),
                    fontBytes
                );

                fs.writeFileSync(diplomaDir, diplomaBytes);
            });
        }
    });
};

const sendTallerDiplomas = async () => {
    for (var i = 0; i < students.length; i++) {
        const diplomaDir = path.join(__dirname, "diplomas");
        const tallerDir = path.join(diplomaDir, students[i].taller);
        const paraleloDir = path.join(tallerDir, students[i].paralelo);

        var transporter = nodemailer.createTransport(config.email);

        const mensaje = `Hola ${students[i].nombre.split(' ')[0]}!<br></br>A nombre del equipo de los <b>Talleres de Programación YoC+</b>, me alegra mucho entregarte éste <b>Diploma de Participación</b> en la <b>Competencia del Taller Avanzado YoC+</b>.<br></br>Te invitamos a seguir participando de instancias donde puedas aprender más sobre programación y el mundo de la informática.<br>¡Nos vemos pronto! 😄`;

        const mailOptions = {
            from: "gonzalo.fernandezc@sansano.usm.cl",
            to: students[i].email,
            subject: "Diploma de Participación Talleres YoC+",
            html: mensaje,
            attachments: [
                {
                    filename: 'diploma.pdf',
                    path: path.join(paraleloDir, `${students[i].nombre.toUpperCase()}.pdf`),
                },
            ],
        };
        await sleep(10000);
        
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err);
            else console.log(info);
        });
    }
};

(async () => {
    console.log("Generando diplomas");
    const font = "LibreBaskerville-Bold.ttf";

    await sendTallerDiplomas();
    /*fs.mkdir(path.join(__dirname, "diplomas"), (err) => console.error(err));
    fs.readFile(`fonts/${font}`, async (err, data) => {
        if (err) throw err;
    
        //genTallerDiplomas(data);
        //genCompetitionPlacesDiplomas(data, "intermedio");
    });*/
})();

