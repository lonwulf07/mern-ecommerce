import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Pull the cart from Redux
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod } = cart;

  // Initialize state with the Redux payment method, defaulting to 'PayPal'
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal",
  );

  useEffect(() => {
    // Security check: If they somehow got to this screen without a shipping address,
    // kick them back to the shipping screen!
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Save their choice to Redux
    dispatch(savePaymentMethod(paymentMethodName));
    // Move to the final review screen
    navigate("/placeorder");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      {/* Highlight steps 1, 2, and 3 */}
      <CheckoutSteps step1 step2 step3 />

      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              className="my-2"
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            ></Form.Check>

            {/* If you wanted to add Stripe later, you would just uncomment this! */}
            {/* <Form.Check
              className="my-2"
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            ></Form.Check> 
            */}
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default PaymentScreen;
