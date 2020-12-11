const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const students = require("./data.js");
const lugares = ["primer", "segundo", "tercer", "participacion"];

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
    for (const taller in students) {
        const tallerDir = path.join(__dirname, "diplomas", taller);
        fs.mkdir(tallerDir, (err) => console.error(err));

        for (const course in students[taller]) {
            const courseDir = path.join(tallerDir, course);
            fs.mkdir(courseDir, (err) => console.error(err));

            students[taller][course].forEach(async (studentName) => {
                console.log(
                    `Taller: ${taller} - Paralelo: ${course} - Nombre: ${studentName.toUpperCase()}`
                );
                const diplomaDir = path.join(
                    courseDir,
                    `${studentName.toUpperCase()}.pdf`
                );

                const diplomaBytes = await genDiplomaBytes(
                    taller,
                    studentName.toUpperCase(),
                    fontBytes
                );

                fs.writeFileSync(diplomaDir, diplomaBytes);
            });
        }
    }
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

(async () => {
    console.log("Generando diplomas");
    const font = "LibreBaskerville-Bold.ttf";

    fs.mkdir(path.join(__dirname, "diplomas"), (err) => console.error(err));
    fs.readFile(`fonts/${font}`, async (err, data) => {
        if (err) throw err;

        genTallerDiplomas(data);
        //genCompetitionPlacesDiplomas(data, "intermedio");
    });
})();
