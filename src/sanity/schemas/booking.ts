import { defineField, defineType } from "sanity";

export default defineType({
  name: "booking",
  title: "Booking",
  type: "document",
  fields: [
    defineField({ name: "stripeSessionId", type: "string", validation: (r) => r.required() }),
    defineField({ name: "stripeEventId", type: "string" }),
    defineField({ name: "bookingReference", type: "string", validation: (r) => r.required() }),
    defineField({ name: "flightId", type: "string", validation: (r) => r.required() }),
    defineField({ name: "userId", type: "string", validation: (r) => r.required() }),
    defineField({ name: "passengers", type: "number", validation: (r) => r.required().min(1) }),
    defineField({
      name: "passenger",
      type: "object",
      fields: [
        defineField({ name: "firstName", type: "string", validation: (r) => r.required() }),
        defineField({ name: "lastName", type: "string", validation: (r) => r.required() }),
        defineField({ name: "email", type: "string", validation: (r) => r.required() }),
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "passportNumber", type: "string" }),
      ],
    }),
    defineField({ name: "totalPriceInCents", type: "number", validation: (r) => r.required().min(0) }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["paid", "pending", "cancelled"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "emailSent", type: "boolean", initialValue: false }),
    defineField({ name: "createdAt", type: "datetime", validation: (r) => r.required() }),
  ],
});
