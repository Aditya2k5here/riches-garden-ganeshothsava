/**
 * Builds the Riches Garden Ganeshothsava 2026 stage events registration form.
 *
 * Run `build()` from the Apps Script editor. It clears every existing item
 * first, so re-running rebuilds cleanly rather than duplicating.
 *
 * Kept in the repository so the form is reproducible: if it is ever deleted,
 * or has to be rebuilt for 2027, this is the source of truth.
 *
 * ---------------------------------------------------------------------------
 * ONE THING WORTH KNOWING ABOUT THE AGE BRANCH
 *
 * Google Forms can only branch on a multiple-choice or dropdown answer —
 * never on a number. The obvious reading of "ask for age, then branch on
 * whether it is under 24" is therefore not directly buildable, and the usual
 * workaround is to ask a second question ("are you 24 or over?"), which is
 * the kind of duplicate question that makes forms feel bureaucratic.
 *
 * Instead the age question *is* the dropdown: every age from 2 to 70 is a
 * choice, and each one carries its own page navigation. The committee still
 * gets an exact age, the parent still answers once, and nobody is asked the
 * same thing twice. On a phone it opens as a native picker, which is faster
 * to answer than typing anyway.
 * ---------------------------------------------------------------------------
 */

var FORM_ID = "1pihsV8OTcloNs_WG-tMydpMQc7d3e-D0rNYR4kwUDVM";

var ADULT_AGE = 24;
var MIN_AGE = 2;
var MAX_AGE = 70;

var CATEGORIES = ["Singing", "Dancing", "Bharatanatyam", "Instrumental Music"];
var DURATIONS = ["2–3 minutes", "3–5 minutes", "5–7 minutes"];

var CONTACT = "Srinivas V — 7259816679";

function build() {
  var form = FormApp.openById(FORM_ID);

  form.setTitle("Riches Garden Ganeshothsava 2026 — Stage Events Registration");
  form.setDescription(
    "18 · 19 · 20 September 2026\n" +
      "Riches Garden, Ramamurthy Nagar, Bengaluru\n\n" +
      "Open to everyone in Riches Garden, individually or as a group.\n" +
      "Registration closes two days before the event.\n\n" +
      "Questions: " +
      CONTACT,
  );

  clearForm(form);

  form.setCollectEmail(false);
  form.setProgressBar(true);
  form.setAllowResponseEdits(false);
  form.setConfirmationMessage(
    "Registration received — thank you.\n\n" +
      "The committee will confirm your slot and publish the performance " +
      "order after registrations close.\n\n" +
      CONTACT,
  );

  /* --- Section 1: participant ------------------------------------------- */

  form.addTextItem().setTitle("Full Name").setRequired(true);

  var age = form
    .addListItem()
    .setTitle("Age")
    .setHelpText("Select the participant's age.")
    .setRequired(true);

  /* --- Under 24: parent or guardian ------------------------------------- */

  var pGuardian = form
    .addPageBreakItem()
    .setTitle("Parent or Guardian");

  form.addTextItem().setTitle("Father / Guardian Name").setRequired(true);
  phone(form, "Father / Guardian Contact Number");

  /* --- 24 and over: their own number ------------------------------------ */

  var pSelf = form.addPageBreakItem().setTitle("Contact");
  phone(form, "Contact Number");

  /* --- Section 2: registration type ------------------------------------- */

  var pType = form.addPageBreakItem().setTitle("Registration Type");
  var type = form
    .addMultipleChoiceItem()
    .setTitle("Registration Type")
    .setRequired(true);

  /* --- Individual -------------------------------------------------------- */

  var pIndividual = form.addPageBreakItem().setTitle("Individual");
  category(form);

  /* --- Group ------------------------------------------------------------- */

  var pGroup = form.addPageBreakItem().setTitle("Group");
  form.addTextItem().setTitle("Group Name").setRequired(true);
  form.addTextItem().setTitle("Group Leader Name").setRequired(true);

  var leaderAge = form
    .addListItem()
    .setTitle("Group Leader Age")
    .setRequired(true);

  var pLeaderGuardian = form
    .addPageBreakItem()
    .setTitle("Group Leader's Parent or Guardian");
  form.addTextItem().setTitle("Father / Guardian Name").setRequired(true);
  phone(form, "Father / Guardian Contact Number");

  var pLeaderSelf = form.addPageBreakItem().setTitle("Group Leader Contact");
  phone(form, "Contact Number");

  var pGroupRest = form.addPageBreakItem().setTitle("Group Details");
  form
    .addParagraphTextItem()
    .setTitle("Names of Other Participants")
    .setHelpText("One per line.")
    .setRequired(true);
  category(form);

  /* --- Section 3: performance ------------------------------------------- */

  var pPerformance = form.addPageBreakItem().setTitle("Performance Details");

  form
    .addTextItem()
    .setTitle("Performance / Song Name")
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Preferred Performance Duration")
    .setRequired(true)
    .setChoiceValues(DURATIONS);

  /*
   * The audio upload is added by hand in the Forms UI, not here.
   * FormApp has no addFileUploadItem() — file upload questions can only be
   * created through the interface, and the API can read them but not make
   * them. It is the last question on the Performance Details page.
   *
   * Worth knowing: Google requires respondents to be signed in to a Google
   * account before they can upload anything. Making the track compulsory
   * therefore also makes a Google sign-in compulsory, which will stop some
   * parents. If that turns out to be a problem, make it optional and let
   * people send the track to the cultural activities number instead.
   */

  /* --- wiring ------------------------------------------------------------
     Done last, because a choice can only navigate to a page that already
     exists. Pages the participant does not need are skipped over rather
     than shown and left blank. */

  age.setChoices(ages(age, pGuardian, pSelf));
  leaderAge.setChoices(ages(leaderAge, pLeaderGuardian, pLeaderSelf));

  pGuardian.setGoToPage(pType);
  pSelf.setGoToPage(pType);

  type.setChoices([
    type.createChoice("Individual", pIndividual),
    type.createChoice("Group", pGroup),
  ]);

  pIndividual.setGoToPage(pPerformance);
  pLeaderGuardian.setGoToPage(pGroupRest);
  pGroupRest.setGoToPage(pPerformance);

  Logger.log("FORM URL: " + form.getPublishedUrl());
  Logger.log("EDIT URL: " + form.getEditUrl());
}

