// src/mockServer.ts
import { createServer, Response } from "miragejs";

export function makeServer() {
  return createServer({
    routes() {
      this.namespace = "/api";

      /* -------------------- LOGIN -------------------- */
      this.post("/auth/login", (_schema, request) => {
        const { email, password } = JSON.parse(request.requestBody) as {
          email: string;
          password: string;
        };

        // --- Admin Login ---
        if (email === "admin@medicare.com" && password === "admin123") {
          return {
            user: { id: 1, email, role: "admin" },
            token: "mock-jwt-admin",
          };
        }

        // --- Patient Login Example (optional) ---
        if (email === "patient@test.com" && password === "patient123") {
          return {
            user: { id: 2, email, role: "patient" },
            token: "mock-jwt-patient",
          };
        }

        return new Response(
          401,
          { "Content-Type": "application/json" },
          { message: "Invalid email or password" }
        );
      });

      /* -------------------- REGISTER -------------------- */
      this.post("/auth/register", (_schema, request) => {
        const data = JSON.parse(request.requestBody) as {
          email: string;
          password: string;
          firstName: string;
        };

        return {
          user: {
            id: Math.floor(Math.random() * 1000),
            email: data.email,
            role: "patient",
          },
          token: "mock-jwt-patient",
        };
      });
    },
  });
}
