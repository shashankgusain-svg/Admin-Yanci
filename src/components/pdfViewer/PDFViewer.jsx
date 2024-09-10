import React from "react";

export default function PDFViewer({src}) {
  return (
    <div>
      <embed
        src={src}
        width="100%"
        height="800px"
        type="application/pdf"
      />
    </div>
  );
}
