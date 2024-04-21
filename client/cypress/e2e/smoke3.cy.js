describe("notes page", () => {
    it("shouldnt allow the users to view any groups since they are not signed in", () => {
      cy.visit("/notes");
      cy.contains("Dashboard");
      cy.contains("Login");
      cy.contains("Don't have an account? Sign Up");
    });
  });
  