export const WHATSAPP_NUMBER = "917006903188";

/** wa.me link; `text` pre-fills the chat. */
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
