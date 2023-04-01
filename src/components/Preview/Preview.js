import React from 'react'
import { Document, Page } from "react-pdf";

function Preview(props) {
    return (
        <div>
            {props.pdfFile && (
                <div className="flex flex-col">
                    <div className="flex flex-col items-center">
                        
                        <div className='flex'>
                            <button
                                onClick={() => props.handlePageChange(props.pageNumber - 1)}
                                disabled={props.pageNumber <= 1}
                                className=""
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => props.handlePageChange(props.pageNumber + 1)}
                                disabled={props.pageNumber >= props.numPages}
                                className=""
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <Document className="" file={props.pdfFile} onLoadSuccess={props.onDocumentLoadSuccess}>
                        <Page pageNumber={props.pageNumber} />
                    </Document>
                    <button className="" onClick={props.handleDownload}>Download Pdf</button>
                </div>

            )}
        </div>
    )
}


export default Preview;

