import { defineField, defineType } from "sanity";

export default defineType({
  name: "flight",
  title: "Flight",
  type: "document",
  fields: [
    defineField({
      name: "airlineName",
      title: "Airline Name",
      type: "string",
      initialValue: "Sky-Pass",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "flightNumber",
      title: "Flight Number",
      type: "string",
      validation: (r) => r.required().custom(async (value, context) => {
        if (!value || !context.getClient) return true;
        const client = context.getClient({ apiVersion: "2024-01-01" });
        const existing = await client.fetch(
          `count(*[_type == "flight" && flightNumber == $flightNumber && _id != $id])`,
          { flightNumber: value, id: context.document?._id }
        );

        return existing === 0 || "Flight number must be unique";
      }),
    }),
    defineField({
      name: "priceInCents",
      title: "Price (in cents)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "origin",
      title: "Origin",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "destination",
      title: "Destination",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "departureTime",
      title: "Departure Time",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration (minutes)",
      type: "number",
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "seatsAvailable",
      title: "Seats Available",
      type: "number",
      initialValue: 180,
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "flightClass",
      title: "Class",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Economy", value: "Economy" },
          { title: "Business", value: "Business" },
          { title: "First", value: "First" },
        ],
      },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (r) => r.required(),
        },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured?",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      title: "flightNumber",
      subtitle: "origin",
      media: "featuredImage",
    },
    prepare({ title, subtitle }) {
      return { title: `Flight ${title}`, subtitle };
    },
  },
});
