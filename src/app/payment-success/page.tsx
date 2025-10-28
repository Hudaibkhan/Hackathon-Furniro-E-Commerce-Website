interface IParams {
    searchParams: {
        amount: number
    }
}

const PaymentSuccess = ({ searchParams }: IParams) => {
    return (
        <div className="text-center w-full flex flex-col items-center">
            <h1 className="text-6xl text-white">Thank you for purchasing $ {searchParams.amount}</h1>
            <p className="text-center text-white">Go Back Checkout Page For Place Order</p>
            <button className="border border-white p-10  text-white">Back To Checkout Page</button>
        </div>

    )
}

export default PaymentSuccess