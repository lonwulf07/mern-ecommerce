import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import axios from "axios";
import CheckoutSteps from "../components/CheckoutSteps";
import { clearCartItems } from "../slices/cartSlice";
import { formatPrice } from "../utils/formatPrice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const itemsPrice = Math.round(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  const shippingPrice = itemsPrice > 1000 ? 0 : 100;

  const taxPrice = Math.round(0.15 * itemsPrice);

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems.map((item) => ({
            ...item,
            product: item._id,
          })),
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config,
      );

      dispatch(clearCartItems());

      navigate(`/order/${data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error placing order");
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <div>Your cart is empty</div>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{formatPrice(item.price)} = ₹
                          {formatPrice(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{formatPrice(itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{formatPrice(shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{formatPrice(taxPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>₹{formatPrice(totalPrice)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
