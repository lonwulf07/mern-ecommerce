import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { addToCart } from "../slices/cartSlice";
import { formatPrice } from '../utils/formatPrice';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };

    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingReview(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        config,
      );

      setLoadingReview(false);
      alert("Review Submitted!");

      window.location.reload();
    } catch (err) {
      setLoadingReview(false);
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      <Row>
        {/* Product Image */}
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>

        {/* Product Details */}
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>Price: ₹{formatPrice(product.price)}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>

        {/* The "Add to Cart" Action Box */}
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>₹{formatPrice(product.price)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* Quantity Dropdown (Only show if in stock) */}
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      {/* REVIEW SECTION */}
      <Row className="review-section mt-4">
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews?.length === 0 && (
            <Alert variant="info">No Reviews Yet</Alert>
          )}

          <ListGroup variant="flush">
            {product.reviews?.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <div>
                  Rating: {review.rating} / 5 Stars
                </div>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}

            {/* The "Write a Review" Form */}
            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {loadingReview && <div>Submitting...</div>}

              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group className="my-2" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="my-2" controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      row="3"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Alert variant="warning">
                  Please <Link to="/login">sign in</Link> to write a review.
                </Alert>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
