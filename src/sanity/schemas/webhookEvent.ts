import { defineField, defineType } from "sanity";

export default defineType({
  name: "webhookEvent",
  title: "Webhook Event",
  type: "document",
  fields: [
    defineField({
      name: "eventId",
      type: "string",
      validation: (r) => r.required(),
      readOnly: true,
    }),
    defineField({
      name: "type",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "receivedAt",
      type: "datetime",
      validation: (r) => r.required(),
      readOnly: true,
    }),
    defineField({
      name: "payload",
      type: "object",
      fields: [],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "eventId",
      subtitle: "type",
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? `Event: ${title.slice(0, 12)}...` : "Unknown Event",
        subtitle: subtitle || "Webhook",
      };
    },
  },
});
