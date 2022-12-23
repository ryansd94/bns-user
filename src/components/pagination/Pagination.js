import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import './pagination.scss';
const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  // console.log("currentPage: " + currentPage + ", pageSize: " + pageSize + "totalCount: " + totalCount)
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  if (currentPage === 0 || paginationRange.length < 2) {
    return (<ul
      className={classnames('pagination-container', { [className]: className })}
    >
      <li key={"left"}
        className={classnames('pagination-item', {
          disabled: true
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      <li key={"1"}
        className={classnames('pagination-item', {
          selected: true
        })}
        onClick={() => onPageChange(1)}
      >
        {1}
      </li>
      <li key={"next"}
        className={classnames('pagination-item', {
          disabled: true
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>);
  }

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames('pagination-container', { [className]: className })}
    >
      <li key={"left"}
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {
        paginationRange.map(pageNumber => {
          if (pageNumber === DOTS) {
            return <li key={pageNumber} className="pagination-item dots">&#8230;</li>;
          }

          return (
            <li key={pageNumber}
              className={classnames('pagination-item', {
                selected: pageNumber === currentPage
              })}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })
      }
      <li key={"next"}
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  );
};

export default Pagination;