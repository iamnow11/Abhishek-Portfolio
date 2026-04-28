/// <reference lib="es2015" />

const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";
const NOTIFICATION_DISPLAY_DURATION_MS = 4000;

export type ContactFormConfig = {
  serviceId: string | null;
  publicKey: string | null;
  ownerTemplateId: string | null;
  userTemplateId: string | null;
  toEmail: string;
};

type NotificationType = "success" | "error";

type EmailPayload = {
  name: string;
  email: string;
  message: string;
};

function showNotification(notificationElement: HTMLElement | null, message: string, type: NotificationType): void {
  if (!notificationElement) return;

  notificationElement.textContent = message;
  notificationElement.className = `notification notification-${type}`;
  notificationElement.style.display = "block";

  setTimeout(() => {
    notificationElement.style.display = "none";
  }, NOTIFICATION_DISPLAY_DURATION_MS);
}

function setSubmitting(form: HTMLFormElement, isSubmitting: boolean): void {
  const submitButton = form.querySelector<HTMLButtonElement>(".submit-button");
  const buttonLabel = submitButton?.querySelector<HTMLSpanElement>(".button-text");
  if (!submitButton) return;

  submitButton.disabled = isSubmitting;
  if (buttonLabel) {
    buttonLabel.textContent = isSubmitting ? "sending..." : "send message";
  }
}

async function sendEmail(
  payload: EmailPayload,
  config: ContactFormConfig
): Promise<void> {
  const { serviceId, publicKey, ownerTemplateId, userTemplateId, toEmail } = config;
  if (!serviceId || !publicKey) {
    throw new Error("Email service is not configured yet.");
  }

  const basePayload = {
    service_id: serviceId,
    user_id: publicKey,
  };

  const emailRequests: Promise<Response>[] = [];

  if (ownerTemplateId) {
    emailRequests.push(
      fetch(EMAILJS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basePayload,
          template_id: ownerTemplateId,
          template_params: {
            from_name: payload.name,
            reply_to: payload.email,
            message: payload.message,
            email: toEmail,
            to_email: toEmail,
            user_email: payload.email,
          },
        }),
      })
    );
  }

  if (userTemplateId) {
    emailRequests.push(
      fetch(EMAILJS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basePayload,
          template_id: userTemplateId,
          template_params: {
            from_name: "Abhishek",
            reply_to: toEmail,
            message: payload.message,
            email: payload.email,
            to_email: payload.email,
          },
        }),
      })
    );
  }

  if (!emailRequests.length) {
    throw new Error("No EmailJS templates configured.");
  }

  const responses = await Promise.all(emailRequests);
  const failedResponse = responses.find((response) => !response.ok);
  if (failedResponse) {
    const errorText = await failedResponse.text();
    throw new Error(errorText || "EmailJS send failed");
  }
}

export function initContactForm(
  form: HTMLFormElement | null,
  notificationElement: HTMLElement | null,
  config: ContactFormConfig
): void {
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!config.serviceId || !config.publicKey) {
      showNotification(
        notificationElement,
        "Email service is not configured yet. Please add PUBLIC_EMAILJS_SERVICE_ID and PUBLIC_EMAILJS_PUBLIC_KEY.",
        "error"
      );
      return;
    }

    setSubmitting(form, true);

    const formData = new FormData(form);
    const name = (formData.get("name")?.toString() || "").trim();
    const email = (formData.get("email")?.toString() || "").trim();
    const message = (formData.get("message")?.toString() || "").trim();

    if (!name || !email || !message) {
      showNotification(notificationElement, "Please fill in all fields before sending.", "error");
      setSubmitting(form, false);
      return;
    }

    try {
      await sendEmail({ name, email, message }, config);
      showNotification(notificationElement, "Message sent successfully! I'll get back to you soon.", "success");
      form.reset();
    } catch (error) {
      console.error("Email send failed", error);
      showNotification(
        notificationElement,
        "Could not send your message. Please try again or email me directly.",
        "error"
      );
    } finally {
      setSubmitting(form, false);
    }
  });
}
