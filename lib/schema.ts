import { z } from "zod";
const short = z.string().trim().min(1).max(240);
const prose = z.string().trim().min(1).max(5000);
export const projectSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(80),
  title: short,
  category: short,
  year: z.string().regex(/^20\d{2}$/),
  client: short,
  description: prose,
  headline: short,
  image: z.union([
    z.enum(["/images/forma.webp", "/images/monument.webp", ""]),
    z.string().regex(/^\/media\/[a-f0-9-]{36}$/),
  ]),
  imageAlt: z.string().max(300),
  theme: z.enum(["mineral", "architectural", "electric"]),
  technologies: z.array(short).min(1).max(12),
  challenge: prose,
  approach: prose,
  outcome: prose,
  scope: z.array(short).min(1).max(10),
  concept: z.boolean(),
  published: z.boolean(),
});
export const serviceSchema = z.object({
  title: short,
  subtitle: short,
  description: prose,
  deliverables: z.array(short).min(1).max(12),
});
export const contentSchema = z.object({
  projects: z
    .array(projectSchema)
    .max(30)
    .refine(
      (p) => new Set(p.map((x) => x.slug)).size === p.length,
      "Project slugs must be unique",
    ),
  services: z.array(serviceSchema).min(1).max(12),
  testimonials: z
    .array(z.object({ quote: prose, name: short, role: short }))
    .max(20),
  team: z.array(z.object({ name: short, role: short, bio: prose })).max(20),
  seo: z.object({
    title: short,
    description: z.string().trim().min(40).max(320),
  }),
  contact: z.object({
    email: z.union([z.email(), z.literal("")]),
    location: short,
  }),
});
export type SiteContent = z.infer<typeof contentSchema>;
export type Project = z.infer<typeof projectSchema>;
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email.").max(254),
  service: z.enum([
    "Website design & development",
    "E-commerce",
    "Web application",
    "Website redesign",
    "Not sure yet",
  ]),
  budget: z.enum([
    "Under $3,000",
    "$3,000–$10,000",
    "$10,000–$25,000",
    "$25,000+",
    "Let’s discuss",
  ]),
  timeline: z.enum([
    "As soon as possible",
    "1–3 months",
    "3–6 months",
    "Exploring",
  ]),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters).")
    .max(5000),
  consent: z.literal(true, {
    error: "Please agree so we can respond to your enquiry.",
  }),
  company: z.string().max(200).default(""),
  requestId: z.uuid(),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type Enquiry = Omit<EnquiryInput, "company" | "consent"> & {
  id: string;
  createdAt: string;
  status: "new" | "contacted" | "archived";
};
