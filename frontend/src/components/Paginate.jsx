import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  // If there is only 1 page of products, don't show the pagination buttons at all!
  if (pages <= 1) return null;

  return (
    <Pagination className="mt-4 justify-content-center">
      {/* Create an array from the number of pages (e.g., if pages=3, array is [0, 1, 2]) */}
      {[...Array(pages).keys()].map((x) => (
        <LinkContainer
          key={x + 1}
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${x + 1}`
                : `/page/${x + 1}`
              : `/admin/productlist/${x + 1}`
          }
        >
          {/* x + 1 gives us the actual page number (1, 2, 3...) */}
          <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
};

export default Paginate;
