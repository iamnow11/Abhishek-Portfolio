import { initContactForm } from "../../utils/contactFormClient";

const configElement = document.getElementById("contactConfig");
const formElement = document.getElementById("contactForm") as HTMLFormElement | null;
const notificationElement = document.getElementById("notification");

if (configElement && formElement) {
  initContactForm(formElement, notificationElement, {
    serviceId: configElement.dataset.serviceId ?? null,
    publicKey: configElement.dataset.publicKey ?? null,
    ownerTemplateId: configElement.dataset.ownerTemplateId ?? null,
    userTemplateId: configElement.dataset.userTemplateId ?? null,
    toEmail: configElement.dataset.toEmail ?? "iamshah119@gmail.com",
  });
}
