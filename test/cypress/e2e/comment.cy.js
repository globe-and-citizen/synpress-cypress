/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
// Use `cy.dataCy` custom command for more robust tests

describe("Commenting", async () => {
  const rand = Math.floor(Math.random() * 1_000);
  let comment = "Comment " + rand;
  let reply = "Reply " + rand;

  it("Comment CRUD : Create, like dislike ...", () => {
    cy.viewport("iphone-x");
    cy.loginToProfile();
    // Visits the prompt of the month
    cy.visit("/month");

    // Programmatically change the q-tab-panel to the comments section
    cy.get('[data-test="comments-tab"]').click();

    // Wait all comments to be loaded
    cy.get('[data-test="comment-loaded"]').click();

    // navigate to the comment input form.
    cy.get('[data-test="comment-main-box"]').type(comment + "{enter}");

    //Check the form is submitted successfully
    cy.get(".q-notification__message").contains(
      "Comment successfully submitted"
    );

    // Like Comment
    cy.get('[data-test="like' + comment + '"]').click();

    // dislike comment
    cy.get('[data-test="dislike' + comment + '"]').click();

    // expand the add reply form
    cy.wait(3000);
    cy.get('[data-test="' + comment + '-add-reply"]').click();

    // fill add reply form input
    cy.get('[data-test="fill-add-reply"]').type(reply);

    // submit filled add reply form
    cy.get('[data-test="submit-fill-add-reply"]').click();

    //Check the form is submitted successfully
    cy.get(".q-notification__message").contains("Reply successfully submitted");

    cy.wait(3000);
    // Editing reply text
    cy.scrollTo("bottom");
    // Editing reply
    cy.wait(3000);
    cy.get('[data-test="' + reply + '-option-button"]').click();

    cy.get('[data-test="comment-select-edit"]').click();
    const oldReply = reply;
    reply = "Reply EDITED" + rand;

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="' + oldReply + '-comment-edit"]')
      .clear()
      .type(reply);

    cy.get('[data-test="submit-edited-comment"]').click();
    cy.get(".q-notification__message").contains("Comment successfully edited!");
    cy.wait(3000);

    // deleting comment
    cy.get('[data-test="' + reply + '-option-button"]').click();

    cy.get('[data-test="comment-select-delete"]').click();
    cy.get(".q-notification__message").contains("Comment successfully deleted");

    // Editing comment
    cy.get('[data-test="' + comment + '-option-button"]').click();

    cy.get('[data-test="comment-select-edit"]').click();
    const oldComment = comment;
    comment = "Comment EDITED" + rand;

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="' + oldComment + '-comment-edit"]')
      .clear()
      .type(comment);

    cy.get('[data-test="submit-edited-comment"]').click();
    cy.get(".q-notification__message").contains("Comment successfully edited!");
    cy.wait(3000);
    // deleting comment
    cy.get('[data-test="' + comment + '-option-button"]').click();

    cy.get('[data-test="comment-select-delete"]').click();
    cy.get(".q-notification__message").contains("Comment successfully deleted");
  });
});
