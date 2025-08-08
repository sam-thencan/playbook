declare module 'pdf-parse' {
    export interface PDFParseResult {
        text: string;
        [key: string]: unknown;
    }

    export default function pdf(
        input: ArrayBuffer | Buffer | Uint8Array
    ): Promise<PDFParseResult>;
}


