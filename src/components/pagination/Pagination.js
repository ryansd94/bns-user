import React from 'react'
import classnames from 'classnames'
import { usePagination, DOTS } from './usePagination'
import './pagination.scss'
import { NumberInput } from 'components/input'
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import _ from 'lodash'

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    className,
    onPageLengthChange
  } = props

  const pageSize = useSelector((state) => state.master.pageSize)
  const {
    control,
  } = useForm({
    defaultValues: {
      length: _.isNil(pageSize) ? 10 : pageSize
    }
  })

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  })

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  const renderPageSizeElement = () => {
    return <NumberInput control={control} onChange={onPageLengthChange} name='length' className='' style={{ width: '70px' }} fullWidth={false} />
  }

  if (currentPage === 0 || paginationRange.length < 2) {
    return (
      <div className='pagination-root'>
        {renderPageSizeElement()}
        <ul
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
              selected: true,
              disabled: true
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
        </ul>
      </div>)
  }


  let lastPage = paginationRange[paginationRange.length - 1]
  return (
    <div className='pagination-root'>
      {renderPageSizeElement()}
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
              return <li key={pageNumber} className="pagination-item dots">...</li>
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
            )
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
    </div>
  )
}

export default Pagination