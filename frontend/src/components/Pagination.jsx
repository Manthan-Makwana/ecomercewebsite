import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";

function Pagination({ currentPage, onPageChange }) {

  const { totalPages, products } = useSelector((state) => state.products);

  if (!products || products.length === 0 || totalPages <= 1) return null;

  const pages = [];

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">

      {/* First */}
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        «
      </button>

      {/* Prev */}
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {/* First page */}
      {startPage > 1 && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(1)}
          >
            1
          </button>

          {startPage > 2 && <span className="pagination-dots">...</span>}
        </>
      )}

      {/* Middle pages */}
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}

      {/* Last page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="pagination-dots">...</span>
          )}

          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>

      {/* Last */}
      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        »
      </button>

    </div>
  );
}

export default Pagination;