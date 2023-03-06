import docx from 'docx';
import fs from 'fs';

const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType, convertInchesToTwip } = docx;

export default class DocumentGenerator {
    constructor (optns = {
        content: [],
        title: "",
    })
    {
        let { content, title } = optns;
        this.content = optns.content;
        this.title = optns.title;

        if (content.length <= 0)
            throw Error("There must be a 'content'")
        if (title.length <= 0)
            throw Error("There must be a 'title'")
    }

    async titleRegex() {
        let title = this.title
        title = title.replace(/[ÀÁÂÃÄÅ]/g,"A");
        title = title.replace(/[àáâãäå]/g,"a");
        title = title.replace(/[ÈÉÊË]/g,"E");
        title = title.toLowerCase();
        title = title.replace(/[ ]+/gm, '-');
        this.title = title;
        return this.title;
    }

    async createWithoutFormatABNT() {
        this.titleRegex();
        const doc = new Document({
            sections: [{
                properties: {},
                children: this.content.map(paragraphText => (
                    new Paragraph({
                        text: paragraphText
                    })
                )) 
            }]
        })

        Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync(`./documents/${this.title}.docx`, buffer);
        })
    }

    async createWithFormatABNT() {
        this.titleRegex();
        const doc = new Document({
            styles: {
                paragraphStyles: [
                    {
                        id: "aside",
                        name: "Aside",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            color: "000000",
                            font: 'Arial',
                            size: 24,
                        },
                        paragraph: {
                            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                            spacing: {
                                line: 276,
                            },
                        },
                    },
                    {
                        id: "wellSpaced",
                        name: "Well Spaced",
                        basedOn: "Normal",
                        quickFormat: true,
                        paragraph: {
                            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                        },
                    },
                    {
                        id: "strikeUnderline",
                        name: "Strike Underline",
                        basedOn: "Normal",
                        quickFormat: true,
                        run: {
                            strike: true,
                            underline: {
                                type: UnderlineType.SINGLE,
                            },
                        },
                    },
                ]
            },
            sections: [{
                properties: {},
                children: this.content.map(paragraphText => (
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        style: "aside",
                        children: [
                            new TextRun({
                                text: paragraphText,
                            })
                        ]
                    })
                )) 
            }]
        })

        Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync(`./documents/${this.title}.docx`, buffer);
        })
    }
}