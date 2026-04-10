import { useState, useEffect } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams, Link } from "react-router-dom"; // Add useParams and Link
import axios from "axios";
import Product from "../components/Product";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
  // Grab the keyword and pageNumber from the URL!
  const { keyword, pageNumber } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // We haven't built the physical pagination buttons yet, but we will store the data!
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Build the query string based on what's in the URL
        let url = "/api/products?";
        if (keyword) url += `keyword=${keyword}&`;
        if (pageNumber) url += `pageNumber=${pageNumber}`;

        const { data } = await axios.get(url);

        // Notice we are pulling from data.products now!
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, pageNumber]); // Re-run this effect if the URL changes!

  if (loading) return <h2>Loading Products...</h2>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      {/* Show a 'Go Back' button if we are searching */}
      {keyword && (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}

      <h1>Latest Products</h1>

      {products.length === 0 ? (
        <Alert variant="info">No Products Found for "{keyword}"</Alert>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}

      {/* We will build the Pagination component here in the next step! */}
      <Paginate
        pages={pages} // <-- If this is missing or misspelled, the buttons stay hidden!
        page={page}
        keyword={keyword ? keyword : ""}
      />
    </>
  );
};

export default HomeScreen;
