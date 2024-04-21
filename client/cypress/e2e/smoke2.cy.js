describe("empty spec", () => {
    it("can view the sign up page", () => {
      cy.visit("/signup");
      cy.contains("Already have an account? Login");
      cy.contains("Register a New Account");
    });
  });
  