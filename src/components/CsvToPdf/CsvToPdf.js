import React, { useState } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function CsvToPdf() {
    const [csvFile, setCsvFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleFileInputChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleConvertButtonClick = () => {
        if (!csvFile) return;

        Papa.parse(csvFile, {
            header: true,
            complete: (results) => {
                const data = results.data;

                const doc = new jsPDF();
                const columns = Object.keys(data[0]);
                const rows = data.map((row) => Object.values(row));

                doc.autoTable({
                    head: [columns],
                    body: rows,
                });

                const pdfBlob = doc.output("blob");
                const pdfFile = new File([pdfBlob], "converted_file.pdf", {
                    type: "application/pdf",
                });
                setPdfFile(pdfFile);
            },
        });
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handlePageChange = (newPageNumber) => {
        setPageNumber(newPageNumber);
    };

    const handleDownloadButtonClick = () => {
        const url = URL.createObjectURL(pdfFile);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted_file.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <p className="text-5xl mt-5 mb-10 font-bold font-serif text-gray-700 bg-slate-100">Csv to Pdf Converter</p>
            <label htmlFor="csv-file" className="block font-medium text-lg mb-2 bg-slate-100">
                Select a CSV file:
            </label>
            <input
                type="file"
                accept=".csv"
                id="csv-file"
                onChange={handleFileInputChange}
                className="border rounded-md p-2 mb-4 bg-slate-100"
            />
            <button
                onClick={handleConvertButtonClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Convert to PDF
            </button>
            {pdfFile && (
                <div className="mt-8 flex bg-slate-100">
                    <div className="flex flex-col items-center">
                    <div className="flex mt-4 items-center">
                            <button
                                onClick={() => handlePageChange(pageNumber - 1)}
                                disabled={pageNumber <= 1}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l mr-1 mb-2"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => handlePageChange(pageNumber + 1)}
                                disabled={pageNumber >= numPages}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r mb-2"
                            >
                                Next
                            </button>
                        </div>

                        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} renderTextLayer={false} />
                        </Document>
            
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 w-44 mt-5 mb-4" onClick={handleDownloadButtonClick}>Download Pdf</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CsvToPdf;