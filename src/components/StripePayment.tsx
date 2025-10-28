"use client"

import convertToSubCurrency from '../lib/ConvertToSubCurrency';
import CheckoutPage from '../components/CheckoutPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAppSelector } from '../../hooks/redux';
import { getCart } from '../../redux/cartSlice';
import { Product } from '@/types/productData';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePayment = () => {
    const orderData = useAppSelector(getCart);
     let totalPrice = 0;
      orderData.forEach((item: Product) => {
        totalPrice += item.price * item.quantity;
      });
    const amount = totalPrice

    return (
        <div>
            <h1 className='text-6xl font-bold text-center'>${amount}</h1>

            <Elements
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: convertToSubCurrency(amount),
                    currency: 'usd'
                }}
            >
                <CheckoutPage amount={amount} />
            </Elements>

        </div>
    )
}

export default StripePayment