import { Pagination as MantinePagination } from '@mantine/core';

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ total, currentPage, onPageChange }) => {
  return (
    <MantinePagination
      total={total}
      page={currentPage}
      onChange={onPageChange}
      mt="lg"
    />
  );
};

export default Pagination;
