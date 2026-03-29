import { defineField, defineType } from "sanity";

export default defineType({
  name: "webhookEvent",
  title: "Webhook Event",
  type: "document",
  fields: [
    defineField({ name: "eventId", type: "string", validation: (r) => r.required() }),
    defineField({ name: "type", type: "string" }),
    defineField({ name: "receivedAt", type: "datetime", validation: (r) => r.required() }),
    // payload can be any object; define as object with flexible fields
    defineField({ name: "payload", type: "object", fields: [] }),
  ],
});
