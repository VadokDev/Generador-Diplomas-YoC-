export default class Certificate {
  constructor(templates, fontSize, fontName, textPosY, hMargin) {
    this.templates = templates;
    this.fontSize = fontSize;
    this.fontName = fontName;
    this.textPosY = textPosY;
    this.hMargin = hMargin;
  }

  getTemplateName(type) {
    return this.templates[type] ?? 'example';
  }
}
