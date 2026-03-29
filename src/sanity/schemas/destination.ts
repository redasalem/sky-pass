import { defineField, defineType } from "sanity";

export default defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
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
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
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
    select: { title: "city", subtitle: "country", media: "image" },
  },
});