/**
 * Empties the form.
 *
 * Navigation has to come off first. While any choice still points at a page,
 * deleting that page makes Forms reject the entire update with a flat
 * "Invalid data updating form" — it will not tell you which item is holding
 * the reference, so the order here matters.
 */
function clearForm(form) {
  var items = form.getItems();

  for (var i = 0; i < items.length; i++) {
    var type = items[i].getType();

    if (type === FormApp.ItemType.PAGE_BREAK) {
      items[i]
        .asPageBreakItem()
        .setGoToPage(FormApp.PageNavigationType.CONTINUE);
    } else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      var mc = items[i].asMultipleChoiceItem();
      mc.setChoiceValues(plainValues(mc.getChoices()));
    } else if (type === FormApp.ItemType.LIST) {
      var list = items[i].asListItem();
      list.setChoiceValues(plainValues(list.getChoices()));
    }
  }

  for (var j = form.getItems().length - 1; j >= 0; j--) {
    form.deleteItem(j);
  }
}

function plainValues(choices) {
  var values = [];
  for (var i = 0; i < choices.length; i++) values.push(choices[i].getValue());
  return values;
}

/** Every age is its own choice, so the age answer can drive the branch. */
function ages(item, underPage, overPage) {
  var choices = [];
  for (var a = MIN_AGE; a <= MAX_AGE; a++) {
    choices.push(
      item.createChoice(String(a), a < ADULT_AGE ? underPage : overPage),
    );
  }
  return choices;
}

function phone(form, title) {
  form
    .addTextItem()
    .setTitle(title)
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation()
        .requireTextMatchesPattern("[0-9+\\s-]{10,15}")
        .setHelpText("Enter a valid phone number.")
        .build(),
    );
}

function category(form) {
  form
    .addListItem()
    .setTitle("Performance Category")
    .setRequired(true)
    .setChoiceValues(CATEGORIES);
}

/* ===========================================================================
   RESPONSE SHEET AND REGISTRATION NUMBERS

   `setUpSheet()` creates the response spreadsheet, links it, and installs a
   trigger that stamps every submission with RG26-0001, RG26-0002, and so on.

   The number is generated on the committee's side rather than asked for,
   and lands in the first column of the sheet where it is the first thing
   anyone reads. Google Forms cannot print a generated value on its own
   confirmation screen, so the number is the committee's reference for
   talking to a family — which is what it is for.
   =========================================================================== */

function setUpSheet() {
  var form = FormApp.openById(FORM_ID);

  if (!form.getDestinationId()) {
    var sheet = SpreadsheetApp.create(
      "Riches Garden 2026 — Stage Events Registrations",
    );
    form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  }

  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "onFormSubmit") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create();

  Logger.log(
    "SHEET URL: " +
      SpreadsheetApp.openById(form.getDestinationId()).getUrl(),
  );
}

function onFormSubmit() {
  var id = FormApp.openById(FORM_ID).getDestinationId();
  if (!id) return;

  var sheet = SpreadsheetApp.openById(id).getSheets()[0];

  // Registration number lives in column A, ahead of the timestamp.
  if (sheet.getRange(1, 1).getValue() !== "Registration Number") {
    sheet.insertColumnBefore(1);
    sheet.getRange(1, 1).setValue("Registration Number");
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight("bold");
  }

  var row = sheet.getLastRow();
  if (row < 2) return;

  var pad = String(row - 1);
  while (pad.length < 4) pad = "0" + pad;
  sheet.getRange(row, 1).setValue("RG26-" + pad);
  sheet.autoResizeColumn(1);
}
