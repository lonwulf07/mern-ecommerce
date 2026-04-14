import { useState, useEffect } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Product from "../components/Product";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = "/api/products?";
        if (keyword) url += `keyword=${keyword}&`;
        if (pageNumber) url += `pageNumber=${pageNumber}`;

        const { data } = await axios.get(url);

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
  }, [keyword, pageNumber]);

  if (loading) return <h2>Loading Products...</h2>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
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

      <Paginate
        pages={pages}
        page={page}
        keyword={keyword ? keyword : ""}
      />
    </>
  );
};

export default HomeScreen;
