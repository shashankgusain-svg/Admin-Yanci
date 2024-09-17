import React from "react";
import arrowLeft from "../../../public/icons/misc/arrowLeft.svg";
import arrowRight from "../../../public/icons/misc/arrowRight.svg";
import Image from "next/image";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return (
      <div className="bg-primary-2 border border-primary-3 px-3 py-1 rounded">
        <p className="text-body-2 text-primary-7"> Page 1 of 1</p>
      </div>
    );
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key="prev"
          className="pagination-item hover:bg-primary-2"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Image src={arrowLeft} alt="Arrow Left" />
        </button>
      );
    }

    pageNumbers.push(
      <button
        key="page-1"
        className={`pagination-item ${
          currentPage === 1
            ? "bg-primary-2 text-primary-7"
            : "hover:bg-primary-2"
        }`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pageNumbers.push(
        <span key="ellipsis1" className="pagination-item">
          &hellip;
        </span>
      );
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-item ${
            currentPage === i
              ? "bg-primary-2 text-primary-7"
              : "hover:bg-primary-2"
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="ellipsis2" className="pagination-item">
          &hellip;
        </span>
      );
    }

    pageNumbers.push(
      <button
        key={totalPages}
        className={`pagination-item ${
          currentPage === totalPages
            ? "bg-primary-2 text-primary-7"
            : "hover:bg-primary-2"
        }`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>
    );

    // Next Button
    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key="next"
          className="pagination-item hover:bg-primary-2"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Image src={arrowRight} alt="Arrow Right" />
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination flex justify-center items-center bg-white">
      {renderPageNumbers()}
    </div>
  );
}
