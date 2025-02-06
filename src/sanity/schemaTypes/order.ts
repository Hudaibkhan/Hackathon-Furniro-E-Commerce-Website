import {defineField} from "sanity";


export default defineField({
    name:"order",
    title:"Order",
    type:"document",
    fields: [
        {
            name:"firstName",
            title:"First Name",
            type:"string"
        },
        {
            name:"lastName",
            title:"Last Name",
            type:"string"
        },
        {
            name:"address",
            title:"Address",
            type:"string"
        },
        {
            name:"city",
            title:"City",
            type:"string"
        },
        {
            name:"zipCode",
            title:"Zip Code",
            type:"string"
        },
        {
            name:"phone",
            title:"Phone",
            type:"string"
        },
        {
            name:"email",
            title:"Email",
            type:"string"
        },
        {
            name: "cartItems",
            title: "Cart Items",
            type: "array",
            of: [
              {
                type: "object",
                fields: [
                  { name: "product", type: "reference", to: [{ type: "product" }] },
                  { name: "quantity", type: "number" },
                ],
              },
            ],
          },
        {
            name:"total",
            title:"Total",
            type:"number"
        },
        {
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    {title: "Pending", value: "pending"},
                    {title: "Success", value: "success"},
                    {title: "Dispatch", value: "dispatch"},
                ],
                layout: "radio",
            },
            initialValue: "pending",  // ✅ This ensures "Pending" is pre-selected
        },
    ]
}
)