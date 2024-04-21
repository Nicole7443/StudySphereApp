describe('empty spec', () => {
  it ('can view the login page', () => {
    cy.visit('/login')
    cy.contains('Login')
    cy.contains("Don't have an account? Sign Up")
  })
})