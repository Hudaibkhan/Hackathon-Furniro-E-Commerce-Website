"use client";
import Banner from "@/components/Banner";
import CustomerCare from "@/components/Customer-Care";
import { getCart } from "../../../redux/cartSlice";
import { useAppSelector } from "../../../hooks/redux";
import { Product } from "@/types/productData";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { toast } from "react-toastify";



export default function Checkout() {
  const cart = useAppSelector(getCart);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  let totalPrice = 0;

  cart.forEach((item: Product) => {
    totalPrice += item.price * item.quantity;
  });

  const productQuantity = cart.forEach((element : Product)=> {
    return element.quantity
  });

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    zipCode: false,
    phone: false,
    email: false,
  });

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value.trim(),
    }));
  };

  const validateForm = () => {
    const errors = {
      firstName: !formValues.firstName,
      lastName: !formValues.lastName,
      address: !formValues.address,
      city: !formValues.city,
      zipCode: !/^\d{5,6}$/.test(formValues.zipCode),
      phone: !/^\d{10,15}$/.test(formValues.phone),
      email: !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formValues.email),
    };
    setFormErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all fields. ⚠️");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to place this order? You will receive an email confirmation once the order is placed."
    );

    if (!confirmation) {
      toast.info("Order placement canceled.");
      return;
    }

    toast.success("Order confirmed! 🚀 Processing your order...");

    const orderData = {
      _type: "order",
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      address: formValues.address,
      city: formValues.city,
      phone: formValues.phone,
      zipCode: formValues.zipCode,
      email: formValues.email,
      cartItems: cartItems.map((item) => ({
        _type: "object", // Object bana raha hai
        product: { _type: "reference", _ref: item._id }, // Reference ke andar wrap kar diya
        quantity: item.quantity, // Correctly store kar raha hai
      })),
      total: totalPrice,
      orderDate: new Date().toISOString(),
      quantity: productQuantity // Store quantity

    };

    try {
      await client.create(orderData);
      localStorage.removeItem("appliedDiscount");
      toast.success(
        "Your order has been placed successfully! 🎉 A confirmation email has been sent to your email address."
      );
    } catch (error) {
      console.error("Error Creating Data", error);
      toast.error("Failed to place order. Please try again. ❌");
    }
  };
  return (
    <div>
      <Banner name="Checkout" title="Checkout" logo="/logo.png" />

      <div className="max-w-[1242px] mx-auto my-10 flex flex-col-reverse  lg:flex-row">
        {/* form section start */}
        <div className="md:w-[608px] w-auto">
          <div className="flex flex-col gap-8 py-10 px-10">
            <h1 className="font-semibold text-4xl/[54px] font-poppins">
              Billing details
            </h1>

            <form className="space-y-8">
              <div className="flex gap-5">
                <div className="w-[212px] h-[121px] flex flex-col justify-between">
                  <label
                    htmlFor="firstName"
                    className="font-medium font-poppins text-base"
                  >
                    First Name
                  </label>
                  <input
                    value={formValues.firstName}
                    onChange={handleInputChange}
                    type="text"
                    required
                    id="firstName"
                    className="sm:w-[212px] w-full sm:h-[75px] h-[60px] border placeholder:text-[#9F9F9F] border-[#9F9F9F] rounded-[10px] font-poppins text-base px-4"
                  />
                  {formErrors.firstName && (
                    <p className="text-sm text-red-500">
                      First name is required.
                    </p>
                  )}
                </div>

                <div className="w-[212px] h-[121px] flex flex-col justify-between">
                  <label
                    htmlFor="lastName"
                    className="font-medium font-poppins text-base"
                  >
                    Last Name
                  </label>
                  <input
                    value={formValues.lastName}
                    onChange={handleInputChange}
                    type="text"
                    required
                    id="lastName"
                    className="sm:w-[212px] w-full sm:h-[75px] h-[60px] border placeholder:text-[#9F9F9F] border-[#9F9F9F] rounded-[10px] font-poppins text-base px-4"
                  />
                  {formErrors.lastName && (
                    <p className="text-sm text-red-500">
                      Last name is required.
                    </p>
                  )}
                </div>
              </div>

              {/* <div className="h-[121px] flex flex-col justify-between">
                <label
                  htmlFor="country-region"
                  className="font-medium font-poppins text-base"
                >
                  Country / Region
                </label>
                <select
                  className="sm:w-[453px] w-full sm:h-[75px] h-[60px] border border-[#9F9F9F] rounded-[10px] px-5 font-poppins text-[#9F9F9F] text-base"
                  id="country-region"
                  required
                >
                  <option value="srilanka">Sri Lanka</option>
                  <option value="india">India</option>
                  <option value="pakistan">Pakistan</option>
                  <option value="bangladesh">Bangladesh</option>
                  <option value="nepal">Nepal</option>
                  <option value="bhutan">Bhutan</option>
                  <option value="maldives">Maldives</option>
                  <option value="china">China</option>
                  <option value="japan">Japan</option>
                  <option value="australia">Australia</option>
                  <option value="uk">United Kingdom</option>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                </select>
              </div> */}

              <div className="h-[121px] flex flex-col justify-between">
                <label
                  htmlFor="address"
                  className="font-medium font-poppins text-base"
                >
                  Street address
                </label>
                <input
                  value={formValues.address}
                  onChange={handleInputChange}
                  type="text"
                  id="address"
                  required
                  className="sm:w-[453px] w-full sm:h-[75px] h-[60px] border placeholder:text-[#9F9F9F] border-[#9F9F9F] rounded-[10px] font-poppins text-base px-4"
                />
                {formErrors.address && (
                  <p className="text-sm text-red-500">Address is required.</p>
                )}
              </div>

              <div className="h-[121px] flex flex-col justify-between">
                <label
                  htmlFor="city"
                  className="font-medium font-poppins text-base"
                >
                  Town / City
                </label>
                <input
                  required
                  value={formValues.city}
                  onChange={handleInputChange}
                  type="text"
                  id="city"
                  className="sm:w-[453px] w-full sm:h-[75px] h-[60px] border placeholder:text-[#9F9F9F] border-[#9F9F9F] rounded-[10px] font-poppins text-base px-4"
                />
                {formErrors.city && (
                  <p className="text-sm text-red-500">City is required.</p>
                )}
              </div>

              <div className="h-[121px] flex flex-col justify-between">
                <label
                  htmlFor="zipCode"
                  className="font-medium font-poppins text-base"
                >
                  ZIP code
                </label>
                <input
                  value={formValues.zipCode}
                  onChange={handleInputChange}
                  // type="text"
                  id="zipCode"
                  required
                  className="sm:w-[453px] w-full sm:h-[75px] h-[60px] border placeholder:text-[#9F9F9F] border-[#9F9F9F] rounded-[10px] font-poppins text-base px-4"
                />
                {formErrors.zipCode && (
                  <p className="text-sm text-red-500">Zip Code is required.</p>
                )}
              </div>

              <div className="h-[121px] flex flex-col justify-between">
                <label
                  htmlFor="phone"
                  className="font-medium font-poppins text-base"
                >
                  Phone
                </label>
                <input
                  type="number"
                  id="phone"
                  required
                  value={formValues.phone}
                  onChange={handleInputChange}
                  className="sm:w-[453px] w-full sm:h-[75px] h-[60px] border placeholder:text-[#9F9F9F] border-[#9F9F9F] rounded-[10px] font-poppins text-base px-4"
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500">Phone is required.</p>
                )}
              </div>

              <div className="h-[121px] flex flex-col justify-between">
                <label
                  htmlFor="email"
                  className="font-medium font-poppins text-base"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formValues.email}
                  onChange={handleInputChange}
                  className="sm:w-[453px] w-full sm:h-[75px] h-[60px] border placeholder:text-[#9F9F9F] border-[#9F9F9F] rounded-[10px] font-poppins text-base px-4"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">Email is required.</p>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* form section end */}

        {/* Product details section start */}
        <div className="md:w-[600px] w-auto sm:h-[798px] h-auto px-10 py-28 gap-10">
          <div className="space-y-4">
            <span className="flex justify-between items-center">
              <h4 className="font-poppins font-medium text-2xl/9">Product</h4>
              <h4 className="font-poppins font-medium text-2xl/9">Subtotal</h4>
            </span>

            <div>
              {cartItems.map((val: Product) => (
                <span
                  className="flex justify-between items-center"
                  key={val._id}
                >
                  <span className="flex gap-2 items-center">
                    <p className="font-poppins font-normal text-base text-[#9F9F9F]">
                      {val.title}
                    </p>
                    <p className="font-medium font-poppins text-xs/[18px]">X</p>
                    <p className="font-medium font-poppins text-xs/[18px]">
                      {val.quantity}
                    </p>
                  </span>
                  <p className=" font-poppins font-light text-base">
                  ${val.price * val.quantity}
                  </p>
                </span>
              ))}
            </div>

            <span className="flex justify-between items-center">
              <p className="font-poppins font-normal text-base">Subtotal</p>
              <p className="font-poppins font-normal text-base">${totalPrice}</p>
            </span>

            <span className="flex justify-between items-center">
              <p className="font-poppins font-normal text-base">Total</p>
              <p className="font-poppins font-bold text-2xl/9 text-[#B88E2F]">
                ${totalPrice}
              </p>
            </span>
          </div>

          <hr className="my-7" />

          <div className="flex flex-col gap-5">
            <span className="flex gap-2 items-center">
              <span className="w-[14px] h-[14px] rounded-full bg-black"></span>
              <p className="font-poppins font-normal text-base">
                Direct Bank Transfer
              </p>
            </span>

            <p className="font-poppins font-light text-base text-[#9F9F9F]">
              Make your payment directly into our bank account. Please use your
              Order ID as the payment reference. Your order will not be shipped
              until the funds have cleared in our account.
            </p>

            <div>
              <label
                className="text-base font-poppins font-medium text-[#9F9F9F]"
                htmlFor="dbt"
              >
                <input
                  type="radio"
                  className="mr-2"
                  id="dbt"
                  name="payment-method"
                />
                Direct Bank Transfer
              </label>
              <br />

              <label
                className="text-base font-poppins font-medium text-[#9F9F9F]"
                htmlFor="con"
              >
                <input
                  type="radio"
                  className="mr-2"
                  id="con"
                  name="payment-method"
                />
                Cash On Delivery
              </label>
            </div>

            <p className="text-base font-poppins font-light">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our{" "}
              <span className="font-semibold">privacy policy.</span>
            </p>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="font-poppins font-normal text-xl/[30px] sm:w-[318px] w-52 h-16 rounded-[15px] hover:bg-slate-50 mx-auto mt-6 border border-black"
            >
              Place order
            </button>
          </div>
        </div>
        {/* Product details section end */}
      </div>

      <CustomerCare />
    </div>
  );
}


