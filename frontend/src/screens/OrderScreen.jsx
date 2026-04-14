import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Alert,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { formatPrice } from '../utils/formatPrice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    const fetchPayPalId = async () => {
      const { data } = await axios.get("/api/config/paypal");
      setPaypalClientId(data.clientId);
    };

    if (!order || order._id !== orderId) {
      fetchOrder();
    }

    if (!paypalClientId) {
      fetchPayPalId();
    }
  }, [orderId, userInfo, order, paypalClientId]);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: order.totalPrice.toString() },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    const details = await actions.order.capture();
    try {
      setLoadingPay(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/orders/${orderId}/pay`, details, config);

      setLoadingPay(false);
      window.location.reload();
    } catch (err) {
      setLoadingPay(false);
      alert("Payment could not be updated in the database.");
    }
  };

  const deliverOrderHandler = async () => {
    try {
      setLoadingDeliver(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.put(`/api/orders/${orderId}/deliver`, {}, config);

      setLoadingDeliver(false);
      window.location.reload();
    } catch (err) {
      setLoadingDeliver(false);
      alert(err.response?.data?.message || "Error delivering order");
    }
  };

  if (loading) return <h2>Loading Order...</h2>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Alert variant="success">
                  Delivered on {order.deliveredAt}
                </Alert>
              ) : (
                <Alert variant="danger">Not Delivered</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Alert variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Alert>
              ) : (
                <Alert variant="danger">Not Paid</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Alert>Order is empty</Alert>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
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
                  <Col>₹{formatPrice(order.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{formatPrice(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{formatPrice(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>₹{formatPrice(order.totalPrice)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <div>Updating Database...</div>}
                  {paypalClientId ? (
                    <PayPalScriptProvider
                      options={{
                        "client-id": paypalClientId,
                        currency: "INR",
                        intent: "capture",
                      }}
                    >
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => {
                          console.error("PayPal Button Error:", err);
                          alert("PayPal failed to load. Check console.");
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <div>Loading PayPal...</div>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && (
                <ListGroup.Item>Updating Delivery Status...</ListGroup.Item>
              )}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block w-100"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
